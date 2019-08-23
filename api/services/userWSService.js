var TradeInfoMQProcessor      = require('../classes/TradeInfoMQProcessor.js');

module.exports = {
    Execute: function(socketIO) {
    	 sails.log.info("userWSService start:")
         var processor = new TradeInfoMQProcessor(socketIO);
         processor.execute();   
    }
}