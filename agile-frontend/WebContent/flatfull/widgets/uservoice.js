var uservoiceOBJ = {};
var commentsCount = 1;
var showMoreUservoiceCommments = '<div class="widget_tab_footer uservoice_show_more" align="center"><a class="c-p text-info" id="uservoice_inv_show_more" rel="tooltip" title="Click to see more Comments">Show More</a></div>';

function loadUservoiceComments(offSet){
	if(offSet == 0){
		var result = {};
		if(Email && Email != ""){			
			if(uservoiceOBJ.comments && uservoiceOBJ.comments.length > 0){				
				result.comments = uservoiceOBJ.comments.slice(0, 5);
			}else{
				result.content = "No comments found.";
			}
		}else{
			result.content = "Email not found for this contact.";
		}

		getTemplate('uservoice-transactions', result, undefined, function(template_inv){						
			$('#Uservoice').html(template_inv);
		},null);

		if(uservoiceOBJ.comments && uservoiceOBJ.comments.length > 5){
			$('#Uservoice').append(showMoreUservoiceCommments);
		}
	}else if(offSet > 0  && (offSet+5) < uservoiceOBJ.comments.length){
		var result = {};
		result.comments = uservoiceOBJ.comments.slice(offSet, (offSet+5));
		$('.uservoice_show_more').remove();
		$('#Uservoice').apped(getTemplate('uservoice-transactions', result));
		$('#Uservoice').append(showMoreUservoiceCommments);
	}else{
		var result = {};
		result.comments = uservoiceOBJ.comments.slice(offSet, uservoiceOBJ.comments.length);
		$('.uservoice_show_more').remove();
		$('#Uservoice').append(getTemplate('uservoice-transactions', result));
	}
}


function loadData(contact_id){	
	if(Email && Email != ""){
		console.log("Has mail ID in uservoice");
		var queueName = "widget_queue_"+ contact_id;
		queueGetRequest(queueName, "core/api/widgets/uservoice/profile/" + uservoice_Plugin_Id + "/"+ Email, "", 
		function success(data){		
			console.log(data);	
			var sendData = {};
			if(data){
				data = JSON.parse(data);												
				if(data.userInfo.email_address){						
					sendData.userInfo = data.userInfo;
				}
			}			
			getTemplate('uservoice-profile', sendData, undefined, function(template_ui){				
		 		if(!template_ui){
		    		return;
		    	}
		    	$('#Uservoice').html(template_ui);
		    }, "#Uservoice");

		    console.log("Error in email id");
			uservoiceOBJ = data.comments.comments;
			loadUservoiceComments(0);
		}, 
		function error(data){
			console.log("Has error in uservoice");
			$('#Uservoice').html('<div class="wrapper-sm">Error occured while fetching comments</div>');
		});				
	}else{		
		$('#Uservoice').html('<div class="wrapper-sm">Email not found.</div>');
	}	
}

function startUservoiceWidget(contact_id){
	USERVOICE_PLUGIN_NAME = "Uservoice";

	console.log("uservoice id");

	uservoiceOBJ = {};
	uservoiceCommentsCount =1;

	USERVOICE_UPDATE_LOAD_IMAGE = '<center><img id="uservoice_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var uservoice_widget = agile_crm_get_widget(USERVOICE_PLUGIN_NAME);

	console.log(uservoice_widget);

	uservoice_Plugin_Id = uservoice_widget.id;	
	Email = agile_crm_get_contact_property('email');

	loadData(contact_id);

	$("#widgets").off("click", "#uservoice_inv_show_more");
	$("#widgets").on("click", "#uservoice_inv_show_more", function(e){
		e.preventDefault();
		var offSet = commentsCount * 5;
		loadUservoiceComments(offSet);
		++commentsCount;
	});

}