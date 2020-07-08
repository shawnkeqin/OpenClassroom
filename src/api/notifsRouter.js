var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");

// create reusable transporter object
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

router.post("/new-request", async (req, res) => {
  const { recipientEmail, emailSubject, visitor } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: emailSubject,
      // text: 
      html: `<p>${visitor} made a visit request to your class.</p>`
    });
    console.log("Message sent: %s", info.messageId)
    return res.json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Error"
    });
  }
});

router.post("/request-accepted", async (req, res) => {
  const { recipientEmail, emailSubject, instructor } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: emailSubject,
      // text: emailText
      html: `<p>${instructor} has accepted your visit request.</p>`,
    });
    console.log("Message sent: %s", info.messageId)
    return res.json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Error"
    });
  }
});

module.exports = router;
