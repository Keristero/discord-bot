var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "restart",
    help: "Restarts the bot",
    fn: function(msg, parameters) {
        process.exit()
    }
}

exports.command = command;