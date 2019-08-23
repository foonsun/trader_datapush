let JsonRPCUtil     = require('../utils/JsonRPCUtil');

class MarketStatus{
	constructor( market,coin )
    {
        this.market       = market;
        this.coin         = coin;
                 
    }

    async fetchMarketStatus()
    {
    	let marketStatusResp;
        try{
            marketStatusResp = await JsonRPCUtil.Post({
                id: 25,
	            method: "market.status_today",
	            params: [this.market.replace("/", "")]
             })
        }catch(exception)
        {
            sails.log.error(exception)
        }

        return marketStatusResp.result;

    }

}
module.exports = MarketStatus;