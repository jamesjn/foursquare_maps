// JavaScript Document =============================================================================
/*   Minimal Popups
    ========================================================================== */

var dPop = {
	mask  : 'dPopMask',
	popup :	'dPopWin',
	hide   : function(replaceWith,callback,onlyHide){ 
		var prevWin = document.getElementById(this.popup);
		if(prevWin != null){
			var prevWinCSS   = prevWin.className,
				isPrevHidden = false;
				
			if(prevWinCSS.search(onlyHide) >= 0 || typeof onlyHide === "undefined"){
				if(prevWinCSS.search('bringDPopUpOut') >= 0)isPrevHidden = true;
				if(!isPrevHidden){
					prevWin.className = prevWinCSS.replace('bringDPopUpIn','bringDPopUpOut');
				}
				if(typeof replaceWith === "function")prevWin.parentNode.replaceChild(replaceWith(),prevWin);
				else {$('.dPopMask').fadeOut();}
				if(typeof callback === "function")callback();
			}
		}
	},
	create : function(tpl,params){
		var myObj = this;
		if(typeof params === "undefined")params = {};
		if(typeof params.css === "undefined")params.css = '';
		if(typeof params.noMask === "undefined")params.noMask = false;
		if(typeof params.XButton === "undefined")params.XButton = true;
		
		var mask = document.getElementsByClassName(this.mask)[0];
		if(!params.noMask)mask.style.display = 'block';
		
		if(params.XButton)tpl = '<a class="dPopClose" href="#"></a>' + tpl;
		
		var prevWin = document.getElementById(this.popup);
		
		function generateNewPopup(){
			var win = document.createElement('div');
			win.id = myObj.popup;
			win.className = params.css += ' bringDPopUpIn ';
			win.innerHTML = tpl;
			
			return win;
		}
		this.hide(generateNewPopup,null);
	}
}
var popUpObjReady = document.createEvent("Event");
popUpObjReady.initEvent("popupsReady",true,true);
document.dispatchEvent(popUpObjReady);

$(document).on(clkType,'.dPopMask,.dPopClose',function(e){
	e.preventDefault();
	dPop.hide();
});

$(window).on('pageshow',function(){
	setTimeout(function(){
		if(dPop)dPop.hide(null,null,'loaderPop');
	},200);
});




function reverseZStack(){
	var ZNum = 1200;
	$('ul[data-UIList] li').each(function(i) {
        $(this).css('z-index', ZNum - i);
    });	
}
reverseZStack();


$('ul[data-UIList]').on('click','li:not(li li)',function(e){

	if(e.target.nodeName.toUpperCase() === 'H3'){
		var innerUl = $('.aNoteContent',this),
		innerUlH = innerUl[0].scrollHeight;
		
		if(innerUl.height() === 0)innerUl.css('height',innerUlH + 'px');
		else innerUl.css('height','0px');
	}
});


(function(){
	var is3dSupporting = deviceType.is3dSupporting;
	
	var diffInCoord,
		originalCoord = { x: 0, y: 0 },
		finalCoord = { x: 0, y: 0 };
	var $query = 'ul[data-UIList] li .actualNote';
	var curSldPos; //localize var	

	$('ul[data-UIList]').on('touchstart',$query, function(e){			
		var orig = e.originalEvent;
		
		curSldPos = 0;
		
		originalCoord.x = orig.changedTouches[0].pageX;
		originalCoord.y = orig.changedTouches[0].pageY;
		
		finalCoord.x = originalCoord.x;
		finalCoord.y = originalCoord.y;
		diffInCoord = 0;
		
		this.style.webkitTransition = '';
	});
	
	$('ul[data-UIList]').on('touchmove', $query, function(e){	
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
	
	
	$('ul[data-UIList]').on('touchend',$query, function(){
		this.style.webkitTransition = 'all 300ms ease-in';	
		var allowMove = true;
		if (diffInCoord <50 && diffInCoord > -50){
			allowMove = false;
		}else if(diffInCoord >= 50){//rgt
			var modif = 140;
		}else if(diffInCoord <= -50){//lft
			var modif = 0;
		}	
		
		var moveMe;
		if(allowMove){
			moveMe = curSldPos+modif;
		}else {
			var moveMe = 0;
		}
		if(is3dSupporting)this.style.webkitTransform = 'translate3D('+moveMe+'px, 0px, 0px) rotateZ(0deg)';	
			else this.style.webkitTransform = 'translateX('+moveMe+'px)';		
	});		
		
})();




