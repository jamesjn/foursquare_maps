function getFSQData(){
	return $.ajax({
		url : '/foursquare/self_checkins',
		dataType : 'json'
	});
}

$.when(getFSQData()).then(function(data){
	//console.log(data.responseText);
	if('error' in data ||
	   'meta' in data && 'errorType' in data.meta){
		   window.location = 'login';
	}else {
	    mapData.genMarkers(data);
	}
}); 

