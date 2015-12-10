

function gmap_create_table_view(Search_Url){
	
	 var gmapContactsListView = new Base_Collection_View({ 
		url : Search_Url,	// ""
		templateKey : "gmap-table", 
		individual_tag_name : "tr",
		cursor : true, page_size : 25,
		sort_collection:false,
		postRenderCallback : function(el)
		{
			console.log("post callback");
		} });
	 gmapContactsListView.collection.fetch();
	$('#gmap-table-view').html(gmapContactsListView.el);
}
