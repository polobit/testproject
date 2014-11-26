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
String schedule_prefs=null;
String meeting_durations=null;
String meeting_types=null;

if (scheduleid != null)
{    
  emailAvailable = true;
 
  //String email = "farah@agilecrm.com";
  System.out.println("my try");
  System.out.println(scheduleid);
  	
  DomainUser domainUser = DomainUserUtil.getDomainUserFromScheduleId(scheduleid,d_name);
		  
 //  DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail("jagadeesh@invox.com");
		  
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
	      meeting_durations=domainUser.meeting_durations;
	      meeting_types=domainUser.meeting_types;
	      System.out.println(" meetiing types "+meeting_types);
	      	
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
<!-- <link rel="stylesheet" href="../css/web-calendar-event/font-awesome.min.css"> -->
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">

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
	
		<img src="<%=profile_pic%>" id="avatar" class="thumbnail" title="<%=user_name%>"/>
		<p class="lead" style="color: #777;font-size: 19px;text-align: center;font-weight:normal">Welcome to my scheduling page. Please follow the
			instructions to add an event to my calendar.</p>

		<div class="col-sm-10 segment segment1">
			<div class="numberlt" id="one">1</div>
			<div class="event-title">Choose a Time Slot</div>

		</div>

		<form action="" id="addEventForm" name="addEventForm" method="post">
			<fieldset>
				
				<div class="col-sm-10 segment segment2 me-disable "
					style="display: table;display:none">
					<div class="numberlt" id="two">2</div>
					<div class="event-title" style="margin-bottom:7px;">
						Select Date and Time <span class="timezone"> <span
							class="timezone1">Timezone </span>
						</span>
					</div>
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

					<div class="numberlt" id="three">3</div>
					<div class="event-title" style="margin-bottom:20;margin-top: 5px;">
						Contact Info</div>

					<div class="col-sm-4">
						<input type="text" id="userName" name="userName"
							placeholder="Name" class="required me-disable"
							disabled="disabled" /> <input type="text" id="email"
							name="email" placeholder="Email" class="required me-disable"
							disabled="disabled" /> 
							<%if(StringUtils.isNotEmpty(meeting_types)){ %>
							<select class="form-control meetingtypes" style="border: 1px solid #74B9EF;height:37px" title='Meeting Type' name="phoneNumber" id="phoneNumber">
							 <option selected disabled>Meeting Type</option>
	<%String []str=meeting_types.split(",");
	for(int i=0;i<=str.length-1;i++){%>
		<option value=<%=mapper.writeValueAsString(str[i])%>><%=str[i]%></option>
	
	<%}
	%>
	</select><%}
	%>
	
							
					
						<div class="clearfix"></div>
						<input type="checkbox" id="confirmation" name="confirmation"
							class="me-disable" disabled="disabled" style="margin-top: 10px;" /> <label
							style="margin-top: 7px;" for="confirmation">Send me a confirmation email</label>
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
                 current_date_mozilla=currentDate;
					// Set current date as selected date
					Selected_Date = newDate;
                  var ms=86400000;
					// Initialize date picker
					$('#datepick').DatePicker({ flat : true, date : [
							'2014-07-6', '2016-07-28'
					], current : '' + currentDate, format : 'Y-m-d', calendars : 1, mode : 'single', view : 'days', onRender: function(date) {
						return {
							disabled: (date.valueOf() < Date.now()-ms),
							className: date.valueOf() < Date.now()-ms ? 'datepickerNotInMonth' : false
						}
					},onChange : function(formated, dates)
					{
						console.log("In date picker on change");
						console.log(formated + "  " + dates);
						selecteddate=dates;
						// On date change change selected date
						Selected_Date = formated;
						//setting the date to current_date_mozilla variable becoz it doesn't shppot new date format
						current_date_mozilla=Selected_Date;
					
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
	<script src="//static.getclicky.com/js" type="text/javascript"></script>
<script type="text/javascript">try{ clicky.init(100783726); }catch(e){}</script>
</body>

</html>
