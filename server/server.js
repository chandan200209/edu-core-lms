import "dotenv/config"
import express from "express";
import cors from 'cors';
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// initialize express
const app = express()

// connect to database
await connectDB();

// middlewares
app.use(cors()); // used for connecting our backend with other domains

// routes
app.get('/', (req, res) => {
    res.send('API working!')
})
app.post('/clerk', express.json(), clerkWebhooks);

// ports
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})