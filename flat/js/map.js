var mapLoc = {
	lat : 40.7619,
	lon : -73.9763,
	locate : function(callback){
		var myObj = mapLoc;
		var lat = myObj.lat;
		var lon = myObj.lon;
		// Desktop get geo info method
		
		// Mobile browsers that support the W3C Geo API (iPhone,Android)
		if (deviceType.isMobile  && navigator.geolocation || 
			deviceType.isTablet && navigator.geolocation || 
			deviceType.isDesktop  && navigator.geolocation )
		{
			navigator.geolocation.getCurrentPosition(function(position){
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					if(typeof callback == "function")callback(parseFloat(lat),parseFloat(lon));
				},function(error){
					//alert("Can't retrieve your current location...");
					lat = myObj.lat;
					lon = myObj.lon;
					
					if(typeof callback == "function")callback(parseFloat(lat),parseFloat(lon));
				},{
					maximumAge: 5000
			});
		}// Mobile devices that don't support nagigator.geolocation 
		else {
			if(typeof callback == "function")callback(parseFloat(lat),parseFloat(lon));
		}
	},
	setAtMe : function(lat,lon,noPopUp){
		var myObj = mapLoc;
		if(myObj.me)map.removeLayer(myObj.me);
		var center = new L.LatLng(lat,lon); // geographical point (longitude and latitude)
		
		map.setView(center, 16);
		
		var MyIcon = L.Icon.extend({
				iconUrl: 'flat/libraries/leaflet/images/marker.png',
				//shadowUrl: 'img/categories/marker/markerShadow.png',
				shadowUrl : null,
				iconSize: new L.Point(20, 20),
			   // shadowSize: new L.Point(0, 0),
				iconAnchor: new L.Point(10, 10),
				popupAnchor: new L.Point(0, -7)
			});
			
		var icon = new MyIcon();
		
		myObj.me = new L.Marker(center,{icon:icon}).bindPopup("You&nbsp;are&nbsp;here");
		map.addLayer(myObj.me);
		if(!noPopUp){
			myObj.me.openPopup();
			setTimeout(function(){myObj.me.closePopup()},4000);
		}
	}
}

var map = new L.Map('map',
	{
		attributionControl:false
	});

var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
	cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
	cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

map.setView(new L.LatLng(40.72612450121212, 73.99640369242422), 16).addLayer(cloudmade);


var markerLocation = new L.LatLng(51.5, -0.09),
	marker = new L.Marker(markerLocation);

map.addLayer(marker);
marker.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

function genMap(lat,lon){//Set after localization
	var center = new L.LatLng(lat,lon); // geographical point (longitude and latitude)
	
	map.setView(center, 16);
	mapLoc.setAtMe(lat,lon,false);
}

mapLoc.locate(genMap);
/*var circleLocation = new L.LatLng(51.508, -0.11),
	circleOptions = {color: '#f03', opacity: 0.7},
	circle = new L.Circle(circleLocation, 500, circleOptions);

circle.bindPopup("I am a circle.");
map.addLayer(circle);


var p1 = new L.LatLng(51.509, -0.08),
	p2 = new L.LatLng(51.503, -0.06),
	p3 = new L.LatLng(51.51, -0.047),
	polygonPoints = [p1, p2, p3],
	polygon = new L.Polygon(polygonPoints);

polygon.bindPopup("I am a polygon.");
map.addLayer(polygon);


map.on('click', onMapClick);

var popup = new L.Popup();

function onMapClick(e) {
	var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';

	popup.setLatLng(e.latlng);
	popup.setContent("You clicked the map at " + latlngStr);
	map.openPopup(popup);
}*/





function markerEventer(marker,site){
	var catImg = site.venue.categories[0].icon.prefix+'32.png',
		venue = site.venue,
		loc = venue.location;
		
	marker.on('click', function(e) { 
		var tpl = '<h1><img src="'+catImg+'" />'+venue.name+'</h1><p>Address: '+loc.address+'</p>';
		dPop.create(tpl,{
			noMask : true,
			css : 'eventPop'	
		});
	});

	if( !("ontouchstart" in document.documentElement )){
		marker.on('mouseover', function(e) {
			//if(typeof mapMarkPop != "undefined"){clearTimeout(mapMarkPop);}
			var tpl = '\
				<h3>'+venue.name+'</h3>';
				this.bindPopup(tpl).openPopup();
		});
		
		/*marker.on('mouseout', function(e) {
			myObj = this;
			//var mapMarkPop = setTimeout(function(){
				myObj.closePopup();
			//},300);
			
		});*/
	}
}
		    
var mapData = {
	layers : {},
	genMarkers : function(fsqData){
		
		var checkins = fsqData.response.checkins;

		if(checkins.count >0){
			var items = checkins.items;
			
			for (var i=0;i<checkins.count;i++){
				var site = items[i],
					loc = site.venue.location,
					catImg = site.venue.categories[0].icon.prefix+'32.png';
				
				var catName = site.venue.categories[0].shortName,
					catName = catName.replace(' ','_');
				var markerLoc = new L.LatLng(parseFloat(loc.lat),parseFloat(loc.lng));
						
						
				var MyIcon = L.Icon.extend({
					iconUrl: catImg,
					shadowUrl : null,
					iconSize: new L.Point(32, 32),
					iconAnchor: new L.Point(17, 32),
					popupAnchor: new L.Point(0, -40)
				});
						
									
				var icon = new MyIcon();
				marker = new L.Marker(markerLoc,{icon: icon});
				
				marker.isMarker  = true;
						
				markerEventer(marker,site);
				
				//Generate layers
				if(typeof mapData.layers[catName] != "object"){
					mapData.layers[catName] = new L.LayerGroup();
					
				}
				mapData.layers[catName].addLayer(marker);
				
				
		
			}
			for(var key in mapData.layers){
				map.addLayer(mapData.layers[key]);
			}
			
		}
	}
}





function initTouchHandler(){
	var is3dSupporting = deviceType.is3dSupporting;
	
	var diffInCoord,
		originalCoord = { x: 0, y: 0 },
		finalCoord = { x: 0, y: 0 };
	var $query = '.eventPop';
	var curSldPos; //localize var	

	$(document).on('touchstart',$query, function(e){			
		var orig = e.originalEvent;
		
		curSldPos = 0;
		
		originalCoord.x = orig.changedTouches[0].pageX;
		originalCoord.y = orig.changedTouches[0].pageY;
		
		finalCoord.x = originalCoord.x;
		finalCoord.y = originalCoord.y;
		diffInCoord = 0;
		
		this.style.webkitTransition = '';
	});
	
	$(document).on('touchmove', $query, function(e){	
		var orig = e.originalEvent;
		finalCoord.x = orig.changedTouches[0].pageX;
		finalCoord.y = orig.changedTouches[0].pageY;
		
		diffInCoord = finalCoord.x - originalCoord.x;
		//if (!navigator.userAgent.match(/Android/i)) {    
			difCorAb = diffInCoord < 0 ? -diffInCoord : diffInCoord;
			if(difCorAb > 3)e.preventDefault();
		//}
		var moveMe = curSldPos+diffInCoord;
		if(is3dSupporting)this.style.webkitTransform = 'translate3D('+moveMe+'px, 0px, 0px) rotateZ(0deg)';	
		else this.style.webkitTransform = 'translateX('+moveMe+'px)';	
	});
	
	
	$(document).on('touchend',$query, function(){
		this.style.webkitTransition = 'all 300ms ease-in';	
		var allowMove = true;
		if (diffInCoord <100 && diffInCoord > -100){
			allowMove = false;
		}else if(diffInCoord >= 100){//rgt
			var modif = 140;
		}else if(diffInCoord <= -100){//lft
			var modif = -140;
		}	
		
		var moveMe;
		if(allowMove){
			moveMe = curSldPos+modif;
			dPop.hide();
		
		}else {
			var moveMe = 0;
		}
		if(is3dSupporting)this.style.webkitTransform = 'translate3D('+moveMe+'px, 0px, 0px) rotateZ(0deg)';	
			else this.style.webkitTransform = 'translateX('+moveMe+'px)';		
	});				
}
initTouchHandler();

