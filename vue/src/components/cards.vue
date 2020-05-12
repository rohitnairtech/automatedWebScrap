<template>
  
<v-card
    class="overflow-hidden"
    width=60%
    color="purple lighten-1"
    dark
  >
    <v-toolbar
      flat
      color="purple"
    >
      <v-icon>mdi-airplane-takeoff</v-icon>
      <v-toolbar-title class="font-weight-light">{{(cardInfo.airport && cardInfo.country)? cardInfo.airport + ' - ' + cardInfo.country : 'New Airport'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="purple darken-3"
        fab
        small
        @click="isEditing = !isEditing"
      >
        <v-icon v-if="isEditing">mdi-close</v-icon>
        <v-icon v-else>mdi-pencil</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>

      <v-autocomplete
        :disabled="!isEditing"
        :items="countries"
        :filter="customFilterAirport"
        color="white"
        item-text="airport"
        label="Airport Name"
        v-model="cardInfo.airport"
      ></v-autocomplete>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              :disabled="!isEditing"
              color="white"
              label="Website URL"
              v-model="cardInfo.webUri"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              :disabled="!isEditing"
              color="white"
              label="Arrival URL"
              v-model="cardInfo.arrUri"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              :disabled="!isEditing"
              color="white"
              label="Departure URL"
              v-model="cardInfo.depUri"
            ></v-text-field>
          </v-col>
        </v-row>
<!--       <v-autocomplete
        :disabled="!isEditing"
        :items="countries"
        :filter="customFilter"
        color="white"
        item-text="name"
        label="Country"
        v-model="cardInfo.country"
      ></v-autocomplete> -->

    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!isEditing"
        color="danger"
        @click="remove"
        left
      >
        Remove
      </v-btn>
      <v-btn
        :disabled="!isEditing"
        color="success"
        @click="save"
        right
      >
        Save
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="hasSaved"
      :timeout="2000"
      absolute
      bottom
      left
    >
      Airport information updated
    </v-snackbar>
  </v-card>  

</template>

<script>
  /*import airportData from '../../cleanData.json';*/
  export default {
    props:{
      cardInfo: Object,
      cardIndex: Number,
      countries: Array
    },
    data () {
      return {
        hasSaved: false,
        isEditing: false,
        model: null
      }
    },

    methods: {
      customFilter (item, queryText) {
        const textOne = item.name.toLowerCase();
        const searchText = queryText.toLowerCase();

        return textOne.indexOf(searchText) > -1;
      },
      customFilterAirport (item, queryText) {
        const textOne = item.airport.toLowerCase();
        const textTwo = item.city.toLowerCase();
        const textThree = item.iata.toLowerCase();
        const searchText = queryText.toLowerCase();

        return textOne.indexOf(searchText) > -1 ||
          textTwo.indexOf(searchText) > -1 ||
          textThree.indexOf(searchText) > -1;
      },
      save () {
        const isValid = this.formValidate();
        console.log(isValid);
        if(isValid){
            this.isEditing = !this.isEditing;
            this.hasSaved = true;
            this.$parent.addData(this.cardIndex, this.cardInfo);
        }
        else{
            window.alert('some err');
        }
            
      },
      checkURL(urlList){
        let valid = true;

        for(let i in urlList){
            const url = urlList[i];
            const isURL = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
            if(!isURL){
                valid = false;
                break;
            }            
        }
        return valid;
      },
      formValidate(){
        const {airport, webUri, arrUri, depUri} = this.cardInfo;
        if((airport && webUri && arrUri && depUri) && (typeof airport === 'string' && typeof webUri === 'string' && typeof arrUri === 'string' && typeof depUri === 'string')){
            const urlValidity = this.checkURL([webUri, arrUri, depUri]);
            return urlValidity;
        }
        else{
            return false;
        }
      },
      remove(){
        this.$parent.removeCard(this.cardIndex);
      }
    },
    mounted(){
      if(Object.entries(this.cardInfo).length === 0){
        this.isEditing = true;
      }
    }
  }
</script>