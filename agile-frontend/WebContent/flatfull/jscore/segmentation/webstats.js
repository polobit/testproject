function initWebstatsDateRange() {
    $('#activities_date_range')
        .daterangepicker({
                ranges: {
                    'Today': ['today', 'today'],
                    'Yesterday': ['yesterday', 'yesterday'],
                    'Last 7 Days': [Date.today().add({
                        days: -6
                    }), 'today'],
                    'Last 30 Days': [Date.today().add({
                        days: -29
                    }), 'today'],
                    'This Month': [
                        Date.today().moveToFirstDayOfMonth(),
                        Date.today().moveToLastDayOfMonth()
                    ],
                    'Last Month': [
                        Date.today().moveToFirstDayOfMonth().add({
                            months: -1
                        }),
                        Date.today().moveToFirstDayOfMonth().add({
                            days: -1
                        })
                    ]               
                    
                    
                },
                locale: {
                    applyLabel: 'Apply',
                    cancelLabel: 'Cancel',
                    fromLabel: 'From',
                    toLabel: 'To',
                    customRangeLabel: 'Custom',
                    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr',
                        'Sa'
                    ],
                    monthNames: ['January', 'February', 'March',
                        'April', 'May', 'June', 'July', 'August',
                        'September', 'October', 'November',
                        'December'
                    ],
                    firstDay: parseInt(CALENDAR_WEEK_START_DAY)
                }
            },
            function(start, end) {
                if (start && end) {
                    $('#activities_date_range #range').html(
                        start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
                    VISITORS_HARD_RELOAD = true;
                    App_VisitorsSegmentation.visitorssegmentation(
                        getTimeWebstats(), true);
                } else {
                    var from_date = Date.parse('today');
                    var to_date = Date.today().add({
                        days: parseInt(-6)
                    });
                    $('#activities_date_range #range').html(
                        to_date.toString('MMMM d, yyyy') + " - " + from_date
                        .toString('MMMM d, yyyy'));
                    VISITORS_HARD_RELOAD = true;
                    App_VisitorsSegmentation.visitorssegmentation(
                        getTimeWebstats(), true);

                    $('.daterangepicker > .ranges > ul > li.active')
                        .removeClass("active");
                }
            });
    $('.daterangepicker > .ranges > ul').on("click", "li", function(e) {
        $('.daterangepicker > .ranges > ul > li').each(function() {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
    });
}

function getTimeWebstats() {

    var time_range = new Array();

    var range = $('#range').html().split("-");
    var start_time = new Date(range[0]).getTime();
    var end_value = $.trim(range[1]);
    end_value = end_value + " 23:59:59";
    var end_time = new Date(end_value).getTime();

    time_range[0] = start_time;
    time_range[1] = end_time;

    if (_agile_get_prefs('duration') != null)
        _agile_delete_prefs('duration');

    _agile_set_prefs('duration', 'start_time :' + start_time + ',end_time :' + end_time);

    return time_range;

}

function getFirstTimeWebstats() {

    var time_range = new Array();

    lastday=Date.today();
    lastday.setDate(new Date().getDate()-6);
    var start_time = lastday.getTime();
    var end_value =new Date();
    var end_time = end_value.getTime();

    time_range[0] = start_time;
    time_range[1] = end_time;

    return time_range;
}

function deserializeRhsFilters(data) {

    var range = data.split(",");

    var start = new Date(Number(range[0].substr(range[0].indexOf(":") + 1)));
    var end = new Date(Number(range[1].substr(range[1].indexOf(":") + 1)));

    $('#activities_date_range #range').html(
        start.toString('MMMM d, yyyy') + " - " + end.toString('MMMM d, yyyy'));
    
}
function  togglePopUpFields(modal){

    $('#'+ modal).off("click", ".new-segment");
    $('#'+ modal).on('click', '.new-segment', function(e)
        {
            e.preventDefault();
            $("div.update-segment-name").toggle();
            $("div.choose-segment-filter").toggle();
            $('#save-new-type').prop('checked', true);
        }); 
    $('#'+ modal).off("click", ".replace-segment");
     $('#'+ modal).on('click', '.replace-segment', function(e)
        {   
            e.preventDefault();
            $("div.update-segment-name").toggle();
            $("div.choose-segment-filter").toggle();
            $('#save-replace-type').prop('checked', true);
        });     
   
}
function  changeFilterName(modal){

    
    $('#'+ modal).on('change', '#saveSegmentFilterForm .choose-segment-filter select', function(e)
    {
        e.preventDefault();
        var selectedFilterName = $('[name="filter-collection"] option:selected').text()

        $('input[name="name"]', $('form#saveSegmentFilterForm')).val(selectedFilterName);
    });
}

function  addEventFilter(filter_id){
    $('#' + filter_id).off('click', '.visitor-filter' );
    $('#' + filter_id).on('click', '.visitor-filter' ,function(e)
    {

        e.preventDefault();
        var targetEl = $(e.currentTarget);

        _agile_delete_prefs('dynamic_visitors_filter');

        var filter_id = $(targetEl).attr('id');
        
        // Saves Filter in cookie
        _agile_set_prefs('visitor_filter', filter_id);

        VISITORS_HARD_RELOAD=true;
        App_VisitorsSegmentation.visitorssegmentation();
        return;
       
    });    
 
}
var segmentFilterList
function setupSegmentFilterList(cel,id)
{
    var filter_name;
        segmentFilterList = new Base_Collection_View(
            {
                url : '/core/api/web-stats/filters',
                sort_collection : false,
                restKey : "SegmentFilter",
                templateKey : "segment-filter-list",
                individual_tag_name : 'li',
                no_transition_bar : true,
                postRenderCallback : function(el, collection)
                {
                    for(var i=0;i<collection.models.length;i++){
                    filter_name=collection.models[i].attributes.name;
                     el.find('.filter-dropdown').append(Handlebars.compile('{{name}}')({name : filter_name}));
                    }   

                    addEventFilter("filters-tour-step"); 
                    if(id){
                        var filter_name=collection.get(id).attributes.name;

                        if($("#filters-tour-step").find("#segment-filter").text()!=filter_name){                        
                            deserializeLhsFilters($('#lhs-contact-filter-form'), collection.get(id).attributes.segmentConditions);      
                            var addFilterName='<span class="segment-filter-name">'+filter_name +'</span>';
                            $('#filters-tour-step').find('#segment-filter').append(addFilterName);
                        }
                    } 
                    else
                       $('#filters-tour-step').find('#segment-filter').find('.segment-filter-name').remove();
                } });

            // Fetchs filters
            segmentFilterList.collection.fetch();
        
            // Shows in contacts list
            $('#filter-list', cel).html(segmentFilterList.render().el);

}                
   