<%@page import="java.util.Iterator"%>
<%@page import="com.agilecrm.account.NavbarConstants"%>
<%@page import="com.agilecrm.account.MenuSetting"%>
<%@page import="com.agilecrm.account.util.MenuSettingUtil"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.session.UserInfo"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%

			DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
			System.out.println("Domain user " + domainUser);

			ObjectMapper mapper = new ObjectMapper();

			// Get current user prefs
			UserPrefs currentUserPrefs = UserPrefsUtil.getCurrentUserPrefs();

			String width = currentUserPrefs.width;
			
			String logoutURL = "/login";
				UserInfo user = SessionManager.get();
%>

		<div class="navbar navbar-fixed-top">
			<div class="navbar-inner">
				<div class="container<%=width%>">
					<a class="btn btn-navbar" data-toggle="collapse"
						data-target=".nav-collapse"> <span class="icon-bar"></span> <span
						class="icon-bar"></span> <span class="icon-bar"></span>
					</a> <a class="brand" href="#"> Agile CRM</a>

					<div class="nav-collapse">

						<ul class="nav agile-menu">
							<li id="homemenu" class="active"></li>
							<%
							    if ("admin".equals(domainUser.domain)) {
											out.println("<li><a href='#all-domain-users'><i class='icon-group'></i> All Domain Users</a></li></ul>");
											out.println("<ul class='nav pull-right' style='float:right!important;'><li class='nav-bar-search'>	<form id='domainSearchForm' class=' navbar-search'	style='margin: 5px;'>	<input id='domainSearchText' type='text' style='line-height: 17px'	data-provide='typeahead'		placeholder='Search'></input> <input id='domain-search-results' type='image' src='img/SearchIcon.png' class='searchbox' /></form></li><li><a href="
													+ logoutURL
													+ "><i class='icon-off'></i>Logout</a></li>");
										} else {
							%>


							<%
							
								for(NavbarConstants constant : domainUser.menu_scopes)
								{
							%>
								    <li id="<%=constant.id%>"><a href="<%=constant.href%>"><i
										class="<%=constant.icon%> icon-white"></i> <%=constant.heading%></a></li>
							<%
								}
							%>
							
							
							<%
							String css_classes = "";
							int size = domainUser.menu_scopes.size();
							if(size <=7)
							{
							    
							    css_classes = css_classes + " more-menu-hide-medium";
							}
							else
							{
							    css_classes = css_classes + " more-menu-show-medium";
							}
							if(size <= 4)
							{
							    css_classes = css_classes + " more-menu-hide-low";
							}
							else
							{
							    css_classes = css_classes + " more-menu-show-low";
							}
							
							
							    if (domainUser.menu_scopes.size() > 3) {
							%>
								<li id="more-menu" class="dropdown <%=css_classes%>"><a
									class="dropdown-toggle" data-toggle="dropdown" href=""> More
										<i class='caret'></i>
								</a>
								<%
							    } else
							    {
								%>
								<li id="more-menu" class="dropdown <%=css_classes%>"><a
									class="dropdown-toggle" data-toggle="dropdown" href=""> More
										<i class='caret'></i>
								</a>
							<%
							    }
							%>
								<ul class="dropdown-menu drop-drop">
									<%
								Iterator<NavbarConstants> iterator = domainUser.menu_scopes.iterator();
								int index = 0;
								for(NavbarConstants constant : domainUser.menu_scopes)
								{
								    
								    if(index < 3)
								    {
										++index;
										continue;
								    }
								    
							%>
								    <li  id="<%=constant.id%>"><a href="<%=constant.href%>"><i
										class="<%=constant.icon%> icon-white"></i> <%=constant.heading%></a></li>
							<%
								}
							%>
								</ul>
							</li>
							
							
						
							<li class="nav-bar-search">
								<form id="searchForm" class=" navbar-search"
									style="margin: 5px;">
									<input id="searchText" type="text" style="line-height: 17px;width:170px;"
										data-provide="typeahead"
										class="typeahead typeahead_contacts search-query"
										placeholder="Search"></input> <input id="search-results" style="display:none;
										type="image" src="img/SearchIcon.png" class="searchbox" />
								</form>
							</li>
							
						</ul>

						<ul class="nav pull-right">

							<li id="recent-menu" class="dropdown"><a
								class="dropdown-toggle" data-toggle="dropdown" href=""
								style="padding-left: 2px; padding-right: 4px;"> <i
									class='caret'></i>
							</a>
								<ul class="dropdown-menu" style="width: 25em; right: -11px;">
								</ul></li>
								<li id="due_tasks" ><a style="position:relative;"href="#tasks"><i class="icon-tasks" title="Tasks"></i>
											<span title="Tasks due" class="navbar_due_tasks pos-abs pos-r-0 badge badge-important p-t-none p-b-none p-l-xs p-r-xs" style="top:3px" ><span  id="due_tasks_count" class="text-xxs"></span></span></a></li>
								

							<li class="dropdown" id="menu1"><a class="dropdown-toggle"
								data-toggle="dropdown" href="">Add New <i class='caret'></i></a>
								<ul class="dropdown-menu">
									<li><a href="#personModal" data-toggle="modal" id="person">
											Contact</a></li>
									<li><a href="#companyModal" data-toggle="modal"
										id="company"> Company</a></li>
									<li><a href="#" id="show-activity"> Event</a></li>
									<li><a href="#" class="add-task"> Task</a></li>

									<%
										if(domainUser.menu_scopes.contains(NavbarConstants.DEALS)){
									%>
									<li><a href="#" class="deals-add"> Deal</a></li>
									<%
										}
									%>
									<li><a href="#" id="show-note"> Note</a></li>
									<li><a href="#send-email"> Email</a></li>
								</ul> <!-- 
							<img style='display:hidden' id='ajax'
								src='img/ajax-loader.gif' />
								--></li>

							<li id="fat-menu" class="dropdown"><a href=""
								class="dropdown-toggle" data-toggle="dropdown"><i
									class="agilecrm-profile-dropdown"></i> </a>
								<ul class="dropdown-menu">
									<li><a href='#user-prefs'
										style="padding-left: 8px !important; padding-right: 8px !important; padding-bottom: 5px !important; margin-bottom: 5px !important; border-bottom: 1px solid #e5e5e5">
											<%
											    if (!StringUtils.isEmpty(currentUserPrefs.pic))
																out.println("<img src='"
																		+ currentUserPrefs.pic
																		+ "'style='height: 26px; width: 26px; margin-right: 3px; display: inline;padding:2px !important' class='thumbnail'></img>");
															else
																out.println("<img src='img/gravatar.png' style='height: 26px; width: 26px; margin-right: 3px; display: inline;padding:2px !important' class='thumbnail'></img>");
											%> <span> <b
												style="font-size: 13px; margin-right: 20px;"><%=user.getEmail()%></b></span>

									</a></li>
									<li><a href="#user-prefs"><i class="icon-cog"></i>
											Preferences</a></li>

									<%
									    if (domainUser != null && domainUser.is_admin)
														out.println("<li><a href='#account-prefs'><i class='icon-fire'></i> Admin Settings</a></li><li><a href='#subscribe'><i class='icon-shopping-cart'></i> Plan & Upgrade</a></li>");
									%>
									<!-- <li><a href="https://www.agilecrm.com/support.html" target="_blank"><i class="icon-facetime-video"></i> Help
											Videos</a></li>
								 	<li><a href="#" onclick="$('li#fat-menu').removeClass('open');clickdesk_show_livechat_popup();"><i class="icon-comment"></i> Live Chat</a></li>  -->
									<li><a href="#help"><i class="icon-question"></i>
											Help</a></li>
									<li><a href="<%=logoutURL%>"><i class="icon-off"></i>
											Logout</a></li>

								</ul></li>
							<%
							    }
							%>
						</ul>
					</div>
					<!--/.nav-collapse -->
				</div>
			</div>
		</div>