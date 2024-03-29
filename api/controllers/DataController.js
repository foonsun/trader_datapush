/**
 * 这些数据将直接重middleserver获取，废止
 */
var scheduler = require('node-schedule');
const request = require('request');
const url_str = sails.config.globals.server_viabtc;
const NodeCache = require( "node-cache" );
const cache = new NodeCache();

function getFinishedOrder(req, res,container) {
    var headers = {
        "content-type": "application/json"
    };
    var options = {
        url: url_str,
        method: 'POST',
        headers: headers,
        json: {
            id: 10,
            method: "order.finished",
            params: [parseInt(req.body.userid, 10), req.body.market, 0, 0, 0, 30, 0]
        }
    };

    console.log("order.finished",JSON.stringify(options.json));

    request.post(options, function(error, response, body) {
        if (!body) {
            return;
        }
        if (body.error) {
            console.log("error message:" + body.error.message);
            container.error = body.error;
            returnResult(req, res, container);
            return
        } else {
            container.finishedOrder = body.result;
            //console.log("container.finishedOrder",container.finishedOrder);
            getBalance(req, res,container);
        }
    });
}

function GetDateStr(AddDayCount) 
{ 
    var dd = new Date(); 
    dd.setDate(dd.getDate()+AddDayCount);
    return dd.getTime(); 
}


///////////////////////////////////
//user data    start          /////
///////////////////////////////////


function getBalance(req, res,container) {

    if(req.body.userid=="0")
    {
         getOpenOrders(req, res,container);
         return;
    }

    var headers = {
        "content-type": "application/json"
    };
    var options = {
        url: url_str,
        method: 'POST',
        headers: headers,
        json: {
            id: parseInt(req.body.userid, 10),
            method: "balance.query",
            params: [parseInt(req.body.userid, 10)]
        }
    };

    request.post(options, function(error, response, body) {
        if (!body) {
            return;
        }

        if (body.error) {
            console.log("error message:" + body.error.message);
            container.error = body.error;
            returnResult(req, res, container);
            return
        } else {
            container.balance = body.result;
            getOpenOrders(req, res,container);
        }
    });
}


function getOpenOrders(req, res,container) {
   
    if(req.body.userid=="0")
    {
         returnResult(req, res,container);
         return;
    }

    var headers = {
        "content-type": "application/json"
    };
    var options = {
        url: url_str,
        method: 'POST',
        headers: headers,
        json: {
            id: parseInt(req.body.userid, 10),
            method: "order.pending",
            params: [parseInt(req.body.userid, 10), req.body.market, 0, 20]
        }
    };
    request.post(options, function(error, response, body) {
        if (!body) {
            return;
        }
        if (body.error) {
            console.log("error message:" + body.error.message);
            container.error = body.error;
            returnResult(req, res, container);
            return
        } else {
            container.openOrders = body.result;
            returnResult(req, res,container);
        }
    });

}

///////////////////////////////////
//user data   end             /////
///////////////////////////////////

function returnResult(req, res,container) {
    var ret = {};
    ret.container = container;
    res.json(ret);
}

module.exports = {
    create: function(req, res) {
        var container = {}; 
        getFinishedOrder(req, res,container);
    },
    subscribe: function (req, res) {
		if(! req.query.param )
        {
            return res.json(200, {err: 'param required'}); 
        }

        sails.sockets.join(req, req.query.param);

        res.json(stateArray);
    }
};