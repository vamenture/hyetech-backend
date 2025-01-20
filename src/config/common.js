import nodemailer from 'nodemailer'
import bcrypt from "bcrypt";



const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: 'digitalwawes@gmail.com',
        pass: 'itgvitwlqvrizcgk'
    }
});

// Define a function to send an email
export async function sendEmail(to, subject, html) {
  console.log("email : ",to)
    try {
      const info = await transporter.sendMail({
        from : '"InfoNGO" <infongo99@gmail.com>',
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }


//hash a function
export const hashedPassword = async (password) => {
  console.log("password : ",password)
  return await bcrypt.hash( password, 10);
}

export const checkPassword = async (password,dbPassword) => {
  return await bcrypt.compare( password, dbPassword);
}


export const generateOtpandexpirationTime = () =>{
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    return {otp, expirationTime}
}


