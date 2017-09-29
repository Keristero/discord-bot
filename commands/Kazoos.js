var commands = require("../server.js");
var functions = require("../functions.js").Functions;
var AliExpressSpider = require('aliexpress');

var command = {
    name: "aliexpress",
    help: "(aliexpress searchterm budget) will return how many you could buy",
    fn: function(msg, parameters) {
        var words = parameters.split(' ');
        var searchParams = {keyword:words[0]};
        AliExpressSpider.Search(searchParams).then(function(d) {
            if(d.list.length > 0){
                /*
                d.list.sort(function(a, b) {
                    var pricea = processAliPrice(a.price)
                    var priceb = processAliPrice(b.price)
                    return parseFloat(pricea) - parseFloat(priceb);
                });
                */
                var price = processAliPrice(d.list[0].price)
                var moneyToSpend = Number(words[1]);
                var count = (moneyToSpend/price)
                msg.reply(`According to the first result on aliexpress you could buy ${count} ${words[0]}s with $${moneyToSpend} USD`);
            }
        })
    }
}

function processAliPrice(priceString){
    var prices = priceString.split(" ")
    var firstprice = prices[1].split("-")[0]
    var number = firstprice.replace(/[^0-9\.-]+/g,"");
    return number
}

exports.command = command;
