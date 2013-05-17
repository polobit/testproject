(function($) {

	addScrollTopAnimation(); // start

	function addScrollTopAnimation() {

		var $scrolltop_link = $('#scroll-top');

		$scrolltop_link.on('click', function(ev) {

			ev.preventDefault();

			$('html, body').animate({

				scrollTop : 0

			}, 700);

		})

		// Hides the link initially
		.data('hidden', 1).hide();

		var scroll_event_fired = false;

		$(window).on('scroll', function() {

			scroll_event_fired = true;

		});

		/*
		 * Checks every 300 ms if a scroll event has been fired.
		 */
		setInterval(function() {

			if (scroll_event_fired) {

				/*
				 * Stop code below from being executed until the next scroll
				 * event.
				 */
				scroll_event_fired = false;

				var is_hidden = $scrolltop_link.data('hidden');

				/*
				 * Display the scroll top link when the page is scrolled down
				 * the height of half a viewport from top, Hide it otherwise.
				 */
				if ($(this).scrollTop() > $(this).height() / 2) {

					if (is_hidden) {

						$scrolltop_link.fadeIn(600).data('hidden', 0);

					}
				}

				else {

					if (!is_hidden) {

						$scrolltop_link.slideUp().data('hidden', 1);

					}
				}

			}

		}, 300);

	}
	
	/* For toggling help modal popup */
	$('#help-page').die().live('click', function(e){
		
		var helpModal = $(getTemplate("show-help"),{});
		helpModal.modal('show');
	
	    $('.hide-modal', helpModal).click(function(){
	    		helpModal.modal('hide');
	    });
	});
	
	/* For opening the footer icons in seperate popup window */
	$('.email-share').die().live('click', function(e){
		e.preventDefault();
		var x = 500;
		var title = $(this).closest("a").attr('data');
		if(title == "Linkedin") x=700;
		var url = $(this).closest("a").attr('href');
		window.open(url, title, "width=" + x + ",height=500,left=200%,top=100%");
	});
	
	/* For sharing agile to friends */
	$('#share-email').die().live('click', function(e){
		e.preventDefault();
		
        if ($('#share-by-email').size() != 0)
        {
        	$('#share-by-email').remove();
        }
		var CurrentuserModel = Backbone.Model.extend({
		     //url: '/core/api/imap',
		     url: '/core/api/current-user',
		     restKey: "domainUser"
		});
		 
		var currentuserModel = new CurrentuserModel();
		
		currentuserModel.fetch({success: function(data){
			
				var model = data.toJSON();
				//$("#sharemailForm").find( 'input[name="from"]' ).val(model.email);
		
				var emailModal = $(getTemplate("share-by-email", model));
				emailModal.modal('show');
		
				$('#shareMail').die().live('click',function(e){
					e.preventDefault();
					
					if(!isValidForm($('#sharemailForm')))
				      {	
				      	return;
				      }
					
					var json = serializeForm("sharemailForm");
		
					var url =  'core/api/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
					 encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
						 encodeURIComponent(json.body);
					
					// Shows message 
				    $save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block"> <i>Sending mail...</i></p></span>');
				    $("#msg", this.el).append($save_info);
					$save_info.show().delay(2000).fadeOut("slow");
					
					// Navigates to previous page on sending email
					$.post(url, function(){
						emailModal.modal('hide');
					});
		
				});
		
		 }});
		
	});
	
})(jQuery);