//show addons dialog (Ramesh 12/10/2010)
function showAddonsTab(){

   $('#addontabs').tabs({
        select: function (event, ui) {

            var id = $(ui.panel).attr('id');  
         
            showAddonNodes(id)
      }
    });
    
    // Make it default as first tab
    $('#addontabs').tabs('select', 0);
    	
   	$('#addontabs').dialog({
				            title:'Nodes',
							autoOpen: true,
							modal: true,
							position: 'top',
							width:810,
							resizable: false,
							open: function(event, ui) {
								$(this).css({'max-height': 500, 'overflow-y': 'auto'}); 
							}
							
							
							
			});
	
	//show basic addon default
	showAddonNodes('crmAddons');
}


//Download nodes based on id and construct catalog (Ramesh 12/10/2010)
function showAddonNodes(id) {

    $('#'+id).html('Loading...');
     
    //Get Nodes based on id 
    var nodesPath = "/json/nodes/addons-catalog.jsp?type=" + id;
    
     // Download all items
    $.getJSON(nodesPath, function (catalogdata) {

    	$('#'+id).html('');
    	
        $.each(catalogdata, function (index, jsondata) {
        
                var data = jsondata.json;
                var url = jsondata.jsonsrc;
                // console.log("data "+data);
                // console.log("url "+url);
                
                try
                {
                	data = JSON.parse(data);
                }
                catch(err)
                {
                	console.log("Errorr...");
                }
                
                addAddonTabTemplate(data,url,constructNodeFromDefinition,'#'+id);
        
        });
        
     });
    
    
}

//add nodes to tab 
function addAddonTabTemplate(data, url, callback, container)
{

         var catalogTemplate = $('#catalogtemplate').clone();
         catalogTemplate.removeAttr('style');

         // Fill the catalogtemplate with values. Override them with translated values if available
         constructUI(catalogTemplate, data);
         
         
         // Add JSON and JSONSrc URL both. Some of them require JSON and some of them selected source
         catalogTemplate.find('#add').data('json', data);
         catalogTemplate.find('#add').data('jsonsrc', url);


         // Add handler for add this                        
         catalogTemplate.find('#add').click(function () {

             // Get JSON and JSONSrc
             var json = $(this).data('json');

             var jsonsrc = $(this).data('jsonsrc');

             // Close the dialog
             $('#catalog').dialog('close');

             $('#addontabs').dialog('close');
             // Call the callback with json and jsonsrc                            
             callback(json, jsonsrc);
         });

         // Append this element to catalog
         catalogTemplate.appendTo($(container));

}