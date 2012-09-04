<div class="modal hide" id="updateActivityModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Update Activity</h3>
	</div>
	<div class="modal-body">
        	<div id="newrelatedEvent">
				<span class="alert alert-info" style="font-size:11px">Events are time based such as
					meetings. They show up in calendar.</span> <br /> <br /> 
			 	
			 	<form id='updateActivityForm' name="newactivityForm"  method="post"> 
			 		<div class="row">	
						<div id="updateEvent" class="span6">
							<label for="title"> Event<span>*</span> </label>
							<span class="input "><input id="title" type="text" name="title" size="40" class="required"> </span>
						</div>
			       	</div>
				    <input type="text" name="start" class="span2" placeholder="start date(mm-dd-yyyy)" id="update-event-date-1">
					<input type="text" name ="start_time" class="timepicker" id="update-event-time-1" style="width:65px" placeholder="start time">&nbsp;to&nbsp;
				 	<input type="text" name="end" class="span2" placeholder="end date(mm-dd-yyyy)" id="update-event-date-2">
					<input type="text" name ="end_time" class="timepicker" id="update-event-time-2" style="width:65px" placeholder="end time"><br />
					<input type="checkbox" name="alldayevent" id="alldayevent">&nbsp;
					<span style="vertical-align:bottom">All day event</span>
			   </form>
			   
			</div>
		<div class="modal-footer">
			<a href="#" class="btn btn-primary" id="task_event_validate">Update</a>&nbsp;
			<a href="#" class="btn btn-danger" id="event_delete">Delete</a>
	    </div>
	</div>
</div>
<script id="calendar-template" type="text/html">

	<div class="row">
		<div class="span12">
 			<div class="page-header">
   				<h1>Calendar <small></small></h1>
				<a href="#activityModal" class="btn right" data-toggle="modal" style='top:-30px;position:relative'>
				   <span><i class='icon-plus-sign'/></span> Add Task</a>
  			</div>
		</div>
	</div>


	<div class="row-fluid">
		<div class="span3 well">
			<div id='tasks'></div>
		</div>

		<div class="span9">
			<div id='calendar'>
			<div id='loading' style='display:none'>loading...</div>
			</div>
		<br/>
		</div>
	</div>
</script> <script id="campaign-logs-collection-template" type="text/html">
 <div class="row">
<div class="page-header">
    <h1>Logs <small>Related to campaign</small></h1>
  </div>

</div>
<div class="row span10">

	<table class="table table-bordered table-stripped" >
		<thead>
    		<tr>
     			<th></th>
				<th>Contact</th>
      			<th>Message</th>
				<th>Time</th>
    		</tr>
  		</thead>
  
 	 	<tbody id="campaign-logs-model-list">
  		</tbody>
  
	</table>
</div>
</script>

<script id="campaign-logs-model-template" type="text/html">


<td><icon class='deleteWorkflow icon-remove-circle'></icon></td>  	
  <td><a href="#contact/{{subscriber_id}}">{{contactName}}</a></td>
  <td>{{getRequiredLog logs "m"}}</td>
  <td>{{getRequiredLog logs "t"}}</td>
  
	
<br/>
	
</script> <script id="campaigns-collection-template" type="text/html">
 	</br>
	<h1>List of Workflows</h1>
	<table class="table table-bordered" >
		<thead>
    		<tr>
     			<th></th>
      			<th>Message</th>
				<th>Time</th>
    		</tr>
  		</thead>
  
 	 	<tbody id="campaigns-model-list">
  		</tbody>
  
	</table>

	<div class="row">
		<div class="span3  enroll-success">
						
		</div>
	</div>

	<div >
		<select class="campaignSelect" id='campaignSelect'  name="campaignSelect">
  			<option class="emailSelectOptions" value="">Select..</option>
		</select>
	</div>

</script>

<script id="campaigns-model-template" type="text/html">


<td><icon class='deleteWorkflow icon-remove-circle'></icon></td>  	
  <td>{{getRequiredLog logs "m"}}</td>
  <td>{{getRequiredLog logs "t"}}</td>
	
<br/>
	
</script><script id="deals-collection-template" type="text/html">
		</br>
		<h1>List of Deals</h1>

		<table class="table table-bordered" >
			<thead>
    			<tr>
  					<th>Opportunity</th>
					<th>Value</th>
  					<th>Milestone</th>
  					<th>Close Date</th>
  					<th>Owner</th>
    			</tr>
  			</thead>  
  			<tbody id='deals-model-list'>
  			</tbody>
		</table>

</script>

<script id="deals-model-template" type="text/html">
<td leads='{{id}}' class='leads'>
	<div style='display:inline;padding-right:10px;height:auto;'>
		<img src="{{gravatarurl properties 40}}" width='40px' height='40px'>
	</div>
	<div style='height:auto;display:inline-block;vertical-align:text-top;'>
		<b> 
			{{name}} <br/>
 			{{relatesTo}}</br>
 			{{description}}
		</b>
	</div>
</td>  	

	<td>$ {{expected_value}}</td>
	<td>{{milestone}}({{probability}}%) </td>
	<td>{{epochToHumanDate "mm-dd-yy" close_date}}</td>
	<td>{{owner}}
</td>
</script><script id="email-social-collection-template" type="text/html">
    </br>
	<h2>List of Emails</h2>
	<table class="table table-bordered" >
		<thead>
			<tr>
      			<th>Date</th>
      			<th>From</th>
	  			<th>To</th>
      			<th>Subject</th>
	  			<th>Message</th>
    		</tr>
 		</thead>
 		<tbody id='email-social-model-list'>
		</tbody>
	</table>
	</br>
	<a href="#send-email" data-toggle="" class="btn left" id="email"><span><i class='icon-plus-sign'/></span> Send Email</a>
</script>

<!-- Imap-Email model -->
<script id="email-social-model-template" type="text/html">
	<td> {{date}} </td>
	<td> {{from}} </td>
	<td> {{to}} </td>
	<td> {{subject}} </td>
	<td> {{message}} </td>
</script><script id="events-collection-template" type="text/html">
	</br>
	<h2>List of Events</h2>
 
	<table class="table table-bordered" >
		<thead>
    		<tr>
     			<th></th>
      			<th>Id</th>
      			<th>Title</th>
      			<th>Start</th>
				<th>End</th>
    		</tr>
  		</thead>
  
 		<tbody id='events-model-list'>
    	</tbody>
  
	</table>
	</br>
</script>

<script id="events-modal-template" type="text/html">
<td><icon class='deleteNote icon-remove-circle'></icon></td>  	
  <td>{{id}} </td>
  <td>{{title}} </td>
   <td>{{start}}</td>
<td>{{end}}</td>
<br/>
</script><script id="notes-collection-template" type="text/html">
	</br>
	<h2>List of Notes</h2>
 
	<table class="table table-bordered" >
		<thead>
    		<tr>
     			<th></th>
      			<th>Id</th>
      			<th>subject</th>
      			<th>description</th>
    		</tr>
  		</thead>
  
 		<tbody id='notes-model-list'>
    	</tbody>
  
	</table>
	</br>
	<a href="#noteModal" data-toggle="modal" class="btn left" id="addNote"><span><i class='icon-plus-sign'/></span> Add Note</a>
</script>

<script id="notes-modal-template" type="text/html">
	<td><icon class='deleteNote icon-remove-circle'></icon></td>  	
  	<td>{{id}} </td>
  	<td>{{subject}} </td>
   	<td>{{note}}</td>
	<br/>
</script><script id="send-email-template" type="text/html">
	<div class="span8">
		<div class="well">
			<form id='emailForm' name="emailForm" class="form-horizontal">
				<fieldset>
					<legend>Send Email</legend>
					<div class="control-group">
                    	<label class="control-label">From</label>
						<div class="controls">
							<input type="text" class="span4" id="from" name="from" />
						</div>
					</div>

					<div class="control-group">
                    	<label class="control-label">To</label>
						<div class="controls">
							<input type="text" class="span4" name="to" id="to" value="{{getPropertyValue properties "email"}}" />
						</div>
					</div>
					
					<div class="control-group">
                    	<label class="control-label">Add Cc</label>
						<div class="controls">
							<input type="text" class="span4" name="email_cc" id="email_cc" />
						</div>
					</div>
					
			
  					<div class="control-group">
						<label class="control-label">Fill From Templates </label>
						<div class="controls">
							<select class="emailSelect" id='sendEmailSelect'  name="sendEmailSelect">
  								<option class="emailSelectOptions" value="">Select..</option>
							</select>
						</div>
					</div>
					
					
					<div class="control-group">
                    	<label class="control-label">Subject</label>
						<div class="controls">
							<input type="text" class="span4" name="subject" id="subject" placeholder="" />
						</div>
					</div>
					
					<div class="control-group">
                    	<label class="control-label">Body</label>
						<div class="controls">
							<textarea class="span4" rows="8" name="body" id="body" placeholder="Description"></textarea>
						</div>
					</div>					
				
					<div class="form-actions">          
						<a href="#contacts" class="btn ">Close</a> 
          				<a href="#"  id="sendEmail" class="btn btn-primary">Send</a>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</script><script id="stats-collection-template" type="text/html">
    </br>
	<h2>List of Activities</h2>
	<table class="table table-bordered" >
		<thead>
			<tr>
      			<th>Url</th>
      			<th>Ip Address</th>
    		</tr>
 		</thead>
 		<tbody id='stats-model-list'>
		</tbody>
	</table>
</script>

<!-- Imap-Email model -->
<script id="stats-model-template" type="text/html">
	<td> {{u}} </td>
	<td> {{i}} </td>
</script><script id="contact-detail-template" type="text/html">

<div class="row">

<div class="span12">
 <div class="page-header">
    <h2>	<img  class='thumbnail' src="{{gravatarurl properties 50}}" width="50" height="50" style='display:inline'/>
			{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}<small></small></h2>
	
	<div class="btn-group right" style='top:-18px;position:relative;padding-right:20px'>
				<a class="btn" href="#"><i class="icon-print"></i></a>
				<button class="btn">Actions</button>
  				<button class="btn dropdown-toggle" data-toggle="dropdown">
    				<span class="caret"></span>
  				</button>  			
  				<ul class="dropdown-menu">
					<li><a href='#contact-edit'>Edit</a></li>
					<li><a href='#' id='contact-actions-delete'>Delete</a></li>
					<li class='divider'></li>
					<li><a href='#add-note' data-toggle="modal" id="newNote">Add Note</a></li> 
					<li><a href='#'>Add Task</a></li>   	
					<li><a href='#'>Add Opportunity</a></li>   				
					<li><a href='#contact-duplicate'>Duplicate</a></li>
				
					<li><a href='#'>Import Contacts from CSV</a></li>
  				</ul>
			</div>		
  </div>
</div>
</div>

<div class="row">
	
<div class="span9">

<div class="subnav" >
		    <ul class="nav nav-pills" id="contactDetailsTab">
      			<li class=""><a data-toggle="tab" href="#notes">Notes</a></li>
      			<li class=""><a data-toggle="tab" href="#logs">Logs</a></li>
      			<li class=""><a data-toggle="tab" href="#messages">Messages</a></li>
      			<li class=""><a data-toggle="tab" href="#deals">Deals</a></li>
				<li class=""><a data-toggle="tab" href="#events">Events</a></li>
				<li class=""><a data-toggle="tab" href="#campaigns">Campaigns</a></li>
      			<li class=""><a data-toggle="tab" href="#details">Details</a></li>
      			<li class="active"><a data-toggle="tab" href="#activities">Activity <sup><span class="badge badge-success">3</span></sup> </a></li>
      			<li class=""><a data-toggle="tab" href="#mail">Mail</a></li>
    		</ul>

<div class="tab-content">
  <div class="tab-pane" id="notes">...</div>
  <div class="tab-pane" id="logs">...</div>
  <div class="tab-pane" id="messages">...</div>
  <div class="tab-pane" id="deals">...</div>
  <div class="tab-pane" id="events">...</div>
  <div class="tab-pane" id="campaigns">...</div>
  <div class="tab-pane" id="mail">...</div>
  <div class="tab-pane active" id="activities">...</div>
</div>

  		</div>

</div>


<!-- Contact Details -->
	<div class="span3">
		<div class='border-rect'>
		
			<div>
				<span class='bottom-line'><i class="icon-user "></i> Contact details</span>
			</div>
			<br/>
		
			<div>
				<!--<div style='float: left;height:auto;padding-right:10px;'>
					<img  class='thumbnail' src="{{gravatarurl properties 50}}" width="50" height="50"/>
				</div>-->		
				<div>
					<!--<span>{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}
					</span>-->
					{{#if title}}
						<span>{{getPropertyValue properties "title"}}</span>
					{{/if}}
					{{#if company}}
			 			<span>{{getPropertyValue properties "company"}}</span>
					{{/if}}
			 	</div>
			</div>
		
			<div class='clearfix'></div>	
			<div>	
				<br/>
				{{#if tags}}
					<i class="icon-tags"></i>
					{{#each tags}}		
						<span class="label" onmouseover="$(this).children().addClass('icon-remove')"
						onmouseout="$(this).children().removeClass('icon-remove')">
						{{this}}</span>
  					{{/each}}
					<a href="#"><i class="icon-plus-sign"></i></a>
				{{/if}}
			</div>

			<div class='clearfix'></div>	
			
			<br/>
			<br/>		
	
 			{{#each properties}}
     			<span style='display:inline'><icon class="{{icons name}}"></icon> <small>{{name}}</small></span> 
				{{#if subtype}}
					({{subtype}})
				{{/if}}
				{{value}} 
				<br/>     
				{{/each}}
				<br/><br/>

		<div id="widgets">
		</div>

	
		</div>

	
		<div style='float:right;'>
			<a href='#add-widget'>+ Add widget</>
		</div>


		</div>
	</div>
</script><script id="send-email-template" type="text/html">
	<div class="span8">
		<div class="well">
			<form id='emailForm' name="emailForm" class="form-horizontal" method="post">
				<fieldset>
					<legend>Send Email</legend>
					<div class="control-group">
                    	<label class="control-label">From</label>
						<div class="controls">
							<input type="text" class="span4" id="email_from" name="email_from" />
						</div>
					</div>

					<div class="control-group">
                    	<label class="control-label">To</label>
						<div class="controls">
							<input type="text" class="span4" name="email_to" id="email_to" value="{{getPropertyValue properties "email"}}" />
						</div>
					</div>
					
					<div class="control-group">
                    	<label class="control-label">Add Cc</label>
						<div class="controls">
							<input type="text" class="span4" name="email_cc" id="email_cc" />
						</div>
					</div>
					
			
  					<div class="control-group">
						<label class="control-label">Fill From Templates </label>
						<div class="controls">
							<select class="emailSelect" id='emailtemplate-model-list'  name="email_template">
  								<option class="emailSelectOptions" value="">Select..</option>
							</select>
						</div>
					</div>
					
					
					<div class="control-group">
                    	<label class="control-label">Subject</label>
						<div class="controls">
							<input type="text" class="span4" name="email_subject" id="email_subject" placeholder="" />
						</div>
					</div>
					
					<div class="control-group">
                    	<label class="control-label">Body</label>
						<div class="controls">
							<textarea class="span4" rows="8" name="email_description" id="email_description" placeholder="Description"></textarea>
						</div>
					</div>					
				
					<div class="form-actions">          
						<a href="#contacts" class="btn ">Close</a> 
          				<a href="#" type="submit" id="sendEmail" class="btn btn-primary">Send</a>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</script><script id="contact-view-collection-template" type="text/html">
 
<div class="btn-group right" style='top:-18px;position:relative'>
<button class="btn">All Contacts</button>
<button class="btn dropdown-toggle" data-toggle="dropdown">
    <span class="caret"></span>
  </button>
	<ul id = "contact-view-model-list" class="dropdown-menu">
    <li>
	<a href='#contacts-only'>Contacts</a>
	</li>
<li>
<a href='#companies-only'>Companies</a>
	</li>
<li class="divider"></li>
<li>
<a href='#contact-views'>Add/Edit View</a>
	</li>
	<li class="divider"></li>
</ul>
</div>

</script>

<script id="contact-view-model-template" type="text/html">
<a id='{{id}}' class="ContactView" href="#">{{name}}</a>
</script>


<script id = "contacts-custom-view-image-template" type="text/html">
	<td class='data' data='{{id}}'>
		<div style='display:inline;padding-right:10px;height:auto;'>
			<img src="{{gravatarurl properties 40}}" width='40px' height='40px'>
		</div>
		<div style='height:auto;display:inline-block;vertical-align:text-top;'>
			<b>
				{{getPropertyValue properties "first_name"}}
				{{getPropertyValue properties "last_name"}}
			</b>
			<br/>
			{{getPropertyValue properties "email"}}
		</div>
	</td>
</script>

<script id = "contacts-custom-view-first_name-template" type="text/html">
	<td class='data' data='{{id}}'>
		<b>
		{{getPropertyValue properties "last_name"}}
		</b>
	</td>
</script>


<script id = "contacts-custom-view-last_name-template" type="text/html">
	<td class='data' data='{{id}}'>
		<b>
			{{getPropertyValue properties "last_name"}}
		</b>
	</td>
</script>


<script id = "contacts-custom-view-email-template" type="text/html">
	<td class='data' data='{{id}}'>
		{{getPropertyValue properties "email"}}
	</td>
</script>


<script id = "contacts-custom-view-company-template" type="text/html">
	<td class='data' data='{{id}}'>
		{{getPropertyValue properties "title"}}<br/>
		{{getPropertyValue properties "company"}}
	</td>
</script>


<script id = "contacts-custom-view-tags-template" type="text/html">
  	<td class='data' data='{{id}}'> 
		{{#each tags}}
			<b>
				<span class="label">{{this}}</span>
			</b>
		{{/each}}
  </td>
</script>

<script id = "contacts-custom-view-created_time-template" type="text/html">
	<td class='data' data='{{id}}'>
		{{epochToHumanDate "mm-dd-yy" created_time}}
	</td>
</script>

<script id = "contacts-custom-view-updated_time-template" type="text/html">
	<td class='data' data='{{id}}'>
		{{epochToHumanDate "mm-dd-yy" updated_time}}
	</td>
</script>

<script id = "contacts-custom-view-title-template" type="text/html">
	<td class='data' data='{{id}}'>
		{{getPropertyValue properties "title"}}
	</td>
</script>

<script id="contact-view-template" type="text/html">
	<div class="span7">
		<div class="well">
			<form id="opportunityform" class="form-horizontal">
		  		<fieldset>
					<div class="control-group">			
						<legend>Contact View</legend>	
						<label class="control-label">View Name <span>*</span></label>
						<div class="controls">
							<input id="name" name="name" type="text" class="input span3 required" placeholder="Name of View" /><br/>
			  			</div>
					</div>
					<div class="control-group">
						<label class="control-label">Fields <span>*</span></label>
						<div class="controls" >
							<select id="multipleSelect"  class="required" multiple="multiple">
								<option value="first_name">First Name</option>
								<option value="last_name">Last Name</option>
								<option value="email">Email</option>
								<option value="company">Company</option>
								<option value="tags">Tags</option>
								<option value="title">Title</option>
								<option value="created_time">Created Time</option>
								<option value="updated_time">Updated_Time</option>
								<option value="image">Image</option>
							</select>
			  			</div>
					</div>
					{{#if "id"}}
						<input class="hide" name="id" value="{{id}}"/>
						{{else}}
						<input class="hide" name="id"/>
					{{/if}}
					<div class="form-actions">          
          				<a href="#" type="submit" class="save btn btn-primary" id="contactView">Save</a>
						<a href="#contact-views" class="btn ">Close</a>
					</div>
				</fieldset>
			</form>
			
			</div>
		</div>
</script><script id="contact-list-view-collection-template" type="text/html">

	<div class="row">
		<div class="span12">
			<div class="page-header">
    			<h1>List of Views</h1>
				<a href="#contact-view-add" class="btn right" id="addView" style='top:-25px;position:relative'><span><i class='icon-plus-sign'/></span> Add View</a>
	  		</div>
		</div>
	</div>
	<div class="row">
 		<div class="span9"> 
			<table class="table table-bordered" >
				<thead>
    				<tr>
    		   	    	<th></th>
      					<th>Name</th>
      					<th>Fields</th>
    				</tr>
  				</thead>
  
  				<tbody id='contact-list-view-model-list'>
  				</tbody>
			</table>
		</div>

		<div class='span3'>
			<div class="well" id='addview'>
			</div>
		</div>

	</div>
</script>
<script id="contact-list-view-model-template" type="text/html">
<td view='{{id}}' class='view'><icon class='delete icon-remove-circle'></icon></td>  	
<td> {{name}} </td>
<td>
  {{#each fields_set}}
	 {{ucfirst this}}</br> 
  {{/each}}
</td>
<br/>
</script>
<script id="contacts-grid-model-template" type="text/html">

<div class='span3'>
<div style='border: 1px solid #DDD;'>
<a href='#contact/{{id}}'>
  <img src="{{gravatarurl properties 50}}" width='50px' height='50px'>
<br/>
  {{getPropertyValue properties "email"}}
 {{getPropertyValue properties "first_name"}}
  {{getPropertyValue properties "last_name"}}
 <br/>
  {{#each tags}}
  <b>{{this}}</b>
  {{/each}}
<br/>
</a>
</div>
</div>
</script>
	

<script id="contacts-custom-view-model-template" type="text/html">



<!--
{{#each fields_set}}
	{{#equals "image" this}}
		 <td><img src="{{gravatarurl properties 40}}" width='40px' height='40px'></td>
	{{/equals}}
			<td>{{getPropertyFieldValue .. this}}</td>
{{/each}}

-->
</script>
	
	

<script id="contacts-custom-view-collection-template" type="text/html">

 <div class="row" >

<div class="span12">
 <div class="page-header">
    <h1>Contacts <small>persons & companies</small>
	</h1>

<div id= "view-list">

</div>


  </div>
</div>
</div>


<div class="row">

<div class="span3">

<div class="well" id='tasks'>
<div id='tagslist'></div>
</div>
</div>

<div class="span9"'>



<table id='contacts' class="table table-striped" style='overflow:scroll'>
<thead>
    <tr>
{{contactTableHeadings "fields_set"}}
    </tr>
  </thead>
  
  <tbody id='contacts-custom-view-model-list' style='overflow:scroll'>
  </tbody>
  
</table>


</div>



</div>

</div>
</script><script id="filter-contacts-template" type="text/html">
	<div class="span10">
		<div class="well">
			<form id="filterContactRorm" class="form-horizontal">
				<div class="formsection">
					<h3 class="formheading">Filter Contacts</h3>
					<table>
						<tbody>
							<tr>
								<td>
								  <select id="firstSelect" name="">	
									<option value="tag">Tagged With</option>
									<option value="class">Type</option>
									<option value="name">Name</option>
									<option value="jobtitle">Job Title</option>
									<option value="email">Email Address</option>
									<option value="phone">Phone Number</option>
									<option value="city">Town/City</option>
									<option value="state">State/Province</option>
									<option value="postalCode">Postal/Zip</option>
									<option value="country">Country</option>
									<option value="createdOn">Added On</option>
									<option value="updatedOn" selected="selected">Updated On</option>
									<option value="lastContactOn">Last Contacted On</option>
									<option value="hasEmailAddress">Has an Email Address</option>
									<option value="hasAddress">Has an Address</option>
									<option value="hasEmployees">Has People</option>
									<option value="hasTags">Has Tags</option>
									<option value="lastImport">Created in Last Import</option>
									<option value="org_tag">Organisation.Tagged With</option>
									<option value="org_name">Organisation.Name</option>
									<optgroup label="Custom Fields">	
										<option value="custom_label">label</option>
										<option value="custom_sfsadf">sfsadf</option>
										<option value="org_custom_label">Organisation.label</option>
										<option value="org_custom_sfsadf">Organisation.sfsadf</option>
									</optgroup>
									<optgroup label="DataTags"></optgroup>
								  </select>
								</td>

								<td>

								  <select id="secondSelect" name=" ">	
									
									<option value="TYPEEQUALS" class="class">is</option>
									<option value="COUNTRYEQUALS" class="country">is</option>
									<option value="NAME..EQUALS" class="name jobtitle email phone city state postalCode createdOn updatedOn lastContactOn org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">is</option>
									
									<option value="COUNTRYNOTEQUALS" class="country">isn't</option>
									<option value="NAME..NOTEQUALS" class="name jobtitle email phone city state postalCode createdOn org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">isn't</option>
									<option value="TYPENOTEQUALS" class="class">isn't</option>
									
									<option value="AFTER" class="createdOn updatedOn lastContactOn">is after</option>
									<option value="BEFORE" class="createdOn updatedOn lastContactOn">is before</option>
									<option value="WITHINLAST" class="createdOn updatedOn lastContactOn">is within last</option>
									<option value="WITHINNEXT" class="createdOn updatedOn lastContactOn">is within next</option>
									<option value="OLDERTHAN" class="createdOn updatedOn lastContactOn">is older than</option>
									<option value="STARTSWITH" class="name jobtitle email phone city state postalCode org_name custom_label custom_sfsadf org_custom_label org_custom_sfsadf">starts with</option>
									<option value="CONTAINS" class="name jobtitle email phone city state postalCode org_name">contains</option>
									<option value="YES" class="hasEmailAddress hasAddress hasEmployees hasTags lastImport">yes</option>
									<option value="No" class="hasEmailAddress hasAddress hasEmployees hasTags lastImport">No</option>	
					<option value="EQUALS" class="tag org_tag">is</option>
<option value="NOTEQUALS" class="tag org_tag">isn't</option>
<option value="ANYOF" class="tag">is any of</option>	  

								  </select>
								</td>

								
								<td>

								  <select id="thirdSelect" name="">
									<option value="" class="selected"></option>
									
									<option value="Person" class="TYPEEQUALS TYPENOTEQUALS">Person</option>
									<option value="Organization" class="TYPEEQUALS TYPENOTEQUALS">Organization</option>
									<option value="AF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Afghanistan</option>
									<option value="AX" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Åland Islands </option>
									<option value="AL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Albania</option>
									<option value="DZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Algeria</option>
									<option value="AS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">American Samoa</option>
									<option value="AD" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Andorra</option>
									<option value="AO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Angola</option>
									<option value="AI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Anguilla</option>
									<option value="AQ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Antarctica</option>
									<option value="AG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Antigua and Barbuda</option>
									<option value="AR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Argentina</option>
									<option value="AM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Armenia</option>
									<option value="AW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Aruba</option>
									<option value="AU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Australia</option>
									<option value="AT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Austria</option>
									<option value="AZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Azerbaijan</option>
									<option value="BS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bahamas</option>
									<option value="BH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bahrain</option>
									<option value="BD" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bangladesh</option>
									<option value="BB" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Barbados</option>
									<option value="BY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Belarus</option>
									<option value="BE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Belgium</option>
									<option value="BZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Belize</option>
									<option value="BJ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Benin</option>
									<option value="BM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bermuda</option>
									<option value="BT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bhutan</option>
									<option value="BO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bolivia, Plurinational State of</option>
									<option value="BQ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bonaire, Sint Eustatius and Saba</option>
									<option value="BA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bosnia and Herzegovina</option>
									<option value="BW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Botswana</option>
									<option value="BV" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bouvet Island</option>
									<option value="BR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Brazil</option>
									<option value="IO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">British Indian Ocean Territory</option>
									<option value="BN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Brunei Darussalam</option>
									<option value="BG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Bulgaria</option>
									<option value="BF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Burkina Faso</option>
									<option value="BI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Burundi</option>
									<option value="KH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Cambodia</option>
									<option value="CM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Cameroon</option>
									<option value="CA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Canada</option>
									<option value="CV" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Cape Verde</option>
									<option value="KY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Cayman Islands</option>
									<option value="CF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Central African Republic</option>
									<option value="TD" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Chad</option>
									<option value="CL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Chile</option>
									<option value="CN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">China</option>
									<option value="CX" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Christmas Island</option>
									<option value="CC" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Cocos (Keeling) Islands</option>
									<option value="CO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Colombia</option>
									<option value="KM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Comoros</option>
									<option value="CG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Congo</option>
									<option value="CD" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Congo, Democratic Republic of the</option>
									<option value="CK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Cook Islands</option>
									<option value="CR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Costa Rica</option>
									<option value="CI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Côte d'Ivoire</option>
									<option value="HR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Croatia</option>
									<option value="CU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Cuba</option>
									<option value="CW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Curaçao</option>
									<option value="CY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Cyprus</option>
									<option value="CZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Czech Republic</option>
									<option value="DK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Denmark</option>
									<option value="DJ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Djibouti</option>
									<option value="DM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Dominica</option>
									<option value="DO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Dominican Republic</option>
									<option value="EC" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Ecuador</option>
									<option value="EG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Egypt</option>
									<option value="SV" class="COUNTRYEQUALS COUNTRYNOTEQUALS">El Salvador</option>
									<option value="GQ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Equatorial Guinea</option>
									<option value="ER" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Eritrea</option>
									<option value="EE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Estonia</option>
									<option value="ET" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Ethiopia</option>
									<option value="FK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Falkland Islands (Malvinas)</option>
									<option value="FO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Faroe Islands</option>
									<option value="FJ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Fiji</option>
									<option value="FI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Finland</option>
									<option value="FR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">France</option>
									<option value="GF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">French Guiana</option>
									<option value="PF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">French Polynesia</option>
									<option value="TF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">French Southern Territories</option>
									<option value="GA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Gabon</option>
									<option value="GM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Gambia</option>
									<option value="GE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Georgia</option>
									<option value="DE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Germany</option>
									<option value="GH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Ghana</option>
									<option value="GI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Gibraltar</option>
									<option value="GR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Greece</option>
									<option value="GL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Greenland</option>
									<option value="GD" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Grenada</option>
									<option value="GP" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Guadeloupe</option>
									<option value="GU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Guam</option>
									<option value="GT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Guatemala</option>
									<option value="GG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Guernsey</option>
									<option value="GN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Guinea</option>
									<option value="GW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Guinea-Bissau</option>
									<option value="GY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Guyana</option>
									<option value="HT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Haiti</option>
									<option value="HM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Heard Island and McDonald Islands</option>
									<option value="VA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Holy See (Vatican City State)</option>
									<option value="HN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Honduras</option>
									<option value="HK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Hong Kong</option>
									<option value="HU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Hungary</option>
									<option value="IS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Iceland</option>
									<option value="IN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">India</option>
									<option value="ID" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Indonesia</option>
									<option value="IR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Iran, Islamic Republic of</option>
									<option value="IQ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Iraq</option>
									<option value="IE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Ireland</option>
									<option value="IM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Isle of Man</option>
									<option value="IL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Israel</option>
									<option value="IT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Italy</option>
									<option value="JM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Jamaica</option>
									<option value="JP" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Japan</option>
									<option value="JE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Jersey</option>
									<option value="JO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Jordan</option>
									<option value="KZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Kazakhstan</option>
									<option value="KE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Kenya</option>
									<option value="KI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Kiribati</option>
									<option value="KP" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Korea, Democratic People's Republic of</option>
									<option value="KR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Korea, Republic of</option>
									<option value="KW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Kuwait</option>
									<option value="KG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Kyrgyzstan</option>
									<option value="LA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Lao People's Democratic Republic</option>
									<option value="LV" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Latvia</option>
									<option value="LB" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Lebanon</option>
									<option value="LS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Lesotho</option>
									<option value="LR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Liberia</option>
									<option value="LY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Libyan Arab Jamahiriya</option>
									<option value="LI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Liechtenstein</option>
									<option value="LT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Lithuania</option>
									<option value="LU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Luxembourg</option>
									<option value="MO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Macao</option>
									<option value="MK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Macedonia, the former Yugoslav Republic of</option>
									<option value="MG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Madagascar</option>
									<option value="MW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Malawi</option>
									<option value="MY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Malaysia</option>
									<option value="MV" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Maldives</option>
									<option value="ML" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Mali</option>
									<option value="MT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Malta</option>
									<option value="MH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Marshall Islands</option>
									<option value="MQ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Martinique</option>
									<option value="MR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Mauritania</option>
									<option value="MU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Mauritius</option>
									<option value="YT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Mayotte</option>
									<option value="MX" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Mexico</option>
									<option value="FM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Micronesia, Federated States of</option>
									<option value="MD" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Moldova</option>
									<option value="MC" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Monaco</option>
									<option value="MN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Mongolia</option>
									<option value="ME" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Montenegro</option>
									<option value="MS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Montserrat</option>
									<option value="MA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Morocco</option>
									<option value="MZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Mozambique</option>
									<option value="MM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Myanmar</option>
									<option value="NA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Namibia</option>
									<option value="NR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Nauru</option>
									<option value="NP" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Nepal</option>
									<option value="NL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Netherlands</option>
									<option value="AN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Netherlands Antilles</option>
									<option value="NC" class="COUNTRYEQUALS COUNTRYNOTEQUALS">New Caledonia</option>
									<option value="NZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">New Zealand</option>
									<option value="NI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Nicaragua</option>
									<option value="NE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Niger</option>
									<option value="NG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Nigeria</option>
									<option value="NU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Niue</option>
									<option value="NF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Norfolk Island</option>
									<option value="MP" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Northern Mariana Islands</option>
									<option value="NO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Norway</option>
									<option value="OM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Oman</option>
									<option value="PK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Pakistan</option>
									<option value="PW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Palau</option>
									<option value="PS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Palestinian Territory, Occupied</option>
									<option value="PA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Panama</option>
									<option value="PG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Papua New Guinea</option>
									<option value="PY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Paraguay</option>
									<option value="PE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Peru</option>
									<option value="PH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Philippines</option>
									<option value="PN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Pitcairn</option>
									<option value="PL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Poland</option>
									<option value="PT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Portugal</option>								
									<option value="PR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Puerto Rico</option>
									<option value="QA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Qatar</option>
									<option value="RE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Réunion</option>
									<option value="RO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Romania</option>
									<option value="RU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Russian Federation</option>
									<option value="RW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Rwanda</option>
									<option value="BL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Saint Barthélemy</option>
									<option value="SH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Saint Helena, Ascension and Tristan da Cunha</option>
									<option value="KN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Saint Kitts and Nevis</option>
									<option value="LC" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Saint Lucia</option>
									<option value="MF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Saint Martin</option>
									<option value="PM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Saint Pierre and Miquelon</option>
									<option value="VC" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Saint Vincent and the Grenadines</option>
									<option value="WS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Samoa</option>
									<option value="SM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">San Marino</option>
									<option value="ST" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Sao Tome and Principe</option>
									<option value="SA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Saudi Arabia</option>
									<option value="SN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Senegal</option>
									<option value="RS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Serbia</option>
									<option value="SC" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Seychelles</option>
									<option value="SL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Sierra Leone</option>
									<option value="SG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Singapore</option>
									<option value="SX" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Sint Maarten (Dutch part)</option>
									<option value="SK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Slovakia</option>
									<option value="SI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Slovenia</option>
									<option value="SB" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Solomon Islands</option>
									<option value="SO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Somalia</option>
									<option value="ZA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">South Africa</option>
									<option value="GS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">South Georgia and the South Sandwich Islands</option>
									<option value="SS" class="COUNTRYEQUALS COUNTRYNOTEQUALS">South Sudan</option>
									<option value="ES" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Spain</option>
									<option value="LK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Sri Lanka</option>
									<option value="SD" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Sudan</option>
									<option value="SR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Suriname</option>
									<option value="SJ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Svalbard and Jan Mayen</option>
									<option value="SZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Swaziland</option>
									<option value="SE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Sweden</option>
									<option value="CH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Switzerland</option>
									<option value="SY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Syrian Arab Republic</option>
									<option value="TW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Taiwan</option>
									<option value="TJ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Tajikistan</option>
									<option value="TZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Tanzania, United Republic of</option>
									<option value="TH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Thailand</option>
									<option value="TL" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Timor-Leste</option>
									<option value="TG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Togo</option>
									<option value="TK" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Tokelau</option>
									<option value="TO" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Tonga</option>
									<option value="TT" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Trinidad and Tobago</option>
									<option value="TN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Tunisia</option>
									<option value="TR" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Turkey</option>
									<option value="TM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Turkmenistan</option>
									<option value="TC" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Turks and Caicos Islands</option>
									<option value="TV" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Tuvalu</option>
									<option value="UG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Uganda</option>
									<option value="UA" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Ukraine</option>
									<option value="AE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">United Arab Emirates</option>
									<option value="GB" class="COUNTRYEQUALS COUNTRYNOTEQUALS">United Kingdom</option>
									<option value="US" class="COUNTRYEQUALS COUNTRYNOTEQUALS">United States</option>
									<option value="UM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">United States Minor Outlying Islands</option>
									<option value="UY" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Uruguay</option>
									<option value="UZ" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Uzbekistan</option>
									<option value="VU" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Vanuatu</option>
									<option value="VE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Venezuela, Bolivarian Republic of</option>
									<option value="VN" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Viet Nam</option>
									<option value="VG" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Virgin Islands, British</option>
									<option value="VI" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Virgin Islands, U.S.</option>
									<option value="WF" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Wallis and Futuna</option>
									<option value="EH" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Western Sahara</option>
									<option value="YE" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Yemen</option>
									<option value="ZM" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Zambia</option>
									<option value="ZW" class="COUNTRYEQUALS COUNTRYNOTEQUALS">Zimbabwe</option>
								  </select>&nbsp;

								</td>


<td>
	<select id="fourthSelect" name="">
		<option value="" class="EQUALS">--</option>
<option value="" class="NOTEQUALS">--</option>
<option value="" class="ANYOF">--</option>
	</select>
</td>

								<td>
									<i class="filter-contacts-multiple-add icon-plus"></i>
								</td>&nbsp;&nbsp;

								<td>
									<i class="filter-contacts-multiple-remove icon-remove-circle" style="display: none"></i>
								</td>
							</tr>
						</tbody>
					</table>
				</div>			
			</form>
		</div>
	</div>
</script><script id="contacts-grid-model-template" type="text/html">
<div class='span3'>
<div style='border: 1px solid #DDD;'>
<a href='#contact/{{id}}'>
  <img class='thumbnail' src="{{gravatarurl properties 50}}" width='50px' height='50px' style='display:inline'>
<br/>
  {{getPropertyValue properties "email"}}
 {{getPropertyValue properties "first_name"}}
  {{getPropertyValue properties "last_name"}}
 <br/>
  {{#each tags}}
  <b>{{this}}</b>
  {{/each}}
<br/>
</a>
</div>
</div>
</script>
	
<script id="contacts-model-template" type="text/html">
	<td class='data' data='{{id}}'>
<div style='display:inline;padding-right:10px;height:auto;'>
 <img class='thumbnail' src="{{gravatarurl properties 40}}" width='40px' height='40px' style='display:inline'>
</div>
<div style='height:auto;display:inline-block;vertical-align:text-top;'>
<b>
{{getPropertyValue properties "first_name"}}
  {{getPropertyValue properties "last_name"}}
</b>
<br/>
  {{getPropertyValue properties "email"}}
</div>
<div style='float:right'></div>
</td>  	
  	<td>{{getPropertyValue properties "title"}}<br/>
{{getPropertyValue properties "company"}}</td>
  	<td> {{#each tags}}
  <b><span class="label">{{this}}</span></b>
  {{/each}}</td>
	<td> Lead Score</td>
</script>
	
	

<script id="contacts-collection-template" type="text/html">

 <div class="row" >

<div class="span12">
 <div class="page-header">
    <h1>Contacts <small>persons & companies</small>
	</h1>

<div class="btn-group right" id ="view-list" style='top:-18px;position:relative'>
  <button class="btn">All Contacts</button>
  <button class="btn dropdown-toggle" data-toggle="dropdown" id="viewList" style="margin-left: -5px"><span class="caret" ></span>
  </button>
  <ul class="dropdown-menu" id= "view-list">
    <li>
	<a href='#contacts-only'>Contacts</a>
	</li>
	<li>
		<a href='#companies-only'>Companies</a>	
	</li>
	<li class="divider"></li>

<li>
<a href='#contact-views'>Add/Edit View</a>
	</li>

  </ul>
</div>

<!--
<ul class="nav nav-tabs right" style="top:-18px;position:relative;border-bottom:0px" id='contacts-tabs'>
                        <li class="active">
                            <a href="#all" data-toggle="tab">All</a>
                        </li>
                        <li class="">
                            <a href="#persons" data-toggle="tab">Persons</a>
                        </li>
                        <li class="">
                            <a href="#companies" data-toggle="tab">Companies</a>
                        </li>
					 <li class="">
                            <a href="#recent" data-toggle="tab">Recent</a>
                        </li>
                    </ul>
-->
  </div>
</div>
</div>


<div class="row">

<div class="span3">

<div class="well" id='tasks'>
<div id='tagslist'></div>
</div>
</div>

<div class="span9"'>



<table id='contacts' class="table table-striped" style='overflow:scroll'>
<thead>
    <tr>
    
      <th>Name</th>
      <th>Work</th>
      <th>Tags</th>
	  <th>Lead Score</th>
    </tr>
  </thead>
  
  <tbody id='contacts-model-list' style='overflow:scroll'>
  </tbody>
  
</table>
</div>
</div>
</div>
</script><script id="dashboard-template" type="text/html">
<h1>Dashboard</h1>
</script><script id="import-contacts-template" type="text/html">

	<h4>Upload file</h4>
	<div id='file-upload-div'></div>
</script>

<script id="import-contacts-2-template" type="text/html">

	<label>Tags (Optional)</label>
	<input id ='tags-import' class="tags-typeahead" name="tags" class="tags" type="text"/>
	<br/>		

	<div class="row">
		<div class="span5">
			<div class="alert alert-error fname-not-found-error" style="display:none">
				<a class="close" data-dismiss="alert" href="#">×</a> 
				First Name is mandatory. Please select first name.  
			</div>
		</div>
	</div>

	<div class="row">
		<div class="span5">
			<div class="alert alert-error lname-not-found-error" style="display:none">
				<a class="close" data-dismiss="alert" href="#">×</a> 
				Last Name is mandatory. Please select last name.  
			</div>
		</div>
	</div>

    
	<div class="row">
		<div class="span5">
			<div class="alert alert-error fname-duplicate-error" style="display:none">
				<a class="close" data-dismiss="alert" href="#">×</a>
				You have assigned First Name to more than one element. 
				Please ensure that first name is assigned to only one element. 
			</div> 
		</div>
	</div>

	<div class="row">
		<div class="span5">
			<div class="alert alert-error lname-duplicate-error" style="display:none">
				<a class="close" data-dismiss="alert" href="#">×</a>
				You have assigned Last Name to more than one element. 
				Please ensure that last name is assigned to only one element. 
			</div> 
		</div>
	</div>
	

	<table class='table table-bordered table-striped' style="display:block;">

	 	<thead>
			<tr>
	 			{{#eachkeys data.[0]}}
	 			<th>
	 				<select class='import-select'>
						<option value="first_name">First Name</option>
						<option value="last_name">Last Name</option>
						<option value="company">Company</option>
						<option value="tag">Tag</option>
						<option value="jobtitle">Title</option>
  						<optgroup label="Email">
							<option value="email">-</option>
							<option value="home-email">Home</option>
    						<option value="work-email">Work</option>
  						</optgroup>
  						<optgroup label="Phone">
							<option value="home-phone">Home</option>
    						<option value="work-phone">Work</option>	
							<option value="mobile-phone">Mobile</option>
							<option value="main-phone">Main</option>
							<option value="home-fax">Home fax</option>
							<option value="work-fax">Work fax</option>
							<option value="other">Other</option>
  						</optgroup>
    						<optgroup label="Website">
    						<option value="URL-WEBSITE">Website</option>
							<option value="SKYPE-WEBSITE">Skype</option>
							<option value="TWITTER-WEBSITE">Twitter</option>
							<option value="LINKED_IN-WEBSITE">LinkedIn</option>
							<option value="FACEBOOK-WEBSITE">Facebook</option>
							<option value="XING-WEBSITE">Xing</option>
							<option value="FEED-WEBSITE">Blog</option>
							<option value="GOOGLE_PLUS-WEBSITE">Google+</option>
							<option value="FLICKR-WEBSITE">Flickr</option>
							<option value="GITHUB-WEBSITE">GitHub</option>
							<option value="YOUTUBE-WEBSITE">YouTube</option>
  						</optgroup>
  						<optgroup label="Websites">
							<option value="home-websites">Home</option>
    						<option value="work-websites">Work</option>	
  						</optgroup>
  						<optgroup label="Address">
    						<option value="home-address">Home</option>
							<option value="postal-address">Postal</option>
							<option value="office-address">Office</option>
  						</optgroup>
							<option value="city">City</option>
							<option value="state">State</option>
							<option value="zip">Zip</option>
							<option value="country">Country</option>
					</select>
				 </th>
	 			{{/eachkeys}}
	 		</tr>
	 	</thead>

	 	<tbody id='import-tbody'>
    
     	{{#each data}}
    		<tr>
    			{{#eachkeys this}}
    				<td>{{this.value}}</td>
    			{{/eachkeys}}
		    </tr>
	    {{/each}}

	</table>

	<a class='btn btn-primary' id='import-contacts'>Import</a>
</script><!-- New (Activity) Modal views -->
	<div class="modal hide" id="activityModal">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3>Add New Activity</h3>
		</div>
		
		<div class="modal-body">
			<a href="#" id="event" style="border-right: 1px solid #BFBFBF; padding-right: 8px; color:black;">
			   Event (Calendar)</a>
			<a href="#" id="task" style="padding-left: 8px;">Task (To-do)</a>
			<input type="hidden" value="event" id="hiddentask" /><br /> <br /> 
			
			<div id="relatedEvent" >
				<p><i><i class="icon-calendar"></i> Events are time based such as
					meetings. They show up in calendar.</i></p><br/> 	 	
				
				<!--Event form  -->
				<form id='activityForm' name="activityForm" method="post">
					<fieldset>
						
						<div id="addEvent" class="control-group">
							<label class="control-label"><b>Event Name:</b></label>
							<div class="controls">
								<input id="title" placeholder='Name of the event' type="text" name="title" class="required">
							</div>
						</div>
			       	
			       	<div class="row">
				       	<div class="control-group span3">
	                    	<label class="control-label"><b>Start Date:</b></label>
							<div class="controls">
								<input type="text" name="start" placeholder="mm-dd-yyyy" id="event-date-1">							
							</div>
						</div>
						<div class="control-group span2">
	                    	<label class="control-label"><b>Start Time:</b></label>
							<div class="controls">
								<input type="text" name ="start_time" class="timepicker" id="event-time-1" style="width:65px" placeholder="time">		
							</div>
						</div>
					</div>
					<div class="row">
					<div class="control-group span3">
                    	<label class="control-label"><b>End Date:</b></label>
						<div class="controls">
							<input type="text" name="end" placeholder="mm-dd-yyyy" id="event-date-2">									
						</div>
					</div>
					<div class="control-group span2">
                    	<label class="control-label"><b>End Time:</b></label>
						<div class="controls">							
							<input type="text" name ="end_time" class="timepicker" id="event-time-2" style="width:65px" placeholder="time"><br />		
						</div>
					</div>			 						
				 	</div>
				 	<div class="control-group">                    	
						<div class="controls">
						<label class="checkbox">
							<input type="checkbox" name="alldayevent" id="alldayevent">						
						<span style="vertical-align:bottom; display:inline;">All day event</span></label>
						</div>
					</div>				
					</fieldset>				
				</form>
				
			</div>
			
			<div id="relatedtask" style="display:none">
				<div>
					<p><i><i class="icon-tasks"></i> Tasks are like to-dos. Result
						oriented. You can assign a category such as call, <br/>email etc</i></p><br/>
				</div>
			    
			    <!--Task form -->
				<form id='taskForm' name="taskForm" method="post">
					<fieldset>
						<div class="row">
							<div id="addTask" class="span3 control-group">
								<label for="subject" class="control-label"> <b>Task:</b> <span class="field_req">*</span></label>
								<div class="controls"><span class="input "><input id="subject" type="text"
							  		  name="subject" size="40" class="required"> </span>
							  	</div>
							</div>
							<div id="taskCategory" class="span2 control-group">					
								<label for="type" class="control-label"><b> Category: </b><span class="field_req">*</span></label>
								<div class="controls">
									<span class="input">
									<select name="type" id="type" size="1" class="input-small required">
										<option></option>
										<option value="CALL">Call</option>
										<option value="EMAIL">Email</option>
										<option value="FOLLOW_UP">Follow-up</option>
										<option value="MEETING">Meeting</option>
										<option value="MILESTONE">Milestone</option>
										<option value="SEND">Send</option>
										<option value="TWEET">Tweet</option>
									</select> </span>
								</div>
							</div>
						</div>
						<div class="row">
					    	<div class="span3 control-group">
								<label for="due" class="control-label"><b>Date (Due):</b></label>
								<div class="controls">
									<input type="text" name="due" class="" placeholder="mm-dd-yyyy" id="task-date-1">
								</div>
							</div>
							<div class="span2 control-group" >
								<label for="priority_type" class="control-label"><b>Priority: </b><span class="field_req">*</span></label>
								<div class="controls"> 
									<span class="input ">
									<select	name="priority_type" id="priority_type" size="1" class="input-small required">
										<option></option>
										<option value="DEFAULT">Default</option>
										<option value="HIGH">High</option>
										<option value="MEDIMUM">Medium</option>
										<option value="LOW">Low</option>
									</select> </span>
								</div>
							</div>
						</div> 
						<div class="row" id="addRelation">
						    <div class="span3 control-group">
								<label for="relation" class="control-label"><b> Related To: </b></label> 
								<div class="controls">
									<span class="input "><input id="relation" type="text" name="Relation" size="40"> </span>
								</div>
						    </div>
						</div>
					</fieldset>				
				</form>	
				</div>
			</div>
			<div class="modal-footer">
				<a href="#" class="btn btn-primary" id="task_event_validate">Save changes</a>
			</div>
		
	</div>	
	<!-- End of Modal views -->
<!-- New (Contact) Modal views -->
	<div class="modal hide" id="companyModal">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3>Add Company</h3>
		</div>
		<div class="modal-body">
			<form id='companyForm' name="companyForm" method="post">
				<fieldset>
					<p>
					<div class="control-group">
                    	<label class="control-label"><b>Company:</b> <span class="field_req">*</span></label>
						<div class="controls">
							<input name="cmpany" type="text" class="required" id="cmpany" placeholder="Company"
							style="width:150px;" />
						</div>
					</div>				
					<div class="control-group">
                    	<label class="control-label"><b>URL:</b> <span class="field_req">*</span></label>
						<div class="controls">
							<div class="input-prepend"">
								<span class="add-on">http://</span><input class="input-large required" name="url"
									type="text" id="url" placeholder="www." />
							</div>
						</div>
					</div>				
				</fieldset>
			</form>
		</div>
		<div class="modal-footer">
			<a href="#continue-company" class="btn" id="continue-company">Continue
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
				<fieldset>
					<div class="control-group">
                    	<label class="control-label"><b>Description</b></label>
						<div class="controls">
							<textarea rows="3" id="description" placeholder="Description"></textarea>
						</div>
					</div>
					<div class="control-group">
                    	<label class="control-label"><b>About</b></label>
						<div class="controls">
							<input name="about" type="text" id="about" placeholder="About" />
						</div>
					</div>					
				</fieldset>
			</form>
		</div>
		<div class="modal-footer">
			<a href="#" class="btn btn-primary" id="note_validate">Save
				changes</a>
		</div>

	</div>
	<!-- End of Modal views --><!-- New (Person) Modal views -->
	<div class="modal hide" id="personModal">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3>Add Person</h3>
		</div>
		<div class="modal-body">
			<form id='personForm' name="personForm" method="post">
				<fieldset>
					<div class="control-group">
                    	<label class="control-label"><b>Name:</b> <span class="field_req">*</span></label>
						<div class="controls">
							<input
							name="first_name" type="text" class="required" id="fname" 
							placeholder="First name" />
							  <input name="last_name" class="required"  type="text"
							id="lname" placeholder="Last name" />
						</div>
					</div>
					<div class="control-group">
                    	<label class="control-label"><b>Company:</b></label>
						<div class="controls">
							<input name="company" type="text" id="company" placeholder="Company" />
						</div>
					</div>
					<div class="control-group">
                    	<label class="control-label"><b>Job Description:</b></label>
						<div class="controls">
							<input name="title" type="text" id="title" placeholder="Job title" />
						</div>
					</div>
					
					<div class="row">
						<div class="span5  duplicate-email">
						
						</div>
					</div>
					
					<div class="control-group">
                    	<label class="control-label"><b>Email:</b> </label>
						<div class="controls">
							 <input name="email" type="text" id="email" placeholder="Email" />
						</div>
					</div>
					<div class="control-group">
                    	<label class="control-label"><b>Tags:</b> </label>
						<div class="controls">
							 <input name="tags" type="text" id="tags-new-person" class="tags-typeahead"/>
						</div>
					</div>	
					<div class="control-group">                    	
						<div class="controls">
							<span style="display:inline;"><i class='icon-arrow-right'></i></span><a href="#import" data-dismiss="modal" id="import-link"> Click here to import multiple contacts from a file</a>
						</div>	
					</div>						
				</fieldset>
			</form>
		</div>
		<div class="modal-footer">
			<a href="#continue-contact" class="btn" id='continue-contact'>Continue
				Editing</a> <a href="#" class="save btn btn-primary" id="person_validate">Save
				changes</a>
		</div>

	</div>
	<!-- End of Modal views -->
	<script id="notes-collection-template" type="text/html">
 <h2>List of Notes</h2>
 
<table class="table table-bordered" >
<thead>
    <tr>
     <th></th>
      <th>Id</th>
      <th>subject</th>
      <th>description</th>
    </tr>
  </thead>
  
  <tbody id='notes-model-list'>
  </tbody>
  
</table>
</script>

<script id="notes-modal-template" type="text/html">
<td><icon class='deleteNote icon-remove-circle'></icon></td>  	
  <td>{{id}} </td>
  <td>{{subject}} </td>
   <td>{{note}}</td>
<br/>
</script><script id="notify-html-template" type="text/html">

<div class=''>
	<div class="popover" style='display:inline;position:relative;color:#333'>
            <h3 class="popover-title">Browsing Notification</h3>
            <div class="popover-content">
				<div>
				<img  class='thumbnail' src="{{gravatarurl properties 50}}" width="50" height="50" style='display:inline'/>			
				<span style='padding-left:5px'>
					<b>{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</b><br/>
					{{getPropertyValue properties "title"}} {{getPropertyValue properties "company"}}		
				</span>
				</div>             
			</div>
   </div>
</div>

</script><script id="opportunities-collection-template" type="text/html">

<div class="row">
	<div class="span12">
		<div class="page-header">
    		<h1>Deals <small>Opportunities</small></h1>
			<a href='#deals-add' class='btn right' style='top:-30px;position:relative'><i class='icon-plus-sign'/> Add Deal</a>
	  		</div>
	</div>
</div>
<div class="row">
	<div class="span9">

<div id ='total-pipeline-chart' style='width:100%; height:300px'></div>

<br/><br/>

		<table class="table table-bordered" >
			<thead>
    			<tr>
  					<th>Opportunity</th>
					<th>Value</th>
  					<th>Milestone</th>
  					<th>Close Date</th>
  					<th>Owner</th>
    			</tr>
  			</thead>  
  			<tbody id='opportunities-model-list'>
  			</tbody>
		</table>

	
	</div>
	<div class="span3">
		
<div class="well">
<div id ='pie-deals-chart' style='width:100%; height:300px'></div>

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

<script id="opportunities-model-template" type="text/html">
<td leads='{{id}}' class='leads'>
	<div style='display:inline;padding-right:10px;height:auto;'>
		<img src="{{gravatarurl properties 40}}" width='40px' height='40px'>
	</div>
	<div style='height:auto;display:inline-block;vertical-align:text-top;'>
		<b> 
			{{name}} <br/>
 			{{relatesTo}}</br>
 			{{description}}
		</b>
	</div>
</td>  	

	<td>$ {{expected_value}}</td>
	<td>{{milestone}}({{probability}}%) </td>
	<td>{{epochToHumanDate "mm-dd-yy" close_date}}</td>
	<td>{{owner}}
</td>
</script><script id="opportunity-add-template" type="text/html">
	<div class="span8">
		<div class="well">
			<form id="opportunityform" class="form-horizontal">
		  		<fieldset>
					<div class="control-group">			
						<legend>Add Deal</legend>	
						<label class="control-label">Name <span class="field_req">*</span></label>
						<div class="controls">
							<input id="name" name="name" type="text" class="span4 required" 
								   placeholder="Name of deal" Style="width:301px"/>
			  			</div>
					</div>
					
					<div class="control-group">
						<label class="control-label">Related To <span class="field_req">*</span></label>
						<div class="controls" id="contactTypeAhead">
							<div>
								<div class="pull-left" style="margin-left:-25px">
									<ul name= "contacts" class= "tags" ></ul>
								</div>
									<input type="text" id = "relates_to" class="typeahead typeahead_contacts" data-provide="typeahead" data-mode="multiple" />
							</div>	
							<span class="help-inline">Some help line for Related To</span>
			  			</div>
					</div>
					
					<div class="control-group">
						<label class="control-label">Description</label>
						<div class="controls">
							<textarea id="description" name= "description" rows="3" class="input span4" 
									  style="width:301px" placeholder="Add comment"></textarea>					
			  			</div>
					</div>
					
					<div class="control-group">
               			<label class="control-label">Value <span class="field_req">*</span></label>
                		<div class="controls"> 
							<input type="text" name="expected_value" class="input-small required" 
								   placeholder="Value of deal"/>
						</div>
					</div>
					
					<div class="control-group">				
						<label class="control-label">Milestone <span class="field_req">*</span></label>
						<div class="controls">
							<select id="milestone" name="milestone" class="input-small required" 
									Style="width:100px">
								<option value="">Select..</option>

							</select>	
							<span class="help-inline">Some help line for Mlestone</span>				
			  			</div>
					</div>
					
					<div class="control-group">	
						<label class="control-label">Probability (%) <span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" id="probability" name="probability" class="input-small required" placeholder="Probability %"/>				
			  			</div>
					</div>
					
					<div class="control-group">
						<label class="control-label">Close Date <span class="field_req">*</span></label>
						<div class="controls">
							{{#if close_date}}
								<input id="close_date" type= "date_input" name="close_date" class="input required" placeholder="MM/DD/YY"/>				
								{{else}}
									<input id="close_date" type= "date_input" name="close_date" class="input required" placeholder="MM/DD/YY"/>	
							{{/if}}
						</div>
					</div>
					
					<div id="owner">				
						
						
					</div>
					{{#if id}}
						<input type="text" name="id" class="hide" value={{id}}>
					{{/if}}

					<div class="form-actions">          
          				<a href="#" type="submit" id="opportunityAdd" class="save btn btn-primary">Save changes</a> 
						<a href="#deals" class="btn ">Close</a>
					</div>
		  		</fieldset>
			</form>
			
		</div>
	</div>
</script>


<!-- Popuplate Owners options  -->

<script id="owners-collection-template" type="text/html">
 	<div class="control-group">
	<label class="control-label">Owner <span class="field_req">*</span></label>
		<div class="controls">
			<select id='owners-model-list' class="required" name="owner">
  				<option value="">Select..</option>
			</select>
		</div>
	</div>
</script>
<Script id="owners-model-template" type="text/html">
	{{name}}
</Script><script id="opportunity-detail-template" type="text/html">
	<div class="row">
		<div class="span12">
			<div class="page-header">
				<h1>
					{{name}}
					<div class="btn-group" style='float:right;display:inline'>
						<button class="btn" style="border-radius:3px">More</button>
  						<button class="btn dropdown-toggle" data-toggle="dropdown">
    						<span class="caret"></span>
  						</button>
  						<ul class="dropdown-menu" style="font-size:12px">
							<li><a href='#edit' id="editOpportunity">Edit</a></li>
							<li><a href='#' class="delete">Delete</a></li>
						</ul>
					</div>
					<div class="btn-group" style='float:right;display:inline'>
						<button class="btn" style="border-radius:3px">Move</button>
						<button class="btn dropdown-toggle" data-toggle="dropdown">
    						<span class="caret"></span>
  						</button>
						<ul class="dropdown-menu" id="move" style="font-size:12px">
							<li><a href='#'  id="loss" >loss</a></li>
							<li ><a href='#' id="progress" >progress</a></li>
							<li ><a href='#' id="won" >won</a></li>
						</ul>
					</div>
				</h1>
  			</div>
			<div class="span3">
				<div class="well" display:>
					<b>Deal Name<b>       : {{name}}<br/>
					<b>Descreption <b>    : {{description}}
				</div >
				<div class="well" >
					Owner :{{owner}}</br>
					Email :{{email}}
				</div>
			</div>
			<div class="span6"  >
				<div class="row">
					<div class="span7 well">
						<div class="span1" style="display:inline; "><span style="font-size:14px; font-weight:bold ">value</span><br/>
							<span style="font-size:13px" >$ {{expected_value}}</span>
						</div>
						<div class="span1"style="display:inline; margin-left:50px ">
							<span style="font-size:14px; font-weight:bold ">probability</span>
							<br/>
							<span style="font-size:13px" >{{probability}} %</span>
						</div>
						<div class="span2" style="display:inline; margin-left:32px">
							<span style="font-size:14px; font-weight:bold ">milestone</span>
							<br/>
							<span style="font-size:13px" >{{milestone}}</span>
						</div>
						<div class="span2" style="display:inline; margin-left:30px">
							<span style="font-size:14px; font-weight:bold ">pipeline</span><br/>
							<span style="font-size:13px" >$ {{calculatePipeline expected_value probability pipeline}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="span3">
					<label><b>Relates To :<b></label>  
					<span style="margin-left:8px">{{relatesTo}}</span>
					<br/>
					<span>pipeline :</span>
					<span style="margin-left:8px"> $ {{calculatePipeline expected_value probability pipeline}}</span>
					<br/><br/>
					<span>close date :</span>
					<span style="margin-left:8px"> {{epochToHumanDate "mm-dd-yy" close_date}}</span>
					<br/><br/>
					<span>Task:{{note}}</span>
					<br/><br/>
					<span>Note:{{task}}</span>
			</div>
		</div>
	</div>

	<div class="row" style="margin-top:5%">
		<div class="span10 well" style="margin-left:5%">
			<button class="btn btn-large"> Note </button>
			<button class="btn btn-large" style="margin-left:5%"> Task </button>
		</div>
	</div>
</script><script id="search-model-template" type="text/html">
<li>
<a href='#contact/{{id}}'>
  <img src="{{gravatarurl properties 50}}">
<br/>
  {{getPropertyValue properties "email"}}
 {{getPropertyValue properties "first_name"}}
  {{getPropertyValue properties "last_name"}}
 <br/>
  {{#each tags}}
  <b>{{this}}</b>
  {{/each}}
<br/>
</a>
</li>
</script>



<script id="search-collection-template" type="text/html">
<ul id='search-model-list' class="dropdown-menu" ></ul>
</script>




	
<script id="tagslist-template" type="text/html">
<div id='tags'>

<h3>Tags</h3><br/>
{{#tagslist this}}
{{/tagslist}}
</div>
</script><script id="tasks-collection-template" type="text/html">
	<h3 style="margin-left:3px">Tasks</h3>
	<hr/>


	<h5 style="margin-left:3px">Overdue</h5>
	<div id='overdue' style="display: none; margin:3px"></div>
	
	<h5 style="margin-left:3px">Today</h5>
 	<div id='today' style="display: none; margin:3px"></div>

	<h5 style="margin-left:3px">Tomorrow</h5>
	<div id='tomorrow' style="display: none; margin:3px"></div>

	<h5 style="margin-left:3px">Next Week</h5>
 	<div id='next-week' style="display: none; margin:3px"></div>
	<br/>
 
</script>



<script id="tasks-model-template" type="text/html">
<div class='task-individual well'>
	
	<div class="span4">
		<label class="checkbox">
			<input type=checkbox data='{{id}}' class='tasks-select'> 
			{{epochToTaskDate due}}
		</label>
	</div>
	<div class="span8">
		<b>&nbsp;{{ subject}}</b>
		{{priority_type}}
		<span class="label">{{type}}</span>
	</div>

</div>
</script>
<script id="widgets-add-model-template" type="text/html">
<div class="well widget-add span3">
<img class="thumbnail" src='{{logo_url}}' style="width:250px; height:100px;"/> </a><br/>
<h1> {{name}}</h1> <br/><br/>
{{url}} <br/><br/>
{{description}} <br/><br/>
<a class='btn btn-primary add-widget' widget-name='{{name}}'>Add</a>
</div>

</script>

<script id="widgets-add-collection-template" type="text/html">
<div class="row">
	<div class = "span12">
		<div class = "page-header">
			<h2>Add Widgets</h2>
		</div>
	</div>
</div>
<div class="row">
<div id='widgets-add-model-list'/>
<div class="span6"/>
</div>


</script>
<script id="widgets-model-template" type="text/html">
<span class="widget" id='{{name}}'>  
{{name}}


</span>

<br/>
</script>

<script id="widgets-collection-template" type="text/html">


<ul class='widget-sortable' id='widgets-model-list' style='margin:0px 0px'/>
</ul>

</script>
<script id="workflow-add-template" type="text/html">

<div class='row'>

	<div class='span12'>

	<div class='well'>

<form id="workflowform">
		  		<fieldset>
		<div class="control-group">
			<label class="control-label"><b>Name of workflow:</b> <span class="field_req">*</span></label>
			<div class="controls">
				<input type="text" id='workflow-name' class="span3 required" placeholder="Name of workflow">
			</div>
		</div>

		<IFRAME SRC="designer.html" id='designer' frameBorder='0' name='designer' WIDTH=100% HEIGHT=900px></IFRAME>
		<br/>
		<br/>
		<button class='btn btn-primary' id='saveWorkflow'>Save Workflow</button>
		<a href="#workflows" class='btn'>Cancel</a>
		
		<br/>
</fieldset>
</form>
	</div>
	</div>
</div>
</script><script id="workflows-model-template" type="text/html">


<td><icon class='deleteWorkflow icon-remove-circle'></icon></td>  	
  <td>{{id}}</td>
  <td><a href='#workflow/{{id}}'>{{name}}</a></td>
  <td>{{creator}}</td>
  <td><a href="#logs-to-campaign/{{id}}">View Logs</a></td>
<br/>
	
</script>


 <script id="workflows-collection-template" type="text/html">
 


 <div class="row">

<div class="span12">
 
<div class="page-header">
    <h1>Campaigns <small>Workflows</small></h1>
	<a href="#workflow-add" class="btn right" id="addWorkflow" style='top:-30px;position:relative'><i class='icon-plus-sign'/> Add Workflow</i></a>
  </div>

</div>
</div>

 <div class="row">
 
 <div class="span9"> 
 
 
<table class="table table-bordered" >
<thead>
    <tr>
     <th></th>
      <th>Id</th>
      <th>Name</th>
      <th>Creator</th>
    </tr>
  </thead>
  
  <tbody id='workflows-model-list'>
  </tbody>
  
</table>

</div>


<div class="span3">

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