// JavaScript Document
/****CREATE TOUCH EVENT WITH FALLBACK****/
var onreadytype;
'cordova' in window ? onreadytype = 'deviceReady' : onreadytype = 'DOMContentLoaded';
var clkType;
'ontouchstart' in document.documentElement ? clkType = 'touchstart' : clkType = 'click';

//DeviceType
var deviceType = {
	isMobile       : false,
	isTablet       : false,
	isDesktop      : false,
	isTouch        : false,
	isIos          : false,
	isAndroid      : false,
	is3dSupporting : false,
	isOldAndroid   : false,
	isModernAndroid: false,
	isHTC          : false,
	isSamsung      : false,
	isHomeScreen   : false,
	set            : function(){
		var uagnt = navigator.userAgent;
		if( (uagnt.match(/android/i)) && !(uagnt.match(/Mobile/i)) ||
			(uagnt.match(/iPad/i))
		){
			this.isTablet = true;
		}
		else if( (uagnt.match(/iPhone/i)) ||
			(uagnt.match(/iPod/i)) ||
			(uagnt.match(/Android/i)) ||
			(uagnt.match(/android/i)) ||
			(uagnt.match(/webOS/i)) ||
			(uagnt.match(/BlackBerry/i)) ||
			(uagnt.match(/Opera Mobi/i)) ||
			(uagnt.match(/MOT/i)) ||
			screen.height < 600
		){
			this.isMobile = true;
		}
		else {
			this.isDesktop = true;
		}
		
		if(uagnt.search('Android') != -1){
			this.isAndroid = true;
			var androidVer = parseFloat(uagnt.slice(uagnt.indexOf("Android")+8)); 

			if (androidVer >= 3.2)this.isModernAndroid = true;			
			if (androidVer >= 2.1)this.is3dSupporting = true;
			else this.isOldAndroid = true; 
		}else if( (uagnt.match(/iPhone/i)) ||
			(uagnt.match(/iPod/i)) ||
			(uagnt.match(/iPad/i))
		){
			this.isIos = true;
			this.is3dSupporting = true;
			if( ("standalone" in window.navigator ) && navigator.standalone)this.isHomeScreen = true;
		}
		
		if( (uagnt.match(/HTC/i)) )this.isHTC = true;
		if( (uagnt.match(/SG/i)) )this.isSamsung = true;
		
		if("ontouchstart" in document.documentElement)this.isTouch = true;
	}
}
deviceType.set();

//orientationDelay
if(deviceType.isIos)orientationDelay = 80;
else orientationDelay = 450; 


document.addEventListener("touchmove", function(e){
	//e.preventDefault();
});


function scrollTop(){
	if(deviceType.isIos)scrollTo(0,0);
	else scrollTo(0,1);	
}


function imgPreloader(imgs){
	var imgsLn = imgs.length;
	for(var i=0;i<imgsLn;i++){
		var imgElem = document.createElement('img');
		imgElem.src = src = imgs[i];
		imgElem.setAttribute('style','position:absolute;left:-100px;bottom:-100px;');
		document.documentElement.appendChild(imgElem);
		document.documentElement.removeChild(imgElem);
	}
}

/**Load files**/
//Append files
function loadjscssfile(filename, filetype){
	var dox=document;
 	if (filetype==="js"){ //if filename is a external JavaScript file
	  	var fileref=dox.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename+'.'+filetype);
	}
 	else if (filetype==="css"){ //if filename is an external CSS file
  		var fileref=dox.createElement("link");
  		fileref.setAttribute("rel", "stylesheet");
  		fileref.setAttribute("type", "text/css");
  		fileref.setAttribute("href", filename+'.'+filetype);
 	}
 	if (typeof fileref!=="undefined")dox.getElementsByTagName("head")[0].appendChild(fileref);
}


function appendCss(tpl){
	var dynamicTag = document.getElementById('dynaJsStyle');
	dynamicTag.innerHTML = tpl;
}

function bottomHalfFixCss(){

	var h = dHeight,
		topH = document.getElementById('jsTopHalf').scrollHeight,
		headerH = document.getElementById('headerWrapFixHeight').scrollHeight,
		diff = h.view-(topH+headerH+42);
	
	var iframeH = h.doc;
	//if(deviceType.isIos)diff -= dHeight.osDifferential,iframeH -= headerH;
	var sldMeWH = diff;
	var cssTpl = '\
		.hpGame {width:'+sldMeWH+'px !important;height:'+sldMeWH+'px !important;}\
		#fakeIframeInner.fakeIframeShowFull,#fakeIframeMask {min-height:'+iframeH+'px !important;}\
		.dPopMask {width:100%; height:'+h.view+'px !important;}';
	appendCss(cssTpl);
	sld.geometry('gameSlider',sld.fluidWidths('.hpGame'));  
}


var dHeight = {
	doc  : '',
	view : '',
	osDifferential : '',
	getTallerH : function(){
		if(this.doc > this.view)return this.doc;
		else return this.view;	
	},
	get  : function(){
		if(deviceType.isHomeScreen || typeof window.cordova == 'object')this.osDifferential = 0;
		else {
			if(deviceType.isIos || deviceType.isSamsung)this.osDifferential = 60;
			else this.osDifferential = 50;
		}

		
		var wh = window.innerHeight,
		dh = document.height,
		vh = wh+this.osDifferential;
	
		this.doc = dh;
		this.view = vh;
		return {doc  : dh,view : vh};
	}
}

function updateViewPort(){
	setTimeout(function(){
			dHeight.get(); //Update view
			console.log(dHeight.view);
			document.body.setAttribute('style','min-height:'+dHeight.view+'px !important');
			var cssTpl = '\
				.dPopMask,html,body,.wrapper,#map {width:100%; height:'+dHeight.view+'px !important;}';
			//appendCss(cssTpl);
		setTimeout(scrollTop,50);
	},700);
}

document.addEventListener(onreadytype,updateViewPort);

if(deviceType.isIos)document.documentElement.className += ' deviceTypeIsIos ';
if(!deviceType.isModernAndroid && deviceType.isAndroid)document.documentElement.className += ' deviceTypeIsAndroid2 ';




