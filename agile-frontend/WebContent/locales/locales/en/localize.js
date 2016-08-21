/**
* CSV auto converts the text to month
*/
var _agile_month_short_names_localize = {
    "es" : ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],
    "en" : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    "months-xs" : ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
};

// Date picker language settings
if(!$.fn.datepicker){
   $.fn.datepicker = {dates : {"en" : {}}};
}
   

$.fn.datepicker.dates['en'] = { 
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    daysExact: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    daysShortExact: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysMin: ["Su","Mo","Tu","We","Th","Fr","Sa","Su"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: _agile_month_short_names_localize['months-xs'],
    today: "Today",
    daysExactShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysExactMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
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
