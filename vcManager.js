const Discord = require('discord.js');
var Manager = {};
var managedGuilds = {};
var TEMP_CHANNEL_PREFIX = "";

class guildManager {
    constructor(pguild) {
        this.guild = pguild;
        this.existingChannels = [];
        this.userGames = [];
    }
    update() {
        restartUpdate: {
            this.existingChannels = Manager.getVoiceChannelNames(this.guild);
            this.userGames = Manager.getMemberGameNames(this.guild);
            //Add exclusions, dont delete General
            this.userGames.push("General");
            this.userGames.push("General 2");
            //check for a game that does not have a channel, add a channel
            for (var gameName of this.userGames) {
                if (!this.existingChannels.includes(gameName)) {
                    Manager.createChannel(this.guild, gameName)
                    break restartUpdate;
                }
            };
            //check for a channel that is not being played, delet it
            for (var channelName of this.existingChannels) {
                if (!this.userGames.includes(channelName)) {
                    if (Manager.countUsersInChannel(this.guild, channelName) == 0) {
                        Manager.deleteChannelByName(this.guild, channelName);
                    }
                }
            }
        }
    }
}

Manager.manageGuildChannels = function(bot) {
    //Populate managedGuilds
    bot.guilds.forEach((guild) => {
        if (!managedGuilds[guild.name]) {
            managedGuilds[guild.name] = new guildManager(guild)
        }
    })
    //Update managedGuilds
    for (var guildname in managedGuilds) {
        managedGuilds[guildname].update();
    }
}

Manager.createChannel = function(guild, name) {
    guild.createChannel(name, 'voice')
        .then(channel => console.log(`Created new channel ${channel}`))
        .catch(console.error);
}

Manager.deleteChannelByName = function(guild, name) {
    console.log('trying to delete ' + name)
    var matchingNameVc = guild.channels.find("name", name);
    if (matchingNameVc) {
        matchingNameVc.delete()
            .then(console.log("deleted a unused channel")) // Success
            .catch(console.error); // Log error
    }
}

Manager.countUsersInChannel = function(guild, name) {
    var matchingNameVc = guild.channels.find("name", name);
    if (matchingNameVc) {
        return matchingNameVc.members.array().length
    }
    return 0;
}

Manager.getVoiceChannelNames = function(guild) {
    var voiceChannels = guild.channels.filter((channel) => {
        return channel.type == "voice";
    })
    var vcNames = voiceChannels.reduce(function(a, c) {
        return a.concat(TEMP_CHANNEL_PREFIX + "" + c.name);
    }, []);
    return vcNames
}

Manager.getMemberGameNames = function(guild) {
    var guildMemberGames = [];
    guild.members.forEach((member) => {
        if (member.presence.game) {
            guildMemberGames.push(TEMP_CHANNEL_PREFIX + "" + member.presence.game.name);
        }
    });
    return guildMemberGames;
}

exports.Manager = Manager;