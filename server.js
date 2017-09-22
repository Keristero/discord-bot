try {
  //Packages
  const Discord = require('discord.js');
  const bot = new Discord.Client();

  //Scripts
  const Config = require("./config.json");
  const commands = require("./commands.js").Commands;
  const functions = require("./functions.js").Functions;
  const vcManager = require("./vcManager.js").Manager;

  bot.on('ready', () => {
    console.log('unexpected rhys Line 420 char at 69 "]"');
  });

  bot.on('message', msg => {
    if (msg.content[0] === Config.prefix) { // Check to see if the prefix was used
      var parts = msg.content.split(' ') // Split the message at each space
      var command = parts[0].substr(1).toLowerCase() // Get the first word and set it to lower case
      var parameters = parts.slice(1, parts.length).join(' ') // Get the remaining words
      if (commands[command]) {
        console.log(msg.author.username + " : " + command + " - " + parameters)
        commands[command].fn(msg, parameters);
      }
    }
  });

  //Initialize
  bot.login(Config.token);
  functions.init(bot);
  commands.init(bot, functions, vcManager);

  //Check channels every minute
  setInterval(checkChannelsAtInterval, 60000)

  function checkChannelsAtInterval() {
    vcManager.manageGuildChannels(bot)
  }
}
catch (e) {
  console.log(e);
}
