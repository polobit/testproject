VISITORS_HARD_RELOAD = true;

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

            if (VISITORS_HARD_RELOAD == true) {
                this.webstatsListView = undefined;
                VISITORS_HARD_RELOAD = false;
            }
           
            var template_key = "segmentation-custom-view";

            // Default url for contacts route
            var url = 'core/api/web-stats/filter/dynamic-filter';
            if (filter_id||(filter_id=_agile_get_prefs("visitor_filter")))
            {           
            url = "core/api/web-stats/query/list/" + filter_id;
            }
            
            if (_agile_get_prefs('dynamic_visitors_filter')) {

                postData = _agile_get_prefs('dynamic_visitors_filter');
            }

            var slateKey = getSegmentPadcontentKey(url);
            if (is_lhs_filter) {
                template_key = "segmentation-custom-view-table";

            }

            var web_scope = this;
            head
                .js(
                    LIB_PATH + 'lib/date-charts.js',
                    LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _AGILE_VERSION,
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

                        web_scope.webstatsListView = new Base_Collection_View({
                            url: url,
                            restKey: "contact",
                            templateKey: template_key,
                            individual_tag_name: 'tr',
                            slateKey: slateKey,
                            cursor: true,
                            request_method: 'POST',
                            post_data: {
                                'filterJson': postData,
                                'start_time': start_time,
                                'end_time': end_time,
                                'timeZone' : timeZone

                            },
                            page_size: 20,
                            sort_collection: false,
                            postRenderCallback: function(
                                el, collection) {

                                                                                             
                               if(collection.models.length==0)
                                     $("#visitors-count").html("<small> (" + 0 + " Total) </small>");
                                else if(collection.models[collection.models.length-1].attributes.count){
                                    
                                    total_count = collection.models[collection.models.length-1].attributes.count;
                                    count_message = "<small> (" + total_count + " Total) </small>";
                                    $("#visitors-count").html(count_message);
                                }                                             
                                                             
                               if (!is_lhs_filter) {
                                    setupAnalyticsLhsFilters(el);
                                    contactFiltersListeners("lhs_filters_segmentation");

                                }

                                if(url.includes('query/list')){
                                    setupSegmentFilterList(el,url.substr(30))
                                }else
                                 setupSegmentFilterList(el);
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


