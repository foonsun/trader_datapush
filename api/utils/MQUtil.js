RedisSMQ = require('rsmq');
rsmq = new RedisSMQ( {host: sails.config.globals.host, port: sails.config.globals.port, ns: sails.config.globals.ns} );

var MQUtil = function(){};

MQUtil.create = function(qname){
    return new Promise((resolve,reject)=>{
        rsmq.createQueue({qname:qname}, function (err, resp) {
            if (resp===1) {
            resolve(resp)
            }
            if(err)
            {
                reject(err);
            }
        });
    });

}

MQUtil.sendMessage = function(qname,message){
    return new Promise((resolve,reject)=>{
        rsmq.sendMessage({qname:qname, message:message}, function (err, resp) {
            if (resp) {
                resolve(resp);
            }
            if(err)
            {
                reject(err);
            }

        });
    });

}

MQUtil.receiveMessage = function(qname,vt){
    //sails.log.debug("MQUtil.receiveMessage",qname);
    return new Promise((resolve,reject)=>{
            rsmq.receiveMessage({qname:qname,vt:vt}, function (err, resp) {
                if (resp.id) {
                    //sails.log.debug("MQUtil.receiveMessage id",resp.id);
                    resolve(resp);  
                }else
                {
                    resolve(resp.id);
                }

                if(err)
                {
                    reject(err);
                }
            });
    });

}

MQUtil.deleteMessage = function(qname,id){
    return new Promise((resolve,reject)=>{
           rsmq.deleteMessage({qname:qname, id:id}, function (err, resp) {
                if(err)
                {
                    reject(err);
                }

                if (resp===1) {
                    resolve(sails.config.globals.delet_success);
                }
                else {
                    sails.log.error({error:'delet_msg_not_found'});
                   resolve(sails.config.globals.delet_msg_not_found);
                }
            });
    });

}
module.exports = MQUtil;