var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "skip",
    help: "Skip current playlist item",
    fn: function(msg, parameters) {
        functions.skip();
    }
}

exports.command = command;