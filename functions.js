var Functions = {};
var PlayList = [];
var bot = {};
const Discord = require('discord.js');
var search = require('youtube-search');
var ytdl = require('ytdl-core');
const Config = require("./config.json");
var titleHistory = [];
var Guild;
var BotChannel

var voice_handler = null;
var voice_connection = null;
var voice_channel = null;

var autoplay = false;
var loop = false;

Functions.init = function(pbot) {
    bot = pbot;
    Guild = bot.guilds.find('id', Config.serverID)
    BotChannel = Guild.channels.find('id', Config.textChannelID)
}

Functions.playbackTime = function(){
    if(voice_handler){
        return Math.floor(voice_handler.time/1000)
    }
}

function Update() {
    if (PlayList.length == 0 || !voice_connection || voice_handler) { //If there is nothing to play, no voice connection, or something playing
        return;
    }

    Functions.play(PlayList[0], function() {
        if (PlayList.length == 1) {
            if (autoplay) {
                Functions.addRelatedVideo(PlayList[0].id)
            }
        }
        if (!loop) {
            titleHistory.push(PlayList[0].title)
            PlayList.splice(0, 1)
        }
    });
}
setInterval(Update, 100);

var searchOpts = {
    maxResults: 1,
    key: Config.youtubeKey,
    type: "video"
};

class Video {
    constructor(title, url, id, length) {
        this.title = title;
        this.url = url;
        this.id = id;
        this.length = length
    }
}

Functions.createChannel = function(guild, name) {
    guild.createChannel(name, 'voice')
        .then(channel => console.log(`Created new channel ${channel}`))
        .catch(console.error);
}

Functions.getVoiceChannelNames = function(guild) {
    var voiceChannels = guild.channels.filter((channel) => {
        return channel.type == "voice";
    })
    var vcNames = voiceChannels.reduce(function(a, c) {
        return a.concat(c.name);
    }, []);
    return vcNames
}

Functions.play = function(video, callback) {
    bot.user.setGame(video.title);
    var audio_stream = ytdl(video.url);
    voice_handler = voice_connection.playStream(audio_stream);

    voice_handler.once("end", reason => {
        voice_handler = null;
        bot.user.setGame();
        callback();
    });
}

Functions.toggleAutoplay = function(message) {
    autoplay = !autoplay;
    Functions.DMreply(message, "Autoplay = " + autoplay);
}

Functions.toggleLoop = function(message) {
    loop = !loop;
    Functions.DMreply(message, "Loop = " + loop);
}

Functions.setVolume = function(newVolumeString) {
    var newVolume = parseFloat(newVolumeString);
    if (newVolume > 0.1 && newVolume <= 2.0) {
        voice_handler.setVolume(newVolume);
    };
}

Functions.searchAndAddVideo = function(parameters) {
    search(parameters, searchOpts, (err, results) => {
        if (err) return console.log(err);
        Functions.addToPlayList(results[0]);
    });
}

Functions.addRelatedVideo = function(videoID) {
    var newOpts = JSON.parse(JSON.stringify(searchOpts));
    newOpts["relatedToVideoId"] = videoID;
    newOpts["maxResults"] = 20;
    search("", newOpts, (err, results) => {
        if (err) return console.log(err);
        for (var i = 0; i < results.length; i++) {
            var playedAlready = false;
            titleHistory.forEach((title) => {
                if (results[0].title === title) {
                    playedAlready = true;
                }
            })
            if (!playedAlready) {
                Functions.addToPlayList(results[0]);
                return;
            }
            else {

            }
        }
    });
}

Functions.addToPlayList = function(searchResult) {
    //Add new video object to playlist
    let video = new Video(searchResult.title, searchResult.link, searchResult.id, 0);
    PlayList.push(video);
    console.log("added video to playlist");
    //Get info for the video
    ytdl.getInfo(searchResult.link,[],(err,info)=>{
        video.length = Number(info.length_seconds);
        console.log("updated video length to "+info.length_seconds);
    });
}

Functions.skip = function() {
    loop = false
    voice_handler.end();
}

Functions.joinVoice = function(msg) {
    if (msg.member) {
        var VCtoJoin = msg.member.voiceChannel;
        if (VCtoJoin) { //If sender is in a voice channel
            if (voice_connection) { //If bot is already in voice channel
                if (voice_channel.id !== VCtoJoin.id) { //If the sender is not in the same voice channel
                    voice_connection.channel.leave();
                }
            }
            // join vc
            VCtoJoin.join().then((vc) => {
                voice_connection = vc;
                voice_channel = vc.channel;
            })
        }
    }
}

Functions.getPlaylist = function() {
    return PlayList;
}

Functions.getHistory = function() {
    return titleHistory;
}

Functions.DMreply = function(message, text) {
    if (!text) {
        text = "no response";
    }
    var channel = message.author.dmChannel;
    if (channel) {
        channel.send(text, {})
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);
    }
    else {
        message.author.createDM().then(() => { Functions.DMreply(message, text) });
    }
}

Functions.botChannelReply = function(text) {
    if (!text) {
        text = "no response";
    }
    if (Guild.available) {
        BotChannel.send(text, {})
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);
    }
}

Functions.sendFile = function(msg, path, ptext, callback) {
    var text = ptext || " ";
    BotChannel.send(text, {
        files: [
            path
        ]
    }).then(()=>{
        callback()
    })
};

exports.Functions = Functions;
