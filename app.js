const express = require('express')
const app = express()
const mongoose=require('mongoose')


const PORT=process.env.PORT || 5000

const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology: true,
	useFindAndModify:false,
})
mongoose.connection.on('connected',() => {
	console.log('connection established successfully!!')
})
mongoose.connection.on('error',(err) => {
	console.log('Error connecting',err)
})

require('./models/user')
require('./models/post')


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
	console.log('Server is up on port',PORT)	
})