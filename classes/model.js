var mongoose = require('mongoose');
var apn = require('apn');
var send_push = require('../classes/push_sender');
var error = require('../classes/error');
var utils = require('../classes/utils');
var gallery = require('../classes/gallery');

var fs = require('fs');
//mongoose.connect("mongodb://iAmUser:iAmStudio1@ds053638.mongolab.com:53638/eventos");
mongoose.connect("mongodb://iAmUser:iAmStudio1@ds027450-a0.mongolab.com:27450/dbcaracoltv");
var express = require('express');
var image_url_prefix = "http://caracol.aws.af.cm/images/";
var knox = require('knox');
var gcm = require('node-gcm');
//////////////////////////////////
//DB Schema CRUD starts here//////
//////////////////////////////////
//Admin
var AdminSchema= new mongoose.Schema({
	name: {type: String, required: true,unique: false,},
	email: {type: String, required: true,unique: true,},
	password: {type: String, required: true,unique: false,},
	type: {type: String, required: true,unique: false,},
	app_id_list:{type: Array, required: false,unique: false,},
	role:{type: String, required: true,unique: false,},
}),
	Admin= mongoose.model('Admin',AdminSchema);
//PushToken
var PushTokenSchema= new mongoose.Schema({
	user_id: {type: String, required:true, unique:false,},
	push_token:{type: String, required:false, unique:true,},
	app_id: {type: String, required:false, unique:false,},
	device_brand: {type: String, required:false, unique:false,},
	os: {type: String, required:false, unique:false,},
	type: {type: String, required:false, unique:false,},
}),
	PushToken= mongoose.model('PushToken',PushTokenSchema);
//User
var UserSchema= new mongoose.Schema({
	name: {type: String, required:true, unique:false,},
	date_created:{type: Date, required:false, unique:false,},
	email: {type: String, required:false, unique:false,},
	app_list: {type: Array, required:false, unique:false,},
	facebook_id: {type: String, required:true, unique:false,},
	settings: {type: Array, required:false, unique:false,},
	registered_events: {type: Array, required:false, unique:false,},
	favorited_atoms: {type: Array, required:false, unique:false,},
	favorited_locations: {type: Array, required:false, unique:false,},
}),
	User= mongoose.model('User',UserSchema);
//Tutorial
var TutorialSchema= new mongoose.Schema({
	app_id: {type: String, required:true, unique:false,},
	image_url: {type: Array, required:true, unique:false,},
}),
	Tutorial= mongoose.model('Tutorial',TutorialSchema);
//Atom	
var AtomSchema= new mongoose.Schema({
	app_id: {type: String, required:true, unique:false,},
	//app_name: {type: String, required:true, unique:false,},
	menu_item_id: {type: String, required:true, unique:false,},
	type: {type: String, required:false, unique:false,},
	name: {type: String, required:false, unique:false,},
	publish_time: {type: Date, required:false, unique:false,},
	event_time: {type: Date, required:false, unique:false,},
	detail: {type: String, required:false, unique:false,},
	short_detail: {type: String, required:false, unique:false,},
	location_id: {type: String, required:false, unique:false,},
	image_url: {type: Array, required:false, unique:false,},
	image_url1: {type: String, required:false, unique:false,},
	image_url2: {type: String, required:false, unique:false,},
	image_url3: {type: String, required:false, unique:false,},
	image_url4: {type: String, required:false, unique:false,},
	image_url5: {type: String, required:false, unique:false,},

	gallery: {type: Array, required:false, unique:false,},

	thumb_url: {type: String, required:false, unique:false,},
	category_id: {type: String, required:false, unique:false,},
	category_list: {type: Array, required:false, unique:false,},
	is_draft: {type: Boolean, required:false, unique:false,},
	//is_featured: {type: Boolean, required:false, unique:false,},
	external_url:{type: String, required:false, unique:false,},
	open_inside:{type: String, required:false, unique:false,},
	feature_type: {type: String, required:false, unique:false,},
	expire_date: {type: Date, required:false, unique:false,},
	favorited: {type: Number, required:false, unique:false,},
	youtube_url:{type: String, required:false, unique:false,},
	priority:{type: Number, required:false, unique:false,},
	social_message:{type: String, required:false, unique:false,},
}),
	Atom= mongoose.model('Atom',AtomSchema);
//Location
var LocationSchema= new mongoose.Schema({
	app_id: {type: String, required:true, unique:false,},
	name: {type: String, required:true, unique:false,},
	menu_item_id:{type: String, required:true, unique:false,},
	detail: {type: String, required:false, unique:false,},
	short_detail: {type: String, required:false, unique:false,},
	lat: {type: Number, required:false, unique:false,},
	lon: {type: Number, required:false, unique:false,},
	creation_date: {type: Date, required:false, unique:false,},
	thumb_url: {type: String, required:false, unique:false,},
	image_url: {type: Array, required:false, unique:false,},
	type: {type: String, required:false, unique:false,},
	favorited: {type: Number, required:false, unique:false,},
	youtube_url:{type: String, required:false, unique:false,},
	feature_type: {type: String, required:false, unique:false,},
	category_id: {type: String, required:false, unique:false,},
	category_list: {type: Array, required:false, unique:false,},
	priority:{type: Number, required:false, unique:false,},
	social_message:{type: String, required:false, unique:false,},
}),
	Location= mongoose.model('Location',LocationSchema);
//App
var AppSchema= new mongoose.Schema({
	admin_list: {type: Array, required:false, unique:false,},
	name: {type: String, required:true, unique:true,},
	contact_email: {type: String, required:false, unique:false,},
	is_active:{type: Boolean,required: false,unique: false,},
	logo_wide_url: {type: String,required: false,unique: false,},
	logo_square_url: {type: String,required: false,unique: false,},
	priority:{type: Number, required:false, unique:false,},
	ios_cert: {type: String,required: false,unique: false,},
	ios_cert_key: {type: String,required: false,unique: false,},
	gcm_apikey: {type: String,required: false,unique: false,},
	googleios_apikey: {type: String,required: false,unique: false,},
	googleandroid_apikey: {type: String,required: false,unique: false,},
	google_project_number: {type: String,required: false,unique: false,},
	is_development: {type: Boolean,required: false,unique: false,},
	facebook_tag: {type: String,required: false,unique: false,},
	facebook_url: {type: String,required: false,unique: false,},
	facebook_tag_is_active: {type: Boolean,required: false,unique: false,},
	instagram_tag: {type: String,required: false,unique: false,},
	instagram_url: {type: String,required: false,unique: false,},
	instagram_tag_is_active: {type: Boolean,required: false,unique: false,},
	twitter_tag: {type: String,required: false,unique: false,},
	twitter_url: {type: String,required: false,unique: false,},
	twitter_tag_is_active: {type: Boolean,required: false,unique: false,},
	social_message:{type: String, required:false, unique:false,},
}),
	App= mongoose.model('App',AppSchema);
//MenuItem	
var MenuItemSchema= new mongoose.Schema({
	name:{type: String, required: true,unique: false,},
	type:{type: String, required: true,unique: false,},
	app_id:{type: String, required: false,unique: false,},
	//app_name: {type: String, required:true, unique:false,},
	is_draft: {type: Boolean, required: true,unique: false,},
	style: {type: String, required: false,unique: false,},
	icon_url: {type: String, required: false,unique: false,},
	is_static: {type: Boolean, required: false,unique: false,},
	filter1:{type: String, required:false, unique:false,},
	filter2:{type: String, required:false, unique:false,},
	priority:{type: Number, required:false, unique:false,},
}),
	MenuItem= mongoose.model('MenuItem',MenuItemSchema);
	
//Categories
var CategorySchema= new mongoose.Schema({
	name:{type: String, required: true,unique: false,},
	app_id:{type: String, required: false,unique: false,},
	//app_name: {type: String, required:true, unique:false,},
	priority:{type: Number, required:false, unique:false,},
}),
	Category= mongoose.model('Category',CategorySchema);
	
var CategoryFatherSchema= new mongoose.Schema({
	name:{type: String, required: true,unique: false,},
	app_id:{type: String, required: false,unique: false,},
	//app_name: {type: String, required:true, unique:false,},
	priority:{type: Number, required:false, unique:false,},
}),
	CategoryFather= mongoose.model('CategoryFather',CategoryFatherSchema);
	
var CategorySonSchema= new mongoose.Schema({
	name:{type: String, required: true,unique: false,},
	app_id:{type: String, required: false,unique: false,},
	categoryfather_id:{type: String, required: false,unique: false,},
	priority:{type: Number, required:false, unique:false,},
}),
	CategorySon= mongoose.model('CategorySon',CategorySonSchema);
	
var ImageSchema= new mongoose.Schema({
	name:{type: String, required: false,unique: false,},
	app_id:{type: String, required: false,unique: false,},
	type:{type: String, required: false,unique: false,},
	size:{type: Number, required:false, unique:false,},
	url:{type: String, required: false,unique: false,},
}),
	Image= mongoose.model('Image',ImageSchema);
	
var PushSchema= new mongoose.Schema({
	message:{type: String, required: true,unique: false,},
	app_id:{type: String, required: false,unique: false,},
	date:{type: Date, required: false,unique: false,},
	sent_by:{type: Object , required:false, unique:false,},
	android:{type: Boolean, required: false,unique: false,},
	ios:{type: Boolean, required: false,unique: false,},
	delivered_qty_ios:{type: Number, required: false,unique: false,},
	delivered_qty_android:{type: Number, required: false,unique: false,},
}),
	Push= mongoose.model('Push',PushSchema);
	
var static_priority=1;

//DEV AMAZON BUCKET
//Development AMAZON BUCKET
/*
var client = knox.createClient({
    key: 'AKIAJ32JCWGUBJ3BWFVA'
  , secret: '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'
  , bucket: 'eventosc1'
});
*/

//PRODUCTION AMAZON BUCKET
var client = knox.createClient({
    key: 'AKIAJNHMEXKKOP3TJXLA'
  , secret: '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'
  , bucket: 'eventoscaracol-assets'
});

var types = ['artistas','eventos','noticias','locaciones','general','home','favoritos','configuracion'];
//////////////////////////////////
//End of DB Schema ///////////////
//////////////////////////////////

/*
function sendPush(message,token,action){

	var options = { "gateway": "gateway.sandbox.push.apple.com" };
    var apnConnection = new apn.Connection(options);
    var myDevice = new apn.Device(token);
    var note = new apn.Notification();

	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	note.badge = 1;
	note.sound = "ping.aiff";
	note.alert = message;
	note.payload = {'action': action};
	
	apnConnection.pushNotification(note, myDevice);
};
*/

//////////////////////////////////
//Admin CRUD starts here//////////
//////////////////////////////////
//Create
exports.createAdmin = function(req,res){
console.log("id de app -> "+req.body.app_id_list);
	//id_array = [req.body.app_id_list];
	new Admin({
		name:req.body.name,
		email:req.body.email,
		password:req.body.password,
		type: 'admin',
		//app_id_list: req.body.app_id_list,
		role: 'admin'
	}).save(function(err,admin){
		if(err){
			res.json(err);
		}
		else{
			res.format({
				html: function () { res.redirect('/Dashboard/'+req.body.admin_id); },
				json: function () { res.send(admin); },
			});	
		}
	});
};
//Read One
exports.getAdmin = function(req,res){
	Admin.findOne({_id:req.params._id},function(err,admin){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.send(admin);
		}
	});
};
//Read All
exports.getAdminList = function(req,res){
	Admin.find({},function(err,admins){
		if(admins.length<=0){
			res.json(error.notFound);
		}
		else{
			res.json({response:"success", status:true, admins:admins});
		}
	});
};
//Update
exports.updateAdmin = function(req,res){
	Admin.findOneAndUpdate({_id:req.body.admin_id},
	   {$set:{name:req.body.name,
	   		  email:req.body.email,
	   		  password:req.body.password,
	   		  //app_id_list:req.body.app_id_list,
	   		  }
	   	}, 
	   	function(err,admin){
	   	if(!admin){
		   	res.json(error.notFound);
	   	}
	   	else{
		   	res.format({
				html: function () { res.redirect('/Dashboard/'+req.body.super_admin_id); },
				json: function () { res.send(admin); },
			});
	   	}
		
	});
};
exports.assignAdmin = function(req,res){
//res.json({admin_list:req.body.admin_list, admin_ids:req.body.admin_ids});
	var array = new Array();
	if(req.body.admin_ids instanceof Array){
		for(var i=0;i<req.body.admin_ids.length;i++){
			array.push(req.body.admin_ids[i]);
		}
	}
	else{
		array.push(req.body.admin_ids);
	}
	Admin.update({type:"admin"},{$pull:{app_id_list:req.body.app_id}},{multi:true},
		function(err, numberaffected){
			Admin.update({_id:{$in:array}},{$addToSet:{app_id_list:req.body.app_id}},{multi:true},
				function(err, admins){
			   	res.format({
					html: function () { res.redirect('/Dashboard/'+req.body.super_admin_id); },
					json: function () { res.send(admins); },
				});
			});
	});
};
//Delete
exports.deleteAdmin = function(req,res){
	Admin.remove({_id:req.params.admin_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.format({
				html: function () { res.redirect('/Dashboard/'+req.params.super_admin_id); },
				json: function () { res.send(admin); },
			});
		}
	});
};
//////////////////////////////////
//End of Admin CRUD///////////////
//////////////////////////////////





//////////////////////////////////
//Atom CRUD starts here///////////
//////////////////////////////////
//Create
exports.createAtom = function(req,res){
	//var is_featured=req.body.is_featured==true ? true:false;
	console.log("event time: "+req.body.event_time);
	var event_time= new Date(req.body.event_time? req.body.event_time:0);
	event_time.setHours(event_time.getHours() + 5);
	
		var id_array = new Array();
		if(req.body.category){
			if(req.body.category instanceof Array){
				for(var i=0;i<req.body.category.length;i++){
					id_array.push(JSON.parse(req.body.category[i]));
				}
			}
			else{
				id_array.push(JSON.parse(req.body.category));
			}
		}

		new Atom({
			name:req.body.name,
			event_time:event_time,
			type: req.body.type,
			menu_item_id:req.body.menu_item_id,
			publish_time: new Date(),
			detail: req.body.detail,
			short_detail:req.body.short_detail,
			app_id: req.body.app_id,
			category_list: id_array,
			//app_name: req.body.app_name,
			//image_url: req.body.image_url,
			//thumb_url:req.body.thumb_url,	
			//category_id:req.body.category_id,
			is_active: true,				
			is_draft: false,
			//is_featured: is_featured,
			feature_type: req.body.feature_type,
			location_id:req.body.location_id,
			youtube_url:req.body.youtube_url,
			external_url:req.body.external_url,
			open_inside:req.body.open_inside,
			priority:req.body.priority,
			social_message: req.body.social_message,
			}).save(function(err,atom){		
			if(err){
				res.json(err);			
			}							
			else{		
				uploadImage(req.files.image_url,atom,"atom_image");
		    	uploadImage(req.files.thumb_url,atom,"atom_thumb");
		    	
		    	//Gallery upload
		    	uploadImage(req.files.image_url1,atom,"atom_image1");
		    	uploadImage(req.files.image_url2,atom,"atom_image2");
		    	uploadImage(req.files.image_url3,atom,"atom_image3");
		    	uploadImage(req.files.image_url4,atom,"atom_image4");
		    	uploadImage(req.files.image_url5,atom,"atom_image5");
		    	//End Gallery upload
		    	
				res.format({			
					html: function () { res.redirect('/ItemDashboard/'+req.body.menu_item_id+'/'+req.body.app_id+'/'+req.body.admin_id); },
					json: function () { res.send(atom); },
				});			    
			}
		});

};
//Read One
exports.getAtom = function(req,res){
	Atom.findOne({_id:req.params._id},function(err,atom){
		if(!atom){
			res.json(error.notFound);
		}
		else{
			res.send(atom);
		}
	});
};
//Read All
exports.getAtomList = function(req,res){
	Atom.find({},function(err,atoms){
		if(atoms.length<=0){
			res.json(error.notFound);
		}
		else{
			res.send(atoms);
		}
	});
};
//Update
exports.updateAtom = function(req,res){
//var is_featured=req.body.is_featured==true ? true:false;
//req.body.event_time? req.body.event_time:req.body.previous_event_time

var event_time= req.body.event_time? req.body.event_time:req.body.previous_event_time;//new Date(req.body.event_time? req.body.event_time:req.body.previous_event_time);
	event_time=new Date(event_time);
	if(req.body.event_time){
		event_time.setHours(event_time.getHours() + 5);
	}
	else{
		event_time.setHours(event_time.getHours() + 0);
	}
	console.log("hora update "+event_time+" date: "+req.body.event_time);
	var id_array = new Array();
	if(req.body.category){
		if(req.body.category instanceof Array){
			for(var i=0;i<req.body.category.length;i++){
				id_array.push(JSON.parse(req.body.category[i]));
			}
		}
		else{
			id_array.push(JSON.parse(req.body.category));
		}
	}
	Atom.findOneAndUpdate({_id:req.body.atom_id},
	   {$set:{name:req.body.name,
		event_time:event_time,
		type: req.body.type,
		menu_item_id:req.body.menu_item_id,
		publish_time: new Date(),
		detail: req.body.detail,
		short_detail:req.body.short_detail,
		app_id: req.body.app_id,
		//app_name: req.body.app_name,
		//category_id:req.body.category_id,
		category_list:id_array,
		//image_url: 0,
		//thumb_url: 0,
		is_active: true,
		is_draft: false,
		//is_featured:is_featured,
		feature_type: req.body.feature_type,
		location_id:req.body.location_id},
		youtube_url:req.body.youtube_url,
		external_url:req.body.external_url,
		open_inside:req.body.open_inside,
		priority:req.body.priority,
		social_message: req.body.social_message,
	   	}, 
	   	function(err,atom){
		if(err){
			res.json({error:"error", err:err});
		}
		else{
			uploadImage(req.files.image_url,atom,"atom_image");
		    uploadImage(req.files.thumb_url,atom,"atom_thumb");
		    
		    //Gallery upload
		    	uploadImage(req.files.image_url1,atom,"atom_image1");
		    	uploadImage(req.files.image_url2,atom,"atom_image2");
		    	uploadImage(req.files.image_url3,atom,"atom_image3");
		    	uploadImage(req.files.image_url4,atom,"atom_image4");
		    	uploadImage(req.files.image_url5,atom,"atom_image5");
		    //End Gallery upload
		    	
			res.format({			
				html:function(){res.redirect('/ItemDashboard/'+req.body.menu_item_id+'/'+req.body.app_id+'/'+req.body.admin_id);},
				json:function(){res.send(atom); },
			});
		}
		});
};
function uploadImage1(file,name,atom_id,previous_url){
	var tmp_path_image_url = file.path;
    var extension =".jpg";
    if(file.type=="image/png"){
    	extension=".png";
    }
	var target_path_image_url = './public/images/' + atom_id + name + file.size + extension;
    // move the file from the temporary location to the intended location
    
    var final_image_url=previous_url;
    if(file.size>0){
		/*Async
			fs.rename(tmp_path_image_url, target_path_image_url,function(err){
	        if (err) throw err;
	        final_image_url=image_url_prefix + atom_id + name + extension;
	        // delete the temporary file
	        //fs.unlink(target_path_image_url, function(){});
	    });
		*/
		fs.renameSync(tmp_path_image_url,target_path_image_url);
		console.log("path ->"+target_path_image_url);
		final_image_url=image_url_prefix + atom_id + name + file.size + extension;
	}
	return final_image_url;
}
function uploadImage(file,object,type){
	var tmp_path_image_url = file.path;
    var extension =".jpg";
    if(file.type=="image/png"){
    	extension=".png";
    }
	var target_path_image_url = './public/images/' + file.size + file.name;    
    if(file.size>0){
		fs.renameSync(tmp_path_image_url,target_path_image_url);		
		fs.stat(target_path_image_url, function(err, stat){
		  // Be sure to handle `err`.
			if(err){
				console.log("error "+err)
			}
			else{
				var app_id_var=object.app_id? object.app_id:object._id;
				App.findOne({_id:app_id_var}, function(err,app){
					var req = client.put(app.name+"/"+file.name, {
					      'Content-Length': stat.size,
					      'Content-Type': file.type,
					      'x-amz-acl': 'public-read'
					});
					fs.createReadStream(target_path_image_url).pipe(req);
					req.on('response', function(res){
						fs.unlink(target_path_image_url, function(){});
						new Image({
							name:file.name,
							url:req.url,
							type: file.type,
							size:file.size,
							app_id:app_id_var,
							}).save(function(err,image){	
								if(err){
								}
								else{
								var entry = image.url;
									if(type=="atom_image"){
										Atom.findOneAndUpdate({_id:object._id},{$set:{image_url:entry}}, function(err,atom){
											if(!atom){
											}
											else{
												console.log("success atom image!");
											}
										});
									}
									else if(type=="atom_thumb"){
										Atom.findOneAndUpdate({_id:object._id},{$set:{thumb_url:entry}}, function(err,atom){
											if(!atom){
											}
											else{
												console.log("success atom thumb!");
											}
										});
									}
									
									else if(type=="atom_image1"){
										Atom.findOneAndUpdate({_id:object._id},{$set:{image_url1:entry}}, function(err,atom){
											if(!atom){
											}
											else{
												console.log("success gallery 1!");
											}
										});
									}
									else if(type=="atom_image2"){
										Atom.findOneAndUpdate({_id:object._id},{$set:{image_url2:entry}}, function(err,atom){
											if(!atom){
											}
											else{
												console.log("success gallery 1!");
											}
										});
									}
									else if(type=="atom_image3"){
										Atom.findOneAndUpdate({_id:object._id},{$set:{image_url3:entry}}, function(err,atom){
											if(!atom){
											}
											else{
												console.log("success gallery 1!");
											}
										});
									}
									else if(type=="atom_image4"){
										Atom.findOneAndUpdate({_id:object._id},{$set:{image_url4:entry}}, function(err,atom){
											if(!atom){
											}
											else{
												console.log("success gallery 1!");
											}
										});
									}
									else if(type=="atom_image5"){
										Atom.findOneAndUpdate({_id:object._id},{$set:{image_url5:entry}}, function(err,atom){
											if(!atom){
											}
											else{
												console.log("success gallery 1!");
											}
										});
									}
									
									else if(type=="location_image"){
										Location.findOneAndUpdate({_id:object._id},{$set:{image_url:entry}}, function(err,location){
											if(!location){
											}
											else{
												console.log("success location image!");
											}
										});
									}
									else if(type=="location_thumb"){
										Location.findOneAndUpdate({_id:object._id},{$set:{thumb_url:entry}}, function(err,location){
											if(!location){
											}
											else{
												console.log("success location thumb!");
											}
										});
									}
									else if(type=="icon_url"){
										MenuItem.findOneAndUpdate({_id:object._id},{$set:{icon_url:entry}}, function(err,menuItem){
											if(!menuItem){
											}
											else{
												console.log("success menuItem icon!");
											}
										});
									}
									else if(type=="logo_wide_url"){
										App.findOneAndUpdate({_id:object._id},{$set:{logo_wide_url:entry}}, function(err,app){
											if(!app){
											}
											else{
												console.log("success app logo wide!");
											}
										});
									}
									else if(type=="logo_square_url"){
										App.findOneAndUpdate({_id:object._id},{$set:{logo_square_url:entry}}, function(err,app){
											if(!app){
											}
											else{
												console.log("success app logo square!");
											}
										});
									}							
								}
							});
				  });
			});
			}
		});
	}
}
//Delete
exports.deleteAtom = function(req,res){
	Atom.remove({_id:req.params.atom_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.format({
				html: function () { res.redirect('/ItemDashboard/'+req.params.menuItem_id+'/'+req.params.app_id+'/'+ req.params.admin_id); },
				json: function () { res.send(); },
			});
		}
	});
};
//////////////////////////////////
//End of Atom CRUD////////////////
//////////////////////////////////





//////////////////////////////////
//Location CRUD starts here///////
//////////////////////////////////
//Create
exports.createLocation = function(req,res){
console.log("el detalle "+req.body.detail);
	var id_array = new Array();
	if(req.body.category instanceof Array){
		for(var i=0;i<req.body.category.length;i++){
			id_array.push(JSON.parse(req.body.category[i]));
		}
	}
	else{
		id_array.push(JSON.parse(req.body.category));
	}
		new Location({
			app_id: req.body.app_id,
			menu_item_id: req.body.menu_item_id,
			name: req.body.name,
			short_detail:req.body.short_detail,
			detail: req.body.detail,
			lat: req.body.lat? req.body.lat:0,
			lon: req.body.lon? req.body.lon:0,
			creation_date: new Date(),
			type: req.body.type,
			youtube_url:req.body.youtube_url,
			//feature_type: req.body.feature_type,
			//category_id: req.body.category_id,
			category_list: id_array,
			priority:req.body.priority,
			social_message: req.body.social_message,
			}).save(function(err,location){
				if(err){
					res.json(err);
				}
				else{
				uploadImage(req.files.image_url,location,"location_image");
			    uploadImage(req.files.thumb_url,location,"location_thumb");
				res.format({
					html: function () { res.redirect('/LocationDashboard/'+req.body.menu_item_id+'/'+req.body.app_id+'/'+req.body.admin_id);},
					json: function () { res.send(location); },
				});
				}		
			});
};
//Read One
exports.getLocation = function(req,res){
	Location.findOne({_id:req.params._id},function(err,location){
		if(!location){
			res.json(error.notFound);
		}
		else{
			res.send(location);
		}
	});
};
//Read All
exports.getLocationList = function(req,res){
	Location.find({},function(err,locations){
		if(locations.length<=0){
			res.json(error.notFound);
		}
		else{
			res.send(locations);
		}
	});
};
//Update
exports.updateLocation = function(req,res){
console.log("menu "+req.body.app_id);
	var id_array = new Array();
	if(req.body.category instanceof Array){
		for(var i=0;i<req.body.category.length;i++){
			id_array.push(JSON.parse(req.body.category[i]));
		}
	}
	else{
		id_array.push(JSON.parse(req.body.category));
	}

	Location.findOneAndUpdate({_id:req.body.location_id},
	   {$set:{app_id: req.body.app_id,
		name: req.body.name,
		short_detail:req.body.short_detail,
		detail: req.body.detail,
		lat: req.body.lat? req.body.lat:0,
		lon: req.body.lon? req.body.lon:0,
		creation_date: new Date(),
		type: req.body.type,
		youtube_url:req.body.youtube_url,
		//feature_type: req.body.feature_type,
		//category_id: req.body.category_id,
		category_list: id_array,
		priority:req.body.priority,
		social_message: req.body.social_message,
		}
	   	}, 
	   	function(err,location){
		   	if(err){
				res.json({error:"error", err:err});
			}
			else{
			uploadImage(req.files.image_url, location,"location_image");
		    uploadImage(req.files.thumb_url, location,"location_thumb");
		    res.format({
				html:function(){res.redirect('/LocationDashboard/'+req.body.menu_item_id+'/'+req.body.app_id+'/'+req.body.admin_id); },
				json:function(){res.send(location); },
			});
			}
		});
};
//Delete
exports.deleteLocation = function(req,res){
	Location.remove({_id:req.params.location_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.format({
				html: function () { res.redirect('/LocationDashboard/'+req.params.menuItem_id+'/'+req.params.app_id+'/'+ req.params.admin_id); },
				json: function () { res.send(app); },
			});
		}
	});
};

//////////////////////////////////
//End of Location CRUD////////////
//////////////////////////////////





//////////////////////////////////
//App CRUD starts here////////////
//////////////////////////////////
//Create
exports.createApp = function(req,res){
		new App({
				name: req.body.name,
				contact_email: req.body.contact_email,
				is_active: true,
				ios_cert:req.body.ios_cert,
				ios_cert_key:req.body.ios_cert_key,
				gcm_apikey:req.body.gcm_apikey,
				googleios_apikey:req.body.googleios_apikey,
				googleandroid_apikey:req.body.googleandroid_apikey,
				google_project_number:req.body.google_project_number,
				is_development: req.body.is_development,
				facebook_tag:req.body.facebook_tag,
				facebook_url:req.body.facebook_url,
				facebook_tag_is_active:req.body.facebook_tag_is_active,
				instagram_tag:req.body.instagram_tag,
				instagram_url:req.body.instagram_url,
				instagram_tag_is_active:req.body.instagram_tag_is_active,
				twitter_tag:req.body.twitter_tag,
				twitter_url:req.body.twitter_url,
				twitter_tag_is_active:req.body.twitter_tag_is_active,
				social_message: req.body.social_message,
			}).save(function(err,app){
				if(err){
					res.json(err);
				}
				else{
					uploadImage(req.files.logo_wide_url, app,"logo_wide_url");
					uploadImage(req.files.logo_square_url, app,"logo_square_url");
					res.format({
						html: function () { res.redirect('/Dashboard/'+req.body.admin_id); },
						json: function () { res.send(app); },
					});	
				}
		});
};
//Read One
exports.getApp = function(req,res){
	App.findOne({_id:req.params._id},function(err,app){
		if(!app){
			res.json(error.notFound);
		}
		else{
			res.send(app);
		}
	});
};
//Read All
exports.getAppList = function(req,res){
	App.find({},function(err,apps){
		if(apps.length<=0){
			res.json(error.notFound);
		}
		else{
			res.send(apps);
		}
	});
};
//Update
exports.updateApp = function(req,res){
	App.findOneAndUpdate({_id:req.body.app_id},
		   {$set:{name:req.body.name,
		    contact_email: req.body.contact_email,
			is_active: req.body.is_active,
			ios_cert:req.body.ios_cert,
			ios_cert_key:req.body.ios_cert_key,
			gcm_apikey:req.body.gcm_apikey,
			googleios_apikey:req.body.googleios_apikey,
			googleandroid_apikey:req.body.googleandroid_apikey,
			google_project_number:req.body.google_project_number,
			is_development: req.body.is_development,
			facebook_tag:req.body.facebook_tag,
			facebook_url:req.body.facebook_url,
			facebook_tag_is_active:req.body.facebook_tag_is_active,
			instagram_tag:req.body.instagram_tag,
			instagram_url:req.body.instagram_url,
			instagram_tag_is_active:req.body.instagram_tag_is_active,
			twitter_tag:req.body.twitter_tag,
			twitter_url:req.body.twitter_url,
			twitter_tag_is_active:req.body.twitter_tag_is_active,
			social_message: req.body.social_message,}
		   	}, 
		   	function(err,app){
		   	if(!app){
		   		res.json({response:"no app found", status:false, error:err});
		   	}
		   	else{
		   		uploadImage(req.files.logo_wide_url, app,"logo_wide_url");
				uploadImage(req.files.logo_square_url, app,"logo_square_url");
			   	res.format({
					html: function () { res.redirect('/Dashboard/'+req.body.admin_id);},
					json: function () { res.send(app);},
				});	
			}
	});
};
//Delete
exports.deleteApp = function(req,res){
	App.remove({_id:req.params.app_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			MenuItem.remove({app_id:req.params.app_id},function(err){
				Atom.remove({app_id:req.params.app_id}, function(err){
					Location.remove({app_id:req.params.app_id}, function(err){
						Category.remove({app_id:req.params.app_id}, function(err){
							Image.remove({app_id:req.params.app_id}, function(err){
								Push.remove({app_id:req.params.app_id}, function(err){
									PushToken.remove({app_id:req.params.app_id}, function(err){
										Admin.update({type:"admin"},{$pull:{app_id_list:req.params.app_id}},{multi:true}, function(err, affected){
											res.format({
												html: function () { res.redirect('/Dashboard/'+req.params.admin_id); },
											});
										});
									});
								});
							});
						});
					});
				});
			});
		}
	});
};
//////////////////////////////////
//End of App CRUD/////////////////
//////////////////////////////////





//////////////////////////////////
//MenuItem CRUD starts here///////
//////////////////////////////////
//Create
exports.createMenuItem = function(req,res){
		new MenuItem({
				name: req.body.name,
				type: req.body.type,
				app_id:req.body.app_id,
				//app_name: req.body.app_name,
				is_draft: false,
				style: req.body.style,
				is_static: req.body.is_static,
				filter1: req.body.filter1,
				filter2: req.body.filter2,
				priority: req.body.priority,
			}).save(function(err,menuItem){
				if(err){
				App.findOne({_id:req.body.app_id}, function(err,app){
						res.render("createMenuItem",{admin_id:req.body.admin_id, app:app,title:"- Crear Menú",types:types, error:"Error: No puedes crear dos menús del mismo tipo"});
				});
					//res.json(err);
				}
				else{
					uploadImage(req.files.icon_url, menuItem,"icon_url");
					res.format({
						html: function () { res.redirect('/AppDashboard/'+req.body.app_id+'/'+req.body.admin_id+'/'+req.body.app_name); },
						json: function () { res.send(app); },
					});	
				}
		});
};
//Read One
exports.getMenuItem = function(req,res){
	MenuItem.findOne({_id:req.params._id},function(err,menuItem){
		if(!menuItem){
			res.json(error.notFound);
		}
		else{
			res.send(menuItem);
		}
	});
};
//Read All
exports.getMenuList = function(req,res){
	MenuItem.find({},function(err,menuItems){
		if(menuItems.length<=0){
			res.json(error.notFound);
		}
		else{
			res.send(menuItems);
		}
	});
};
//Update
exports.updateMenuItem = function(req,res){
console.log("filtro1 "+req.body.filter1);
	MenuItem.findOneAndUpdate({_id:req.body.menuItem_id},
						   {$set:{name: req.body.name,
								  type: req.body.type,
								  app_id:req.body.app_id,
								  //app_name: req.body.app_name,
								  filter1: req.body.filter1,
								  filter2: req.body.filter2,
								  priority: req.body.priority,
								  }
						   	}, 
		function(err,menuItem){
			if(err){
			res.json({error:err});
				App.findOne({_id:req.body.app_id}, function(err,app){
						res.render("updateMenuItem",{admin_id:req.body.admin_id, app:app,title:"- Crear Menú",types:types, error:err});
				});
					//res.json(err);
			}
			else{
					uploadImage(req.files.icon_url, menuItem,"icon_url");
					res.format({
						html: function () { res.redirect('/AppDashboard/'+req.body.app_id+'/'+req.body.admin_id+'/'+req.body.app_name); },
						json: function () { res.send(app); },
					});	
			}
	});
};
//Delete
exports.deleteMenuItem = function(req,res){
	MenuItem.remove({_id:req.params.menuItem_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			Atom.remove({menu_item_id:req.params.menuItem_id}, function(err){
				Location.remove({menu_item_id:req.params.menuItem_id}, function(err){
					res.format({
								html: function () { res.redirect('/AppDashboard/'+ req.params.app_id + '/' + req.params.admin_id+ '/' + req.params.app_name); },
								json: function () { res.send(app); },
					});
				});
			});
		}
	});
};
//////////////////////////////////
//End of MenuItem CRUD////////////
//////////////////////////////////




//////////////////////////////////
//Category CRUD starts here///////
//////////////////////////////////
//Create
exports.createCategory = function(req,res){
		new Category({
				name: req.body.name,
				app_id:req.body.app_id,
				//app_name: req.body.app_name,
				priority:req.body.priority,
			}).save(function(err,category){
				if(err){
					App.findOne({_id:req.body.app_id}, function(err,app){
							res.render("createCategory",{admin_id:req.body.admin_id, app:app,title:"- Crear Categoría", error:"Error"});
					});
				}
				else{
					res.format({
						html: function () { res.redirect('/CategoryDashboard/'+req.body.app_id+'/'+req.body.admin_id); },
						json: function () { res.send(category); },
					});	
				}
		});
};
//Read One
exports.getCategory = function(req,res){
	Category.findOne({_id:req.params.category_id},function(err,category){
		if(!category){
			res.json(error.notFound);
		}
		else{
			res.send(category);
		}
	});
};
//Read All
exports.getCategoryList = function(req,res){
	Category.find({},function(err,categories){
		if(categories.length<=0){
			res.json(error.notFound);
		}
		else{
			res.send(categories);
		}
	});
};
//Update
exports.updateCategory = function(req,res){
	Category.findOneAndUpdate({_id:req.body.category_id},
						   {$set:{name: req.body.name,
							   	  priority:req.body.priority,
						   }
						   	}, 
						   	function(err,category){
						   		if(err){
									res.json({error:"error"});
								}
								else{
									res.format({
										html: function () { res.redirect('/CategoryDashboard/'+req.body.app_id+'/'+req.body.admin_id); },
										json: function () { res.send(location); },
									});	
								}
	});
};
//Delete
exports.deleteCategory = function(req,res){
	Category.remove({_id:req.params.category_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.format({
				html: function () { res.redirect('/CategoryDashboard/'+req.params.app_id+'/'+ req.params.admin_id); },
				json: function () { res.send(app); },
			});

		}
	});
};
//////////////////////////////////
//End of MenuItem CRUD////////////
//////////////////////////////////

//////////////////////////////////
//CategoryFather CRUD starts here///////
//////////////////////////////////
//Create
exports.createCategoryFather = function(req,res){
		new CategoryFather({
				name: req.body.name,
				app_id:req.body.app_id,
				//app_name: req.body.app_name,
				priority:req.body.priority,
			}).save(function(err,category){
				if(err){
					App.findOne({_id:req.body.app_id}, function(err,app){
							res.render("createCategoryFather",{admin_id:req.body.admin_id, app:app,title:"- Crear Categoría", error:"Error"});
					});
				}
				else{
					res.format({
						html: function () { res.redirect('/CategoryFatherDashboard/'+req.body.app_id+'/'+req.body.admin_id); },
						json: function () { res.send(category); },
					});	
				}
		});
};
//Read One
exports.getCategoryFather = function(req,res){
	CategoryFather.findOne({_id:req.params.category_id},function(err,category){
		if(!category){
			res.json(error.notFound);
		}
		else{
			res.send(category);
		}
	});
};
//Read All
exports.getCategoryFatherList = function(req,res){
	CategoryFather.find({},function(err,categories){
		if(categories.length<=0){
			res.json(error.notFound);
		}
		else{
			res.send(categories);
		}
	});
};
//Update
exports.updateCategoryFather = function(req,res){
	CategoryFather.findOneAndUpdate({_id:req.body.category_id},
						   {$set:{name: req.body.name,
							   	  priority:req.body.priority,
						   }
						   	}, 
						   	function(err,category){
						   		if(err){
									res.json({error:"error"});
								}
								else{
									res.format({
										html: function () { res.redirect('/CategoryFatherDashboard/'+req.body.app_id+'/'+req.body.admin_id); },
										json: function () { res.send(location); },
									});	
								}
	});
};
//Delete
exports.deleteCategoryFather = function(req,res){
	CategorySon.remove({categoryfather_id:req.params.category_id}, function(err){
		CategoryFather.remove({_id:req.params.category_id},function(err){
			if(err){
				res.json(error.notFound);
			}
			else{
				res.format({
					html: function () { res.redirect('/CategoryFatherDashboard/'+req.params.app_id+'/'+ req.params.admin_id); },
					json: function () { res.send(app); },
				});
	
			}
		});
	});
};
//////////////////////////////////
//End of Category Father CRUD////////////
//////////////////////////////////

//////////////////////////////////
//CategorySon CRUD starts here///////
//////////////////////////////////
//Create
exports.createCategorySon = function(req,res){
		new CategorySon({
				name: req.body.name,
				app_id:req.body.app_id,
				categoryfather_id: req.body.categoryfather_id,
				priority:req.body.priority,
			}).save(function(err,category){
				if(err){
					App.findOne({_id:req.body.app_id}, function(err,app){
						CategoryFather.findOne({_id:req.body.categoryfather_id}, function(err,categoryfather){
							res.render("createCategorySon",{admin_id:req.body.admin_id, 
															app:app,title:"- Crear Item para "+categoryfather.name, 
															categoryfather:categoryfather,
															error:"Error"});
						});
					});
				}
				else{
					CategoryFather.findOne({_id:req.body.categoryfather_id}, function(err,categoryfather){
						res.format({
							html: function () { res.redirect('/CategorySonDashboard/'+req.body.app_id+'/'+req.body.admin_id+'/'+categoryfather._id); },
							json: function () { res.send(category); },
						});
					});	
				}
		});
};
//Read One
exports.getCategorySon = function(req,res){
	CategorySon.findOne({_id:req.params.category_id},function(err,category){
		if(!category){
			res.json(error.notFound);
		}
		else{
			res.send(category);
		}
	});
};
//Read All
exports.getCategorySonList = function(req,res){
	CategorySon.find({},function(err,categories){
		if(categories.length<=0){
			res.json(error.notFound);
		}
		else{
			res.send(categories);
		}
	});
};
//Update
exports.updateCategorySon = function(req,res){
	CategorySon.findOneAndUpdate({_id:req.body.category_id},
						   {$set:{name: req.body.name,
						   		  categoryfather_id:req.body.categoryfather_id,
							   	  priority:req.body.priority,
						   }
						   	}, 
						   	function(err,category){
						   		if(err){
									res.json({error:"error"});
								}
								else{
									CategoryFather.findOne({_id:req.body.categoryfather_id}, function(err,categoryfather){
										res.format({
											html: function () { res.redirect('/CategorySonDashboard/'+req.body.app_id+'/'+req.body.admin_id+'/'+req.body.categoryfather_id); },
											json: function () { res.send(location); },
										});	
									});
								}
	});
};
//Delete
exports.deleteCategorySon = function(req,res){
	CategorySon.remove({_id:req.params.category_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.format({
				html: function () { res.redirect('/CategorySonDashboard/'+req.params.app_id+'/'+ req.params.admin_id+'/'+req.params.categoryfather_id); },
				json: function () { res.send(app); },
			});

		}
	});
};
//////////////////////////////////
//End of Category Son CRUD////////////
//////////////////////////////////





//////////////////////////////////
//User CRUD starts here///////////
//////////////////////////////////
//Create and Update
exports.signUp = function(req,res){	
	ptoken=0;

/*
console.log("name: "+req.body.name,
				"email: "+req.body.email,
				"id: "+req.body.id,
				"token: "+req.body.token,
				"brand: "+req.body.brand,
				"os: "+req.body.os,
				"device: "+req.body.device,
				"app_id: "+req.body.app_id);
*/
//	res.json({response:"data received successfully!", status:true});
	
//	return;

	if(typeof(req.body.token) !== 'undefined'){
				ptoken=req.body.token;
	}
	//Search if user with facebook id exists
	User.findOneAndUpdate({facebook_id:req.body.facebook_id},{$set:{name:req.body.name,email:req.body.email}},function(err,user){
		if(!user){
		//If user doesn't exist we create it
			new User({
				name:req.body.name,
				email:req.body.email,
				date_created:new Date(),
				facebook_id:req.body.facebook_id,
				}).save(function(err,user){
							if(err){ 
								res.json({response:"there was an error trying to create user with id "+req.body.facebook_id, 
										  user:null, 
										  error:err,
										  status: false
								});
							}
							else{
							//Also we create a push token object for that user related with this app
							new PushToken({
									user_id: user._id,
									push_token: req.body.token,
									app_id: req.body.app_id,
									os: req.body.os,
									device_brand: req.body.brand,
									type: req.body.device,
								}).save(function(err,token){
											if(err){ 
												console.log("token storage error 3 "+err);
												res.json({response:"user created, but there was an error trying to store token "+req.body.token, 
														  user:user, 
														  error:err,
														  status: true
												});
											}
											else{
												res.json({response:"user and token created successfully",
														  user:user,
														  error:0,
														  status:true
												});
											}
								});
							}
				});
		}
		else{
			User.findOne({facebook_id:req.body.facebook_id},function(err,user){
				if(!user){
					res.json({response:"no user found with id "+req.body.facebook_id, 
							  user:nil, 
							  error:err,
							  status: false
					});
				}
				else{
				//If user already exists in our DB we check for push objects related to app and user
					PushToken.findOne({user_id:user._id, app_id:req.body.app_id}, function(err,token){
						if(!token){
						//If user exists, but push token object is not related, we create a new one
							new PushToken({
									user_id: user._id,
									push_token: ptoken,
									app_id: req.body.app_id,
									os: req.body.os,
									device_brand: req.body.brand,
									type: req.body.device,
								}).save(function(err,token){
											if(err){ 
												console.log("token storage error 4 "+err);
												res.json({response:"user exists, but there was an error trying to store token "+req.body.token, 
														  user:user, 
														  error:err,
														  status: true
												});
											}
											else{
												res.json({response:"user updated, and token created successfully",
														  user:user,
														  error:0,
														  status:true
											});
									}
							});
						}
						else{
						//If user exists, and push token object is already related, we just update it
							PushToken.findOneAndUpdate({user_id:user._id},{$set:{user_id: user._id,
														push_token: ptoken,
														app_id: req.body.app_id,
														os: req.body.os,
														device_brand: req.body.brand,
														type: req.body.device}}, 
								function(err, token){
									if(!token){
										console.log("token storage error 5 "+err);
													res.json({response:"user exists, but there was an error trying to store token "+req.body.token, 
															  user:user, 
															  error:err,
															  status: true
													});
									}
									else{
										res.json({response:"user updated successfully",
															  user:user,
															  error:0,
															  status:true
												});
									}
							});
						}
					});
					}
				});
		}
	});
};
//Read One
exports.getUser = function(req,res){
	User.findOne({_id:req.params._id},function(err,user){
		if(!user){
			res.json(error.notFound);
		}
		else{
			res.send(user);
		}
	});
};
//Read All
exports.getUserList = function(req,res){
	User.find({},function(err,users){
		if(users.length<=0){
			res.json(error.notFound);
		}
		else{
			res.send(users);
		}
	});
};
//Delete
exports.deleteUser = function(req,res){
	User.remove({_id:req.body._id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.json({response:"success", status:true, error:0});
		}
	});
};
//////////////////////////////////
//End of User CRUD////////////////
//////////////////////////////////

//////////////////////////////////
//Multiresponse format////////////
//////////////////////////////////
/*
res.format({
	html: function () { res.redirect('/Tips.do'); },
	json: function () { res.send(tip); },
});	
*/
//////////////////////////////////
//End of MR format CRUD///////////
//////////////////////////////////


//Web login
exports.adminLogin = function(req,res){
	Admin.findOne({email:req.body.email, password:req.body.password}, function(err,admin){
		if(admin){
			//if(admin.type=="superadmin"){
					res.redirect('/Dashboard/'+admin._id);
			/*
}
			else{
				App.findOne({_id:admin.app_id_list[0]}, function(err,app){
					//MenuItem.find({app_id:app._id}, function(err,menuItems){
					res.redirect('AppDashboard/'+app._id+'/'+admin._id+'/'+app.name);
					//	res.render('appDashboard',{title:app.name+" - App Dashboard", app:app, admin:admin, menuItems:menuItems});
					//});
				});
			}
*/
		}
		else{
			res.json({response:"no admin found", error:1});
		}
	});		
};

//////////////
//Dashboards//
//////////////

//Dashboard for Super Admin
exports.dashboard = function (req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		if(admin){
			if(admin.type=="superadmin"){
				App.find({}, function(err,apps){
					Admin.find({type:'admin'},null,{sort:{name:1}}, function(err,admins){
						res.render('dashboard',{admin:admin, title:"- Dashboard", apps:apps, admins:admins});
					});
				});
			}
			else{
				App.find({_id:{$in:admin.app_id_list}},null,{sort:{name:1}}, function(err,apps){
					res.render('dashboard',{admin:admin, title:"- Dashboard", apps:apps});
				});
			}
		}
		else{
			res.json({response:"no admin found", error:1});
		}
	});	
};

//Dashboard for Single Application Admin
exports.appDashboard = function (req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		if(admin){
			if(admin.type=="superadmin"){
				App.findOne({_id:req.params.app_id}, function(err,app){
					MenuItem.find({app_id:app._id},null,{sort:{priority:static_priority}}, function(err,menuItems){
						res.render('appDashboard',{title:app.name+" - App Dashboard", app:app, admin:admin, menuItems:menuItems});
					});
				});
				
			}
			else if(admin.type=="admin"){
				if(admin.app_id_list.indexOf(req.params.app_id)>=0){
					App.findOne({_id:req.params.app_id}, function(err,app){
						MenuItem.find({app_id:app._id},null,{sort:{priority:static_priority}}, function(err,menuItems){
								res.render('appDashboard',{title:app.name+" - App Dashboard", app:app, admin:admin, menuItems:menuItems});
						});
					});
				}
				else{
					res.json({response:"access denied, you don't have permission to access this app", status:false});
				}
			}
		}
		else{
			res.json({response:"access denied, admin account missing", status:false});
		}
	});	
};

//Dashboard for Created Items
exports.atomDashboard = function (req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		if(admin){
			if(admin.type=="superadmin"){
				App.findOne({_id:req.params.app_id}, function(err,app){
					MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
						Atom.find({menu_item_id:req.params.menuItem_id},null,{sort:{priority:static_priority}}, function(err,atoms){
							//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
							res.render('itemDashboard',{title:menuItem.name+" - Item Dashboard", app:app, admin:admin, menuItem:menuItem, atoms:atoms});
						});
					});
				});
			}
			else if(admin.type=="admin"){
				if(admin.app_id_list.indexOf(req.params.app_id)>=0){
					App.findOne({_id:req.params.app_id}, function(err,app){
						MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
							Atom.find({menu_item_id:req.params.menuItem_id},null,{sort:{priority:static_priority}}, function(err,atoms){
									res.render('itemDashboard',{title:menuItem.name+" - Item Dashboard", app:app, admin:admin, menuItem:menuItem, atoms:atoms});
									//res.json({res:atoms});
							});
						});
					});
				}
				else{
					res.json({response:"access denied, you don't have permission to access this app", status:false});
				}
			}
		}
		else{
			res.json({response:"access denied, admin account missing", status:false});
		}
	});	
};

//Dashboard for Created Locations
exports.locationDashboard = function (req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		if(admin){
			if(admin.type=="superadmin"){
				App.findOne({_id:req.params.app_id}, function(err,app){
					MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
						Location.find({menu_item_id:req.params.menuItem_id},null,{sort:{priority:static_priority}}, function(err,locations){
							//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
							res.render('locationDashboard',{title:menuItem.name+" - Location Dashboard", app:app, admin:admin, menuItem:menuItem, locations:locations});
						});
					});
				});
			}
			else if(admin.type=="admin"){
				if(admin.app_id_list.indexOf(req.params.app_id)>=0){
					App.findOne({_id:req.params.app_id}, function(err,app){
						MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
							Location.find({menu_item_id:req.params.menuItem_id},null,{sort:{priority:static_priority}}, function(err,locations){
									res.render('locationDashboard',{title:menuItem.name+" - Location Dashboard", app:app, admin:admin, menuItem:menuItem, locations:locations});
							});
						});
					});
				}
				else{
					res.json({response:"access denied, you don't have permission to access this app", status:false});
				}
			}
		}
		else{
			res.json({response:"access denied, admin account missing", status:false});
		}
	});	
};

//Dashboard for Created Categories
exports.categoryDashboard = function (req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		if(admin){
			if(admin.type=="superadmin"){
				App.findOne({_id:req.params.app_id}, function(err,app){
						Category.find({app_id:req.params.app_id},null,{sort:{priority:static_priority}}, function(err,categories){
							res.render('categoryDashboard',{title:" - Category Dashboard", app:app, admin:admin, categories:categories});
						});
				});
			}
			else if(admin.type=="admin"){
				if(admin.app_id_list.indexOf(req.params.app_id)>=0){
					App.findOne({_id:req.params.app_id}, function(err,app){
							Category.find({app_id:req.params.app_id},null,{sort:{priority:static_priority}}, function(err,categories){
									res.render('categoryDashboard',{title:" - Category Dashboard", app:app, admin:admin, categories:categories});
							});
					});
				}
				else{
					res.json({response:"access denied, you don't have permission to access this app", status:false});
				}
			}
		}
		else{
			res.json({response:"access denied, admin account missing", status:false});
		}
	});	
};

exports.categoryFatherDashboard = function (req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		if(admin){
			if(admin.type=="superadmin"){
				App.findOne({_id:req.params.app_id}, function(err,app){
						CategoryFather.find({app_id:req.params.app_id},null,{sort:{priority:static_priority}}, function(err,categories){
							res.render('categoryFatherDashboard',{title:" - Category Dashboard", app:app, admin:admin, categories:categories});
						});
				});
			}
			else if(admin.type=="admin"){
				if(admin.app_id_list.indexOf(req.params.app_id)>=0){
					App.findOne({_id:req.params.app_id}, function(err,app){
							CategoryFather.find({app_id:req.params.app_id},null,{sort:{priority:static_priority}}, function(err,categories){
									res.render('categoryFatherDashboard',{title:" - Category Dashboard", app:app, admin:admin, categories:categories});
							});
					});
				}
				else{
					res.json({response:"access denied, you don't have permission to access this app", status:false});
				}
			}
		}
		else{
			res.json({response:"access denied, admin account missing", status:false});
		}
	});	
};

exports.categorySonDashboard = function (req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		if(admin){
			if(admin.type=="superadmin"){
				App.findOne({_id:req.params.app_id}, function(err,app){
						CategorySon.find({app_id:req.params.app_id, categoryfather_id:req.params.categoryfather_id},null,{sort:{priority:static_priority}}, function(err,categories){
							CategoryFather.findOne({_id:req.params.categoryfather_id}, function(err,categoryfather){
								res.render('categorySonDashboard',{title:" - "+categoryfather.name+"  Dashboard", app:app, admin:admin, categories:categories, categoryfather:categoryfather});
							});
						});
				});
			}
			else if(admin.type=="admin"){
				if(admin.app_id_list.indexOf(req.params.app_id)>=0){
					App.findOne({_id:req.params.app_id}, function(err,app){
							CategorySon.find({app_id:req.params.app_id, categoryfather_id:req.params.categoryfather_id},null,{sort:{priority:static_priority}}, function(err,categories){
								CategoryFather.findOne({_id:req.params.categoryfather_id}, function(err,categoryfather){
									res.render('categorySonDashboard',{title:" - "+categoryfather.name+"  Dashboard", app:app, admin:admin, categories:categories, categoryfather:categoryfather});
								});
							});
					});
				}
				else{
					res.json({response:"access denied, you don't have permission to access this app", status:false});
				}
			}
		}
		else{
			res.json({response:"access denied, admin account missing", status:false});
		}
	});	
};

/////////////////////
//End of Dashboards//
/////////////////////


//View for App Creation
exports.appCreatorView = function(req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		res.render("createApp",{admin_id:req.params.admin_id,title:"- Crear Aplicación", admin:admin});
	});
};
//View for MenuItem Update
exports.appUpdaterView = function(req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		App.findOne({_id:req.params.app_id}, function(err,app){
			if(!app){
				res.redirect('/Dashboard/'+admin._id);
			}
			else{
			//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
				res.render("updateApp",{admin_id:admin._id,title:"- Actualizar Aplicación "+app.name, app:app, admin:admin});
			}
		});
	});
};

//View for Menu Creation
exports.menuItemCreatorView = function(req,res){
	App.findOne({_id:req.params.app_id}, function(err,app){
		CategoryFather.find({app_id:app._id},function(err,categoryfathers){
			res.render("createMenuItem",{admin_id:req.params.admin_id, app:app,title:"- Crear Menú",types:types, categoryfathers:categoryfathers});
		});
	});
};

//View for MenuItem Update
exports.menuItemUpdaterView = function(req,res){
	MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				CategoryFather.find({app_id:app._id},function(err,categoryfathers){
					if(!menuItem){
						res.render("appDashboard",{title:app.name+" - App Dashboard", app:app, admin:admin, menuItem:menuItem, error:"Error: creación inválida."});
					}
					else{
					//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
						res.render("updateMenuItem",{admin:admin, app:app, menuItem:menuItem, title:"- Actualizar "+menuItem.name, types:types, categoryfathers:categoryfathers});
					}
				});
			});
		});
	});
};



//View for Admin Creation
exports.adminCreatorView = function(req,res){
	App.find({}, function(err,apps){
		res.render("createAdmin",{admin_id:req.params.admin_id,apps:apps,title:"- Crear Administrador"});
	});
};
//View for Admin Update
exports.adminUpdaterView = function(req,res){
	Admin.findOne({_id:req.params.admin_id}, function(err,admin){
		if(!admin){
			res.redirect('/Dashboard/'+req.params.super_admin_id);
		}
		else{
			App.find({}, function(err,apps){
				res.render("updateAdmin",{admin_id:req.params.admin_id, admin:admin, super_admin_id:req.params.super_admin_id, apps:apps, title:"- Actualizar Administrador"});
			});
		}
	});
};
//View for Admin Assign
exports.adminAssignerView = function(req,res){
	Admin.find({type:"admin"},null,{sort:{name:1}}, function(err,admins){
		if(admins.length<=0){
			res.redirect('/Dashboard/'+req.params.super_admin_id);
		}
		else{
			Admin.findOne({_id:req.params.super_admin_id}, function(err,superadmin){
				if(superadmin.type=="superadmin"){
					App.findOne({_id:req.params.app_id}, function(err,app){
						res.render("assignAdmin",{admins:admins, super_admin_id:req.params.super_admin_id, app:app, title:"- Asignar Administrador"});
					});
				}
				else{
					res.json({response:"Bad authentication", status:false});
				}
			});
		}
	});
};
//View for Item Creation
exports.atomCreatorView = function(req,res){
	MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				Atom.find({menu_item_id:req.params.menuItem_id}, function(err,atoms){
					Location.find({app_id:app._id}, function(err,locations){
						Category.find({app_id:app._id}, function(err,categories){
							CategoryFather.find({app_id:app._id}, function(err,categoryfathers){
								CategorySon.find({app_id:app._id}, function(err,categorysons){
									if(!menuItem){
										res.render("appDashboard",{title:app.name+" - App Dashboard", app:app, admin:admin, menuItem:menuItem, error:"Error: creación inválida."});
									}
									else{
									//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
										res.render("createAtom",{admin:admin, app:app, atom_qty:atoms.length, locations:locations, categories:categories, menuItem:menuItem,title:"- Crear "+menuItem.name, categoryfathers:categoryfathers, categorysons:categorysons});
									}
								});
							});
						});
					});
				});
			});
		});
	});
	
};

//View for Item Update
exports.atomUpdaterView = function(req,res){
	MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				Atom.findOne({_id:req.params.atom_id}, function(err,atom){
					Atom.find({menu_item_id:req.params.menuItem_id}, function(err,atoms){
						Category.find({app_id:app._id}, function(err,categories){
							CategoryFather.find({app_id:app._id}, function(err,categoryfathers){
								CategorySon.find({app_id:app._id}, function(err,categorysons){
									if(!atom){
										res.render("appDashboard",{title:app.name+" - App Dashboard", app:app, admin:admin, menuItem:menuItem, error:"Error: creación inválida."});
									}
									else{
										Location.find({app_id:app._id}, function(err,locations){
											//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
											res.render("updateAtom",{admin:admin, app:app,atom:atom, atom_qty:atoms.length, locations:locations, categories:categories, menuItem:menuItem, title:"- Actualizar "+atom.name, categoryfathers:categoryfathers, categorysons:categorysons});
										});	
									}
								});
							});
						});
					});
				});
			});
		});
	});
};

//View for Location Creation
exports.locationCreatorView = function(req,res){
	MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				Category.find({app_id:app._id}, function(err,categories){
					CategoryFather.find({app_id:app._id}, function(err,categoryfathers){
						CategorySon.find({app_id:app._id}, function(err,categorysons){
							if(!menuItem){
								res.render("appDashboard",{title:app.name+" - App Dashboard", app:app, admin:admin, menuItems:menuItem, error:"Error: creación inválida."});
							}
							else{
							//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
								res.render("createLocation",{admin:admin, app:app, categories:categories, menuItem:menuItem,title:"- Crear "+menuItem.name, categoryfathers:categoryfathers, categorysons:categorysons});
							}
						});
					});
				});
			});
		});
	});
};

//View for Location Update
exports.locationUpdaterView = function(req,res){
	MenuItem.findOne({_id:req.params.menuItem_id}, function(err,menuItem){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				Location.findOne({_id:req.params.location_id}, function(err,location){
					Category.find({app_id:app._id}, function(err,categories){
						CategoryFather.find({app_id:app._id}, function(err,categoryfathers){
							CategorySon.find({app_id:app._id}, function(err,categorysons){
								if(!location){
									res.render("appDashboard",{title:app.name+" - App Dashboard", app:app, admin:admin, menuItems:[menuItem], error:"Error: creación inválida."});
									return;
								}
								else{
								//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
									res.render("updateLocation",{admin:admin, app:app,location:location, categories:categories, menuItem:menuItem,title:"- Actualizar "+location.name, categoryfathers:categoryfathers, categorysons:categorysons});
								}
							});	
						});
					});
				});
			});
		});
	});
	
};

//View for Category Creation
exports.categoryCreatorView = function(req,res){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				res.render("createCategory",{admin:admin, app:app, title:"- Crear Categoría"});
			});
		});
};

//View for Category Update
exports.categoryUpdaterView = function(req,res){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				Category.findOne({_id:req.params.category_id}, function(err,category){
					if(!category){
						res.render("categoryDashboard",{title:app.name+" - Category Dashboard", app:app, admin:admin, category:category, error:"Error: creación inválida."});
					}
					else{
					//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
						res.render("updateCategory",{admin:admin, app:app, category:category,title:"- Actualizar Categoría"});
					}
				});
			});
		});	
};

//View for CategoryFather Creation
exports.categoryFatherCreatorView = function(req,res){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				res.render("createCategoryFather",{admin:admin, app:app, title:"- Crear Categoría"});
			});
		});
};

//View for CategoryFather Update
exports.categoryFatherUpdaterView = function(req,res){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				CategoryFather.findOne({_id:req.params.category_id}, function(err,category){
					if(!category){
						res.render("categoryFatherDashboard",{title:app.name+" - Category Dashboard", app:app, admin:admin, category:category, error:"Error: creación inválida."});
					}
					else{
					//res.json({admin:admin, app:app, menuItem:menuItem,title:"- Crear "+menuItem.name});
						res.render("updateCategoryFather",{admin:admin, app:app, category:category,title:"- Actualizar Categoría"});
					}
				});
			});
		});	
};

//View for CategorySon Creation
exports.categorySonCreatorView = function(req,res){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				CategoryFather.findOne({_id:req.params.categoryfather_id}, function(err, categoryfather){
					res.render("createCategorySon",{admin:admin, app:app, title:"- Crear Item para "+categoryfather.name, categoryfather:categoryfather});
				});
			});
		});
};

//View for CategorySon Update
exports.categorySonUpdaterView = function(req,res){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			App.findOne({_id:req.params.app_id}, function(err,app){
				CategorySon.findOne({_id:req.params.category_id}, function(err,category){
					if(!category){
						CategoryFather.findOne({_id:req.params.categoryfather_id}, function(err,categoryfather){
							res.render("categorySonDashboard",{title:app.name+" - Category Dashboard", app:app, admin:admin, category:category, error:"Error: creación inválida.", categoryfather:categoryfather});
						});
					}
					else{
						CategoryFather.findOne({_id:req.params.categoryfather_id}, function(err,categoryfather){
							res.render("updateCategorySon",{admin:admin, app:app, category:category,title:"- Actualizar Item de Categoría "+categoryfather.name, categoryfather:categoryfather});
						});
					}
				});
			});
		});	
};


//APIs for Mobile
exports.getAllInfoWithAppID = function(req,res){
	App.findOne({_id:req.params.app_id},function(err,app){
		if(!app){
			res.json({response:"no application found with id "+req.params.app_id, status:false, error:err});
		}
		else{
			MenuItem.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,menuItems){
				if(menuItems.length<=0){
					res.json({response:"Application found, but there's no menu. ID: "+req.params.app_id, status:false, error:err})
				}
				else{
					Atom.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err, atoms){
						if(atoms.length<=0){
							Location.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,locations){
								if(locations.length<=0){
									//Existe aplicación y menú, pero no hay items ni locaciones
								}
								else{
									//Existe aplicación, menú y locaciones, pero no hay items
								}
							});
						}
						else{
							Location.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,locations){
								if(1==0){
									//Existe aplicación, menú e items, pero no hay locaciones
								}
								else{
									//Existe aplicación, menú, locaciones e items
									Atom.find({feature_type:{$in:["destacado","especial"]}, app_id:req.params.app_id},null,{sort:{priority:static_priority}},function(err,features){
										Category.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,categories){
											CategoryFather.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,categoryfathers){
												CategorySon.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,categorysons){
													var events= new Array();
													var artists= new Array();
													var news= new Array();
													var general= new Array();
													var featured= new Array();
													var special = new Array();
													
													
													
													for(var i=0;i<atoms.length;i++){
															if(atoms[i].type=="artistas"){
																atoms[i].gallery = gallery.gallery_array(atoms[i]);
																artists.push(atoms[i]);
															}
															else if(atoms[i].type=="eventos"){
																atoms[i].gallery = gallery.gallery_array(atoms[i]);
																events.push(atoms[i]);
															}
															else if(atoms[i].type=="noticias"){
																atoms[i].gallery = gallery.gallery_array(atoms[i]);
																news.push(atoms[i]);
															}
															else if(atoms[i].type=="general"){
																atoms[i].gallery = gallery.gallery_array(atoms[i]);
																general.push(atoms[i]);
															}
													}
													
													for(var i=0;i<features.length;i++){
															if(features[i].feature_type=="especial"){
																features[i].gallery = gallery.gallery_array(atoms[i]);
																special.push(features[i]);
															}
															else if(features[i].feature_type=="destacado"){
																features[i].gallery = gallery.gallery_array(atoms[i]);
																featured.push(features[i]);
															}
													}
														var response={
																  app:app,
																  menu:menuItems,
																  eventos:events,
																  artistas:artists,
																  noticias:news,
																  general:general,
																  locaciones:locations,
																  destacados:featured,
																  especiales:special,
																  categorias:categories,
																  categorias_padre:categoryfathers,
																  categorias_hijo:categorysons,
																  status:true,
																  response:"Success"
																  };
														res.json(response);
											
														});
											
												});
											
										});
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.getAllInfoWithAppAndUser = function(req,res){
	App.findOne({_id:req.params.app_id},function(err,app){
		if(!app){
			res.json({response:"no application found with id "+req.params.app_id, status:false, error:err});
		}
		else{
			MenuItem.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,menuItems){
				if(menuItems.length<=0){
					res.json({response:"Application found, but there's no menu"+req.params.app_id, status:false, error:err})
				}
				else{
					Atom.find({app_id:req.params.app_id},null,{sort:{priority:static_priority}}, function(err, atoms){
						if(atoms.length<=0){
							Location.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,locations){
								if(locations.length<=0){
									//Existe aplicación y menú, pero no hay items ni locaciones
								}
								else{
									//Existe aplicación, menú y locaciones, pero no hay items
								}
							});
						}
						else{
							Location.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,locations){
								if(locations.length<=0){
									//Existe aplicación, menú e items, pero no hay locaciones
								}
								else{
									//Existe aplicación, menú, locaciones e items
									Atom.find({feature_type:{$in:["destacado","especial"]}, app_id:req.params.app_id}, null,{sort:{priority:static_priority}},function(err,features){
										User.findOne({_id:req.params.user_id}, function(err,user){
											Category.find({app_id:req.params.app_id}, null,{sort:{priority:static_priority}}, function(err,categories){
													var events = new Array();
													var artists = new Array();
													var news = new Array();
													var general = new Array();
													var featured = new Array();
													var special = new Array();
													
													
													for(var i=0;i<atoms.length;i++){
															if(atoms[i].type=="artistas"){
																atoms[i].gallery = gallery.gallery_array(atoms[i]);
																artists.push(atoms[i]);
															}
															else if(atoms[i].type=="eventos"){
																atoms[i].gallery = gallery.gallery_array(atoms[i]);
																events.push(atoms[i]);
															}
															else if(atoms[i].type=="noticias"){
																atoms[i].gallery = gallery.gallery_array(atoms[i]);
																news.push(atoms[i]);
															}
															else if(atoms[i].type=="general"){
																atoms[i].gallery = gallery.gallery_array(atoms[i]);
																general.push(atoms[i]);
															}
													}
													
													for(var i=0;i<features.length;i++){
															if(features[i].feature_type=="especial"){
																special.push(features[i]);
															}
															else if(features[i].feature_type=="destacado"){
																featured.push(features[i]);
															}
													}
														var response={
																  app:app,
																  menu:menuItems,
																  eventos:events,
																  artistas:artists,
																  noticias:news,
																  general:general,
																  locaciones:locations,
																  destacados:featured,
																  especiales:special,
																  user:user,
																  categorias:categories,
																  status:true,
																  response:"Success"
																  };
														res.json(response);
											});
										});
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.favItem = function(req,res){
	var user_id=req.body.user_id;
	var item_id=req.body.item_id;
	var type=req.body.type;
	var app_id=req.body.app_id;
	if(type=="artistas" || type=="eventos" || type=="noticias" || type=="general"){
		User.findOneAndUpdate({_id:user_id},{$addToSet:{favorited_atoms:item_id}}, function (err,user) {
			if(!user){
				res.json({response:"No user found with id "+user_id, status:false});
			}
			else{
				Atom.findOneAndUpdate({_id:item_id},{$inc:{favorited:1}}, function(err,atom){
					if(!atom){
						res.json({response:"There was an error trying to find the Item "+item_id, status:false});
					}
					else{
						Location.find({_id:{$in:user.favorited_locations}, app_id:app_id}, function(err,locations){
							Atom.find({_id:{$in:user.favorited_atoms}, app_id:app_id}, function(err,atoms){
								res.json({response:"Fav Added", 
										  status:true, 
										  favorited_atoms:atoms, 
										  atoms_qty:user.favorited_atoms.length,
										  favorited_locations:locations,
										  locations_qty:user.favorited_locations.length, 
										  user:user
								});
							});
						});
						//res.json({response:"Fav added ", status:true, atom:atom, user:user});
					}
				})
			}
		});
	}
	else if(type=="locaciones"){
		User.findOneAndUpdate({_id:user_id},{$addToSet:{favorited_locations:item_id}}, function (err,user) {
			if(!user){
				res.json({response:"No user found with id "+user_id, status:false});
			}
			else{
				Location.findOneAndUpdate({_id:item_id},{$inc:{favorited:1}}, function(err,location){
					if(!location){
						res.json({response:"There was an error trying to find the Location "+item_id, status:false});
					}
					else{
						Location.find({_id:{$in:user.favorited_locations}, app_id:app_id}, function(err,locations){
							Atom.find({_id:{$in:user.favorited_atoms}, app_id:app_id}, function(err,atoms){
								res.json({response:"Fav Added", 
										  status:true, 
										  favorited_atoms:atoms, 
										  atoms_qty:user.favorited_atoms.length,
										  favorited_locations:locations,
										  locations_qty:user.favorited_locations.length, 
										  user:user
								});
							});
						});
						//res.json({response:"Fav added ", status:true, location:location, user:user});
					}
				})
			}
		});
	}
};

exports.unFavItem = function(req,res){
	var user_id=req.body.user_id;
	var item_id=req.body.item_id;
	var type=req.body.type;
	var app_id=req.body.app_id;
	if(type=="artistas" || type=="eventos" || type=="noticias" || type=="general"){
		User.findOneAndUpdate({_id:user_id},{$pull:{favorited_atoms:item_id}}, function (err,user) {
			if(!user){
				res.json({response:"No user found with id "+user_id, status:false});
			}
			else{
				Atom.findOneAndUpdate({_id:item_id},{$inc:{favorited:-1}}, function(err,atom){
					if(!atom){
						res.json({response:"There was an error trying to find the Item "+item_id, status:false});
					}
					else{
						Location.find({_id:{$in:user.favorited_locations}, app_id:app_id}, function(err,locations){
							Atom.find({_id:{$in:user.favorited_atoms}, app_id:app_id}, function(err,atoms){
								res.json({response:"Fav Removed", 
										  status:true, 
										  favorited_atoms:atoms, 
										  atoms_qty:user.favorited_atoms.length,
										  favorited_locations:locations,
										  locations_qty:user.favorited_locations.length, 
										  user:user
								});
							});
						});
						//res.json({response:"Fav removed ", status:true, atom:atom, user:user});
					}
				})
			}
		});
	}
	else if(type=="locaciones"){
		User.findOneAndUpdate({_id:user_id},{$pull:{favorited_locations:item_id}}, function (err,user) {
			if(!user){
				res.json({response:"No user found with id "+user_id, status:false});
			}
			else{
				Location.findOneAndUpdate({_id:item_id},{$inc:{favorited:-1}}, function(err,location){
					if(!location){
						res.json({response:"There was an error trying to find the location "+item_id, status:false});
					}
					else{
						Location.find({_id:{$in:user.favorited_locations}, app_id:app_id}, function(err,locations){
							Atom.find({_id:{$in:user.favorited_atoms}, app_id:app_id}, function(err,atoms){
								res.json({response:"Fav Removed", 
										  status:true, 
										  favorited_atoms:atoms, 
										  atoms_qty:user.favorited_atoms.length,
										  favorited_locations:locations,
										  locations_qty:user.favorited_locations.length, 
										  user:user
								});
							});
						});
						//res.json({response:"Fav removed ", status:true, location:location, user:user});
					}
				})
			}
		});
	}
};

exports.getAtomWithID = function(req,res){
	Atom.findOne({_id:req.params.atom_id,app_id:req.params.app_id}, function(err,atom){
		if(!atom){
			res.json({response:"no item found with id "+req.params.atom_id, status:false, error:err});
		}	
		else{
			atom.gallery = gallery.gallery_array(atom);
			res.json({response:"Atom successfully found", status:true, error:err, atom:atom});
		}
	});
};

exports.getLocationWithID = function(req,res){
	Location.findOne({_id:req.params.location_id, app_id:req.params.app_id}, function(err,location){
		if(!location){
			res.json({response:"no location found with id "+req.params.location_id, status:false, error:err});
		}	
		else{
			res.json({response:"Location successfully found", status:true, error:err, location:location});
		}
	});
};

exports.getFavoritedAtomsFromUser = function(req,res){
	User.findOne({_id:req.params.user_id}, function(err,user){
		if(!user){
			res.json({response:"no user found", status:false, error:err});
		}
		else{
			Atom.find({_id:{$in:user.favorited_atoms},app_id:req.params.app_id}, function(err,atoms){
				if(atoms.length<=0){
					res.json({response:"User found, but there are no favorited atoms", status:true, error:err, user:user});
				}
				else{
					res.json({response:"Favorited Atoms found", status:true, atoms:atoms, atoms_qty:atoms.length, user:user});
				}
			});
		}	
	});
};

exports.getFavoritedLocationsFromUser = function(req,res){
	User.findOne({_id:req.params.user_id}, function(err,user){
		if(!user){
			res.json({response:"no user found", status:false, error:err});
		}
		else{
			Location.find({_id:{$in:user.favorited_locations},app_id:req.params.app_id}, function(err,locations){
				if(locations.length<=0){
					res.json({response:"User found, but there are no favorited atoms", status:true, error:err, user:user});
				}
				else{
					res.json({response:"Favorited Locations found", status:true, locations:locations, locations_qty:locations.length, user:user});
				}
			});
		}	
	});
};

exports.getFavoritedItemsFromUser = function(req,res){
	User.findOne({_id:req.params.user_id}, function(err,user){
		if(!user){
			res.json({response:"no user found", status:false, error:err});
		}
		else{
			Location.find({_id:{$in:user.favorited_locations}, app_id:req.params.app_id}, function(err,locations){
				Atom.find({_id:{$in:user.favorited_atoms}, app_id:req.params.app_id}, function(err,atoms){
					
					res.json({response:"Success", 
							  status:true, 
							  favorited_atoms:atoms, 
							  atoms_qty:user.favorited_atoms.length,
							  favorited_locations:locations,
							  locations_qty:user.favorited_locations.length, 
							  user:user
					});
				});
			});
		}	
	});
};

//Push Dashboard
exports.pushDashboard = function (req,res){
	App.findOne({_id:req.params.app_id}, function(err,app){
		Admin.findOne({_id:req.params.admin_id}, function(err,admin){
			Push.find({app_id:req.params.app_id},null,{sort:{date:-1}}, function(err,pushes){
				PushToken.find({app_id:req.params.app_id}, function(err,devices){
					var android_qty=0;
					var ios_qty=0;
					for(var i=0;i<devices.length;i++){
						if(devices[i].device_brand == "Apple"){
							ios_qty ++;
						}
						else{
							android_qty ++;
						}
					}
					res.render('sendPush',{title:" - Push Broadcast", 
										   app:app, 
										   admin:admin, 
										   push_list:pushes, 
										   devices:devices, 
										   android_qty:android_qty, 
										   ios_qty:ios_qty});
				});
			});
		});
	});
};
exports.sendPush = function (req,res){
var android = req.body.android ? true:false;
var ios = req.body.ios ? true:false;
	Admin.findOne({_id:req.body.admin_id}, function(err,admin){
		if(!admin){
			
		}
		else{
			new Push({
			message: req.body.message,
			app_id:req.body.app_id,
			date:new Date(),
			sent_by:admin,
			android:android,
			ios:ios,
			delivered_qty_ios: ios ? req.body.delivered_qty_ios:0,
			delivered_qty_android: android ? req.body.delivered_qty_android:0,
			}).save(function(err,push){
				if(err){
					res.json({response:"error creating push on DB", error:err});
				}
				else{
				if(ios){
					PushToken.find({app_id:req.body.app_id, device_brand:"Apple"},{ push_token: 1, _id: 0 }, function(err,pushtokens){
						if(pushtokens.length<=0){
						}
						else{
							App.findOne({_id:req.body.app_id}, function(err,app){
								var extension = ".pem";
								var carpeta = app.is_development ? "push_certs/dev/":"push_certs/prod/";
								var url = app.is_development ? 'gateway.sandbox.push.apple.com':'gateway.push.apple.com';
								var cert = carpeta+app.ios_cert+extension;
								var key =  carpeta+app.ios_cert_key+extension;
								var tokens_array = new Array();
								for(var i=0;i<pushtokens.length;i++){
									tokens_array.push(pushtokens[i].push_token);
								}
								var service = new apn.connection({ gateway:url, cert:cert, key:key});

								service.on('connected', function() {console.log("Connected");});
								service.on('transmitted', function(notification, device) {
									console.log("Notification transmitted to:" + device.token.toString('hex'));
								});
								service.on('transmissionError', function(errCode, notification, device) {
								    console.error("Notification caused error: " + errCode + " for device ", device, notification);
								});
								service.on('timeout', function () {console.log("Connection Timeout");});
								service.on('disconnected', function() {console.log("Disconnected from APNS");});
								service.on('socketError', console.error);								
								
								// If you plan on sending identical paylods to many devices you can do something like this.
								pushToManyIOS = function(tokens) {
								    var note = new apn.notification();
								    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
									note.badge = 0;
									note.sound = "ping.aiff";
									note.alert = req.body.message;
									note.payload = {'action': "no action"};
								    service.pushNotification(note, tokens);
								}
								pushToManyIOS(tokens_array);
								//console.log("enviar push a: "+tokens_array);
							});
						}
					});
				}
				if(android){
					PushToken.find({app_id:req.body.app_id, device_brand:"Android"}, function(err,pushtokens){
						if(pushtokens.length<=0){
						}
						else{
							// or with object values
							App.findOne({_id:req.body.app_id}, function(err,app){
							if(app){
									var message = new gcm.Message({
									    collapseKey: 'demo',
									    delayWhileIdle: true,
									    timeToLive: 3,
									    data: {
									        key1: 'message1',
									        key2: 'message2'
									    }
									});
									var sender = new gcm.Sender(app.gcm_apikey);
									var registrationIds = [];
									
									// OPTIONAL
									// add new key-value in data object
									//message.addDataWithKeyValue('key1','message1');
									//message.addDataWithKeyValue('key2','message2');
									
									// or add a data object
									message.addDataWithObject({
									    message: req.body.message,
									    app_name: app.name,
									});
									
									message.collapseKey = 'demo';
									message.delayWhileIdle = true;
									message.timeToLive = 3;
									// END OPTION
									
									// At least one required
									for(var i=0;i<pushtokens.length;i++){
										registrationIds.push(pushtokens[i].push_token);		
									}					
									/**
									 * Params: message-literal, registrationIds-array, No. of retries, callback-function
									 **/
									sender.send(message, registrationIds, 4, function (err, result) {
									    console.log(result);
									});
								}
							});
						}
					});
				}
					res.format({
						html: function () { res.redirect('/Dashboard/'+req.body.admin_id); },
						json: function () { res.send(); },
					});
				}
			});
		}
	});
};

exports.hiBeautiful = function(req,res){
var travelday, today, tday, diff, days;
travelday1 = [21,5,7];
travelday2 = [22,8,17];
travelday3 = [1,9,4];
travelday4 = [1,10,15];

message1 = ['To give you too many picos',
			'To tell you how much I love you <3 (yes, again)',
			'To let you know you are the best thing in my life',
			'To be in another adventure with you',
			'To eat more Bagels with you <3',
			'Just to be with you...',
			'To help you kill spiders ;)',
			'To go to San Francisco!!'];
message2 = ['To take you where you want to go!',
			'To meet my friends',
			'To meet my family',
			'............ ;)', 
			'To know new places together'];
message3 = ['To meet your parents :s',
			"To your friend's wedding",
			'To love you even more',
			'To have a great time together',
			'......'];
message4 = ['...',
			'...'];

messages = {
	message1: message1[Math.floor(Math.random() * (message1.length - 1) + 1)],
	message2: message2[Math.floor(Math.random() * (message2.length - 1) + 1)],
	message3: message3[Math.floor(Math.random() * (message3.length - 1) + 1)],
	message4: message4[Math.floor(Math.random() * (message4.length - 1) + 1)],
}

today = new Date();
tday1 = new Date(today.getFullYear(),travelday1[1]-1,travelday1[0],travelday1[2]);
tday2 = new Date(today.getFullYear(),travelday2[1]-1,travelday2[0],travelday2[2]);
tday3 = new Date(today.getFullYear(),travelday3[1]-1,travelday3[0],travelday3[2]);
tday4 = new Date(today.getFullYear()+1,travelday4[1]-1,travelday4[0],travelday4[2]);

diff1 = tday1.getTime()-today.getTime();
diff2 = tday2.getTime()-today.getTime();
diff3 = tday3.getTime()-today.getTime();
diff4 = tday4.getTime()-today.getTime();

//days = Math.floor(diff/(1000*60*60*24));
//hours = Math.floor(diff/(1000*60*60));
//minutes = Math.floor(diff/(1000*60));
first_day = Math.floor(diff1/(1000));
second_day = Math.floor(diff2/(1000));
third_day = Math.floor(diff3/(1000));
fourth_day = Math.floor(diff4/(1000));
res.render('hiBeautiful',{title:" Hi Beautiful", first_day:first_day, second_day:second_day, third_day:third_day, fourth_day:fourth_day, messages:messages});
};
exports.deletePush = function(req,res){
	Push.remove({app_id:req.params.app_id},function(err){
		if(err){
			res.json(error.notFound);
		}
		else{
			res.json({status:true, message:"Push messages borrados exitosamente."});
		}
	});
};
