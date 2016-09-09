var notesView;
var dealsView;
var tasksView;
var admin_details_tab = {

	load_tasks : function(el)
		{
			  _agile.get_tasks({
	              success: function (tasks) {
	              	var resp = [];
	              	try{
	              		try{
	              		 tasks = JSON.parse(tasks);}
	              		 catch(e){}
	              		 if(tasks.length > 1)
		              		 for (var i = 0; i < tasks.length; i++) {
		              		 	try{
		              		 			resp[i] = JSON.parse(tasks[i]);		 	
		              		 	}catch(e){}
		              		 	
		              		 }
		              	  else 
		              	  	resp = tasks;

	              	}catch(e){
	              		console.log(e);
	              	}

	              	console.log(resp);

	                //Render tasks of that contact
	                tasksView = new Base_Collection_View({ 
						data : resp,
						templateKey : "contact-tasks", 
						individual_tag_name : "li",
						sortKey:"created_time",
						descending: true,
						postRenderCallback: function(el) {
				            	$(".task-created-time", el).timeago();				            	
				            	$('li',el).each(function(){
				            		if($(this).find('.priority_type').text().trim()== "HIGH") {
				            			$(this).css("border-left","3px solid #f05050");
				            			$(this).css({"list-style": "none"});
				            		}else if($(this).find('.priority_type').text().trim() == "NORMAL"){
				            			$(this).css("border-left","3px solid #7266ba");
				            			$(this).css({"list-style": "none"});
				            		}else if($(this).find('.priority_type').text().trim() == "LOW") {
				            			$(this).css("border-left","3px solid #fad733");
				            			$(this).css({"list-style": "none"});
				            		}


				            	});
				         	
				         }
					});

					$('#tasks', el).html(tasksView.render(true).el);
	                  console.log("success");
	              },
	              error: function (tasks) {
	                  console.log("error");
	              }
	          });
			   
		},

		//deals view
		load_deals : function()
		{

			_agile.get_deals({
			    success: function (deals) {
			    	var resp = [];
	              	try{
	              		try{
	              		 deals = JSON.parse(deals);}
	              		 catch(e){}
	              		 if(deals.length > 1)
		              		 for (var i = 0; i < deals.length; i++) {
		              		 	try{
		              		 			resp[i] = JSON.parse(deals[i]);		 	
		              		 	}catch(e){}
		              		 	
		              		 }
		              	  else 
		              	  	resp = deals;

	              	}catch(e){
	              		console.log(e);
	              	}

	              	console.log(deals);

	                //Render deals of that contact
	                dealsView = new Base_Collection_View({ 
						data : deals,
						templateKey: "deals", 						
						individual_tag_name: 'li',
						sortKey:"created_time",
						descending: true,
						postRenderCallback: function(el) {
	                	 $(".deal-created-time", el).timeago();
	            		}
					
					});

					$('#deals').html(dealsView.render(true).el);
	                  console.log("success");			       
			    },
			    error: function (deals) {
			        console.log("error");
			    }
			});

		},

		//Fetching notes
		load_notes : function()
		{
			_agile.get_notes({
			    success: function (notes) {
			    	var resp = [];
	              	try{
	              		try{
	              		 notes = JSON.parse(notes);}
	              		 catch(e){}
	              		 if(notes.length > 1)
		              		 for (var i = 0; i < notes.length; i++) {
		              		 	try{
		              		 			resp[i] = JSON.parse(notes[i]);		 	
		              		 	}catch(e){}
		              		 	
		              		 }
		              	  else 
		              	  	resp = notes;

	              	}catch(e){
	              		console.log(e);
	              	}

	              	console.log(notes);

	                //Render notes of that contact
	                notesView = new Base_Collection_View({ 
						data : resp,
						templateKey: "notes", 						
						individual_tag_name: 'li',
						sortKey:"created_time",
						descending: true,
						postRenderCallback: function(el) {		            	
	                     $(".note-created-time", el).timeago();
	            		}
					
					});
					$('#notes').html(notesView.render(true).el);
	                  console.log("success");
			        
			    },
			    error: function (notes) {
			        console.log("error");
			    }
			});

		}

}
