/**
* js for initialising the mini Calendar portlet with agile 
* and google events along with adding and updating the events
**/

//json Object for collecting events
var jso=[];
var mini_fullCal;
var mini_popover_call;

/**
 * initialises full calendar functionality in a mini calendar
 * with a list of events in the side bar for each day.
 * and can add and update event for the day. Also mousehoveing the events shows the complete detail of events
 */
function minicalendar(el)
{
	_agile_delete_prefs('current_date_calendar');
	init_cal(el);
	var totalEvents = 0;
	var eventsCount = 0;
	var dayClasses = [];


	mini_fullCal=$('#calendar_container',el).fullCalendar({


		aspectRatio:getaspectratio(el),
		selectable: true,
		header : { left : 'prev',right:'next', center :'title'  },
		weekMode:'liquid',
		titleFormat :
		{
			month : 'MMM yyyy',
		},

		eventSources :[
		               {
		            	   events : function(start, end, callback)
		            	   {

		            	   		App_Portlets.eventCalendar=$(el);
		            		   var datasizeY=$(el).parent().attr('data-sizey');
		            		   if(datasizeY==2)
		            			   $(el).find('.fc-header').css('height','145px');		
		            		   else if(datasizeY==3)
		            			   $(el).find('.fc-header').css('height','250px');		

		            		   $(el).find('.fc-border-separate').addClass('ignore-collection');
		            		   if($(el).find('#calendar_container').width()<185)
		            		   {
		            		   		$(el).find("#calendar_container").find(".fc-widget-header").each(function() {
                 					   $(this).text($(this).text().substring(0, 1))
              					  });
		            		   }
		            		   var date=new Date();
		            		   var todayDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),00,00,00);
		            		   var endDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59);
		            		   var todayDiv='<div class="show p-t-xs text-md text-center">Today </div><ul class="list"></ul>';
		            		   if(_agile_get_prefs('current_date_calendar')!=null)
		            		   {
		            			   var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		            			   var cookie_date=new Date(_agile_get_prefs('current_date_calendar'));
		            			   if(cookie_date.getTime()!=todayDate.getTime()){
		            				   todayDate=cookie_date;
		            				   endDate=new Date(cookie_date.getFullYear(), cookie_date.getMonth(), cookie_date.getDate(),23,59,59);
		            				   $(el).find('.events_show').empty().append('<div class="show p-t-xs text-md text-center">'+days[cookie_date.getDay()]+', ' +cookie_date.format('dd mmm')+' </div><ul class="list"></ul>');

		            			   }
		            			   else
		            				   $(el).find('.events_show').empty().append(todayDiv);
		            		   }
		            		   else if(start<todayDate &&  todayDate<end){
		            			   $(el).find('.events_show').empty().append(todayDiv);

		            		   }

		            		   if(datasizeY==2)
		            			   $(el).find('.show').css('padding-top','70px');
		            		   else if(datasizeY==3)
		            			   $(el).find('.show').css('padding-top','120px');
		            		   var top=parseInt($(el).find('.fc-widget-content').css('height'))/2-7;
		            		   $(el).find('.fc-day-number').css('top',top);  

		            		   var eventsURL = '/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000 + "&owner_id=" +CURRENT_AGILE_USER.id;


		            		   $.getJSON(eventsURL, function(doc)
		            				   {
		            				   	jso=[];
		            			   $.each(doc, function(index, data)
		            					   {

		            				   if (data.color == 'red' || data.color == '#f05050')
		            					   data.color='#f05050';
		            				   else if (data.color == '#36C' || data.color == '#23b7e5' || data.color == 'blue')
		            					   data.color='#7266ba';
		            				   else if (data.color == 'green' || data.color == '#bbb')
		            					   data.color='#fad733';


		            				   var e_date= new Date(data.start*1000);
		            				   var end_date=new Date(data.end*1000);
		            				   //var a=Math.round((end_date-e_date)/(1000*60*60*24));
		            				   var a=(end_date.getMonth()-e_date.getMonth())+(end_date.getDate()-e_date.getDate());
		            				   if(a==0){
		            					   var new_json1=JSON.parse(JSON.stringify(data));
		            					   jso.push(new_json1);
		            				   }
		            				   else{
		            					   for(var i=0;i<=a;i++){
		            						   var new_json=JSON.parse(JSON.stringify(data));
		            						   var json_start=new Date(e_date.getFullYear(),e_date.getMonth(),e_date.getDate()+i,00,00,00).getTime()/1000;
		            						   var json_end=new Date(e_date.getFullYear(),e_date.getMonth(),e_date.getDate()+i,23,59,59).getTime()/1000;
		            						   if(i==0){
		            							   new_json.start=e_date.getTime()/1000;
		            							   new_json.end=json_end;
		            						   }
		            						   else if(i<a){		
		            							   new_json.start=json_start;
		            							   new_json.end=json_end
		            						   }
		            						   else{
		            							   new_json.start=json_start
		            							   new_json.end=end_date.getTime()/1000;
		            						   }
		            						   jso.push(new_json);
		            					   } }
		            					   });

		            			   if (doc)
		            			   {

		            				   console.log(jso);
		            				   $.each(jso,function(index,ev){
		            					   if(ev.start >= (todayDate.getTime()/1000) && ev.start <= (endDate.getTime()/1000)) {
		            						   if($(el).find('.portlet-calendar-error-message').length!=0)
		            						   {
		            							   $(el).find('.portlet-calendar-error-message').css('display','none');
		            							   $(el).find('.minical-portlet-event-add').css('display','none');
		            						   }
		            						   var e_date= new Date(ev.start*1000);
		            						   var len=$(el).find('.list').find('li').length;
		            						   var event_list='<li class="p-t-xs p-r-xs" style="color:'+ev.color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data-date='+todayDate.getTime()+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ e_date.format('HH:MM') + ' </small></span></li>';
		            						   if(len!=0)
		            						   {
		            							   $(el).find('.list').find('small').each(function(x) 
		            									   {
		            								   if(e_date.format('HH:MM')<$(this).text())
		            								   {
		            									   $(this).parents('li').before(event_list);
		            									   return false;
		            								   }
		            								   if(x==len-1)
		            									   $(this).parents('.list').append(event_list) ;

		            									   });
		            						   }

		            						   else
		            							   $(el).find('.list').append(event_list);
		            					   }
		            				   }); 


		            				   callback(jso);
		            			   }



		            				   });


		            	   } },{dataType :'agile-events-mini'}


		            	   ],



		            	   eventRender: function (event, element, view) { 
		            		   var year = event.start.getFullYear(), month = event.start.getMonth() + 1, date = event.start.getDate();
		            		   var result = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
		            		   $(element).addClass(result);
		            		   $(element).attr('id',event.id);
		            		   dayClasses.push(result);
		            		    $('.fc-event','.portlet_body_calendar').find('.fc-event-inner').css('display','none');

		            		   var count=$(el).find('.'+result).length;
		            		   if(count>3){
		            			   return false;
		            		   } 

		            	   } ,
		            	   eventAfterRender: function (event, element, view) {

		            		   eventsCount++;
		            		   if(totalEvents == 0)
		            		   {
		            			   totalEvents = $(el).find('#calendar_container').find('.fc-event').length;
		            		   }
		            		   var h=parseInt($(el).find('.fc-widget-content').css('height'));
		            		   var head=parseInt($(el).find('.fc-header').css('height'));
		            		   var top=element.position().top+h-25;
		            		   var left=element.position().left+5;
		            		   $(element).css('top',top);
		            		   $(element).css('left',left);

		            		   if(eventsCount==totalEvents || eventsCount==(2*totalEvents)){
		            			   var temp;
		            			   var dayEventsTotalCount = totalEvents;
		            			   totalEvents = 0;
		            			   eventsCount = 0;
		            			   jso=[];
		            			   var classNamesArray = [];
		            			   $(el).find('#calendar_container').find('.fc-event').each(function(index){
		            				   if($.inArray($(this).attr('class').split(" ")[$(this).attr('class').split(" ").length-1], classNamesArray)==-1){
		            					   classNamesArray.push($(this).attr('class').split(" ")[$(this).attr('class').split(" ").length-1]);
		            				   }
		            			   });
		            			   $.each(classNamesArray,function(index, value){
		            				   var dayEventsCount = 0;
		            				   $.each(dayClasses, function(index1, value1){
		            					   if(dayClasses[index1]==classNamesArray[index]){
		            						   dayEventsCount++;
		            					   }
		            				   });
		            				   if(eventsCount==(2*dayEventsTotalCount)){
		            					   dayEventsCount = dayEventsCount/2;
		            				   }
		            				   var pos = $('.'+this,el).eq(0).position();
		            				   var eventsLength = $('.'+this,el).length;
		            				   var addPixels = Math.round(($(el).find('.fc-widget-header').eq(1).width()-10)/2);
		            				   if(eventsLength==1){
		            					   pos.left += addPixels;
		            				   }
		            				   else if(eventsLength==2){
		            					   pos.left += addPixels;
		            					   pos.left -= 3;
		            				   }
		            				   else if(eventsLength==3){
		            					   pos.left += addPixels;
		            					   pos.left -= 6;
		            				   }
		            				   else{
		            					   pos.left += addPixels;
		            					   pos.left -= 10;
		            				   }

		            				   pos.top += 8;
		            				   $('.'+this,el).each(function(index)
		            						   {
		            					   if(index>0){
		            						   $(this,el).css({"top": pos.top, "left":pos.left+(6*index)});

		            						   if(index>2)
		            						   {
		            							   $(this,el).hide();
		            						   }
		            					   }
		            					   else if(index==0){
		            						   $(this,el).css({"top": pos.top, "left":pos.left});
		            					   }

		            						   });
		            				   if(dayEventsCount>3)
		            				   {
		            					   var icon_pos = pos.left+(3*6);
		            					   $('.'+this,el).eq(eventsLength-1).after('<div class="plus-button pos-abs c-p" style="top: '+(pos.top-7)+'px;left: '+icon_pos+'px; color:lightgray;" title="'+(dayEventsCount-3)+' more">&nbsp;</div>');
		            				   }
		            			   });

		            			   dayClasses = [];
		            		   }
		            	   },

		            	   eventMouseover : function(event, jsEvent, view)
		            	   {
		            		   $(el).find('.portlet_header_icons').removeClass('vis-hide');
		            		   $(el).find('.fc-button').css('visibility','visible');
		            		   el.parent().css('z-index',3);
		            		   var reletedContacts = '';
		            		   var meeting_type = '';
		            		   var that = $(this);

		            		   if(CURRENT_AGILE_USER.domainUser.ownerPic=="" || CURRENT_AGILE_USER.domainUser.ownerPic=="no image")
		            			   event.owner.pic=gravatarImgForPortlets(25);

		            			if(that.data("data_fetched"))
								{
									$('.fc-overlay').hide();
		            		  			$('.fc-overlay').remove();
									event.contacts=that.data("data_fetched");
									
									var leftorright = 'bottom';
		            		   var pullupornot = '';
		            		   var popoverElement = '';

		            		   var eventJSON = {};
										
										eventJSON.leftorright = leftorright;
										
										eventJSON.pullupornot = pullupornot;eventJSON.event = event;
										
		            		   if(event.type=="AGILE"){
		            			  
		            			  that.append($(getTemplate("calendar-mouseover-popover-miniCalendar", eventJSON)));
		            			   that.find('.fc-overlay').find('.arrow').css('top','70px');
		            		   }
		            		   
		            		   var overlay=that.find('.fc-overlay');
		            		   if(event.start.getDay()==4 || event.start.getDay()==5 || event.start.getDay()==6){
		            			   overlay.css('left','-180px');
		            			   overlay.find('.arrow').css('left','91%');
		            		   }
		            		   if(event.contacts.length>1){
		            		   
		            		   if(meeting_type!=''){
		            			   overlay.css('top','-108px');
		            			   overlay.find('.arrow').css('top','98px');
		            		   }
		            		   else{
		            		   	overlay.css('top','-95px');
		            			   overlay.find('.arrow').css('top','84px');
		            			}
		            		}
		            		else{

		            		   if(event.contacts.length>0){
		            		   		var top = overlay.height();
		            		   		var arrowTop= top-22;
		            		   		top=top-9;
		            			   overlay.css('top', '-'+top+'px');
		            			   overlay.find('.arrow').css('top',arrowTop+'px');
		            		   }
		            		  
		            		}
		            		   overlay.show();
									return;
								}
		            			if(event.id!=undefined){
		            			mini_popover_call=$.ajax({ 
									url : "/core/api/events/contacts-related?id="+event.id, 
									dataType : 'json',
									success : function(data){
											console.log(data);
											event.contacts=data;
											that.data("data_fetched",data);
		            		  			$('.fc-overlay').hide();
		            		  			$('.fc-overlay').remove();
		            		


		            		   var leftorright = 'bottom';
		            		   var pullupornot = '';
		            		   var popoverElement = '';

		            		   var eventJSON = {};
										
										eventJSON.leftorright = leftorright;
										
										eventJSON.pullupornot = pullupornot;eventJSON.event = event;
										
		            		   if(event.type=="AGILE"){
		            			  
		            			  that.append($(getTemplate("calendar-mouseover-popover-miniCalendar", eventJSON)));
		            			   that.find('.fc-overlay').find('.arrow').css('top','70px');
		            		   }
		            		   
		            		   var overlay=that.find('.fc-overlay');
		            		   if(event.start.getDay()==4 || event.start.getDay()==5 || event.start.getDay()==6){
		            			   overlay.css('left','-180px');
		            			   overlay.find('.arrow').css('left','91%');
		            		   }
		            		   if(event.contacts.length>1){
		            		   
		            		   if(meeting_type!=''){
		            			   overlay.css('top','-108px');
		            			   overlay.find('.arrow').css('top','98px');
		            		   }
		            		   else{
		            		   	overlay.css('top','-95px');
		            			   overlay.find('.arrow').css('top','84px');
		            			}
		            		}
		            		else{

		            		   if(event.contacts.length>0){
		            		   		var top = overlay.height();
		            		   		var arrowTop= top-22;
		            		   		top=top-9;
		            			   overlay.css('top', '-'+top+'px');
		            			   overlay.find('.arrow').css('top',arrowTop+'px');
		            		   }
		            		  
		            		}
		            		   overlay.show();
		            		} });
							}
		            	   },
		            	   eventMouseout : function(event, jsEvent, view)
		            	   {
		            	   	mini_popover_call.abort();
		            		   el.parent().css('z-index',2);
		            		   $(this).find('.fc-overlay').hide();
		            		   $(this).find('.fc-overlay').remove();
		            	   },

		            	   dayClick : function(date,allDay,jsEvent,view){
		            		   App_Portlets.refetchEvents = false;
		            		   var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		            		   var current_date = new Date();
		            		   if(date.getFullYear()==current_date.getFullYear() && date.getMonth()==current_date.getMonth() && date.getDate()==current_date.getDate()){
		            			   $(el).find('.events_show').empty().append('<div class="show p-t-xs text-md text-center">Today</div><ul class="list"></ul>');
		            		   }
		            		   else{
		            			   $(el).find('.events_show').empty().append('<div class="show p-t-xs text-md text-center">'+days[date.getDay()]+', ' +date.format('dd mmm')+' </div><ul class="list"></ul>');
		            		   }

		            		   if($(el).parent().attr('data-sizey')==2)
		            			   $(el).find('.show').css('padding-top','70px');
		            		   else if($(el).parent().attr('data-sizey')==3)
		            			   $(el).find('.show').css('padding-top','120px');
		            		   var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
		            		   var array= $('#calendar_container',el).fullCalendar('clientEvents', function(event)
		            				   {
		            			   return (event.start >= date && event.start < endDate);
		            				   });
		            		   if(array.length!=0){
		            			   $.each(array,function(index){
		            				   var len=$(el).find('.list').find('li').length;
		            				   var event_list='<li class="p-t-xs p-r-xs" style="color : '+array[index].color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+array[index].id+' data-date='+date.getTime()+'>'+array[index].title+'</a><br><small class="block m-t-n-xxs">'+ array[index].start.format('HH:MM') + ' </small></span></li>';
		            				   if(len!=0){
		            					   $(el).find('.list').find('small').each(function(x) 
		            							   {
		            						   if(array[index].start.format('HH:MM')<$(this).text())
		            						   {
		            							   $(this).parents('li').before(event_list);
		            							   return false;
		            						   }

		            						   if(x==len-1)
		            							   $(this).parents('.list').append(event_list);
		            							   });
		            				   }
		            				   else
		            					   $(el).find('.list').append(event_list);

		            			   });
		            		   }
		            		   else if(!App_Portlets.refetchEvents){
		            			   $(el).find('.events_show').append('<div class="portlet-calendar-error-message">No appointments for the day</div><div class="text-center"><a class="minical-portlet-event-add text-info" id='+date.getTime()+' data-date='+date.getTime()+'>+Add</a></div>');
		            		   }
		            	   }

	}); 


}

/** set up the library and gapi used to get google events from google calendar 
 * If calendar not available , returns.
 **/
function loadingGoogleEvents(el,startTime,endTime){

	$.getJSON('core/api/calendar-prefs/type/GOOGLE', function(response)
			{
		if(response==undefined)
		{
			setTimeout(function(){
				if($(el).find('.list').find('li').length==0 && $(el).find('.portlet-calendar-error-message').length==0)
				{
					var date=new Date();
					$(el).find('.events_show').append('<div class="portlet-calendar-error-message">No appointments for the day</div><div class="text-center"><a class="minical-portlet-event-add text-info" id='+date.getTime()+' data-date='+date.getTime()+'>+Add</a></div>');
				}
			},7000);
			_agile_delete_prefs('current_date_calendar');
		}
		console.log(response);
		if (response)
		{
			if(typeof gapi != "undefined" && isDefined(gapi) && isDefined(gapi.client) && isDefined(gapi.client.calendar)) 
			{
				googledata(el,response,startTime,endTime);
			return;
			}


			head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js?t=27', function()
					{
				setupGC(function()
					{
					
								googledata(el,response,startTime,endTime);
								return;
						
						});
					});
		}
			});

}

var isSet = false;

/**Initializes google Calendar **/
function init_cal(el){
	if(isSet)
		return;
	var fc = $.fullCalendar;
	isSet = true;
	//fc.sourceFetchers = [];
	// Transforms the event sources to Google Calendar Events
	fc.sourceFetchers.push(function(sourceOptions, start, end) {
		if (sourceOptions.dataType == 'agile-events-mini'){
			loadingGoogleEvents(App_Portlets.eventCalendar,start.getTime()/1000,end.getTime()/1000);
			getOfficeEvents(App_Portlets.eventCalendar, start.getTime(), end.getTime());
		}
	});

}

/**
 * Get the Google events from attached goodle calendar 
 */
function googledata(el,response,startTime,endTime)
{
	try{
	gapi.auth.setToken({ access_token : response.access_token, state : "https://www.googleapis.com/auth/calendar" });

	var current_date = new Date();
	var timezone_offset = current_date.getTimezoneOffset();
	var startDate = new Date((startTime * 1000)-(timezone_offset*60*1000));
	var gDateStart = startDate.toISOString();
	var endDate = new Date((endTime * 1000)-(timezone_offset*60*1000));
	var gDateEnd = endDate.toISOString();
	// Retrieve the events from primary
	var request = gapi.client.calendar.events
	.list({ 'calendarId' : 'primary', maxResults : 1000, singleEvents : true, orderBy : 'startTime', timeMin : gDateStart, timeMax : gDateEnd });
	request.execute(function(resp)
			{

		head.js('flatfull/lib/web-calendar-event/moment.min.js', function(){
		head.js('flatfull/lib/web-calendar-event/moment-timezone-with-data.js',function() {

			var events = new Array();
			console.log(resp);
			if(resp.items){
				for (var j = 0; j < resp.items.length; j++)
				{
					var fc_event = google2fcEvent(resp.items[j]);
					
					/*var utcTime = new Date(fc_event.start).toUTCString();
					var tz = moment.tz(utcTime, CURRENT_USER_PREFS.timezone);
  					fc_event.start = tz.format();
  					utcTime = new Date(fc_event.end).toUTCString();
					tz = moment.tz(utcTime, CURRENT_USER_PREFS.timezone);
  					fc_event.end = tz.format();*/

					renderGoogleEvents(events,fc_event,el);
				}
			}

			console.log($("#calendar_container", el).fullCalendar("getView").visStart);

		$('#calendar_container', el).fullCalendar('removeEventSource', functions["event_mini_google" + $(el).attr('id')]);
			var events_clone = events.slice(0);
			functions["event_mini_google" + $(el).attr('id')] = function(start, end, callback)
			{
				console.log(this);
				console.log($("#calendar_container", el).fullCalendar("getView").visStart);
				if($('#calendar_container', el).fullCalendar('getView').visStart.getTime()!=start.getTime())
					return;
				callback(events_clone);
				
			}

			$('#calendar_container',el).fullCalendar('addEventSource', functions["event_mini_google" + $(el).attr('id')]);
			events_clone = [];
			
		//**Add the google Events in the list of events in events_show div **/
		var len=$(".events_show",el).find('.list').find('li').length;
		var date=new Date();
		$.each(events,function(index,ev){

			 if($(el).find('.portlet-calendar-error-message').length!=0)
		            						   {
		            							   $(el).find('.portlet-calendar-error-message').css('display','none');
		            							   $(el).find('.minical-portlet-event-add').css('display','none');
		            						   }
			var todayDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),00,00,00);
			var endDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59);

			if(_agile_get_prefs('current_date_calendar')!=null)
			{
				var cookie_date=new Date(_agile_get_prefs('current_date_calendar'));
				todayDate=cookie_date;
				endDate=new Date(cookie_date.getFullYear(), cookie_date.getMonth(), cookie_date.getDate(),23,59,59);

			}
			if(ev.start.getTime() >= (todayDate.getTime()) && ev.start.getTime() <= (endDate.getTime())) 
			{	
				var event_list='<li class="p-t-xs p-r-xs" style="color:'+ev.color+'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data-date='+date.getTime()+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ ev.start.format('HH:MM') + ' </small></span></li>';
				if(len!=0){
					
					$(el).find('.list').find('small').each(function( index ) 
							{
							if(ev.start.format('HH:MM')<$(this).text())
							{
								$(this).parents('li').before(event_list);
								return false;

							}
							if(index==len-1)
		            			  $(this).parents('.list').append(event_list) ;

							});
								

								}
					else
						$(el).find('.list').append(event_list);
				}
			});

			_agile_delete_prefs('current_date_calendar');
			setTimeout(function(){
				//_agile_delete_prefs('current_date_calendar');
				if($(el).find('.list').find('li').length==0 && $(el).find('.portlet-calendar-error-message').length==0)
				{
					$(el).find('.events_show').append('<div class="portlet-calendar-error-message">No appointments for the day</div><div class="text-center"><a class="minical-portlet-event-add text-info" id='+date.getTime()+' data-date='+date.getTime()+'>+Add</a></div>');
				}
			},7000);
		});
		});
	});
}
	catch(e){
		if($(el).find('.list').find('li').length==0 && $(el).find('.portlet-calendar-error-message').length==0)
		{
			var date=new Date();
			$(el).find('.events_show').append('<div class="portlet-calendar-error-message">No appointments for the day</div><div class="text-center"><a class="minical-portlet-event-add text-info" id='+date.getTime()+' data-date='+date.getTime()+'>+Add</a></div>');
		}
}

}

/** Rendering the events to the mini Calendar
** Also all day events are broken into each day event to show on every day
*/
function renderGoogleEvents(events,fc_event,el)
{
	fc_event.startDate=new Date(fc_event.start);
			fc_event.end=new Date(fc_event.end);

		

			fc_event.color='#3a3f51';
			fc_event.backgroundColor='#3a3f51';
			if(fc_event.allDay==true){
				fc_event.start = new Date(fc_event.startDate.getTime()+fc_event.startDate.getTimezoneOffset()*60*1000);
				fc_event.end= new Date(new Date(fc_event.google.end.date).getTime()+fc_event.startDate.getTimezoneOffset()*60*1000);
				var a;
				if(fc_event.start.getMonth()<fc_event.end.getMonth())
				a=Math.round((fc_event.end-fc_event.start)/(60*60*1000*24));
			   else
			   	a=(fc_event.end.getMonth()-fc_event.start.getMonth())+(fc_event.end.getDate()-fc_event.start.getDate());
				if(a==1)
				{
					fc_event.start=fc_event.start.getTime()/1000;
					fc_event.end=(fc_event.end.getTime()-1)/1000;
					//$('#calendar_container',el).fullCalendar('renderEvent',fc_event);
					events.push(fc_event);
				}
				else
				{
					for(var i=0;i<a;i++){
						var new_json={};
						new_json=JSON.parse(JSON.stringify(fc_event));
						if(i==0){
							new_json.start=fc_event.start.getTime()/1000;
							new_json.end=new Date(fc_event.start.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
						}
						else if(i<a){		
							new_json.start=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,00,00,00).getTime()/1000;
							new_json.end=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,23,59,59).getTime()/1000;
						}
						else{
							new_json.start=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,00,00,00).getTime()/1000;
							new_json.end=fc_event.end.getTime()/1000;
						}
						console.log(new_json);
						//$('#calenetdar_container',el).fullCalendar('renderEvent',new_json);
						events.push(new_json);
					}
				}

			} 
			else
			{
				
			var a;
				if(fc_event.startDate.getMonth()<fc_event.end.getMonth())
				a=Math.round((fc_event.end-fc_event.startDate)/(60*60*1000*24));
			   else
			   	a=(fc_event.end.getMonth()-fc_event.startDate.getMonth())+(fc_event.end.getDate()-fc_event.startDate.getDate());
				
				if(a==0){
					fc_event.start=fc_event.startDate.getTime()/1000;
					fc_event.end=fc_event.end.getTime()/1000;
					//$('#calendar_container',el).fullCalendar('renderEvent',fc_event);
					events.push(fc_event);
				}
				else{
					for(var i=0;i<=a;i++){
						var new_json={};
						new_json=JSON.parse(JSON.stringify(fc_event));
						if(i==0){
							new_json.start=fc_event.startDate.getTime()/1000;
							new_json.end=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
						}
						else if(i<a){		
							new_json.start=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,00,00,00).getTime()/1000;
							new_json.end=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
						}
						else{
							new_json.start=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,00,00,00).getTime()/1000;
							new_json.end=fc_event.end.getTime()/1000;
						}
						console.log(new_json);
						//$('#calendar_container',el).fullCalendar('renderEvent',new_json);
						events.push(new_json);
					}
				}
			}

			
}


function getOfficeEvents(el, startDateTime, endDateTime){	

	var url = "core/api/officecalendar/office365-appointments?startDate="+ startDateTime +"&endDate="+ endDateTime;
	var officeEvents = new Array();

	$.getJSON(url, function(response){
		if(response){						
			for (var i=0; i<response.length; i++){		
				var obj = response[i];
				obj.allDay = false;
				//officeEvents.push(obj);				
				renderOfficeEvents(officeEvents, obj, el);								
			}		

			//**Add the google Events in the list of events in events_show div **/
		var len = $(".events_show",el).find('.list').find('li').length;
		var date = new Date();
		$.each(officeEvents,function(index,ev){
			var todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(),00,00,00);
			var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59);

			if(_agile_get_prefs('current_date_calendar')!=null)
			{
				var cookie_date = new Date(_agile_get_prefs('current_date_calendar'));
				todayDate = cookie_date;
				endDate = new Date(cookie_date.getFullYear(), cookie_date.getMonth(), cookie_date.getDate(),23,59,59);

			}
			if(ev.start.getTime() >= (todayDate.getTime()) && ev.start.getTime() <= (endDate.getTime())) 
			{	
				var event_list = '<li class="p-t-xs p-r-xs" style="color:'+ ev.color +'"><span style="color : #58666e" class="text-cap word-break"><a class="minical-portlet-event" id='+ev.id+' data-date='+date.getTime()+'>'+ev.title+'</a><br><small class="block m-t-n-xxs">'+ ev.start.format('HH:MM') + ' </small></span></li>';
				if(len != 0){
					$(el).find('.list').find('small').each(function( index ){
						if(ev.start.format('HH:MM') < $(this).text()){
							$(this).parents('li').before(event_list);
							return false;
						}
						if(index==len-1)
		            	$(this).parents('.list').append(event_list) ;
					});
					
				} else{
					$(el).find('.list').append(event_list);
				}
			}
		});
		_agile_delete_prefs('current_date_calendar');
		setTimeout(function(){
			//_agile_delete_prefs('current_date_calendar');
			if($(el).find('.list').find('li').length==0 && $(el).find('.portlet-calendar-error-message').length==0)
			{
				$(el).find('.events_show').append('<div class="portlet-calendar-error-message">No appointments for the day</div><div class="text-center"><a class="minical-portlet-event-add text-info" id='+date.getTime()+' data-date='+date.getTime()+'>+Add</a></div>');
			}
		},7000);				
		}else{			
			console.log("Error occurred while fetching office records.");
		}
	});	

}



/** Rendering the events to the mini Calendar
** Also all day events are broken into each day event to show on every day
*/
function renderOfficeEvents(officeEvents, fc_event, el)
{
	fc_event.startDate = new Date(fc_event.start);
			fc_event.end = new Date(fc_event.end);
			fc_event.color='#74ceff';
			fc_event.backgroundColor='#74ceff';
			if(fc_event.allDay == true){
				fc_event.start = new Date(fc_event.startDate.getTime()+fc_event.startDate.getTimezoneOffset()*60*1000);
				fc_event.end = new Date(new Date(fc_event.google.end.date).getTime()+fc_event.startDate.getTimezoneOffset()*60*1000);
				var a=(fc_event.end.getMonth()-fc_event.startDate.getMonth())+(fc_event.end.getDate()-fc_event.startDate.getDate());
				if(a == 1)
				{
					fc_event.start=fc_event.start.getTime()/1000;
					fc_event.end=(fc_event.end.getTime()-1)/1000;
					$('#calendar_container',el).fullCalendar('renderEvent',fc_event);
					officeEvents.push(fc_event);
				}
				else
				{
					for(var i=0;i<a;i++){
						var new_json={};
						new_json=JSON.parse(JSON.stringify(fc_event));
						if(i==0){
							new_json.start=fc_event.start.getTime()/1000;
							new_json.end=new Date(fc_event.start.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
						}
						else if(i<a){		
							new_json.start=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,00,00,00).getTime()/1000;
							new_json.end=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,23,59,59).getTime()/1000;
						}
						else{
							new_json.start=new Date(fc_event.start.getFullYear(),fc_event.start.getMonth(),fc_event.start.getDate()+i,00,00,00).getTime()/1000;
							new_json.end=fc_event.end.getTime()/1000;
						}
						console.log(new_json);
						$('#calendar_container',el).fullCalendar('renderEvent',new_json);
						officeEvents.push(new_json);
					}
				}

			} 
			else
			{
				var a=(fc_event.end.getMonth()-fc_event.startDate.getMonth())+(fc_event.end.getDate()-fc_event.startDate.getDate());
				if(a==0){
					fc_event.start=fc_event.startDate.getTime()/1000;
					fc_event.end=fc_event.end.getTime()/1000;
					$('#calendar_container',el).fullCalendar('renderEvent',fc_event);
					officeEvents.push(fc_event);
				}
				else{
					for(var i=0;i<=a;i++){
						var new_json={};
						new_json=JSON.parse(JSON.stringify(fc_event));
						if(i==0){
							new_json.start=fc_event.startDate.getTime()/1000;
							new_json.end=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
						}
						else if(i<a){		
							new_json.start=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,00,00,00).getTime()/1000;
							new_json.end=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,23,59,59).getTime()/1000;
						}
						else{
							new_json.start=new Date(fc_event.startDate.getFullYear(),fc_event.startDate.getMonth(),fc_event.startDate.getDate()+i,00,00,00).getTime()/1000;
							new_json.end=fc_event.end.getTime()/1000;
						}
						console.log(new_json);
						$('#calendar_container',el).fullCalendar('renderEvent',new_json);
						officeEvents.push(new_json);
					}
				}
			}
}


/*
 *  get the aspectratio(width/height) for minicalendar
 */
function getaspectratio(el)
{
	var width;
	var height;
	var dataSizeX=$(el).parent().attr('data-sizex');
	var dataSizeY=$(el).parent().attr('data-sizey');
	if(dataSizeX==1)
	{
		$(el).find('#calendar_container').css("padding","0px");
	}
	if(dataSizeX==2)
	{
		$(el).find('#calendar_container').css("padding","0px 50px 0px");

	}
	if(dataSizeX==3)
	{
		$(el).find('#calendar_container').css("padding","0px 100px 0px");

	}
	if(dataSizeY==1)
	{
		height=$(el).height()-25;
	}
	else if(dataSizeY==2){
		height=$(el).height()-200;
	}
	else
		height=$(el).height()-350;
	width=$(el).find('#calendar_container').width();
	return (width/height);
}
