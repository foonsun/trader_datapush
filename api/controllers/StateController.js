
var MarketStatus      = require('../classes/MarketStatus.js');
var scheduler         = require('node-schedule');
const market_config   = sails.config.globals.market;
const interval_config = sails.config.globals.interval; 
let stateArray = [];
 
scheduler.scheduleJob("*/3 * * * * *", async ()=>{
 	 	
	
    stateArray = [];
    for (var i = market_config.length - 1; i >= 0; i--) {
            
            var marketStatus = new MarketStatus( market_config[i].market , market_config[i].coin );
            var data = {};
            data.market = market_config[i].market;
            data.coin   = market_config[i].coin;
            data.result = await marketStatus.fetchMarketStatus();
            stateArray.push(data);
    } 

	sails.sockets.broadcast( "STATE", "STATE", stateArray );
    
 })

module.exports = {
	subscribe: function (req, res) {
		if(! req.query.param )
        {
            return res.json(200, {err: 'param required'}); 
        }

        sails.sockets.join(req, req.query.param);

        res.json(stateArray);
    }
	
};

