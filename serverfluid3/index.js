const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const session = require('express-session');
const MongoStore = require('connect-mongo')

const cookieParser = require('cookie-parser')
const userroute = require('./Routes/UserRoutes')
const DashRoute = require('./Routes/DashboardRoutes')
const VendorRoute = require('./Routes/VendorRoutes')
const EndUserRoute = require('./Routes/EndUserRoutes')
const ServiceRoutes = require('./Routes/ServiceRoute')
const CustomerRoutes = require('./Routes/CustomerRoute')
const SearchRoutes = require('./Routes/SearchRoute')
const Mailer2router = require('./Routes/mailer2Route')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
})) 




mongoose.connect('mongodb+srv://kashishjangid:kashishjangid123@cluster0.mbxux9e.mongodb.net/Fluid3', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(session({
    secret: 'secret_key', // change this to a strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://kashishjangid:kashishjangid123@cluster0.mbxux9e.mongodb.net/Fluid3', // replace with your MongoDB URI
    }),
    cookie: {
        maxAge: 3600000, // 1 hour
        secure: false, // set to true if using https
        httpOnly: true,
        sameSite: 'lax'
      }
  }));

app.get('/', (req, res) => {
    // Send HTML response that includes an image tag referencing the image URL
    res.send(`
        <div>
            <h1>Hello Kashish!</h1>
        </div>
    `);
});

app.use(userroute)
app.use(DashRoute)
app.use(VendorRoute)
app.use(EndUserRoute)
app.use(ServiceRoutes)
app.use(CustomerRoutes)
app.use(SearchRoutes)
app.use(Mailer2router)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
