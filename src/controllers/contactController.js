const Contact = require("../models/Contact");

exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const contactEntry = new Contact({ name, email, message, ...(mobile && { mobile }) });
        await contactEntry.save();

        res.status(201).json({ message: "Your query has been submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
