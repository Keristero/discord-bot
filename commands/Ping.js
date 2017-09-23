var commands = require("../server.js")
var functions = require("../functions.js").Functions;

var command = {
    name: "ping",
    help: "Ping test",
    fn: function(msg, parameters) {
        functions.DMreply(msg,"Pong");
    }
}

exports.command = command;