
var MarketDataProcessor = require('../classes/MarketDataProcessor.js');


function returnResult(req, res, container) {
    res.json(container);
}
module.exports = {
    create: function (req, res) {
        
        
         if(! req.body.interval )
         {
            return res.json(200, {err: 'interval required'}); 
         }

          if(! req.body.end )
         {
            return res.json(200, {err: 'end required'}); 
         }

          if(! req.body.start )
         {
            return res.json(200, {err: 'start required'}); 
         }

          if(! req.body.market )
         {
            return res.json(200, {err: 'market required'}); 
         }
         var marketdataProcessor = new MarketDataProcessor( req.body.market , req.body.start , req.body.end , req.body.interval )
         
         marketdataProcessor.fetchMarketData()
         .then(container=>{
                res.json(container);
         });
    },
    subscribe: function (req, res) {
        sails.sockets.join(req, req.query.param);
        res.json(req.query.param);
    }
};