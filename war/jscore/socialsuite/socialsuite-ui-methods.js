/**
 * fill details of stream in form.
 */
function fillStreamDetail()
{
	$("#user_name", $('#addStreamModal')).attr("value",CURRENT_DOMAIN_USER.name); 

	$("#network_type", $('#addStreamModal')).attr("value","TWITTER"); 
	    	    
	$("#stream_type", $('#addStreamModal')).attr("value",StreamType);
	
	$("#domain_user_id", $('#addStreamModal')).attr("value",CURRENT_DOMAIN_USER.id);
	
	$("#client_channel", $('#addStreamModal')).attr("value",CURRENT_DOMAIN_USER.id + "_Channel");
	    
	if(StreamType == "Search")
	  {
	  	  alert("search");	
	   	  document.getElementById('searchStreamKeyword').innerHTML='<div class="remove-keyword"><label class="control-label">Keyword <span class="field_req">*</span></label><div class="controls"><input id="keyword" name="keyword" type="text" class="required" required="required" value="" autocapitalize="off"></div></div>';
	  }	 
}

/**
 * Shows setup if user adds LinkedIn stream. Uses ScribeServlet 
 * to create a stream and save it to the dB.
 * 
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 */
function setupSocialSuiteLinkedinOAuth()
{
    // URL to return, after fetching token and secret key from LinkedIn
    var callbackURL = window.location.href;

    /*
     * Creates a URL, which on click can connect to scribe using parameters sent
     * and returns back to the profile based on return URL provided and saves widget  
     * preferences in widget based on plugin id
     */
    var url = '/scribe?service=linkedin&return_url=' + encodeURIComponent(callbackURL) +
        '&stream_type=' + encodeURIComponent(StreamType);

    //Shows a link button in the UI which connects to the above URL
    $('#linkedinAddStream').html("<a id='add-linkedin-stream' type='button' class='save-linkedin-stream btn btn-primary' href=\"" + url + "\" style='text-decoration: none;'>" + 
    		"Link Your LinkedIn</a>");    
}

/**
 * register all
 */
function registerAll()
{ 	
  var streamsJSON = StreamsListView.collection.toJSON();
		
  //streams not available OR streams already registered OR pubnub not initialized	
  if(streamsJSON == null || registerAllDone == true || pubnub == null)
	{
	  console.log("registerAllDone : "+registerAllDone);
	  return;
	}

   console.log("In registerAll have streams.");       
   console.log(streamsJSON);
	  	
   //Get stream
   $.each(streamsJSON, function(i, stream)
	 {	  		       
	    /* publish data to register on server */
	 	var publishJSON = {"message_type":"register", "stream":stream};
	    sendMessage(publishJSON);
	 });
   
   //all added streams registered. 
   registerAllDone = true;
   console.log("registerAllDone : "+registerAllDone);  
}

/**
 * add relevant user img to column.
 */
function addUserImgToColumn(stream)
{	
	  //Get stream from collection.
	  var modelStream = StreamsListView.collection.get(stream.id);	 
	  console.log(modelStream);
	  
	  console.log("to get profile img url");
	  
	  //fetching profile image url from twitter server    											  	
	  $.get("/core/social/getprofileimg/" + stream.id, 
			    function (url)
			    {
			      console.log("profile img url");
				  console.log(url);
				  
	              modelStream.set("profile_img_url",url);
	              console.log(modelStream.toJSON());
	            	
	              //append in collection 			
	    		  socialsuitecall.streams(modelStream);

	    		  //get network updates from linkedin
	    		  if(stream.stream_type == "All_Updates")	    			  
	    		     getSocialSuiteLinkedInNetworkUpdates(stream);
   			    });  
}

/**
 * add tweet in stream.
 */
function handleMessage(tweet)
{		
  //add type of message
  tweet["msg_type"] = "Tweet";
	
  //Get stream from collection.
  var modelStream = StreamsListView.collection.get(tweet.stream_id);	 
  console.log(modelStream);
  
  if(modelStream != null || modelStream != undefined)
	{		
	 //search tweet owner's kloutscore.
	 var url = "http://api.klout.com/v2/identity.json/twitter?screenName="+tweet.user.screen_name+"&key=89tdcs5g6ztxvef3q72mwzc6&callback=?";

     $.getJSON( url , function(data) {
    	 console.log(data);   
        })
     .success(function( data ){
        console.log(data);      
    	      
    	url = "http://api.klout.com/v2/user.json/"+data.id+"/score?key=89tdcs5g6ztxvef3q72mwzc6&callback=?";
    	      
    	$.getJSON( url, function(data) {
    		  console.log(data);
    	    })
    	 .success( function( userScore ){
    		//on mouse focus on profile img of tweet shows klout score
            console.log(tweet.user.screen_name +" screen_name : klout_score " + userScore.score);
            tweet["klout_score"] = Math.round(userScore.score);
            
            addTweetToStream(modelStream,tweet);           
           }) //get klout score of user end
         .error(function( jqxhr, textStatus, error ) {
       	   var err = textStatus + ", " + error;
       	   console.log( "klout score of user end Request Failed: " + err );
       	   addTweetToStream(modelStream,tweet);
       	   });
         })//get klout id of user end
       .error(function( jqxhr, textStatus, error ) {
    	   var err = textStatus + ", " + error;
    	   console.log( "klout id of user end Request Failed: " + err );
    	   addTweetToStream(modelStream,tweet);
    	   });
	}//if end
}

function addTweetToStream(modelStream,tweet)
{
	//if user is tweet owner no need to show retweet icon.
    if(modelStream.get('screen_name') != tweet.user.screen_name)            	
       tweet["tweetowner_not_streamuser"] = true;      
    
    if(tweet.stream_type == "Sent" || modelStream.get('screen_name') == tweet.user.screen_name)
    	 tweet["deletable_tweet"] = true;
    
    if(tweet.stream_type == "DM_Inbox" || tweet.stream_type == "DM_Outbox")
      {
    	tweet["direct_message"] = true;
        tweet["deletable_tweet"] = true;
      }
    
    console.log("for add "+modelStream.get('tweetListView').length);
		
    //sort stream on tweet id_str basis
	modelStream.get('tweetListView').comparator = function(model) 
	 { 		  
	  if (model.get('id'))
	     return -model.get('id');
	 };
	   
	 //Add tweet to stream.
	 modelStream.get('tweetListView').add(tweet);	
	   
	 //sort stream on id. so recent tweet come on top.
	 modelStream.get('tweetListView').sort() ;	   
	   
	 //create normal time.
	 head.js('lib/jquery.timeago.js', function(){	 
		        $(".time-ago", $(".chirp-container")).timeago();	
			});
}

//Make columns draggable.
function setup_dragging_columns()
{
	console.log("in setup_dragging_columns");
	console.log("StreamsListView : ");console.log(StreamsListView);
	
	head.js('http://code.jquery.com/ui/1.10.3/jquery-ui.js',
			function()
			   {
				$('ul.columns').sortable({
					  change:function(event, ui)
					     {  
						  $('#socialsuite-streams-model-list > li').scrollLeft($(this).position().left);
					     }, //change end
					  update: function(event, ui) 
					    {						  						  
						  console.log("StreamsListView : ");console.log(StreamsListView);
						  var id = ui.item[0].id;
						  console.log("ui :");console.log(ui);
						  console.log("ui.item[0] :");console.log(ui.item[0]);
						  console.log("id :"+id);
						  console.log("ui.originalPosition :");console.log(ui.originalPosition);
						  console.log("ui.currentPosition :");console.log(ui.position);
						  
						  var oldColumn = StreamsListView.collection.get(id).toJSON();
						  console.log("oldColumn :");console.log(oldColumn);
						  
						  var newColumn = $(this).html();
						  console.log("newColumn :");console.log(newColumn);							
					    },//update end
					 }); //sortable end
				 $('ul.columns').disableSelection();
			   });	
}//setup_column_in_columns end