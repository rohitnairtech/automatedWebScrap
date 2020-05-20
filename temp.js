"use strict";
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const {getEditDistance} = require('./editDistance');

const {fidsModel, DB} = require('./db.js');
var conn = new DB('wise-fly').connect();

const cityname = require('./data/city_coding.json'), 
      airline = require('./data/data_airlines.json'), 
      status_codes = require('./data/iata_status.json');

const browseSite = async (url)=>{

var classList = {};
  const checkDistance = (text)=>{
    text = text.toLowerCase();
    for(let x = 0; x < cityname.length; x++){
      const distance = getEditDistance(cityname[x].toLowerCase(), text);
      if(distance === 0){
        return 'city';
      }
    }
    for(let y = 0; y < airline.length; y++){
      const distance = getEditDistance(airline[y].toLowerCase(), text);
      if(distance === 0){
        return 'airline';
      }
    }
    for(let z = 0; z < status_codes.length; z++){
      const distance = getEditDistance(status_codes[z].toLowerCase(), text);
      if(distance === 0){
        return 'status';
      }
    }
    return false;
  }

  const findClass = (child, tag, iter=5)=>{
    iter--;

    if("class" in child.parent.attribs){
      const className = child.parent.attribs.class.trim().split(' ').filter(Boolean).join();

        if(!(className in classList)){
          classList[className] = {city:0, airline:0, status:0, total:0};
        }
        classList[className][tag]++;
        classList[className].total += iter;

      if(iter > 0){
        findClass(child.parent, tag, iter);
      }
    }
    else{
      findClass(child.parent, tag, iter);
    }

  }

  const getFIDS = (elem) => {
    if(elem.hasOwnProperty('children') && elem.children.length){
     for(let i in elem.children){
          const child = elem.children[i];
          //console.log(child);
          if(child.hasOwnProperty("type")){
            if(child.type === 'text'){
              //editDistance with cityname, airline, status
              const text = child.data.trim();
              if(text !== ''){
                const tag = checkDistance(text);
                if(tag){
                  /*console.log(text);
                  console.log(tag);*/
                  findClass(child, tag);
                  }
                }
              }
            }
            else{
              getFIDS(child);
            }
          }
      }
    }


  const autoScroll = async (page)=>{
      await page.evaluate(async () => {
          await new Promise((resolve, reject) => {
              let totalHeight = 0;
              const distance = 100;
              let timer = setInterval(() => {
                  const scrollHeight = document.body.scrollHeight;
                  window.scrollBy(0, distance);
                  totalHeight += distance;

                  if(totalHeight >= scrollHeight){
                      clearInterval(timer);
                      resolve();
                  }
              }, 100);
          });
      });
  }


  const traverseTextFromElement = (item)=>{
    var text = "";
    if(item.hasOwnProperty("type") && item.type === "text"){
          text = item.data.trim();
    }else if(item.hasOwnProperty('children') && item.children.length){
          const child = item.children[0];
          if(child){
            text = traverseTextFromElement(child);
          }
    }
    return text;
  }

  const traverseAllTextFromElement = (item, resArray)=>{
    var text = "";
    if(item.hasOwnProperty("type") && item.type === "text"){
          text = item.data.trim();
          resArray.push(text);
    }else if(item.hasOwnProperty('children') && item.children.length){
          const children = item.children
          children.forEach(child=>{
             text = traverseTextFromElement(child)
             resArray.push(text)
          })
    }
  }

  const traverse = (item)=>{
      console.log(item);
      if(item.hasOwnProperty('children') && item.children.length){
        const child = item.children;
        if(child.hasOwnProperty("type") && child.type === "text"){
          const text = child.data.trim();
          console.log(text);
        }
        else{
          traverse(item.children);
        }
      }
      else{
        if(item.hasOwnProperty("type") && item.type === "text"){
          console.log(item.data);
        }
      }
  }

return new Promise(async (resolve, reject)=>{
  
  const browser = await puppeteer.launch({
       headless: true,
       args: ['--lang=en-US,en'],
     });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 1366, height: 768});
    classList = {};
    await page.goto(url, {waitUntil: 'networkidle2'});
    
 await autoScroll(page);
 await page.waitFor(1000);
 const content = await page.content();
 const $ = cheerio.load(content);
  
 await browser.close();

  const body = $('body *').contents();
  for(let key in body){
    const elem = body[key];
    if(typeof elem === 'object' && elem.hasOwnProperty("type") && elem.type === 'tag' && elem.name !== 'script'){
      getFIDS(elem);
    }
  }
  //console.log(classList);

  const bestFive = [];
  for(let x in classList){
    const currClass = classList[x];
    const bestLen = bestFive.length;
    const data = {name:x, total:currClass.total};
    if(bestLen){

      for(let i=0; i < bestLen; i++){
        const currBest = bestFive[i];
        if(currClass.total > currBest.total && currClass.name !== currBest.name){
          bestFive.splice(i, 0, data);
        }
      }

    }
    else{
      bestFive.push(data);
    }
  }

  if(bestFive.length > 2){
    bestFive.length=2;
  }
  
  const fidsList = []
  for(let x in bestFive){
    const {name} = bestFive[x];
    let selector = '';
    if(name.includes(',')){
      const selectorList = name.split(',');
      for(let y = 0; y < selectorList.length; y++){
        selector += '.' + selectorList[y];
      }
    }
    else{
      selector = '.'+name;
    }
    const elem = $(selector);
    console.log('searching for '+name+ ' selector: '+selector);
    
    elem.each((i, item)=>{
      var finalResult = []
      traverseAllTextFromElement(item, finalResult);
      fidsList.push(finalResult);
    });

    if(fidsList){
      resolve(fidsList);
    }
    else{
      reject('no fids recieved');
    }
    console.log(x);
    console.log("<------->")
  }

});
  

  //await page.waitFor(3000);


}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();


const port = 5007;

app.use(helmet());
app.use(express.json({limit: '5mb'}));
app.use(express.static(__dirname+'/dist'));
app.use(cors({origin:['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://54.200.248.60:5007'],methods:['GET','POST'],credentials: true}));


app.get('/cards', ({body},res)=>{
  fidsModel.find({}, {fids:0, _id:0, __v: 0})
    .then(d=>{
       res.json(d);
    })
    .catch(e=>console.log(e));

});

app.get('/*', (req, res) => {
  res.sendFile(__dirname+'/dist/index.html');
});

app.post('/scrap', ({body},res)=>{
  const {airport, arrUri, depUri, webUri, index} = body;


   new fidsModel({airport, url:webUri, arrUrl:arrUri, depUrl:depUri, page_id:index, status:'processing', fids:data}).save()
     .then(()=>{
       console.log('inserted into DB #1');
     }).catch(err=>console.log(err));
   console.log('done');



 Promise.all([browseSite(arrUri), browseSite(depUri)])
  .then(data=>{
    fidsModel.updateOne({ airport: airport }, { status: "done" })
    .then(()=>{
       console.log('inserted into DB status done');
     }).catch(err=>console.log(err));
   console.log('done');
})
  .catch(err=>{
    console.log(err);
   fidsModel.updateOne({ airport: airport }, { status: "failed" })
   .then(()=>{
       console.log('inserted into DB status failed');
     }).catch(err=>console.log(err));
   console.log('failed');
  });

  res.sendStatus(200);
});


conn.then(()=>{
  app.listen(port, () => console.log(`Dashboard server is listening on ${port}`));
}).catch(e=>console.log(e));
