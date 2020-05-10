
<template>
  <v-container>
  <v-row
    align="center"
    justify="center"
  >
  <v-col cols="12" align="center" justify="center" v-for="(card, index) in cardData" :key="index">
    <Cards :cardInfo="card" :cardIndex="index"/>
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
import Cards from './cards';

  export default {
    data () {
      return {
        cardData:[]
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
        //push to servers
      }
    },
    mounted(){
      if(this.cardData.length === 0){
        this.cardData.push({});
      }
    },
  components: {
    Cards,
  }
  }
</script>