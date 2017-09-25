var commands = require("../server.js");
var functions = require("../functions.js").Functions;

var command = {
    name: "playlist",
    aliases: ["list"],
    help: "List everything in the playlist",
    fn: function(msg, parameters) {
        var PlayList = functions.getPlaylist();
        var index = 0;
        var arr = [];
        PlayList.forEach((item) => {
            if (index == 0) {
                arr.push(`Now playing **${item.title}**`)
            }
            else {
                arr.push(`${index}. **${item.title}**`)
            }
            index++;
        });
        functions.DMreply(msg,arr.join('\n'));
    }
}

exports.command = command;
