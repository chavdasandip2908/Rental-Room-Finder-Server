require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

connectDB();

app.use("/api/v1/auth", require("./src/routes/authRoutes"));
app.use("/api/v1/users", require("./src/routes/userRoutes"));
app.use("/api/v1/properties", require("./src/routes/propertyRoutes"));
app.use("/api/v1/blogs", require("./src/routes/blogRoutes"));
app.use("/api/v1/contact", require("./src/routes/contactRoutes"));
app.get("/test", (req, res) => res.send("success running test"))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
