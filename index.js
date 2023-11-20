//exact copy of full example code from (https://medium.com/izettle-engineering/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679)
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
})
const dummyDb = { subscription: null } //dummy in memory store
const saveToDatabase = async subscription => {
    dummyDb.subscription = subscription
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
    const subscription = req.body
    await saveToDatabase(subscription)
    console.log("trying to save sub")
    res.json({ message: 'success' })
})
const vapidKeys = {
    publicKey:
        'BI_-vdRg25ucEoPrL6f8yLgayiP5ACZ9f58zpsBQagF0i30VkDKGGHpS-BrLT7CdgKKFG3wfwlgVQrxUy0s-_4E',
    privateKey: '-zwR5cSnGkxbzYNM6L1Sxrk6CtjNH8N65cnx8t6D9so',
}
//setting our previously generated VAPID keys
webpush.setVapidDetails(
    'mailto:myuserid@email.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
    webpush.sendNotification(subscription, dataToSend)
}
//route to test send notification
app.get('/send-notification', (req, res) => {
    const subscription = dummyDb.subscription
    const message = 'Hello World'
    sendNotification(subscription, message)
    res.json({ message: 'message sent' })
})
app.listen(port, () => console.log(`Example app listening on port yeah ${port}!`))

