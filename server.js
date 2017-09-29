//Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
//Exported references
const bot = new Discord.Client();
var guild = null;
var botChannel = null;

var commands = requireCommands()
var managers = null;

//Scripts
const Config = require("./config.json");
//const commands = require("./commands.js").Commands;
const functions = require("./functions.js").Functions;
const vcManager = require("./vcManager.js").Manager;

function requireCommands() {
  var arrCommands = {};
  var commandPath = "./commands/";
  fs.readdirSync(commandPath).forEach((file) => {
    if (path.extname(file) === '.js') {
      var command = require(commandPath + file).command;
      arrCommands[command.name] = [command][0];
      console.log("Loaded command " + command.name)
      //Load aliases for each command if it has any
      if (command.aliases) {
        command.aliases.forEach((alias) => {
          arrCommands[alias] = [command][0];
          console.log(`Loaded alias for ${command.name} : ${alias}`)
        })
      }
    }
  });
  return arrCommands;
}

function instantiateManagers() {
  var arrManagers = {};
  var managerPath = "./managers/";
  fs.readdirSync(managerPath).forEach((file) => {
    if (path.extname(file) === '.js') {
      var manager = require(managerPath + file).manager;
      arrManagers[manager.name] = manager;
      console.log("Loaded " + manager.name + " Manager")
      //Load aliases for each command if it has any
    }
  });
  return arrManagers;
}

bot.on('ready', () => {
  console.log('bot client connected');
  exports.bot = bot;
  guild = bot.guilds.find('id', Config.serverID)
  exports.guild = guild;
  console.log("guild", guild.id)
  botChannel = guild.channels.find('id', Config.textChannelID)
  exports.guild = guild;
  console.log("botChannel", botChannel.id)
  functions.init(bot);
  managers = instantiateManagers()
  exports.managers = managers;
  console.log('loading complete');
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
    try {
      if (msg.guild) {
        msg.delete()
      }
    }
    catch (e) {
      console.log("error deleting message");
      console.log(e);
    }
  }
});

//Initialize
bot.login(Config.token);

exports.commands = commands
