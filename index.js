var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
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
					let execquery1 = x.query(testingbro.execsp,testingbro.dt,(errx,resss)=>{
						let response = {};
						if(errx){
							 res.status(404).json({"status":400,'error':errx });
							 next(errx);
						}else{
							var arrtesting = [];
							
							if(Array.isArray(resss)===false){
								arrtesting.push(JSON.parse(JSON.stringify(resss)));
								if(arrtesting[0].affectedRows==1){
									console.log('success');
								}else{
									console.log('failed');
								}	
							}else{

								if(resss[0].length==0){
									console.log('nodata');
								}else{
									console.log('ada data');
								}	
							}
							var xeww = [];
							for(let i=0;i<testingbro.test.length;i++){
								xeww.push(i);
								let sp = testingbro.test[i].spname;
								let sql1 = 'select * from information_schema.parameters where specific_name ="'+sp+'"';
								let execquery = x.query(sql1,(erry,ress)=>{
									if(err) {
										res.status(404).json({"status":400,'error':erry});
										next(erry);

									}else{
										var testingbro1 = routeModule.cekthis(sp,testingbro.test[i],JSON.stringify(ress));
										let execquery11 = x.query(testingbro1.execsp,testingbro1.dt,(errx,resss)=>{
											if(errx){
												 console.log(errx);
												 next(errx);
											}else{
												var arrtesting = [];
									
												if(Array.isArray(resss)===false){
													arrtesting.push(JSON.parse(JSON.stringify(resss)));
													if(arrtesting[0].affectedRows==1){
														console.log(arrtesting[0]);
													}else{
														console.log(arrtesting[0]);
													}	
												}else{
													if(resss[0].length==0){
														console.log('nodata');
													}else{
														console.log('ada data');
													}	
												}
											}
										})
									}
								})
							}
							
						}
					});
				}
			}	
		})
});