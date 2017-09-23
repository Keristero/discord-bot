var commands = require("../server.js")

var command = {
    name: "ping",
    help: "Ping test",
    fn: function(msg, parameters) {
        msg.reply('pong')
    }
}

exports.command = command;