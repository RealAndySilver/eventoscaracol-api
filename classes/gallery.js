exports.gallery_array= function (object_to_evaluate){
	var gallery = [];
	gallery.push(object_to_evaluate.image_url[0]);
	gallery.push(object_to_evaluate.image_url1);
	gallery.push(object_to_evaluate.image_url2);
	gallery.push(object_to_evaluate.image_url3);
	gallery.push(object_to_evaluate.image_url4);
	gallery.push(object_to_evaluate.image_url5);
	
	var final_array = [];
	for(var i = 0; i < gallery.length; i++){
		if(gallery[i] != null){
			final_array.push(gallery[i]);
		}
	}	
	return final_array;
};