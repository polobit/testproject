function initWebstatsDateRange() {
    $('#reportrange')
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
                    $('#reportrange #range').html(
                        start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
                    VISITORS_HARD_RELOAD = true;
                    App_VisitorsSegmentation.visitorssegmentation(
                        getTimeWebstats(), true);
                } else {
                    var from_date = Date.parse('today');
                    var to_date = Date.today().add({
                        days: parseInt(-6)
                    });
                    $('#reportrange #range').html(
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

function getTodayTimeWebstats() {

    var time_range = new Array();

    var start_time = getUTCMidNightEpochFromDate(Date.today());
    var end_value = new Date().setHours(23, 59, 59);;
    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

    time_range[0] = start_time;
    time_range[1] = end_time;

    return time_range;
}

function deserializeRhsFilters(element, data) {

    var range = data.split(",");

    var start = new Date(Number(range[0].substr(range[0].indexOf(":") + 1)));
    var end = new Date(Number(range[1].substr(range[1].indexOf(":") + 1)));

    $('#reportrange #range').html(
        start.toString('MMMM d, yyyy') + " - " + end.toString('MMMM d, yyyy'));
}