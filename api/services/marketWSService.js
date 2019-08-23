let SubscribeUtil = require('../utils/SubscribeUtil');
var ViaBTCWS      = require('../classes/ViaBTCWS.js');

module.exports = {
    Execute: function(socketIO) {
        for (var i = sails.config.globals.market.length - 1; i >= 0; i--) {
            var market = sails.config.globals.market[i].market.replace("/", "")
            var msg    = SubscribeUtil.getSendMessage(market,sails.config.globals.interval_param)
            var viaBTCWS = new ViaBTCWS(market,msg,socketIO);
            viaBTCWS.connect();
        }    
    }
}