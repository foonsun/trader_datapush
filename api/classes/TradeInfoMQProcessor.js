let JsonRPCUtil     = require('../utils/JsonRPCUtil');
let MQUtil          = require('../utils/MQUtil');
let CommonUtil          = require('../utils/CommonUtil');

class TradeInfoMQProcessor{
	constructor(socketIO)
    {
      this.socketIO = socketIO;
       TradeInfoMQProcessor.instance = this;            
    }


     _deleteMessage(id)
    {
        try{
            MQUtil.deleteMessage( sails.config.globals.change_mq_info, id);    
        }catch(exception)
        {
            sails.log.error(exception);
        }
    }

    async execute()
    {
      MQUtil.receiveMessage(sails.config.globals.change_mq_info)
      .then( async (resp)=>{
       // sails.log.info('TradeInfoMQProcessor execute process message queue.');
       
       if( resp && resp.message )
       {

           let tradeObject = JSON.parse(resp.message);
           sails.log.debug('TradeInfoMQProcessor tradeObject:',tradeObject);
           try
           {
             
             if( !tradeObject || !tradeObject.userid)
             {
                
                this._deleteMessage(resp.id);
             }
             else
             {
                
                if(this.socketIO)
                {
                  this.socketIO.emit(tradeObject.userid,tradeObject);
                  sails.sockets.broadcast(tradeObject.userid,tradeObject.userid,tradeObject);
                }
                else
                {
                  sails.sockets.broadcast(tradeObject.userid,tradeObject.userid,tradeObject);
                }
                this._deleteMessage(resp.id);
             }  
           }catch(exception)
           {
              sails.log.error("SendConfirmProcessor.execute",exception);
           }
       }
       else
       {
          await CommonUtil.sleep(sails.config.globals.no_data_sleep);
       } 
        this.execute();
      })
    

    }

}
module.exports = TradeInfoMQProcessor;