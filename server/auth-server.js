require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const { userSchema, User } = require("./templates/schemas.js")
const { settings: languageSettings } = require("./templates/language-settings.js")
const { settings: practiceSettings } = require("./templates/practice-settings.js")
const { settings: referenceSettings } = require("./templates/reference-settings.js")

const port = 8000
const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/conjugo", { useNewUrlParser: true });

const saltRounds = 10;

const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"]

// const userSchema = new mongoose.Schema({
//     id:         { type: String, required: true, unique: true },
//     username:   { type: String, required: true, unique: true },
//     email:      { type: String, required: true, unique: true },
//     password:   { type: String, required: true, unique: false },
//     firstName:  { type: String, required: true, unique: false },
//     lastName:   { type: String, required: true, unique: false },
//     dob:        { type: String, required: true, unique: false },
//     token:      { type: String, required: true, unique: false },
//     inception:  { type: Number, required: true, unique: false },
// })

// const User = mongoose.model("user", userSchema);

function generateTokens(user){

    const access = jwt.sign(
        { id: user.id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "1h" }
    )

    const refresh = jwt.sign(
        { id: user.id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET
    )

    return { access, refresh }
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.post('/register', async (req, res) => {
    const data = req.body
    const hash = await bcrypt.hash(data.passwordRegister, saltRounds)

    let resBody;
    let resStatus;

    const newUser = new User ({
        id:         uuidv4().replaceAll("-", "").slice(0, 10),
        username:   data.username,
        email:      data.email,
        password:   hash,
        firstName:  data.fname,
        lastName:   data.lname,
        dob:        data.dob,
        token:      "0",
        languages:  languageSettings,
        practice:   { settings: practiceSettings },
        reference:  { settings: referenceSettings },
        image:      `${data.fname[0].toUpperCase()}-${colors[Math.floor(Math.random() * 7)]}.png`,
        inception:  Date.now(),
    });
    
    try {
        const tokens = generateTokens(newUser)

        newUser.token = tokens.refresh
        
        await newUser.save()

        resBody = {
            status: "success", 
            payload: {
                id: newUser.id,
                username: newUser.username,
                accessToken: tokens.access, 
                refreshToken: tokens.refresh,
                userData: {
                    fname: newUser.firstName,
                    lname: newUser.lastName,
                    username: newUser.username,
                    age: Math.abs((new Date(Date.now() - new Date(newUser.dob))).getUTCFullYear() - 1970),
                    email: newUser.email,
                    image: `http://localhost:9000/images/profile_defaults/${newUser.image}`
                } 
            }
        }

        resStatus = 200
    }

    catch (err){
        console.log(err)
        if (err.code === 11000){
            let duplicate = Object.keys(err.keyValue)[0]
            resBody = { status: "failed", payload: { error: "existing_user", field: duplicate } }
            resStatus = 409

        } else {
            resBody = { status: "failed", payload: { error: err.code } }
            resStatus = 500
        }
    }

    res.status( resStatus ).send( resBody )
})

app.post('/login', async (req, res) => {
    const { usernameEmail, passwordLogin } = req.body
    const identifier = usernameEmail.includes("@") ? "email" : "username"

    let resBody;
    let resStatus;
    
    try {
        const user = await User.findOne( { [identifier]: usernameEmail })
        
        if (user !== null){
            const validPassword = await bcrypt.compare(passwordLogin, user.password)

            if (validPassword){
                const tokens = generateTokens(user)

                user.token = tokens.refresh
                await user.save()

                resBody = {
                    status: "success", 
                    payload: {
                        id: user.id,
                        username: user.username,
                        accessToken: tokens.access, 
                        refreshToken: tokens.refresh,
                        userData: {
                            fname: user.firstName,
                            lname: user.lastName,
                            username: user.username,
                            age: Math.abs((new Date(Date.now() - new Date(user.dob))).getUTCFullYear() - 1970),
                            email: user.email,
                            image: `http://localhost:9000/images/profile_defaults/${user.image}`,
                        } 
                    }
                }
                resStatus = 200
            } else {
                resBody = { status: "failed", payload: { error: "incorrect_password" } }
                resStatus = 401
            }

        } else {
            resBody = { status: "failed", payload: { error: "not_found" } }
            resStatus = 404
        }
    }

    catch (err){
        console.log(err)
        resBody = { status: "failed", payload: { error: err.code } }
        resStatus = 500
    }
    
    res.status( resStatus ).send( resBody )
})

app.post("/token", (req, res) => {

    if ( !req.body ) return res.sendStatus(401) // No request body – Unauthorized
    if ( !req.body.token ) return res.sendStatus(401) // No token provided – Unauthorized
    
    const refreshToken = req.body.token

    jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(401) // Invalid token – Unauthorized

        const userData = await User.findOne( { id: user.id } )
        if ( userData === null ) return res.sendStatus(400) // No user found – Bad request  
        
        if ( userData.token !== refreshToken ){
            
            userData.token = "0"
            await userData.save()
            
            return res.sendStatus(403) // Request token != stored token – Forbidden
        }

        const { access, refresh } = generateTokens( { id: user.id, username: user.username })

        userData.token = refresh
        await userData.save()

        res.send( { access, refresh } )
    })
}) 