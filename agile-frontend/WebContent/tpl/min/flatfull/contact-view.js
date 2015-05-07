<script id = "contacts-custom-view-image-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div class="overflow-hidden thumb-sm" style="width:15em;">
			{{#if_equals type "COMPANY"}}
					<img class="img-inital r r-2x pull-left" {{getCompanyImage "40"}}/></img>
				{{else}}
					<img class="img-inital r r-2x" data-name="{{dataNameAvatar properties 40}}" src="{{gravatarurl properties }}" />	
			{{/if_equals}}
    	</div>
	</td>
</script>

<script id = "contacts-custom-view-basic_info-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div class="table-resp" style="width:15em;">
    	<div class="thumb-sm agile-img m-r-sm" style="margin-right:10px">
        	{{#if_contact_type "PERSON"}}
        		<img class="img-inital r r-2x"  data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"/>
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<img class="r r-2x" {{getCompanyImage "40" "display:inline;"}}/>
        	{{/if_contact_type}}
    	</div>
    	<div class="agile-thumb agile-thumb-view" style="width:calc(100% - 60px);">
        	{{#if_contact_type "PERSON"}}
        		<a class="text-cap custom-link">{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </a></br>
        		<div><small class="text-muted m-t-xs">{{getPropertyValue properties "email"}}</small></div>
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<a class="text-cap">{{getPropertyValue properties "name"}}</a>
        		<small class="text-muted m-t-xs">{{getPropertyValue properties "url"}}</small>
        	{{/if_contact_type}}
	</div>
	</div>
	</td>
</script>

<script id = "contacts-custom-view-first_name-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div class="text-ellipsis" style="width:15em;">
    		<a class="text-cap">{{getPropertyValue properties "first_name"}}</>
    	</div>
	</td>
</script>

<script id = "contacts-custom-view-last_name-template" type="text/html">
	<td class="data" data="{{id}}">
    	<div class="text-ellipsis" style="width:15em;">
        	<a class="text-cap">{{getPropertyValue properties "last_name"}}</a>
        </div>
	</td>
</script>

<script id = "contacts-custom-view-phone-template" type="text/html">
	<td class="data" data="{{id}}">
        <div class="text-ellipsis" style="width:15em;">
    		<a class="text-cap">{{getPropertyValue properties "phone"}}</a>
        </div>
	</td>
</script>

<script id = "contacts-custom-view-address-template" type="text/html">
	<td class="data" data="{{id}}">
        <div class="text-ellipsis" style="width:15em;">
    		<a class="text-cap">{{#address_Template properties}}{{/address_Template}}</a>
        </div>
	</td>
</script>

<script id = "contacts-custom-view-website-template" type="text/html">
	<td class="data" data="{{id}}">
        <div class="text-ellipsis" style="width:15em;">
    		<a class="text-cap">{{getPropertyValue properties "website"}}</a>
        </div>
	</td>
</script>

<script id = "contacts-custom-view-email-template" type="text/html">
	<td class="data" data="{{id}}">
        <div class="text-ellipsis" style="width:15em;">
    		<a class="text-cap">{{getPropertyValue properties "email"}}</a>
        </div>
	</td>
</script>

<script id = "contacts-custom-view-company-template" type="text/html">
	<td class="data" data="{{id}}">
      <div class="text-ellipsis" style="width:15em;">
      	<a class="text-cap">{{getPropertyValue properties "company"}}</a>
      </div>
	</td>
</script>

<script id = "contacts-custom-view-tags-template" type="text/html">
	<td class="data" data="{{id}}">
	 <div class="overflow-hidden line-clamp line-clamp-2" style="width:15em;"> 	
		{{#each tags}}
	    	<span class="label bg-light dk text-tiny">{{this}}</span>	
		{{/each}}
	</div>
	</td>
</script>

<script id = "contacts-custom-view-created_time-template" type="text/html">
	<td class='data' data='{{id}}'>
    <div class="text-ellipsis" style="width:15em;">
		<a class="text-cap">{{epochToHumanDate "dd mmm yyyy" created_time}}</a>
    </div>
	</td>
</script>

<script id = "contacts-custom-view-updated_time-template" type="text/html">
	<td class='data' data='{{id}}'>
    <div class="text-ellipsis" style="width:15em;">
		{{#if updated_time}}
			{{epochToHumanDate "dd mmm yyyy" updated_time}}
		{{/if}}
    </div>
	</td>
</script>

<script id = "contacts-custom-view-title-template" type="text/html">
	<td class='data' data='{{id}}'>
    <div class="text-ellipsis" style="width:15em;">
		<a class="text-cap">{{getPropertyValue properties "title"}}</a>
    </div>
	</td>
</script>

<script id = "contacts-custom-view-lead_owner-template" type="text/html">
	<td class='data' data='{{id}}'>
       <div class="text-ellipsis" style="width:15em;">
	   	<a class="text-cap">{{owner.name}}</a>
       </div>
	</td>
</script>

<script id = "contacts-custom-view-star_value-template" type="text/html">
	<td class='data' data='{{id}}'>
		 <ul class="m-n p-n list-none" style="width:15em;">
			{{setupRating star_value}}
		</ul>
	</td>
</script>

<script id = "contacts-custom-view-lead_score-template" type="text/html">
	<td class='data' data='{{id}}'>
       <div style="width:15em;">
		  {{lead_score}}
       </div>
	</td>
</script>


<script id ="contacts-custom-view-custom-template" type="text/html">
	<td class='data' data=''>
       <div class="text-ellipsis" style="width:15em;">
		  <span>{{value}}</span>
       </div>
	</td>
</script>

<script id = "contacts-custom-view-custom-date-template" type="text/html">
	<td class='data' data=''>
       <div class="text-ellipsis" style="width:15em;">
	   	  <span>{{epochToHumanDate "dd mmm yyyy" value}}</span>
       </div>
	</td>
</script><script id="contact-view-template" type="text/html">
<div class="wrapper-md bg-light lter b-b">
<h3 class="font-thin m-none h3">Select Columns</h3>
</div>
<div class="wrapper-md">
<div class="row">
    <div class="col-md-9">
        <div>
            <form id="opportunityform" class="form-horizontal">
                <fieldset>
                    <input name="id" type="hidden" value="{{id}}" />
					<div class="control-group form-group">
                        <div class="controls col-sm-offset-2 col-sm-10">Select Contact fields to view</div>
                    </div>
                    <div class="control-group form-group">
                        <div class="controls col-sm-offset-2 col-sm-10" id="contactTypeAhead">
                            <select id="multipleSelect" class="required form-control" multiple="multiple">
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
<div class="line line-bg b-b"></div>
<div class="row">
                    <div class="form-actions col-sm-offset-2 col-sm-10">          
						<a href="#contacts" class="btn btn-default btn-sm">Cancel</a>
                        <a href="#" type="submit" class="save btn btn-sm btn-primary" id="contactView">Save Changes</a>
                    </div>
</div>
                </fieldset>
            </form>
        </div>
    </div>
</div>
</div>
</script><!-- to be removed -->
<script id="contact-custom-view-collection-template" type="text/html">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-md-12">
       
            <h3 class="pull-left font-thin h3">Views</h3>
            <a href="#contact-view-add" class="btn btn-sm btn-default right" id="addView"><span><i class="icon-plus-sign" /></span> Add View</a>
<div class="clearfix"></div>
        
    </div>
</div>
</div>
<div class="row">
    <div class="col-md-9">
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
    <div class="col-md-3">
        <div class="well" id="addview">
            <h4>Customize your view</h4>
            
            <p>Look at contacts the way you want to. Choose different fields and the order in which you would like them to appear. You can add any number of views.</p>
        </div>
    </div>
</div>
</script>

<script id="contact-custom-view-model-template" type="text/html">
<td data='{{id}}' class='data'></td>  	
<td> {{name}} </td>
<td><div class="text-cap">{{#field_Element fields_set}}{{/field_Element}}</div>
</td>
<br/>
</script>
<script id="contacts-custom-view-model-template" type="text/html">
<!--
{{#each fields_set}}
	{{#equals "image" this}}
		 <td><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width='40px' height='40px'></td>
	{{/equals}}
			<td>{{getPropertyFieldValue .. this}}</td>
{{/each}}
-->
</script>

<script id="contacts-custom-view-table-model-template" type="text/html">
<!--
{{#each fields_set}}
	{{#equals "image" this}}
		 <td><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width='40px' height='40px'></td>
	{{/equals}}
			<td>{{getPropertyFieldValue .. this}}</td>
{{/each}}
-->
</script>
	
<script id="contacts-custom-view-collection-template" type="text/html">
<div class="custom-animated custom-fadeInUp">
<div class="bg-light lter b-b wrapper-md ng-scope">
    <div>
      <div>
 <h1 class="m-n font-thin h3 pull-left"><span id="contact-heading">Contacts</span><span id="contacts-count" class="m-l-xs">{{contacts_count}}</span></h1>
            <div class="pull-left"> <div class="btn-group m-l-lg m-r-sm" id="bulk-actions"
				style="display: none;">

					<div class="btn btn-sm btn-default">Bulk Actions</div>
					<a class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" href="#">
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
                         {{#hasScope "EXPORT_CONTACTS"}}
                        <li><a href="#" id="bulk-contacts-export">Export Contacts as CSV</a></li>
                         {{/hasScope}}
						<li><a href="#" class="delete-checked-contacts">Delete</a></li>
					</ul>
			</div>
			<div  class="btn-group inline-block" style="display: none;" id="bulk-select"></div>
			</div>
			<div class="pull-right">
			<div class="btn-group inline-block m-r-xs" id="filter-list"></div>
		
            <div id="view-list" class="inline-block"></div>
            </div>
        <div class="clearfix"></div>
    </div>
</div>
</div>

    <div class="hbox hbox-auto-xs hbox-auto-sm">
    <div class="col w-md b-r ">
		<div class="data-block">
			<div  id="lhs_filters_conatiner">
				
			</div>
		</div>
    </div>
    <div class="col contacts-div">
		{{#unless this.length}}
			<div class="filter-criteria">
					
			</div>
			<div id="slate"></div>
		{{else}}
        <div class="data">
         <div class="panel-heading" style="background:#f6f8f8;">Contacts List</div>
            <div class="dta-contatiner table-responsive">
				<div class="panel panel-default" style="overflow-x:auto;border-left:none;">
			    
                <table id="contacts-table" class="table table-striped showCheckboxes no-sorting panel agile-table"  url="core/api/bulk/update?action_type=DELETE" style="table-layout:auto">                
					<div class="filter-criteria">
					
					</div>
					<thead>
                        <tr style="text-transform: capitalize;">
                            {{contactTableHeadings "fields_set"}}
                        </tr>
                    </thead>
                    <tbody id="contacts-custom-view-model-list" route="contact/">
                    </tbody>
                </table>
				</div>
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
				<div class="panel panel-default">
			    <div class="panel-heading">Contacts List</div>
                <table id="contacts-table" class="table table-striped showCheckboxes no-sorting"  url="core/api/bulk/update?action_type=DELETE" style="table-layout:auto">                
					<div class="filter-criteria">					
					</div>
					<thead>
                        <tr class="text-cap">
                            {{contactTableHeadings "fields_set"}}
                        </tr>
                    </thead>
                    <tbody id="contacts-custom-view-table-model-list" route="contact/">
                    </tbody>
                </table>
				</div>
            </div>
        </div>
	{{/unless}}
</script>
<script id="contacts-grid-model-template" type="text/html">

<div class="p-b col-md-4 {{id}}">
  {{#if_contact_type "PERSON"}}
    <div class="b r-5x p-sm bg-white" id={{id}} style="height:110px;">
	<label class="i-checks i-checks-sm right">
       <input type="checkbox" class="tbody_check" value="">
       <i></i>                
     </label>
	  <div class="pull-left m-r-xs thumb">
        <img class="img-inital inline r r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 50}}" width="50px" height="50px"  />
      </div>
	  <div class="pull-left text-ellipsis" style="width:70%;">
        <a href="#contact/{{id}}" class="text-first-capital">
			{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}		
		</a>
		<br/>
        	{{getPropertyValue properties "email"}}
        
</div>
<div class="clearfix"></div>
<div class="w-full text-ellipsis m-t-xs">
        {{#each tags}}
        <span class="label bg-light dk text-tiny overflow-visible inline-block font-normal">{{this}}</span>
        {{/each}}
	  </div>
    </div>
  {{/if_contact_type}}

  {{#if_contact_type "COMPANY"}}
    <div class="b r-5x p-sm" style="background-color:#f5f5dc;height:100px;" id={{id}}>
		<label class="i-checks i-checks-sm right">
           <input type="checkbox" class="tbody_check" value="">
           <i></i>                
        </label>
	  	<div class="pull-left m-r-xs">
        	<img class="thumbnail m-b-none" {{getCompanyImage "50" "display:inline;"}} />
      	</div>
	  	<div class="pull-left text-ellipsis" style="width:70%;">
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
<div class="p-b col-md-4 {{id}}">
  {{#if_contact_type "PERSON"}}
    <div class="b r-5x p-sm" style="background-color:#f5f5dc;height:97px;"id={{id}}>
			<label class="i-checks right">
                <input type="checkbox" class="tbody_check" value="">
                <i></i>                
      		</label>
	  <div class="pull-left m-r-xs">
        <img class="thumbnail img-inital inline m-b-none" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 50}}" width="50px" height="50px"  />
      </div>
	  <div class="pull-left text-ellipsis" style="width:70%;">
        <a href="#contact/{{id}}" class="text-first-capital">
			{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}		
		</a>
		<br/>
        	{{getPropertyValue properties "email"}}
        
</div>
<div class="clearfix"></div>
<div class="w-full text-ellipsis m-t-xs">
        {{#each tags}}
        <span class="label bg-light dk text-tiny overflow-visible inline-block font-normal">{{this}}</span>
        {{/each}}
	  </div>
    </div>
  {{/if_contact_type}}

  {{#if_contact_type "COMPANY"}}
    <div class="b r-5x p-sm" style="background-color:#f5f5dc;height:75px;" id={{id}}>
	<label class="i-checks i-checks-sm">
		<input class="tbody_check right" type="checkbox"/>
	<i></i></label>
	  	<div class="pull-left m-r-xs">
        	<img class="thumbnail m-b-none" {{getCompanyImage "50" "display:inline;"}} />
      	</div>
	  	<div class="pull-left text-ellipsis" style="width:70%;">
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
<div class="custom-animated custom-fadeInUp">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-md-12">

<div class="pull-left">
			<h3 class="inline-block font-thin h3"><span id="contact-heading">Contacts</span><span id="contacts-count" class="m-l-xs">{{contacts_count}}</span></h3>
<div class="inline-block ">
			<div class="btn-group m-l-md" id="bulk-actions"
				style="display: none;">
					<div class="btn btn-sm btn-default">Bulk Actions</div>
					<a class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" href="#">
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
                         {{#hasScope "EXPORT_CONTACTS"}}
                        <li><a href="#" id="bulk-contacts-export">Export Contacts as CSV</a></li>
                         {{/hasScope}}
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
			<div  class="btn-group" style="display: none;" id="bulk-select"></div>
		</div>
</div>
<div class="pull-right">
            <div class="btn-group m-r-sm" id="filter-list"></div>
			<div class="btn-group " id="view-list"></div>
			
</div>
<div class="clearfix"></div>
   
    </div>
    </div>
    </div>
<div class="hbox hbox-auto-xs hbox-auto-sm bg-light">
    <div class="col w-md b-r ">
        <div class="data-block">
            <div  id="lhs_filters_conatiner">
				
			</div>
        </div>
    </div>
    <div class="col wrapper">
		<div class="filter-criteria"></div>
        <div id="slate">
        </div>
        {{#if this.length}}
        <div class="data">
            <div class="data-container">
                <div id="contacts-grid-model-list" class="contacts-model-list grid-view showCheckboxes" route="contact/"  url="core/api/bulk/update?action_type=DELETE"></div>
            </div>
        </div>
        {{/if}}
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
