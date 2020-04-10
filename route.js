var express = require("express");
var arrcheck = [];

// var mysql = require("mysql");


module.exports = {
   cekthis:function(spp,msg,info){

   		if(msg.spname!=null){
   			delete msg.spname;
   		}else{
   			const errcatch = {"status":400,"message":"no spname"};
   			return errcatch
   		}
   		
   		var newarr = [];
		if(msg.hasOwnProperty("test")==true){
			for(let i=0;i<msg.test.length;i++){
				newarr.push(msg.test[i]);
			}

			delete msg.test
		}
		
		var prs = JSON.parse(info);
   		var arrk = Object.keys(msg);
		var arrv = Object.values(msg);

		var newarray = [];

		for (var i = 0; i < arrk.length; i++) {
			var result = {};
			result[arrk[i]] = arrv[i];
			newarray.push(result);
		}

		var matches =[]
	    
	    for ( var i = 0; i < prs.length; i++ ) {
	        for ( var e = 0; e < newarray.length; e++ ) {
	            if ( prs[i].PARAMETER_NAME.includes(Object.keys(newarray[e]))) matches.push(newarray[e]);
	        }
	    }

	    var newarrayfix = [];
	    for(var i=0;i<matches.length;i++){

	    	newarrayfix.push(Object.values(matches[i])[0]);
	    }

	    const arrkeys = prs.length;
   		var strnew = '';

		for(let i=0;i<arrkeys;i++){
   				strnew+='?,';
		}

		var newStr = strnew.slice(0, -1);
		var callsp = 'CALL '+spp+'('+newStr+')';


		return {'execsp':callsp,'dt':newarrayfix,'test':newarr};
   },
}