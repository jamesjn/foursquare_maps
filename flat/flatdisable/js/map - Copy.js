map = {
	map : null,
	location: {
		me : false, //Store layer for my location
		lat : 40.7619,
		lon : -73.9763,
		locate : function(callback){
			var myObj = map.location;
			var lat = myObj.lat;
			var lon = myObj.lon;
			// Desktop get geo info method
			if (deviceType.isDesktop) {
				//lat = geoip_latitude();
				//lon = geoip_longitude();
				//if(typeof callback == "function")callback(parseFloat(lat),parseFloat(lon));
				alert('ONLY MOBILE DEVICES ARE CURRENTLY SUPPORTED');
			}
			// Mobile browsers that support the W3C Geo API (iPhone,Android)
			else if (deviceType.isMobile  && navigator.geolocation || 
				     deviceType.isTablet && navigator.geolocation)
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
			var myObj = map.location;
			if(myObj.me)map.map.removeLayer(myObj.me);
			var center = new L.LatLng(lat,lon); // geographical point (longitude and latitude)
			
			map.map.setView(center, 13);
			
			var MyIcon = L.Icon.extend({
				    //iconUrl: 'img/layout/iconMyLocation.png',
				    //shadowUrl: 'img/categories/marker/markerShadow.png',
				    shadowUrl : null,
				    iconSize: new L.Point(20, 20),
				   // shadowSize: new L.Point(0, 0),
				    iconAnchor: new L.Point(10, 10),
				    popupAnchor: new L.Point(0, -7)
				});
				
			var icon = new MyIcon();
			
			myObj.me = new L.Marker(center,{icon:icon}).bindPopup("You&nbsp;are&nbsp;here");
			map.map.addLayer(myObj.me);
			if(!noPopUp){
				myObj.me.openPopup();
				setTimeout(function(){myObj.me.closePopup()},4000);
			}
		}
	},
	init : function(){
		var myObj = this;
		this.map = new L.Map('mapDiv',
		{
			attributionControl:false
		});
		var id = 997;
		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1815877ac7564d4d874cefd63217e417/'+id+'/256/{z}/{x}/{y}.png',
			cloudmadeUrlB = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: false, errorTileUrl : cloudmadeUrlB});
	
		var center = new L.LatLng(this.location.lat,this.location.lat); // geographical point (longitude and latitude)
		this.map.setView(center, 13);
		map.map.addLayer(cloudmade);

		function setMap(lat,lon){//Set after localization
			var center = new L.LatLng(lat,lon); // geographical point (longitude and latitude)
			
			map.map.setView(center, 13);
			myObj.location.setAtMe(lat,lon,true);
		}
		
		this.location.locate(setMap);//callBack prevents running prematurely of setMap
	},
	markers : {
		refresh : function(){
			var myObj = map;
			function setMap(lat,lon){
				$.ajax({
					cache:false,
				  	url: "/ajax/ajaxResponder.php?call=getEventsWeek",
				  	dataType: 'json',
				  	timeout : 60000,
				  	success: function(response){
				  		myObj.markers.events = response;
				  		myObj.markers.removeAllMarkers();
			    		myObj.markers.set(response,window.dItemsReady);
				  	}
				});
			}
			map.location.locate(setMap);
		},
		removeAllMarkers : function(){
			var dMap = map.map;
			var mapLayers = dMap._layers;
			for(var key in mapLayers){
				var layer = mapLayers[key];
				if(layer.isMarker){
					dMap.removeLayer(layer);
				}
			}
		},
		genSubLayers : function(){
			var dMap = map.map;
			var mapLayers = dMap._layers;
			var refSubLayers = map.markers.sublayers;
			
			for(var key in mapLayers){
				var layer = mapLayers[key];
				var layerType = layer['typeid'];
				var layerTypeName  = layer['typename'];
				var layerCost = parseInt(layer['cost']);
				
				
				if(layer.isMarker){
					if(layer.hasFriend){
						if(typeof refSubLayers['-2'] != "object")refSubLayers['-2'] = new L.LayerGroup();
						refSubLayers['-2'].addLayer(layer);
						refSubLayers['-2'].typeName = 'friends';
					}else if(layer.isOwnOrSave){
						if(typeof refSubLayers['-3'] != "object")refSubLayers['-3'] = new L.LayerGroup();
						refSubLayers['-3'].addLayer(layer);
						refSubLayers['-3'].typeName = 'hangs';
					}else {
						if(typeof refSubLayers[layerType] != "object")refSubLayers[layerType] = new L.LayerGroup();
						refSubLayers[layerType].addLayer(layer);
						refSubLayers[layerType].typeName = layerTypeName;
					}
					
					
					//All Items
					if(typeof refSubLayers['0'] !== "object")refSubLayers['0'] = new L.LayerGroup();
					refSubLayers['0'].addLayer(layer);
					refSubLayers['0'].typeName = 'all';
						
					//FreeItems
					if(layerCost === 0){
						if(typeof refSubLayers['-1'] !== "object")refSubLayers['-1'] = new L.LayerGroup();
						refSubLayers['-1'].addLayer(layer);
						refSubLayers['-1'].typeName = 'free';
					}/*else if(layerCost < 16){
						if(typeof refSubLayers['-2'] !== "object")refSubLayers['-2'] = new L.LayerGroup();
						refSubLayers['-2'].addLayer(layer);
						refSubLayers['-2'].typeName = '$';
					}*/
				}
			}
			if(typeof catIdsReady == "function")catIdsReady();
		},
		removeSubLayers : function(type){
			var dMap = map.map;
			var refSubLayers = map.markers.sublayers;
			
			this.removeAllMarkers();
			
			for(var key in refSubLayers){
				var layer = refSubLayers[key];
				dMap.removeLayer(layer);
			}
		},
		genTimeLayers : function(){
			var dMap = map.map;
			var mapLayers = dMap._layers;
			var refTimeLayers = this.timelayers;
			
			refTimeLayers['tfMorning'] = new L.LayerGroup();
			refTimeLayers['tfMidday'] = new L.LayerGroup();
			refTimeLayers['tfNight'] = new L.LayerGroup();
			
			for(var key in mapLayers){
				var layer = mapLayers[key];
				if(layer.isMarker){
					var shour = parseInt(layer.starthour);
					var ehour = parseInt(layer.endhour);
					
					if(shour >= 6 && shour < 12){
						refTimeLayers['tfMorning'].addLayer(layer);
					}
					if(shour < 18 && ehour >= 12){
						refTimeLayers['tfMidday'].addLayer(layer);
					}
					if(ehour < 6 || ehour >= 18){
						refTimeLayers['tfNight'].addLayer(layer);
					}
				}
			}
		},
		removeTimeLayers : function(){
			var dMap = map.map;
			var refTimeLayers = this.timelayers;
			
			this.removeAllMarkers();
			
			for(var key in refTimeLayers){
				var layer = refTimeLayers[key];
				dMap.removeLayer(layer);
			}	
		},
		filter : function(filter,type){
			if(type == "master"){
				this.sublayers = {};//reset
				for (var key in this.layers){//Append layers to map
					var layer = this.layers[key];
					if(layer != undefined)map.map.removeLayer(layer);
				}
				if(this.layers[filter]){
					if(this.layers[filter] != undefined)
					map.map.addLayer(this.layers[filter]);
				}
				this.genSubLayers();
				//this.genTimeLayers();
			}else {
				if(filter == 0){
					for(var key in this.sublayers){
						var layer = this.sublayers[key];
						map.map.addLayer(layer);
					}
				}else {
					this.removeSubLayers(type);
					map.map.addLayer(map.markers.sublayers[filter]);
				}
				
				//this.genTimeLayers();
			}
		},
		filtertime : function(filterType,isActive,anyNowActive){
			var dMap = map.map;
			var refTimeLayers = this.timelayers;
			var layer;
			
			if(filterType === 'tfAll' || !anyNowActive){//All or none
				timeControl.resetToAll();
				for(var key in refTimeLayers){
					layer = refTimeLayers[key];
					dMap.addLayer(layer);
				}	
			}else {
				this.removeTimeLayers();
				if(filterType === 'tfMorning')layer = refTimeLayers['tfMorning'];
				else if(filterType === 'tfMidday')layer = refTimeLayers['tfMidday'];
				else layer = refTimeLayers['tfNight'];
				
				if(isActive)dMap.addLayer(layer);
			}
		},
		events : {},
		layers : {},
		sublayers : {},
		timelayers : {},
		set : function(dItems,callback){
			var dItemsLn = dItems.length-1;
			for(i=0;i<=dItemsLn;i++){
				var dItem = dItems[i];//Array of all dItem data
				

				var markerLoc = new L.LatLng(parseFloat(dItem.lat),parseFloat(dItem.lon));
				var itemWFriend = false;
				var ownOrSelf = false;
				
				if ((parseInt(dItem.owner) > 0)||(parseInt(dItem.self) > 0)){
					ownOrSelf = true;
					var MyIcon = L.Icon.extend({
					    iconUrl: 'img/categories/marker/self.png',
					    shadowUrl : null,
					    iconSize: new L.Point(35, 41),
					    iconAnchor: new L.Point(17, 44),
					    popupAnchor: new L.Point(0, -40)
					});
				}
				else if (parseInt(dItem.numfriends) > 0){
					itemWFriend = true;
					var MyIcon = L.Icon.extend({
					    iconUrl: 'img/categories/marker/friend.png',
					    shadowUrl : null,
					    iconSize: new L.Point(35, 41),
					    iconAnchor: new L.Point(17, 44),
					    popupAnchor: new L.Point(0, -40)
					});
				}else {
					var MyIcon = L.Icon.extend({
					    iconUrl: 'img/categories/marker/'+dItem['category']+'.png',
					    shadowUrl : null,
					    iconSize: new L.Point(35, 41),
					    iconAnchor: new L.Point(17, 44),
					    popupAnchor: new L.Point(0, -40)
					});
				}
							
				var icon = new MyIcon();
				marker = new L.Marker(markerLoc,{icon: icon});
				marker.typename  = dItem.typename;
				marker.typeid    = dItem.typeid;
				marker.cost      = dItem.cost;
				marker.starthour = dItem.starthour;
				marker.endhour   = dItem.endhour;
				marker.hasFriend    = itemWFriend;
				marker.isMarker  = true;
				marker.isOwnOrSave = ownOrSelf;
				
				
				this.bindEvent(marker,dItem);
				
				var dayId = dItem.day;
				
				//Generate layers
				if(typeof this.layers[dayId] != "object")this.layers[dayId] = new L.LayerGroup();
				this.layers[dayId].addLayer(marker);

				//map.map.addLayer(marker);
			}//end for
			
			today = dItems[0].day;
			map.map.addLayer(this.layers[today]);
			
			this.genSubLayers();
			//this.genTimeLayers();
			if(typeof callback == "function")callback()
		},
		bindEvent : function(marker,dItem){
			marker.on('click', function(e) { 
				if(!disableMarkerClk)cardsitions.updateCard(dItem);
		    });
	
			if( !("ontouchstart" in document.documentElement )){
			    marker.on('mouseover', function(e) {
			    	//if(typeof mapMarkPop != "undefined"){clearTimeout(mapMarkPop);}
			    	var tpl = '<img src="img/categories/small/'+dItem['category']+'.png" alt="'+dItem['category']+'" />\
						<h3>'+dItem['title']+'</h3>\
						<span class="priceNTime"><label>From: </label>'+dItem['start']+'<br /><label>Until: </label>'+dItem['end']+'<strong>$'+dItem['cost']+'</strong></span>';
			        	this.bindPopup(tpl).openPopup();
			    });
			    
			   	marker.on('mouseout', function(e) {
			    	myObj = this;
			    	//var mapMarkPop = setTimeout(function(){
			    		myObj.closePopup();
			    	//},300);
			        
			    });
			}
		    
		}
	}
}
map.init();