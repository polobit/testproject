

$('#app-aside-folded').on('click', function(e) {
	e.preventDefault();
	/*$('.app-aside-folded-inactive .hidden-folded ,.app-aside-folded .navi > ul > li > a span').css('display','none');
	
	if ($('#wrap').hasClass("app-aside-folded") ) {
	
		setTimeout(function(){
	$(".app-aside-folded-inactive .hidden-folded,.app-aside-folded .navi > ul > li > a span").fadeIn();
	
		},600);
    
	}*/
	$('#wrap').toggleClass('app-aside-folded');
    if( $('#wrap').hasClass('app-aside-folded')) {
		console.log("folded");
		$("#app-aside-folded i").removeClass("fa-dedent");
		$("#app-aside-folded i").addClass("fa-indent");
		$(".app-aside-folded:not(.app-aside-dock) .navi > ul > li#documentsmenu > a span").text("Docs");
	}
	else {
		$("#app-aside-folded i").removeClass("fa-indent");
		$("#app-aside-folded i").addClass("fa-dedent");
		$(".navi > ul > li#documentsmenu > a span").text("Documents");
	}
	
	//contactInnerTabsInvoke();
	
	});
	
$(document).ready(function(){

    $("#contact-results li").click(function(){
   $("#mobile-menu-settings").trigger('click');
   });
 

	if(( $(window).width() ) < 768 ) {
	$("#aside li a").click(function(){
	  $("#mobile-menu").trigger("click");
	});
	

   $("#mobile-menu-settings").on("click",function(){
   if( $("#aside").hasClass("off-screen") ) {
   $("#aside").removeClass("off-screen");
   }
   });

  

   $("#searchText").keyup(function(e){
    if(e.which == 13) {
   	$("#mobile-menu-settings").trigger('click');
   }
   });


   $("#mobile-menu").on("click",function(){
   if( $("#navbar").hasClass("show")) {
   	$("#navbar").removeClass("show");
   }
   });

   $("#navbar li a").on("click" , function(){
   if($(this).hasClass("dropdown-toggle")) {
	
    }
   else {
   	$("#navbar").removeClass("show");
   }
   });
   
   }



   });







 
	
	
	
	
	