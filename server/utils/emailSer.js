const nodemailer = require("nodemailer");

const sendVerificationEmail = async (adminmobileNo, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const verificationLink = `https://alumni-server-alpha.vercel.app/api/v1/admin/verifyEmail/${encodeURIComponent(adminmobileNo)}/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.HOD_EMAIL,
      subject: "Admin Signup Approval Needed",
      text: `An admin has signed up with email: ${adminmobileNo}.  Please verify and approve the signup by clicking on the following link: ${verificationLink}.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Signup approval email sent", info.response);
    return true;

  } catch (error) {
    console.error("Error in sending signup approval email", error);
    return false;
  }
};

module.exports = { sendVerificationEmail };
