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
										// x = testingbro.test.length+1;
										res.status(404).json({"status":400,'error':erry});
										next(erry);

									}else{
										var testingbro1 = routeModule.cekthis(sp,testingbro.test[i],JSON.stringify(ress));
										let execquery11 = x.query(testingbro1.execsp,testingbro1.dt,(errx,resss)=>{
											if(errx){
												 console.log(errx);
												 // sdas=false;
												 // console.log(sdas);
												 // res.status(404).json({"status":400,"error":errx});
												 next(errx);
											}else{
												var arrtesting = [];
									
												if(Array.isArray(resss)===false){
													arrtesting.push(JSON.parse(JSON.stringify(resss)));
													if(arrtesting[0].affectedRows==1){
														// console.log(arrtesting);
														// arraaa.push[arrtesting[0]];
														console.log(arrtesting[0]);
														// res.status(200).json({'status':200,'error':null,'response':'success'});
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
								// console.log(arraaa);
								// console.log(sdas);
							}
							console.log(xeww);
							// console.log(sdas);

							// setTimeout(() => {
							//     console.log(sdas);
							// });
							// res.status(200).json({'status':200,'error':null,'response':'success'});
							
						}
					});

					
					// res.end();
					// res.send({'status':200,'error':null,"response":'success'});
				}
			}	
		})
});
				// 	l
				// }else if(flag=='array'){
				// 	var arr1 = [];
				// 	var arr2 = [];
				// 	var idx;
				// 	for(let i=0;i<testingbro.dt.length;i++){
				// 		if((testingbro.dt[i].constructor===Array)===true){
				// 			idx = i;
				// 			arr2.push(JSON.stringify(testingbro.dt[i]));
				// 		}else{
				// 			arr1.push(testingbro.dt[i]);
				// 		}
				// 	}


				// }
				// var idx;
				// var newarrayku = [];
				// for(let i=0;i<testingbro.dt.length;i++){
				// 	if((testingbro.dt[i].constructor===Array)===true){
				// 		idx = i;
				// 		newarrayku.push(JSON.stringify(testingbro.dt[i]));
				// 	}else{
				// 		newarrayku.push(testingbro.dt[i]);
				// 	}
				// }
				
				// let execquery1 = x.query(testingbro.execsp,newarrayku,(errx,resss)=>{
				// 	if(errx){
				// 		 res.send({"status":400,"error_message":errx});
				// 		 next(errx);
				// 	}else{
				// 		var arrtesting = [];
						
				// 		if(Array.isArray(resss)===false){
				// 			arrtesting.push(JSON.parse(JSON.stringify(resss)));
				// 			if(arrtesting[0].affectedRows==1){
				// 				res.send({"status":200,"error":null,"response":"Success"});
				// 			}else{
				// 				res.send({"status":200,"error":null,"response":"Failed"});
				// 			}	
				// 		}else{

				// 			if(resss[0].length==0){
				// 				res.send({"status":200,"error":null,"response":'No Data'});
				// 			}else{
				// 				res.send({"status":200,"error":null,"response":resss[0]})
				// 			}	
				// 		}

				// 		///
				// 		// var aww = JSON.parse(newarrayku[idx]);
				// 		// for(let i=0;i<aww.length;i++){
				// 		// 	if((aww[i].constructor === Object) === true){
				// 		// 		if("spname" in aww[i]){
				// 		// 			var spn = aww[i].spname;
				// 		// 			let sqll =  'select * from information_schema.parameters where specific_name ="'+spn+'"';
				// 		// 			let execquery = x.query(sqll,(err,ress)=>{
				// 		// 				if(err) {
				// 		// 					res.send({"status":400,"error_message":err});
				// 		// 					next(err);
				// 		// 				}else{
				// 		// 					var testingbro1 = routeModule.cekthis(spn,aww[i],JSON.stringify(ress));
				// 		// 					let execquery1 = x.query(testingbro1.execsp,testingbro1.dt,(errx,resss)=>{
				// 		// 						if(errx){
				// 		// 							 res.send({"status":400,"error_message":errx});
				// 		// 							 next(errx);
				// 		// 						}else{
				// 		// 							console.log(resss);
				// 		// 						}
				// 		// 					});
				// 		// 				}
				// 		// 			})
				// 		// 		}
				// 		// 	}
				// 		// }
				// 		///
				// 	} 
				// })	
		


	// if(spname=='sp_select_buku'){
	// 	let sql = "CALL sp_select_buku";
	// 	let execquery = x.query(sql,(err,ress)=>{
	// 		if(err) throw err;
	// 		res.send({"status":200,"error":null,"response":ress});
	// 	})
	// }else if (spname=='sp_search_w_buku'){
	// 	let sql = "CALL sp_search_w_buku(?,?,?,?)";
	// 	let dt1 = req.body.nama_buku
	// 	let dt2 = req.body.kode_buku
	// 	let dt3 = req.body.jenis
	// 	let dt4 = req.body.tahun

	// 	let execquery = x.query(sql,[dt1,dt2,dt3,dt4],(err,ress)=>{
	// 		if(err) throw err;
	// 		res.send({"status":200,"error":null,"response":ress});
	// 	})
	// }else{
	// 	res.send("ahay");
	// }

// app.get("/", (req, res, next) => {
// 		res.send('hello');
// });

// app.get("/url", (req, res, next) => {
// 		res.json(["Tony","Lisa","Michael","Ginger","Food"]);
// });