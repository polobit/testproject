

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

	$.getJSON('scope?scope=COMPANY' , function(result) {
		$.each(result,function(i,data){
			console.log(data);
		});
	}); 

	 $("#contact-results li").click(function(){
   $("#mobile-menu-settings").trigger('click');
   });
 

	 $('#aside').off('li a');
	if(agile_is_mobile_browser()){
		$('#aside').on('touchstart','li a',function(){
			$(this).css('padding-left', 25);
		});
	}
	

	if(( $(window).width() ) < 768 ) {

	/*$('body').on('click','#mobile-dropdown-click-sort',function(){
			$("#contact-sort-views").css("display","block");
   	return false;
	});

	 $('body').on('click','#view-list .dropdown-toggle' , function(){
         $("#contact-sort-views").css("display","none");
    });
   	
   	$('body').on('click','#contact-sort-views',function(){
        $(this).css('display','none');
    });	*/

	$('#recent-menu').off('li');
	$('#recent-menu').on('click', 'li', function(e){
		e.preventDefault();
		$('#mobile-menu-settings').trigger('click');
	});


	
	$('body').on('mousedown','.navi-wrap li a , #navbar li a',function(e){
		e.preventDefault();
		$(this).css('opacity','0.5');
	});

	$('body').on('mouseup','.navi-wrap li a , #navbar li a',function(e){
		e.preventDefault();
		$(this).css('opacity','1');
	});

	$('body').on('touchstart','.magicMenu .i-checks',function(e){
		e.preventDefault();
		$(this).find('input[type="radio"]').trigger('click');
	});

   $('body').on('touchstart','.i-checks',function(e){
   	e.preventDefault();
   $(this).find('input[type="checkbox"]').trigger('click');
   });

   $('body').on('click','#mobile-menu-settings',function(){
    if($('#navbar').hasClass('show')){
    	$('body').css('overflow-y','hidden');
    }
    else {
    	$('body').css('overflow-y','auto');
    }
	});

    $('.agile-menu .fa-history').removeClass('text-md  text-muted');
   
   	$('body').on('click','#navbar li a:not(".dropdown-toggle")',function(){
   		$('body').css('overflow-y','auto');
   	});
   


	$('body').on('click','.navbar-brand',function(){
     $("#navbar").removeClass('show');
     $("#aside").removeClass('off-screen');
     $('body').css('overflow-y','auto');
	});	
	
	$(".navi-wrap li a").click(function(){
	  $("#mobile-menu").delay(2000).trigger("click");
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
   	$('body').css('overflow-y','auto');
   }
   });

   $("#navbar li a:not(.dropdown-menu)").on("click" , function(){
   if($(this).hasClass("dropdown-toggle")) {
	
    }
   else {
   	$("#navbar").removeClass("show");
   }
   });

   $("#documentsmenu span").text("Documents");
   
   }

   $(".person").on("click", function(e){
		e.preventDefault();
		addContactBasedOnCustomfields();
		
	});

   });

//checks if there are any custom fields and if if present navigates to contact-add page otherwise opens person-modal
function addContactBasedOnCustomfields(){
 	$.ajax({
				url : 'core/api/custom-fields/required/scope?scope=CONTACT',
				type : 'GET',
				dataType : 'json',
				success : function(data){
					if(data.length > 0)
					{
						Backbone.history.navigate("contact-add" , {trigger: true});
						
					}
					else
						$("#personModal").modal("show");
				}
			});
 }









	
	
	
	
	