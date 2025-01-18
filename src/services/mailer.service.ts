import { transporter } from "../config/mailer.config";



export const sendVerificationEmail = async (email: string, subject: string, code: number,name:string) => {
    await sendEmail(email, subject, undefined, EmailVerificationCodeTemplate(code,name,email));
}

export const sendEmailNotification = async (email: string, subject: string, message: string) => {
    await sendEmail(email, subject, undefined, EmailNotificationTemplate(message));
}

export const sendPasswordResetEmail = async (email: string, code: number,name:string) => {
    await sendEmail(email, 'Password Reset', undefined, EmailResetPasswordTemplate(code,name,email));
}

const sendEmail = async (email: string, subject: string, text?: string, html?: string) => {
    try {
        transporter.sendMail({
            from: 'contact@mobtwin.com',
            to: email,
            subject,
            text,
            html
        })
    } catch (error: any) {
        console.error('🚨 error while sending email ' + error.message);
        throw new Error('error while sending email');
    }
}

const EmailVerificationCodeTemplate = (otp: number,name:string,email:string) => `
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<style type="text/css">
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');
* {
  font-family: "Quicksand", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
</style>
<div dir="auto">
  <div>
    <div class="gmail_quote">
      <br type="attribution">
      <blockquote class="quote" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex">
        <div dir="ltr">
          <u></u>
          <div style="margin:0;padding:50px 20px;background-color:rgb( 0 , 0 , 0 , 0.020 ) !important;max-width:600px;margin:0 auto">
            <table style="table-layout:fixed;padding:20px 0;width:100%;margin:0 auto" cellspacing="0" cellpadding="0" border="0">
              <tbody>
                <tr>
                  <td>
                    <table width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tbody>
                        <tr>
                          <td style="line-height:1px;min-width:600px" height="0">
                            <img src="https://esputnik.com/repository/applications/images/blank.gif" style="display:block;max-height:0px;min-height:0px;min-width:600px;width:600px" alt="" width="600" height="1">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="width:80px" align="left">
                    <a href="https://mobtwin.com/">
                      <img alt="Mobtwin Inc" src="data:image/webp;base64,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" width="50" border="0">
                    </a>
                  </td>
                  <td style="font-size:20px;" align="right">
                    <span style="font-weight:600 !important;">
                      Mobtwin Verification Code
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="border-radius:5px;padding:30px;background:#ffffff;margin:0 auto">
              <table style="table-layout:fixed;margin-top:0px" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                  <tr>
                    <td width="100" align="center">
                      <img src="https://mobtwin-bucket.fra1.cdn.digitaloceanspaces.com/assets/images/badgemt.png" alt="" style="width:100%;margin:0 auto">
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="table-layout:fixed;" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                  <tr>
                    <td width="100">
                      <p style="line-height:30px">Hi ${name}, </p>
                      <p style="line-height:30px">Thank you for signing up on Mobtwin To complete your registration, please enter the One-Time Password (OTP) below:</p>
                      <p style="font-size: 30px; font-weight: bold; color: #333;width:100%;display:flex;justify-content: center;">${otp}</p>
                      <p style="line-height:30px">This OTP is valid for the next 15 minutes. Please do not share it with anyone for your security. If you didn’t request this from <a style="color:#ff4455">${email}</a>, you can safely ignore this message.</p>
                      <p style="line-height:30px;">
                        Welcome aboard!
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <table style="table-layout:fixed;padding:30px 0;width:100%;margin:0 auto" cellspacing="0" cellpadding="0" border="0">
              <tbody>
                <tr>
                  <td align="center">
                    <img src="https://goootek.com/wp-content/uploads/2020/02/j.png" alt="" style="width:100px;height:auto;margin:0 auto">
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin-top:0px">This email can't receive replies.</p>
                    <p>© 2025 AI Wolves. Dublin, Ireland GT 19060</p>
                    <p>Mobtwin Team</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </blockquote>
    </div>
    <br>
  </div>
</div>`
const EmailResetPasswordTemplate = (otp: number,name:string,email:string) => `
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<style type="text/css">
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');
* {
  font-family: "Quicksand", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
</style>
<div dir="auto">
  <div>
    <div class="gmail_quote">
      <br type="attribution">
      <blockquote class="quote" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex">
        <div dir="ltr">
          <u></u>
          <div style="margin:0;padding:50px 20px;background-color:rgb( 0 , 0 , 0 , 0.020 ) !important;max-width:600px;margin:0 auto">
            <table style="table-layout:fixed;padding:20px 0;width:100%;margin:0 auto" cellspacing="0" cellpadding="0" border="0">
              <tbody>
                <tr>
                  <td>
                    <table width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tbody>
                        <tr>
                          <td style="line-height:1px;min-width:600px" height="0">
                            <img src="https://esputnik.com/repository/applications/images/blank.gif" style="display:block;max-height:0px;min-height:0px;min-width:600px;width:600px" alt="" width="600" height="1">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="width:80px" align="left">
                    <a href="https://mobtwin.com/">
                      <img alt="Mobtwin Inc" src="data:image/webp;base64,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" width="50" border="0">
                    </a>
                  </td>
                  <td style="font-size:20px;" align="right">
                    <span style="font-weight:600 !important;">
                      Mobtwin Reset Password
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="border-radius:5px;padding:30px;background:#ffffff;margin:0 auto">
              <table style="table-layout:fixed;margin-top:0px" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                  <tr>
                    <td width="100" align="center">
                      <img src="https://mobtwin-bucket.fra1.cdn.digitaloceanspaces.com/assets/images/badgemt.png" alt="" style="width:100%;margin:0 auto">
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="table-layout:fixed;" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tbody>
                  <tr>
                    <td width="100">
                      <p style="line-height:30px">Hi ${name}, </p>
                      <p style="line-height:30px">Thank you for signing up on Mobtwin To complete your registration, please enter the One-Time Password (OTP) below:</p>
                      <p style="font-size: 30px; font-weight: bold; color: #333;width:100%;display:flex;justify-content: center;">${otp}</p>
                      <p style="line-height:30px">This OTP is valid for the next 15 minutes. Please do not share it with anyone for your security. If you didn’t request this from <a style="color:#ff4455">${email}</a>, you can safely ignore this message.</p>
                      <p style="line-height:30px;">
                        Welcome aboard!
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <table style="table-layout:fixed;padding:30px 0;width:100%;margin:0 auto" cellspacing="0" cellpadding="0" border="0">
              <tbody>
                <tr>
                  <td align="center">
                    <img src="https://goootek.com/wp-content/uploads/2020/02/j.png" alt="" style="width:100px;height:auto;margin:0 auto">
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin-top:0px">This email can't receive replies.</p>
                    <p>© 2025 AI Wolves. Dublin, Ireland GT 19060</p>
                    <p>Mobtwin Team</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </blockquote>
    </div>
    <br>
  </div>
</div>
`
const EmailNotificationTemplate = (message: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .logo {
            display: block;
            margin: 0 auto;
            width: 150px;
            height: auto;
        }
        .content {
            padding: 20px;
        }
        p {
            line-height: 1.5;
        }
        .code {
            font-weight: bold;
            font-size: 18px;
            background-color: #eee;
            padding: 5px 10px;
            border-radius: 3px;
            display: inline-block;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 0.8em;
            color: #aaa;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
        <a href="https://mobtwintest.com">
            <img src="https://yt3.googleusercontent.com/iKXHVtR-fLwbz17z4ikGr5nUG37KhCHMqBsqMm8y5K3fvqFqhkMS_7lN61frBDAU3k2qnqWu=s900-c-k-c0x00ffffff-no-rj" alt="mobtwin Logo" class="logo">
        </a>
        </div>
        <div class="content">
        <p>Thank you for using our service!</p>
        <p>${message}</p>
        </div>
        <div class="footer">
        <p>If you have any problems, please don't hesitate to contact us at dev.mobtwin@gmail.com.</p>
        <p>Sincerely,</p>
        <p>Mobtwin Team</p>
        </div>
    </div>
    </body>
    </html>`

const EmailChangedNotificationTemplate = (oldEmail: string, newEmail: string) => `
    <style>
    body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    color: #333;
    background-color: #f7f7f7;
    }
    h1, h2, p {
    margin: 15px 0;
    }
    .container {
    padding: 20px;
    max-width: 600px;
    margin: 20px auto;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .info-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    }
    .info-section span {
    font-weight: bold;
    color: #555;
    }
    .info-section span:last-child {
    color: #333;
    }
    .btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    }
    .btn:hover {
    background-color: #0056b3;
    }
    </style>
    <div class="container">
    <h1>Important Update: Your Email Address for Mobtwin Has Been Changed</h1>
    <p>This email is to inform you that the email address associated with your account on Mobtwin has been changed.</p>
    <h2>Here are the details:</h2>
    <div class="info-section">
    <span>Old Email Address:</span>
    <span>[Previous Email Address]</span>
    </div>
    <div class="info-section">
    <span>New Email Address:</span>
    <span>[New Email Address]</span>
    </div>
    <h2>What you need to do:</h2>
    <p>If you initiated this change, you can disregard this email.</p>
    <p>However, if you did not request this change, please contact us immediately at <a href="mailto:support@example.com">support@example.com</a> or <a href="tel:+1234567890">+1234567890</a> to verify your account ownership and secure it.</p>
    <h2>For your security:</h2>
    <p>We take the security of your account very seriously. To ensure the legitimacy of this change, we will monitor your account activity for the next days.</p>
    <h2>Additional Information:</h2>
    <p>You can continue to use Mobtwin with your new email address.</p>
    <p>Any future notifications or updates will be sent to your new email address.</p>
    <p>If you have any questions or concerns, please don't hesitate to <a href="#">contact us</a>.</p>
    <p>Sincerely,<br>Mobtwin Team</p>
    </div>

`

