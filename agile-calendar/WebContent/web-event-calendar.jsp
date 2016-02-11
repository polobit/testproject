	<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%@page import="com.agilecrm.activities.util.WebCalendarEventUtil"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.json.JSONArray"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="com.agilecrm.util.NamespaceUtil"%>
<%@page import="java.net.URL"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.user.util.OnlineCalendarUtil"%>
<%@page import="com.agilecrm.user.OnlineCalendarPrefs"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.TreeSet"%>
<%@page import="java.util.LinkedHashSet"%>
<%@page import="java.util.Arrays"%>

<%
String url = request.getRequestURL().toString();
String[] ar=url.split("/");
String scheduleid=ar[ar.length-2];


String slots=null;
String meeting_types=null;
//stores all users requred details to for team calendar
JSONObject map_object=new JSONObject();
JSONObject single_user_map_object=new JSONObject();
		
		
boolean multiple_users=false;
Boolean userAvailable = false;
Boolean emailAvailable = false;


String [] slots_array=null;
List<JSONArray> business_hours_array=new ArrayList<JSONArray>();
List<List<String>> profile_list=new ArrayList<List<String>>();
List<Long>_multiple_users=new ArrayList<Long>();
StringBuilder sb = new StringBuilder();
String loopDelim = ",";


String profile_pic = "/img/gravatar.png";
String user_name = null;
String domain_name=null;
Long user_id = 0L;
Long agile_user_id = 0L;
String meeting_durations=null;
String welcome_title="<p class='lead' style='color: #777;font-size: 19px;font-weight:normal'>Welcome to our scheduling page. Please follow the instructions to book an appointment.</p>";
String personal_calendar_title = null;

URL ur=new URL(url);
String d_name=domain_name= NamespaceUtil.getNamespaceFromURL(ur);
String _AGILE_VERSION = SystemProperty.applicationVersion.get();
int calendar_wk_start_day=0;

//determines weathers single user calendar or tem calendar or single user with limited slots
if(scheduleid.equalsIgnoreCase("calendar")){
    scheduleid=ar[ar.length-1];
}
else{
     slots=ar[ar.length-1];
     slots_array=WebCalendarEventUtil.getSlotsArrayFromUrl(slots);
}

//if schedule id contains , it is team calendar
//if team calendar then we don't consider available meeting slots
if(scheduleid.contains(",")){
    multiple_users=true; slots_array=null;
    List<String> list=WebCalendarEventUtil.removeDuplicateScheduleIds(scheduleid);
 String _multiple_schedule_ids[]=list.toArray(new String[list.size()]);
 for(int i=0;i<=_multiple_schedule_ids.length-1;i++){
     System.out.println(_multiple_schedule_ids[i]+"  schedule id");
     OnlineCalendarPrefs online_prefs=null;
      online_prefs=OnlineCalendarUtil.getOnlineCalendarPrefs(_multiple_schedule_ids[i]);
      if(online_prefs==null)
    	  continue;
	  
	  DomainUser _domain_user= DomainUserUtil.getDomainUser(OnlineCalendarUtil.getDomainUserID(online_prefs));
	    if(_domain_user!=null){
		AgileUser agile_user=AgileUser.getCurrentAgileUserFromDomainUser(_domain_user.id);
		 if(agile_user==null)
		     continue;
		 _multiple_users.add(_domain_user.id);
		
		 map_object.put(String.valueOf(_domain_user.id), WebCalendarEventUtil.createNewJSONFromOnlineCalendarPage(online_prefs,_domain_user,agile_user));
		UserPrefs us_prefs=UserPrefsUtil.getUserPrefs(agile_user);
		
		JSONArray business_hours=new JSONArray(online_prefs.business_hours);
		
		business_hours_array.add(business_hours);
	
		profile_list.add(WebCalendarEventUtil.getProfileListWithValuesForTeamCalednar(business_hours,us_prefs,_domain_user));
	}

		}

		//if multiple schedule ids were given in url but no matching found
		if (_multiple_users.size() == 1)
		{
	      multiple_users = false;
		}

	}

	//will execute for only individual calendars
	if (scheduleid != null && !multiple_users)
	{
		System.out.println(scheduleid + "  --- schedule id if only one user");
		DomainUser domainUser = null;

		OnlineCalendarPrefs online_prefs = OnlineCalendarUtil.getOnlineCalendarPrefs(scheduleid);
		if (_multiple_users.size() == 1 && _multiple_users.size() != 0)
	    domainUser = DomainUserUtil.getDomainUser(_multiple_users.get(0));
		if (domainUser == null)
	     domainUser = DomainUserUtil.getDomainUserFromScheduleId(scheduleid, d_name);
		if (domainUser == null && online_prefs != null)
		{
	     domainUser = DomainUserUtil.getDomainUser(OnlineCalendarUtil.getDomainUserID(online_prefs));
		}

		System.out.println("Domain user " + domainUser);

		if (domainUser != null)
		{
     	userAvailable = true;
	    emailAvailable = true;

	   AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
	  System.out.println("agileUser " + agileUser);
	   if (agileUser == null)
	   {
		out.print("Sorry, user is not enrolled with Agile CRM.");
		return;
	   }

	UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
	System.out.println("userPrefs " + userPrefs.pic);
	profile_pic = userPrefs.pic;
	user_name = domainUser.name;
	user_id = domainUser.id;
	agile_user_id = agileUser.id;
	domain_name = domainUser.domain;
	calendar_wk_start_day = Integer.parseInt(userPrefs.calendar_wk_start_day);
	if (online_prefs == null)
	{
		meeting_durations = domainUser.meeting_durations;
		meeting_types = domainUser.meeting_types;
	}
	else if (online_prefs != null)
	{
		meeting_durations = online_prefs.meeting_durations;
		meeting_types = online_prefs.meeting_types;
		welcome_title= online_prefs.user_calendar_title;
		personal_calendar_title = welcome_title ; 
	     if(StringUtils.isNotBlank(welcome_title)&&!welcome_title.contains("</p>")){
	    	welcome_title="<p class='lead' style='color: #777;font-size: 19px;font-weight:normal'>"+welcome_title+"</p>";
	     }
		single_user_map_object.put("buffer_time", WebCalendarEventUtil.convertHoursToMilliSeconds(
				online_prefs.bufferTime, online_prefs.bufferTimeUnit));
	}
	single_user_map_object.put(String.valueOf(user_id),
			WebCalendarEventUtil.getSlotDetails(null, meeting_durations));

	if (StringUtils.isEmpty(userPrefs.pic))
		profile_pic = "/img/gravatar.png";
		}
	}
	else if (_multiple_users.size() > 0)
	{
		userAvailable = true;
		emailAvailable = true;

	}

	ObjectMapper mapper = new ObjectMapper();
%>
<!DOCTYPE html>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
 <%@ page contentType="text/html; charset=UTF-8" %>
<html>
<head>
<% 
if(multiple_users) { 
 %>
<title>Online Appointment Scheduling - <%=scheduleid %></title>
<%
} else {
 %>
<title>Online Appointment Scheduling - <%=user_name %></title>
<%
} 
%>
<link rel="stylesheet" href="../../flatfull/css/web-calendar-event/bootstrap.min.css">
<link rel="stylesheet" href="../../flatfull/css/web-calendar-event/style.css">
<link rel="stylesheet" type="text/css" href="../../flatfull/css/agile-css-framework.css">
<!-- <link rel="stylesheet" href="../../flatfull/css/web-calendar-event/font-awesome.min.css"> -->
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js" ></script>
<script type="text/javascript" src="../../flatfull/lib/web-calendar-event/jquery.js"></script>
<script type="text/javascript" src="../../flatfull/lib/jquery.validate.min.js"></script>
<script type="text/javascript" src="../../flatfull/lib/date-formatter.js"></script>
<script type="text/javascript" src="../../flatfull/lib/web-calendar-event/moment.min.js"></script>
<script type="text/javascript" src="../../flatfull/lib/web-calendar-event/moment.timezone.min.js"></script>

<link rel="stylesheet" href="../..//flatfull/css/web-calendar-event/datepicker.css"
	type="text/css" />
<script type="text/javascript"
	src="../../lib/web-calendar-event/datepicker.js"></script>
<script type="text/javascript" src="../../flatfull/lib/web-calendar-event/eye.js"></script>
<script type="text/javascript" src="../../flatfull/lib/web-calendar-event/utils.js"></script>
<script type="text/javascript"
	src="../../flatfull/lib/web-calendar-event/layout.js?ver=1.0.2"></script>
<script type="text/javascript" src="../../flatfull/jscore/web-calendar-event/time.js"></script>
<script type="text/javascript" src="../../flatfull/jscore/web-calendar-event/util.js"></script>
<script type="text/javascript" src="../../flatfull/jscore/web-calendar-event/ui.js"></script>
</head>

<body onload="bodyLoad();">
	<div id="mainwrap" class="container">	
	 <% if(userAvailable == true && emailAvailable == true)
       {
	     if(multiple_users!=true){
	         if(personal_calendar_title == null)
	              personal_calendar_title = "Welcome to my scheduling page. Please follow the instructions to book an appointment.";
     %>
	
		<img src="<%=profile_pic%>" id="avatar" class="thumbnail" title="<%=personal_calendar_title%>"/>
		<div class="text-center"><%=welcome_title%></div>
<%}else{ %>
<p class="lead" style="color: #777;font-size: 19px;text-align: center;font-weight:normal"> Welcome to our scheduling page. Please follow the instructions to book an appointment.</p>
			<div class="col-sm-10 segment segment0">
			<div class="numberlt" id="users_div">1</div>
			<div class="event-title">Select a Person</div>
			<div class="row user_avatars hide">
		
			<!-- <div align="center" style="margin: 5px auto;width: 100%;"> -->
			<% 
			List<String> list=WebCalendarEventUtil.removeDuplicateScheduleIds(scheduleid);
            String _multiple_schedule_ids[]=list.toArray(new String[list.size()]);
			for(int k=0;k<=profile_list.size()-1;k++){
				 System.out.println(_multiple_schedule_ids[k]+"  schedule id");
                 OnlineCalendarPrefs online_prefs=null;
                 online_prefs=OnlineCalendarUtil.getOnlineCalendarPrefs(_multiple_schedule_ids[k]);
				 List<String> pro_pic=profile_list.get(k);
				 String pr_pic=pro_pic.get(0);
				 String pr_name=pro_pic.get(1);
				 String workHours=pro_pic.get(2);
				 String timezone=pro_pic.get(3);
				 String domain_user_id=pro_pic.get(4); 
				 String custom_message = online_prefs.user_calendar_title;
				 if(custom_message == null)
					 custom_message = "Welcome to my scheduling page.Please follow the instructions to book an appointment.";
		   %>
		   <div class="fluidClass col-xs-12 text-center">
		   <div style="display: inline-block;width: 150px;margin-right: 5px;">
		   <img src="<%=pr_pic%>" id="multi-user-avatar" class="thumbnail" style="cursor:pointer;" data="<%=domain_user_id%>"  title="<%=pr_name%>"/>
		<span id="user_name" style="display:block;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;width: 100%;font-size:16px;" title="<%=custom_message %>"><%=pr_name %>&nbsp;&nbsp;&nbsp;</span>
		<span id="workhours-<%= domain_user_id%>" style="display:none;color:#8E8F8F;font-size:16px;" title="Working Hours"><%="<script>document.write(getTimeInVisitorTimezoneWhileLoading('"+workHours+"','"+timezone+"'));</script>"%></span>
		<span class="user_in_visitor_timezone" style="color:#8E8F8F;font-size:16px;" title="Timezone"><%="<script>document.write(getVisitorWhileLoading());</script>"%></span>
		<span id="timezone-<%= domain_user_id%>" style="display:none;color:#8E8F8F;font-size:16px;" title="Timezone"><%=timezone %></span>
		</div>
		</div>
		
		<%} %>
		
		</div>

		</div>
<%} %>
		<div class="col-sm-10 segment segment1 blockdiv" >
			<div class="numberlt" id="one">1</div>
			<div class="event-title">Choose a Time Slot</div>

		</div>

		<form action="" id="addEventForm" name="addEventForm" method="post">
			<fieldset>
				
				<div class="col-sm-10 segment segment2 me-disable "
					style="display: table;display:none">
					<div class="numberlt" id="two">2</div>
					<div class="event-title" style="margin-bottom:7px;">
						<span class="pull-left">Select Date and Time</span> <span class="timezone"><span
							class="timezone1" title="Timezone">  </span><span id="hidetimezone" class="hide"> <select name="user_timezone" class="form-control" id="user_timezone">
                                                             <optgroup label="US/Canada">
								<option value="US/Arizona"> US/Arizona</option>
								<option value="US/Alaska"> US/Alaska</option>
								<option value="US/Pacific"> US/Pacific</option>
								<option value="US/Central"> US/Central</option>
								<option value="US/Eastern"> US/Eastern</option>
								<option value="US/Hawaii"> US/Hawaii</option>
								<option value="US/Mountain"> US/Mountain</option>
								
								<option value="Canada/Atlantic">
									Canada/Atlantic</option>
								<option value="Canada/Central">
									Canada/Central</option>

								<option value="Canada/Eastern">
									Canada/Eastern</option>
								<option value="Canada/Mountain">
									Canada/Mountain</option>
								<option value="Canada/Newfoundland">
									Canada/Newfoundland</option>
								<option value="Canada/Pacific">
									Canada/Pacific</option>
									<option value="" disabled></option>
                                                            </optgroup>

                                                            <optgroup label="America">
                                                                
								<option value="America/Adak"> America/Adak</option>
								<option value="America/Anchorage">
									America/Anchorage</option>
								<option value="America/Atikokan">
									America/Atikokan</option>
								<option value="America/Anguilla">
									America/Anguilla</option>
								<option value="America/Antigua">
									America/Antigua</option>
								<option value="America/Aruba"> America/Aruba</option>
								<option value="America/Araguaina">
									America/Araguaina</option>
								<option value="America/Argentina/Buenos_Aires">
									America/Argentina/Buenos Aires</option>
								<option value="America/Argentina/Catamarca">
									America/Argentina/Catamarca</option>
								<option value="America/Argentina/Cordoba">
									America/Argentina/Cordoba</option>
								<option value="America/Argentina/Jujuy">
									America/Argentina/Jujuy</option>
								<option value="America/Argentina/La_Rioja">
									America/Argentina/La Rioja</option>
								<option value="America/Argentina/Mendoza">
									America/Argentina/Mendoza</option>
								<option value="America/Argentina/Rio_Gallegos">
									America/Argentina/Rio Gallegos</option>
								<option value="America/Argentina/Salta">
									America/Argentina/Salta</option>
								<option value="America/Argentina/San_Juan">
									America/Argentina/San Juan</option>
								<option value="America/Argentina/San_Luis">
									America/Argentina/San Luis</option>
								<option value="America/Argentina/Tucuman">
									America/Argentina/Tucuman</option>
								<option value="America/Argentina/Ushuaia">
									America/Argentina/Ushuaia</option>
								<option value="America/Asuncion">
									America/Asuncion</option>
								<option value="America/Boise"> America/Boise</option>
								<option value="America/Bogota">
									America/Bogota</option>
								<option value="America/Bahia_Banderas">
									America/Bahia Banderas</option>
								<option value="America/Belize">
									America/Belize</option>
								<option value="America/Barbados">
									America/Barbados</option>
								<option value="America/Blanc-Sablon">
									America/Blanc-Sablon</option>
								<option value="America/Boa_Vista">
									America/Boa Vista</option>
								<option value="America/Bahia"> America/Bahia</option>
								<option value="America/Belem"> America/Belem</option>
								<option value="America/Cancun">
									America/Cancun</option>
								<option value="America/Chicago">
									America/Chicago</option>
								<option value="America/Costa_Rica">
									America/Costa Rica</option>
								<option value="America/Cambridge_Bay">America/Cambridge
									Bay</option>
								<option value="America/Chihuahua">
									America/Chihuahua</option>
								<option value="America/Creston">
									America/Creston</option>
								<option value="America/Cayman">
									America/Cayman</option>
								<option value="America/Caracas">
									America/Caracas</option>
								<option value="America/Curacao">
									America/Curacao</option>
								<option value="America/Campo_Grande">
									America/Campo Grande</option>
								<option value="America/Cayenne">
									America/Cayenne</option>
								<option value="America/Cuiaba">
									America/Cuiaba</option>
								<option value="America/Dawson_Creek">
									America/Dawson Creek</option>
								<option value="America/Dawson">
									America/Dawson</option>
								<option value="America/Denver">
									America/Denver</option>
								<option value="America/Detroit">
									America/Detroit</option>
								<option value="America/Dominica">
									America/Dominica</option>
								<option value="America/Danmarkshavn">
									America/Danmarkshavn</option>
								<option value="America/Edmonton">
									America/Edmonton</option>
								<option value="America/El_Salvador">
									America/El Salvador</option>
								<option value="America/Eirunepe">
									America/Eirunepe</option>
								<option value="America/Fortaleza">
									America/Fortaleza</option>
								<option value="America/Guatemala">
									America/Guatemala</option>
								<option value="America/Grand_Turk">
									America/Grand Turk</option>
								<option value="America/Guayaquil">
									America/Guayaquil</option>
								<option value="America/Glace_Bay">
									America/Glace Bay</option>
								<option value="America/Goose_Bay">
									America/Goose Bay</option>
								<option value="America/Grenada">
									America/Grenada</option>
								<option value="America/Guadeloupe">
									America/Guadeloupe</option>
								<option value="America/Guyana">
									America/Guyana</option>
								<option value="America/Godthab">
									America/Godthab</option>
								<option value="America/Hermosillo">
									America/Hermosillo</option>
								<option value="America/Havana">
									America/Havana</option>
								<option value="America/Halifax">
									America/Halifax</option>
								<option value="America/Inuvik">
									America/Inuvik</option>
								<option value="America/Indiana/Knox">
									America/Indiana/Knox</option>
								<option value="America/Indiana/Tell_City">
									America/Indiana/Tell City</option>
								<option value="America/Indiana/Indianapolis">
									America/Indiana/Indianapolis</option>
								<option value="America/Indiana/Marengo">
									America/Indiana/Marengo</option>
								<option value="America/Indiana/Petersburg">
									America/Indiana/Petersburg</option>
								<option value="America/Indiana/Vevay">
									America/Indiana/Vevay</option>
								<option value="America/Indiana/Vincennes">
									America/Indiana/Vincennes</option>
								<option value="America/Indiana/Winamac">
									America/Indiana/Winamac</option>
								<option value="America/Iqaluit">
									America/Iqaluit</option>
								<option value="America/Juneau">
									America/Juneau</option>
								<option value="America/Jamaica">
									America/Jamaica</option>
								<option value="America/Kentucky/Louisville">
									America/Kentucky/Louisville</option>
								<option value="America/Kentucky/Monticello">
									America/Kentucky/Monticello</option>
								<option value="America/Kralendijk">
									America/Kralendijk</option>
								<option value="America/Los_Angeles">
									America/Los Angeles</option>
								<option value="America/Lima"> America/Lima</option>
								<option value="America/La_Paz"> America/La
									Paz</option>
								<option value="America/Lower_Princes">
									America/Lower Princes</option>
								<option value="America/Metlakatla">
									America/Metlakatla</option>
								<option value="America/Mazatlan">
									America/Mazatlan</option>
								<option value="America/Managua">
									America/Managua</option>
								<option value="America/Matamoros">
									America/Matamoros</option>
								<option value="America/Menominee">
									America/Menominee</option>
								<option value="America/Merida">
									America/Merida</option>
								<option value="America/Mexico_City">
									America/Mexico City</option>
								<option value="America/Monterrey">
									America/Monterrey</option>
								<option value="America/Montreal">
									America/Montreal</option>
								<option value="America/Maceio">
									America/Maceio</option>
								<option value="America/Miquelon">
									America/Miquelon</option>
								<option value="America/Manaus">
									America/Manaus</option>
								<option value="America/Marigot">
									America/Marigot</option>
								<option value="America/Martinique">
									America/Martinique</option>
								<option value="America/Moncton">
									America/Moncton</option>
								<option value="America/Montserrat">
									America/Montserrat</option>
								<option value="America/Montevideo">
									America/Montevideo</option>
								<option value="America/Nome"> America/Nome</option>
								<option value="America/Noronha">
									America/Noronha</option>
								<option value="America/North_Dakota/Beulah">
									America/North Dakota/Beulah</option>
								<option value="America/North_Dakota/Center">
									America/North Dakota/Center</option>
								<option value="America/North_Dakota/New_Salem">
									America/North Dakota/New Salem</option>
								<option value="America/Nassau">
									America/Nassau</option>
								<option value="America/New_York"> America/New
									York</option>
								<option value="America/Nipigon">
									America/Nipigon</option>
								<option value="America/Ojinaga">
									America/Ojinaga</option>
								<option value="America/Phoenix">
									America/Phoenix</option>
								<option value="America/Panama">
									America/Panama</option>
								<option value="America/Pangnirtung">
									America/Pangnirtung</option>
								<option value="America/Port-au-Prince">
									America/Port-au-Prince</option>
								<option value="America/Port_of_Spain">
									America/Port of Spain</option>
								<option value="America/Porto_Velho">
									America/Porto Velho</option>
								<option value="America/Paramaribo">
									America/Paramaribo</option>
								<option value="America/Puerto_Rico">
									America/Puerto Rico</option>
								<option value="America/Rainy_River">
									America/Rainy River</option>
								<option value="America/Rankin_Inlet">
									America/Rankin Inlet</option>
								<option value="America/Regina">
									America/Regina</option>
								<option value="America/Resolute">
									America/Resolute</option>
								<option value="America/Rio_Branco">
									America/Rio Branco</option>

								<option value="America/Recife">
									America/Recife</option>

								<option value="America/Sitka"> America/Sitka</option>
								<option value="America/Santa_Isabel">
									America/Santa Isabel</option>
								<option value="America/Shiprock">
									America/Shiprock</option>
								<option value="America/Swift_Current">
									America/Swift Current</option>
								<option value="America/Santarem">
									America/Santarem</option>
								<option value="America/Santiago">
									America/Santiago</option>
								<option value="America/Santo_Domingo">
									America/Santo Domingo</option>
								<option value="America/St_Barthelemy">
									America/St Barthelemy</option>
								<option value="America/St_Kitts"> America/St
									Kitts</option>
								<option value="America/St_Lucia"> America/St
									Lucia</option>
								<option value="America/St_Thomas"> America/St
									Thomas</option>
								<option value="America/St_Vincent">
									America/St Vincent</option>
								<option value="America/St_Johns"> America/St
									Johns</option>
								<option value="Atlantic/Stanley">
									Atlantic/Stanley</option>
								<option value="America/Sao_Paulo">
									America/Sao Paulo</option>
								<option value="America/Scoresbysund">
									America/Scoresbysund</option>
								<option value="America/Tijuana">
									America/Tijuana</option>
								<option value="America/Tegucigalpa">
									America/Tegucigalpa</option>
								<option value="America/Thunder_Bay">
									America/Thunder Bay</option>
								<option value="America/Toronto">
									America/Toronto</option>
								<option value="America/Thule"> America/Thule</option>
								<option value="America/Tortola">
									America/Tortola</option>
								<option value="America/Vancouver">
									America/Vancouver</option>
								<option value="America/Yakutat">
									America/Yakutat</option>

								<option value="America/Yellowknife">
									America/Yellowknife</option>
								<option value="America/Whitehorse">
									America/Whitehorse</option>
								<option value="America/Winnipeg">
									America/Winnipeg</option>
									<option value="" disabled></option>
                                                               </optgroup>
                         
                                                                <optgroup label="Asia">
                                                                
								<option value="Asia/Aden"> Asia/Aden</option>
								<option value="Asia/Amman"> Asia/Amman</option>
								<option value="Asia/Aqtau"> Asia/Aqtau</option>
								<option value="Asia/Aqtobe"> Asia/Aqtobe</option>
								<option value="Asia/Ashgabat"> Asia/Ashgabat</option>
								<option value="Asia/Almaty"> Asia/Almaty</option>
								<option value="Asia/Anadyr"> Asia/Anadyr</option>
								<option value="Asia/Baghdad"> Asia/Baghdad</option>
								<option value="Asia/Bahrain"> Asia/Bahrain</option>
								<option value="Asia/Beirut"> Asia/Beirut</option>
								<option value="Asia/Baku"> Asia/Baku</option>
								<option value="Asia/Bishkek"> Asia/Bishkek</option>
								<option value="Asia/Bangkok"> Asia/Bangkok</option>


								<option value="Asia/Brunei"> Asia/Brunei</option>

								<option value="Asia/Colombo"> Asia/Colombo</option>
								<option value="Asia/Choibalsan">
									Asia/Choibalsan</option>
								<option value="Asia/Chongqing">
									Asia/Chongqing</option>
								<option value="Asia/Damascus"> Asia/Damascus</option>
								<option value="Asia/Dubai"> Asia/Dubai</option>
								<option value="Asia/Dushanbe"> Asia/Dushanbe</option>
								<option value="Asia/Dhaka"> Asia/Dhaka</option>
								<option value="Asia/Dili"> Asia/Dili</option>


								<option value="Asia/Gaza"> Asia/Gaza</option>
								<option value="Asia/Hebron"> Asia/Hebron</option>
								<option value="Asia/Hovd"> Asia/Hovd</option>
								<option value="Asia/Ho_Chi_Minh"> Asia/Ho Chi
									Minh</option>
								<option value="Asia/Harbin"> Asia/Harbin</option>
								<option value="Asia/Hong_Kong"> Asia/Hong
									Kong</option>

								<option value="Asia/Irkutsk"> Asia/Irkutsk</option>

								<option value="Asia/Jerusalem">
									Asia/Jerusalem</option>
								<option value="Asia/Jakarta"> Asia/Jakarta</option>
								<option value="Asia/Jayapura"> Asia/Jayapura</option>
								<option value="Asia/Kuwait"> Asia/Kuwait</option>
								<option value="Asia/Kabul"> Asia/Kabul</option>
								<option value="Asia/Karachi"> Asia/Karachi</option>
								<option value="Asia/Kolkata"> Asia/Kolkata</option>
								<option value="Asia/Kathmandu">
									Asia/Kathmandu</option>
								<option value="Asia/Khandyga"> Asia/Khandyga</option>
								<option value="Asia/Kashgar"> Asia/Kashgar</option>
								<option value="Asia/Krasnoyarsk">
									Asia/Krasnoyarsk</option>
								<option value="Asia/Kuala_Lumpur"> Asia/Kuala
									Lumpur</option>
								<option value="Asia/Kuching"> Asia/Kuching</option>
								<option value="Asia/Kamchatka">
									Asia/Kamchatka</option>
								<option value="Asia/Muscat"> Asia/Muscat</option>
								<option value="Asia/Macau"> Asia/Macau</option>
								<option value="Asia/Makassar"> Asia/Makassar</option>
								<option value="Asia/Manila"> Asia/Manila</option>
								<option value="Asia/Magadan"> Asia/Magadan</option>
								<option value="Asia/Nicosia"> Asia/Nicosia</option>
								<option value="Asia/Novokuznetsk">
									Asia/Novokuznetsk</option>
								<option value="Asia/Novosibirsk">
									Asia/Novosibirsk</option>


								<option value="Asia/Oral"> Asia/Oral</option>
								<option value="Asia/Omsk"> Asia/Omsk</option>
								<option value="Asia/Phnom_Penh"> Asia/Phnom
									Penh</option>
								<option value="Asia/Pontianak">
									Asia/Pontianak</option>
								<option value="Asia/Pyongyang">
									Asia/Pyongyang</option>
								<option value="Asia/Qatar"> Asia/Qatar</option>
								<option value="Asia/Qyzylorda">
									Asia/Qyzylorda</option>
								<option value="Asia/Riyadh"> Asia/Riyadh</option>
								<option value="Asia/Rangoon"> Asia/Rangoon</option>
								<option value="Asia/Samarkand">
									Asia/Samarkand</option>
								<option value="Asia/Shanghai"> Asia/Shanghai</option>
								<option value="Asia/Singapore">
									Asia/Singapore</option>
								<option value="Asia/Seoul"> Asia/Seoul</option>
								<option value="Asia/Sakhalin"> Asia/Sakhalin</option>
								<option value="Asia/Tashkent"> Asia/Tashkent</option>
								<option value="Asia/Tokyo"> Asia/Tokyo</option>
								<option value="Asia/Taipei"> Asia/Taipei</option>

								<option value="Asia/Tbilisi"> Asia/Tbilisi</option>
								<option value="Asia/Tehran"> Asia/Tehran</option>
								<option value="Asia/Thimphu"> Asia/Thimphu</option>
								<option value="Asia/Ulaanbaatar">
									Asia/Ulaanbaatar</option>
								<option value="Asia/Urumqi"> Asia/Urumqi</option>
								<option value="Asia/Ust-Nera"> Asia/Ust-Nera</option>
								<option value="Asia/Vientiane">
									Asia/Vientiane</option>
								<option value="Asia/Vladivostok">
									Asia/Vladivostok</option>

								<option value="Asia/Yerevan"> Asia/Yerevan</option>
								<option value="Asia/Yekaterinburg">
									Asia/Yekaterinburg</option>
								<option value="Asia/Yakutsk"> Asia/Yakutsk</option>
								<option value="" disabled></option>
                                                                </optgroup>


                                                                 <optgroup label="Australia">
                                                                
								<option value="Australia/Adelaide">
									Australia/Adelaide</option>
								<option value="Australia/Broken_Hill">
									Australia/Broken Hill</option>
								<option value="Australia/Brisbane">
									Australia/Brisbane</option>
								<option value="Australia/Currie">
									Australia/Currie</option>
								<option value="Australia/Darwin">
									Australia/Darwin</option>
								<option value="Australia/Eucla">
									Australia/Eucla</option>
								<option value="Australia/Hobart">
									Australia/Hobart</option>
								<option value="Australia/Lindeman">
									Australia/Lindeman</option>
								<option value="Australia/Lord_Howe">
									Australia/Lord Howe</option>
								<option value="Australia/Melbourne">
									Australia/Melbourne</option>
								<option value="Australia/Perth">
									Australia/Perth</option>
								<option value="Australia/Sydney">
									Australia/Sydney</option>
									<option value="" disabled></option>
                                                                 </optgroup>

							      <optgroup label="Africa"> 
                                                               
                                                               <option value="Africa/Abidjan">Africa/Abidjan</option>
								<option value="Africa/Accra"> Africa/Accra</option>
								<option value="Africa/Algiers">
									Africa/Algiers</option>
								<option value="Africa/Addis_Ababa">
									Africa/Addis Ababa</option>
								<option value="Africa/Asmara"> Africa/Asmara</option>
								<option value="Africa/Bamako"> Africa/Bamako</option>
								<option value="Africa/Banjul"> Africa/Banjul</option>
								<option value="Africa/Bissau"> Africa/Bissau</option>
								<option value="Africa/Bangui"> Africa/Bangui</option>
								<option value="Africa/Brazzaville">
									Africa/Brazzaville</option>
								<option value="Africa/Blantyre">
									Africa/Blantyre</option>
								<option value="Africa/Bujumbura">
									Africa/Bujumbura</option>

								<option value="Africa/Conakry">
									Africa/Conakry</option>
								<option value="Africa/Casablanca">
									Africa/Casablanca</option>
								<option value="Africa/Cairo"> Africa/Cairo</option>
								<option value="Africa/Ceuta"> Africa/Ceuta</option>
								<option value="Africa/Dakar"> Africa/Dakar</option>
								<option value="Africa/Douala"> Africa/Douala</option>
								<option value="Africa/Dar_es_Salaam">
									Africa/Dar es Salaam</option>
								<option value="Africa/Djibouti">
									Africa/Djibouti</option>

								<option value="Africa/El_Aaiun"> Africa/El
									Aaiun</option>
								<option value="Africa/Freetown">
									Africa/Freetown</option>
								<option value="Africa/Gaborone">
									Africa/Gaborone</option>
								<option value="Africa/Harare"> Africa/Harare</option>
								<option value="Africa/Johannesburg">
									Africa/Johannesburg</option>
								<option value="Africa/Juba"> Africa/Juba</option>
								<option value="Africa/Kinshasa">
									Africa/Kinshasa</option>
								<option value="Africa/Kigali"> Africa/Kigali</option>
								<option value="Africa/Kampala">
									Africa/Kampala</option>
								<option value="Africa/Khartoum">
									Africa/Khartoum</option>
								<option value="Africa/Lome"> Africa/Lome</option>
								<option value="Africa/Lagos"> Africa/Lagos</option>
								<option value="Africa/Libreville">
									Africa/Libreville</option>
								<option value="Africa/Luanda"> Africa/Luanda</option>
								<option value="Africa/Lubumbashi">
									Africa/Lubumbashi</option>
								<option value="Africa/Lusaka"> Africa/Lusaka</option>

								<option value="Africa/Monrovia">
									Africa/Monrovia</option>
								<option value="Africa/Maputo"> Africa/Maputo</option>
								<option value="Africa/Maseru"> Africa/Maseru</option>
								<option value="Africa/Mbabane">
									Africa/Mbabane</option>
								<option value="Africa/Malabo"> Africa/Malabo</option>
								<option value="Africa/Mogadishu">
									Africa/Mogadishu</option>

								<option value="Africa/Nouakchott">
									Africa/Nouakchott</option>
								<option value="Africa/Ndjamena">
									Africa/Ndjamena</option>
								<option value="Africa/Niamey"> Africa/Niamey</option>
								<option value="Africa/Nairobi">
									Africa/Nairobi</option>
								<option value="Africa/Ouagadougou">
									Africa/Ouagadougou</option>
								<option value="Africa/Porto-Novo">
									Africa/Porto-Novo</option>
								<option value="Africa/Sao_Tome"> Africa/Sao
									Tome</option>
								<option value="Africa/Tunis"> Africa/Tunis</option>
								<option value="Africa/Tripoli">
									Africa/Tripoli</option>
								<option value="Africa/Windhoek">
									Africa/Windhoek</option>
									<option value="" disabled></option>
                                                                </optgroup>

                                                          
                                                                <optgroup label="Antarctica">
                                                                 
								<option value="Antarctica/Davis">
									Antarctica/Davis</option>
								<option value="Antarctica/DumontDUrville">
									Antarctica/DumontDUrville</option>

								<option value="Antarctica/Mawson">Antarctica/Mawson</option>
								<option value="Antarctica/Macquarie">
									Antarctica/Macquarie</option>
								<option value="Antarctica/McMurdo">
									Antarctica/McMurdo</option>
								<option value="Antarctica/Palmer">
									Antarctica/Palmer</option>
								<option value="Antarctica/Rothera">
									Antarctica/Rothera</option>
								<option value="Antarctica/Syowa">
									Antarctica/Syowa</option>
								<option value="Antarctica/South_Pole">
									Antarctica/South Pole</option>
								<option value="Antarctica/Vostok">
									Antarctica/Vostok</option>
                                                                <option value="Antarctica/Casey">
									Antarctica/Casey</option>
                                                                <option value="Antarctica/Palmer">
									Antarctica/Palmer</option>
								<option value="Antarctica/Rothera">
									Antarctica/Rothera</option>
									<option value="" disabled></option>
                                                                </optgroup>
                                                           

                                                                <optgroup label="Atlantic">
                                                                 
								<option value="Atlantic/Azores">
									Atlantic/Azores</option>
								<option value="Atlantic/Bermuda">
									Atlantic/Bermuda</option>
								<option value="Atlantic/Cape_Verde">
									Atlantic/Cape Verde</option>
								<option value="Atlantic/Canary">
									Atlantic/Canary</option>
								<option value="Atlantic/Faroe">
									Atlantic/Faroe</option>
								<option value="Arctic/Longyearbyen">
									Arctic/Longyearbyen</option>
								<option value="Atlantic/Madeira">
									Atlantic/Madeira</option>
								<option value="Atlantic/Reykjavik">
									Atlantic/Reykjavik</option>
								<option value="Atlantic/South_Georgia">
									Atlantic/South Georgia</option>
								<option value="Atlantic/Stanley">
									Atlantic/Stanley</option>

								<option value="Atlantic/St_Helena">
									Atlantic/St Helena</option>
									<option value="" disabled></option>
                                                                </optgroup>

                                                                <optgroup label="Europe">
                                                                 
								<option value="Europe/Amsterdam">
									Europe/Amsterdam</option>
								<option value="Europe/Andorra">
									Europe/Andorra</option>
								<option value="Europe/Athens"> Europe/Athens</option>
								<option value="Europe/Belgrade">
									Europe/Belgrade</option>
								<option value="Europe/Berlin"> Europe/Berlin</option>
								<option value="Europe/Bratislava">
									Europe/Bratislava</option>
								<option value="Europe/Brussels">
									Europe/Brussels</option>
								<option value="Europe/Budapest">
									Europe/Budapest</option>
								<option value="Europe/Busingen">
									Europe/Busingen</option>
								<option value="Europe/Bucharest">
									Europe/Bucharest</option>
								<option value="Europe/Copenhagen">
									Europe/Copenhagen</option>
								<option value="Europe/Chisinau">
									Europe/Chisinau</option>
								<option value="Europe/Dublin"> Europe/Dublin</option>
								<option value="Europe/Guernsey">
									Europe/Guernsey</option>
								<option value="Europe/Gibraltar">
									Europe/Gibraltar</option>
								<option value="Europe/Helsinki">
									Europe/Helsinki</option>

								<option value="Europe/Isle_of_Man">
									Europe/Isle of Man</option>
								<option value="Europe/Istanbul">
									Europe/Istanbul</option>
								<option value="Europe/Jersey"> Europe/Jersey</option>
								<option value="Europe/Kaliningrad">
									Europe/Kaliningrad</option>
								<option value="Europe/Kiev"> Europe/Kiev</option>
								<option value="Europe/Lisbon"> Europe/Lisbon</option>
								<option value="Europe/London"> Europe/London</option>
								<option value="Europe/Ljubljana">
									Europe/Ljubljana</option>
								<option value="Europe/Luxembourg">
									Europe/Luxembourg</option>
								<option value="Europe/Madrid"> Europe/Madrid</option>
								<option value="Europe/Malta"> Europe/Malta</option>
								<option value="Europe/Monaco"> Europe/Monaco</option>
								<option value="Europe/Mariehamn">
									Europe/Mariehamn</option>
								<option value="Europe/Minsk"> Europe/Minsk</option>
								<option value="Europe/Moscow"> Europe/Moscow</option>
								<option value="Europe/Oslo"> Europe/Oslo</option>
								<option value="Europe/Paris"> Europe/Paris</option>
								<option value="Europe/Podgorica">
									Europe/Podgorica</option>
								<option value="Europe/Prague"> Europe/Prague</option>

								<option value="Europe/Rome"> Europe/Rome</option>
								<option value="Europe/Riga"> Europe/Riga</option>
								<option value="Europe/San_Marino"> Europe/San
									Marino</option>
								<option value="Europe/Sarajevo">
									Europe/Sarajevo</option>
								<option value="Europe/Skopje"> Europe/Skopje</option>
								<option value="Europe/Stockholm">
									Europe/Stockholm</option>
								<option value="Europe/Simferopol">
									Europe/Simferopol</option>
								<option value="Europe/Sofia"> Europe/Sofia</option>
								<option value="Europe/Samara"> Europe/Samara</option>

								<option value="Europe/Tirane"> Europe/Tirane</option>
								<option value="Europe/Tallinn">
									Europe/Tallinn</option>
								<option value="Europe/Uzhgorod">
									Europe/Uzhgorod</option>

								<option value="Europe/Vaduz"> Europe/Vaduz</option>
								<option value="Europe/Vatican">
									Europe/Vatican</option>
								<option value="Europe/Vienna"> Europe/Vienna</option>
								<option value="Europe/Vilnius">
									Europe/Vilnius</option>
								<option value="Europe/Volgograd">
									Europe/Volgograd</option>
								<option value="Europe/Warsaw"> Europe/Warsaw</option>
								<option value="Europe/Zaporozhye">
									Europe/Zaporozhye</option>
								<option value="Europe/Zagreb"> Europe/Zagreb</option>
								<option value="Europe/Zurich"> Europe/Zurich</option>
								<option value="" disabled></option>
                                                                </optgroup>

                                                                 <optgroup label="Indian">
                                                                  
								<option value="Indian/Antananarivo">
									Indian/Antananarivo</option>
								<option value="Indian/Comoro"> Indian/Comoro</option>
								<option value="Indian/Chagos"> Indian/Chagos</option>
								<option value="Indian/Cocos"> Indian/Cocos</option>
								<option value="Indian/Christmas">
									Indian/Christmas</option>
								

								<option value="Indian/Kerguelen">
									Indian/Kerguelen</option>
								<option value="Indian/Mayotte">
									Indian/Mayotte</option>
								<option value="Indian/Mahe"> Indian/Mahe</option>
								<option value="Indian/Mauritius">
									Indian/Mauritius</option>
								<option value="Indian/Maldives">
									Indian/Maldives</option>
								<option value="Indian/Reunion">
									Indian/Reunion</option>
									<option value="" disabled></option>
                                                                </optgroup>

                                                                <optgroup label="Pacific">
                                                                 
								<option value="Pacific/Auckland">
									Pacific/Auckland</option>
								<option value="Pacific/Apia"> Pacific/Apia</option>


								<option value="Pacific/Chuuk"> Pacific/Chuuk</option>
								<option value="Pacific/Chatham">
									Pacific/Chatham</option>
								<option value="Pacific/Easter">
									Pacific/Easter</option>
								<option value="Pacific/Efate"> Pacific/Efate</option>
								<option value="Pacific/Enderbury">
									Pacific/Enderbury</option>


								<option value="Pacific/Fiji"> Pacific/Fiji</option>
								<option value="Pacific/Funafuti">
									Pacific/Funafuti</option>
								<option value="Pacific/Fakaofo">
									Pacific/Fakaofo</option>

								<option value="Pacific/Galapagos">
									Pacific/Galapagos</option>
								<option value="Pacific/Gambier">
									Pacific/Gambier</option>
								<option value="Pacific/Guam"> Pacific/Guam</option>
								<option value="Pacific/Guadalcanal">
									Pacific/Guadalcanal</option>
								<option value="Pacific/Honolulu">
									Pacific/Honolulu</option>
								<option value="Pacific/Johnston">
									Pacific/Johnston</option>
								<option value="Pacific/Kosrae">
									Pacific/Kosrae</option>
								<option value="Pacific/Kwajalein">
									Pacific/Kwajalein</option>
								<option value="Pacific/Kiritimati">
									Pacific/Kiritimati</option>




								<option value="Pacific/Marquesas">
									Pacific/Marquesas</option>
								<option value="Pacific/Midway">
									Pacific/Midway</option>
								<option value="Pacific/Majuro">
									Pacific/Majuro</option>
								<option value="Pacific/Niue"> Pacific/Niue</option>


								<option value="Pacific/Noumea">
									Pacific/Noumea</option>
								<option value="Pacific/Norfolk">
									Pacific/Norfolk</option>
								<option value="Pacific/Nauru"> Pacific/Nauru</option>

								<option value="Pacific/Pitcairn">
									Pacific/Pitcairn</option>
								<option value="Pacific/Pago_Pago">
									Pacific/Pago Pago</option>
								<option value="Pacific/Palau"> Pacific/Palau</option>
								<option value="Pacific/Port_Moresby">
									Pacific/Port Moresby</option>
								<option value="Pacific/Pohnpei">
									Pacific/Pohnpei</option>

								<option value="Pacific/Rarotonga">
									Pacific/Rarotonga</option>
								<option value="Pacific/Saipan">
									Pacific/Saipan</option>
								<option value="Pacific/Tahiti">
									Pacific/Tahiti</option>
								<option value="Pacific/Tarawa">
									Pacific/Tarawa</option>
								<option value="Pacific/Tongatapu">
									Pacific/Tongatapu</option>
								<option value="Pacific/Wake"> Pacific/Wake</option>
								<option value="Pacific/Wallis">
									Pacific/Wallis</option>
									<option value="" disabled></option>
                                                                 </optgroup>
                                                                

								<option value="GMT"> GMT</option>
								<option value="UTC"> UTC</option>

							</select></span>
						</span>
						<div class="clearfix"></div>
					</div>
					<div class="col-md-4 col-sm-12 col-xs-12">
						<div id="datepick" style="height:215px;"></div>
					</div>
					<div class="col-md-8 col-sm-12 col-xs-12">
						<p class="availability">Availability on</p>
						<ul class="checkbox-main-grid">

						</ul>
					</div>
					<div class="clearfix"></div>

				</div>
		

				<div class="col-sm-10 segment segment3 me-disable" style="display:none">

					<div class="numberlt" id="three">3</div>
					<div class="event-title" style="margin-bottom:20;margin-top: 5px;">
						Contact Info</div>

					<div class="col-sm-4">
						<input type="text" id="userName" name="userName"
							placeholder="Name" class="required me-disable"
							disabled="disabled" /> <input type="text" id="email"
							name="email" placeholder="Email" class="required me-disable"
							disabled="disabled" /> 
							<%if(StringUtils.isNotEmpty(meeting_types)&& !multiple_users){ %>
							<select class="form-control meetingtypes" style="border: 1px solid #74B9EF;height:37px" title='Meeting Type' name="phoneNumber" id="phoneNumber">
							 <option selected disabled>Meeting Type</option>
	<%String []str=meeting_types.split(",");
	for(int i=0;i<=str.length-1;i++){%>
		<option value=<%=mapper.writeValueAsString(str[i])%>><%=str[i]%></option>
	
	<%}
	%>
	</select><%}else if(multiple_users){
	%>
	<select class="form-control meetingtypes" style="border: 1px solid #74B9EF;height:37px" title='Meeting Type' name="phoneNumber" id="phoneNumber">

	</select><%} %>
	
							
					
						<div class="clearfix"></div>
						<input type="checkbox" id="confirmation" name="confirmation"  checked
							class="me-disable" disabled="disabled" style="margin-top: 10px;" /> <label
							style="margin-top: 7px;" for="confirmation" >Send me a confirmation email</label>
					</div>

					<div class="col-sm-8">
						<textarea class="inputtext me-disable" rows="7" cols="90"
							id="notes" name="notes" placeholder="Notes (Phone number/Skype details)" disabled="disabled"></textarea>
					</div>
					<div class="clearfix"></div>
				</div>

			</fieldset>
<div align="center" style="margin:0 auto;width:105px;">
			<input type="submit" value="Confirm" id="confirm" class="me-disable" style="display:none"
				disabled="disabled" />
				</div>
		</form>
		 <% }else  		   
		     out.print("Sorry. This is an invalid scheduling URL");  
		 %> 
	</div>

<script>
var User_Name = <%=mapper.writeValueAsString(user_name)%>;
var User_Id = <%=user_id%>;
var Agile_User_Id = <%=agile_user_id%>;
var CALENDAR_WEEK_START_DAY=<%=calendar_wk_start_day%>
var selecteddate="";
var SELECTED_TIMEZONE="";
var current_date_mozilla="";
var SELECTED_DOMAIN_USER="";
var domainname=<%=mapper.writeValueAsString(domain_name)%>;
var meeting_duration=<%=mapper.writeValueAsString(meeting_durations)%>;
var slot_array=<%=mapper.writeValueAsString(slots_array)%>;
var multi_user_ids=<%=mapper.writeValueAsString(_multiple_users)%>;
var mapobject=<%=map_object%>;
var business_hours_array=<%=business_hours_array%>;
var multiple_schedule_ids=<%=multiple_users%>;
var meeting_types=[];
var slot_details=[];
var single_user_mapobject=<%=single_user_map_object%>;
var CURRENT_DAY_OPERATION=null;
var MEETING_DURATION_AND_NAMES=null;
 </script>

	<script type="text/javascript">
		// Default selected slot is 60min
		var Selected_Time = null;

		// Default selected date will be current date
		var Selected_Date = null;		

		$(document).ready(
				function()
				{
					if(User_Id == 0 && !multiple_schedule_ids )
						return;
					if(multiple_schedule_ids){
						if(multi_user_ids.length <= 3)
						$(".fluidClass").addClass("col-sm-"+parseInt(12/multi_user_ids.length));
						else{
							$(".fluidClass").addClass("col-sm-4");
						}
						$(".user_avatars").removeClass("hide");
				}
					// Get current date
					var newDate = new Date();
					var currMonth = (newDate.getMonth() + 1);
					if (currMonth < 10)
						currMonth = "0" + currMonth;
					var currentDate = newDate.getFullYear() + '-' + currMonth + '-' + newDate.getDate();
					console.log("in doc ready");
					console.log(currentDate);
                 current_date_mozilla=currentDate;
					// Set current date as selected date
					Selected_Date = newDate;
                  var ms=86400000;
					// Initialize date picker
					$('#datepick').DatePicker({ flat : true, date : [
							'2014-07-6', '2016-07-28'
					], current : '' + currentDate, format : 'Y-m-d', calendars : 1,starts: CALENDAR_WEEK_START_DAY, mode : 'single', view : 'days', onRender: function(date) {
						return {
							disabled: (date.valueOf() < Date.now()-ms),
							className: date.valueOf() < Date.now()-ms ? 'datepickerNotInMonth' : false
						}
					},onChange : function(formated, dates)
					{
						CURRENT_DAY_OPERATION=false;
						console.log("In date picker on change");
						console.log(formated + "  " + dates);
						selecteddate=dates;
						// On date change change selected date
						Selected_Date = formated;
						
						$('.user_in_visitor_timezone').html(SELECTED_TIMEZONE);
						updateUserBusinessHoursInVisitorTimezone(dates);
						//setting the date to current_date_mozilla variable becoz it doesn't shppot new date format
						current_date_mozilla=Selected_Date;
					
						// Check user select date
						if ($('.segment2').hasClass('me-disable'))
							return;

						
						// Date change in right column above available slot box
						change_availability_date(dates);
						
						// Add loading img
						$('.checkbox-main-grid').html('<img class="loading-img" src="../../img/21-0.gif" style="width: 40px;margin-left: 216px;"></img>');

						console.log(dates+"      "+Selected_Time);
					
						// Get available slots With new date
						get_slots(dates, Selected_Time);
					} });

					// Setup form validation on the #register-form element
					$('#addEventForm').validate(
							{
								// Specify the validation rules
								rules : { userName : { required : true, minlength : 3 }, email : { required : true, email : true } },

								// Specify the validation error messages
								messages : {
									userName : { required : "Please specify your name", minlength : jQuery.format("At least {0} characters required!") },
									email : { required : "We need your email address to contact you",
										email : "Your email address must be in the format of name@domain.com" } },

								submitHandler : function(form)
								{
									form.submit();
								} });
				});

		function bodyLoad()
		{
			if(User_Id == 0 && !multiple_schedule_ids )
				return;
			
			if(!multiple_schedule_ids){
		          $(".segment1").removeClass("blockdiv");
	            }
			SELECTED_TIMEZONE=jstz.determine().name();
			$(".timezone1").text(SELECTED_TIMEZONE);
			$('#user_timezone').val(SELECTED_TIMEZONE);
			$("#current_local_time").html("Current Time: "+getConvertedTimeFromEpoch(new Date().getTime()/1000) );
			console.log("bodyonlod  : " + Selected_Date);
		
			// Set current date in calendar
			$('#datepick').DatePickerSetDate(Selected_Date, true);

			// Default date in right column above available slot box
			change_availability_date(Selected_Date);

			// Get slot details time n description
			if(!multiple_schedule_ids)
			getSlotDurations();
		}
	</script>
	<script src="//static.getclicky.com/js" type="text/javascript"></script>
<script type="text/javascript">try{ clicky.init(100783726); }catch(e){}</script>
</body>

</html>