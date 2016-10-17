
		
/** Initialising date range for various report* */
function initDateRangeforWebrule(callback) {
    initReportLibs(function() {

        $('.daterangepicker').remove();
        // Bootstrap date range picker.
        $('#reportrange').daterangepicker({
            ranges: {
                '{{agile_lng_translate "calendar" "Today"}}': [
                    'today', 'today'
                ],
                '{{agile_lng_translate "calendar" "Yesterday"}}': [
                    'yesterday', 'yesterday'
                ],
                '{{agile_lng_translate "portlets" "last-7-days"}}': [
                    Date.today().add({
                        days: -6
                    }), 'today'
                ],
                '{{agile_lng_translate "portlets" "last-30-days"}}': [
                    Date.today().add({
                        days: -29
                    }), 'today'
                ],
                '{{agile_lng_translate "portlets" "this-month"}}': [
                    Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()
                ],
                '{{agile_lng_translate "portlets" "last-month"}}': [
                    Date.today().moveToFirstDayOfMonth().add({
                        months: -1
                    }), Date.today().moveToFirstDayOfMonth().add({
                        days: -1
                    })
                ],
             },
            locale: {
                applyLabel: '{{agile_lng_translate "calendar" "Apply"}}',
	            clearLabel: '{{agile_lng_translate "deal-view" "clear"}}',
	            fromLabel: '{{agile_lng_translate "calendar" "from"}}',
	            toLabel: '{{agile_lng_translate "calendar" "to"}}',
	            customRangeLabel: '{{agile_lng_translate "campaigns" "custom"}}',
                daysOfWeek: $.fn.datepicker.dates['en'].daysExactMin,
                monthNames: $.fn.datepicker.dates['en'].months,
                firstDay: parseInt(CALENDAR_WEEK_START_DAY)
            }
        }, function(start, end) {
            if (start && end) {
                var months_diff = Math.abs(start.getMonth() - end.getMonth() + (12 * (start.getFullYear() - end.getFullYear())));
                $('#reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
                $("#week-range").html(end.add({
                    days: -6
                }).toString('MMMM d, yyyy') + ' - ' + end.add({
                    days: 6
                }).toString('MMMM d, yyyy'));
            } else {
                $('#reportrange span').html(Date.today().add({
                    days: -6
                }).toString('MMMM d, yyyy') + '-' + Date.today().toString('MMMM d, yyyy'));
                $('.daterangepicker > .ranges > ul > li').each(function() {
                    $(this).removeClass("active");
                });
            }
            callback();
        });
        $('.daterangepicker > .ranges > ul').on("click", "li", function(e) {
            $('.daterangepicker > .ranges > ul > li').each(function() {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
        });

    });

}


