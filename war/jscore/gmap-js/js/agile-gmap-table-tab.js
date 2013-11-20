

$("#gmap-table-tab").die().live('click', function(){
	
	console.log("table tab clicked");
	
//	App_Visitors.navigate("visitors/tableView", {trigger : true});
	
	console.log("table router called");
	
	agile_gmap_create_table_view("/core/api/contacts");
});

function agile_gmap_create_table_view(Search_Url){
	
	this.contactsListView = new Base_Collection_View({ 
		url : Search_Url, 
		templateKey : "gmap-table", 
		individual_tag_name : "tr",
		cursor : true, page_size : 25, 
		sort_collection : false, 
		postRenderCallback : function(el)
		{
			console.log("post callback");
			$("#gmap-table-tab, #gmap-table-view").addClass("active");
//			// Contacts are fetched when the app loads in
//			// the initialize
//			var cel = App_Contacts.contactsListView.el;
//			var collection = App_Contacts.contactsListView.collection;
//
//			// To set heading in template
//			if (readCookie('company_filter'))
//			{
//				// $('#contact-heading',el).text('Companies');
//			}
//
//			// To set chats and view when contacts are fetch by
//			// infiniscroll
//			setup_tags(cel);
//			pieTags(cel);
//			setupViews(cel);
//
//			/*
//			 * Show list of filters dropdown in contacts list, If
//			 * filter is saved in cookie then show the filter name
//			 * on dropdown button
//			 */
//			setupContactFilterList(cel, tag_id);
//			start_tour("contacts", el);
		} });

	// Contacts are fetched when the app loads in the initialize
	this.contactsListView.collection.fetch();

	$('#gmap-table-view').html(this.contactsListView.render().el);

	$(".active").removeClass("active");
	$("#contactsmenu").addClass("active");

}
