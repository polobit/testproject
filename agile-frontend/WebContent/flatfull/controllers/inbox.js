var inboxMailListView;
var InboxRouter = Backbone.Router.extend({

	routes : {
		/* inbox*/
		"inbox" : "inbox",
		"sent" : "sent"
	},

	inbox: function(){

		$('#content').html("<div id='inbox-listners'>&nbsp;</div>");
		showTransitionBar();
		getTemplate("inbox", {}, undefined, function(template_ui) {
			if( !template_ui )	return;

			$('#inbox-listners').html($(template_ui));
			$("#mail-inbox").css({"font-weight":"bold"});
			$("#mail-sent").css({"font-weight":"normal"});
			
			var url = 'core/api/social-prefs/all-google-emails?from_email=rajesh.agilecrm@gmail.com&cursor=1&page_size=20';
			//var url = "core/api/categories?entity_type=TASK";
			renderToMailList(url);

		}, '#inbox-listners');
		
		$(".active").removeClass("active");
		$("#inboxmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();
	},
	sent: function(){

		$('#content').html("<div id='inbox-listners'>&nbsp;</div>");
		showTransitionBar();
		getTemplate("inbox", {}, undefined, function(template_ui) {
			if( !template_ui )	return;

			$('#inbox-listners').html($(template_ui));
			$("#mail-inbox").css({"font-weight":"normal"});
			$("#mail-sent").css({"font-weight":"bold"});
			
			//var url = 'core/api/social-prefs/google-emails?from_email=rajesh.agilecrm@gmail.com&cursor=0&page_size=20&search_email=rajesh07590@gmail.com';
			var url = "core/api/categories?entity_type=TASK";
			renderToMailList(url);
			
		}, '#inbox-listners');
		
		$(".active").removeClass("active");
		$("#inboxmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();
	}
});

function renderToMailList(url){
	var mailCollection = Backbone.Collection.extend({
				url: function () {
					return 'core/api/social-prefs/all-google-emails?from_email=rajesh.agilecrm@gmail.com&cursor='+this.offset+'&page_size='+this.page_size
				},
				offset: 1,
    			page_size: 20,
			});
	var mailListItem = Backbone.View.extend({
		el:'#myGroup',
		initialize:function(){
			_.bindAll(this,'render')
			//var self = this;
			this.isLoading = false;
			this.mailCollectionInstance = new mailCollection();
			this.loadResults();
		},
		loadResults: function () {
	      var that = this;
	      // we are starting a new load of results so set isLoading to true
	      this.isLoading = true;
	      // fetch is Backbone.js native function for calling and parsing the collection url
	      this.mailCollectionInstance.fetch({
				success: function(data,response,xhr) {
					that.render(data);
					
					$(document).on('click','.mail-text',function(e) {
						$('.mail-text').not(e.target).css({"background-color":"inherit"});
					    $(this).css({"background-color":"#e7ecee"});
					});
					$( "#mails-list li" ).first().css({"background-color":"#e7ecee"});

					$('.collapse').on('show.bs.collapse', function (e) {
					    $('.collapse').not(e.target).removeClass('in');
					});
					hideTransitionBar();
					
					this.isLoading = false;
				},
				error: function (errorResponse) {
					console.log(errorResponse)
				}
			});	     
	    },
		render:function(data){
			var source = $('#mail-template').html();
	        var template = Handlebars.compile(source);
	        var html = template(data.toJSON());
	        this.$el.html(html);
	        $("#mail-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll"});
			$("#mail-view").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll"});

	        $("#mail-list").scroll(function(){
		        var triggerPoint = 100; // 100px from the bottom
		        var scrolltop = $("#mail-list").scrollTop();
		        var scrollheight = $("#mail-list").height();
		        var totalheight = $("#mail-list").prop("scrollHeight");
		
	        	if( !this.isLoading && scrolltop + scrollheight + triggerPoint > totalheight) {
	        		alert("loadinng");
		          this.mailCollectionInstance.offset += 20; // Load next page
		          this.mailCollectionInstance.page_size += 20
		          this.loadResults();
		        }
		    });
	        $( "#mail-details-view li" ).first().addClass("in");
		}
	});
	var maillistitem = new mailListItem();
}

