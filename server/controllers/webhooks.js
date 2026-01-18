import dotenv from 'dotenv';
dotenv.config()
import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

//API controller function to manage User with Clerk database
export const clerkWebhooks = async (req, res) => {
    try {
        // clerk webhooks secret key
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        // verify the errors
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })
        const { data, type } = req.body;
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + ' ' + data.last_name,
                    imageUrl: data.image_url
                }
                await User.create(userData);
                res.json({})
                break;
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + ' ' + data.last_name,
                    imageUrl: data.image_url
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

            default:
                break;
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    // 1️⃣ Verify webhook signature
    try {
        event = Stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("⚠️ Stripe webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 2️⃣ Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;

            try {
                // Retrieve the checkout session associated with this payment
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                if (!sessions.data || sessions.data.length === 0) {
                    console.error("No checkout session found for payment intent:", paymentIntent.id);
                    return res.status(400).json({ error: "Checkout session not found" });
                }

                const session = sessions.data[0];

                // Ensure purchaseId exists in metadata
                if (!session.metadata || !session.metadata.purchaseId) {
                    console.error("Missing purchaseId in session metadata for payment intent:", paymentIntent.id);
                    return res.status(400).json({ error: "Missing purchaseId in session metadata" });
                }

                const purchaseId = session.metadata.purchaseId;

                // Fetch the purchase record
                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    console.error("Purchase record not found for ID:", purchaseId);
                    return res.status(404).json({ error: "Purchase record not found" });
                }

                // Update Course and User arrays
                await Promise.all([
                    // Add user to course.enrolledStudents
                    Course.findByIdAndUpdate(
                        purchaseData.courseId,
                        { $addToSet: { enrolledStudents: purchaseData.userId } },
                        { new: true, upsert: true }
                    ),
                    // Add course to user.enrolledCourses
                    User.findByIdAndUpdate(
                        purchaseData.userId,
                        { $addToSet: { enrolledCourses: purchaseData.courseId } },
                        { new: true, upsert: true }
                    ),
                    // Update purchase status
                    Purchase.findByIdAndUpdate(purchaseId, { status: 'completed' })
                ]);

                console.log(`✅ Payment succeeded. User ${purchaseData.userId} enrolled in course ${purchaseData.courseId}. Purchase marked completed.`);

                return res.status(200).json({ received: true });
            } catch (err) {
                console.error("❌ Webhook processing error:", err.message);
                return res.status(500).send("Internal Server Error");
            }

        case 'payment_intent.payment_failed':
            try {
                const paymentIntentFailed = event.data.object;

                // Retrieve session
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentFailed.id,
                });

                if (sessions.data && sessions.data[0]?.metadata?.purchaseId) {
                    const purchaseId = sessions.data[0].metadata.purchaseId;
                    await Purchase.findByIdAndUpdate(purchaseId, { status: 'failed' });
                    console.log(`⚠️ Payment failed. Purchase ${purchaseId} marked as failed.`);
                }

                return res.status(200).json({ received: true });
            } catch (err) {
                console.error("❌ Error handling failed payment:", err.message);
                return res.status(500).send("Internal Server Error");
            }

        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
            return res.status(200).json({ received: true });
    }
};
