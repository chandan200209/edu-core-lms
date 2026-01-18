import dotenv from 'dotenv';
dotenv.config()
import express from "express";
import cors from 'cors';
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoute.js";

// initialize express
const app = express()

// connect to database
await connectDB();
await connectCloudinary();

// middlewares
app.use(cors()); // used for connecting our backend with other domains
app.use(clerkMiddleware()); // will add the auth property to all the requests

// routes
app.get('/', (req, res) => {
    res.send('API working!')
});
app.post('/clerk', express.json(), clerkWebhooks);
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ports
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})