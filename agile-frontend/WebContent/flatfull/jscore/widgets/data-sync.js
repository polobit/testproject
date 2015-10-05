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
	if (sync_type == "SHOPIFY")
		$('#shopify', this.el).append($(itemView.render().el));
	if (sync_type == "QUICKBOOK")
		$('#quickbook', this.el).append($(itemView.render().el));

}


function initializeDataSyncListners(){


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
	});




	$('#prefs-tabs-content #sync-import-prefs-delete').off();
    $('#prefs-tabs-content').on('click', '#sync-import-prefs-delete', function(e){
		

    	if(!confirm("Are you sure you want to delete?"))
		    		return false;
		var sync_widget_type=$(this).attr("data_sync_type");

		if(!sync_widget_type)
			return;
		var deleteSyncUrl="core/api/contactprefs/delete/"+sync_widget_type;
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


function executeDataSyncReturnCallback(returnUrl){
		
		DATA_SYNC_FORCE_FETCH=true;
		returnUrl=returnUrl.substr(returnUrl.indexOf('#'));
		Backbone.history.navigate(returnUrl , {
                trigger: true
            });		
}

var DATA_SYNC_FORCE_FETCH=false;
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
       	callback(getSyncModelFromName(name));
       }
  }

  function getModalfromName(collection, name){

	for (var i in collection){
		var model=collection[i];
		if(model.type==name){
			return model;
		}
	}
      
  }


  function renderInnerSyncView(url,templateName,data,callback){

  		 var data_sync = new DataSync_Event_Modal_View({
			                    url: url,
			                    template: templateName,
			                    data:data,
			                    saveCallback: function(model) {
			                       callback(model);
			                    }
			                });

			   $("#prefs-tabs-content").html(data_sync.render().el);
  }