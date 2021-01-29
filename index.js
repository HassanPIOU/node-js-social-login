const express = require('express')
const app = express()
const path = require('path')
const env = require('dotenv')
const {OAuth2Client} = require('google-auth-library');
const cookieParser = require('cookie-parser')



env.config()
const GoogleCLientId = new OAuth2Client(process.env.GOOGLE_CLIENTID);



app.set('view engine','hbs')
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname,'./public')))
app.use(express.json())
app.use(cookieParser())




const checkAuthenticated = (req, res, next) => {

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENTID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
        .then(()=>{
            req.user = user;
            next();
        })
        .catch(err=>{
            res.redirect('/login')
        })

}


app.get('/',(req,res) => {
    res.redirect('/login')
})

app.get('/login',(req,res) => {
    res.render('index',{clientId : process.env.GOOGLE_CLIENTID})
})

app.post('/login',(req,res) => {
    const token = req.body.token

    async function verify() {
        const ticket = await GoogleCLientId.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENTID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload)
    }
    verify()
        .then(()=>{
            res.cookie('session-token', token);
            res.redirect('success')
        })
        .catch(console.error);
})


app.get('/profile',checkAuthenticated, (req, res)=>{
    let user = req.user;
    res.render('profile', {user});
})

app.get('/protectedRoute',checkAuthenticated, (req,res)=>{
    res.send('This route is protected')
})

app.get('/logout', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/login')

})

app.get('/dashboard',(req,res) => {
    res.render('dashboard')
})


app.listen(3000,() =>{
    console.log('server is running')
})