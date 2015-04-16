<script id = "contacts-custom-view-image-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div style="width:4em;overflow:hidden;min-height:50px">
			{{#if_equals type "COMPANY"}}
					<img class="thumbnail pull-left" {{getCompanyImage "40"}}/></img>
				{{else}}
					<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="width:40px; height:40px; "/>	
			{{/if_equals}}
    	</div>
	</td>
</script>

<script id = "contacts-custom-view-basic_info-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div class="row-fluid" style="width:15em;">
    	<div style="display:inline;padding-right:5px;height:auto;">
        	{{#if_contact_type "PERSON"}}
        		<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"  width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} />
        	{{/if_contact_type}}
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%">
        	{{#if_contact_type "PERSON"}}
        		<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        		<br />
        		{{getPropertyValue properties "email"}}
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<b>{{getPropertyValue properties "name"}}</b></br>
        		{{getPropertyValue properties "url"}}
        	{{/if_contact_type}}
	</div>
	</div>
	</td>
</script>

<script id = "contacts-custom-view-first_name-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div style="text-overflow:ellipsis;width:10em;white-space:nowrap;overflow:hidden;min-height:50px">
    	<b>{{getPropertyValue properties "first_name"}}</b>
    	</div>
	</td>
</script>

<script id = "contacts-custom-view-last_name-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div style="text-overflow:ellipsis;width:10em;white-space:nowrap;overflow:hidden;min-height:50px">
        <b>{{getPropertyValue properties "last_name"}}</b>
        </div>
	</td>
</script>

<script id = "contacts-custom-view-phone-template" type="text/html">
	<td class="data" data="{{id}}">
        <div style="text-overflow:ellipsis;width:10em;white-space:nowrap;overflow:hidden;min-height:50px">
    	{{getPropertyValue properties "phone"}}
        </div>
	</td>
</script>

<script id = "contacts-custom-view-address-template" type="text/html">
	<td class="data" data="{{id}}">
        <div style="text-overflow:ellipsis;width:10em;white-space:nowrap;overflow:hidden;min-height:50px">
    	{{#address_Template properties}}{{/address_Template}}
        </div>
	</td>
</script>

<script id = "contacts-custom-view-website-template" type="text/html">
	<td class="data" data="{{id}}">
        <div style="text-overflow:ellipsis;width:10em;white-space:nowrap;overflow:hidden;min-height:50px">
    	{{getPropertyValue properties "website"}}
        </div>
	</td>
</script>

<script id = "contacts-custom-view-email-template" type="text/html">
	<td class="data" data="{{id}}">
        <div style="text-overflow:ellipsis;width:10em;white-space:nowrap;overflow:hidden;min-height:50px">
    	{{getPropertyValue properties "email"}}
        </div>
	</td>
</script>

<script id = "contacts-custom-view-company-template" type="text/html">
	<td class="data" data="{{id}}">
      <div style="text-overflow:ellipsis;width:10em;white-space:nowrap;overflow:hidden;min-height:50px">
    	{{getPropertyValue properties "company"}}
      </div>
	</td>
</script>

<script id = "contacts-custom-view-tags-template" type="text/html">
	<td class="data" data="{{id}}">
	 <div class="ellipsis-multiline" style="line-height:20px !important; word-break:keep-all;min-height:50px"> 	
		{{#each tags}}
	    	<span class="label">{{this}}</span>	
		{{/each}}
	</div>
	</td>
</script>

<script id = "contacts-custom-view-created_time-template" type="text/html">
	<td class='data' data='{{id}}'>
    <div style="text-overflow:ellipsis;width:8em;overflow:hidden;min-height:50px">
		{{epochToHumanDate "dd mmm yyyy" created_time}}
    </div>
	</td>
</script>

<script id = "contacts-custom-view-updated_time-template" type="text/html">
	<td class='data' data='{{id}}'>
    <div style="text-overflow:ellipsis;width:8em;overflow:hidden;min-height:50px">
		{{#if updated_time}}
			{{epochToHumanDate "dd mmm yyyy" updated_time}}
		{{/if}}
    </div>
	</td>
</script>

<script id = "contacts-custom-view-title-template" type="text/html">
	<td class='data' data='{{id}}'>
    <div style="text-overflow:ellipsis;width:7em;overflow:hidden;min-height:50px">
		{{getPropertyValue properties "title"}}
    </div>
	</td>
</script>

<script id = "contacts-custom-view-lead_owner-template" type="text/html">
	<td class='data' data='{{id}}'>
       <div style="text-overflow:ellipsis;width:7em;overflow:hidden;min-height:50px">
		  <b>{{owner.name}}</b>
       </div>
	</td>
</script>

<script id = "contacts-custom-view-star_value-template" type="text/html">
	<td class='data' data='{{id}}'>
		 <ul style="margin: 0; padding: 0; list-style-type: none;width:8em;min-height:50px">
			{{setupRating star_value}}
		</ul>
	</td>
</script>

<script id = "contacts-custom-view-lead_score-template" type="text/html">
	<td class='data' data='{{id}}'>
       <div style="text-overflow:ellipsis;width:7em;overflow:hidden;min-height:50px">
		  <b>{{lead_score}}</b>
       </div>
	</td>
</script>


<script id = "contacts-custom-view-custom-template" type="text/html">
	<td class='data' data=''>
       <div style="text-overflow:ellipsis;width:7em;overflow:hidden;min-height:50px">
		  <b>{{value}}</b>
       </div>
	</td>
</script>

<script id = "contacts-custom-view-custom-date-template" type="text/html">
	<td class='data' data=''>
       <div style="text-overflow:ellipsis;width:7em;overflow:hidden;min-height:50px">
		{{epochToHumanDate "dd mmm yyyy" value}}
    	</div>
	</td>
</script><script id="contact-view-template" type="text/html">
<div class="row">
    <div class="span9">
        <div class="well">
            <form id="opportunityform" class="form-horizontal">
                <fieldset>
					<input name="id" type="hidden" value="{{id}}" />
					<div class="control-group">
                        <legend>Select Columns</legend>
                    </div>
					<div class="control-group">
                        <div class="controls">Select Contact fields to view</div>
                    </div>
                    <div class="control-group">
                        <div class="controls" id="contactTypeAhead">
                            <select id="multipleSelect" class="required" multiple="multiple">
							<optgroup label='Contact Fields'>
                                <option value="basic_info">Basic Info</option>
								<option value="first_name">First Name</option>
                                <option value="last_name">Last Name</option>
                                <option value="email">Email</option>
                                <option value="company">Company</option>
                                <option value="tags">Tags</option>
                                <option value="title">Title</option>
								<option value="phone">Phone</option>
								<option value="address">Address</option>
								<option value="website">Website</option>
                                <option value="created_time">Created Date</option>
                                <option value="updated_time">Updated Date</option>
								<option value="image">Image</option>
								<option value="star_value">Star Value</option>
								<option value="lead_score">Lead Score</option>
                                <option value="lead_owner">Lead Owner</option>
							</optgroup>
							<optgroup id="custom-fields-optgroup" label='Custom Fields'>
							
							</optgroup>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">          
                        <a href="#" type="submit" class="save btn btn-primary" id="contactView">Save Changes</a>
                        <a href="#contacts" class="btn ">Cancel</a>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</div>
</script><!-- to be removed -->
<script id="contact-custom-view-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Views</h1>
            <a href="#contact-view-add" class="btn right" id="addView" style="top:-28px;position:relative"><span><i class="icon-plus-sign" /></span> Add View</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
		<div id="slate">
         </div>
        {{#if this.length}}
        <table class="table table-bordered showCheckboxes" url="core/api/contact-view/delete/bulk">
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Fields</th>
                </tr>
            </thead>
            <tbody id="contact-custom-view-model-list" route="contact-custom-view-edit/">
            </tbody>
        </table>
		{{/if}}
    </div>
    <div class="span3">
        <div class="well" id="addview">
            <h3>Customize your view</h3>
            <br />
            <p>Look at contacts the way you want to. Choose different fields and the order in which you would like them to appear. You can add any number of views.</p>
        </div>
    </div>
</div>
</script>

<script id="contact-custom-view-model-template" type="text/html">
<td data='{{id}}' class='data'></td>  	
<td> {{name}} </td>
<td><div style="text-transform:capitalize;">{{#field_Element fields_set}}{{/field_Element}}</div>
</td>
<br/>
</script>
<script id="contacts-custom-view-model-template" type="text/html">
<!--
{{#each fields_set}}
	{{#equals "image" this}}
		 <td><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width='40px' height='40px' style="width:40px; height:40px; "></td>
	{{/equals}}
			<td>{{getPropertyFieldValue .. this}}</td>
{{/each}}
-->
</script>

<script id="contacts-custom-view-table-model-template" type="text/html">
<!--
{{#each fields_set}}
	{{#equals "image" this}}
		 <td><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width='40px' height='40px' style="width:40px; height:40px; "></td>
	{{/equals}}
			<td>{{getPropertyFieldValue .. this}}</td>
{{/each}}
-->
</script>
	
<script id="contacts-custom-view-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1><span id="contact-heading">Contacts </span><span id="contacts-count">{{contacts_count}}</span></h1>
            </h1>

			<div class="btn-group pull-left" id="bulk-actions"
				style="display: none; top: -29px;margin-left:26%;">
					<div class="btn">Bulk Actions</div>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu" id="view-actions">
						<li><a href="#" id="bulk-tags">Add Tags</a></li>
						<li><a href="#" id="bulk-tags-remove">Remove Tags</a></li>
                        <li class='divider'></li>  
						{{#hasMenuScope 'CAMPAIGN'}}
						<li><a href="#" id="bulk-campaigns">Add to Campaign</a></li>
						{{/hasMenuScope}}
						<li><a href="#" id="bulk-email">Send Email</a></li>
                        <li class='divider'></li>
						<li><a href="#" id="bulk-owner">Change Owner</a></li>
                        <li><a href="#" id="bulk-contacts-export">Export Contacts as CSV</a></li>
						<li><a href="#" class="delete-checked-contacts">Delete</a></li>
					</ul>
			</div>
		<div  class="btn-group pull-left" style="display: none;top:-25px;left:10px" id="bulk-select"></div>
            <div id="view-list" style="top:-29px;position:relative">
            </div>
            <div class="btn-group right" id="filter-list" style="top:-29px; position:relative;margin-right:5px">
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="span3">
		<div class="data-block">
			<div class="well" id="lhs_filters_conatiner" style="background:none;box-shadow:0 0px 7px 0px #ddd;">
				
			</div>
		</div>
    </div>
    <div class="span9">
		{{#unless this.length}}
			<div class="filter-criteria">
					
			</div>
			<div id="slate"></div>
		{{else}}
        <div class="data">
            <div class="dta-contatiner">

                <table id="contacts-table" class="table table-striped showCheckboxes no-sorting" style="overflow:scroll" url="core/api/bulk/update?action_type=DELETE">                
					<div class="filter-criteria">
					
					</div>
					<thead>
                        <tr style="text-transform: capitalize;">
                            {{contactTableHeadings "fields_set"}}
                        </tr>
                    </thead>
                    <tbody id="contacts-custom-view-model-list" route="contact/" style="overflow:scroll">
                    </tbody>
                </table>
            </div>
        </div>
	{{/unless}}
    </div>
</div>
</div>
</script>
<script id="contacts-custom-view-table-collection-template" type="text/html">
{{#unless this.length}}
			<div id="slate"></div>
		{{else}}
        <div class="data">
            <div class="dta-contatiner">

                <table id="contacts-table" class="table table-striped showCheckboxes no-sorting" style="overflow:scroll" url="core/api/bulk/update?action_type=DELETE">                
					<div class="filter-criteria">
					
					</div>
					<thead>
                        <tr style="text-transform: capitalize;">
                            {{contactTableHeadings "fields_set"}}
                        </tr>
                    </thead>
                    <tbody id="contacts-custom-view-table-model-list" route="contact/" style="overflow:scroll">
                    </tbody>
                </table>
            </div>
        </div>
	{{/unless}}
</script>
<script id="contacts-grid-model-template" type="text/html">
<div class="span4 {{id}}" style="padding-bottom:10px;margin-left:10px !important;width:32%;">
  {{#if_contact_type "PERSON"}}
    <div style="border: 1px solid #DDD;border-radius:4px;padding: 10px;background-color:#f5f5dc;height:75px;"id={{id}}><input class="tbody_check right" type="checkbox"/>
	  <div class="pull-left" style="margin-right:5px;">
        <img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 50}}" width="50px" height="50px" style="display:inline; width:40px; height:40px; " />
      </div>
	  <div class="pull-left" style="width:70%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
        <a href="#contact/{{id}}" class="text-first-capital">
			<b>{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</b>		
		</a>
		<br/>
        	{{getPropertyValue properties "email"}}
        
</div>
<div class="clearfix"></div>
<div style="width:100%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;margin-top:5px;">
        {{#each tags}}
        	<b><span class="label">{{this}}</span></b>
        {{/each}}
	  </div>
    </div>
  {{/if_contact_type}}

  {{#if_contact_type "COMPANY"}}
    <div style="border: 1px solid #DDD;border-radius:4px;padding: 10px;background-color:#f5f5dc;height:75px;" id={{id}}>
		<input class="tbody_check right" type="checkbox"/>
	  	<div class="pull-left" style="margin-right:5px;">
        	<img class="thumbnail" {{getCompanyImage "50" "display:inline;"}} />
      	</div>
	  	<div class="pull-left" style="width:70%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
        	<a href="#contact/{{id}}" class="text-first-capital">
        		<b>{{getPropertyValue properties "name"}}</b>
			</a>
			<br/>
        	{{getPropertyValue properties "url"}}
			
	  	</div>
<div class="clearfix"></div>
    </div>
  {{/if_contact_type}}

</div>
</script>

<script id="contacts-grid-table-model-template" type="text/html">
<div class="span4 {{id}}" style="padding-bottom:10px;margin-left:10px !important;width:32%;">
  {{#if_contact_type "PERSON"}}
    <div style="border: 1px solid #DDD;border-radius:4px;padding: 10px;background-color:#f5f5dc;height:75px;"id={{id}}><input class="tbody_check right" type="checkbox"/>
	  <div class="pull-left" style="margin-right:5px;">
        <img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 50}}" width="50px" height="50px" style="display:inline; width:40px; height:40px; " />
      </div>
	  <div class="pull-left" style="width:70%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
        <a href="#contact/{{id}}" class="text-first-capital">
			<b>{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</b>		
		</a>
		<br/>
        	{{getPropertyValue properties "email"}}
        
</div>
<div class="clearfix"></div>
<div style="width:100%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;margin-top:5px;">
        {{#each tags}}
        	<b><span class="label">{{this}}</span></b>
        {{/each}}
	  </div>
    </div>
  {{/if_contact_type}}

  {{#if_contact_type "COMPANY"}}
    <div style="border: 1px solid #DDD;border-radius:4px;padding: 10px;background-color:#f5f5dc;height:75px;" id={{id}}>
		<input class="tbody_check right" type="checkbox"/>
	  	<div class="pull-left" style="margin-right:5px;">
        	<img class="thumbnail" {{getCompanyImage "50" "display:inline;"}} />
      	</div>
	  	<div class="pull-left" style="width:70%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
        	<a href="#contact/{{id}}" class="text-first-capital">
        		<b>{{getPropertyValue properties "name"}}</b>
			</a>
			<br/>
        	{{getPropertyValue properties "url"}}
			
	  	</div>
<div class="clearfix"></div>
    </div>
  {{/if_contact_type}}

</div>
</script>


<script id="contacts-grid-collection-template" type="text/html">
<div class="row">
    <div class="span12">
<div class="page-header">
			<h1><span id="contact-heading">Contacts</span> <small> {{count}}</small></h1>
			<div class="btn-group right" id="view-list"
				style="top: -29px;"></div>
			<div class="btn-group right" id="filter-list"
				style="top: -29px;margin-right: 5px"></div>
			<div>
			<div class="btn-group pull-left" id="bulk-actions"
				style="display: none; top: -29px;margin-left:26%;">
					<div class="btn">Bulk Actions</div>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					{{#collection_contact_type "PERSON"}}
					<ul class="dropdown-menu" id="view-actions">
						<li><a href="#" id="bulk-tags">Add Tags</a></li>
						<li><a href="#" id="bulk-tags-remove">Remove Tags</a></li>
                        <li class='divider'></li>  
						{{#hasMenuScope 'CAMPAIGN'}}
						<li><a href="#" id="bulk-campaigns">Add to Campaign</a></li>
						{{/hasMenuScope}}
						<li><a href="#" id="bulk-email">Send Email</a></li>
                        <li class='divider'></li>
						<li><a href="#" id="bulk-owner">Change Owner</a></li>
                        <li><a href="#" id="bulk-contacts-export">Export Contacts as CSV</a></li>
						<li><a href="#" id="delete-checked-grid">Delete</a></li>
					</ul>
					{{/collection_contact_type}}
					{{#collection_contact_type "COMPANY"}}
					<ul class="dropdown-menu" id="view-actions">
						<li><a href="#" id="bulk-email">Send Email</a></li>
                        <li class='divider'></li>
						<li><a href="#" id="bulk-owner">Change Owner</a></li>
						<li><a href="#" id="bulk-companies-export">Export Companies as CSV</a></li>
						<li><a href="#" class="delete-checked-contacts">Delete</a></li>
					</ul>
					{{/collection_contact_type}}
			</div>
			<div  class="btn-group pull-left" style="display: none;top:-25px;left:10px" id="bulk-select"></div>
		</div>

        </div>
    </div>
    </div>
<div class="row">
    <div class="span3">
        <div class="data-block">
            <div class="well" id="lhs_filters_conatiner" style="background:none;box-shadow:0 0px 7px 0px #ddd;">
				
			</div>
        </div>
    </div>
    <div class="span9">
		<div class="filter-criteria"></div>
        <div id="slate">
        </div>
        {{#if this.length}}
        <div class="data">
            <div class="data-container">
                <div id="contacts-grid-model-list" class="contacts-model-list grid-view showCheckboxes" route="contact/"  url="core/api/bulk/update?action_type=DELETE" style="overflow:auto;margin-left:-20px;"></div>
            </div>
        </div>
        {{/if}}
    </div>
</div>
</div>
</div>
</script>
<script id="contacts-grid-table-collection-template" type="text/html">
	<div class="filter-criteria"></div>
        <div id="slate">
        </div>
        {{#if this.length}}
        <div class="data">
            <div class="data-container">
                <div id="contacts-grid-table-model-list" class="contacts-model-list grid-view showCheckboxes" route="contact/"  url="core/api/bulk/update?action_type=DELETE" style="overflow:auto;margin-left:-20px;"></div>
            </div>
        </div>
        {{/if}}
</script>
