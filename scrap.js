"use strict";
const cheerio = require('cheerio'), cheerioTableparser = require('cheerio-tableparser');
const puppeteer = require('puppeteer');
const {getEditDistance} = require('./editDistance');

const cityname = require('./data/city_coding.json'), 
      airline = require('./data/data_airlines.json'), 
      status_codes = require('./data/iata_status.json');



const browseSite = async (urlList)=>{


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
      const classes = child.parent.attribs.class.trim().split(' ').filter(Boolean);
      for(let x in classes){
        const className = classes[x];
        if(!(className in classList)){
          classList[className] = {city:0, airline:0, status:0, total:0};
        }
        classList[className][tag]++;
        classList[className].total++;
      }
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


  const classList = {};
  
  const browser = await puppeteer.launch({
       headless: true,
       args: ['--lang=en-US,en'],
     });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  for(let x in urlList){
    const url = urlList[x];
    await page.goto('https://www.bud.hu/en/arrivals', {waitUntil: 'networkidle2'});
    
 await autoScroll(page);
 await page.waitFor(2000);
 const content = await page.content();
 const $ = cheerio.load(content);

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
        if(currClass.total > currBest.total){
          bestFive.splice(i, 0, data);
        }
      }

    }
    else{
      bestFive.push(data);
    }
  }

  if(bestFive.length > 5){
    bestFive.length=5;
  }

  const traverse = (item)=>{
      //console.log(item);
      if(item.hasOwnProperty('children') && item.children.length){
        const child = item.children;
        if(child.hasOwnProperty("type") && child.type === "text"){
          console.log(child);
          const text = child.data.trim();
          console.log(text);
        }
        else{
          traverse(item.children);
        }
      }
      else if(item.hasOwnProperty("type") && item.type === "text"){
          console.log(item);
      }

  }

  for(let x in bestFive){
    console.log('searching for '+bestFive[x].name);
    const elem = $('.'+bestFive[x].name);
    elem.each((i, item)=>{
      traverse(item);
    });
  }

  console.log(bestFive);
  
  }
  //await page.waitFor(3000);





 await page.waitFor(2000);

  await browser.close();

}



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
  const {arrUri, depUri} = body;
  browseSite([arrUri, depUri]);
  res.sendStatus(200)
});


app.listen(port, () => console.log(`Dashboard server is listening on ${port}`));
