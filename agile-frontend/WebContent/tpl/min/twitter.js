<script id="twitter-profile-template" type="text/html">
<div class="widget_content row-fluid" style="margin:10px 0px;">
	<div class="span3"><img src="{{picture}}" width="36" height="36" alt="" class="img-rounded pull-left"/></div>
	<div class="pull-left ml_5 span8">
		<p class="title_txt"><a href="{{url}}" target="_blank" >{{name}}</a></p>
		<p>{{location}}</p>
	</div>
	<div class="clearfix"></div>	
	<p style="word-wrap:break-word;word-break:normal;">{{show_link_in_statement summary}}</p>
	<a href="#" class="btn" id="twitter_follow" name="{{name}}" style="display:none;"><i class="icon-twitter"></i>&nbsp;Follow</a>
	<a href="#" class="btn btn-primary ml_5" id="twitter_unfollow" name="{{name}}" style="display:none;">Following</a>
	<a href="#" class="btn ml_5" id="twitter_tweet" rel="tooltip" title="Compose a new Tweet">Tweet</a>
	{{#if is_followed_by_target}}<a href="#" class="btn ml_5 icon-envelope" id="twitter_message" rel="tooltip" title="Send Direct Message"></a>{{/if}}					
</div>
<div class="" id="twitter-error-panel" style="display:none;" >
</div>
<ul class="nav nav-tabs row-fluid twitter-tabs" id="myTab">
	<li class="active" style="width:32%; margin-left:2%;text-align: center;" align="center"><a data-toggle="tab" href="#tweets"><h4>{{tweet_count}}</h4><small>Tweets</small></a></li>
	<li style="width:32%;text-align: center;" align="center"><a data-toggle="tab" href="#followers" id="twitter_followers"><h4>{{num_connections}}</h4><small>Followers</small></a></li>
	<li style="width:32%;text-align: center;" align="center"><a data-toggle="tab" href="#following" id="twitter_following"><h4>{{friends_count}}</h4><small>Following</small></a></li>
</ul>
<div class="tab-content" id="myTabContent">
	<div id="tweets" class="tab-pane fade active in">
		{{#if current_update}}
			<ul class="widget_tab_content"  id="twitter_current_activity" style="display:none;">
				<li>	
					{{show_link_in_statement current_update}}
				</li>
			</ul>
		{{else}}
			<ul class="widget_tab_content"  id="twitter_current_activity" style="display:none;">
				<li>	
					{{#if_equals tweet_count "0"}}
						{{name}} hasn't tweeted yet
					{{else}}
						Only confirmed followers have access to {{name}}'s Tweets and complete profile. Click the "Follow" button to send a follow request.
					{{/if_equals}}
				</li>
			</ul>
		{{/if}}
		<ul class="widget_tab_content collapse in"  id="twitter_social_stream">
					
		</ul>
		<div class="clearfix" id="tweet-error-panel" style="display:none;">
		</div>
		<div class="widget_tab_footer" align="center">
			<a href="#more" class="twitter_stream" id="twitter_stream" rel="tooltip" title="Click to see more tweets">Show More</a>
			<a href="#less" data-toggle="collapse" data-target="#twitter_social_stream" id="twitter_less" style="display:none">Show Less..</a>
			<img src="img/ajax-spinner.gif" id="spinner-tweets" style="display:none;"></img>
			<a href="#refresh" id="twitter_refresh_stream" class="icon-refresh pull-right" rel="tooltip" title="Refresh to get current updates" style="display:none"></a>
		</div>
	</div>
	<div id="followers" class="tab-pane fade">
		<ul class="widget_tab_content" id="twitter_follower_panel" style="padding:10px 0px">
						
		</ul>
		<div id="follower-error-panel" style="display:none;" >
		</div>
		<div class="widget_tab_footer" align="center">
			<a href="#more" id="more_followers" rel="tooltip" title="Click to see more persons">Show More</a>
			<img src="img/ajax-spinner.gif" id="spinner-followers" style="display:none;"></img>
		</div>
	</div>
	<div id="following" class="tab-pane fade">
		<ul class="widget_tab_content" id="twitter_following_panel" style="padding:10px 0px;">
			
		</ul>
		<div id="following-error-panel" style="display:none;" >
		</div>
		<div class="widget_tab_footer" align="center">
			<a href="#more" id="more_following" rel="tooltip" title="Click to see more persons">Show More</a>
			<img src="img/ajax-spinner.gif" id="spinner-following" style="display:none;"></img>
		</div>
	</div>
</div>
</script>

<script id="twitter-message-template" type="text/html">
	<!-- New (Note) Modal views -->
	<div class="modal hide fade message-modal" id="twitter_messageModal" style="width:400px; left:55%;word-wrap: break-word;">
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
					<div style="margin-bottom:10px;">
						{{info}}
					</div>	                
	                <div class="control-group">
	                    <label class="control-label"><b>Message: </b><span class="field_req">*</span></label>
	                    <div class="controls span4" style="margin-left:0px;">
							{{#if_equals headline "Tweet"}}
								<textarea rows="4" class="required span4 twit-tweet-limit" placeholder="Detailed Message" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" maxlength="125" style="max-width:500px;" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }">{{description}}&nbsp</textarea>
							{{else}}
	                        	<textarea rows="4" class="required span4 twit-message-limit" placeholder="Detailed Message" name="message" id="twit-message" data-provide="limit" data-counter="#counter" maxlength="125" style="max-width:500px;" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"></textarea>
							{{/if_equals}}  
							<div class="right"><small style="font-style: italic;">Characters Left <em id="twitter-counter" style="margin-right:5px;">125</em></small></div>
	                    </div>
	                </div>
	            </fieldset>
	        </form>
	    </div>
	    <div class="modal-footer">
	        <a href="#" class="btn btn-primary" id="send_request">Send</a>
	    </div>
	</div>
</script>
<!-- End of Modal views -->

<script id="twitter-update-stream-template" type="text/html">
{{#if this.length}}	
	<div id="twitter_update">
		{{#each this}}	
			<li id="twitter_status" status_id="{{id}}">	
				<div class="pull-left row-fluid">
					<div class="span2 mr_5"><a href="{{tweeted_person_profile_url}}" target="_blank"><img src="{{tweeted_person_pic_url}}" width="30" height="30" alt="" class="img-rounded pull-left"/></a></div>
					<div class="pull-left span9" >
						<p class="mb_0" style="word-break:normal;word-wrap:break-word;">{{safe_string message}}</p>
						<small><time class="time-ago" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time></small>
						<ul class="widget_tab_link">
							{{#if is_retweeted}}
								<li><a href="#retweeted" rel="tooltip" title="Retweeted"><i class="icon-retweet"  id="{{id}}" ></i></a></li>
							{{else}}
								<li><a href="#retweet" rel="tooltip" title="Retweet the tweet"><i class="twitter_retweet icon-retweet" id="{{id}}"></i></a></li>
							{{/if}}
						</ul>
					</div>
				</div>					
			</li>													
		{{/each}}
	</div>
{{else}}
		<li style="color: #999999;">This person does not share his/her tweets</li>
{{/if}}
</script>

<script id="twitter-error-panel-template" type="text/html">
{{#if disable_check}}
	<div style="line-height:160%;word-wrap: break-word;padding:0px 0px 10px">
		{{{message}}}
	</div>
{{else}}
	{{#check_length message "140"}}
		<div class="ellipsis-multiline" title="{{message}}" style="height: 100px !important;-webkit-line-clamp: 5;line-height:160%;word-wrap: break-word;word-break: normal;">
			{{{message}}}
		</div>
	{{else}}
		<div style="line-height:160%;word-wrap: break-word;padding:0px 0px 10px">
			{{{message}}}
		</div>
	{{/check_length}}	
{{/if}}
</script>

<script id="twitter-profile-add-template" type="text/html">
<div id="twitter-image-save-modal" class="modal fade in" >
	<div class="modal-header" >
    	<a href="#" data-dismiss="modal" class="close">&times;</a>
		<h3>Add Profile</h3></div>
        <div class="modal-body" >
		<p>Associate Twitter profile to contact?</p>
        <p>
			<input type="checkbox" name="add-image" id="save_twitter_image" checked="checked"/>
			Add Twitter image to contact
		</p>
	</div>
	<div class="modal-footer" >
		<a href="#" class="btn btn-primary save-twitter-profile" resp="yes">Yes</a>
		<a href="#" class="btn close save-twitter-profile" resp="no">No</a>
	</div>
</div>
</script>

<script id="twitter-follower-following-template" type="text/html">
{{#each this}}
<a href="{{url}}" target="_blank"><img rel='popover' data-original-title='Twitter Profile' class='twitterImage thumbnail' id='{{id}}' src ='{{picture}}' screen_name="{{screen_name}}"
   summary="{{summary}}" style='display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer;width: 35px;height: 35px' 
   data-content="
      <div class='row-fluid' style='padding-bottom:10px;'>
            <div class='span4' style='padding:0px 10px 0px 10px;'>
              <img src='{{picture}}'></img>
            </div>
            <div class='span8'>
               <b style='color:#069;font-size:14px;'>{{name}}</b>
				<p style='padding-top:5px'>{{location}}</p>
            </div>		
      </div>
	  <div  class='row-fluid' style='padding-bottom:10px;word-wrap: break-word;'>
		 <p style='font-style: italic;'>{{summary}}</p>
	  </div>    
      <div class='row-fluid' style='padding-bottom:10px;'>
            <div class='span4' style='text-align:center;'>Tweets<p>{{tweet_count}}</p></div>
            <div class='span4' style='border-left: solid 1px #EAEAEA;text-align:center;'>Followers<p>{{num_connections}}</p></div>
            <div class='span4' style='border-left: solid 1px #EAEAEA;text-align:center;'>Follows<p>{{friends_count}}</p></div>
      </div>" 
></img></a>
{{/each}}
</script>

<script id="twitter-modified-search-template" type="text/html">
	<div display:inline;  line-height:12px;word-wrap: break-word;">
		<form class="widget_content" style="border-bottom:none;" id="twitter-search_form" name="twitter-search_form" method="get">
	    	<fieldset>
				<p><label>Enter search details</label></p>
				<div class="control-group"><div class="controls"><input type="text" id="twitter_keywords" class="input-medium required widget_input_box" style="width:90%" placeholder="Key Words" value="{{keywords}}" name="keywords" onkeydown="if (event.keyCode == 13) { getModifiedTwitterMatchingProfiles({{plugin_id}}); return false; }" maxlength="40"></input></div></div>
				<a href="#" id="twitter_search_btn" class="btn" style="text-decoration:none;">Search</a>
				<span><img src="img/ajax-spinner.gif" id="spinner-twitter-search" style="display:none;"></img></span>
				<a href="#" id="twitter_search_close" class="btn close" style="float:none;margin-left:5px;">Close</a>
			 </fieldset>
	    </form>
	</div>
</script>


<script id="twitter-login-template" type="text/html">
<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	Engage with contacts in real time based on what they tweet.
	<p style='margin: 10px 0px 5px 0px;' >
		<a class='btn' href="{{url}}" style='text-decoration: none;'>Link Your Twitter</a>
	</p>
</div>
</script>

<script id="twitter-revoke-access-template" type="text/html">
<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	<div class="row-fluid">
		<div class="span4">
			<img src="{{profile.picture}}" width="70" height="70" alt="" class="thumbnail"/>
		</div>
		<div class="span7">
			<p class="title_txt"><a href="{{profile.url}}" target="_blank" >{{profile.name}}</a></p>
			<p style="margin:0px;">{{profile.location}}</p>
			<p style="word-wrap:break-word;word-break:normal;">{{show_link_in_statement profile.summary}}</p>
		</div>
	</div>
	<div>
		<p style='margin: 10px 0px 5px 0px;' >
			<a class='btn revoke-widget ml_5' style='text-decoration: none;' widget-name="Twitter">Revoke Access</a>
			<a href="#add-widget" class='btn ml_5' style='text-decoration: none;' widget-name="Twitter">Cancel</a>
		</p>
	</div>
</div>
</script><script id="twitter-search-result-template" type="text/html">
{{#each this}}
<img rel='popover' data-original-title='Twitter Profile' class='twitterImage thumbnail' id='{{id}}' src ='{{picture}}' screen_name="{{screen_name}}"
   summary="{{summary}}" style='display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer;width: 35px;height: 35px' 
   data-content="
      <div class='row-fluid' style='padding-bottom:10px;'>
            <div class='span4' style='padding:0px 10px 0px 10px;'>
              <img src='{{picture}}'></img>
            </div>
            <div class='span8'>
               <b style='color:#069;font-size:14px;'>{{name}}</b>
				<p style='padding-top:5px'>{{location}}</p>
            </div>		
      </div>
	  <div  class='row-fluid' style='padding-bottom:10px;word-wrap: break-word;'>
		 <p style='font-style: italic;'>{{summary}}</p>
	  </div>    
      <div class='row-fluid' style='padding-bottom:10px;'>
            <div class='span4' style='text-align:center;'>Tweets<p>{{tweet_count}}</p></div>
            <div class='span4' style='border-left: solid 1px #EAEAEA;text-align:center;'>Followers<p>{{num_connections}}</p></div>
            <div class='span4' style='border-left: solid 1px #EAEAEA;text-align:center;'>Follows<p>{{friends_count}}</p></div>
      </div>" 
></img>
{{/each}}
</script>