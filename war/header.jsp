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
					</a> <a class="brand" href="#dashboard"> Agile CRM</a>

					<div class="nav-collapse">

						<ul class="nav agile-menu">
							<li id="homemenu" class="active"></li>
							<%
							    if ("admin".equals(domainUser.domain)) {
											out.println("<li><a href='#all-domain-users'><i class='icon-group'></i> All Domain Users</a></li></ul>");
											out.println("<ul class='nav pull-right' style='float:right!important;'><li><a href="
													+ logoutURL
													+ "><i class='icon-off'></i>Logout</a></li>");
										} else {
							%>


							<%
							    //Styling enable/disable navbar tabs(add display:none to diable)
									Integer count = 0;
									MenuSetting menuSetting = MenuSettingUtil.getMenuSetting();

									if (menuSetting.calendar)
										++count;
									if (menuSetting.cases)
										++count;
									if (menuSetting.deals)
										++count;
									if (menuSetting.campaign)
										++count;
									if (menuSetting.social)
										++count;
									if (menuSetting.reports)
										++count;
									if (menuSetting.documents)
										++count;
							%>
							<li id="contactsmenu"><a href="#contacts"><i
									class="icon-user icon-white"></i> Contacts</a></li>
							<%
							    if (menuSetting.calendar) {
							%>
							<li id="calendarmenu"><a href="#calendar"> <i
									class="icon-calendar icon-white"></i> Calendar
							</a></li>
							<%
							    }
											if (menuSetting.campaign) {
							%>
							<li id="workflowsmenu"><a href="#workflows"><i
									class="icon-sitemap icon-white"></i> Campaigns</a></li>
							<%
							    }
											if (menuSetting.deals) {
							%>
							<li id="dealsmenu"><a href="#deals"><i
									class="icon-money icon-white"></i> Deals</a></li>
							<%
							    }
											if (menuSetting.social) {
							%>
							<li id="socialsuitemenu"><a href="#social"> <i
									class="icon-comments icon-white"></i> Social
							</a></li>
							<%
							    }
											if (menuSetting.documents) {
							%>
							<li id="documentsmenu"><a href="#documents"><i
									class="icon-file icon-white"></i> Docs</a></li>
							<%
							    }
											if (menuSetting.reports) {
							%>
							<li id="reportsmenu"><a href="#reports"><i
									class="icon-bar-chart icon-white"></i> Reports</a></li>
							<%
							    }
											if (menuSetting.cases) {
							%>
							<li id="casesmenu"><a href="#cases"><i
									class="icon-folder-close icon-white"></i> Cases</a></li>
							<%
							    }
							%>

							<%
							    if (count > 3) {
							%>

							<li id="more-menu" class="dropdown"><a
								class="dropdown-toggle" data-toggle="dropdown" href=""> More
									<i class='caret'></i>
							</a>
								<ul class="dropdown-menu drop-drop">
									<%
									    if (menuSetting.campaign) {
									%>
									<li id="workflowsmenu"><a href="#workflows"><i
											class="icon-sitemap icon-white"></i> Campaigns</a></li>
									<%
									    }
														if (menuSetting.deals) {
									%>
									<li id="dealsmenu"><a href="#deals"><i
											class="icon-money icon-white"></i> Deals</a></li>
									<%
									    }
														if (menuSetting.social) {
									%>
									<li id="socialsuitemenu"><a href="#social"> <i
											class="icon-comments icon-white"></i> Social
									</a></li>
									<%
									    }
														if (menuSetting.documents) {
									%>
									<li id="documentsmenu"><a href="#documents"><i
											class="icon-file icon-white"></i> Docs</a></li>
									<%
									    }
														if (menuSetting.reports) {
									%>
									<li id="reportsmenu"><a href="#reports"><i
											class="icon-bar-chart icon-white"></i> Reports</a></li>
									<%
									    }
														if (menuSetting.cases) {
									%>
									<li id="casesmenu"><a href="#cases"><i
											class="icon-folder-close icon-white"></i> Cases</a></li>
									<%
									    }
									%>
								</ul></li>
							<%
							    }
							%>
							<li class="nav-bar-search">
								<form id="searchForm" class=" navbar-search"
									style="margin: 5px;">
									<input id="searchText" type="text" style="line-height: 17px"
										data-provide="typeahead"
										class="typeahead typeahead_contacts search-query"
										placeholder="Search"></input> <input id="search-results"
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

							<li class="dropdown" id="menu1"><a class="dropdown-toggle"
								data-toggle="dropdown" href="">Add New <i class='caret'></i></a>
								<ul class="dropdown-menu">
									<li><a href="#personModal" data-toggle="modal" id="person">
											Contact</a></li>
									<li><a href="#companyModal" data-toggle="modal"
										id="company"> Company</a></li>
									<li><a href="#" id="show-activity"> Activity</a></li>

									<li><a href="#" class="deals-add"> Deal</a></li>
									<li><a href="#" id="show-note"> Note</a></li>
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
									<li><a href="https://www.agilecrm.com/support.html"
										target="_blank"><i class="icon-facetime-video"></i> Help
											Videos</a></li>
									<li><a href="#contact-us"><i class="icon-pencil"></i>
											Contact Us</a></li>
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