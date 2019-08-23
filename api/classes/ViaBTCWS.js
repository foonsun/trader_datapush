let SubscribeUtil    = require('../utils/SubscribeUtil');
var W3CWebSocket     = require('websocket').w3cwebsocket;

class ViaBTCWS{
	
	constructor( market,msg,socketIO)
	{
		this.market           = market;
        this.msg              = msg;
        this.socketIO         = socketIO;               
	}

    reconnect()
    {
        sails.log.error('reconnecting###');
        this.connect();
    }




    connect()
    {
        this.client           = new W3CWebSocket(sails.config.globals.ws_viabtc);
        this.client.onerror = ()=> {
            sails.log.error('Connection Error');
        }
 
        this.client.onopen = ()=> {
            // sails.log.info('WebSocket Client Connected:',this.msg);
            this.client.send(this.msg.marketMsg);
            this.client.send(this.msg.stateMsg);
            this.client.send(this.msg.dealsMsg);
            this.client.send(this.msg.marketMsg);
            this.client.send(this.msg.depthMsg);  
        }

        this.client.onclose = () => {
            // sails.log.info('Client Closed,Client reconnecting');
            this.reconnect();
        };

        this.client.onmessage = (e)=> {
           
            var data = JSON.parse(e.data);
            var container = {};

            if( data.method == "kline.update")
            {
                SubscribeUtil.processMarket(data.params,container);
                // console.log("kline.update",data.params);
            }

            if( data.method == "state.update")
            {
                container.header = data.params;
                // console.log("state.update",data);   
            }

            if( data.method == "deals.update")
            {
                container.markethistory = data.params;
                // console.log("deals.update",data.params);
            }

            if( data.method == "depth.update")
            {
    
               container.orderflag = data.params[0];
               
               if( data.params[1].asks && data.params[1].asks.length > 0)
               {
                    SubscribeUtil.processOrderBookSell(data.params[1].asks,data.params[2],container);
               }
               
               if( data.params[1].bids && data.params[1].bids.length > 0)
               {
                    SubscribeUtil.processOrderBookBuy(data.params[1].bids,data.params[2],container);
               }
            }

            if( this.socketIO )
            {
                this.socketIO.emit(this.market,this.container);
            }else
            {
                sails.sockets.broadcast(this.market,this.market,container);
            }
            
        };
    }

    
}

module.exports = ViaBTCWS;