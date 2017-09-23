var commands = require("../server.js").commands

var command = {
    name: "help",
    help: "lists all commands",
    fn: function(msg, parameters) {
        var cmdHelps = []
        for (var cmdname in commands) {
            cmdHelps.push(cmdname + " : " + commands[cmdname].help);
        }
        msg.reply(cmdHelps.join('\n'))
    }
}

exports.command = command;