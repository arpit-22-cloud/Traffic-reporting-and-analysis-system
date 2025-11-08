import mongoose from 'mongoose'
export const connectMongoDb = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then((data) => {
      console.log(`mongodb connected with the server ${data.connection.host}`)
})
}