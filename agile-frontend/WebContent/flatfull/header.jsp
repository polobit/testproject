\<%@page import="java.util.Iterator"%>
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

<header id="header" class="app-header navbar" role="menu">

		
			
				<div class="navbar-header 
				<%
				 	switch (Integer.parseInt(currentUserPrefs.theme)) {
				 		case 1:  out.print("bg-black ");
				   				 break;
				 		case 2:  out.print("bg-white-only ");
								 break;
				 		case 3:  out.print("bg-primary ");
								 break;
				 		case 4:  out.print("bg-info ");
								 break;
				 		case 5:  out.print("bg-success ");
								 break;
				 		case 6:  out.print("bg-danger ");
								 break;
				 		case 7:  out.print("bg-black ");
								 break;
				 		case 8:  out.print("bg-info dker ");
								 break;
				 		case 9:  out.print("bg-primary ");
								 break;
				 		case 10:  out.print("bg-info dker ");
								 break;
				 		case 11:  out.print("bg-success ");
								 break;
				 		case 12:  out.print("bg-danger dker ");
								 break;
				 		case 13:  out.print("bg-dark ");
								 break;
				 		case 14:  out.print("bg-dark ");
								 break;
				 		default:
				        		break;
				 
				 	}
				  		
				 %>">
				    <a class="navbar-brand font-bold text-lt" href="#dashboard"><i class="fa fa-cloud"></i> <span class="hidden-folded m-l-xs"> Agile CRM </span></a>
</div>
					<div id="navbar" class="collapse pos-rlt navbar-collapse box-shadow 
					
					<%
				 	switch (Integer.parseInt(currentUserPrefs.theme)) {
				 		case 1:  out.print("bg-white-only ");
				   				 break;
				 		case 2:  out.print("bg-white-only ");
								 break;
				 		case 3:  out.print("bg-white-only ");
								 break;
				 		case 4:  out.print("bg-white-only ");
								 break;
				 		case 5:  out.print("bg-white-only ");
								 break;
				 		case 6:  out.print("bg-white-only ");
								 break;
				 		case 7:  out.print("bg-black ");
								 break;
				 		case 8:  out.print("bg-info dker ");
								 break;
				 		case 9:  out.print("bg-primary ");
								 break;
				 		case 10:  out.print("bg-info dk ");
								 break;
				 		case 11:  out.print("bg-success ");
								 break;
				 		case 12:  out.print("bg-danger dker ");
								 break;
				 		case 13:  out.print("bg-white-only ");
								 break;
				 		case 14:  out.print("bg-dark ");
								 break;
				 		default:
				        		break;
				 
				 	}
				  		
				 %>">
					<div class="nav navbar-nav hidden-xs">
<a href="#" id="app-aside-folded" class="btn no-shadow navbar-btn" ui-toggle="app-aside-folded" target=".app">
            <i class="fa fa-dedent fa-fw text"></i>
          <!--   <i class="fa fa-indent fa-fw text-active"></i> -->
          </a>
</div>

						<ul class="nav navbar-nav agile-menu">
						 	<li id="homemenu" class="active"></li>
							<%
							    if ("admin".equals(domainUser.domain)) {
											out.println("<li><a href='#all-domain-users'><i class='icon-group'></i> All Domain Users</a></li></ul>");
											out.println("<ul class='nav pull-right' style='float:right!important;'><li class='nav-bar-search'>	<form id='domainSearchForm' class=' navbar-search'	style='margin: 5px;'>	<input id='domainSearchText' class='form-control' type='text' style='line-height: 17px'	data-provide='typeahead'		placeholder='Search'></input> <input id='domain-search-results' type='image' src='img/SearchIcon.png' class='searchbox' /></form></li><li><a href="
													+ logoutURL
													+ "><i class='icon-off'></i>Logout</a></li>");
										} else {
							%>

							<%--
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
								    
								    if(index < 2)
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
							--%>
							
						
								<li><a href="#calendar"><i class="icon icon-calendar"></i></a></li>
								<li id="due_tasks" ><a class="pos-rlt" href="#tasks"><i class="icon-list" title="Tasks"></i>
								
											<span title="Tasks due" class="navbar_due_tasks  pull-right-xs"><span  id="due_tasks_count" class="badge badge-sm up bg-danger"></span></span></a></li>
							<li class="nav-bar-search">
								<form id="searchForm" class=" navbar-search  navbar-search navbar-form navbar-form-sm navbar-left shift">
					<div class="input-group">
							<input id="searchText" type="text"
										data-provide="typeahead"
										class="typeahead typeahead_contacts search-query form-control-custom input-sm bg-light no-border rounded padder"
										placeholder="Search">
										
										 <!-- <input id="search-results" 
										type="image" src="img/SearchIcon.png" class="searchbox hidden" /> -->
						<span class="input-group-btn">
                <button type="submit" class="btn btn-sm bg-light rounded"><i class="fa fa-search"></i></button>
              </span>
              </div>				
								</form>
							</li>
							
						</ul>

						<ul class="nav  navbar-nav  navbar-right">

							<li id="recent-menu" class="dropdown"><a
								class="dropdown-toggle" data-toggle="dropdown" href=""> <i class='fa fa-history text-muted text-md'></i>
							</a>
							</li>
								

							<li class="dropdown" id="menu1"><a class="dropdown-toggle"
								data-toggle="dropdown" href="">New <b class="caret"></b></a>
								<ul class="dropdown-menu animated fadeInLeft">
									<li><a href="#personModal"  data-toggle="modal" id="person">
											Contact</a></li>
									<li><a href="#companyModal"  data-toggle="modal"
										id="company"> Company</a></li>
									<li><a href="#"  id="show-activity"> Event</a></li>
									<li><a href="#" class=" add-task"> Task</a></li>

									<%
										if(domainUser.menu_scopes.contains(NavbarConstants.DEALS)){
									%>
									<li><a href="#" class="font-bold deals-add"> Deal</a></li>
									<%
										}
									%>
									<li><a href="#" id="show-note"> Note</a></li>
									<li><a href="#send-email"> Email</a></li>
								</ul> <!-- 
							<img style='display:hidden' id='ajax'
								src='img/ajax-loader.gif' />
								--></li>

							<li id="fat-menu" class="dropdown">
							<a href="" class="dropdown-toggle" data-toggle="dropdown"><!-- <i
									class="agilecrm-profile-dropdown"></i> -->
<span class="thumb-sm avatar pull-right m-t-n-sm m-b-n-sm m-l-sm">
				<%	if (!StringUtils.isEmpty(currentUserPrefs.pic))
							out.println("<img src='"
							+ currentUserPrefs.pic
							+ "' alt='...' class='b b-light'></img>");
					else
							out.println("<img src='img/gravatar.png' class='b b-light' alt='...'></img>");
				%>
               
               
              </span>
              <div class="pull-left text-ellipsis w-auto hidden-sm hidden-md" style="max-width:150px;"><span class="hidden-sm hidden-md"><%=domainUser.name%></span></div>
              <b class="caret"></b>									
									 </a>
								<ul class="dropdown-menu animated fadeInRight w">
									<li><a href='#user-prefs' class="b-b">
											<%-- <%
											    if (!StringUtils.isEmpty(currentUserPrefs.pic))
																out.println("<img src='"
																		+ currentUserPrefs.pic
																		+ "'style='padding:2px !important' class='thumbnail m-b-none thumb-xxs m-r-xs inline'></img>");
															else
																out.println("<img src='img/gravatar.png' style='padding:2px !important' class='thumbnail m-b-none thumb-xxs m-r-xs inline'></img>");
											%> --%> <span class="text-sm m-r-md"> <b><%=user.getEmail()%></b></span>

									</a></li>
									<li><a href="#user-prefs"><!-- <i class="icon-cog"></i> -->
											Preferences</a></li>

									<%
									    if (domainUser != null && domainUser.is_admin)
									    {
														out.print("<li><a href='#account-prefs'>Admin Settings</a></li>");
													//	out.println("<li><a href='#subscribe'><i class='icon-shopping-cart'></i> Plan & Upgrade</a></li>");
									    }
									%>
									<li><a href="#themeandlayout"><!-- <i class="icon-off"></i> -->
											Theme & Layout</a></li>
									<!-- <li><a href="https://www.agilecrm.com/support.html" target="_blank"><i class="icon-facetime-video"></i> Help
											Videos</a></li>
								 	<li><a href="#" onclick="$('li#fat-menu').removeClass('open');clickdesk_show_livechat_popup();"><i class="icon-comment"></i> Live Chat</a></li>  -->
									<!-- <li><a href="#help"><i class="icon-question"></i>
											Help</a></li> -->
									<li class="divider"></li>
									<li><a href="<%=logoutURL%>"><!-- <i class="icon-off"></i> -->
											Logout</a></li>

								</ul></li>
							<%
							    }
							%>
						</ul>
					</div>
					</header>
					<!--/.nav-collapse -->
			
		
		
		
