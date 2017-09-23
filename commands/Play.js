var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "play",
    help: "Search for and add video to playlist",
    fn: function(msg, parameters) {
        functions.joinVoice(msg);
        functions.searchAndAddVideo(parameters);
    }
}

exports.command = command;
