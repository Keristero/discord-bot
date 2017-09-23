var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "loop",
    help: "Make current playlist item loop on completion",
    fn: function(msg, parameters) {
        functions.toggleLoop(msg);
    }
}

exports.command = command;
