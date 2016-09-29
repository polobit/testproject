/**
* CSV auto converts the text to month
*/
var _agile_month_short_names_localize = {
    "es" : ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],
    "en" : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    "months-xs" : ["{{agile_lng_translate 'months-xs' 'Jan'}}", "{{agile_lng_translate 'months-xs' 'Feb'}}", "{{agile_lng_translate 'months-xs' 'March'}}", "{{agile_lng_translate 'months-xs' 'April'}}", "{{agile_lng_translate 'months-xs' 'May'}}", "{{agile_lng_translate 'months-xs' 'June'}}", "{{agile_lng_translate 'months-xs' 'July'}}", "{{agile_lng_translate 'months-xs' 'Aug'}}", "{{agile_lng_translate 'months-xs' 'Sept'}}", "{{agile_lng_translate 'months-xs' 'Oct'}}", "{{agile_lng_translate 'months-xs' 'Nov'}}", "{{agile_lng_translate 'months-xs' 'Dec'}}"],
};

// Date picker language settings
if(!$.fn.datepicker){
   $.fn.datepicker = {dates : {"en" : {}}};
}
   

$.fn.datepicker.dates['en'] = { 
    days: ["{{agile_lng_translate 'prefs-settings' 'sunday'}}", "{{agile_lng_translate 'prefs-settings' 'monday'}}", "{{agile_lng_translate 'calendar' 'tuesday'}}", "{{agile_lng_translate 'calendar' 'wednesday'}}", "{{agile_lng_translate 'calendar' 'thursday'}}", "{{agile_lng_translate 'calendar' 'friday'}}", "{{agile_lng_translate 'calendar' 'saturday'}}", "{{agile_lng_translate 'prefs-settings' 'sunday'}}"],
    daysExact: ["{{agile_lng_translate 'prefs-settings' 'sunday'}}", "{{agile_lng_translate 'prefs-settings' 'monday'}}", "{{agile_lng_translate 'calendar' 'tuesday'}}", "{{agile_lng_translate 'calendar' 'wednesday'}}", "{{agile_lng_translate 'calendar' 'thursday'}}", "{{agile_lng_translate 'calendar' 'friday'}}", "{{agile_lng_translate 'calendar' 'saturday'}}"],
    daysShort: ["{{agile_lng_translate 'prefs-online-calendar' 'Sun'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Mon'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Tue'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Wed'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Thu'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Fri'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Sat'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Sun'}}"],
    daysShortExact: ["{{agile_lng_translate 'prefs-online-calendar' 'Sun'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Mon'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Tue'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Wed'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Thu'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Fri'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Sat'}}"],
    daysMin: ["{{agile_lng_translate 'days' 'Su'}}","{{agile_lng_translate 'days' 'Mo'}}","{{agile_lng_translate 'days' 'Tu'}}","{{agile_lng_translate 'days' 'We'}}","{{agile_lng_translate 'days' 'Th'}}","{{agile_lng_translate 'days' 'Fr'}}","{{agile_lng_translate 'days' 'Sa'}}","{{agile_lng_translate 'days' 'Su'}}"],
    months: ["{{agile_lng_translate 'months' 'January'}}", "{{agile_lng_translate 'months' 'february'}}", "{{agile_lng_translate 'months' 'March'}}", "{{agile_lng_translate 'months' 'April'}}", "{{agile_lng_translate 'months' 'May'}}", "{{agile_lng_translate 'months' 'June'}}", "{{agile_lng_translate 'months' 'July'}}", "{{agile_lng_translate 'months' 'August'}}", "{{agile_lng_translate 'months' 'September'}}", "{{agile_lng_translate 'months' 'October'}}", "{{agile_lng_translate 'months' 'November'}}", "{{agile_lng_translate 'months' 'December'}}"],
    monthsShort: _agile_month_short_names_localize['months-xs'],
    today: "{{agile_lng_translate 'portlets' 'today'}}",
    daysExactShort: ["{{agile_lng_translate 'prefs-online-calendar' 'Sun'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Mon'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Tue'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Wed'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Thu'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Fri'}}", "{{agile_lng_translate 'prefs-online-calendar' 'Sat'}}"],
    daysExactMin: ["{{agile_lng_translate 'days' 'Su'}}","{{agile_lng_translate 'days' 'Mo'}}","{{agile_lng_translate 'days' 'Tu'}}","{{agile_lng_translate 'days' 'We'}}","{{agile_lng_translate 'days' 'Th'}}","{{agile_lng_translate 'days' 'Fr'}}","{{agile_lng_translate 'days' 'Sa'}}"],
};

// Date format 
dateFormat.i18n = {
    dayNames: $.fn.datepicker.dates['en'].daysShortExact.concat($.fn.datepicker.dates['en'].daysExact),
    monthNames: $.fn.datepicker.dates['en'].monthsShort.concat($.fn.datepicker.dates['en'].months)
};

var _agile_date_utility = {
    get_date_from_string : function(string){
        if(!string)
             return null;

        return new Date(this.parseDate(string));
    },
    parseDate : function(string){
        return Date.parse(string);
    },
};