import * as Sib from 'sib-api-v3-sdk'
import { getResetHtmlTemplate, getVerifyAccountHtmlTemplate } from './html-template'
const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.TWILO_MAIL

const tranEmailApi = new Sib.TransactionalEmailsApi()

const sender = {
  email: 'dpi.binarycoders@gmail.com',
  name: 'Binary Coders',
}

export const sendMail = async (to, subject, token, reset) => {
  try {
    await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email: `${to}` }],
      subject: `${subject}`,
      htmlContent: reset
        ? getResetHtmlTemplate(to, token)
        : getVerifyAccountHtmlTemplate(to, token),
    })
    return {
      status: 201,
    }
  } catch (error) {
    throw new Error('Something unexpected went wrong.')
  }
}
