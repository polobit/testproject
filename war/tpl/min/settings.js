<script id="settings-email-template-add-template" type="text/html">
<div class="clearfix"></div>
<br/>
<div class="row">
<div class="span12">
<div class="page-header">
<h1>New Email Template</h1>
<ul class="nav right">
<li class="dropdown" id="menu3">
<span class="dropdown-toggle btn right" id="merge-field" data-toggle="dropdown" style='top:-25px;position:relative'>
<i class='icon-plus-sign'/> Add Merge Field</i></span>
<ul class="dropdown-menu">
<li><a href="#" name="first_name" class="merge-field">&nbsp;First Name</a></li>
<li><a name="last_name" class="merge-field">&nbsp;Last Name</a></li>
<li><a name="email" class="merge-field">&nbsp;Email</a></li>
<li><a name="company" class="merge-field">&nbsp;Company</a></li>							
</ul>
</li>
</ul>
</div>
</div>
</div>
<div class="span9">
<div class="well">
<form id="templatePrefs" class="form-horizontal">
<div class="control-group">
<label class="control-label">Subject <span class="field_req">*</span>
</label>
<div class="controls">
<input type="text" class="required" name="subject" placeholder="Enter Subject"/></div>
</div>
<div class="control-group">
<label class="control-label">Text <span class="field_req">*</span>
</label>
<div class="controls">
<textarea class="span6 required" rows="15" name="text" id="email-template-html" placeholder="Email template html"></textarea>
</div>
</div>
<div class="form-actions">
<a href="#" type="submit" class="save btn btn-primary">Save changes</a> 
<a href="#settings" class="btn ">Cancel</a>
</div>
</form>
</div>
</div>
</script><script id="settings-email-templates-collection-template" type="text/html">
<div class="row">
<div class="span12">
<div class="page-header">
<h1>List of Emails</h1>
<a href="#email-template-add" class="btn right" id="addEmailTemplate" style='top:-30px;position:relative'>
<span><i class='icon-plus-sign'/></span> Add Email Template</a>
</div>
</div>
</div>
<div class="row">
<div class="span9">
<table class="table table-bordered table-striped" >
<thead>
<tr>
<th></th>
<th>Id</th>
<th>subject</th>
<th>description</th>
</tr>
</thead>
<tbody id='settings-email-templates-model-list'>
</tbody>
</table>
</div>
<div class='span3'>
<div class="well">
<h3>
Export to CSV
</h3><br/>
<p>
You can use workflow to automate most of your follow-ups. It's marketing and sales automation tool.
</p>
<p>
Eg: you can send an email to all users who have signed up on your site. And then based on their behavior in the control panel, you can send them targetted messages periodically.
</p>
<br/>
<h3>
What is marketing automation?
</h3><br/>
<p>
You can use workflow to automate most of your follow-ups. It's marketing and sales automation tool.
</p>
<p>
Eg: you can send an email to all users who have signed up on your site. And then based on their behavior in the control panel, you can send them targetted messages periodically.
</p>
</div>
</div>
</div>
</script>
<script id="settings-email-templates-model-template" type="text/html">
<td><icon class='edit icon-remove-circle'></icon></td>
<td>{{id}}</td>
<td>{{subject}}</td>
<td>{{text}}</td>
</script><script id="settings-imap-prefs-template" type="text/html">
<div class='span3 well'>
<form id='imap-prefs-form'>
<fieldset>
<input name="id" type="hidden" value="{{id}}" /> 	
<legend>IMAP</legend>
<div class="control-group">
<label class="control-label">Email <span class="field_req">*</span></label>
<div class="controls">
<input name="email" type="text" class="email required" placeholder="Email" value="{{email}}" />
</div>
</div>
<div class="control-group">
<label class="control-label">Server (Host) <span class="field_req">*</span></label>
<div class="controls">
<input name="server_name" type="text" class="required" placeholder="Server name" value="{{server_name}}" />
</div>
</div>
<div class="control-group">
<label class="control-label">User Name <span class="field_req">*</span></label>
<div class="controls">
<input name="user_name" type="text" class="required" placeholder="User name" value="{{user_name}}" />
</div>
</div>
<div class="control-group">
<label class="control-label">Password <span class="field_req">*</span></label>
<div class="controls">
<input name="password" type="password" class="required" placeholder="Password" value="{{password}}" />
</div>
</div>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input name="is_secure" type="checkbox" value="{{is_secure}}"/>
Use SSL (Secure communication)
</label>
</div>
</div>
<div class="form-actions"> 
{{#if id}}
<button class='deleteItem btn'>Delete </button>
{{/if}}
<button type="submit" class="save btn btn-primary">Save </button>
</div>
</fieldset>
</form>	
</div>
<div class='clearfix'></div>
<div class='row'>
<div class='container'>
Please provide either your Google or IMAP preferences. When both are provided, your gmail preferences are used.
</div>
</div>
</script>
<script id="settings-notification-prefs-template" type="text/html">
<div class="row">
<div class="span7">
<div class="well">
<form id="notificationsForm" name="notificationsForm" class="form-horizontal">
<fieldset>
<legend>Notifications</legend>
<input name="id" type="hidden" value="{{id}}" /> 
<label><b>Browsing:</b></label>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contat_browsing" name='contat_browsing' value='true'/> 
Contact (any) is browsing
</label>
</div>
</div>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contat_assigned_browsing" name='contat_assigned_browsing' value='true'/> 
Contact (assigned to me) is browsing
</label>
</div>
</div>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contat_assigned_starred_browsing" name='contat_assigned_starred_browsing' value='true'/> 
Contact (assigned to me & starred) is browsing
</label>
</div>
</div>
<legend></legend>
<p></p>
<label><b>Email:</b></label>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contact_opened_email" name='contact_opened_email' value='true'/> 
Contact (any) has opened email
</label>
</div>
</div>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contact_assigned_opened_email" name='contact_assigned_opened_email' value='true'/> 
Contact (assigned to me) has opened email
</label>
</div>
</div>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contact_assigned_starred_opened_email" name='contact_assigned_starred_opened_email' value='true'/> 
Contact (assigned to me & starred) has opened email
</label>
</div>
</div>
<legend></legend>
<p></p>
<label><b>Link:</b></label>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contact_clicked_link" name='contact_clicked_link' value='true'/> 
Contact (any) has clicked a link
</label>
</div>
</div>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contact_assigned_clicked_link" name='contact_assigned_clicked_link' value='true'/> 
Contact (assigned to me) has clicked a link
</label>
</div>
</div>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="contact_assigned_starred_clicked_link" name='contact_assigned_starred_clicked_link' value='true'/> 
Contact (assigned to me & starred) has clicked a link
</label>
</div>
</div>
<legend></legend>
<p></p>
<label><b>Deal:</b></label>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="deal_created" name='deal_created' value='true'/> 
Deal is created
</label>
</div>
</div>
<div class="control-group">
<div class="controls">
<label class="checkbox">
<input type="checkbox" id="deal_closed" name='deal_closed' value='true'/> 
Deal is closed
</label>
</div>
</div>
<div class="form-actions">						
<button type="submit" class="save btn btn-primary">Save changes</button>
<a href="#settings" class="btn ">Cancel</a>
</div>
</fieldset>
</form>
</div>
</div>
</div>
</script>
<script id="settings-social-prefs-template" type="text/html">
<div class='span3 well'>
{{#if id}}	
<legend>{{service}}</legend>
{{#if picture}}
<i class="media-grid">
<img class="thumbnail" src='{{gravatarurl properties 75}}' width="75px" height="75px"/> </a>
</i>
{{/if}}	
{{#if email}}
<i class="media-grid">
<img class="thumbnail" src='{{picture}}' width="50px" height="50px"/> </a>
</i>
{{/if}}
<br/>
<label>{{name}}</label>
<br /> 
<a href="#social-prefs" class="btn btn-primary delete">Revoke</a> 
{{else}}
<legend><i class="media-grid">
</i><span>{{service}}</span><br/></legend>
<img class="thumbnail" src='img/{{service}}-logo-small.png'/> </a>
<br/> Allow access <a href='/scribe?service={{service}}'>here</a>
{{/if}}	
</div>
</script><script id="settings-user-prefs-template" type="text/html">
<!--  Contact View Detail in Detailed mode - when only one contact is shown -->
<div class='span8 well'>
<form id="userPrefs" class="form-horizontal">
<fieldset>
<input name="id" type="hidden" value="{{id}}" /> 		
<legend>Personal Preferences</legend>
<div class="control-group">  	 
<label class="control-label">Name <span class="field_req">*</span></label>
<div class="controls">
<input name="name" type="text" class="required" value="{{name}}" />
</div>
</div>         
<div class="control-group">
<label class="control-label">Template <span class="field_req">*</span></label> 
<div class="controls">
<select name="template" id="userPrefsTemplate" class="required" >
<option value="default" >Default (Minimalistic)</option>
<option value="1" >Amelia</option>
<option value="2" >Cerulean</option>
<option value="3" >Cyborg</option>
<option value="4" >Journal</option>
<option value="5" >Spruce</option>
<option value="6" >Readable</option>
<option value="7" >Slate</option>
<option value="8" >Spacelab</option>
<option value="9" >Simplex</option>
<option value="10" >Superhero</option>
<option value="11" >United</option>
</select> 
</div>
</div>
<div class="control-group">
<label class="control-label">Signature</label> 
<div class="controls">
<textarea class="span6" id="WYSItextarea" rows="10" name="signature" placeholder="Enter text ..."></textarea>
</div>
</div>	
<!--<div class="control-group">
<label class="control-label">Time Zone</label> 
<div class="controls">
<select id="timezone" name="timezone">
<option value="-12">(GMT-12:00) International Date Line West</option>
<option value="-11">(GMT-11:00) Midway Island, Samoa</option>
<option value="-10">(GMT-10:00) Hawaii</option>
<option value="-9">(GMT-09:00) Alaska</option>
<option value="-8">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
<option value="-8">(GMT-08:00) Tijuana, Baja California</option>
<option value="America/Denver">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
<option value="America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
<option value="America/Phoenix">(GMT-07:00) Arizona</option>
<option value="Canada/East-Saskatchewan">(GMT-06:00) Saskatchewan</option>
<option value="America/Tegucigalpa">(GMT-06:00) Central America</option>
<option value="America/Chicago">(GMT-06:00) Central Time (US &amp; Canada)</option>
<option value="America/Mexico_City">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
<option value="America/New_York">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
<option value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
<option value="America/Indiana/Indianapolis">(GMT-05:00) Indiana (East)</option>
<option value="America/Caracas">(GMT-04:30) Caracas</option>
<option value="Canada/Atlantic">(GMT-04:00) Atlantic Time (Canada)</option>
<option value="America/Manaus">(GMT-04:00) Manaus</option>
<option value="America/Santiago">(GMT-04:00) Santiago</option>
<option value="America/La_Paz">(GMT-04:00) La Paz</option>
<option value="Canada/Newfoundland">(GMT-03:30) Newfoundland</option>
<option value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires</option>
<option value="America/Sao_Paulo">(GMT-03:00) Brasilia</option>
<option value="America/Godthab">(GMT-03:00) Greenland</option>
<option value="America/Montevideo">(GMT-03:00) Montevideo</option>
<option value="America/Argentina/Buenos_Aires">(GMT-03:00) Georgetown</option>
<option value="Atlantic/South_Georgia">(GMT-02:00) Mid-Atlantic</option>
<option value="Atlantic/Azores">(GMT-01:00) Azores</option>
<option value="Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</option>
<option value="Europe/London">(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
<option value="Atlantic/Reykjavik">(GMT) Monrovia, Reykjavik</option>
<option value="Africa/Casablanca">(GMT) Casablanca</option>
<option value="Europe/Belgrade">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
<option value="Europe/Sarajevo">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
<option value="Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
<option value="Africa/Algiers">(GMT+01:00) West Central Africa</option>
<option value="Europe/Amsterdam">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
<option value="Europe/Minsk">(GMT+02:00) Minsk</option>
<option value="Africa/Cairo">(GMT+02:00) Cairo</option>
<option value="Europe/Helsinki">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
<option value="Europe/Athens">(GMT+02:00) Athens, Bucharest, Istanbul</option>
<option value="Asia/Jerusalem">(GMT+02:00) Jerusalem</option>
<option value="Asia/Amman">(GMT+02:00) Amman</option>
<option value="Asia/Beirut">(GMT+02:00) Beirut</option>
<option value="Africa/Windhoek">(GMT+02:00) Windhoek</option>
<option value="Africa/Harare">(GMT+02:00) Harare, Pretoria</option>
<option value="Asia/Kuwait">(GMT+03:00) Kuwait, Riyadh</option>
<option value="Asia/Baghdad">(GMT+03:00) Baghdad</option>
<option value="Africa/Nairobi">(GMT+03:00) Nairobi</option>
<option value="Asia/Tbilisi">(GMT+03:00) Tbilisi</option>
<option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
<option value="Asia/Tehran">(GMT+03:30) Tehran</option>
<option value="Asia/Muscat">(GMT+04:00) Abu Dhabi, Muscat</option>
<option value="Asia/Baku">(GMT+04:00) Baku</option>
<option value="Asia/Yerevan">(GMT+04:00) Yerevan</option>
<option value="Asia/Yekaterinburg">(GMT+05:00) Ekaterinburg</option>
<option value="Asia/Karachi">(GMT+05:00) Islamabad, Karachi</option>
<option value="Asia/Tashkent">(GMT+05:00) Tashkent</option>
<option value="Asia/Kolkata" selected="selected">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
<option value="Asia/Colombo">(GMT+05:30) Sri Jayawardenepura</option>
<option value="Asia/Katmandu">(GMT+05:45) Kathmandu</option>
<option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option>
<option value="Asia/Novosibirsk">(GMT+06:00) Almaty, Novosibirsk</option>
<option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option>
<option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
<option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
<option value="Asia/Shanghai">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
<option value="Asia/Ulaanbaatar">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
<option value="Asia/Kuala_Lumpur">(GMT+08:00) Kuala Lumpur, Singapore</option>
<option value="Asia/Taipei">(GMT+08:00) Taipei</option>
<option value="Australia/Perth">(GMT+08:00) Perth</option>
<option value="Asia/Seoul">(GMT+09:00) Seoul</option>
<option value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
<option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</option>
<option value="Australia/Darwin">(GMT+09:30) Darwin</option>
<option value="Australia/Adelaide">(GMT+09:30) Adelaide</option>
<option value="Australia/Sydney">(GMT+10:00) Canberra, Melbourne, Sydney</option>
<option value="Australia/Brisbane">(GMT+10:00) Brisbane</option>
<option value="Australia/Hobart">(GMT+10:00) Hobart</option>
<option value="Asia/Vladivostok">(GMT+10:00) Vladivostok</option>
<option value="Pacific/Guam">(GMT+10:00) Guam, Port Moresby</option>
<option value="Asia/Magadan">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
<option value="Pacific/Fiji">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
<option value="Pacific/Auckland">(GMT+12:00) Auckland, Wellington</option>
<option value="Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</option>
</select>				
</div>
</div>-->
<div class="control-group">
<label class="control-label">Default currency</label>
<div class="controls">
<select id="target_list"><option value="USD" selected="1">United States Dollar</option><option value="EUR">Euro</option><option value="DZD">Algerian Dinar</option><option value="ARS">Argentine Peso</option><option value="AUD">Australian Dollar</option><option value="BHD">Bahraini Dinar</option><option value="BOB">Bolivian Boliviano</option><option value="BWP">Botswanan Pula</option><option value="BRL">Brazilian Real</option><option value="GBP">British Pound Sterling</option><option value="BND">Brunei Dollar</option><option value="BGN">Bulgarian Lev</option><option value="CAD">Canadian Dollar</option><option value="KYD">Cayman Islands Dollar</option><option value="XOF">CFA Franc BCEAO</option><option value="CLP">Chilean Peso</option><option value="CNY">Chinese Yuan</option><option value="COP">Colombian Peso</option><option value="CRC">Costa Rican Colon</option><option value="HRK">Croatian Kuna</option><option value="CZK">Czech Republic Koruna</option><option value="DKK">Danish Krone</option><option value="DOP">Dominican Peso</option><option value="EGP">Egyptian Pound</option><option value="EEK">Estonian Kroon</option><option value="FJD">Fijian Dollar</option><option value="HNL">Honduran Lempira</option><option value="HKD">Hong Kong Dollar</option><option value="HUF">Hungarian Forint</option><option value="INR">Indian Rupee</option><option value="IDR">Indonesian Rupiah</option><option value="ILS">Israeli New Sheqel</option><option value="JMD">Jamaican Dollar</option><option value="JPY">Japanese Yen</option><option value="JOD">Jordanian Dinar</option><option value="KZT">Kazakhstani Tenge</option><option value="KES">Kenyan Shilling</option><option value="KWD">Kuwaiti Dinar</option><option value="LVL">Latvian Lats</option><option value="LBP">Lebanese Pound</option><option value="LTL">Lithuanian Litas</option><option value="MKD">Macedonian Denar</option><option value="MYR">Malaysian Ringgit</option><option value="MUR">Mauritian Rupee</option><option value="MXN">Mexican Peso</option><option value="MDL">Moldovan Leu</option><option value="MAD">Moroccan Dirham</option><option value="NAD">Namibian Dollar</option><option value="NPR">Nepalese Rupee</option><option value="ANG">Netherlands Antillean Guilder</option><option value="TWD">New Taiwan Dollar</option><option value="NZD">New Zealand Dollar</option><option value="NIO">Nicaraguan Córdoba</option><option value="NGN">Nigerian Naira</option><option value="NOK">Norwegian Krone</option><option value="OMR">Omani Rial</option><option value="PKR">Pakistani Rupee</option><option value="PGK">Papua New Guinean Kina</option><option value="PYG">Paraguayan Guarani</option><option value="PEN">Peruvian Nuevo Sol</option><option value="PHP">Philippine Peso</option><option value="PLN">Polish Zloty</option><option value="QAR">Qatari Rial</option><option value="RON">Romanian Leu</option><option value="RUB">Russian Ruble</option><option value="SVC">Salvadoran Colon</option><option value="SAR">Saudi Riyal</option><option value="RSD">Serbian Dinar</option><option value="SCR">Seychellois Rupee</option><option value="SLL">Sierra Leonean Leone</option><option value="SGD">Singapore Dollar</option><option value="SKK">Slovak Koruna</option><option value="ZAR">South African Rand</option><option value="KRW">South Korean Won</option><option value="LKR">Sri Lankan Rupee</option><option value="SEK">Swedish Krona</option><option value="CHF">Swiss Franc</option><option value="TZS">Tanzanian Shilling</option><option value="THB">Thai Baht</option><option value="TTD">Trinidad and Tobago Dollar</option><option value="TND">Tunisian Dinar</option><option value="TRY">Turkish Lira</option><option value="UGX">Ugandan Shilling</option><option value="UAH">Ukrainian Hryvnia</option><option value="AED">United Arab Emirates Dirham</option><option value="UYU">Uruguayan Peso</option><option value="UZS">Uzbekistan Som</option><option value="VND">Vietnamese Dong</option><option value="YER">Yemeni Rial</option><option value="ZMK">Zambian Kwacha</option></select>
</div>
</div>
<div class="control-group">
<label class="control-label">Task Reminders</label>
<div class="controls">
<label class="checkbox">
<input id="task_remainder" type="checkbox" name="task_reminder" value="true">
Send a daily email reminder when tasks are due 
</label>       
</div>
</div>
<div class="form-actions">
<a href="#" type="submit" class="save btn btn-primary">Save changes</a>
<a href="#settings" class="btn ">Cancel</a>
</div>
</fieldset>
</form>
</div>
</script><script id="settings-template" type="text/html">
<div class="row">
<div class="span12">
<div class="page-header">
<h1>Settings <small></small></h1>
</div>
</div>
</div>
<div class="row">
<div class="span3 offset well">
<div class="settings-content">
<legend>Personal Preferences</legend>
Set your name, email signature and choose from the various color schemes.
</div>
<a class='btn btn-primary' href='#user-prefs'>Go</a>
</div>
<div class="span3 offset well">
<div class="settings-content">
<legend>Email</legend>	
Associate your email to/fro with your contact.
</div>
<a class='btn btn-primary' href='#email'>Go</a>
</div>
<div class="span3 offset well">
<div class="settings-content">
<legend>Email Templates</legend>
Add, edit or delete your email templates.
</div>
<a class='btn btn-primary' href='#email-templates'>Go</a>
</div>
</div>
<div class="row">
<div class="span3 offset well">
<div class="settings-content">
<legend>Notifications</legend>
Receive notifications real-time when your contact is created or browing your website
</div>
<a class='btn btn-primary' href='#notification-prefs'>Go</a>
</div>
</div>
</script>
