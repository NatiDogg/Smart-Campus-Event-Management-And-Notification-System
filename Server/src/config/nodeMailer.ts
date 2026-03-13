import nodemailer from 'nodemailer'
import { env } from '../utils/zodEnvFilesValidator.js';
const emailTransporter = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
    port: 587,
    auth:{
        user:env.SMTP_USER,
        pass: env.SMTP_PASS
        
    }
})

export default emailTransporter;