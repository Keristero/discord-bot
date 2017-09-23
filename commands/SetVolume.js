var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "setvolume",
    help: "Set volume (0.0 - 2.0)",
    fn: function(msg, parameters) {
        functions.setVolume(parameters);
    }
}

exports.command = command;
