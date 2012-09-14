<script id="admin-settings-template" type="text/html">
<!-- Check whether DomainUSer has admin Privileges -->

	<div class="row">
		<div class="span12">
 			<div class="page-header">
    			<h1>Admin Settings<small></small></h1>
  			</div>
		</div>
	</div>
	<div class="row">
		<div class="span3 offset well">	
			<div class="settings-content">
			<legend>Account Preferences</legend>
			Choose your plan, upload your company logo or set your company name.
			</div>			
			<a class='btn btn-primary' href='#account-prefs'>Go</a>
		</div>
		<div class="span3 offset well">
			<div class="settings-content">
			<legend>Users</legend>
			Add, edit or delete users who can access your CRM.
			</div>
			<a class='btn btn-primary' href='#users'>Go</a>
		</div>
		<div class="span3 offset well">
			<div class="settings-content">
			<legend>Custom Fields</legend>	
			Collect custom information about contact, company, deal or activity.
			</div>
			<a class='btn btn-primary' href='#custom-fields'>Go</a>
		</div>
	</div>
	<div class="row">
		<div class="span3 offset well">
			<div class="settings-content">
			<legend>Analytics </legend>	
			Add/delete contacts, tags and notes directly from your website using JS API.
			</div>
			<a class='btn btn-primary' href='#analytics-code'>Go</a>
		</div>	
		<div class="span3 offset well">
			<div class="settings-content">
			<legend>Milestones</legend>	
			Configure your milestones for your deals.
			</div>
			<a class='btn btn-primary' href='#milestones'>Go</a>
		</div>	
	
	</div>

</script><script id="admin-settings-api-key-model-template" type="text/html">

<!-- -->

<div class="row">
	<div class="span7">
You can use javascript API to track page views on your site, add/delete contacts from your website or blog directly.<div class="clerfix"/><br/>
<pre class="prettyprint linenums " ">
&lt;script type="text/javascript" &gt;
var _agile = _agile || [];
_agile.push(['_setAccount', '{{api_key}}']);
/*
*   INSERT YOUR FUNCTIONALITY CODE
*   eg: trackPageView..
*   _agile.push(['_setEmail', 'manohar@invox.com']);
*   _agile.push(['_trackPageview']);
*/
var aj = document.createElement('script'); aj.type = 'text/javascript'; 
aj.async = true; aj.src = '/stats/min/agile-min.js';
 
var s = document.getElementsByTagName('script')[0];
 
s.parentNode.insertBefore(aj, s);
&lt;/script&gt;
</pre>
	</div>
</div>

Set Email (Optional)<div class="clerfix"/><br/>
<div class="row">
	<div class="span7">
<pre class="prettyprint linenums " ">
_agile.push(['_setEmail', 'manohar@invox.com']);
</pre>
	</div>
</div>

Track Page View<div class="clerfix"/><br/>
<div class="row">
	<div class="span7">
<pre class="prettyprint linenums " ">
_agile.push(['_trackPageview']);
</pre>
	</div>
</div>


Create Contact<div class="clerfix"/><br/>
<div class="row">
	<div class="span7">
<pre class="prettyprint linenums " ">
_agile.push(["_createContact", {"email": "yaswanth3@invox.com", "first_name":"yaswanth2", "last_name":"chapalamadugu"}, {"tags":"tag1 tag2"}]);
</pre>
	</div>
</div>

Add Tag<div class="clerfix"/><br/>
<div class="row">
	<div class="span7">
<pre class="prettyprint linenums " ">
_agile.push(["_addTag", {"email": "yaswanth3@invox.com", "tags":"tag4 tag5"}]);
</pre>
	</div>
</div>

Remove Tag<div class="clerfix"/><br/>
<div class="row">
	<div class="span7">
<pre class="prettyprint linenums " ">
 _agile.push(["_removeTag", {"email": "yaswanth3@invox.com", "tags":"manohar tag3 tag4 tag5"}]);
</pre>
	</div>
</div>

</script><script id = "admin-settings-api-model-template" type="text/html">
<div class="row">
<div class="span7">
<pre class="prettyprint linenums " ">
API-KEY  {{api_key}}
</pre>
</div>
</div>
</script><script id="admin-settings-account-prefs-template" type="text/html">
<!--  Contact View Detail in Detailed mode - when only one contact is shown -->

<div class='span5 well'>

	<form id="accountPrefs" class="form-horizontal">
		<fieldset>
			<div class="control-group">
				<input name="id" type="hidden" value="{{id}}" />
				<legend>Account Preferences</legend>
				<label class="control-label">Plan <span class="field_req">*</span></label>
				<div class="controls">
					<select name="plan" class="required">
						<option value="{{plan}}" selected>{{plan}}</option>
					</select> 
				</div>
			</div>
				
    		<div class="control-group">
     			<label class="control-label">Company <span class="field_req">*</span></label> 
				<div class="controls">
					<input name="company_name" class="required" type="text" value="{{company_name}}" />
				</div>
			</div>

		 	<div class="control-group">
				<div id="account_prefs" messg="User image has been uploaded">
					<div class="controls">
						<div class="imgholder">
							{{#if logo}}
								<img src="{{logo}}" height="100" width="100"/>
							{{/if}}													
						</div>					
						<p><br/></p><p><input type="hidden" id="account_prefs_url" name="logo">  
							<input class="upload_s3 submit" type="submit" id="account_prefs_image" value="Upload"></p>
				</div>
			</div>

			<div class="form-actions">
            	<a href="#" type="submit" class="save btn btn-primary">Save changes</a> 
				<a href="#admin" class="btn ">Cancel</a>
			</div>
		</fieldset>
	</form>
</div>
</script>
<script id="custom-field-text-modal-template" type="text/html">
<!-- New (Text) Modal views -->
<div class="modal hide" id="textModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Add Custom Field</h3>
	</div>
	<div class="modal-body">
		<form id='textModalForm' name="textModalForm" method="post" class="form-horizontal">
			<fieldset>
			
				<div class="control-group">
				<label class="control-label">Label <span class="field_req">*</span></label> <div class="controls"><input
					name="field_label" type="text" id="label" placeholder="Label" class="required"/></div></div>

				<input class="hide"	name="field_type" type="text"  placeholder="Label" value="TEXT"/>
                <div class="control-group">
				<label class="control-label">Description <span class="field_req">*</span></label><div class="controls"> <input name="field_description"
					type="text" id="field_description" placeholder="Description" class="required"/></div></div>
			

			
                <div class="control-group">
				<label class="control-label">Searchable <span class="field_req">*</span></label><div class="controls"> 
				<input name="searchable" type="checkbox" id="searchable" class="required"/>
				</div></div>
			
		
                <div class="control-group">
				<label class="control-label">Validation Rule <span class="field_req">*</span></label><div class="controls"> <input name="validationRule"
					type="text" id="validationRule" placeholder="Validation Rule" class="required"/></div></div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save
		   changes</a>
	</div>
</div>
</script>
<!-- End of (Text) Modal views -->

<script id="custom-field-date-modal-template" type="text/html">
<!-- New (Date) Modal views -->
<div class="modal hide " id="dateModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Add Custom Field</h3>
	</div>
	<div class="modal-body">
		<form id='dateModalForm' name="dateModalForm" method="post" class="form-horizontal">
			<fieldset>
			
				<div class="control-group">
				<label class="control-label">Label <span class="field_req">*</span></label> <div class="controls"><input
					name="field_label" type="text" id="label" placeholder="Label" class="required"/></div></div>

				<input class="hide"	name="field_type" type="text"  placeholder="Label" value="DATE"/>
			
                <div class="control-group">
				<label class="control-label">Description <span class="field_req">*</span></label><div class="controls"> <input name="field_description"
					type="text" id="description" placeholder="Description" class="required"/></div></div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save
		   changes</a>
	</div>
</div>
</script>
<!-- End of (Date) Modal views -->

<!-- New (List) Modal views -->
<script id="custom-field-list-modal-template" type="text/html">
<div class="modal hide " id="listModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Add Custom Field</h3>
	</div>
	<div class="modal-body">
		<form id='listModalForm' name="listModalForm" method="post" class="form-horizontal">
			<fieldset>
				<div class="control-group">
				<label class="control-label">Label <span class="field_req">*</span></label> <div class="controls"><input
					name="field_label" type="text" id="label" placeholder="Label" class="required"/></div></div>

				<input class="hide"	name="field_type" type="text"  placeholder="Label" value="LIST"/>
			
                <div class="control-group">
				<label class="control-label">Description <span class="field_req">*</span></label><div class="controls"> <input name="field_description"
					type="text" id="description" placeholder="Description" class="required"/></div></div>
			
			
                <div class="control-group">
				<label class="control-label">List Values <span class="field_req">*</span></label><div class="controls"> <input name="listvalues"
					type="text" id="listvalues" placeholder="Enter each value in the list separated by a semicolon" 
					class="required"/></div></div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save
		   changes</a>
	</div>
</div>
</script>
<!-- End of (List) Modal views -->

<!-- New (Check Box) Modal views -->
<script id="custom-field-checkbox-modal-template" type="text/html">
<div class="modal hide " id="checkboxModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Add Custom Field</h3>
	</div>
	<div class="modal-body">
		<form id='checkboxModalForm' name="checkboxModalForm" method="post" class="form-horizontal">
			<fieldset>
				<div class="control-group">
				<label class="control-label">Label <span class="field_req">*</span></label> <div class="controls"><input
					name="field_label" type="text" id="label" placeholder="Label" class="required"/></div></div>

			
				<input class="hide"	name="field_type" type="text"  placeholder="Label" value="CHECKBOX"/>
				
                <div class="control-group">
				<label class="control-label">Description <span class="field_req">*</span></label><div class="controls"> <input name="field_description"
					type="text" id="description" placeholder="Description" class="required"/></div></div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save
		   changes</a>
	</div>
</div>
</script>
<!-- End of (Check Box) Modal views -->

<!-- New (Generated Link) Modal views -->
<script id="custom-field-checkbox-modal-template" type="text/html">
<div class="modal hide" id="linkModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Add Custom Field</h3>
	</div>
	<div class="modal-body">
		<form id='linkModalForm' name="linkModalForm" method="post" class="form-horizontal">
			<fieldset>
				<div class="control-group">
				<label class="control-label">Label <span class="field_req">*</span></label> <div class="controls"><input
					name="field_label" type="text" id="label" placeholder="Label" class="required"/></div></div>

				<input class="hide"	name="field_type" type="text"  placeholder="Label" value="LINK"/>
			
                <div class="control-group">
				<label class="control-label">Description <span class="field_req">*</span></label><div class="controls"> <input name="field_description"
					type="text" id="description" placeholder="Description" class="required"/></div></div>
			
			
                <div class="control-group">
				<label class="control-label">Link Definition <span class="field_req">*</span></label><div class="controls"> <input name="listvalues"
					type="text" id="listvalues" placeholder="e.g. http://example.com?emailAddress={email}" 
					class="required"/></div></div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" type="submit" class="save btn btn-primary" id="customfield_validate">Save
		   changes</a>
	</div>
</div>
</script>
<!-- End of (Generated Link) Modal views --><script id="admin-settings-customfields-collection-template" type="text/html">
	
	<div class="row">
		<div class="span12">
			<div class="page-header">
    			<h1>Custom Fields</h1>
				<ul class="nav right">
					<li class="dropdown" id="menu2">
						<a href="#custom-fields-add" class="dropdown-toggle btn right" data-toggle="dropdown" id="addUser" style='top:-25px;position:relative'>
						   <span><i class='icon-plus-sign'/></span> Add Custom Field</a>
						<ul class="dropdown-menu">
							<li><a href="#textModal" data-toggle='modal'  class = "fieldmodal" id="text">Text
								Field</a>
							</li>
							<li><a href="#dateModal" data-toggle='modal' class = "fieldmodal"   id ="date">Date
								Field</a>
							</li>
							<li><a href="#listModal" class = "fieldmodal" id="list">List
								Field</a>
							</li>
							<li><a href="#checkboxModal"  class="fieldmodal" id="checkbox">Check
								Box Field</a>
							</li>
							<li><a href="#linkModal"  class="fieldmodal" id="link">Generated
								Link</a>
							</li>
						</ul>
					</li>
	  			</ul>
			</div>
		</div>
	</div>

	<div class="row">
 		<div class="span9"> 
 
			<table class="table table-bordered" >
				<thead>
    				<tr>
      					<th>Field Label</th>
      					<th>Field Description</th>
      					<th>Field Type</th>
    				</tr>
  				</thead>
  
  				<tbody id='admin-settings-customfields-model-list'>
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
		
		<div id= "custom-field-modal">
		</div>
		
	</div>
</script>

<script id="admin-settings-customfields-model-template" type="text/html">
  <td>{{field_label}} </td>
  <td>{{field_description}} </td>
  <td>{{field_type}}</td>
<br/>
</script><script id="admin-settings-milestones-template" type="text/html">

<div class='span8 well'>
	<form id="milestonesForm" class="form-horizontal">
		<fieldset>
		{{#if id}}
			<input type="text" name="id" class="hide" value={{id}}>
		{{/if}} 		
		<legend>Milestones</legend>
		<div class="control-group">  	 
			<label class="control-label">Milestones <span class="field_req">*</span></label>
    		<div class="controls">
				<input name="milestones" type="text" class="required" value="{{milestones}}" />
			</div>
		</div> 
		
		<div class="form-actions">
		<a href="#" type="submit" class="save btn btn-primary">Save</a>
		<a href="#admin" class="btn ">Close</a>
		</div>
		<fieldset>
	</form>
</div>
</script><script id="admin-settings-user-add-template" type="text/html">
	<div class="row">
		<div class="span9">
		<div class="well">
	
			<form id="userForm" name="userForm" method="get" action="" class="form-horizontal">
				<fieldset>
					<legend>New User Details</legend>
					<br/>
                	<div class="control-group">
						<label class="control-label" for="cname">Name</label> 
                		<div class="controls">
							<input type="text" id="cname" name="name" class="required" placeholder="Name"/>
						</div>
					</div> 
				
					<div class="control-group">
						<label class="control-label for="eaddress">Email Address</label> 
                		<div class="controls">
							<input type="text" id="eaddress" class="email required" name='email' placeholder="Email address"/> 
						</div>
					</div>
				
					<div class="control-group">
						<div class="controls">
							<label class="checkbox">
								<input type="checkbox" id="Admin" name='is_admin' value='true'/> 
                        		Allow this user to configure the account and invite or remove users
							</label>
						</div>
					</div>

					<div class="control-group">
						<div class="controls">
							<label class="checkbox">
								<input type="checkbox" id="Disabled" name='is_disabled' value='true'/> 
                        		Disable this user
							</label>
						</div>
					</div>

					<div class="form-actions">
            			<button type="submit" class="save btn btn-primary">Save changes</button>
            			<a type="reset" href='#admin' class="btn">Cancel</a>
          			</div>
				</fieldset>
			</form>
		</div>
	</div>
</div>
</script><script id="admin-settings-users-collection-template" type="text/html">
	
	<div class="row">
		<div class="span12">
			<div class="page-header">
    			<h1>List of Users</h1>
				<a href="#users-add" class="btn right" id="addUser" style='top:-25px;position:relative'><span><i class='icon-plus-sign'/></span> Add User</a>
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
      					<th>Is Admin</th>
      					<th>User Name</th>
						<th>Is Disabled</th>
    				</tr>
  				</thead>
  
  				<tbody id='admin-settings-users-model-list'>
  				</tbody>
			</table>
		</div>

		<div class='span3'>
			<div class="well" id='adduser'>
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

<script id="admin-settings-users-model-template" type="text/html">
<td><icon class='edit icon-remove-circle'></icon></td>  	
  <td>{{id}} </td>
  <td>{{is_admin}} </td>
  <td>{{email}}</td>
<td>{{is_disabled}}</td>
<br/>
</script>
