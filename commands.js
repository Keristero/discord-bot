var Commands = {};
var functions = {};
var vcManager = {};
var bot = {};
const Deathbattle = require("./deathbattle.js")
const Discord = require('discord.js');
const imageSearch = require('g-i-s');
const async = require('async');
const Jimp = require("jimp");
const fs = require('fs');
const request = require('request');

Commands.init = function(pbot, pFunctions, pManager) {
    bot = pbot;
    functions = pFunctions;
    vcManager = pManager;
}

Commands.help = {
    help: "lists all commands",
    fn: function(msg, parameters) {
        var cmdHelps = []
        for (var cmdname in Commands) {
            cmdHelps.push(cmdname + " : " + Commands[cmdname].help);
        }
        msg.reply(cmdHelps.join('\n'))
    }
}

Commands.check = {
    help: "Update voice channels",
    fn: function(msg, parameters) {
        vcManager.manageGuildChannels(bot)
    }
}


Commands.ping = {
    help: "Ping test",
    fn: function(msg, parameters) {
        msg.reply('pong')
    }
}

Commands.join = {
    help: "Makes the bot join your voice channel",
    fn: function(msg, parameters) {
        if (!functions.joinVoice(msg)) {
            msg.reply("Unable to join your voice channel");
        }
    }
}

Commands.skip = {
    help: "Skip current playlist item",
    fn: function(msg, parameters) {
        functions.skip();
    }
}

function RNG(min, max) {
    return min + (Math.floor(Math.random() * ((max + 1) - min)));
}

Array.prototype.random = function() {
    return this[RNG(0, this.length)]
}

Commands.deathbattle = {
    help: "use vs to seperate the two fighters. case sensitive.",
    fn: function(msg, parameters) {
        Deathbattle.Deathbattle.startDeathBattle(msg,parameters);
    }
}

Commands.play = {
    help: "Search for and add video to playlist",
    fn: function(msg, parameters) {
        functions.joinVoice(msg);
        functions.searchAndAddVideo(parameters);
    }
}

Commands.loop = {
    help: "Make current playlist item loop on completion",
    fn: function(msg, parameters) {
        functions.toggleLoop(msg);
    }
}

Commands.autoplay = {
    help: "Automatically queue related videos on completion",
    fn: function(msg, parameters) {
        functions.toggleAutoplay(msg);
    }
}

Commands.setvolume = {
    help: "Set volume (0.0 - 2.0)",
    fn: function(msg, parameters) {
        functions.setVolume(parameters);
    }
}

Commands.playlist = Commands.list = {
    help: "List everything in the playlist",
    fn: function(msg, parameters) {
        var PlayList = functions.getPlaylist();
        var index = 0;
        var arr = [];
        PlayList.forEach((item) => {
            if (index == 0) {
                arr.push(`Now playing **${item.title}**`)
            }
            else {
                arr.push(`${index}. **${item.title}**`)
            }
            index++;
        });
        msg.reply(arr.join('\n'))
    }
}

Commands.history = Commands.howdidigethere = {
    help: "List everything that has played",
    fn: function(msg, parameters) {
        var PlayList = functions.getHistory();
        msg.reply(PlayList.join('\n'))
    }
}
exports.Commands = Commands;
