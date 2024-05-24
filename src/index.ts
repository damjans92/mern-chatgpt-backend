import app from './app.js'
import { connectToDB } from './db/connection.js'

const PORT = process.env.PORT
connectToDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log('Server running & Connected to Database')
    )
  })
  .catch((err) => console.log(err))
