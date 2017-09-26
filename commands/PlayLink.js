var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "playlink",
    help: "play music from ytdl compatible link",
    fn: function(msg, parameters) {
        functions.joinVoice(msg);
        functions.searchAndAddVideo(parameters);
    }
}

exports.command = command;
