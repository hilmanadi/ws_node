var express = require("express");
var mysql = require("mysql");
var app = express();

module.exports = {
   dbconn:function(){
	   	var conn = mysql.createConnection({
				host:'localhost',
				user:'root',
				password:'',
				database:'digital',
				multipleStatements:true
		});

		conn.connect((err)=>{
			if(err) throw err;
			console.log('Mysql connect .. ');
		});

		return conn
   }
}