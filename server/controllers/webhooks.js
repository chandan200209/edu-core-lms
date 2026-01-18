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
    try {
        // 1️⃣ Detect frontend request to create checkout session
        const { userId, courseId } = req.body;

        if (userId && courseId) {
            // --- Create Stripe Checkout Session ---
            const course = await Course.findById(courseId);
            if (!course) return res.status(404).json({ error: "Course not found" });

            // Create purchase record
            const purchase = await Purchase.create({
                courseId: course._id,
                userId,
                amount: course.coursePrice,
                status: "pending"
            });

            const YOUR_DOMAIN = process.env.FRONTEND_DOMAIN || "http://localhost:5173";

            const session = await stripeInstance.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: { name: course.courseTitle },
                            unit_amount: course.coursePrice * 100
                        },
                        quantity: 1
                    }
                ],
                mode: "payment",
                success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${YOUR_DOMAIN}/cancel`,
                metadata: {
                    purchaseId: purchase._id.toString() // ✅ Needed for webhook
                }
            });

            return res.json({ url: session.url });
        }

        // 2️⃣ Otherwise, handle Stripe webhook
        const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error("⚠️ Stripe webhook verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;

                // Get checkout session to access purchaseId
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });

                if (!sessions.data.length || !sessions.data[0]?.metadata?.purchaseId) {
                    console.error("❌ purchaseId missing in session metadata");
                    return res.status(400).json({ error: "purchaseId missing" });
                }

                const purchaseId = sessions.data[0].metadata.purchaseId;
                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) return res.status(404).json({ error: "Purchase not found" });

                // Update Course and User arrays
                await Course.findByIdAndUpdate(
                    purchaseData.courseId,
                    { $addToSet: { enrolledStudents: purchaseData.userId } }
                );

                await User.findByIdAndUpdate(
                    purchaseData.userId,
                    { $addToSet: { enrolledCourses: purchaseData.courseId } }
                );

                // Mark purchase completed
                purchaseData.status = "completed";
                await purchaseData.save();

                console.log(`✅ User ${purchaseData.userId} enrolled in course ${purchaseData.courseId}. Purchase completed.`);

                return res.status(200).json({ received: true });
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;

                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id
                });

                if (sessions.data[0]?.metadata?.purchaseId) {
                    const purchaseId = sessions.data[0].metadata.purchaseId;
                    await Purchase.findByIdAndUpdate(purchaseId, { status: "failed" });
                    console.log(`⚠️ Payment failed. Purchase ${purchaseId} marked as failed.`);
                }

                return res.status(200).json({ received: true });
            }

            default:
                console.log(`ℹ️ Unhandled Stripe event type: ${event.type}`);
                return res.status(200).json({ received: true });
        }
    } catch (err) {
        console.error("❌ stripeWebhooks error:", err.message);
        return res.status(500).send("Internal Server Error");
    }
};



