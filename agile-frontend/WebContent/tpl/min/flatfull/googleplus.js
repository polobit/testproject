<script id="googleplus-login-template" type="text/html">
<div>
	Keep tabs on your customers' activity on Google+ and engage with them better.
	<div class="m-t-md  m-b-xs">
		<a class='btn btn-primary btn-sm text-l-none' href="{{url}}">Link Your Google+</a>
	</div>
</div>
</script>

<script id="googleplus-revoke-access-template" type="text/html">
<div>
{{#if custom_data.image.url}}	
<div class="m-t">
		<div class="pull-left thumb-md thumb-wrapper">
			<img src="{{custom_data.image.url}}&sz=70" alt="" class="w-full"/>
		</div>
		<div class="pull-left m-l-sm">
			<p><a href="{{custom_data.url}}" target="_blank" >{{custom_data.displayName}}</a></p>
		</div>
<div class="clearfix"></div>
	</div>
{{/if}}
	
		<div class="m-t-md">
			<a class='btn btn-sm btn-danger revoke-widget' widget-name="GooglePlus">Revoke Access</a>
			<a href="#add-widget" class='btn btn-default btn-sm m-l-xs'  widget-name="GooglePlus">Cancel</a>
		</div>
	
</div>
</script>

<script id="googleplus-search-result-template" type="text/html">
{{#each this}}
<a class="thumb-sm m-r-sm m-b-sm" target="_blank">
<img rel='popover' data-trigger="hover" data-original-title='Google+ Profile' class='GoogleplusDisplayPic pull-left r r-2x c-p' id='{{id}}' src ='{{image.url}}' screen_name="{{displayName}}"
    
   data-content="
      <div class='row p-b-sm'>
            <div class='col-md-4 p-t-none p-r-sm p-b-none p-l-sm'>
              <img src='{{image.url}}'></img>
            </div>
            <div class='col-md-8'>
               <b class='text-sm' style='color:#069;'>{{displayName}}</b>
            </div>" 
></img></a>
{{/each}}
</script>


<script id="googleplus-pop-profile-template" type="text/html">
<div>
	<p>{{placesLived.0.value}}</p>
	<p>{{occupation}}</p>
	<p>{{organizations.0.name}} - {{organizations.0.title}}</p>
</div>
</div>
<div class='row p-b-sm word-break'>
	<p class="font-italic">{{show_link_in_statement tagline}}</p>
</div>
</script>


<script id="googleplus-modified-search-template" type="text/html">
	<div class="inline l-h-xs word-break">
		<form class="panel-body b-b-none text-base" id="gpsearchform" name="gpsearchform" method="get">
	    	<fieldset>
				<p><label>Enter search details</label></p>
				<div class="control-group form-group"><div class="controls"><input type="text" id="searchkeywords" class="input-medium required widget_input_box form-control"  placeholder="Key Words" value="{{keywords}}" name="keywords" maxlength="40" required></input></div></div>
				<a href="#" id="gpsearchbtn" class="btn btn-sm btn-primary text-l-none">Search</a>				
				<a href="#" id="gpsearchclose" class="btn btn-sm m-l-xs btn-default">Close</a>
				<span><img src="img/ajax-spinner.gif" id="spinner-search" style="display:none;"></img></span>
			 </fieldset>
	    </form>
	</div>
</script>

<script id="googleplus-error-panel-template" type="text/html">
<div class="wrapper-sm">
{{#if disable_check}}
	<div class="word-break text-base" style="line-height:160%;">
		{{{message}}}
	</div>
{{else}}
	{{#check_length message "140"}}
		<div class="ellipsis-multiline word-break text-base" title="{{message}}" style="height: 100px !important;-webkit-line-clamp: 5;line-height:160%;word-break: normal;">
			{{{message}}}
		</div>
	{{else}}
		<div class="word-break text-base" style="line-height:160%;">
			{{{message}}}
		</div>
	{{/check_length}}	
{{/if}}
</div>
</script>


<script id="googleplus-profile-template" type="text/html">
<div class="panel-body">
	<a href="{{url}}" target="_blank" class="thumb pull-left m-r-xs"><img src="{{image.url}}" class="img-circle"></a>
	<div class="clear">
		<a href="{{url}}" class="text-cap text-base" target="_blank">{{displayName}}</i></a>
		<small class="block text-muted">{{placesLived.0.value}}</small>
		<small class="block text-muted">{{occupation}}</small>
		<small class="block text-muted">{{show_link_in_statement tagline}}</small>
	</div>	
	<div class="clearfix"></div>	
</div>
<div class="clearfix"></div>
<div id="recentPostsText"></div>
<div id="gpostscontainer"></div>
</script>

<script id="googleplus-profile-tabs-template" type="text/html">

<div class="tab-content" id="gpTabContent">
<div id="gpposts" class="tab-pane fade active in">
	<ul class="list-group m-b-none text-base"  id="gplus_social_stream">	
{{#each items}}
	<li class="list-group-item r-none b-l-none b-r-none text-base" post_id="{{id}}">	
		{{#if_equals object.attachments.0.objectType "photo"}}
			<a href="{{url}}" class="thumb-sm m-t-xs m-r-xs pull-left" target="_blank"><img src="{{object.attachments.0.image.url}}" alt="" class="r r-2x"/></a>
			<div class="clear">							
				<p class="mb_0">
					{{title}} <a href="{{url}}" target="_blank">view photo</a>
				</p>
			</div>
			<small>{{verb}}ed</small> 
			<small class="text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{updated}}" title="{{updated}}">{{updated}}</time></small>
		{{else}}
		{{#if_equals object.attachments.0.objectType "video"}}
		    <a href="{{url}}" class="thumb-sm m-r-xs m-t-xs pull-left" target="_blank"><img src="{{object.attachments.0.image.url}}" alt="" class="r r-2x"/></a>
			<div class="clear">							
			 <p class="mb_0 word-break" style="word-break:normal;">
				{{title}} <a href="{{url}}" target="_blank">view video</a>
			 </p>			
		    </div>
			<small>{{verb}}ed</small>
			<small class="text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{updated}}" title="{{updated}}">{{updated}}</time></small>
		{{else}}				
			<div class="clear">	
				<p class="mb_0 word-break" style="word-break:normal;">
					{{title}} <a href="{{url}}" target="_blank">view more</a>
				</p>
			</div>
			<small>{{verb}}ed</small>
			<small class="text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{updated}}" title="{{updated}}">{{updated}}</time></small>		
		{{/if_equals}}{{/if_equals}}						
	</li>
	<div class="clear-fix"></div>
{{/each}}
		</ul>
		{{#if_equals items.length 0}}
<!--<div style="font-size: 16px;padding: 5px;"><small>No posts.</small></div>-->
{{else}}
		<div class="widget_tab_footer" align="center">
			<a href="#" class="gplus_stream text-info" id="gplusstreammore" rel="tooltip" ntoken="{{nextPageToken}}" title="Click to see more posts">Show More</a>
			<span id="spinnerspan" style="display:none;"><img src="img/ajax-spinner.gif" id="spinner-gplus"></img><span>
		</div>
{{/if_equals}}
	</div>
	
</div>
</script>

<script id="googleplus-posts-template" type="text/html">
{{#each items}}
<li class="list-group-item r-none b-l-none b-r-none" post_id="{{id}}">	
				
{{#if_equals object.attachments.0.objectType "photo"}}
<a href="{{url}}" class="thumb pull-left m-r-xs" target="_blank"><img src="{{object.attachments.0.image.url}}" alt="" class="r r-2x"></a>
<div class="clear">
	<p class="mb_0 word-break" style="word-break:normal;">
		{{title}} <a href="{{url}}" class="text-info" target="_blank">view photo</a>
	</p>
</div>
<small>{{verb}}ed</small>
<small class="text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{updated}}" title="{{updated}}">{{updated}}</time></small>
{{else}}
{{#if_equals object.attachments.0.objectType "video"}}
<a href="{{url}}" class="thumb pull-left m-r-xs" target="_blank"><img src="{{object.attachments.0.image.url}}" alt="" class="r r-2x"></a>
<div class="clear">
	<p class="mb_0 word-break" style="word-break:normal;">
		{{title}} <a href="{{url}}" class="text-info" target="_blank">view video</a>
	</p>
</div>
<small>{{verb}}ed</small>
<small class="text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{updated}}" title="{{updated}}">{{updated}}</time></small>
{{else}}
<p class="mb_0 word-break" style="word-break:normal;">
{{title}} <a href="{{url}}" class="text-info" target="_blank">view more</a>
</p>
<small>{{verb}}ed</small>
<small class="text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{updated}}" title="{{updated}}">{{updated}}</time></small>
{{/if_equals}}{{/if_equals}}
									
</li>
{{/each}}
</script>