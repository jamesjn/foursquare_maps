function getFSQData(){
	return $.ajax({
		url : '/foursquare/self_checkins',
		dataType : 'json'
	});
}

$.when(getFSQData()).then(function(data){
	//console.log(data.responseText);
	if('meta' in data && 'errorType' in data.meta && data.meta.errorType === "server_error"){
		dPop.create(data.meta.errorDetail,{css:'popWarn'});
	}else {
		if('error' in data ||
		   'meta' in data && 'errorType' in data.meta){
			   window.location = 'login';
		}else {
			mapData.genMarkers(data);
		}
	}
}); 

var filterList = '';