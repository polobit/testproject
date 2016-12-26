VISITORS_HARD_RELOAD = true;

var visitorsCollectionView = Base_Collection_View.extend({
    events: {
        "click .load_more": "loadMoreVisitors"
    },
    loadMoreVisitors: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.post_data.req_count = 0;
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
            var cursorStr = true;
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

            // Default url for contacts route
            var url = 'core/api/web-stats/filter/dynamic-filter';
//            if (filter_id||(filter_id=_agile_get_prefs("visitor_filter")))
//            {           
//            url = "core/api/web-stats/query/list/" + filter_id;
//            }
            
            if (_agile_get_prefs('dynamic_visitors_filter')) {

                postData = _agile_get_prefs('dynamic_visitors_filter');
            }
            
            if(visitorsUtils.hasContactFilter(postData))
            {
              cursorStr = false;
              has_fetch = false;            
              if(!visitorsUtils.hasProperContactFilter(postData))
              {
                  postData = undefined;
                    _agile_delete_prefs('dynamic_visitors_filter');
                    if(is_lhs_filter)
                      return;
                    else
                      clearLhsFilters();
              }
              else
              {
            	  visitorsUtils.disableInfiniScroll();
              }
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
                            cursor: true,
                            request_method: 'POST',
                            post_data: {
                             'filter_json': postData,
                             'start_time': start_time,
                             'end_time': end_time,
                             'time_zone': timeZone,
                             'scanned_upto': scanned_upto,
                             'req_count': req_count
                            },
                            page_size: getMaximumPageSize(),
                            sort_collection: false,
                            postRenderCallback: function(
                                el, collection) {
                                                                                           
                              if(!has_fetch)
                            	  visitorsUtils.disableInfiniScroll();                                                              
                              
                              visitorsUtils.hideNotification($(web_scope.webstatsListView.el));
                              
                                if (collection.length <= 0) {
                                   $("#visitors-count").html("<small> (" + 0 + " Total) </small>");
                                   visitorsUtils.showSlateConetent(el);
                                   fill_slate("slate", this.el, slateKey);
                                }
                                else
                                {
                                  var model = collection.at(collection.length-1).toJSON();
                                  if(typeof model.is_web_filter != "undefined" && (model.is_web_filter))
                                  {
                                      $("#visitors-count").html("<small> (" + model.count + " Total) </small>");
                                      visitorsUtils.removeInfoModel(web_scope.webstatsListView);
                                      visitorsUtils.showCollectionView(web_scope.webstatsListView);
                                  }
                                  else
                                  {
                                      //customer applied web and contact filters
                                	  visitorsUtils.doPostFetchOperations(web_scope.webstatsListView);
                                  }
                                }
                                                           
                                if (!is_lhs_filter) {
                                   setupAnalyticsLhsFilters(el);
                                   contactFiltersListeners("lhs_filters_segmentation");
                                   addTagsTypeaheadLhs($('#tags-lhs-filter-table', el).find("div.lhs-contact-filter-row").find('#RHS'));
                                   //loadContactFilters('contact_filter_selector',el);                                   
                               }

                               // if(url.includes('query/list')){
                               //     setupSegmentFilterList(el,url.substr(30))
                               // }else
                               //  setupSegmentFilterList(el);
                            },
                            infini_scroll_cbk: function() {
                                var collection = web_scope.webstatsListView.collection;
                                if (collection.length > 0) {
                                     var model = collection.at(collection.length-1).toJSON();
                                     if(typeof model.is_web_filter != "undefined" && (model.is_web_filter))
                                     {     
                                      $("#visitors-count").html("<small> (" + model.count + " Total) </small>");
                                      visitorsUtils.removeInfoModel(web_scope.webstatsListView);
                                     }
                                     else
                                     {
                                      visitorsUtils.doPostFetchOperations(web_scope.webstatsListView);
                                      web_scope.webstatsListView.infiniScroll.disableFetch();
                                     }
                                }
                                else
                                {
                                  //show the message
                                  var el = $(web_scope.webstatsListView.el);
                                  visitorsUtils.hideNotification(el);
                                  visitorsUtils.showSlateConetent(el);
                                  fill_slate("slate", el, slateKey);
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
		
		hasContactFilter : 	function(postData)
		{
			var hasContactFilter = false;
			if(postData)
			{
			    var rules = JSON.parse(postData).rules; 
			    for(var i=0;i<rules.length;i++)
			    {
			      if(rules[i].LHS === 'tags')
			      {
			        hasContactFilter = true;
			      }
			    }
			 } 
			 return hasContactFilter;
		},

		hasProperContactFilter : function(postData)
		{
			var hasProperContactFilter = false;
			if(postData)
			{
				var rules = JSON.parse(postData).rules;
				//disabling existing infiniscrolls in this visitors route
				//    var visitors_scroll = INFINI_SCROLL_JSON.visitors;
				//    if(visitors_scroll)
				//      INFINI_SCROLL_JSON.visitors = undefined;
				if(rules.length > 1)
				{
					hasProperContactFilter = true;
				}
				else
				{
					if($('#lhs_filters_segmentation #error-message').hasClass("hide")){$('#lhs_filters_segmentation #error-message').removeClass("hide");}
					hasProperContactFilter = false;
				}
			}		
			return hasProperContactFilter;
		},
		
		doPostFetchOperations : function(collectionView)
		{
			visitorsUtils.onFetchVisitorsSuccess(collectionView);
		    var collection = collectionView.collection;
		    var model = collection.at(collection.length-1).toJSON();
		    
		    if(typeof model.is_old_model != "undefined" && model.is_old_model)
		    {
		    	//completeRequestCycle(collectionView);
		    	visitorsUtils.hideNotification($(collectionView.el));
		    }
		    else if(typeof model.has_results != "undefined" && model.has_results)
		    {
		      visitorsUtils.completeRequestCycle(collectionView);
		      if(typeof model.has_emails != "undefined" &&  !(model.has_emails))
		    	  visitorsUtils.hideNotification($(collectionView.el));
		      visitorsUtils.removeInfoModel(collectionView);
		      visitorsUtils.showCollectionView(collectionView);
		    }
		    else
		    {
		      var post_data = collectionView.post_data;
		        if (post_data.req_count < 10)
		        {
		          visitorsUtils.showNotification($(collectionView.el));
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
		
		fetchVisitors : function(collectionView)
		{
		    var infiniScroll = collectionView.infiniScroll;
		    infiniScroll.enableFetch();
		    infiniScroll.fetchAgain();
		    var viewElement = $(collectionView.el);
		    var message_id = viewElement.find('#message-id');
		    message_id.find("#load_more").css("display","none");
		},

		onFetchVisitorsSuccess : function(collectionView)
		{
		    var collection = collectionView.collection;
		    var model = collection.at(collection.length - 1).toJSON();
		    var post_data = collectionView.post_data;
		    var request_count = parseInt(post_data.req_count);
		    var request_count = request_count + 1;
		    post_data.req_count = request_count;
		    post_data.scanned_upto = model.scannedUpto;
		    var viewElement = $(collectionView.el);
		    var message_id = viewElement.find('#message-id');
		    message_id.find("#scanned_upto").html("");
		  	    
		    var delay=150;
		    setTimeout(function() {
		    	//your code to be executed after 1 second
		    	message_id.find("#scanned_upto").html("Scanned upto "+ model.scannedUpto);
		    	//message_id.append("<span id=\"scanned_upto\" style=\"margin-left:35%;\"> Loading... Scanned upto " + model.scannedUpto);
		    },delay);
		    
		    //message_id.find("#load_more").css("display","none");
		    //var count = parseInt($("#visitors-count").attr("data-t"));
		    //count = count + parseInt(model.count);
		    //updateVisitorsCount(count);
		    //count = collection.length - 1;
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
	};