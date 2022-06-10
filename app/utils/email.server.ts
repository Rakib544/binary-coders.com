import sendGridMail from '@sendgrid/mail'
import { getResetHtmlTemplate, getVerifyAccountHtmlTemplate } from './html-template'
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY as string)

interface ActivationMailProps {
  to: string
  subject: string
  token: string
  reset: boolean
}

export const sendAEmail = async ({ to, subject, token, reset }: ActivationMailProps) => {
  const message = {
    to: to,
    from: process.env.EMAIL_SENDER || 'md.rakib10122003@gmail.com',
    subject,
    text: token,
    html: reset ? getResetHtmlTemplate(to, token) : getVerifyAccountHtmlTemplate(to, token),
  }
  const response = await sendGridMail.send(message)
  return response
}
