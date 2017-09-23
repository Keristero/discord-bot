var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "autoplay",
    help: "Automatically queue related videos on completion",
    fn: function(msg, parameters) {
        functions.toggleAutoplay(msg);
    }
}

exports.command = command;
