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
export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
        // case 'payment_intent.succeeded':
        //     {
        //         const paymentIntent = event.data.object;
        //         const paymentIntentId = paymentIntent.id;
        //         const session = await stripeInstance.checkout.sessions.list({
        //             payment_intent: paymentIntentId,
        //         })
        //         const { purchaseId } = session.data[0].metadata;
        //         const purchaseData = await Purchase.findById(purchaseId);
        //         const userData = await User.findById(purchaseData.userId);
        //         const courseData = await Course.findById(purchaseData.courseId.toString());
        //         courseData.enrolledStudents.push(userData);
        //         await courseData.save();
        //         userData.enrolledCourses.push(courseData._id)
        //         await userData.save();
        //         purchaseData.status = 'completed'
        //         await purchaseData.save();
        //         break;
        //     }
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;

            try {
                // 1. You MUST await this network request
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });

                // 2. Check if data exists before accessing it
                if (!sessions.data || sessions.data.length === 0) {
                    console.error("No session found for this payment intent.");
                    return res.status(400).json({ error: "Session not found" });
                }

                const { purchaseId } = sessions.data[0].metadata;

                // 3. Update your Database
                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    return res.status(404).json({ error: "Purchase record not found" });
                }

                // Perform updates
                purchaseData.status = 'completed';
                await purchaseData.save();

                // Update User and Course (ensure IDs are used)
                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId);

                if (userData && courseData) {
                    courseData.enrolledStudents.push(userData._id);
                    userData.enrolledCourses.push(courseData._id);
                    await courseData.save();
                    await userData.save();
                }

                // 4. Send a 200 OK back to Stripe
                res.status(200).json({ received: true });

            } catch (err) {
                console.error("Webhook Error:", err.message);
                // Sending 500 here tells Stripe the server had an issue and to retry later
                res.status(500).send("Internal Server Error");
            }
            break;
        }
        // case 'payment_intent.succeeded': {
        //     const paymentIntent = event.data.object;
        //     const paymentIntentId = paymentIntent.id;

        //     try {
        //         // 1. MUST await this call to get the actual data
        //         const sessions = await stripeInstance.checkout.sessions.list({
        //             payment_intent: paymentIntentId,
        //         });

        //         // 2. Safety check: Ensure the session exists and has metadata
        //         if (!sessions.data.length || !sessions.data[0].metadata) {
        //             console.error("No metadata found for this session.");
        //             break;
        //         }

        //         const { purchaseId } = sessions.data[0].metadata;

        //         // 3. Fetch data from DB
        //         const purchaseData = await Purchase.findById(purchaseId);
        //         if (!purchaseData) throw new Error("Purchase record not found");

        //         const userData = await User.findById(purchaseData.userId);
        //         const courseData = await Course.findById(purchaseData.courseId.toString());

        //         // 4. Update arrays (Push the _id, not the full object)
        //         courseData.enrolledStudents.push(userData._id);
        //         await courseData.save();

        //         userData.enrolledCourses.push(courseData._id);
        //         await userData.save();

        //         // 5. Update and save status
        //         purchaseData.status = 'completed';
        //         await purchaseData.save();

        //         console.log(`Success: Purchase ${purchaseId} is now completed.`);

        //     } catch (err) {
        //         // This will show you EXACTLY what is failing in your logs
        //         console.error("Webhook Logic Error:", err.message);
        //     }
        //     break;
        // }
        case 'payment_intent.payment_failed':
            {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                })
                const { purchaseId } = session.data[0].metadata;
                const purchaseData = await Purchase.findById(purchaseId);
                purchaseData.status = 'failed';
                await purchaseData.save();
                break;
            }
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
}