import express from 'express'
import { ConnectDB } from './config/db'

const app = express()

ConnectDB.connect().then(() => {
    console.log('oke')
}).catch((error) => {
    console.log(error)
})

app.listen(3000, () => console.log('app listening on port 3000'))