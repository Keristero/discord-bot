const Discord = require('discord.js');
const server = require('../server.js');
const guild = require('../server.js').guild
const Config = require('../config.json');
var TEMP_CHANNEL_PREFIX = "";

class guildManager {
    constructor() {
        this.name = "VoiceChannel"
        this.guild = server.guild
        setInterval(this.update, 10000)
    }
    update() {
        this.existingChannels = instance.getVoiceChannelNames();
        this.userGames = instance.getMemberGameNames();
        //Add exclusions, dont delete General
        this.userGames.push(Config.permanentChannel);
        this.userGames.push(Config.permanentChannel + " 2");
        //check for a game that does not have a channel, add a channel
        for (var gameName of this.userGames) {
            if (!this.existingChannels.includes(gameName)) {
                instance.createChannel(gameName)
            }
        };
        //check for a channel that is not being played, delete it
        for (var channelName of this.existingChannels) {
            if (!this.userGames.includes(channelName)) {
                if (instance.countUsersInChannel(channelName) == 0) {
                    instance.deleteChannelByName(channelName);
                }
            }
        }
    }
    createChannel(name) {
        function onCreation(channel){
            console.log(`(VC Manager) Created new channel ${channel.name}`);
            //channel.setParent(server.guild.channels.get(Config.voiceChannelCategoryID));
        }
        server.guild.createChannel(name, 'voice')
            .then(onCreation)
            .catch(console.error);
    }
    deleteChannelByName(name) {
        console.log('(VC Manager) trying to delete ' + name)
        var matchingNameVc = server.guild.channels.find("name", name);
        if (matchingNameVc) {
            matchingNameVc.delete()
                .then(console.log("(VC Manager) deleted " + name)) // Success
                .catch(console.error); // Log error
        }
    }
    countUsersInChannel(name) {
        var matchingNameVc = server.guild.channels.find("name", name);
        if (matchingNameVc) {
            return matchingNameVc.members.array().length
        }
        return 0;
    }
    getVoiceChannelNames() {
        var voiceChannels = guild.channels.filter((channel) => {
            return channel.type == "voice";
        })
        var vcNames = voiceChannels.reduce(function(a, c) {
            return a.concat(TEMP_CHANNEL_PREFIX + "" + c.name);
        }, []);
        return vcNames
    }
    getMemberGameNames() {
        var guildMemberGames = [];
        server.guild.members.forEach((member) => {
            if (member.presence.game && member.id !== server.bot.id) {
                guildMemberGames.push(TEMP_CHANNEL_PREFIX + "" + member.presence.game.name);
            }
        });
        return guildMemberGames;
    }
}

var instance = new guildManager();
exports.manager = instance;
