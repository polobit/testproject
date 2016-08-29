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
			
			$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
			$("#mail-view").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll"});

			var url = 'core/api/social-prefs/all-google-emails?from_email=rajesh.agilecrm@gmail.com&cursor=1&page_size=20';
			//var url = "core/api/categories?entity_type=TASK";
			syncContacts();
			//renderToMailList(url);

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
function syncContacts(){
	var syncedContacts = Backbone.Collection.extend({
		url:"core/api/emails/synced-accounts"
	});
	var syncedContactItem = Backbone.View.extend({
		el:'#filter-options',
		initialize:function(){
			_.bindAll(this,'render')
			var self = this;
			this.syncedContactsInstance = new syncedContacts();
			this.syncedContactsInstance.fetch({
				success: function(data,response,xhr) {
					self.render(data);
				},
				error: function (errorResponse) {
					console.log(errorResponse)
				}
			});	
		},
		render:function(data){
			var source = $('#account-types-template').html();
	        var template = Handlebars.compile(source);
	        var html = template(data.toJSON());
	        this.$el.html(html);
		}
	});
	var syncedcontactitem = new syncedContactItem();
}
function renderToMailList(url){
	var mailCollection = Backbone.Collection.extend({
				url:function () { 
					return 'core/api/social-prefs/all-google-emails?from_email=rajesh.agilecrm@gmail.com&cursor='+this.offset+'&page_size='+this.page_size
				},
				offset: 0,
    			page_size: 20,
			});
			
	var mailListItem = Backbone.View.extend({
		el:'#mails-list',
		// This will simply listen for scroll events on the current el
	    events: {
	      'scroll': 'checkScroll'
	    },
		initialize:function(){
			_.bindAll(this,'render','loadResults','checkScroll')
			//var self = this;
			this.isLoading = false;
			this.mailCollectionInstance = new mailCollection();
			this.loadResults();
		},
		loadResults: function () {
			$("#mails-list").append(LOADING_HTML);
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
					renderToMailView(data);
					$('.collapse').on('show.bs.collapse', function (e) {
					    $('.collapse').not(e.target).removeClass('in');
					});
					hideTransitionBar();
					$(".loading").hide();
					that.isLoading = false;
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
	    	this.$el.append(html);
	        $( "#mail-details-view li" ).first().addClass("in");
		},
	    checkScroll: function () {

	        var triggerPoint = 100; // 100px from the bottom
	        var scrolltop = $("#mails-list").scrollTop();
	        var scrollheight = $("#mails-list").height();
	        var totalheight = $("#mails-list").prop("scrollHeight");
	        console.log(scrolltop+"==="+scrollheight+"==="+totalheight);
	        console.log(scrolltop + scrollheight + triggerPoint+"====");
	        console.log(totalheight+" totalheight");
	    	if( !this.isLoading && scrolltop + scrollheight + triggerPoint > totalheight) {
	          this.mailCollectionInstance.offset += 20; // Load next page
	          //this.mailCollectionInstance.page_size =20;
	          this.loadResults();
	        }
	    }
	});
	var maillistitem = new mailListItem();
}

/*function renderToMailList(url){
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

			var offsetval = this.mailCollectionInstance.offset;
			var page_size_val = this.mailCollectionInstance.page_size;
			
	        $("#mail-list").scroll(function(){
		        var triggerPoint = 100; // 100px from the bottom
		        var scrolltop = $("#mail-list").scrollTop();
		        var scrollheight = $("#mail-list").height();
		        var totalheight = $("#mail-list").prop("scrollHeight");

	        	if( !this.isLoading && scrolltop + scrollheight + triggerPoint > totalheight) {
		          offsetval += 20; // Load next page
		          page_size_val += 20;
		          infiniteScroll(offsetval, page_size_val);
		        }
		    });
	        $( "#mail-details-view li" ).first().addClass("in");
		}
	});
	var maillistitem = new mailListItem();
}*/
function renderToMailView(data){
	var dataVal = data;
	var mailViewItem = Backbone.View.extend({
		el:'#mail-details-view',
		initialize:function(){
			_.bindAll(this,'render')
			this.render();
			$('.collapse').on('show.bs.collapse', function (e) {
			    $('.collapse').not(e.target).removeClass('in');
			});
			hideTransitionBar();
		},
		render:function(){
			var source = $('#mail-view-template').html();
	        var template = Handlebars.compile(source);
	        var html = template(dataVal.toJSON());
	        this.$el.append(html);
	        $( "#mail-details-view li" ).first().addClass("in");
		},

	});
	var mailviewitem = new mailViewItem();
}