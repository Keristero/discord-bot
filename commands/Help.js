var commands = require("../server.js").commands
var functions = require("../functions.js").Functions;

var command = {
    name: "help",
    help: "lists all commands",
    fn: function(msg, parameters) {
        var cmdHelps = []
        for (var cmdname in commands) {
            cmdHelps.push(cmdname + " : " + commands[cmdname].help);
        }
        functions.DMreply(msg,cmdHelps.join('\n'));
    }
}

exports.command = command;