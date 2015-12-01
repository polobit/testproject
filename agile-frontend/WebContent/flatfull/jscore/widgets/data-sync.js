/**

	appends datasync widgets by fetching collection in single call
*/

function organize_sync_widgets(base_model)
{
	var itemView = new Base_List_View({ model : base_model, template : 'admin-settings-import-skeleton', tagName : 'div', });

	// Get widget type from model (widget object)
	var sync_type = base_model.get('type');

	if (sync_type == "GOOGLE")
		$('#contact-prefs', this.el).append($(itemView.render().el));
	if (sync_type == "STRIPE")
		$('#stripe', this.el).append($(itemView.render().el));
	if (sync_type == "FRESHBOOKS")
		$('#freshbook', this.el).append($(itemView.render().el));
	if (sync_type == "OFFICE365")
		$('#office365', this.el).append($(itemView.render().el));
	if (sync_type == "SHOPIFY")
		$('#shopify', this.el).append($(itemView.render().el));
	if (sync_type == "QUICKBOOK")
		$('#quickbook', this.el).append($(itemView.render().el));

}



/**

single click for all data sync collection events
*/
function initializeDataSyncListners(){

	// Office calendar delete button.
	$("#prefs-tabs-content").off("click", "#office-calendar-sync-delete");
	$("#prefs-tabs-content").on("click", "#office-calendar-sync-delete", function(){

		$.ajax({ type : 'DELETE', 
			url : 'core/api/officecalendar', 
			contentType : "application/json; charset=utf-8",
			success : function(data){
				 $.getJSON("core/api/officecalendar").success(function(data) { 
		            console.log(data);  
		            getTemplate("admin-settings-import-office365-sync-details", data, undefined, function(data_el){
		                $('#office365').html(data_el);
		            });      
		        }).error(function(data) { 
		            console.log(data);
		        });
			} 
		});   

	});
	   


	$('#prefs-tabs-content #data-sync-type').off();
    $('#prefs-tabs-content').on('click', '#data-sync-type', function(e){

		var sync_type=$(this).attr("sync_type");
		if(sync_type=="GOOGLE"){
		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href + "/contacts";
		console.log(callbackURL);
		// For every request of import, it will ask to grant access
		window.open("/scribe?service=google&window_opened=true&return_url=" + encodeURIComponent(callbackURL),'dataSync','height=1000,width=500');
		}
		if(sync_type=="STRIPE"){

			var callbackURL = window.location.origin + "/#sync/stripe-import";
		// For every request of import, it will ask to grant access
		window.open( "/scribe?service=stripe_import&window_opened=true&return_url=" + encodeURIComponent(callbackURL),'dataSync','height=1000,width=500');
		return false;
		}
		if(sync_type=="SHOPIFY"){

			Backbone.history.navigate("#sync/shopify" , {
                trigger: true
            });
		}
		if(sync_type=="QUICKBOOK"){

		window.open('/OAuthServlet?service=quickbook-import&window_opened=true&return_url=' + encodeURIComponent(window.location.href) + 'quickbooks','dataSync','height=1000,width=500');

		return false;
		}
		if(sync_type=="FRESHBOOKS"){
			Backbone.history.navigate("#sync/freshbooks" , {
                trigger: true
            });
		}
		if(sync_type=="OFFICE365"){
			Backbone.history.navigate("#sync/officeCalendar" , {
                trigger: true
            });
		}
	});




	$('#prefs-tabs-content #sync-import-prefs-delete').off();
    $('#prefs-tabs-content').on('click', '#sync-import-prefs-delete', function(e){
		

    	if(!confirm("Are you sure you want to delete?"))
		    		return false;
		var sync_widget_type=$(this).attr("data_sync_type");

		var sync_widget_id=$(this).attr("data_sync_id");

		if(!sync_widget_type)
			return;
		var deleteSyncUrl="core/api/contactprefs/delete/"+sync_widget_type+"/"+sync_widget_id;
		$.ajax({
 				url : deleteSyncUrl,
				type : 'DELETE',
				success : function(){
					console.log("success");
					
					App_Datasync.dataSync();
				}
			});
		
			

	});



	
}

/**

	function call to close newly opend window after authentication done. 
*/

function executeDataSyncReturnCallback(returnUrl,serviceName){
		
		if(serviceName=='google_calendar'){
			App_Datasync.google_calendar();
			return;
		}

		DATA_SYNC_FORCE_FETCH=true;
		if(serviceName=='shopify'){
			App_Datasync.shopify();
			return;
		}
		returnUrl=returnUrl.substr(returnUrl.indexOf('#'));

		if(window.location.hash==returnUrl && (serviceName=='quickbook-import' || serviceName=='stripe_import')){
			window.location.reload();
			return;
		}

		Backbone.history.navigate(returnUrl , {
                trigger: true
            });		
}

function executeCloseWindowCallback(returnUrl){
	Backbone.history.navigate(returnUrl , {
                trigger: true
            });		
}

var DATA_SYNC_FORCE_FETCH=false;

/**

fetches the model from collection if collection exists
else fetchs colection and returns model
*/
function getSyncModelFromName(name, callback){

       // Checks force fetch
       if(DATA_SYNC_FORCE_FETCH){
       		DATA_SYNC_FORCE_FETCH=false;

       		App_Datasync.agile_sync_collection_view = new Base_Collection_View({ url : '/core/api/contactprefs/allPrefs' });

			// Fetch the list of widgets
			App_Datasync.agile_sync_collection_view.collection.fetch({ success : function(data)
			{
				callback(getModalfromName(data.toJSON(), name));
				
			} });
       	 
      	 return;
       }

       // Check view obj
       if(App_Datasync.agile_sync_collection_view){
          return callback(getModalfromName(App_Datasync.agile_sync_collection_view.collection.toJSON(), name));
       }
       else{
       	DATA_SYNC_FORCE_FETCH=true;
       	callback(getSyncModelFromName(name,callback));
       }
  }


/**

iterates over collection and fetches model based on type
name is type i.e GOOGLE or STRIPE or SHOPIFY etc
*/
  function getModalfromName(collection, name){

	for (var i in collection){
		var model=collection[i];
		if(model.type==name){
			return model;
		}
	}
      
  }

/**

renders inner sync view and binds all model events to DataSync_Event_Modal_View
*/

  function renderInnerSyncView(url,templateName,data,callback){
  		 var data_sync = new DataSync_Event_Modal_View({
			                    url: url,
			                    template: templateName,
			                    data:data,
			                    saveCallback: function(model) {
			                       if(model){
		                       		if(model.widgetName == "office365Cal"){
		                       			App_Datasync.dataSync();		                       	
		                       			$('#prefs-tabs-content a[href="#office365-tab"]').tab('show');
		                       		}
			                       }
			                       callback(model);
			                    }
			                });

			   $("#data-sync-settings-tab-content").html(data_sync.render().el);
  }


