import sendGridMail from '@sendgrid/mail'
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY as string)

interface ActivationMailProps {
  to: string
  subject: string
  token: string
}

export const sendAccountVerifiedEmail = async ({ to, subject, token }: ActivationMailProps) => {
  const message = {
    to: to,
    from: process.env.EMAIL_SENDER || 'md.rakib10122003@gmail.com',
    subject,
    text: token,
    html: `<div style="padding: 20px; border: 1px solid #f0f0f0; ">
      <h1 style="margin: 0;margin-bottom: 30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight: 300;line-height: 1.5;font-size: 24px;color: #294661!important;">Let's verify your account so you can start using Binary Coders.</h1><p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300"><strong><a href=${`mailto:${to}`} target="_blank">${to}</a></strong></p><a style="box-sizing: border-box;border-color: #348eda;font-weight: 400;text-decoration: none;display: inline-block;margin: 0;color: #ffffff;background-color: #348eda;border: solid 1px #348eda;border-radius: 2px;font-size: 14px;padding: 12px 45px;" href=${`binary-coders.vercel.app/reset?${token}`} target="_blank">Verify Account</a><p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">&nbsp;<br>
									Your link is active for 24 hours. After that, you will need to resend the verification email.  </p><p style="margin:0;margin-bottom:30px;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Thank you,<br>
									The Binary Coders Team</p></div>`,
  }
  const response = await sendGridMail.send(message)
  return response
}
