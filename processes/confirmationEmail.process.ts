import { Job } from "bull";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import process from "process";

const sendConfirmationEmail = async (job: Job) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  job.progress(50);
  job.log(`Attempting to authenticate as ${process.env.SMTP_USER}...`);

  const filePath =
    process.env.NODE_ENV === "PRODUCTION"
      ? path.join(__dirname, "../../assets/confirmationEmail.html")
      : path.join(__dirname, "../assets/confirmationEmail.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);

  const replacements = {
    firstName: job.data.firstName
  };

  const html = template(replacements);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: job.data.email,
    subject: `💡 Thanks for your interest, ${job.data.firstName}!`,
    html
  };

  job.log("Sending email...");

  transporter
    .sendMail(mailOptions)
    .then(() => {
      job.progress(100);
      job.log("Email sent.");
    })
    .catch((err) => {
      job.log("Failed to send email.");
      job.moveToFailed(err, true);
    });
};

export default sendConfirmationEmail;
