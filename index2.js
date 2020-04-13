var express = require("express");
var bodyParser = require("body-parser");
var myModule = require('./config.js');
var routeModule = require('./route.js');

var app = express();
var port = 3000;

let x = myModule.dbconn();

app.use((req, res, next) => {
	  res.header('Access-Control-Allow-Origin', '*')
	  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
	  res.header('Access-Control-Allow-Credentials', true)
	  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials')
	  next()
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.listen(port, () => {
		console.log("Server running on port "+port);
});

app.post("/",(req,res,next)=>{
	var newarr = [];
	dt = req.body;
	if(req.headers['content-type'].includes('text')){
		dt = JSON.parse(req.body);
	}
	let spname = dt.spname;

	let sql =  'select * from information_schema.parameters where specific_name ="'+spname+'"';
	let execquery = x.query(sql,(err,ress)=>{
			if(err) {
				res.send({"status":400,"error_message":err});
				next(err);
			}else{
				var testingbro = routeModule.cekthis(spname,dt,JSON.stringify(ress));
				
				if(testingbro.test.length==0){
					let execquery1 = x.query(testingbro.execsp,testingbro.dt,(errx,resss)=>{
						if(errx){
							 res.send({"status":400,"error_message":errx});
							 next(errx);
						}else{
							var arrtesting = [];
							
							if(Array.isArray(resss)===false){
								arrtesting.push(JSON.parse(JSON.stringify(resss)));
								if(arrtesting[0].affectedRows==1){
									res.send({"status":200,"error":null,"response":"Success"});
								}else{
									res.send({"status":200,"error":null,"response":"Failed"});
								}	
							}else{

								if(resss[0].length==0){
									res.send({"status":200,"error":null,"response":[]});
								}else{
									res.send({"status":200,"error":null,"response":resss[0]})
								}	
							}
						}
					});
				}else{
					var p1 = new Promise(function(resolve,reject){
						x.query(testingbro.execsp,testingbro.dt,(errx,resss)=>{
							let response = {};
							if(errx){
								 resolve({"status":400,"error":errx})
							}else{
								var arrtesting = [];
								
								if(Array.isArray(resss)===false){
									arrtesting.push(JSON.parse(JSON.stringify(resss)));
									if(arrtesting[0].affectedRows>0){
										resolve({"status":200,"error":null,"response":"Success"})
									}else{
										resolve({"status":200,"error":null,"response":"Failed"})
									}	
								}else{

									if(resss[0].length==0){
										resolve({"status":200,"error":null,"response":"No Data"})
									}else{
										resolve({"status":200,"error":null,"response":resss[0]})
									}	
								}
							}
						});
					})
    
					p1.then(function (resolve, reject){
						if(resolve.status == 400){
						 	res.send(resolve);
							return
						}else{
							for(let i=0;i<testingbro.test.length;i++){
								let sp = testingbro.test[i].spname;
								let sq1 = 'select * from information_schema.parameters where specific_name ="'+sp+'"';

								let execquery = x.query(sq1,(erry,rs)=>{
									if(erry){
										res.send({"status":400,"error":erry});
									}else{
										var testingbro1 = routeModule.cekthis(sp,testingbro.test[i],JSON.stringify(rs));

										var p2 = new Promise(function(resolvee,rejectt){
											x.query(testingbro1.execsp,testingbro1.dt,(errq,ressq)=>{
												if(errq){
													resolvee({"status":400,"error":errq});
												}
												else{
													var arrtesting1 = [];
									
													if(Array.isArray(ressq)===false){
														arrtesting1.push(JSON.parse(JSON.stringify(ressq)));
														console.log(arrtesting1[0]);
														if(arrtesting1[0].affectedRows>0){
															resolvee({"status":200,"error":null,"index":i,"response":"Success"})
														}else{
															resolvee({"status":200,"error":null,"index":i,"response":"Failed"})
														}	
													}else{
														if(ressq[0].length==0){
															resolvee({"status":200,"error":null,"response":"No Data"});
														}else{
															resolvee({"status":200,"error":null,"response":ressq[0]});
														}	
													}
												}
											});
										});


									    p2.then(function(resolvee,rejectt){
									    	if(resolvee.status==400){
									    		res.send(resolvee);
									    		return;
									    	}else{
									    		res.send(resolvee);
									    	}
									    });
									}
								});
							}
						}
					});
				}
			}	
		})
});