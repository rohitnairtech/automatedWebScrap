const {get} = require('axios');
const {writeFile} = require('fs')


const countries = [ {name: "Afghanistan", abbr: "AF"}, {name: "land Islands", abbr: "AX"}, {name: "Albania", abbr: "AL"}, {name: "Algeria", abbr: "DZ"}, {name: "American Samoa", abbr: "AS"}, {name: "AndorrA", abbr: "AD"}, {name: "Angola", abbr: "AO"}, {name: "Anguilla", abbr: "AI"}, {name: "Antarctica", abbr: "AQ"}, {name: "Antigua and Barbuda", abbr: "AG"}, {name: "Argentina", abbr: "AR"}, {name: "Armenia", abbr: "AM"}, {name: "Aruba", abbr: "AW"}, {name: "Australia", abbr: "AU"}, {name: "Austria", abbr: "AT"}, {name: "Azerbaijan", abbr: "AZ"}, {name: "Bahamas", abbr: "BS"}, {name: "Bahrain", abbr: "BH"}, {name: "Bangladesh", abbr: "BD"}, {name: "Barbados", abbr: "BB"}, {name: "Belarus", abbr: "BY"}, {name: "Belgium", abbr: "BE"}, {name: "Belize", abbr: "BZ"}, {name: "Benin", abbr: "BJ"}, {name: "Bermuda", abbr: "BM"}, {name: "Bhutan", abbr: "BT"}, {name: "Bolivia", abbr: "BO"}, {name: "Bosnia and Herzegovina", abbr: "BA"}, {name: "Botswana", abbr: "BW"}, {name: "Bouvet Island", abbr: "BV"}, {name: "Brazil", abbr: "BR"}, {name: "British Indian Ocean Territory", abbr: "IO"}, {name: "Brunei", abbr: "BN"}, {name: "Bulgaria", abbr: "BG"}, {name: "Burkina Faso", abbr: "BF"}, {name: "Burundi", abbr: "BI"}, {name: "Cambodia", abbr: "KH"}, {name: "Cameroon", abbr: "CM"}, {name: "Canada", abbr: "CA"}, {name: "Cape Verde", abbr: "CV"}, {name: "Cayman Islands", abbr: "KY"}, {name: "Central African Republic", abbr: "CF"}, {name: "Chad", abbr: "TD"}, {name: "Chile", abbr: "CL"}, {name: "China", abbr: "CN"}, {name: "Christmas Island", abbr: "CX"}, {name: "Cocos (Keeling) Islands", abbr: "CC"}, {name: "Colombia", abbr: "CO"}, {name: "Comoros", abbr: "KM"}, {name: "Congo", abbr: "CG"}, {name: "Democratic Republic of Congo", abbr: "CD"}, {name: "Cook Islands", abbr: "CK"}, {name: "Costa Rica", abbr: "CR"}, {name: "Cote D\'Ivoire", abbr: "CI"}, {name: "Croatia", abbr: "HR"}, {name: "Cuba", abbr: "CU"}, {name: "Cyprus", abbr: "CY"}, {name: "Czech Republic", abbr: "CZ"}, {name: "Denmark", abbr: "DK"}, {name: "Djibouti", abbr: "DJ"}, {name: "Dominica", abbr: "DM"}, {name: "Dominican Republic", abbr: "DO"}, {name: "Ecuador", abbr: "EC"}, {name: "Egypt", abbr: "EG"}, {name: "El Salvador", abbr: "SV"}, {name: "Equatorial Guinea", abbr: "GQ"}, {name: "Eritrea", abbr: "ER"}, {name: "Estonia", abbr: "EE"}, {name: "Ethiopia", abbr: "ET"}, {name: "Falkland Islands", abbr: "FK"}, {name: "Faroe Islands", abbr: "FO"}, {name: "Fiji", abbr: "FJ"}, {name: "Finland", abbr: "FI"}, {name: "France", abbr: "FR"}, {name: "French Guiana", abbr: "GF"}, {name: "French Polynesia", abbr: "PF"}, {name: "French Southern Territories", abbr: "TF"}, {name: "Gabon", abbr: "GA"}, {name: "Gambia", abbr: "GM"}, {name: "Georgia", abbr: "GE"}, {name: "Germany", abbr: "DE"}, {name: "Ghana", abbr: "GH"}, {name: "Gibraltar", abbr: "GI"}, {name: "Greece", abbr: "GR"}, {name: "Greenland", abbr: "GL"}, {name: "Grenada", abbr: "GD"}, {name: "Guadeloupe", abbr: "GP"}, {name: "Guam", abbr: "GU"}, {name: "Guatemala", abbr: "GT"}, {name: "Guernsey", abbr: "GG"}, {name: "Guinea", abbr: "GN"}, {name: "Guinea-Bissau", abbr: "GW"}, {name: "Guyana", abbr: "GY"}, {name: "Haiti", abbr: "HT"}, {name: "Heard Island and Mcdonald Islands", abbr: "HM"}, {name: "Holy See (Vatican City State)", abbr: "VA"}, {name: "Honduras", abbr: "HN"}, {name: "Hong Kong", abbr: "HK"}, {name: "Hungary", abbr: "HU"}, {name: "Iceland", abbr: "IS"}, {name: "India", abbr: "IN"}, {name: "Indonesia", abbr: "ID"}, {name: "Iran", abbr: "IR"}, {name: "Iraq", abbr: "IQ"}, {name: "Ireland", abbr: "IE"}, {name: "Isle of Man", abbr: "IM"}, {name: "Israel", abbr: "IL"}, {name: "Italy", abbr: "IT"}, {name: "Jamaica", abbr: "JM"}, {name: "Japan", abbr: "JP"}, {name: "Jersey", abbr: "JE"}, {name: "Jordan", abbr: "JO"}, {name: "Kazakhstan", abbr: "KZ"}, {name: "Kenya", abbr: "KE"}, {name: "Kiribati", abbr: "KI"}, {name: "North Korea", abbr: "KP"}, {name: "South Korea", abbr: "KR"}, {name: "Kuwait", abbr: "KW"}, {name: "Kyrgyzstan", abbr: "KG"}, {name: "Lao People\'s Democratic Republic", abbr: "LA"}, {name: "Latvia", abbr: "LV"}, {name: "Lebanon", abbr: "LB"}, {name: "Lesotho", abbr: "LS"}, {name: "Liberia", abbr: "LR"}, {name: "Libya", abbr: "LY"}, {name: "Liechtenstein", abbr: "LI"}, {name: "Lithuania", abbr: "LT"}, {name: "Luxembourg", abbr: "LU"}, {name: "Macao", abbr: "MO"}, {name: "Macedonia", abbr: "MK"}, {name: "Madagascar", abbr: "MG"}, {name: "Malawi", abbr: "MW"}, {name: "Malaysia", abbr: "MY"}, {name: "Maldives", abbr: "MV"}, {name: "Mali", abbr: "ML"}, {name: "Malta", abbr: "MT"}, {name: "Marshall Islands", abbr: "MH"}, {name: "Martinique", abbr: "MQ"}, {name: "Mauritania", abbr: "MR"}, {name: "Mauritius", abbr: "MU"}, {name: "Mayotte", abbr: "YT"}, {name: "Mexico", abbr: "MX"}, {name: "Federated States of Micronesia", abbr: "FM"}, {name: "Moldova", abbr: "MD"}, {name: "Monaco", abbr: "MC"}, {name: "Mongolia", abbr: "MN"}, {name: "Montenegro", abbr: "ME"}, {name: "Montserrat", abbr: "MS"}, {name: "Morocco", abbr: "MA"}, {name: "Mozambique", abbr: "MZ"}, {name: "Myanmar", abbr: "MM"}, {name: "Namibia", abbr: "NA"}, {name: "Nauru", abbr: "NR"}, {name: "Nepal", abbr: "NP"}, {name: "Netherlands", abbr: "NL"}, {name: "Netherlands Antilles", abbr: "AN"}, {name: "New Caledonia", abbr: "NC"}, {name: "New Zealand", abbr: "NZ"}, {name: "Nicaragua", abbr: "NI"}, {name: "Niger", abbr: "NE"}, {name: "Nigeria", abbr: "NG"}, {name: "Niue", abbr: "NU"}, {name: "Norfolk Island", abbr: "NF"}, {name: "Northern Mariana Islands", abbr: "MP"}, {name: "Norway", abbr: "NO"}, {name: "Oman", abbr: "OM"}, {name: "Pakistan", abbr: "PK"}, {name: "Palau", abbr: "PW"}, {name: "Palestinian Territory, Occupied", abbr: "PS"}, {name: "Panama", abbr: "PA"}, {name: "Papua New Guinea", abbr: "PG"}, {name: "Paraguay", abbr: "PY"}, {name: "Peru", abbr: "PE"}, {name: "Philippines", abbr: "PH"}, {name: "Pitcairn", abbr: "PN"}, {name: "Poland", abbr: "PL"}, {name: "Portugal", abbr: "PT"}, {name: "Puerto Rico", abbr: "PR"}, {name: "Qatar", abbr: "QA"}, {name: "Reunion", abbr: "RE"}, {name: "Romania", abbr: "RO"}, {name: "Russia", abbr: "RU"}, {name: "RWANDA", abbr: "RW"}, {name: "St. Helena", abbr: "SH"}, {name: "Saint Kitts and Nevis", abbr: "KN"}, {name: "St. Lucia", abbr: "LC"}, {name: "Saint Pierre and Miquelon", abbr: "PM"}, {name: "Saint Vincent and the Grenadines", abbr: "VC"}, {name: "Samoa", abbr: "WS"}, {name: "San Marino", abbr: "SM"}, {name: "Sao Tome and Principe", abbr: "ST"}, {name: "Saudi Arabia", abbr: "SA"}, {name: "Senegal", abbr: "SN"}, {name: "Serbia", abbr: "RS"}, {name: "Seychelles", abbr: "SC"}, {name: "Sierra Leone", abbr: "SL"}, {name: "Singapore", abbr: "SG"}, {name: "Slovakia", abbr: "SK"}, {name: "Slovenia", abbr: "SI"}, {name: "Solomon Islands", abbr: "SB"}, {name: "Somalia", abbr: "SO"}, {name: "South Africa", abbr: "ZA"}, {name: "South Georgia and the South Sandwich Islands", abbr: "GS"}, {name: "Spain", abbr: "ES"}, {name: "Sri Lanka", abbr: "LK"}, {name: "Sudan", abbr: "SD"}, {name: "Suriname", abbr: "SR"}, {name: "Svalbard and Jan Mayen", abbr: "SJ"}, {name: "Swaziland", abbr: "SZ"}, {name: "Sweden", abbr: "SE"}, {name: "Switzerland", abbr: "CH"}, {name: "Syria", abbr: "SY"}, {name: "Taiwan", abbr: "TW"}, {name: "Tajikistan", abbr: "TJ"}, {name: "Tanzania", abbr: "TZ"}, {name: "Thailand", abbr: "TH"}, {name: "Timor-Leste", abbr: "TL"}, {name: "Togo", abbr: "TG"}, {name: "Tokelau", abbr: "TK"}, {name: "Tonga", abbr: "TO"}, {name: "Trinidad and Tobago", abbr: "TT"}, {name: "Tunisia", abbr: "TN"}, {name: "Turkey", abbr: "TR"}, {name: "Turkmenistan", abbr: "TM"}, {name: "Turks and Caicos Islands", abbr: "TC"}, {name: "Tuvalu", abbr: "TV"}, {name: "Uganda", abbr: "UG"}, {name: "Ukraine", abbr: "UA"}, {name: "United Arab Emirates", abbr: "AE"}, {name: "United Kingdom", abbr: "GB"}, {name: "United States", abbr: "US"}, {name: "United States Minor Outlying Islands", abbr: "UM"}, {name: "Uruguay", abbr: "UY"}, {name: "Uzbekistan", abbr: "UZ"}, {name: "Vanuatu", abbr: "VU"}, {name: "Venezuela", abbr: "VE"}, {name: "Vietnam", abbr: "VN"}, {name: "British Virgin Islands", abbr: "VG"}, {name: "Virgin Islands, U.S.", abbr: "VI"}, {name: "Wallis and Futuna Islands", abbr: "WF"}, {name: "Western Sahara", abbr: "EH"}, {name: "Yemen", abbr: "YE"}, {name: "Zambia", abbr: "ZM"}, {name: "Zimbabwe", abbr: "ZW"} ];


const finalData = [];

const matchCountry = (country)=>{

	const capitalizeFirstLetter = (string) => {
	  const strArray = string.split(' ');
	  let newStr = '';
	  for(let x in strArray){
	  	let str = strArray[x];
	  	str = str.charAt(0).toUpperCase() + str.slice(1);
	  	newStr += str + ' ';
	  }
	  return newStr.trim()
	}

	switch(country){
		case 'macau':
			country = 'macao';
			break;
		case 'laos':
			country = 'lao people\'s democratic republic';
			break;
		case 'russian federation':
			country = 'russia';
			break;
		case 'ivory coast':
			country = 'cote d\'ivoire';
			break;
		case 'libyan arab jamahiriya':
			country = 'libya';
			break;
	}
	for(let i in countries){
		const currCountry = countries[i];
		if(currCountry.name.toLowerCase() === country){
			return [currCountry.abbr, capitalizeFirstLetter(country)];
		}
	}
	return false;
}


get('https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json').then(({data})=>{
	const notFound = [];
	for(let i in data){
		const {code, name, city, country, icao} = data[i];
		const cleanData = {iata: code, airport:name, city, icao};
		const countryAbbr = matchCountry(country.toLowerCase());
		if(country){
			if(countryAbbr){
				cleanData.name = countryAbbr[1];
				cleanData.abbr = countryAbbr[0];
			}
			else{
				console.log('didnt get abbr for ');
				console.log(country);
				if(!notFound.includes(country)){
					notFound.push(country);
				}
			}
		}
		finalData.push(cleanData);
		
	}
	console.log(finalData);
	
	writeFile('./cleanData.json', JSON.stringify(finalData), err => {
	    if (err) {
	        console.log('Error writing file', err)
	    } else {
	        console.log('Successfully wrote file')
	    }
	});

}).catch(e=>{
	console.log(e);
});