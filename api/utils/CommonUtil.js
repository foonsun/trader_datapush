
var CommonUtil = function(){};

CommonUtil.sleep = function(ms){
     return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
CommonUtil.formatMaketData = function(data){
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
    return result;
}

module.exports = CommonUtil;