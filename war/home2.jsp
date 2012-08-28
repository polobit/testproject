<!DOCTYPE html>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%@page import="com.google.appengine.api.users.UserServiceFactory"%>
<%@page import="com.google.appengine.api.users.User"%>
<%@page import="com.google.appengine.api.users.UserService"%>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Agile CRM Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>

<!-- Le styles -->
<%
	// Download the template the user likes
	String template = UserPrefs.getCurrentUserPrefs().template;
	// template = "default";
%>
<link href="css/bootstrap-<%=template%>.min.css" rel="stylesheet">

<!--  <link rel="stylesheet" href="css/font-awesome.css">
-->
<link rel='stylesheet' type='text/css' href='css/fullcalendar.css' />
<link rel='stylesheet' type='text/css' href='css/fullcalendar.print.css'
	media='print' />

<style>
body {
	padding-top: 60px;
	//background-color: whitesmoke;
}

.agilecrm-profile-dropdown:hover {
	background: url(../img/menu-sprite.png) no-repeat top left;
	background-position: 0 0;
	width: 34px;
	height: 20px;
	display: block;
}

.agilecrm-profile-dropdown {
	background: url(../img/menu-sprite.png) no-repeat top left;
	background-position: 0 -70px;
	width: 34px;
	height: 20px;
	display: block;
}

.agilecrm-search-box-icon-hover {
	background: url(../img/menu-sprite.png) no-repeat top left;
	background-position: 0 -140px;
	width: 14px;
	height: 14px;
	display: block;
}

.agilecrm-search-box-icon {
	background: url(../img/menu-sprite.png) no-repeat top left;
	background-position: 0 -204px;
	width: 14px;
	height: 14px;
	display: block;
}

.agilecrm-todo-icon-normal:hover {
	background: url(../img/menu-sprite.png) no-repeat top left;
	background-position: 0 -402px;
	width: 17px;
	height: 17px;
	display: block;
}

.agilecrm-todo-icon-normal {
	background: url(../img/menu-sprite.png) no-repeat top left;
	background-position: 0 -469px;
	width: 17px;
	height: 17px;
	display: block;
}

#widgets ul
{
list-style:none;
}

table
{
background-color:white;
}


.border-rect
{
border: 2px solid #e0e0e0; 
padding: 10px 15px 15px;
background:white;
}

.bottom-line
{
padding-bottom: 9px; 
border-bottom: 1px solid whiteSmoke;
}

#tags > h3
{
padding-bottom: 9px; 
border-bottom: 4px solid whiteSmoke;
}

.tag-element
{
padding: 10px 0px; 
border-bottom: 2px solid whiteSmoke;	
}

.tag-key
{
display:inline;
padding-right:5px;
color:gray;
}

.tag-values
{
display:inline;
/*float:right;*/
}

.underline
{
border-bottom: 1px solid whiteSmoke;
padding-bottom: 4px; 
}

.right
{
float:right;
}

.spacelr
{
padding-right:5px;
padding-left:5px;
}

.rating {
  unicode-bidi: bidi-override;
  direction: rtl;
 
}

 .rating span.star {
  font-family: FontAwesome;
  font-weight: normal;
  font-style: normal;
  display: inline-block;
}

.rating span.star:hover {
  cursor: pointer;
}

.rating span.star:before {
  content: "\f006";
  padding-right: 5px;
  color: #999999;
}

.rating span.star:hover:before,
.rating span.star:hover ~ span.star:before
{
  content: "\f005";
  color: #e3cf7a;
}

.round {
-webkit-border-radius: 3px;
-moz-border-radius: 3px;
border-radius: 3px;
}

.border
{
outline: 1px solid #CCC;
}

</style>
<link href="css/bootstrap-responsive.min.css" rel="stylesheet">

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

<!-- Le fav and touch icons -->
<link rel="shortcut icon" href="../assets/ico/favicon.ico">
<link rel="apple-touch-icon-precomposed" sizes="144x144"
	href="../assets/ico/apple-touch-icon-144-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114"
	href="../assets/ico/apple-touch-icon-114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72"
	href="../assets/ico/apple-touch-icon-72-precomposed.png">
<link rel="apple-touch-icon-precomposed"
	href="../assets/ico/apple-touch-icon-57-precomposed.png">

</head>

<body>

	<div class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="btn btn-navbar" data-toggle="collapse"
					data-target=".nav-collapse"> </a> <a
					class="brand" href="#">Agile CRM</a>
				<div class="nav-collapse">
					<ul class="nav">
						<li id="homemenu" class="active">
						<li id="contactsmenu"><a href="#contacts">Contacts</a>
						<li id="calendarmenu"><a href="#calendar">Calendar</a>
						<li id="dealsmenu"><a href="#deals">Deals</a>
						<li id="workflowsmenu"><a href="#workflows">Campaigns</a>
					
						</li>
					</ul>
					
					<%
						UserService userService = UserServiceFactory.getUserService();
						User user = userService.getCurrentUser(); // or req.getUserPrincipal()
						String logoutURL = userService.createLogoutURL("/home");
					%>
					
					<form id="searchForm" class="dropdown navbar-search">
                    <input id="searchText" type="text" class="search-query dropdown-toggle" placeholder="Search"/>
              		</form>	
					


					<ul class="nav pull-right">
					
					
					<li class="dropdown" id="menu1"><a class="dropdown-toggle"
							data-toggle="dropdown" href="#menu1">Add New <i class='caret'></i></a>
							<ul class="dropdown-menu">
								<li><a href="#personModal" data-toggle="modal" id="person">Person</a>
								</li>
								<li><a href="#contactModal" data-toggle="modal"
									id="contact">Contact</a>
								</li>
							
								<li><a href="#activityModal" data-toggle="modal"
									id="activity">Activity</a>
								</li>
							</ul>
							
							<!-- 
							<img style='display:hidden' id='ajax'
								src='img/ajax-loader.gif' />
								-->
						</li>
					
						<li id="fat-menu" class="dropdown"><a href=""
							class="dropdown-toggle" data-toggle="dropdown"><i
								class="agilecrm-profile-dropdown"></i> </a>
							<ul class="dropdown-menu">
								<li>
									<a href='#settings'><%=user.getEmail()%></a>
											</li>
								<li class="divider"></li>
								<li>
								<a href="#settings"><i class="icon-cog""></i> Settings</a>
								</li>
								<li>
								<a href="<%=logoutURL%>"><i class="icon-off"></i> Logout</a>
								</li>
							</ul>
						</li>

						
						

					</ul>
					
					


				</div>
				<!--/.nav-collapse -->
			</div>
		</div>
	</div>

	<div class="container">
		<div id="content" class="" ></div>
	</div>


	<!-- New (Contact) Modal views -->
	<div class="modal hide fade" id="contactModal">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3>Add Company</h3>
		</div>
		<div class="modal-body">
			<form id='companyForm' name="companyForm" method="post">
				<p>

					<b>Company:</b><br />
					<input name="cmpany" type="text" id="cmpany" placeholder="Company"
						style="width:150px;" />
						
						<br/>
						<label><b>Url:</b></label>
				<div class="input-prepend"">
					<span class="add-on">http://</span><input class="span2" name="url"
						type="text" id="url" placeholder="Url" style="width:100px;" />
				</div>
			</form>
		</div>
		<div class="modal-footer">
			<a href="#continue-company" class="btn" data-dismiss="modal">Continue
				Editing</a> <a href="#" class="btn btn-primary" id="company_validate">Save
				changes</a>
		</div>

	</div>
	<!-- End of Modal views -->
	<!-- New (Note) Modal views -->
	<div class="modal hide fade" id="noteModal">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3>Add Note</h3>
		</div>
		<div class="modal-body">
			<form id='noteForm' name="noteForm" method="post">
				<p>
					<label><b>Description</b>
					</label>
					<textarea rows="3" id="description" placeholder="Description"></textarea>
				</p>

				<p>
					<label><b>About</b>
					</label> <input name="about" type="text" id="about" placeholder="About" />
				</p>
			</form>
		</div>
		<div class="modal-footer">
			<a href="#" class="btn btn-primary" id="note_validate">Save
				changes</a>
		</div>

	</div>
	<!-- End of Modal views -->
	<!-- New (Activity) Modal views -->
	<div class="modal hide fade" id="activityModal">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3>Add Activity</h3>
		</div>
		<div class="modal-body">
			<form id='activityForm' name="activityForm" method="post">
				<a href="#" id="task" class="activity_activated"
					style="border-right: 1px solid #BFBFBF;padding-right: 8px;">Task</a><a
					href="#" id="event" style="padding-left: 8px;">Event</a> <input
					type="hidden" value="task" id="hiddentask" /><br /> <br /> <input
					type="text" id="activitysubject" name="activity"
					placeholder="Enter Subject" />
				<div id="relatedtask">
					<input type="text" name="taskdate" class="span2" value="05-19-2012"
						id="dp1">
				</div>
				<div id="relatedEvent" style="display:none">
					<input type="text" name="eventstartdate" class="span2"
						value="05-19-2012" id="dp2"> <input type="text"
						class="timepicker" style="width:65px">&nbsp;to&nbsp;<input
						type="text" name="eventenddate" class="span2" value="05-19-2012"
						id="dp3"> <input type="text" class="timepicker"
						style="width:65px"><br /> <input type="checkbox"
						id="repeat">&nbsp;Repeats</input> <input type="checkbox"
						id="alldayevent">&nbsp;All day event</input>
				</div>
			</form>
		</div>
		<div class="modal-footer">
			<a href="#" class="btn btn-primary" id="task_event_validate">Save
				changes</a>
		</div>

	</div>
	<!-- End of Modal views -->

	
	<script src='lib/headjs.js'></script>
	
	<script>
	
	<!-- JQUery Core and UI CDN -->	
	head.js('https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js', 'lib/bootstrap.min.js', 'lib/jquery.validate.min.js');
	
	<!-- Backbone -->
	head.js('lib/underscore-min.js', 'lib/backbone-min.js');
	
	<!-- Handle bars -->
	head.js('lib/handlebars-1.0.0.beta.6.js');
	
	head.ready(function() {
		head.js('js-all-min.js');
	});
	
	</script>
	
	<!-- File upload js -->
	<link rel='stylesheet' type='text/css' href='css/fileuploader.css' />
		
	
	<!-- Templates -->
	<%@ include file="tpl.js" %>		

</body>
</html>
