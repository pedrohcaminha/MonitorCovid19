const twitter = require('twit');
const axios = require('axios');
const T = new twitter(require('./config.js'));
const CronJob = require('cron').CronJob;


var http = require('http'); http.createServer(function (req, res) { res.writeHead(200, {'Content-Type': 'text/plain'}); res.send('it is running\n'); }).listen(process.env.PORT || 5000);


let url = "https://coronavirus-19-api.herokuapp.com/countries/brazil";

let response;
let text

const getData = async () => {
    response = await axios.get(url)
    response = await response.data;
};

function novaHora() {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
  
    let d = new Date();
    let offset = -3
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let date = new Date(utc + (3600000*offset));
    
    return [date.getHours(), date.getMinutes()].map(pad).join(':');
}

function a(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1.$2");
    return x;
}



async function setText(data){
    let d = new Date();
    let offset = -3
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let today = new Date(utc + (3600000*offset));
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    if(mm<10) 
    {
        mm='0'+mm;
    } 

    var groupSeparator = '.';
    let num = '123456789'
    let teste = 0
    
    

    text = "Casos totais: " + a(data.cases) +"\n"+
    "Casos ativos (doentes atualmente): " + a(data.active)+ "\n"+
    "Casos novos (" + dd+  "-" + mm + "-" + yyyy + "): " + a(data.todayCases) + "\n" +
    "Recuperações: " + a(data.recovered) + "\n"+
    "Óbitos: " + a(data.deaths)+" (" + a(data.todayDeaths)+ " hoje)" + "\n"+
    "Testes realizados: " + a(data.totalTests) + "\n"+
    "Tweet feito automaticamente às "+ novaHora() + "h (horário de Brasília)"
 
    console.log(text)
}



// // Function for Twitter post
async function casos() {
    await getData();
    await console.log(response);
    await setText(response);
    await it();
}
async function it(){
    // T.post('statuses/update', { status: text}, function(err, data, response) {})   
}

// Cronjob for daily post
new CronJob('0 */30 * * * *', function() {
    casos();
   }, null, true, 'UTC');

casos();

// T.post('statuses/update', { status: "in deploy situation..."}, function(err, data, response) {})   