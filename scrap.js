"use strict";
const {get} = require('axios');
const cheerio = require('cheerio'), cheerioTableparser = require('cheerio-tableparser');
const puppeteer = require('puppeteer');
const {getEditDistance} = require('./editDistance');

const cityname = require('./data/city_coding.json'), 
      airline = require('./data/data_airlines.json'), 
      status_codes = require('./data/iata_status.json');

const airportList = 
{
   qatar:
   {
      type:'static',
      arr:{
         uri:'https://qaiairport.com/en/flight-information/Pages/Arrivals.aspx',
         dataTable: {name:'tblArrivals', type:'id'}
            }, 
      dept:{
         uri:'https://qaiairport.com/en/flight-information/Pages/Departures.aspx',
         dataTable: {name:'tblDepartures', type:'id'}
            }
   },
   budapest:
   {
      type:'dynamic',
      arr:{
         uri:'https://www.bud.hu/en/arrivals', 
         dataTable:{name:'data-table', type:'class'}},
      dept:{
         uri:'https://www.bud.hu/en/departures',
         dataTable:{name:'data-table', type:'class'}},
   }
};

const AirportFIDS = {};


const getCount = async (page)=> {
  return await page.$$eval('body', a => a.length);
}

const checkDistance = (text)=>{
  for(let x = 0; x < cityname.length; x++){
    const distance = getEditDistance(cityname[x], text);
    if(distance === 0){
      return 'city';
    }
  }
  for(let y = 0; y < airline.length; y++){
    const distance = getEditDistance(airline[y], text);
    if(distance === 0){
      return 'airline';
    }
  }
  for(let z = 0; z < status_codes.length; z++){
    const distance = getEditDistance(status_codes[z], text);
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

(async () => {
  const browser = await puppeteer.launch({
       headless: true,
       args: ['--lang=en-US,en'],
     });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await page.goto('https://www.heathrow.com/arrivals', {waitUntil: 'networkidle2'});
  //await page.waitFor(3000);
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
  console.log(classList);
 await page.waitFor(2000);


/*  const content = await page.content();
  const $ = cheerio.load(content);
  cheerioTableparser($);
  const data = $('table').parsetable(true,true,true);
  //console.log(data);
  let i;
  const table = {};
  for (i=0;i<data.length;i++){
     console.log(data[i][0]);
     const title = data[i].shift();
        table[title] = [];
        for(let x in data[i]){
           console.log(x);
           if(data[i][x] !== 'Please wait...' || data[i][x] !== '' || data[i][x] !== null){
              table[title].push(data[i][x]);
           }
        }
  }
  console.log(table);
*/  /*await page.waitForSelector('.f0n8F');*/
  /*console.log(await page.$('.f0n8F input'));*/
/*  await page.keyboard.press('Tab', { delay: 200 });
  await page.keyboard.type('aibuddhaofficial', { delay: 100 });  
  await page.keyboard.press('Tab', { delay: 130 });
  await page.keyboard.type('321enlighten', { delay: 104 });
  await page.keyboard.press('Tab', { delay: 110 });
  await page.keyboard.press('Tab', { delay: 100 });
  await page.keyboard.press('Enter');
  await page.goto('https://instagram.com/direct/inbox/');
  await page.waitFor(2000);*/
  //await page.screenshot({path: 'example.png'});

  await browser.close();

})();

/*const webscrapper = (uri, dataTable)=>{
   get(uri).then(({data})=>{
      const $ = cheerio.load(data);
      cheerioTableparser($);
      data = (dataTable.type==='id') ? $(`#${dataTable.name}`).parsetable(true,true,true) : $(`.${dataTable.name}`).parsetable(true,true,true);
      data.shift();
      data.pop();
      let i;
      const FIDS = {};
      for(i=0;i<data.length; i++){
         const keyName = data[i].shift();
         FIDS[keyName] = data[i];
      }
      console.log(FIDS);
    });
}

 webscrapper('https://www.bud.hu/en/departures', currData.dataTable);*/

/*
for(let data in airportList.qatar){
   const currData = airportList.qatar[data];
   webscrapper(currData.uri, currData.dataTable);
}*/