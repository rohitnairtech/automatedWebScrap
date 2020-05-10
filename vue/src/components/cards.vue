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
      <v-text-field
        :disabled="!isEditing"
        color="white"
        label="Airport Name"
        v-model="cardInfo.airport"
      ></v-text-field>
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
      <v-autocomplete
        :disabled="!isEditing"
        :items="countries"
        :filter="customFilter"
        color="white"
        item-text="name"
        label="Country"
        v-model="cardInfo.country"
      ></v-autocomplete>

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
  export default {
    props:{
      cardInfo: Object,
      cardIndex: Number
    },
    data () {
      return {
        hasSaved: false,
        isEditing: false,
        model: null,
        countries: [ 
            {name: "Afghanistan", abbr: "AF"}, 
            {name: "land Islands", abbr: "AX"}, 
            {name: "Albania", abbr: "AL"}, 
            {name: "Algeria", abbr: "DZ"}, 
            {name: "American Samoa", abbr: "AS"}, 
            {name: "AndorrA", abbr: "AD"}, 
            {name: "Angola", abbr: "AO"}, 
            {name: "Anguilla", abbr: "AI"}, 
            {name: "Antarctica", abbr: "AQ"}, 
            {name: "Antigua and Barbuda", abbr: "AG"}, 
            {name: "Argentina", abbr: "AR"}, 
            {name: "Armenia", abbr: "AM"}, 
            {name: "Aruba", abbr: "AW"}, 
            {name: "Australia", abbr: "AU"}, 
            {name: "Austria", abbr: "AT"}, 
            {name: "Azerbaijan", abbr: "AZ"}, 
            {name: "Bahamas", abbr: "BS"}, 
            {name: "Bahrain", abbr: "BH"}, 
            {name: "Bangladesh", abbr: "BD"}, 
            {name: "Barbados", abbr: "BB"}, 
            {name: "Belarus", abbr: "BY"}, 
            {name: "Belgium", abbr: "BE"}, 
            {name: "Belize", abbr: "BZ"}, 
            {name: "Benin", abbr: "BJ"}, 
            {name: "Bermuda", abbr: "BM"}, 
            {name: "Bhutan", abbr: "BT"}, 
            {name: "Bolivia", abbr: "BO"}, 
            {name: "Bosnia and Herzegovina", abbr: "BA"}, 
            {name: "Botswana", abbr: "BW"}, 
            {name: "Bouvet Island", abbr: "BV"}, 
            {name: "Brazil", abbr: "BR"}, 
            {name: "British Indian Ocean Territory", abbr: "IO"}, 
            {name: "Brunei Darussalam", abbr: "BN"}, 
            {name: "Bulgaria", abbr: "BG"}, 
            {name: "Burkina Faso", abbr: "BF"}, 
            {name: "Burundi", abbr: "BI"}, 
            {name: "Cambodia", abbr: "KH"}, 
            {name: "Cameroon", abbr: "CM"}, 
            {name: "Canada", abbr: "CA"}, 
            {name: "Cape Verde", abbr: "CV"}, 
            {name: "Cayman Islands", abbr: "KY"}, 
            {name: "Central African Republic", abbr: "CF"}, 
            {name: "Chad", abbr: "TD"}, 
            {name: "Chile", abbr: "CL"}, 
            {name: "China", abbr: "CN"}, 
            {name: "Christmas Island", abbr: "CX"}, 
            {name: "Cocos (Keeling) Islands", abbr: "CC"}, 
            {name: "Colombia", abbr: "CO"}, 
            {name: "Comoros", abbr: "KM"}, 
            {name: "Congo", abbr: "CG"}, 
            {name: "Congo, The Democratic Republic of the", abbr: "CD"}, 
            {name: "Cook Islands", abbr: "CK"}, 
            {name: "Costa Rica", abbr: "CR"}, 
            {name: "Cote D\"Ivoire", abbr: "CI"}, 
            {name: "Croatia", abbr: "HR"}, 
            {name: "Cuba", abbr: "CU"}, 
            {name: "Cyprus", abbr: "CY"}, 
            {name: "Czech Republic", abbr: "CZ"}, 
            {name: "Denmark", abbr: "DK"}, 
            {name: "Djibouti", abbr: "DJ"}, 
            {name: "Dominica", abbr: "DM"}, 
            {name: "Dominican Republic", abbr: "DO"}, 
            {name: "Ecuador", abbr: "EC"}, 
            {name: "Egypt", abbr: "EG"}, 
            {name: "El Salvador", abbr: "SV"}, 
            {name: "Equatorial Guinea", abbr: "GQ"}, 
            {name: "Eritrea", abbr: "ER"}, 
            {name: "Estonia", abbr: "EE"}, 
            {name: "Ethiopia", abbr: "ET"}, 
            {name: "Falkland Islands (Malvinas)", abbr: "FK"}, 
            {name: "Faroe Islands", abbr: "FO"}, 
            {name: "Fiji", abbr: "FJ"}, 
            {name: "Finland", abbr: "FI"}, 
            {name: "France", abbr: "FR"}, 
            {name: "French Guiana", abbr: "GF"}, 
            {name: "French Polynesia", abbr: "PF"}, 
            {name: "French Southern Territories", abbr: "TF"}, 
            {name: "Gabon", abbr: "GA"}, 
            {name: "Gambia", abbr: "GM"}, 
            {name: "Georgia", abbr: "GE"}, 
            {name: "Germany", abbr: "DE"}, 
            {name: "Ghana", abbr: "GH"}, 
            {name: "Gibraltar", abbr: "GI"}, 
            {name: "Greece", abbr: "GR"}, 
            {name: "Greenland", abbr: "GL"}, 
            {name: "Grenada", abbr: "GD"}, 
            {name: "Guadeloupe", abbr: "GP"}, 
            {name: "Guam", abbr: "GU"}, 
            {name: "Guatemala", abbr: "GT"}, 
            {name: "Guernsey", abbr: "GG"}, 
            {name: "Guinea", abbr: "GN"}, 
            {name: "Guinea-Bissau", abbr: "GW"}, 
            {name: "Guyana", abbr: "GY"}, 
            {name: "Haiti", abbr: "HT"}, 
            {name: "Heard Island and Mcdonald Islands", abbr: "HM"}, 
            {name: "Holy See (Vatican City State)", abbr: "VA"}, 
            {name: "Honduras", abbr: "HN"}, 
            {name: "Hong Kong", abbr: "HK"}, 
            {name: "Hungary", abbr: "HU"}, 
            {name: "Iceland", abbr: "IS"}, 
            {name: "India", abbr: "IN"}, 
            {name: "Indonesia", abbr: "ID"}, 
            {name: "Iran, Islamic Republic Of", abbr: "IR"}, 
            {name: "Iraq", abbr: "IQ"}, 
            {name: "Ireland", abbr: "IE"}, 
            {name: "Isle of Man", abbr: "IM"}, 
            {name: "Israel", abbr: "IL"}, 
            {name: "Italy", abbr: "IT"}, 
            {name: "Jamaica", abbr: "JM"}, 
            {name: "Japan", abbr: "JP"}, 
            {name: "Jersey", abbr: "JE"}, 
            {name: "Jordan", abbr: "JO"}, 
            {name: "Kazakhstan", abbr: "KZ"}, 
            {name: "Kenya", abbr: "KE"}, 
            {name: "Kiribati", abbr: "KI"}, 
            {name: "Korea, Democratic People\"S Republic of", abbr: "KP"}, 
            {name: "Korea, Republic of", abbr: "KR"}, 
            {name: "Kuwait", abbr: "KW"}, 
            {name: "Kyrgyzstan", abbr: "KG"}, 
            {name: "Lao People\"S Democratic Republic", abbr: "LA"}, 
            {name: "Latvia", abbr: "LV"}, 
            {name: "Lebanon", abbr: "LB"}, 
            {name: "Lesotho", abbr: "LS"}, 
            {name: "Liberia", abbr: "LR"}, 
            {name: "Libyan Arab Jamahiriya", abbr: "LY"}, 
            {name: "Liechtenstein", abbr: "LI"}, 
            {name: "Lithuania", abbr: "LT"}, 
            {name: "Luxembourg", abbr: "LU"}, 
            {name: "Macao", abbr: "MO"}, 
            {name: "Macedonia, The Former Yugoslav Republic of", abbr: "MK"}, 
            {name: "Madagascar", abbr: "MG"}, 
            {name: "Malawi", abbr: "MW"}, 
            {name: "Malaysia", abbr: "MY"}, 
            {name: "Maldives", abbr: "MV"}, 
            {name: "Mali", abbr: "ML"}, 
            {name: "Malta", abbr: "MT"}, 
            {name: "Marshall Islands", abbr: "MH"}, 
            {name: "Martinique", abbr: "MQ"}, 
            {name: "Mauritania", abbr: "MR"}, 
            {name: "Mauritius", abbr: "MU"}, 
            {name: "Mayotte", abbr: "YT"}, 
            {name: "Mexico", abbr: "MX"}, 
            {name: "Micronesia, Federated States of", abbr: "FM"}, 
            {name: "Moldova, Republic of", abbr: "MD"}, 
            {name: "Monaco", abbr: "MC"}, 
            {name: "Mongolia", abbr: "MN"}, 
            {name: "Montenegro", abbr: "ME"},
            {name: "Montserrat", abbr: "MS"},
            {name: "Morocco", abbr: "MA"}, 
            {name: "Mozambique", abbr: "MZ"}, 
            {name: "Myanmar", abbr: "MM"}, 
            {name: "Namibia", abbr: "NA"}, 
            {name: "Nauru", abbr: "NR"}, 
            {name: "Nepal", abbr: "NP"}, 
            {name: "Netherlands", abbr: "NL"}, 
            {name: "Netherlands Antilles", abbr: "AN"}, 
            {name: "New Caledonia", abbr: "NC"}, 
            {name: "New Zealand", abbr: "NZ"}, 
            {name: "Nicaragua", abbr: "NI"}, 
            {name: "Niger", abbr: "NE"}, 
            {name: "Nigeria", abbr: "NG"}, 
            {name: "Niue", abbr: "NU"}, 
            {name: "Norfolk Island", abbr: "NF"}, 
            {name: "Northern Mariana Islands", abbr: "MP"}, 
            {name: "Norway", abbr: "NO"}, 
            {name: "Oman", abbr: "OM"}, 
            {name: "Pakistan", abbr: "PK"}, 
            {name: "Palau", abbr: "PW"}, 
            {name: "Palestinian Territory, Occupied", abbr: "PS"}, 
            {name: "Panama", abbr: "PA"}, 
            {name: "Papua New Guinea", abbr: "PG"}, 
            {name: "Paraguay", abbr: "PY"}, 
            {name: "Peru", abbr: "PE"}, 
            {name: "Philippines", abbr: "PH"}, 
            {name: "Pitcairn", abbr: "PN"}, 
            {name: "Poland", abbr: "PL"}, 
            {name: "Portugal", abbr: "PT"}, 
            {name: "Puerto Rico", abbr: "PR"}, 
            {name: "Qatar", abbr: "QA"}, 
            {name: "Reunion", abbr: "RE"}, 
            {name: "Romania", abbr: "RO"}, 
            {name: "Russian Federation", abbr: "RU"}, 
            {name: "RWANDA", abbr: "RW"}, 
            {name: "Saint Helena", abbr: "SH"}, 
            {name: "Saint Kitts and Nevis", abbr: "KN"}, 
            {name: "Saint Lucia", abbr: "LC"}, 
            {name: "Saint Pierre and Miquelon", abbr: "PM"}, 
            {name: "Saint Vincent and the Grenadines", abbr: "VC"}, 
            {name: "Samoa", abbr: "WS"}, 
            {name: "San Marino", abbr: "SM"}, 
            {name: "Sao Tome and Principe", abbr: "ST"}, 
            {name: "Saudi Arabia", abbr: "SA"}, 
            {name: "Senegal", abbr: "SN"}, 
            {name: "Serbia", abbr: "RS"}, 
            {name: "Seychelles", abbr: "SC"}, 
            {name: "Sierra Leone", abbr: "SL"}, 
            {name: "Singapore", abbr: "SG"}, 
            {name: "Slovakia", abbr: "SK"}, 
            {name: "Slovenia", abbr: "SI"}, 
            {name: "Solomon Islands", abbr: "SB"}, 
            {name: "Somalia", abbr: "SO"}, 
            {name: "South Africa", abbr: "ZA"}, 
            {name: "South Georgia and the South Sandwich Islands", abbr: "GS"}, 
            {name: "Spain", abbr: "ES"}, 
            {name: "Sri Lanka", abbr: "LK"}, 
            {name: "Sudan", abbr: "SD"}, 
            {name: "Suriname", abbr: "SR"}, 
            {name: "Svalbard and Jan Mayen", abbr: "SJ"}, 
            {name: "Swaziland", abbr: "SZ"}, 
            {name: "Sweden", abbr: "SE"}, 
            {name: "Switzerland", abbr: "CH"}, 
            {name: "Syrian Arab Republic", abbr: "SY"}, 
            {name: "Taiwan, Province of China", abbr: "TW"}, 
            {name: "Tajikistan", abbr: "TJ"}, 
            {name: "Tanzania, United Republic of", abbr: "TZ"}, 
            {name: "Thailand", abbr: "TH"}, 
            {name: "Timor-Leste", abbr: "TL"}, 
            {name: "Togo", abbr: "TG"}, 
            {name: "Tokelau", abbr: "TK"}, 
            {name: "Tonga", abbr: "TO"}, 
            {name: "Trinidad and Tobago", abbr: "TT"}, 
            {name: "Tunisia", abbr: "TN"}, 
            {name: "Turkey", abbr: "TR"}, 
            {name: "Turkmenistan", abbr: "TM"}, 
            {name: "Turks and Caicos Islands", abbr: "TC"}, 
            {name: "Tuvalu", abbr: "TV"}, 
            {name: "Uganda", abbr: "UG"}, 
            {name: "Ukraine", abbr: "UA"}, 
            {name: "United Arab Emirates", abbr: "AE"}, 
            {name: "United Kingdom", abbr: "GB"}, 
            {name: "United States", abbr: "US"}, 
            {name: "United States Minor Outlying Islands", abbr: "UM"}, 
            {name: "Uruguay", abbr: "UY"}, 
            {name: "Uzbekistan", abbr: "UZ"}, 
            {name: "Vanuatu", abbr: "VU"}, 
            {name: "Venezuela", abbr: "VE"}, 
            {name: "Viet Nam", abbr: "VN"}, 
            {name: "Virgin Islands, British", abbr: "VG"}, 
            {name: "Virgin Islands, U.S.", abbr: "VI"}, 
            {name: "Wallis and Futuna", abbr: "WF"}, 
            {name: "Western Sahara", abbr: "EH"}, 
            {name: "Yemen", abbr: "YE"}, 
            {name: "Zambia", abbr: "ZM"}, 
            {name: "Zimbabwe", abbr: "ZW"} 
          ],
      }
    },

    methods: {
      customFilter (item, queryText) {
        const textOne = item.name.toLowerCase()
        const textTwo = item.abbr.toLowerCase()
        const searchText = queryText.toLowerCase()

        return textOne.indexOf(searchText) > -1 ||
          textTwo.indexOf(searchText) > -1
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
      formValidate(){
        const {airport, webUri, arrUri, depUri, country} = this.cardInfo;
        if((airport && webUri && arrUri && depUri &&  country) && (typeof airport === 'string' && typeof webUri === 'string' && typeof arrUri === 'string' && typeof depUri === 'string' && typeof country === 'string')){
            try{
                new URL(webUri);
                new URL(arrUri);
                new URL(depUri);
            }
            catch(_){
                return false;
            }
        }
        else{
            return false;
        }
        return true;
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