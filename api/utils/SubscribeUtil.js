var SubscribeUtil = function(){};

SubscribeUtil.getSendMessage = function(market,interval){
        var msg = {}; 

        var marketMsg = JSON.stringify({
                                        id: 10, 
                                        method: "kline.subscribe", 
                                        params: [ market , interval]
                                    });             

        var stateMsg = JSON.stringify({
                                        id: 11, 
                                        method: "state.subscribe", 
                                        params: [ market ,market ]
                                    });

        var dealsMsg = JSON.stringify({
                                        id: 12, 
                                        method: "deals.subscribe", 
                                        params: [ market ]
                                     });

        var depthMsg = JSON.stringify({
                                        id: 13, 
                                        method: "depth.subscribe", 
                                        params: [ market,100,"0"]
                                    });
        msg.marketMsg = marketMsg;
        msg.stateMsg  = stateMsg;
        msg.dealsMsg  = dealsMsg;
        msg.depthMsg  = depthMsg; 

        return msg;
}


SubscribeUtil.processMarket = function(data,container){
    result = [];
    for (var i = 0; i < data.length; i++) {
        var tmp = [];
        tmp.push(data[i][0] * 1000);
        tmp.push(parseFloat(data[i][1]));
        tmp.push(parseFloat(data[i][2]));
        tmp.push(parseFloat(data[i][3]));
        tmp.push(parseFloat(data[i][4]));
        tmp.push(parseFloat(data[i][5]));
        tmp.push(parseFloat(data[i][6]));
        result.push(tmp);
    }
    container.market = result;  
}

SubscribeUtil.processOrderBookSell = function(data,market,container)
{
    result = [];
    for (var i = 0; i < data.length; i++) {
        var ask = {};
        ask.market = market;
        ask.left   = data[i][1];
        ask.price  = data[i][0];
        result.push(ask);
    }
    container.orderBookSell = {};
    container.orderBookSell.orders=result;  
    console.log("container.orderBookSell.orders",container.orderBookSell.orders);

}

SubscribeUtil.processOrderBookBuy = function(data,market,container){
    data.orderBookBuy
    result = [];
    for (var i = 0; i < data.length; i++) {
        var bid = {};
        bid.market = market;
        bid.left   = data[i][1];
        bid.price  = data[i][0];
        result.push(bid);
    }
    container.orderBookBuy = {};
    container.orderBookBuy.orders=result;  
    console.log("container.orderBookBuy.orders",container.orderBookBuy.orders);

}

module.exports = SubscribeUtil;