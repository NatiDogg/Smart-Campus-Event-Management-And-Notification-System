import admin from 'firebase-admin'
import { env } from "../utils/zodEnvFilesValidator.js";

const serviceAccount = JSON.parse(env.FCM_SERVICE_ACCOUNT_KEY)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export default admin;