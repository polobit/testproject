VISITORS_HARD_RELOAD = true;

var VisitorsSegmentationRouter = Backbone.Router
    .extend({

        routes: {

            /* Webstats */
            "segments": "visitorssegmentation"

        },

        visitorssegmentation: function(time_range, is_lhs_filter,view_data)
             {

            var postData;
            var start_time;
            var end_time;
            var timeZone;

            if (VISITORS_HARD_RELOAD == true) {
                this.webstatsListView = undefined;
                VISITORS_HARD_RELOAD = false;
                view_data = undefined;

            }

            // If id is definesd get the respective custom view object
            if (!view_data) {
                // Once view id fetched we use it without fetching it.
                if (!App_VisitorsSegmentation.webstatsViewModel) {
                    var view = new Backbone.Model();
                    view.url = 'core/api/contact-view-prefs';
                    view
                        .fetch({
                            success: function(data) {

                                if ($.isEmptyObject(data.toJSON())) {
                                    console.log("no data found");
                                    return;
                                }
                                App_VisitorsSegmentation.webstatsViewModel = data
                                    .toJSON();
                                App_VisitorsSegmentation
                                    .visitorssegmentation(
                                        undefined,
                                        is_lhs_filter,
                                        App_VisitorsSegmentation.webstatsViewModel);

                            }
                        });
                    return;
                }
                if(App_Contacts.contactViewModel)
                    App_VisitorsSegmentation.webstatsViewModel.fields_set=App_Contacts.contactViewModel.fields_set;
                view_data = App_VisitorsSegmentation.webstatsViewModel;

            }

            var template_key = "segmentation-custom-view";

            // Default url for contacts route
            var url = 'core/api/web-stats/filter/dynamic-filter';

            if (this.webstatsListView && this.webstatsListView.collection.url == url) {

                var el = App_VisitorsSegmentation.webstatsListView
                    .render(true).el;

                $('#content').html(el);
                initWebstatsDateRange();
                contactFiltersListeners("lhs_filters_segmentation");
                addClickEventSEgments($('#content').find("#visitors-table"));

                $(".active").removeClass("active");
                $("#segmentationmenu").addClass("active");
                return;
            }
            if (_agile_get_prefs('dynamic_visitors_filter')) {

                postData = _agile_get_prefs('dynamic_visitors_filter');
            }

            var slateKey = getCompanyPadcontentKey(url);
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
                            modelData: view_data,
                            individual_tag_name: 'tr',
                            slateKey: slateKey,
                            cursor: true,
                            scroll_symbol: 'scroll',
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

                                abortCountQueryCall();
                                addClickEventSEgments($('#content').find("#visitors-table"));
                                
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

                            }
                        });

                        // Defines appendItem for custom view
                        web_scope.webstatsListView.appendItem = function(
                            base_model) {
                            SegmentsTableView(base_model,web_scope.webstatsListView);
                        };

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


function addClickEventSEgments(element){
    $(element).on('click', '.agile-edit-row > tr > td:not(".checkbox")',
            function(e) {
        e.preventDefault();
        //alert("click events");
        var route = $(this).parents('.agile-edit-row').attr('route');
        
        // Newly added code for displaying contacts and companies in same table with different routes.
        if($(this).closest('tr').find('[route]').length != 0)
            route = $(this).closest('tr').find('[route]').attr('route');
        
        var data = $(this).closest('tr').find('.data').attr('data');

        if(route == "contact/")
            SCROLL_POSITION = window.pageYOffset;               

                console.log(data);

                if (data) {
                    Backbone.history.navigate(route + data, {
                        trigger : true
                    });
                }
            });
}

