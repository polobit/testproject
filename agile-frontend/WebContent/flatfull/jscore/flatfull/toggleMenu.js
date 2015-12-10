

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









	
	
	
	
	
