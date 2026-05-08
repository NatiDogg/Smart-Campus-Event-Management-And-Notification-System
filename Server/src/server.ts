import connectToDb from './config/connectDb.js'
import { env } from './utils/zodEnvFilesValidator.js'
import app from './app.js'

const port = env.PORT || 5000

const startServer = async () => {
    try {
        await connectToDb()
        app.listen(port, () => {
            console.log("Server has started and listening to port " + port)
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

startServer()















