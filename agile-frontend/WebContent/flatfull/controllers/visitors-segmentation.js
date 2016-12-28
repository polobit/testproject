VISITORS_HARD_RELOAD = true;

var visitorsCollectionView = Base_Collection_View.extend({
    events: {
        "click .load_more": "loadMoreVisitors"
    },
    loadMoreVisitors: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.options.post_data.req_count = 0;
        visitorsUtils.fetchVisitors(this);
    }
});

var VisitorsSegmentationRouter = Backbone.Router
    .extend({

        routes: {

            /* Webstats */
            "visitors": "visitorssegmentation"         
        },

        visitorssegmentation: function(time_range, is_lhs_filter,view_data,filter_id)
             {

            var postData;
            var start_time;
            var end_time;
            var timeZone;
            var scanned_upto = null;
            var req_count = 0;
            var has_fetch = true;

            if (VISITORS_HARD_RELOAD == true) {
                this.webstatsListView = undefined;
                VISITORS_HARD_RELOAD = false;                
            }
            _agile_delete_prefs("visitor_repeat_filter");
            _agile_delete_prefs("duration");
	        
			if(_agile_get_prefs("visitor_filter"))
            {
              _agile_delete_prefs("visitor_filter");
            }
           
            var template_key = "segmentation-custom-view";
            
            if(!$('#lhs_filters_segmentation #error-message').hasClass("hide")){$('#lhs_filters_segmentation #error-message').addClass("hide");}

            // Default url for visitors route
            var url = 'core/api/web-stats/visitors/filter/dynamic-filter';
            
            if (_agile_get_prefs('dynamic_visitors_filter')) {

                postData = _agile_get_prefs('dynamic_visitors_filter');
            }
            
            if(!visitorsUtils.hasProperFilter(postData))
            {           
              postData = undefined;
              _agile_delete_prefs('dynamic_visitors_filter');
              if(is_lhs_filter)
                return;
              else
               	clearLhsFilters();
            }

            var slateKey = getSegmentPadcontentKey(url);
            if (is_lhs_filter) {
                template_key = "segmentation-custom-view-table";
            }

            var web_scope = this;
            head
                .js(
                    LIB_PATH + 'lib/date-charts-en.js',
                    LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _agile_get_file_hash('date-range-picker.js'),
                    function() {

                        // first time entry

                        if (!time_range && _agile_get_prefs('duration')) {

                            var range = _agile_get_prefs('duration')
                                .split(",");
                            start_time = Number(range[0]
                                .substr(range[0].indexOf(":") + 1));
                            end_time = Number(range[1]
                                .substr(range[1].indexOf(":") + 1));

                        } else {

                            if (!time_range)
                                time_range = getFirstTimeWebstats();

                            start_time = time_range[0];
                            end_time = time_range[1];
                        }

                        timeZone=new Date().getTimezoneOffset();
                        
                        visitorsUtils.updateVisitorsCount(0);

                        web_scope.webstatsListView = new visitorsCollectionView({
                            url: url,
                            restKey: "contact",
                            templateKey: template_key,
                            individual_tag_name: 'tr',
                            slateKey: slateKey,
                            request_method: 'POST',
                            post_data: {
                             'filter_json': postData,
                             'start_time': start_time,
                             'end_time': end_time,
                             'time_zone': timeZone,
                             'scanned_upto': scanned_upto,
                             'req_count': req_count
                            },
                            //cursor : true,
                            page_size: getMaximumPageSize(),
                            sort_collection: false,
                            escape_infini : true,
                            postRenderCallback: function(
                                el, collection) {
                                                                                                                                                                              
                                visitorsUtils.hideNotification($(web_scope.webstatsListView.el));
                              
                                if (collection.length <= 0) {
                                   $("#visitors-count").html("<small> (" + 0 + " Total) </small>");
                                   visitorsUtils.showSlateConetent(el);
                                   fill_slate("slate", this.el, slateKey);
                                }
                                else
                                {
                                  var model = collection.at(collection.length-1).toJSON();
                                  visitorsUtils.doPostFetchOperations(web_scope.webstatsListView);                               
                                }
                                                           
                                if (!is_lhs_filter) {
                                   setupAnalyticsLhsFilters(el);
                                   contactFiltersListeners("lhs_filters_segmentation");
                                   addTagsTypeaheadLhs($('#tags-lhs-filter-table', el).find("div.lhs-contact-filter-row").find('#RHS'));                                                                     
                               }
                            }
                         });
                        
                       // Fetch collection
                        web_scope.webstatsListView.collection
                            .fetch();

                        if (!is_lhs_filter) {
                            $('#content').html(
                                web_scope.webstatsListView.el);

                        } else {
                            $('#content')
                              .find('.visitors-div')
                                .html(
                                    web_scope.webstatsListView.el);
                            VISITORS_HARD_RELOAD = true;
                        }

                        $(".active").removeClass("active");
                        $("#segmentationmenu").addClass("active");
                    });
        }
    });

var visitorsUtils = {
			
		fetchVisitors : function(collectionView)
		{
			var viewElement = $(collectionView.el);
		    var message_id = viewElement.find('#message-id');
		    message_id.find("#load_more").css("display","none");
		    message_id.find("#load_more_loading").css("display","inline");
		    var formData = collectionView.options.post_data;
			//post request
			 $.ajax({
				 data: formData,
				 dataType: 'json',
				 type: "POST",				 
				 contentType: "application/x-www-form-urlencoded",
				 url: "core/api/web-stats/visitors/filter/dynamic-filter",
				 success: function(visitors) {
					 if(typeof visitors!= undefined && visitors)
					 {
					 	 collectionView.collection.add(visitors);
					 	 if(collectionView.collection.length > 0)
					 	 	visitorsUtils.doPostFetchOperations(collectionView);
					 }
					 else
					 {
						 var el = $(web_scope.webstatsListView.el);
						 visitorsUtils.hideNotification(el);
						 //show the message
						 if(collectionView.collection.length <=0)
						 {  
						 	fill_slate("slate", viewElement, collectionView.options.slateKey);    	
                            visitorsUtils.showSlateConetent(el);
                         }
                         else
                         {
                         	visitorsUtils.showCollectionView(collectionView);
                         }
					 }
				 }
		     });
		},

		hasProperFilter : function(postData)
		{
			var hasProperFilter = false;
			if(typeof postData!=undefined && postData)
			{
				var rules = JSON.parse(postData).rules;
				for(var i=0;i<rules.length;i++)
				{
					var rule = rules[i];
					var lhs = rule.LHS;
					if(lhs.toLowerCase() != 'tags')
						return true;
					if(i == rules.length-1)
					{
						if($('#lhs_filters_segmentation #error-message').hasClass("hide")){$('#lhs_filters_segmentation #error-message').removeClass("hide");}
						hasProperFilter = false;
					}
				}
			}		
			return hasProperFilter;
		},
		
		doPostFetchOperations : function(collectionView)
		{
			visitorsUtils.onFetchVisitorsSuccess(collectionView);
		    var collection = collectionView.collection;
		    var model = collection.at(collection.length-1).toJSON();
		    var el = $(collectionView.el);
		    
		    if(typeof model.has_results != "undefined" && model.has_results)
		    {
		      visitorsUtils.completeRequestCycle(collectionView);
		      if(typeof model.has_emails != "undefined" &&  !(model.has_emails))
		    	  visitorsUtils.hideNotification(el);
		      visitorsUtils.removeInfoModel(collectionView);
		      visitorsUtils.showCollectionView(collectionView);
		    }
		    else if(typeof model.has_emails !="undefined" && !model.has_emails)
		    {
		       visitorsUtils.removeInfoModel(collectionView);
		       visitorsUtils.hideNotification(el);
		       if(collectionView.collection.length <=0)
			   {      	
                visitorsUtils.showSlateConetent(el);
                fill_slate("slate", el, collectionView.options.slateKey);
               }
               else
               	visitorsUtils.showCollectionView(collectionView);
		    }
		    else
		    {
		      var post_data = collectionView.options.post_data;
		        if (post_data.req_count < 10)
		        {
		          visitorsUtils.showNotification(el);
		          visitorsUtils.removeInfoModel(collectionView);
		          visitorsUtils.fetchVisitors(collectionView);
		        }
		        else if(post_data.req_count >= 10)
		        {
		        	visitorsUtils.completeRequestCycle(collectionView);
		        	visitorsUtils.removeInfoModel(collectionView);
		        }
		    }
		    visitorsUtils.updateVisitorsCount(collection.length);
		},

		onFetchVisitorsSuccess : function(collectionView)
		{
		    var collection = collectionView.collection;
		    var model = collection.at(collection.length - 1).toJSON();
		    var post_data = collectionView.options.post_data;
		    var request_count = parseInt(post_data.req_count);
		    var request_count = request_count + 1;
		    post_data.req_count = request_count;
		    post_data.scanned_upto = model.scannedUpto;
		    var viewElement = $(collectionView.el);
		    var message_id = viewElement.find('#message-id');
		    message_id.find("#scanned_upto").html("");
		  	    
		    var delay=200;
		    setTimeout(function() {
		    	//code to be executed after 200 milli seconds
		    	if(typeof model.scannedUpto != undefined && model.scannedUpto)
		    		message_id.find("#scanned_upto").html("Scanned upto "+ model.scannedUpto);
		    	//message_id.append("<span id=\"scanned_upto\" style=\"margin-left:35%;\"> Loading... Scanned upto " + model.scannedUpto);
		    },delay);
		},

		completeRequestCycle : function(collectionView)
		{
		    var viewElement = $(collectionView.el);
		    var message_id = viewElement.find('#message-id');
		    if(collectionView.collection.length > 0)
		    {
		        var model = collectionView.collection.at(collectionView.collection.length-1).toJSON();
		        message_id.find("#scanned_upto").html("Scanned upto " + model.scannedUpto);
		    }
		    message_id.find("#load_more").css("display","inline");
		    message_id.find("#load_more_loading").css("display","none");
		    var message_id = viewElement.find('#message-id');
		    message_id.css("display","block");
		},

		removeInfoModel : function(collectionView)
		{
			var collection = collectionView.collection;
		    var model = collection.at(collection.length-1).toJSON();
		    if(typeof model.is_info_model != "undefined" && model.is_info_model)
		    {
		        collection.remove(collection.at(collection.length-1));
		    }
		},

		hideNotification : function(viewElement)
		{
		  var message_id = viewElement.find("#message-id");
		  message_id.css("display","none");
		},

		showNotification : function(viewElement)
		{
		  var message_id = viewElement.find("#message-id");
		  message_id.find("#load_more").css("display","none");
		  message_id.find("#load_more_loading").css("display","inline");
		  message_id.css("display","block");
		},

		loadContactFilters : function(id,el,callback)
		{
		    if(callback == undefined)
		       callback = 'no-callback';

		    var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
		    fillSelect(id, '/core/api/filters?type=PERSON', undefined, callback,optionsTemplate, undefined, el);
		},

		loadContactFilter : function(filter_id,viewElement)
		{
		  var contact_filter = viewElement.find("#contact_filter_selector");
		  contact_filter.val(filter_id);
		},

	    disableInfiniScroll : function()
		{
		  var current_route = window.location.hash.split("#")[1];
		  // Disables all infini scrolls in the map
		  $.each(INFINI_SCROLL_JSON, function(key, value) {
		    if(key === 'visitors')
		      value.disableFetch();
		  });
		},

		showCollectionView : function(collectionView)
		{
		  var viewElement = $(collectionView.el);
		  var visitorsTable = viewElement.find("#visitors-table");
		  visitorsTable.css("display","table");
		},

		showSlateConetent : function(viewElement)
		{
		  var slate = viewElement.find("#slate");
		  slate.css("display","block");
		},

		updateVisitorsCount : function(count)
		{
		   //$("#visitors-count").attr("data-t",count);
		   $("#visitors-count").html("<small> (" + count + " Total) </small>");
		}
	}