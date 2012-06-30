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

