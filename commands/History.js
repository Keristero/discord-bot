var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "history",
    help: "List everything that has played",
    fn: function(msg, parameters) {
        var PlayList = functions.getHistory();
        functions.DMreply(msg,PlayList.join('\n'));
    }
}

exports.command = command;
