
var isDateChanged=false;
function gmap_date_range(el, callback){
	
	  
		// Bootstrap date range picker.
	   var date = new Date();
	   date.setDate(date.getDate()-1);
		$('#gmap_date_range', el).daterangepicker({ranges : { 'Today' : [
				'today', 'today'
		], 'Yesterday' : [
				'yesterday', 'yesterday'
		], 'Last 7 Days' : [
				Date.today().add({ days : -6 }), 'today'
		], 'Last 30 Days' : [
				Date.today().add({ days : -29 }), 'today'
		], 'This Month' : [
				Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()
		], 'Last Month' : [
				Date.today().moveToFirstDayOfMonth().add({ months : -1 }), Date.today().moveToFirstDayOfMonth().add({ days : -1 })
		], 'This Quarter' : [
				Date.today().getMonth() < 3 ? new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth() : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(3)).moveToFirstDayOfMonth() :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(6)).moveToFirstDayOfMonth() : new Date(Date.today().setMonth(9)).moveToFirstDayOfMonth(), 
				Date.today().getMonth() < 3 ? new Date(Date.today().setMonth(2).moveToLastDayOfMonth()) : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(5)).moveToLastDayOfMonth() :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(8)).moveToLastDayOfMonth() : new Date(Date.today().setMonth(11)).moveToLastDayOfMonth()
		], 'Last Quarter' : [
				Date.today().getMonth() < 3 ? new Date(Date.today().add({ years : -1 }).setMonth(9)).moveToFirstDayOfMonth() : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth() :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(3)).moveToFirstDayOfMonth() : new Date(Date.today().setMonth(6)).moveToFirstDayOfMonth(), 
				Date.today().getMonth() < 3 ? new Date(Date.today().add({ years : -1 }).setMonth(11)).moveToLastDayOfMonth() : 
				(Date.today().getMonth() >= 3 && Date.today().getMonth() < 6) ? new Date(Date.today().setMonth(2)).moveToLastDayOfMonth() :
				(Date.today().getMonth() >= 6 && Date.today().getMonth() < 9) ? new Date(Date.today().setMonth(5)).moveToLastDayOfMonth() : new Date(Date.today().setMonth(8)).moveToLastDayOfMonth()
		], 'This Year' : [
				new Date(Date.today().setMonth(0)).moveToFirstDayOfMonth(), new Date(Date.today().setMonth(11)).moveToLastDayOfMonth()
		], 'Last Year' : [
				new Date(Date.today().setMonth(0)).add({ years : -1 }).moveToFirstDayOfMonth(), new Date(Date.today().setMonth(11)).add({ years : -1 }).moveToLastDayOfMonth()
		] } }, function(start, end)
		{
			window.toDate=start;
			window.fromDate=end;
			$('#gmap_date_range span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
			gmap_search_by_date($('#gmap_date_range span').text());
		});
		
		if(callback && typeof(callback) == "function"){
			callback();
		}
		$('.daterangepicker > .ranges > ul').on("click", "li", function(e)
		{
			$('.daterangepicker > .ranges > ul > li').each(function(){
				$(this).removeClass("active");
			});
			$(this).addClass("active");
		});
}

function gmap_search_by_date(DateRange){
	isDateChanged=true;
	console.clear();
	
    var User_Domain = CURRENT_DOMAIN_USER.domain;
	//var User_Domain = "our";
	var options = "&";
	
	// Get Date Range
	var range = DateRange.split("-");

	// Returns milliseconds from start date. For e.g., August 6, 2013 converts
	// to 1375727400000
	var start_date = Date.parse($.trim(range[0])).valueOf();
	start_date=convertToUTCTime(start_date,'start');

	// Returns milliseconds from end date.
	var end_date = Date.parse($.trim(range[1])).valueOf();
	end_date=convertToUTCTime(end_date,'end');
	
	
	
	// Adds start_time, end_time and timezone offset to params.
	options += ("start_date=" + start_date + "&end_date=" + end_date);

	// Add Timezone offset
	var d = new Date();
	options += ("&time_zone=" + d.getTimezoneOffset());
	//var DateRangeUrl = "core/api/gmap/daterange?user_domain=" + encodeURIComponent(User_Domain) + options;
	var visitorBySessionUrl="core/api/gmap/daterangebysession?user_domain=" + encodeURIComponent(User_Domain) + options;
	var DateRangeUrl="core/api/gmap/daterangebysession?user_domain=" + encodeURIComponent(User_Domain) + options;
	
	//Check which tab is active and make a respective call
	if($('ul.nav-tabs li.active').attr('id') == 'gmap-map-tab'){
		map.setZoom(2);
		$("#map-tab-waiting").fadeIn();
		setTimeout(function(){
			gmap_add_marker(DateRangeUrl);
        },1000)
        
	}else{
		gmap_create_table_view(visitorBySessionUrl);
	}
	
	$("li#gmap-table-tab").off().on("click", function(){
		window.pauseMap=true;
		
		if((! $(this).closest('ul').parent('div').find('div.tab-content').find('div#gmap-table-view').find('tbody').length || isDateChanged) &&  ! $(this).hasClass('active')){
			isDateChanged=false;
			gmap_create_table_view(visitorBySessionUrl);
		}
	     
	  });
$("li#gmap-map-tab").off().on("click", function(){
	    window.pauseMap=false;
	    
		if(isDateChanged && ! $(this).hasClass('active')){
			isDateChanged=false;
			map.setZoom(2);
			setTimeout(function(){
				gmap_add_marker(DateRangeUrl);
	        },1000)
		}else{
			$("#map-tab-waiting").fadeIn();
			getMarkers();
		}
			
		
	  });
	
	

}

function convertToUTCTime(localTime,whatTime){
	try{
		
		var time = new Date(localTime);
		if(whatTime == 'start')
		time.setHours(0,0,0,0);
		else if(whatTime == 'end')
		time.setHours(23,59,59,999);
		var utc_start = new Date(time.getUTCFullYear(), time.getUTCMonth(), time.getUTCDate(),  time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), time.getUTCMilliseconds());
		return utc_start.getTime();
	}catch(err){
		console.log("Error converting local  time to utc"+err);
	}
}

