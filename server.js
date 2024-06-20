require('dotenv').config()
require('express-async-errors')
const express = require ("express")
const app = express()
const path = require('path')
const {logger , logEvents} = require('./middleware/logger')
const errorHandler = require ('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require ('mongoose')
const PORT = process.env.PORT || 3500
const subscriptionService = require('./utils/subscriptionService');
const SessionsService = require('./utils/SessionsService');
const NotifcaionsService = require('./utils/NotificationsService')
const ReminderService = require('./utils/ReminderService')
const stripeWebhookRoute = require('./routes/stripeWebhook')



 

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())





app.use('/', express.static(path.join(__dirname, 'Public')))

app.use('/', require ('./routes/root'))

app.use('/authClient', require('./routes/authClientRoutes'))

app.use('/clients', require('./routes/clientsRoutes'))

app.use('/employes',require('./routes/employesRoutes'))

app.use('/coaches',require('./routes/coachesRoutes'))

app.use("/payments", require('./routes/paymentsRoutes'));

app.use("/session", require('./routes/subsRoutes'));

app.use("/sessions", require('./routes/SessionsRoutes'));

app.use("/reminders", require('./routes/ReminderRoutes'))

app.use("/notifications", require('./routes/NotifcationsRoutes')) 

app.use('/stripe', stripeWebhookRoute);

app.use("/AdminDash", require('./routes/adminDashRoutes'))

app.use("/FeedBacks", require ('./routes/FeedBackRoutes'))

app.use("Report", require('./routes/ReportRoutes'))


subscriptionService;
SessionsService;
NotifcaionsService;
ReminderService;



app.all('*', (req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if (req.accepts('json')){
        res.json({message:'404 not Found'})
    }else {
        res.type('txt').send('404 not Found')
    }
})


app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error',err =>{
    console.log(err)
    logEvents(`$(err.no): $(err.code)\t$(err.syscall)\t$(err.hostname)`,'mongoErrLog.log')
})
