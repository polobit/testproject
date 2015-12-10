<script id="gmap-table-model-template" type="text/html">

<td style="cursor:default;" class="select_checkbox">
	<input class="tbody_check" type="checkbox"/>
</td>

<td>
	<div class="row-fluid">
{{#if contact}}
    	<div style="display:inline;padding-right:5px;height:auto;">
{{#wrap_entity this.contact}}
        	<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
        </div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%">
        	<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        	<br />
        		{{getPropertyValue properties "email"}}
{{/wrap_entity}}
		</div>
{{else}}
    	<div style="display:inline;padding-right:5px;height:auto;">
        	<img class="thumbnail" width="40px" height="40px" style="display:inline; width:40px; height:40px; " src="https://secure.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e.jpg?s=40&d=https%3A//da4o37ei6ybbh.cloudfront.net/css/images/pic.png" />
        </div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%">
        	<b>	Anonymous </b>
		</div>
{{/if}}
	</div>
</td>

<td><div>{{visit_time}}</div></td>

<td><div>{{user_location}}</div></td>

<td><div>{{user_agent}}</div></td>

</script>

<script id="gmap-table-collection-template" type="text/html">

<div class="row-fluid">
	<div class="span12">
		{{#unless this.length}}
			<div class="filter-criteria">
					
			</div>
			<div id="slate"></div>
	{{/unless}}
		{{#if this.length}}
		<div class="data">
			<div class="data-container"></div>
			<table id="contacts" class="table table-striped showCheckboxes agile-ellipsis-dynamic"
				url="core/api/bulk/update?action_type=DELETE">
				<col width="5%">
				<col width="30%">
				<col width="15%">
				<col width="25%">
				<col width="25%">
				<div class="filter-criteria"></div>
				<thead>
					<tr>
						<th><input class="thead_check" type="checkbox"></input></th>
						<th>Name</th>
						<th>Last Visited</th>						
						<th>Location</th>
						<th>Device Type</th>
					</tr>
				</thead>
				<tbody id="gmap-table-model-list" class="gmap-table-model-list"
					route="contact/" style="overflow: scroll;overflow:hidden;">
				</tbody>
			</table>
		</div>
	</div>
	{{/if}}
</div>
</script>

<script id="gmap-html-page-template" type="text/html">
<link href="http://localhost:8888/misc/gmap/gmap-css/agile-fluid-layout.css" rel="stylesheet">
    <div class="container-fluid" id="outer_container" style="padding:0px;">
      <div class="row-fluid">
        <div class="span12">
          
        <!-- Gmap Main Area -->
              
			  <div class="page-header">
  				<h1>Visitors <small>Map the visitors</small></h1>
  				<div class="right" style="top:-28px;position:relative">
				  <div id="gmap_date_range" class="pull-right" style="box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1); padding: 5px; cursor: pointer;">
					<i class="icon-calendar"></i>
					<span id="range">{{date-range "today" "-6"}}</span>
					<i class="caret" style="margin-top: 6px; margin-left: 4px;"></i>
				  </div>
				</div>
			  </div>
              
			  <div class="leaderboard">
            	
            	  <div class="row-fluid">
        <!-- Map Tab Area -->    	    
            	    <div class="map-tab option-tabs">
            	      <ul class="nav nav-tabs" data-tabs="tabs">
            	        <li id="gmap-map-tab" class="active"><a href="#gmap-map-view" data-toggle="tab">Map View</a></li>
            	        <li id="gmap-table-tab"><a href="#gmap-table-view" data-toggle="tab">Table View</a></li>
            	      </ul>
            	      
            	      <div class="tab-content">
            	      	<img id="map-tab-waiting" style="width: 16px; float: left; margin: 5px 5px 0px 8px; display: none;" src="https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif">
            	      	<div class="tab-pane active" id="gmap-map-view">
        <!-- Google Map -->    	      	  
            	      	  <div id="google_map" class="map" style="width:auto; height:430px;"></div>
        <!-- Google Map -->    	      	  
            	      	</div>
            	      	<div class="tab-pane" id="gmap-table-view">
            	      	  <p>Here Comes Table Details View !!!</p>
            	      	</div>
            	      </div>
            	    </div>
        <!-- Map Tab Area -->     	  
            	  </div>
				
		      </div>
        <!-- Gmap Main Area -->      
          
        </div><!--/.fluid-container-->
      </div>
    </div>

</script>
