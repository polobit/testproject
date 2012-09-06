<!DOCTYPE html>
<%@page import="com.agilecrm.core.DomainUser"%>
<%@page import="com.agilecrm.user.AgileUser"%>
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

<% 

String CSS_PATH = "/";
/* String CSS_PATH = "https://d1uqbqkiqv27mb.cloudfront.net/panel/"; */
%>
	
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/bootstrap-<%=template%>.min.css" />
<link rel="stylesheet" type="text/css" href="<%=CSS_PATH%>css/bootstrap-responsive.min.css" media="screen, projection" />

<style>
@media (min-width: 900px) {
body {
	padding-top: 60px;
	//background-color: whitesmoke;
	}
	
.navbar-search{
 	padding-left: 10%
}
	
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
padding: 13px 0px; 
border-bottom: 2px solid whiteSmoke;	
}

.tag-key
{
display:inline;
font-weight:bold;
font-size:11px;
padding-right:5px;
color:gray;
}

.tag-values
{
display:inline;
font-size:11px;
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

/* Rating stars in contact details */
.rating {
  unicode-bidi: bidi-override;
  direction: rtl;
 
}

 .rating span.star {
  font-weight: normal;
  font-style: normal;
  display: inline-block;
}

.rating span.star:hover {
  cursor: pointer;
}

.rating span.star:before {
  content: "\2606";
  padding-right: 5px;
  color: #999999;
}

.rating span.star:hover:before,
.rating span.rating-value,
.rating span.star:hover ~ span.star:before
{
  content: "\2605";
  color: #e3cf7a;
}


.round {
-webkit-border-radius: 3px;
-moz-border-radius: 3px;
border-radius: 3px;
}


/* Subnav */
.subnav {
  width: 100%;
  height: 36px;
  background-color: #eeeeee; /* Old browsers */
  background-repeat: repeat-x; /* Repeat the gradient */
  background-image: -moz-linear-gradient(top, #f5f5f5 0%, #eeeeee 100%); /* FF3.6+ */
  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f5f5f5), color-stop(100%,#eeeeee)); /* Chrome,Safari4+ */
  background-image: -webkit-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Chrome 10+,Safari 5.1+ */
  background-image: -ms-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* IE10+ */
  background-image: -o-linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* Opera 11.10+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f5f5f5', endColorstr='#eeeeee',GradientType=0 ); /* IE6-9 */
  background-image: linear-gradient(top, #f5f5f5 0%,#eeeeee 100%); /* W3C */
  border: 1px solid #e5e5e5;
  -webkit-border-radius: 4px;
     -moz-border-radius: 4px;
          border-radius: 4px;
}
.subnav .nav {
  margin-bottom: 0;
}
.subnav .nav > li > a {
  margin: 0;
  padding-top:    11px;
  padding-bottom: 11px;
  border-left: 1px solid #f5f5f5;
  border-right: 1px solid #e5e5e5;
  -webkit-border-radius: 0;
     -moz-border-radius: 0;
          border-radius: 0;
}
.subnav .nav > .active > a,
.subnav .nav > .active > a:hover {
  padding-left: 13px;
  color: #777;
  background-color: #e9e9e9;
  border-right-color: #ddd;
  border-left: 0;
  -webkit-box-shadow: inset 0 3px 5px rgba(0,0,0,.05);
     -moz-box-shadow: inset 0 3px 5px rgba(0,0,0,.05);
          box-shadow: inset 0 3px 5px rgba(0,0,0,.05);
}
.subnav .nav > .active > a .caret,
.subnav .nav > .active > a:hover .caret {
  border-top-color: #777;
}
.subnav .nav > li:first-child > a,
.subnav .nav > li:first-child > a:hover {
  border-left: 0;
  padding-left: 12px;
  -webkit-border-radius: 4px 0 0 4px;
     -moz-border-radius: 4px 0 0 4px;
          border-radius: 4px 0 0 4px;
}
.subnav .nav > li:last-child > a {
  border-right: 0;
}
.subnav .dropdown-menu {
  -webkit-border-radius: 0 0 4px 4px;
     -moz-border-radius: 0 0 4px 4px;
          border-radius: 0 0 4px 4px;
}

.btn-mini{
	padding:0px 2px !important;
}

.dropdown-menu {
     z-index: 100000000 !important;
}

/* Red compulsory fields star */
.field_req{
	color: red;
}


/* Notification alert */
.notifications > .alert .close
{
top: 13px;
right: 12px;
z-index: 9999
}

.notifications > .alert{
padding: 0px;
margin: 0px
}

/* Widget */
.widget
{
padding:10px;
}

/* Tags */
.tags {
width: auto;
margin: 25px 0 0 10px;
list-style: none;
overflow: hidden;
}

.tags li {
height: 27px;
white-space: nowrap;
float: left;
margin-bottom: 10px;
background: white url("/css/tags/tag-01.png") no-repeat;
padding: 0 0 0 13px;
margin-right: 10px;
}

.tags li span {
display: block;
height: 23px;
padding: 2px 8px 0 2px;
color: #369;
background: transparent url("/css/tags/tag-02.png") no-repeat right top;
text-decoration: none;
}

/* Sidebar Title */
.sidebar_title {
margin: 0;
background: #EEE url("//s3.amazonaws.com/wrapbootstrap/live/imgs/atcblock.png") no-repeat 0 0;
padding: 10px 10px;
color: #444;
text-shadow: 1px 1px 0 white;
font-size: 16px;
font-weight: bold;
}

.info_wrapper {
border: 1px solid #DDD;
margin-bottom: 15px;
}

/* Settings Content */
.settings-content{
	height: 100px;
	margin-bottom:60px;
}

/* Clip Board Application CSS -- Beginning */
.slate {
text-shadow: 0 1px white;
padding: 20px;
background: #EBF3FB;
-webkit-border-radius: 3px 3px;
-moz-border-radius: 3px / 3px;
border-radius: 3px / 3px;
-webkit-box-shadow: 0 0 1px white inset,0 1px 1px rgba(0, 0, 0, 0.1);
-moz-box-shadow: 0 0 1px #fff inset,0 1px 1px rgba(0,0,0,0.1);
box-shadow: 0 0 1px white inset,0 1px 1px rgba(0, 0, 0, 0.1);
border: 1px solid #CDE1F5;
margin-bottom:10px;
}

.slate .slate-content::before, .slate .slate-content::after {
display: table;
content: "";
}

.slate .slate-content::after {
clear: both;
}

.slate .slate-content::before, .slate .slate-content::after {
display: table;
content: "";
}

.slate .slate-content .box-left {
display: block;
float: left;
}

.slate .slate-content .box-right {
padding-top: 4px;
margin-left: 87px;
}

.slate .btn-slate-action {
margin-top: 10px;
}

.blue {
border: 1px solid #2273C4;
background: #67A6E5;
background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzcwYWJlNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzQwOGZkZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==');
background-size: 100%;
background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #70ABE6), color-stop(100%, #408FDE));
background-image: -webkit-linear-gradient(top, #70ABE6,#408FDE);
background-image: -moz-linear-gradient(top, #70ABE6,#408FDE);
background-image: -o-linear-gradient(top, #70ABE6,#408FDE);
background-image: linear-gradient(top, #70ABE6,#408FDE);
color: white;
text-shadow: 0 -1px #206EBC;
font-weight: normal;
}
/* Clip Board Application CSS -- Ending */

</style>

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->
    
	<!--[if lt IE 8]>
    <script src="lib/ie/json.js"></script>
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
					data-target=".nav-collapse"> 
					<span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            </a>
					 <a
					class="brand" href="#dashboard">Agile CRM</a>
				<div class="nav-collapse">
					<ul class="nav agile-menu">
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
						String logoutURL = userService.createLogoutURL("/login");
					%>
					
					<form id="searchForm" class=" navbar-search">
                    <input id="searchText" type="text" typeahead_contacts" data-provide="typeahead" class="typeahead typeahead_contacts search-query" placeholder="Search"/>
              		</form>	

					<ul class="nav pull-right">
					
					
					<li class="dropdown" id="menu1"><a class="dropdown-toggle"
							data-toggle="dropdown" href="#menu1">Add New <i class='caret'></i></a>
							<ul class="dropdown-menu agile-menu">
								<li><a href="#personModal" data-toggle="modal" id="person">Person</a>
								</li>
								<li><a href="#companyModal" data-toggle="modal"
									id="company">Company</a>
								</li>
							
								<li><a href="#activityModal" data-toggle="modal"
									id="activity">Activity</a>
								</li>
								<li><a href="#deals-add" 
									id="activity">Deal</a>
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
							<ul class="dropdown-menu agile-menu">
								<li>
									<a href='#settings'><%=user.getEmail()%></a>
											</li>
								<li class="divider"></li>
								<li>
								<a href="#settings"><i class="icon-cog"></i> Preferences</a>
								</li>
								
									<%
									DomainUser domainUser = DomainUser.getDomainCurrentUser();
									System.out.println("Domain user " + domainUser);
									
									if(domainUser != null && domainUser.is_admin)
										out.println("<li><a href='#admin'><i class='icon-fire'></i> Admin Settings</a></li>");
									%>
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
	
	<!--  Notifications -->
	<div class='notifications top-left'></div>
	<div class='notifications top-right'></div>
	<div class='notifications bottom-left'></div>
	<div class='notifications bottom-right'></div>
	
	<!-- Templates -->
	<%@ include file="tpl.js" %>	
	
	
<script src='lib/headjs-min.js'></script>
	
	<script>
	//var LIB_PATH = "https://d1uqbqkiqv27mb.cloudfront.net/panel/js/";
	var LIB_PATH = "/";
	
	<!-- JQUery Core and UI CDN -->	
	<!-- The same ajax libraries are used by designer - if you are changing the version here, change in designer too -->
	head.js(LIB_PATH + 'lib/jquery.min.js', LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH +  'lib/bootstrap.min.js', LIB_PATH + 'lib/jquery.validate.min.js', LIB_PATH + 'lib/bootstrap-datepicker-min.js', LIB_PATH + 'lib/bootstrap-timepicker-min.js');
	
	<!-- Backbone -->
	head.js(LIB_PATH + 'lib/underscore-min.js', LIB_PATH + 'lib/backbone-min.js');
	
	<!-- Handle bars -->
	head.js(LIB_PATH + 'lib/handlebars-1.0.0.beta.6-min.js');
	
	head.ready(function() {
		head.js('js-all-min.js');
	});
	
	
	</script>
	
	
	<!-- File upload js -->
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/fileuploader-min.css' />
	
	<!-- <link rel="stylesheet" href="css/font-awesome.css"> -->
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/fullcalendar-min.css' />
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH %>css/fullcalendar.print-min.css' media='print' />
	
	<!-- 
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/jquery.taghandler-min.css'/> 
	<link rel='stylesheet' type='text/css' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery.ui.all.css'/>
	-->
	
	<!--  Prettify -->
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/prettify-min.css' />
	
	<!--  Date & Time Picker -->
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/datepicker-min.css' />
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/timepicker-min.css' />
	
	<!-- Notify Plugin -->
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/bootstrap-notify-min.css' />
	
	<!--  HTML Editor -->
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/bootstrap-wysihtml5-min.css' />
	
	<!--  Multiselect for Custom views add -->
	<link rel='stylesheet' type='text/css' href='<%=CSS_PATH%>css/multi-select.css' />
	
</body>
</html>