var Functions = {};
var PlayList = [];
var bot = {};
const Discord = require('discord.js');
var search = require('youtube-search');
var ytdl = require('ytdl-core');
const Config = require("./config.json");
var titleHistory = [];

var voice_handler = null;
var voice_connection = null;
var voice_channel = null;

var autoplay = false;
var loop = false;


function Update(){
    if(PlayList.length == 0 || !voice_connection || voice_handler){//If there is nothing to play, no voice connection, or something playing
        return;
    }
    
    Functions.play(PlayList[0],function(){
        if(PlayList.length == 1){
            if(autoplay){
                Functions.addRelatedVideo(PlayList[0].id)
            }
        }
        if(!loop){
            titleHistory.push(PlayList[0].title)
            PlayList.splice(0,1)
        }
    });
}
setInterval(Update,100);

var searchOpts = {
  maxResults: 1,
  key: Config.youtubeKey,
  type: "video"
};

class Video{
    constructor(title,url,id){
        this.title = title;
        this.url = url;
        this.id = id;
    }
}

Functions.createChannel = function(guild,name){
    guild.createChannel(name, 'voice')
    .then(channel => console.log(`Created new channel ${channel}`))
    .catch(console.error);
}

Functions.getVoiceChannelNames = function(guild){
    var voiceChannels = guild.channels.filter((channel)=>{
        return channel.type == "voice";
    })
    var vcNames = voiceChannels.reduce(function(a, c) {
      return a.concat(c.name);
    }, []);
    return vcNames
}

Functions.init = function(pbot){
    bot = pbot;
}

Functions.play = function(video,callback){
    bot.user.setGame(video.title);
    var audio_stream = ytdl(video.url);
	voice_handler = voice_connection.playStream(audio_stream);

	voice_handler.once("end", reason => {
		voice_handler = null;
		bot.user.setGame();
		callback();
	});
}

Functions.toggleAutoplay = function(message){
    autoplay = !autoplay;
    message.reply("Autoplay = "+autoplay);
}

Functions.toggleLoop = function(message){
    loop = !loop;
    message.reply("Loop = "+loop);
}

Functions.setVolume = function(newVolumeString){
    var newVolume = parseFloat(newVolumeString);
    if(newVolume > 0.1 && newVolume <= 2.0){
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
    newOpts["relatedToVideoId"]=videoID;
    newOpts["maxResults"]=20;
    search("", newOpts, (err, results) => {
        if (err) return console.log(err);
        for(var i = 0; i < results.length; i++){
            var playedAlready = false;
            titleHistory.forEach((title)=>{
                if(results[0].title === title){
                    playedAlready = true;
                }
            })
            if(!playedAlready){
                Functions.addToPlayList(results[0]);
                return;
            }else{
                
            }
        }
    });
}

Functions.addToPlayList = function(searchResult){
    console.log(searchResult);
    var video = new Video(searchResult.title,searchResult.link,searchResult.id);
    PlayList.push(video);
}

Functions.skip = function(){
    loop = false
    voice_handler.end();
}

Functions.joinVoice = function(msg){
    if(msg.member){
            var VCtoJoin = msg.member.voiceChannel;
            if(VCtoJoin){//If sender is in a voice channel
            if(voice_connection){//If bot is already in voice channel
                if(voice_channel.id !== VCtoJoin.id){//If the sender is not in the same voice channel
                    voice_connection.channel.leave();
                }else{
                    return false;
                }
            }
            VCtoJoin.join().then((vc) => {
                voice_connection = vc;
                voice_channel = vc.channel;
                return true;
            })
        }
    }
    return false;
}

Functions.getPlaylist = function(){
    return PlayList;
}

Functions.getHistory = function(){
    return titleHistory;
}

exports.Functions = Functions;