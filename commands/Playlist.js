var commands = require("../server.js");
var functions = require("../functions.js").Functions;

function seconds2time (seconds) {
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);
    var time = "";

    if (hours != 0) {
      time = hours+":";
    }
    if (minutes != 0 || time !== "") {
      minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
      time += minutes+":";
    }
    if (time === "") {
      time = seconds+"s";
    }
    else {
      time += (seconds < 10) ? "0"+seconds : String(seconds);
    }
    return time;
}

var command = {
    name: "playlist",
    aliases: ["list"],
    help: "List everything in the playlist",
    fn: function(msg, parameters) {
        var PlayList = functions.getPlaylist();
        var index = 0;
        var arr = [];
        PlayList.forEach((item) => {
            let length = seconds2time(item.length);
            if (index == 0) {
                let currentTime = seconds2time(functions.playbackTime());
                arr.push(`Now playing **${item.title}** (${currentTime}/${length})`)
            }
            else {
                arr.push(`${index}. **${item.title}** (${length})`)
            }
            index++;
        });
        functions.DMreply(msg,arr.join('\n'));
    }
}

exports.command = command;
