<script id="twitter-profile-template" type="text/html">
<div class="wrapper-sm" >
	<a href="{{url}}" target="_blank" class="thumb pull-left m-r-sm"><img src="{{picture}}" class="img-circle"></a>	
	<div class="clear">
		<a href="{{url}}" target="_blank" class="text-cap text-base">{{name}}</a>
		<small class="block text-muted">{{location}}</small>
		<small class="block text-muted">{{show_link_in_statement summary}}</small>
		<div>
			<a href="#" class="btn btn-xs btn-default m-t-xs" id="twitter_follow" style="display:none;" name="{{name}}">Follow</a>
			<a href="#" class="btn btn-xs btn-default m-t-xs" id="twitter_unfollow" name="{{name}}" style="display:none;">Following</a>
			<a href="#" class="btn btn-xs btn-default m-t-xs" id="twitter_tweet" rel="tooltip" title="Compose a new Tweet">Tweet</a>
			{{#if is_followed_by_target}}
				<a href="#" class="btn btn-xs btn-default m-t-xs icon-envelope" id="twitter_message" rel="tooltip" title="Send Direct Message"></a>
			{{/if}}
		</div>			
	</div>
	<div class="clearfix"></div>	
	
</div>
<div id="twitter-error-panel" style="display:none;" >
</div>
<div class="nav-tabs-alt">
	<ul class="nav nav-tabs text-base twitter-tabs" id="myTab">
		<li class="text-center m-l-xs active" style="width:32%;" align="center"><a data-toggle="tab" class="p-l-none p-r-none" href="#tweets"><h4 class="text-base m-n">{{tweet_count}}</h4><small>Tweets</small></a></li>
		<li class="text-center" style="width:32%;" align="center"><a data-toggle="tab" class="p-l-none p-r-none" href="#followers" id="twitter_followers"><h4 class="text-base m-n">{{num_connections}}</h4><small>Followers</small></a></li>
		<li class="text-center" style="width:32%;" align="center"><a data-toggle="tab" class="p-l-none p-r-none" href="#following" id="twitter_following"><h4 class="text-base m-n">{{friends_count}}</h4><small>Following</small></a></li>
	</ul>
</div>
<div class="tab-content text-sm" id="myTabContent">
	<div id="tweets" class="tab-pane fade active in">
		{{#if current_update}}
			<ul class="list-group text-base"  id="twitter_current_activity" style="display:none;">
				<li class="list-group-item r-none b-l-none b-r-none">	
					{{show_link_in_statement current_update}}
				</li>
			</ul>
		{{else}}
			<ul class="p-l-sm text-base"  id="twitter_current_activity" style="display:none;">
				<li class="list-group-item r-none b-l-none b-r-none">	
					{{#if_equals tweet_count "0"}}
						{{name}} hasn't tweeted yet
					{{else}}
						Only confirmed followers have access to {{name}}'s Tweets and complete profile. Click the "Follow" button to send a follow request.
					{{/if_equals}}
				</li>
			</ul>
		{{/if}}
		<ul class="p-l-none text-base"  id="twitter_social_stream">
					
		</ul>
		<div class="clearfix" id="tweet-error-panel" style="display:none;">
		</div>
		<div class="widget_tab_footer" align="center">
			<a href="#more" class="twitter_stream text-info" id="twitter_stream" rel="tooltip" title="Click to see more tweets">Show More</a>
			<a href="#less" data-toggle="collapse" data-target="#twitter_social_stream" id="twitter_less" style="display:none">Show Less..</a>
			<img src="img/ajax-spinner.gif" id="spinner-tweets" style="display:none;"></img>			
		</div>
	</div>
	<div id="followers" class="tab-pane fade">
		<ul class="wrapper-sm p-l-md p-b-none text-base" id="twitter_follower_panel">
						
		</ul>
		<div id="follower-error-panel" style="display:none;" >
		</div>
		<div class="widget_tab_footer" align="center">
			<a href="#more" class="text-info" id="more_followers" rel="tooltip" title="Click to see more persons">Show More</a>
			<img src="img/ajax-spinner.gif" id="spinner-followers" style="display:none;"></img>
		</div>
	</div>
	<div id="following" class="tab-pane fade">
		<ul class="wrapper-sm p-l-md p-b-none text-base" id="twitter_following_panel">
			
		</ul>
		<div id="following-error-panel" style="display:none;" >
		</div>
		<div class="widget_tab_footer" align="center">
			<a href="#more" id="more_following" class="text-info" rel="tooltip" title="Click to see more persons">Show More</a>
			<img src="img/ajax-spinner.gif" id="spinner-following" style="display:none;"></img>
		</div>
	</div>
</div>
</script>

<script id="twitter-message-template" type="text/html">
<div class="modal fade message-modal word-break" id="twitter_messageModal" aria-hidden="false" style="display: block; padding-left: 17px;">
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog"> 
  <div class="modal-content"> 
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			{{#if_equals headline "Direct Message"}}
	        	<h3><i class="icon-envelope"></i> {{headline}}</h3>
			{{/if_equals}}
			{{#if_equals headline "Tweet"}}
				<h3><i class="icon-share"></i> {{headline}}</h3>
			{{/if_equals}}
	    </div>
	    <div class="modal-body agile-modal-body">
	        <form id="twitter_messageForm" name="twitter_messageForm" method="post">
	            <fieldset>
					<input name="twitter_id" type="hidden" value="" />
					<div class="m-b-sm">
						{{info}}
					</div>	                
	                <div class="control-group">
	                    <label class="control-label"><b>Message: </b><span class="field_req">*</span></label>
	                    <div class="controls m-l-none">
							{{#if_equals headline "Tweet"}}
								<textarea rows="4" class="required form-control twit-tweet-limit" placeholder="Detailed Message" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" maxlength="125" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }">{{description}}&nbsp</textarea>
							{{else}}
	                        	<textarea rows="4" class="required form-control twit-message-limit" placeholder="Detailed Message" name="message" id="twit-message" data-provide="limit" data-counter="#counter" maxlength="125" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"></textarea>
							{{/if_equals}}  
							<div class="right"><small style="font-style: italic;">Characters Left <em id="twitter-counter" class="m-r-xs">125</em></small></div>
	                    </div>
	                </div>
	            </fieldset>
	        </form>
	    </div>
	<div class="modal-footer">
	        <a href="#" class="btn btn-sm btn-primary" id="send_request">Send</a>
	    </div>
	</div>
</div>
</div>
</div>
</script>

<script id="twitter-update-stream-template" type="text/html">
{{#if this.length}}	
	<div id="twitter_update">
		{{#each this}}	
			<li id="twitter_status" status_id="{{id}}" class="list-group-item r-none b-l-none b-r-none text-base">		
				<a class="thumb-sm m-r-xs pull-left"><img src="{{tweeted_person_pic_url}}" width="40px" alt="" class="r r-2x"/></a>
				<div class="clear">					
						<p class="mb_0 w-full">{{safe_string message}}</p>						
				</div>
				<small class="text-muted">
						<i class="fa fa-clock-o m-r-xs"></i>
						<time class="time-ago" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
						<span class="widget_tab_link m-t-xs pull-right">
							{{#if is_retweeted}}
								<a href="#retweeted" rel="tooltip" title="Retweeted"><i class="icon-retweet"  id="{{id}}" ></i></a>
							{{else}}
								<a href="#retweet" rel="tooltip" title="Retweet the tweet"><i class="text-muted twitter_retweet icon-retweet" id="{{id}}"></i></a>
							{{/if}}
						</span>
				</small>
				<div class="clearfix"></div>
			</li>	
           												
		{{/each}}
	</div>
{{else}}
		<li class="text-light text-base">This person does not share his/her tweets</li>
{{/if}}
</script>

<script id="twitter-error-panel-template" type="text/html">
<div class="wrapper-sm">
{{#if disable_check}}
	<div class="word-break wrapper-sm text-base" style="line-height:160%;">
		{{{message}}}
	</div>
{{else}}
	{{#check_length message "140"}}
		<div class="ellipsis-multiline word-break text-base" title="{{message}}" style="height: 100px !important;-webkit-line-clamp: 5;line-height:160%;word-break: normal;">
			{{{message}}}
		</div>
	{{else}}
		<div class="word-break p-t-none p-r-none p-b-sm p-l-none text-base" style="line-height:160%;">
			{{{message}}}
		</div>
	{{/check_length}}	
{{/if}}
</div>
</script>

<script id="twitter-profile-add-template" type="text/html">
<div id="twitter-image-save-modal" class="modal fade" aria-hidden="false" style="display: block; padding-left: 17px;" >
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog"> 
  <div class="modal-content"> 
	<div class="modal-header" >
    	<a href="#" data-dismiss="modal" class="close">&times;</a>
		<h3>Add Profile</h3></div>
        <div class="modal-body" >
		<p>Associate Twitter profile to contact?</p>
        <p>
			<label class="i-checks i-checks-sm">
			<input type="checkbox" name="add-image" id="save_twitter_image" checked="checked"/><i></i></label>
			Add Twitter image to contact
		</p>
	</div>
	<div class="modal-footer" >
		<a href="#" class="btn btn-sm btn-default close save-twitter-profile" resp="no">No</a>
		<a href="#" class="btn btn-sm btn-primary save-twitter-profile" resp="yes">Yes</a>
	</div>
</div>
</div>
</div>
</script>

<script id="twitter-follower-following-template" type="text/html">
{{#each this}}
<a href="{{url}}" class="thumb-sm m-r-sm m-b-sm" target="_blank">
	<img rel="popover" data-original-title="Twitter Profile" data-trigger="hover" data-placement="top" class="twitterImage pull-left r r-2x c-p" id='{{id}}' src ='{{picture}}' screen_name="{{screen_name}}"
   	summary="{{summary}}"  
   	data-content="
	  <div class='row'>
        <div class='pull-left p-t-none m-r p-r-sm p-b-none p-l-sm'>
           <img class='thumb' src='{{picture}}'></img>
        </div>
        <div class='pull-left'>
            <b class='text-sm' style='color:#069;'>{{name}}</b>
			<p class='p-t-xs'>{{location}}</p>
      	</div>		      		
	  </div>
	  <div  class='pull-left p-b-sm m-l-xs m-r-xs word-break'>
		 <p class='font-italic'>{{summary}}</p>
	  </div>    
	</div>
<div class='clearfix'></div>
      <div class='row p-b-sm p-t-sm'>
            <div class='col-md-4 text-center'>Tweets<p>{{tweet_count}}</p></div>
            <div class='col-md-4 text-center b-l'>Followers<p>{{num_connections}}</p></div>
            <div class='col-md-4 text-center b-l'>Follows<p>{{friends_count}}</p></div>
      </div>" 
></img></a>
{{/each}}
</script>

<script id="twitter-modified-search-template" type="text/html">
	<div class="inline word-break" style="line-height:12px;">
		<form class="wrapper-sm b-b-none text-base" id="twitter-search_form" name="twitter-search_form" method="get">
	    	<fieldset>
				<p><label>Enter search details</label></p>
				<div class="control-group form-group"><div class="controls"><input type="text" id="twitter_keywords" class="input-medium required widget_input_box form-control"  placeholder="Key Words" value="{{keywords}}" name="keywords" onkeydown="if (event.keyCode == 13) { getModifiedTwitterMatchingProfiles({{plugin_id}}); return false; }" maxlength="40"></input></div></div>
				<a href="#" id="twitter_search_btn" class="btn btn-sm btn-primary text-l-none">Search</a>
				<a href="#" id="twitter_search_close" class="btn btn-sm btn-default m-l-xs">Close</a>
				<span><img src="img/ajax-spinner.gif" id="spinner-twitter-search" style="display:none;"></img></span>
			 </fieldset>
	    </form>
	</div>
</script>


<script id="twitter-login-template" type="text/html">
<div class="m-t">
	Engage with contacts in real time based on what they tweet.	
<br>
		<a class='btn btn-sm btn-primary text-l-none m-t' href="{{url}}">Link Your Twitter</a>	
</div>
</script>

<script id="twitter-revoke-access-template" type="text/html">
<div class="m-t">
		<div class="pull-left thumb-md thumb-wrapper">
			<img src="{{profile.picture}}"  alt="" />
		</div>
		<div class="pull-left m-l-sm">
			<p><a href="{{profile.url}}" target="_blank" >{{profile.name}}</a></p>
			<p>{{profile.location}}</p>
			<p class="word-break" style="word-break:normal;">{{show_link_in_statement profile.summary}}</p>
		</div>
	<div class="clearfix"></div>
	<div class="m-t-md">
			<a class='btn revoke-widget btn-sm btn-danger text-l-none' widget-name="Twitter">Revoke Access</a>
			<a href="#add-widget" class='btn btn-default btn-sm ml_5 text-l-none' widget-name="Twitter">Cancel</a>
	</div>
</div>
</script><script id="twitter-search-result-template" type="text/html">
{{#each this}}
<a class="thumb-sm m-r-sm m-b-sm" target="_blank">
<img rel='popover'  data-trigger="hover" data-original-title='Twitter Profile' class='twitterImage pull-left r r-2x c-p' id='{{id}}' src ='{{picture}}' screen_name="{{screen_name}}"
   summary="{{summary}}"  
   data-content="
      <div class='row p-b-sm' >
            <div class='pull-left p-t-none m-r p-r-sm p-b-none p-l-sm'>
              <img src='{{picture}}'></img>
            </div>
            <div class='pull-left'>
               <b class='font-base' style='color:#069;'>{{name}}</b>
				<p class='p-t-xs'>{{location}}</p>
            </div>		
      </div>
	  <div  class='row p-b-sm word-break'>
		 <p class='m-l-sm font-italic'>{{summary}}</p>
	  </div>    
      <div class='row p-b-sm'>
            <div class='col-md-4 text-center'>Tweets<p>{{tweet_count}}</p></div>
            <div class='col-md-4 text-center b-l'>Followers<p>{{num_connections}}</p></div>
            <div class='col-md-4 text-center b-l'>Follows<p>{{friends_count}}</p></div>
      </div>" >
</img>
</a>
{{/each}}
</script>