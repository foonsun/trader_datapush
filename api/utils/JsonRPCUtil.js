const request = require('request');
const url_str = sails.config.globals.server_viabtc;  

var JsonRPCUtil = function(){};

JsonRPCUtil.Post = function(jsondata,url){
   
    if(!url)
    {
    	url = url_str;
    }

	return new Promise((resolve, reject) => {

            var headers = {"content-type": "application/json"};
            var options = {
                            url: url,
                            method: 'POST',
                            headers: headers,
                            json: jsondata
                        };              
           
            request.post(options, (error, response, body)=> {
                
                if (!body) {
                    return reject(error);
                }
                if (body.error) {
                    var error = {};
                    error.message = body.error;
                    return reject(error);
                } else {
                    return resolve(body);
                }
            });

	});
	

}

module.exports = JsonRPCUtil;