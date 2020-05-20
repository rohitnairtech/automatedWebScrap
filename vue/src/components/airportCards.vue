
<template>
  <v-container>
  <v-row
    align="center"
    justify="center"
  >
  <v-col cols="12" align="center" justify="center" v-for="(card, index) in cardData" :key="index">
    <Cards :cardInfo="card" :cardIndex="index" :countries="airportData"/>
  </v-col>


</v-row>
<v-container>
  <v-row
    align="center"
    justify="center"
  >
<v-btn rounded large color="dark" @click="addCard">+</v-btn>
</v-row>
</v-container>
</v-container>
</template>
<script>
import {post, get} from 'axios';
import Cards from './cards';
import airportData from '../../cleanData.json';
  export default {
    data () {
      return {
        cardData:[],
        airportData: airportData
      }
    },

    methods: {
      addCard(){
        let add = true;
        for(let x in this.cardData){
          const data =  this.cardData[x];
          if(Object.entries(data).length < 5){
            add = false;
          }
        }
        if(add){
          this.cardData.push({});
        }
        else{
          window.alert('Fill in the current card to add more');
        }
      },
      removeCard(i){
        this.cardData.splice(i, 1);
      },
      addData(i, data){
        this.cardData.splice(i, 1, data);
        data.index = i;
        //push to servers
        post('http://54.200.248.60:5007/scrap', data).then(d=>{
          console.log(d);
        }).catch(e=>{
          console.log(e);
        });
      },
      getData(){
        get('http://54.200.248.60:5007/cards').then(({data})=>{
          console.log(data);
          if(data.length){
            for(let x = 0; x<data.length; x++){
              const rec = data[x], {url, arrUrl, depUrl} = rec;
              delete rec.url;
              delete rec.arrUrl;
              delete rec.depUrl;
              rec.webUri = url;
              rec.arrUri = arrUrl;
              rec.depUri = depUrl;
            }
            this.cardData = data;
          }
          else{
            this.cardData.push({});
          }

        }).catch(e=>{
          console.log(e);
        });
      }
    },
    created(){
       this.getData();
    },
    mounted(){
      if(this.cardData.length === 0){
        this.cardData.push({});
      }
      setInterval(()=>{
        this.getData();
      }, 60000);
    },
  components: {
    Cards,
  }
  }
</script>