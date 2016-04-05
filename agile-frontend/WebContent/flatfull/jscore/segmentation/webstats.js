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
    var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
    var end_value = $.trim(range[1]);
    end_value = end_value + " 23:59:59";
    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

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
    var start_time = getUTCMidNightEpochFromDate(lastday);
    var end_value =new Date();
    var end_time = getUTCMidNightEpochFromDate(end_value);

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

var ifFromRender=false;
function SegmentsTableView(base_model,view) {
    
    var templateKey = 'contacts-custom-view-model';
       // Creates list view for
    var itemView = new Base_List_View({
        model : base_model,
        template : templateKey,
        tagName : view.options.individual_tag_name
    });


    itemView.model.unbind('change')
    itemView.renderRow = function(el, isFromRender)
    {
    // Reads the modelData (customView object)
    var modelData = view.options.modelData;

    // Reads fields_set from modelData
    var fields = modelData['fields_set'];

    // Converts base_model (contact) in to JSON
    var contact = base_model.toJSON();
    var el = itemView.el;

        if(agile_is_mobile_browser()){

            getTemplate('contacts-custom-view-basic_info-mobile', contact, undefined, function(template_ui){
                        if(!template_ui)
                              return;
                        $(el).append($(template_ui));
                    }, null);

        }else {
                // Clears the template, because all the fields are appended, has to be reset
                // for each contact
                // $('#contacts-custom-view-model-template').empty();
                
                // Iterates through, each field name and appends the field according to
                // order of the fields
                if(isFromRender!=true)
                    $(el).html($(el).find('td').first());
                $.each(fields, function(index, field_name) {
                    if(field_name.indexOf("CUSTOM_") != -1)
                    {
                        field_name = field_name.split("CUSTOM_")[1];            
                        var property = getProperty(contact.properties, field_name);
                        var json = {};
                        if(!property)
                        {
                            json.id = contact.id;
                            getTemplate('contacts-custom-view-custom', json, undefined, function(template_ui){
                                if(!template_ui)
                                      return;
                                $(el).append($(template_ui));
                            }, null);
                            return;
                        }
                        
                            json = property;
                            json.id = contact.id;
                            getTemplate('contacts-custom-view-custom', json, undefined, function(template_ui){
                                if(!template_ui)
                                      return;
                                $(el).append($(template_ui));
                            }, null);
                            
                        
                        return;
                    }
                    
                    getTemplate('contacts-custom-view-' + field_name, contact, undefined, function(template_ui){
                        if(!template_ui)
                              return;
                        $(el).append($(template_ui));
                    }, null);
                });

        }                
    }
    itemView.render = function(el)
    {
        isFromRender=true;
        this.renderRow(el,isFromRender);
    }

    itemView.model.bind('change', itemView.renderRow, itemView);
    itemView.render();
    // Appends model to model-list template in collection template
    $(('#'+view.options.templateKey+'-model-list'), view.el).append(itemView.el);

    // Sets data to tr
    $(('#'+view.options.templateKey+'-model-list'), view.el).find('tr:last').data(
            base_model);
    
}