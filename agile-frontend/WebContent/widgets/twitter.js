function setupTwitterOAuth(){$("#Twitter",agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);var d=window.location.href;var c="/scribe?service=twitter&return_url="+encodeURIComponent(d)+"&plugin_id="+encodeURIComponent(Twitter_Plugin_Id);$("#Twitter",agile_crm_get_current_view()).html("<div class='widget_content' style='border-bottom:none;line-height: 160%;' >Engage with contacts in real time based on what they tweet.<p style='margin: 10px 0px 5px 0px;'><a class='btn' href=\""+c+"\" style='text-decoration:none;'>Link Your Twitter</a></p></div>")}function showTwitterMatchingProfiles(g){var h=agile_crm_get_contact_property("image");if(search_string){Twitter_search_details.keywords=search_string}else{var f="";if(agile_crm_get_contact_property("first_name")){f=f+agile_crm_get_contact_property("first_name")}if(agile_crm_get_contact_property("last_name")){f=f+" "+agile_crm_get_contact_property("last_name")}Twitter_search_details.keywords=f.trim()}if(g.length==0){if(Twitter_search_details.keywords&&Twitter_search_details.keywords!=""){twitterMainError(TWITTER_PLUGIN_NAME,"<p class='a-dotted' style='margin-bottom:0px;font-size:13px;'>No matches found for <a href='#' class='twitter_modify_search'>"+Twitter_search_details.keywords+"</a>",true)}else{twitterMainError(TWITTER_PLUGIN_NAME,"<p class='a-dotted' style='margin-bottom:0px;font-size:13px;'>No matches found. <a href='#' class='twitter_modify_search'>Modify search</a>",true)}return}var e;if(Twitter_search_details.keywords&&Twitter_search_details.keywords!=""){e="<div style='padding:0px 0px'><p class='a-dotted' style='margin-bottom:0px 0px 6px;font-size:13px;'>Search results for <a href='#' class='twitter_modify_search'>"+Twitter_search_details.keywords+"</a></p>"}else{e="<div style='padding:0px 0px'><p class='a-dotted' style='margin-bottom:0px 0px 6px;font-size:13px;'>Search results. <a href='#' class='twitter_modify_search'>Modify search</a></p>"}e=e.concat(getTemplate("twitter-search-result",g));e=e+"</div>";$("#Twitter",agile_crm_get_current_view()).html(e);$(".twitterImage").die().live("mouseover",function(){Twitter_id=$(this).attr("id");$(this).popover({placement:"left"});$(this).popover("show");$("#"+Twitter_id).die().live("click",function(a){a.preventDefault();$(this).popover("hide");console.log("on click in search");var d="@"+$(this).attr("screen_name");web_url=d;console.log(d);var b=[{name:"website",value:d,subtype:"TWITTER"}];if(!h){var c=$(this).attr("src");b.push({name:"image",value:c})}if(!agile_crm_get_contact_property("title")){var k=$(this).attr("summary");b.push({name:"title",value:k})}console.log(b);agile_crm_update_contact_properties(b);showTwitterProfile(Twitter_id)})})}function getTwitterMatchingProfiles(){$("#Twitter",agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);var h=agile_crm_get_contact()["id"];var e=localStorage.getItem("Agile_twitter_matches_"+h);if(!e){queueGetRequest("widget_queue","core/api/widgets/social/match/"+Twitter_Plugin_Id+"/"+h,"json",function g(a){localStorage.setItem("Agile_twitter_matches_"+h,JSON.stringify(a));showTwitterMatchingProfiles(a)},function f(a){$("#tweet_load").remove();twitterMainError(TWITTER_PLUGIN_NAME,a.responseText)})}else{showTwitterMatchingProfiles(JSON.parse(e))}}function getModifiedTwitterMatchingProfiles(){if(!isValidForm($("#twitter-search_form"))){return}$("#spinner-twitter-search").show();search_string=$("#twitter_keywords").val();$.get("core/api/widgets/social/modified/match/twitter/"+Twitter_Plugin_Id+"/"+search_string,function(b){$("#spinner-twitter-search").hide();search_data=b;showTwitterMatchingProfiles(b)},"json").error(function(b){$("#spinner-twitter-search").remove();twitterMainError(TWITTER_PLUGIN_NAME,b.responseText)})}function getTwitterIdByUrl(f,g){var h;console.log("Twitter given URL "+f);getProperURL(f,function(a){h=a});console.log("Twitter URL "+h);var e={};e.web_url=h;fetchTwitterIdFromUrl(e,function(a){if(!a){alert("URL provided for Twitter is not valid ");getTwitterMatchingProfiles();agile_crm_delete_contact_property_by_subtype("website","TWITTER",f);return}if(g&&typeof(g)==="function"){g(a)}},function(a){var b="Sorry, that page doesn't exist!";console.log(a.responseText.substring(0,b.length));if(a.responseText.substring(0,b.length)===b){alert(a.responseText);console.log("Twitter URL "+f);agile_crm_delete_contact_property_by_subtype("website","TWITTER",f.toString());return}twitterMainError(TWITTER_PLUGIN_NAME,a.responseText)})}function getProperURL(e,f){var d;if(e.indexOf("https://twitter.com/")==-1&&e.indexOf("http://twitter.com/")==-1){if(e.indexOf("@")==0){d="https://twitter.com/"+e.substring(1)}else{d="https://twitter.com/"+e}}else{if(e.indexOf("http://twitter.com/")!=-1){d=e.replace("http://twitter.com/","https://twitter.com/")}else{d=e}}if(f&&typeof(f)==="function"){f(d)}}function fetchTwitterIdFromUrl(f,e,d){queuePostRequest("widget_queue","/core/api/widgets/social/getidbyurl/"+Twitter_Plugin_Id,f,function(a){if(e&&typeof(e)==="function"){e(a)}},function(a){if(d&&typeof(d)==="function"){d(a)}})}function showTwitterProfile(e){$("#Twitter",agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);var d;var f;$.get("/core/api/widgets/social/profile/"+Twitter_Plugin_Id+"/"+e,function(a){if(!a){return}$("#Twitter_plugin_delete").show();Twitter_current_profile_user_name=a.name;Twitter_current_profile_screen_name=a.screen_name;d=a.is_connected;Twitter_current_update_id=a.current_update_id;$("#Twitter",agile_crm_get_current_view()).html(getTemplate("twitter-profile",a));if(a.is_connected){$("#twitter_unfollow").show()}else{if(!a.is_follow_request_sent){$("#twitter_follow").show()}else{$("#twitter_follow").text("Follow Request Sent").attr("disabled","disabled").show()}}if(a.updateStream&&a.updateStream.length!=0){$("#twitter_refresh_stream").show();f=a.updateStream;var b=$(getTemplate("twitter-update-stream",a.updateStream));head.js(LIB_PATH+"lib/jquery.timeago.js",function(){$(".time-ago",b).timeago()});$("#twitter_social_stream").append(b);return}$("#twitter_current_activity").show()},"json").error(function(a){$("#tweet_load").remove();twitterMainError(TWITTER_PLUGIN_NAME,a.responseText)});registerClickEventsInTwitter(e,d,f)}function registerClickEventsInTwitter(e,d,f){$(".twitter_stream").die().live("click",function(a){a.preventDefault();var c=$("ul#twitter_social_stream").find("li#twitter_status:last").attr("status_id");console.log(c);if(!Twitter_current_update_id){return}if(!c){if(d){tweetError("tweet-error-panel","This member doesn't share his/her tweets");return}tweetError("tweet-error-panel","Member does not share his/her tweets. Follow him/her and try");return}$("#spinner-tweets").show();var b=this;$(this).removeClass("twitter_stream");anyFiveNetworkUpdates(e,c,f,b)});$("#twitter_less").die().live("click",function(a){a.preventDefault();if($(this).attr("less")=="true"){$(this).attr("less","false");if($("ul#twitter_social_stream").find("div#twitter_update").length!=0){$("#twitter_current_activity").hide()}$(this).text("Show Less..");$("#twitter_refresh_stream").show()}else{$(this).attr("less","true");$(this).text("Show More..");$("#twitter_current_activity").show();$("#twitter_refresh_stream").hide()}});$("#twitter_refresh_stream").die().live("click",function(a){a.preventDefault();$("#twitter_social_stream",agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);allNetworkUpdates(e,f)})}function anyFiveNetworkUpdates(f,h,g,e){$.getJSON("/core/api/widgets/social/updates/more/"+Twitter_Plugin_Id+"/"+f+"/"+h+"/5",function(a){$("#spinner-tweets").hide();$(e).addClass("twitter_stream");$("#twitter_refresh_stream").show();if(a.length==0){tweetError("tweet-error-panel","No more updates available");if(g.length>3){$("#twitter_stream").hide();$("#twitter_less").show()}return}$("#twitter_social_stream").append(getTemplate("twitter-update-stream",a));$(".time-ago",$("#twitter_social_stream")).timeago();$("#twitter_current_activity").hide()}).error(function(a){$("#spinner-tweets").hide();$(e).addClass("twitter_stream");tweetError("tweet-error-panel",a.responseText)})}function getFirstFiveNetworkUpdates(b){$.getJSON("/core/api/widgets/social/updates/more/"+Twitter_Plugin_Id+"/"+b+"/"+Twitter_current_update_id+"/5",function(a){$("#twitter_social_stream",agile_crm_get_current_view()).html(getTemplate("twitter-update-stream",a));$("#twitter_current_activity").hide();$("#twitter_refresh_stream").show();$(".time-ago",$("#twitter_social_stream")).timeago();if(a.length==0){$("#twitter_stream").hide();$("#twitter_current_activity").show();$("#twitter_less").show();return}}).error(function(a){$("#twitter_refresh_stream").show();tweetError("twitter-error-panel",a.responseText)})}function allNetworkUpdates(d,c){$.getJSON("/core/api/widgets/social/updates/"+Twitter_Plugin_Id+"/"+d,function(a){$("#tweet_load").remove();$("#twitter_social_stream",agile_crm_get_current_view()).html(getTemplate("twitter-update-stream",a));$(".time-ago",$("#twitter_social_stream")).timeago();if(a.length==0){$("#twitter_stream").hide();$("#twitter_less").show();return}$("#twitter_stream").show();$("#twitter_less").hide();$("#twitter_current_activity").hide()}).error(function(a){$("#tweet_load").remove();$("#twitter_stream").show();$("#twitter_less").hide();if(c&&c.length!=0){$("#twitter_social_stream",agile_crm_get_current_view()).html(getTemplate("twitter-update-stream",c))}$(".time-ago",$("#twitter_social_stream")).timeago();tweetError("tweet-error-panel",a.responseText)})}function sendFollowRequest(b){$.post("/core/api/widgets/social/connect/"+Twitter_Plugin_Id+"/"+b,function(a){if(a=="true"){$("#twitter_follow").hide();$("#twitter_unfollow").show()}else{$("#twitter_follow").text("Follow Request Sent").attr("disabled","disabled").show();return}if(!Twitter_current_update_id){return}getFirstFiveNetworkUpdates(b)}).error(function(a){if(a.responseText.indexOf("401:Authentication credentials")!=0){a.responseText="Only confirmed followers have access to "+Twitter_current_profile_user_name+' Tweets and complete profile. Click the "Follow" button to send a follow request.'}tweetError("twitter-error-panel",a.responseText)})}function sendUnfollowRequest(b){$.get("/core/api/widgets/social/disconnect/"+Twitter_Plugin_Id+"/"+b,function(a){$("#twitter_follow").show();$("#twitter_unfollow").hide()}).error(function(a){tweetError("twitter-error-panel",a.responseText)})}function sendTwitterMessage(f,h){var e={};e.headline="Direct Message";e.info="Send message to "+Twitter_current_profile_user_name.toUpperCase()+" on Twitter";$("#twitter_messageModal").remove();var g=getTemplate("twitter-message",e);$("#content").append(g);$("#twitter_messageModal").on("shown",function(){head.js(LIB_PATH+"lib/bootstrap-limit.js",function(){$(".twit-message-limit").limit({maxChars:125,counter:"#twitter-counter"});$("#twitter_messageModal").find("#twit-message").focus()})});$("#twitter_messageModal").modal("show");$("#send_request").click(function(a){a.preventDefault();if(!isValidForm($("#twitter_messageForm"))){return}$(this).text("Saving..");sendRequest("/core/api/widgets/social/message/"+Twitter_Plugin_Id+"/"+f,"twitter_messageForm","twitter_messageModal")})}function tweetInTwitter(e){var d={};d.headline="Tweet";d.info="Tweet to "+Twitter_current_profile_user_name.toUpperCase()+" on Twitter";d.description="@"+Twitter_current_profile_screen_name;$("#twitter_messageModal").remove();var f=getTemplate("twitter-message",d);$("#content").append(f);$("#twitter_messageModal").on("shown",function(){head.js(LIB_PATH+"lib/bootstrap-limit.js",function(){$(".twit-tweet-limit").limit({maxChars:125,counter:"#twitter-counter"});$("#twitter_messageModal").find("#twit-tweet").focus()})});$("#twitter_messageModal").modal("show");$("#send_request").click(function(a){a.preventDefault();if(!isValidForm($("#twitter_messageForm"))){return}$(this).text("Saving..");sendRequest("/core/api/widgets/social/tweet/"+Twitter_Plugin_Id,"twitter_messageForm","twitter_messageModal")})}function sendRequest(d,f,e){$.post(d,$("#"+f).serialize(),function(a){setTimeout(function(){$("#"+e).modal("hide")},2000)}).error(function(a){$("#"+e).remove();tweetError("twitter-error-panel",a.responseText)})}function retweetTheTweet(e,f,d){$.get("/core/api/widgets/social/reshare/"+Twitter_Plugin_Id+"/"+e+"/"+f,function(a){$(d).css("color","green")}).error(function(a){tweetError("tweet-error-panel",a.responseText)})}function getFollowerIdsInTwitter(d,c){$.getJSON("/core/api/widgets/social/followers/"+Twitter_Plugin_Id+"/"+d,function(a){if(!a){return}if(c&&typeof(c)==="function"){c(a)}}).error(function(a){$("#tweet_load").remove();if(a.responseText.indexOf("401:Authentication credentials")!=-1){var b="Only confirmed followers have access to "+Twitter_current_profile_user_name+' Tweets, Followers, Following and complete profile. Click the "Follow" button to send a follow request.';twitterMainError("twitter_follower_panel",b,true);$("#twitter_follower_panel").css("padding","0px");return}tweetError("follower-error-panel",a.responseText)})}function getFollowingIdsInTwitter(d,c){$.getJSON("/core/api/widgets/social/following/"+Twitter_Plugin_Id+"/"+d,function(a){if(!a){return}if(c&&typeof(c)==="function"){c(a)}}).error(function(a){$("#tweet_load").remove();if(a.responseText.indexOf("401:Authentication credentials")!=-1){var b="Only confirmed followers have access to "+Twitter_current_profile_user_name+' Tweets, Followers, Following and complete profile. Click the "Follow" button to send a follow request.';twitterMainError("twitter_following_panel",b,true);$("#twitter_following_panel").css("padding","0px");return}tweetError("following-error-panel",a.responseText)})}function getListOfProfilesByIDsinTwitter(f,g,e){var h={};h.twitter_ids=JSON.stringify(f);$.post("/core/api/widgets/social/profile/list/"+Twitter_Plugin_Id,h,function(a){if(!a){$("#tweet_load").remove();return}if(g&&typeof(g)==="function"){g(a)}},"json").error(function(a){if(e&&typeof(e)==="function"){e(a)}})}function tweetError(f,d,e){twitterMainError(f,d,e);$("#"+f).show();$("#"+f).fadeOut(10000)}function twitterMainError(g,h,e){var f={};f.message=h;f.disable_check=e;$("#"+g,agile_crm_get_current_view()).html(getTemplate("twitter-error-panel",f))}$(function(){TWITTER_PLUGIN_NAME="Twitter";TWITTER_UPDATE_LOAD_IMAGE='<div id="tweet_load"><center><img  src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center></div>';Twitter_current_profile_user_name="";Twitter_current_update_id="";Twitter_current_profile_screen_name="";console.log(e);console.log(d);var e=undefined;var d=undefined;search_string=undefined;search_data=undefined;Twitter_search_details={};web_url="";Twitter_id="";var f=agile_crm_get_widget(TWITTER_PLUGIN_NAME);console.log("In Twitter");console.log(e);console.log(d);console.log(f);Twitter_Plugin_Id=f.id;if(f.prefs==undefined){setupTwitterOAuth();return}web_url=agile_crm_get_contact_property_by_subtype("website","TWITTER");console.log(web_url);if(web_url){getTwitterIdByUrl(web_url,function(a){Twitter_id=a;showTwitterProfile(Twitter_id)})}else{getTwitterMatchingProfiles()}$("#Twitter_plugin_delete").die().live("click",function(a){a.preventDefault();agile_crm_delete_contact_property_by_subtype("website","TWITTER",web_url,function(b){console.log("In twitter delete callback");getTwitterMatchingProfiles()})});$("#twitter_message").die().live("click",function(a){a.preventDefault();sendTwitterMessage(Twitter_id)});$("#twitter_follow").die().live("click",function(a){a.preventDefault();if($(this).attr("disabled")){return}sendFollowRequest(Twitter_id)});$("#twitter_unfollow").die().live("click",function(a){a.preventDefault();sendUnfollowRequest(Twitter_id)});$("#twitter_unfollow").live("mouseenter",function(){$("#twitter_unfollow").text("Unfollow");$("#twitter_unfollow").addClass("btn-danger");$("#twitter_unfollow").removeClass("btn-primary")});$("#twitter_unfollow").live("mouseleave",function(){$("#twitter_unfollow").text("Following");$("#twitter_unfollow").addClass("btn-primary");$("#twitter_unfollow").removeClass("btn-danger")});$(".twitter_retweet").die().live("click",function(a){a.preventDefault();var b=$(this).attr("id");console.log(b);retweetTheTweet(b,"optional",this)});$("#twitter_tweet").die().live("click",function(a){a.preventDefault();tweetInTwitter(Twitter_id)});$(".twitter_modify_search").die().live("click",function(a){a.preventDefault();Twitter_search_details.plugin_id=Twitter_Plugin_Id;$("#Twitter",agile_crm_get_current_view()).html(getTemplate("twitter-modified-search",Twitter_search_details))});$("#twitter_search_btn").die().live("click",function(a){a.preventDefault();getModifiedTwitterMatchingProfiles()});$("#twitter_search_close").die().live("click",function(a){a.preventDefault();if(search_data){showTwitterMatchingProfiles(search_data)}else{getTwitterMatchingProfiles()}});$("#twitter_followers").die().live("click",function(a){a.preventDefault();if(e&&e.length!=0){return}console.log("In twit folowers");console.log(e);e=[];$("#twitter_follower_panel",agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);getFollowerIdsInTwitter(Twitter_id,function(b){e=b;console.log(b);if(b.length==0){$("#twitter_follower_panel",agile_crm_get_current_view()).html(Twitter_current_profile_user_name+" doesn't have any followers yet");return}var c=e.splice(0,20);console.log(c);getListOfProfilesByIDsinTwitter(c,function(h){$("#twitter_follower_panel",agile_crm_get_current_view()).html(getTemplate("twitter-follower-following",h));$(".twitterImage").die().live("mouseover",function(){var g=$(this).attr("id");$("#"+g).popover({placement:"left"});$("#"+g).popover("show")})},function(h){e=undefined;$("#tweet_load").remove();tweetError("follower-error-panel",h.responseText)})})});$("#more_followers").die().live("click",function(a){a.preventDefault();if(!e){return}$("#spinner-followers").show();console.log(e);var b=e.splice(0,20);console.log(b);getListOfProfilesByIDsinTwitter(b,function(c){$("#spinner-followers").hide();$("#twitter_follower_panel").append(getTemplate("twitter-follower-following",c))},function(c){$("#spinner-followers").hide();tweetError("follower-error-panel",c.responseText)})});$("#twitter_following").die().live("click",function(a){a.preventDefault();if(d&&d.length!=0){return}d=[];$("#twitter_following_panel",agile_crm_get_current_view()).html(TWITTER_UPDATE_LOAD_IMAGE);getFollowingIdsInTwitter(Twitter_id,function(b){d=b;console.log(b.length);if(b.length==0){$("#twitter_following_panel",agile_crm_get_current_view()).html(Twitter_current_profile_user_name+" isn't following anyone yet");return}var c=d.splice(0,20);console.log(c);getListOfProfilesByIDsinTwitter(c,function(h){$("#twitter_following_panel",agile_crm_get_current_view()).html(getTemplate("twitter-follower-following",h));$(".twitterImage").die().live("mouseover",function(){var g=$(this).attr("id");$("#"+g).popover({placement:"left"});$("#"+g).popover("show")})},function(h){d=undefined;$("#tweet_load").remove();tweetError("following-error-panel",h.responseText)})})});$("#more_following").die().live("click",function(a){a.preventDefault();if(!d){return}$("#spinner-following").show();var b=d.splice(0,20);console.log(b);getListOfProfilesByIDsinTwitter(b,function(c){$("#spinner-following").hide();$("#twitter_following_panel").append(getTemplate("twitter-follower-following",c))},function(c){$("#spinner-following").hide();tweetError("following-error-panel",c.responseText)})})});