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
    html: '<a href=`https://google.com/` target="_blank">Open</a>',
  }
  const response = await sendGridMail.send(message)
  return response
}
