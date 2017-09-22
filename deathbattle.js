const Discord = require('discord.js');
const imageSearch = require('g-i-s');
const async = require('async');
const Jimp = require("jimp");
const fs = require('fs');
const request = require('request');

var Deathbattle = {};

function RNG(min, max) {
    return min + (Math.floor(Math.random() * ((max + 1) - min)));
}

Array.prototype.random = function() {
    return this[RNG(0, this.length)]
}

function downloadFile(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        var extensionParts = res.headers['content-type'].split("/");
        var extension = "." + extensionParts[1] || null;
        request(uri).pipe(fs.createWriteStream(filename + extension)).on('close', callback);
    });
};

function finishDeathBattleImg(image1, image2, msg, callback) {
    var deathBattleImgPath = "./battleTemplate.png";
    var deathBattleBackgrondPath = "./battleBackground.jpg";
    async.parallel([
        function(callback) {
            Jimp.read(deathBattleImgPath, function(error, image) {
                if (error) throw error;
                console.log("got deathbattleimg")
                callback(error, image)
            })
        },
        function(callback) {
            Jimp.read(deathBattleBackgrondPath, function(error, image) {
                if (error) throw error;
                console.log("got deathbattlebackground")
                callback(error, image)
            })
        }
    ], function(err, results) {
        console.log("loaded template and background")
        console.log(results);
        var deathBattleTemplate = results[0]
        var deathBattleBackground = results[1]
        deathBattleBackground.composite(image1, 0, 0);
        deathBattleBackground.composite(image2, 375, 0);
        deathBattleBackground.composite(deathBattleTemplate, 0, 0);
        deathBattleBackground.write("Final.png")
        setTimeout(function() {
            sendImage("Final.png", msg)
            //Send the image, wait for about 3 seconds before starting the actual battle
            //Becuase it takes a while for the image to send
            setTimeout(function() {
                callback();
            }, 3000)
        }, 1000);
    })
}

function createDeathBattleImg(imageurl1, imageurl2, msg, callback) {
    async.parallel([
        function(callback) {
            Jimp.read(imageurl1, function(error, image) {
                if (error) throw error;
                console.log("got image 1")
                image.resize(375, 421) // resize 
                callback(error, image)
            })
        },
        function(callback) {
            Jimp.read(imageurl2, function(error, image) {
                if (error) throw error;
                console.log("got image 2")
                image.resize(375, 421) // resize 
                callback(error, image)
            })
        }
    ], function(error, images) {
        finishDeathBattleImg(images[0], images[1], msg, callback);
    })
}


function replyImageSearchURL(searchTerm, msg) {
    imageSearch(searchTerm, (error, results) => {
        if (results[0]) {
            msg.reply(results[0].url);
        }
        else {
            msg.reply("https://www.highstakesdb.com/images/Players/20160224081413_705x365.jpg")
        }
    });
}

function searchImageUrl(searchTerm, callback) {
    imageSearch(searchTerm, (error, results) => {
        if (results[0]) {
            callback(error, results[0].url)
        }
        else {
            callback(error, "https://www.highstakesdb.com/images/Players/20160224081413_705x365.jpg")
        }
    });
}

function sendImage(imagePath, msg) {
    msg.channel.send("FIGHT!", {
        files: [
            imagePath
        ]
    });
}

Deathbattle.startDeathBattle = function(msg, parameters) {
    msg.reply("Preparing battle...")
    var taunts = ["Defined", "Undefined", "does a flip", "casts ultima", "does a cool pose", "really feels it", "taunts", "Loses"]
    var events = ["gropes", "roasts", "bullies", "intimidates", "casts fire on", "Dunks", "pokes", "strokes", "calls out", "insults", "dances for", "really feels", "shoots", "licks", "whips", "strokes", "sniffs", "tags in", "slams", "backslash's", "down airs", "steals homework from", "ignites", "punches", "bites", "tickles", "Slices", "Pelts", "Clubs", "Bombards", "Carves", "Chops", "Spears", "Brands", "Hammers", "Clouts", "Flogs", "Bombs", "Blasts", "Torpedos", "Blows up", "Stabs", "Plunges", "Slices", "Buffets", "Thwacks", "Whips", "Burns", "Shoots", "Shocks", "Pierces", "Cuffs", "Lashes", "Belts", "Canes", "Straps", "Detonates", "Jabs", "Bats", "Penetrates", "Bumps", "Boots", "Punctures", "Pricks", "Zaps", "Sticks", "Stings", "Trounces", "Whales", "Pummel", "Batters", "Mauls", "Pounds", "Clobber", "Crush", "Bash", "Wallops", "Breaks", "Smashes", "Beats", "Whops", "Whacks", "Punches", "Jumps", "Clocks", "Stuns", "Busts", "Slugs", "Decks", "Boxes", "Kicks", "Bites", "Shoves", "Jolts", "Cuffs", "Crams", "Slams", "Slogs", "Bruises", "Mutilates", "Storms", "Punishes", "Hurts", "Wounds", "Injures", "Impacts", "Agitates", "Besieges"]
    var words = parameters.split(' vs ')
    var bonuses = ["it's super effective!!!", "noice", "but nothing happened..."]
    //SendImage
    var counter = 0;
    var url1 = null;
    var url2 = null;
    console.log('doing things')
    async.parallel([
        function(callback) { searchImageUrl(words[0], function(error, result) { callback(error, result) }) },
        function(callback) { searchImageUrl(words[1], function(error, result) { callback(error, result) }) }
    ], function(error, results) {
        if (error) {
            console.log("deathbattle error" + error);
        }
        console.log("did things")
        console.log(results);
        url1 = results[0]
        url2 = results[1]
        createDeathBattleImg(url1, url2, msg, function() {
            //Battle
            var whoozeTurn = true
            var turn = function() {
                var attackString = `${words[Number(whoozeTurn)]} ${events.random()} ${words[Number(!whoozeTurn)]}`
                if (RNG(1, 5) === 1) {
                    attackString += `, ${bonuses.random()}`
                }
                msg.reply(attackString);

                if (RNG(1, 5) !== 1) {
                    whoozeTurn = !whoozeTurn;
                    setTimeout(turn, 420 * RNG(6, 9));
                }
                else {
                    var winMessage = `${words[Number(whoozeTurn)]} ${taunts.random()}`
                    msg.reply(winMessage);
                    replyImageSearchURL(`${words[Number(whoozeTurn)]}`, msg);
                }
            }
            turn();
        });
    })
}

exports.Deathbattle = Deathbattle;
