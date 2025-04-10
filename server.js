require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "https://rental-room-finder.onrender.com"
];

app.use(cors({
    // origin: function (origin, callback) {
    //     if (!origin || allowedOrigins.includes(origin)) {
    //         callback(null, true);
    //     } else {
    //         callback(new Error("Not allowed by CORS"));
    //     }
    // },
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

connectDB();

app.use("/api/v1/auth", require("./src/routes/authRoutes"));
app.use("/api/v1/users", require("./src/routes/userRoutes"));
app.use("/api/v1/properties", require("./src/routes/propertyRoutes"));
app.use("/api/v1/blogs", require("./src/routes/blogRoutes"));
app.use("/api/v1/payment", require("./src/routes/paymentRoutes"));
app.get("/test", (req, res) => res.send("success running test"))
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

