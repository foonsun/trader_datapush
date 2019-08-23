
let JsonRPCUtil     = require('../utils/JsonRPCUtil');
let CommonUtil      = require('../utils/CommonUtil');

///////////////////////////////////
//public data                 /////
///////////////////////////////////

class MarketDataProcessor{

    constructor( market , start , end , interval )
    {
        this.market        = market;
        this.start         = start;
        this.end           = end;
        this.interval      = interval;
        this.container     = {};               
    }

    async fetchMarketData()
    {
        let marketHistoryResp;
        try{
            marketHistoryResp = await JsonRPCUtil.Post({
                id:20, 
                method: "market.deals",
                params: [this.market, 10, 1]
             })
        }catch(exception)
        {
            sails.log.error(exception)
        }

        this.container.markethistory = marketHistoryResp.result;

        let orderBookBuyResp;
        try{
            orderBookBuyResp = await JsonRPCUtil.Post({
                id: 21,
                method: "order.book",
                params: [this.market, 2, 0, 100]
            })
        }catch(exception)
        {
            sails.log.error(exception)
        }

        this.container.orderBookBuy = orderBookBuyResp.result;


        let orderBookSellResp;
        try{
            orderBookSellResp = await JsonRPCUtil.Post({
                id: 22,
                method: "order.book",
                params: [this.market, 1, 0, 100]
            })
        }catch(exception)
        {
            sails.log.error(exception)
        }

        this.container.orderBookSell = orderBookSellResp.result;



        let marketResp;
        try{
            marketResp = await JsonRPCUtil.Post({
                id: 23,
                method: "market.kline",
                params: [
                        this.market,
                        parseInt((this.start + "").substring(0, 10), 10),
                        parseInt((this.end + "").substring(0, 10), 10),
                        parseInt(this.interval, 10)
                        ]
            })
        }catch(exception)
        {
            sails.log.error(exception)
        }

        this.container.market = CommonUtil.formatMaketData(marketResp.result);


        let headerResp;
        try{
            headerResp = await JsonRPCUtil.Post({
                id: 24,
                method: "market.status_today",
                params: [this.market]
            })
        }catch(exception)
        {
            sails.log.error(exception)
        }

        this.container.header = headerResp.result;
        return this.container;
    }

}

module.exports = MarketDataProcessor;