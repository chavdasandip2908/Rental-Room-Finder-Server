const nodemailer = require("nodemailer");

const sendEmail = async (to,name, subject, resetLink) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Gmail Email
            pass: process.env.EMAIL_PASS, // Gmail App Password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html: `
     <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 30px auto;
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #333;
        text-align: center;
      }
      p {
        color: #666;
        font-size: 14px;
        line-height: 1.5;
      }
      .button {
        display: block;
        width: 100%;
        text-align: center;
        background: #28a745;
        color: white;
        padding: 12px 0;
        border-radius: 5px;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
      }
      .button:hover {
        background: #218838;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p class="footer">© 2024 Rental Room. All rights reserved.</p>
    </div>
  </body>
  </html>
    `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
