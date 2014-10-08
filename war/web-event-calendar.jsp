<%@page import="com.agilecrm.util.NamespaceUtil"%>
<%@page import="java.net.URL"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.AgileUser"%>

<%

String url = request.getRequestURL().toString();
System.out.println(url);
String[] ar=url.split("/");
String scheduleid=ar[ar.length-1];
URL ur=new URL(url);
String d_name=NamespaceUtil.getNamespaceFromURL(ur);
System.out.println(d_name);
System.out.println("====================================domainname from url");

System.out.println(scheduleid);



// Gets User Name

Boolean userAvailable = false;
Boolean emailAvailable = false;
String profile_pic = "/img/gravatar.png";
String user_name = null;
String domain_name=null;
Long user_id = 0L;
Long agile_user_id = 0L;

if (scheduleid != null)
{    
  emailAvailable = true;
 
  //String email = "farah@agilecrm.com";
  System.out.println("my try");
  System.out.println(scheduleid);
  	
  DomainUser domainUser = DomainUserUtil.getDomainUserFromScheduleId(scheduleid,d_name);
  System.out.println("Domain user " + domainUser);
	  
  if(domainUser != null)
	  {
          userAvailable = true;
          
	      AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);
	      System.out.println("agileUser " + agileUser);
	      	
	      UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
	      System.out.println("userPrefs " + userPrefs.pic);

	      profile_pic = userPrefs.pic;
	      user_name = domainUser.name;
	      user_id = domainUser.id;
	      agile_user_id = agileUser.id;
	      domain_name = domainUser.domain;
	      	
	      if(StringUtils.isEmpty(userPrefs.pic))
	          profile_pic  ="/img/gravatar.png";
	  }  
}
    
ObjectMapper mapper = new ObjectMapper();
%>
<!DOCTYPE html>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<html>
<head>
<title>Online Appointment Scheduling - <%=user_name %></title>
<link rel="stylesheet" href="../css/web-calendar-event/bootstrap.min.css">
<link rel="stylesheet" href="../css/web-calendar-event/style.css">

<script type="text/javascript" src="../lib/web-calendar-event/jquery.js"></script>
<script type="text/javascript" src="../lib/jquery.validate.min.js"></script>
<script type="text/javascript" src="../lib/date-formatter.js"></script>


<link rel="stylesheet" href="../css/web-calendar-event/datepicker.css"
	type="text/css" />
<script type="text/javascript"
	src="../lib/web-calendar-event/datepicker.js"></script>
<script type="text/javascript" src="../lib/web-calendar-event/eye.js"></script>
<script type="text/javascript" src="../lib/web-calendar-event/utils.js"></script>
<script type="text/javascript"
	src="../lib/web-calendar-event/layout.js?ver=1.0.2"></script>
<script type="text/javascript" src="../jscore/web-calendar-event/time.js"></script>
<script type="text/javascript" src="../jscore/web-calendar-event/util.js"></script>
<script type="text/javascript" src="../jscore/web-calendar-event/ui.js"></script>
</head>

<body onload="bodyLoad();">
	<div id="mainwrap" class="container">	
	 <% if(userAvailable == true && emailAvailable == true)
       {
     %>
	
		<img src="<%=profile_pic%>" id="avatar" title="<%=user_name%>"/>
		<p class="lead">Welcome to my scheduling page. Please follow the
			instructions to add an event to my calendar.</p>

		<div class="col-sm-10 segment segment1">
			<div class="numberlt">1</div>
			<p class="segmenth">Choose a time slot</p>

		</div>

		<form action="" id="addEventForm" name="addEventForm" method="post">
			<fieldset>
				
				<div class="col-sm-10 segment segment2 me-disable "
					style="display: table;display:none">
					<div class="numberlt">2</div>
					<p class="segmenth">
						Select date and time <span class="timezone"> <span
							class="timezone1">Timezone</span>
						</span>
					</p>
					<div class="col-sm-4">
						<div id="datepick" style="height:215px;"></div>
					</div>
					<div class="col-sm-6" style="width: 65%;">
						<p class="availability">Availability on</p>
						<ul class="checkbox-main-grid">

						</ul>
					</div>
					<div class="clearfix"></div>

				</div>
		

				<div class="col-sm-10 segment segment3 me-disable" style="display:none">
					<div class="numberlt">3</div>
					<p class="segmenth">
						Contact Info</span>
					</p>

					<div class="col-sm-4">
						<input type="text" id="userName" name="userName"
							placeholder="Name" class="required me-disable"
							disabled="disabled" /> <input type="text" id="email"
							name="email" placeholder="Email" class="required me-disable"
							disabled="disabled" /> <input type="text" id="phoneNumber"
							name="phoneNumber" placeholder="Phone #"
							class="me-disable" disabled="disabled" />
						<div class="clearfix"></div>
						<input type="checkbox" id="confirmation" name="confirmation"
							class="me-disable" disabled="disabled" /> <label
							for="confirmation">Send me a confirmation email</label>
					</div>

					<div class="col-sm-8">
						<textarea class="inputtext me-disable" rows="7" cols="90"
							id="notes" name="notes" placeholder="Notes" disabled="disabled"></textarea>
					</div>
				</div>

			</fieldset>

			<input type="submit" value="Confirm" id="confirm" class="me-disable" style="display:none"
				disabled="disabled" />
		</form>
		 <% }else  		   
		     out.print("Sorry, user is not enrolled with Agile CRM.");  
		 %> 
	</div>

<script>
 var User_Name = <%=mapper.writeValueAsString(user_name)%>;
 var User_Id = <%=user_id%>;
 var Agile_User_Id = <%=agile_user_id%>;
 var selecteddate="";
 var current_date_mozilla="";
 var domainname=<%=mapper.writeValueAsString(domain_name)%>;
 </script>

	<script type="text/javascript">
		// Default selected slot is 60min
		var Selected_Time = null;

		// Default selected date will be current date
		var Selected_Date = null;		

		$(document).ready(
				function()
				{
					if(User_Id == 0)
						return;
				
					// Get current date
					var newDate = new Date();
					var currMonth = (newDate.getMonth() + 1);
					if (currMonth < 10)
						currMonth = "0" + currMonth;
					var currentDate = newDate.getFullYear() + '-' + currMonth + '-' + newDate.getDate();
					console.log("in doc ready");
					console.log(currentDate);

					// Set current date as selected date
					Selected_Date = newDate;

					// Initialize date picker
					$('#datepick').DatePicker({ flat : true, date : [
							'2014-07-6', '2016-07-28'
					], current : '' + currentDate, format : 'Y-m-d', calendars : 1, mode : 'single', view : 'days', onChange : function(formated, dates)
					{
						console.log("In date picker on change");
						console.log(formated + "  " + dates);
						selecteddate=dates;
						// On date change change selected date
						Selected_Date = formated;		
						// Check user select date
						if ($('.segment2').hasClass('me-disable'))
							return;

						
						// Date change in right column above available slot box
						change_availability_date(dates);
						
						// Add loading img
						$('.checkbox-main-grid').html('<img class="loading-img" src="../img/21-0.gif" style="width: 40px;margin-left: 216px;"></img>');

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
			if(User_Id == 0)
				return;
			
			console.log("bodyonlod  : " + Selected_Date);

			// Set current date in calendar
			$('#datepick').DatePickerSetDate(Selected_Date, true);

			// Default date in right column above available slot box
			change_availability_date(Selected_Date);

			// Get slot details time n description
			getSlotDurations();
		}
	</script>
</body>

</html>
