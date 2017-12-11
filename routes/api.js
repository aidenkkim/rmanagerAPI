var express = require('express');

var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 3,
    host: '125.131.73.28',
    port: '53306',
    user: 'root',
    database: 'rmanager',
    password: 'wook1136'
});



var MESSAGE = {
    "NotValid" : "Not Valid Start Date Format"
}

var QUERYFORMAT = {
    "QUERY" : "SELECT * FROM OnlineScraping_info"
}



/* GET home page. */
router.get('/booking/date', function (req, res, next) {

    var start_date = req.query.start;
    var end_date = req.query.end;
    var query=null;

    pool.getConnection(function (err, connection) {
            //Neither Start and End date Define
            if(start_date === undefined && end_date === undefined){
                query = QUERYFORMAT.QUERY;
            }
            //Start Define and End UnDefine
            else if(start_date != undefined && end_date === undefined){
                if(start_d = dateFormat(start_date)) {
                    query = QUERYFORMAT.QUERY+" WHERE reservedate >= '"+start_d+"'";
                }
                else{
                    return printMessage(res);
                }
            }
            //Start UnDefine and End Define
            else if(start_date === undefined && end_date != undefined){
                if(end_d = dateFormat(end_date)) {
                    query = QUERYFORMAT.QUERY+" WHERE reservedate <= '"+end_d+"'";
                }
                else{
                    return printMessage(res);
                }
            }
            //Both Start and End date Define
            else if(start_date != undefined && end_date != undefined){
                if((end_d = dateFormat(end_date)) && (start_d = dateFormat(start_date))) {
                    query = QUERYFORMAT.QUERY+" WHERE reservedate between '"+start_d+"' and '"+end_d+"'";
                }
                else{
                    return printMessage(res);
                }
            }

        connection.query(query, function (err, rows) {
            if (err) console.error("err : " + err);

            var result = {"count":rows.length, "data":rows, "valid":true};
                console.log(JSON.stringify(rows));

            res.json(result);
            connection.release();
            console.log(typeof(res));
            console.log(typeof(result));
        });
    });
});


//Check the length for URI Query String
//Transform the URI Query String to date
function dateFormat(str){
    if(str.length != 6)                 //Check the date length
        return false;
    return "20"+str.substring(0,2)+"-"+str.substring(2,4)+"-"+str.substring(4,6);
}

function printMessage(res) {
    result = {"count":0, "data":[],"valid":false };
    res.send(result);
    console.log(MESSAGE.NotValid);
    return;
}


module.exports = router;

