

function gmap_create_table_view(Search_Url, Searched_Data){
	
	this.gmapContactsListView = new Base_Collection_View({ 
		url : Search_Url,	// ""
		data : Searched_Data, // 
		templateKey : "gmap-table", 
		individual_tag_name : "tr",
		cursor : false, page_size : 25, 
		sort_collection : false, 
		postRenderCallback : function(el)
		{
			console.log("post callback");
		} });

	$('#gmap-table-view').html(this.gmapContactsListView.render(true).el);
}
