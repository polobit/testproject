
<script id="facebook-login-template" type="text/html">
<div>
	Facebook is a social utility that connects people with friends and others who work, study and live around them.
<div class="m-t-md">	
<a class="btn btn-sm btn-primary" href="{{url}}">Link Your Facebook</a>
</div>
</div>
</script>

<script id="facebook-matching-profiles-template" type="text/html">
<div class="panel-body text-sm">
	{{#if profiles}}
	<div class="wapper-sm text-base"><p>Search results for  <a href='#' class="facebook_modify_search">{{searchString}}</a></p></div>
	{{#each profiles}}	
			<a class="thumb-sm m-r-sm m-b-sm" target="_blank">
				<img rel='popover' data-trigger="hover" data-original-title='Facebook Profile' class='facebookImage pull-left r r-2x c-p' id='{{userId}}' src ='{{userPicUrl}}' screen_name=""
   				summary="" 
   				data-content="<div class='row'>
           		 				<div class='pull-left p-t-none m-r p-r-sm p-b-none p-l-sm'>
             		 				<img src='{{userPicUrl}}'></img>
           		 				</div>
            					<div class='pull-left'>
               						<b class='text-base'>{{userName}}</b>
									<p class='p-t-xs'>{{email}}</p>
									<p class='p-t-xs'>{{location}}</p>
									<p class='p-t-xs'>{{website}}</p>
            					</div>		
      						  </div>
							 "></img>
			</a>
{{/each}}
{{else}}
	<div class="p-t-none p-r-none p-b-sn p-l-none text-base"><p class='m-b-none'>No matches found for <a href='#' class="facebook_modify_search">{{searchString}}</a></p></div>
{{/if}}
</div><div class="clearfix"></div>
</script>

<script id="facebook-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25 overflow-hidden p-n word-break text-base" title="{{message}}" style="height:110px;line-height:160%;">
		{{{message}}}
	</div>
{{else}}
	<div class="word-break p-n text-base" style="line-height:160%;">
		{{{message}}}
	</div>
{{/check_length}}
</div>
</script>

<script id="facebook-modified-search-template" type="text/html">
	<div class="inline word-break l-h-xs">
		<form class="panel-body b-b-none text-base" id="facebook-search_form" name="facebook-search_form" method="get">
	    	<fieldset>
				<p><label>Enter search details</label></p>
				<div class="control-group form-group">
					<div class="controls">
						<input type="text" id="facebook_keywords" class="input-medium required widget_input_box form-control" style="width:90%" placeholder="Key Words" value="{{searchString}}" name="keywords"  maxlength="40"></input>
					</div>
				</div>
				<input type="submit"  id="facebook_search_btn" class="btn btn-sm btn-primary text-l-none"></input>					
				<a href="#" id="facebook_search_close" class="btn btn-sm btn-default m-l-xs">Close</a>
				<span><img src="img/ajax-spinner.gif" id="spinner-facebook-search" style="display:none;"></img></span>
			 </fieldset>
	    </form>
	</div>
</script>
<script id="facebook-profile-template" type="text/html">
	<div class="panel-body">
{{#if user.image}}
		<a href="{{user.link}}" target="_blank" class="thumb pull-left m-r-xs"><img src="{{user.image}}" class="img-circle"></a>
		<div class="clear">
			<a href="{{user.link}}" class="text-base" target="_blank">{{user.name}}</i></a>
			<div>			
				<a class="btn btn-xs btn-default m-t-xs" id="send_fb_friend_request_w" href= "#" onClick="window.open('https://www.facebook.com/dialog/friends/?id={{user.id}}&app_id=1472694689634803&redirect_uri=https://my.agilecrm.com/backend/googleservlet?act=facebook','Sample','toolbar=no,width=800,height=500,left=200,top=200, status=no,scrollbars=no,resize=no');return false">Add Friend</a>
				<a class="btn btn-xs btn-default m-t-xs" id="fb_post_on_wall" href= "#" onClick="window.open('https://www.facebook.com/dialog/send?app_id=1472694689634803&display=popup&to={{user.id}}&link=https://www.agilecrm.com/&redirect_uri=https://my.agilecrm.com/backend/googleservlet?act=facebook','Sample','toolbar=no,width=1000,height=500,left=200,top=200, status=no,scrollbars=no,resize=no');return false">Post</a>
			</div>
		</div>		
		<div class="clearfix"></div>
{{else}}
{{#if user.error}}
{{user.error.message}}
{{/if}}
{{/if}}	
</div>
</script>
<script id="facebook-revoke-access-template" type="text/html">
<div>
{{#if custom_data.picture.data.url}}
	<div>
		<div class="pull-left thumb-md thumb-wrapper">
			<img src="{{custom_data.picture.data.url}}" class="w-full"  alt="" />
		</div>
		<div class="pull-left m-l-sm">
			<p><a href="{{custom_data.link}}" target="_blank" >{{custom_data.name}}</a></p>
			<p class="m-n">{{custom_data.location.name}}</p>
		</div>
	</div>
{{/if}}
	<div class="clearfix"></div>
		<div class="m-t-md m-r-none m-b-xs m-l-none">
			<a class='btn btn-sm btn-danger revoke-widget' widget-name="Facebook">Revoke Access</a>
			<a href="#add-widget" class='btn btn-default btn-sm m-l-xs' widget-name="Facebook">Cancel</a>
		</div>
	
</div>
</script>