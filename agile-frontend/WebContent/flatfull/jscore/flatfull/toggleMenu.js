

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



//addDescriptionInfo();
	
 $("#addDescriptionLink").click(function(e){
 e.preventDefault();
 $(this).hide();
   $("#addDescriptionInfo").toggle();
   });

 $("#activityTaskModal").on("click", "#taskDescriptionLink", function(e){
 e.preventDefault();
 $(this).hide();
   $("#taskDescriptionInfo").toggle();
   });

$("#activityModal").on("click", "#eventDescriptionLink", function(e){
 e.preventDefault();
 $(this).hide();
   $(".eventDescriptionInfo").toggle();
   });
//addDescriptionInfo();
	
	

   $("#contact-results li").click(function(){
   $("#mobile-menu-settings").trigger('click');
   });



   
 




 	 $('.aside-wrap').off('ul li');
	 if(agile_is_mobile_browser()){

	 	$('body').on('click',function(e){
		setTimeout(function(){
		if(e.target.id != 'searchText' && !$(e.target).closest('button').hasClass('search-menu-mobile'))  {
		$('.search-mobile').addClass('hide');
		$('.add-modal-mobile , #search-menu-mobile').addClass('visible-xs');
		$('.navbar-brand').removeClass('hide');
		}
		},500);
	});

	 	$('body').on('click','.add-modal-mobile',function(){
	 		
		if($('#aside').hasClass('off-screen')) {
			$("#mobile-menu").trigger('click');
		}
		
		});


	// search bar in mobile 
		$('#search-menu-mobile').on('click touchstart',function(){
		$('.search-mobile').removeClass('hide');
		$('.add-modal-mobile , #search-menu-mobile').removeClass('visible-xs');
		$('.navbar-brand').addClass('hide');
		}); 	



	 	$('.aside-wrap ul li').bind('touchstart',function(){
 		$('.aside-wrap ul li').removeClass('active');
 		$(this).addClass('active');
 		}).bind('touchleave touchend',function(){
 			setTimeout(function(){
 		$('.aside-wrap ul li').removeClass('active');
 		},500);
 		});

 		
		}

	$('#menu1 a').click(function(e){
		console.log(e.target);
	});	

	
	

	if(( $(window).width() ) < 768 ) {


	// if the tabs are in wide columns on larger viewports
    $('.content-tabs').tabCollapse();

    // initialize tab function
    $('.nav-tabs a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('#navbar').removeClass('bg-white-only');

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

	/*$('#recent-menu').off('li');
	$('#recent-menu').on('click', 'li', function(e){
		e.preventDefault();
		$('#mobile-menu-settings').trigger('click');
	});
*/

	
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
    $('body').on('click', function (e) {
	    $('.popover').each(function () {
	        //the 'is' for buttons that trigger popups
	        //the 'has' for icons within a button that triggers a popup
	        if ((!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0 && !e.target.closest(".need_help")) || e.target.hasAttribute("rep")) {
	            $(this).popover('hide');
	        }
	    });
	});

	var options = [];

	$( '#advanced-search-fields-group a' ).on( 'click', function( event ) {

   	   var $target = $( event.currentTarget ),
       val = $target.attr( 'data-value' ),
       $inp = $target.find( 'input' ),
       idx;
	   if ( ( idx = options.indexOf( val ) ) > -1 ) {
	      options.splice( idx, 1 );
	      setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
	   } else {
	      options.push( val );
	      setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
	   }

	   $( event.target ).blur();
	      
	   console.log("options="+options );
	   if($(".searchtypeall").find(".choose-column-chbx").prop("checked") == false)
	   {
	   	$(".searchtype").find(".choose-column-chbx").prop("checked",true);
	   	$(".searchtypeall").find(".choose-column-chbx").prop("checked",true);
	   }
	   else{
	   	 $(".searchtype").find(".choose-column-chbx").prop("checked",false);
	   }
	  
	   var json = serializeForm("advanced-search-filter");
	   console.log("checked elements are = "+ json.toString());
	   
	   
	});

	$(".searchtypeall").change(function(){
		
	});


	// initializing need help popover for header page
   $(".need_help").popover({ placement : 'left',
					html:true,
					container: 'body'
				}).on("click", function(){
						var $this = $('.popover').find("#need_help_header");
						$this.closest(".popover").addClass("custom_popover");

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









	
	
	
	
	
