"use strict";
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();


const port = 5007;

app.use(helmet());
app.use(express.json({limit: '5mb'}));
app.use(express.static(__dirname+'/dist'));
app.use(cors({origin:['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],methods:['GET','POST'],credentials: true}));


app.get('/*', (req, res) => {
	res.sendFile(__dirname+'/dist/index.html');
});

app.post('/scrap', ({body},res)=>{
	console.log(body);
});


app.listen(port, () => console.log(`Dashboard server is listening on ${port}`));