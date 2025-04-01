    require("dotenv").config();
    const express = require("express");
    const cors = require("cors");
    const connectDB = require("./src/config/db");

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(cors({
        origin: 'http://127.0.0.1:5501', // Change this to your frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials:true
    }));

    connectDB();

    app.use("/api/v1/auth", require("./src/routes/authRoutes"));
    app.use("/api/v1/users", require("./src/routes/userRoutes"));
    app.use("/api/v1/properties", require("./src/routes/propertyRoutes"));
    app.use("/api/v1/blogs", require("./src/routes/blogRoutes"));
    app.use("/api/v1/payment",require("./src/routes/paymentRoutes"));
    const PORT =5500;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
