var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "join",
    help: "Makes the bot join your voice channel",
    fn: function(msg, parameters) {
        functions.joinVoice(msg)
    }
}

exports.command = command;