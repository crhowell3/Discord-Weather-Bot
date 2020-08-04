const Discord = require('discord.js');
const { prefix, token } = require('./auth.json');
var request = require('request');
var cheerio = require('cheerio');
const axios = require('axios');
var alerts = [];
var outlook_string_1 = "";
var outlook_string_2 = "";
var outlook_string_3 = "";
var isPolling = false;

const bot = new Discord.Client();
bot.once('ready', () => {
  console.log('Connected');
  console.log('Logged in as: ');
  console.log(bot.user.username + ' - (' + bot.user.id + ')');
  getWarnings();
  getOutlooks();
});

bot.login(token);

function Alert(location, type, headline, description) {
  this.location = location;
  this.type = type;
  this.headline = headline;
  this.description = description;
}

function isEquivalent(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

function getWarnings() {
  var b = true;
  var allAlerts = [];
  axios.get('https://api.weather.gov/alerts/active?area=TN').then(function(response) {
      for (let i = 0; i < response.data.features.length; i++) {
        if (response.data.features[i].properties.areaDesc.includes("Lincoln")) {
          var a = new Alert(response.data.features[i].properties.areaDesc, response.data.features[i].properties.event, response.data.features[i].properties.headline, response.data.features[i].properties.description)
          allAlerts.push(a)
          var j = 0
          if (alerts.length != 0) {
            while (j < alerts.length) {
              if (!(isEquivalent(a, alerts[j]))) {

              } else {
                b = false
                break
              }
              j++
            }
            if (b == true) {
              alerts.push(a) 
            }
          } else {
            alerts.push(a)
          }
        }
      }
      if (alerts.length >= allAlerts.length && allAlerts.length != 0) {
        for (var i = 0; i < alerts.length; i++) {
          for (var j = 0; j < allAlerts.length; j++) {
            if (isEquivalent(alerts[i], allAlerts[j])) {
              break;
            }
            if ((j + 1) == allAlerts.length) {
              alerts.splice(i, 1);
            }
          }
          if (alerts.length == allAlerts.length) {
            break;
          }
        }
      } else if (allAlerts.length == 0) {
	alerts = [];
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getOutlooks() {
  axios.get('https://www.spc.noaa.gov/products/outlook/day1otlk.html').then(function(response) {
    const $ = cheerio.load(response.data)
    const time = $('td.zz').text()
    const timeArr = time.split(' ')
    var utcTime = ''
    for (i = 0; i< timeArr.length; i++){
      if (timeArr[i] === 'UTC'){
        utcTime = timeArr[i-1]
      }
    }
    outlook_string_1 = "https://www.spc.noaa.gov/products/outlook/day1otlk_" + utcTime + ".gif"
  })
  .catch(function(error) {
    console.log(error);
  });
  axios.get('https://www.spc.noaa.gov/products/outlook/day2otlk.html').then(function(response) {
    const $ = cheerio.load(response.data)
    const time = $('td.zz').text()
    const timeArr = time.split(' ')
    var utcTime = ''
    for (i = 0; i < timeArr.length; i++) {
      if (timeArr[i] === 'UTC') {
        utcTime = timeArr[i-1]
      }
    }
    outlook_string_2 = "https://www.spc.noaa.gov/products/outlook/day2otlk_" + utcTime + ".gif"
  })
  .catch(function(error) {
    console.log(error);
  });
  axios.get('https://www.spc.noaa.gov/products/outlook/day3otlk.html').then(function(response) {
    const $ = cheerio.load(response.data)
    const time = $('td.zz').text()
    const timeArr = time.split(' ')
    var utcTime = ''
    for (i = 0; i < timeArr.length; i++) {
      if (timeArr[i] === 'UTC') {
        utcTime = timeArr[i-1]  
      }
    }
    outlook_string_3 = "https://www.spc.noaa.gov/products/outlook/day3otlk_" + utcTime + ".gif"
  })
  .catch(function(error) {
    console.log(error);
  });

}

bot.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(' ')
  const command = args.shift().toLowerCase()

  if (message.channel.id === '690767163178483733'){
    if (message.content === `${prefix}alerts`) {
      if (alerts.length != 0) {
        for (let i = 0; i < alerts.length; i++) {
          if (alerts[i].type.includes("Flood")){
            message.channel.send("```bash\n" + "\"" + alerts[i].type + " for " + alerts[i].location + "\n" + alerts[i].headline + "\n" + alerts[i].description + "\"\n" + " ```")
	  } else if (alerts[i].type.includes("Tornado Watch")) {
	      message.channel.send("```css\n" + "[" + alerts[i].type + " for " + alerts[i].location + "]\n[" + alerts[i].headline + "]\n[" + alerts[i].description + "]\n" + " ```")
 	  } else if (alerts[i].type.includes("Tornado Warning")) {
	      message.channel.send("```diff\n" + "-" + alerts[i].type + " for " + alerts[i].location + "\n-" + alerts[i].headline + "\n" + alerts[i].description + "\n" + " ```")
	  } else if (alerts[i].type.includes("Severe Thunderstorm")) {
	      message.channel.send("```fix\n" + alerts[i].type + " for " + alerts[i].location + "\n" + alerts[i].headline + "\n" + alerts[i].description + "\n" + " ```")
	  } else {
              message.channel.send("```\n" + alerts[i].type + " for " + alerts[i].location + "\n" + alerts[i].headline + "\n" + alerts[i].description + "\n" + " ```")
          }
	}
      } else {
        message.channel.send("No active alerts for Lincoln County")
      }
    } else if (message.content === `${prefix}help`){
      message.channel.send("List of commands:\n&alerts - displays all active alerts for Lincoln County\n&help - displays this menu\n&outlook <1|2|3> - gets the latest SPC Outlook for whichever day you enter\n&poll - NOTE: only for use by @dev")
    } else if (message.content === `${prefix}poll`){
      isPolling = true;
      var interval = setInterval(function() {
        getWarnings();
        getOutlooks();
      }, 30 * 1000);
      message.channel.send('Data scraping is active')
      .catch(console.error);
    } else if (message.content === `${prefix}isPolling`){
      if (isPolling) {
        message.channel.send('Polling is active');
      } else {
        message.channel.send('Polling is not active. Run &poll to begin data scraping for alerts');
      }
    } else if (command === 'outlook'){
      if (!args.length){
        message.channel.send('You did not provide an argument.')
      } else if (args.length > 1){
        message.channel.send('Too many arguments.')
      } else if (args[0] === '1'){
        message.channel.send('', {files: [outlook_string_1]})
      } else if (args[0] === '2'){
        message.channel.send('', {files: [outlook_string_2]})
      } else if (args[0] === '3'){
        message.channel.send('', {files: [outlook_string_3]})
      } else {
        message.channel.send('Invalid parameter.')
      }
    }
  }
});
