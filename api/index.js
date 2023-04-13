require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors')
const PORT = 5000
const connectDB = require('./config/connDb');
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.json())
app.use()

connectDB()

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    try {
        const userDoc = await User.create({
            username,
            email,
            password: hashPassword
        })
        res.json(userDoc)
    } catch (e) {
        res.status(400).json({ message: "Username Already Exists" })
    }

})

app.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (emailOrUsername.includes('@')) {
        userDoc = await User.findOne({ email: emailOrUsername })
    } else {
        userDoc = await User.findOne({ username: emailOrUsername })
    }

    const match = bcrypt.compareSync(password, userDoc.password)
    if (match) {
        //  logged in
        jwt.sign({ username: userDoc.username, id: userDoc.id }, process.env.ACCESS_TOKEN, {}, (err, token) => {
            if (err) throw err
            res.cookie('token', token).json("ok")
        })
    } else {
        response.status(400).json('wrong password')
    }
    // res.send(match)

})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

// mongoose.connection.once('open', () => {
//     console.log('connected to MongoDB');
// })

