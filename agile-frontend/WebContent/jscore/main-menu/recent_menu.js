/**
 * Shows and manages menu list of recently viewed items, on right side of main menu.
 * 
 * Non-static fxn : add_recent_view(model mdl)
 * 						This will add model mdl to the list. This function takes care of order of the list too, with most
 * 						recently viewed model being displayed first.
 * 
 * 						This is the only function necesary outside of this file/module.
 * 
 * @author Chandan
 */

var recent_view;
var recent_view_update_required=false;
var MAX_RECENT=6;

/**
 * Does actual work of populating menu from list.
 */
function populate_recent_menu()
{
	if(!recent_view)
	{	
		var arr = [];
		try{
			arr = JSON.parse(localStorage.recentItems);
		}
		catch(err)
		{
			
		}
		recent_view = new Base_Collection_View({
//			url: 'core/api/contacts/recent?page_size=5' ,
			restKey: "contacts",
			templateKey: "recent-menu",
			data : arr,
			individual_tag_name: 'li',
			sort_collection: false,
			postRenderCallback : function(el)
			{
				$('#recent-menu').append($(el).html())
			}
		});
		
		recent_view.render(true);

		
	
	
	if(recent_view.collection.length==0)	// default text, when list is empty.
		$('#recent-menu>ul').html('<li style="text-align:center;"><a class="disabled">No Recent Activity</a></li>');
	else {recent_view.render(true);
	}			// populate elements if filled from localStorage
}
}

/**
 * Add/Update model to recent contacts view.
 * Now non functional.
 * @param mdl - the model to add.
 */
function add_recent_view(mdl)
{
	
	if(recent_view==undefined)
		populate_recent_menu();
	
	// Add model to front of the collection, so most frequent ones are on top.
	
	if(!recent_view.collection.get(mdl.get('id'))){
		
		if(recent_view.collection.length>=MAX_RECENT)
			recent_view.collection.pop({silent:true});
		
		recent_view.collection.unshift(mdl);
	}	
	else {
			recent_view.collection.remove(mdl, { silent: true });
		
		recent_view.collection.unshift(mdl);
	}
	
	
	
	recent_view_update_required=true;

	var arr=[];
	
	for(var i=0;i<recent_view.collection.models.length;++i)
	{
		arr.push(recent_view.collection.models[i].attributes);
	}
	
	localStorage.recentItems = JSON.stringify(arr); // save current list to localStorage
}

/**
 * Appropriate action when an entry in drop down menu is clicked.
 * @param id
 */
function modelAction(elem)
{
	var id=elem.dataset['id'];
	var entity=recent_view.collection.get(id);
	var type=entity.attributes.entity_type;
	
	if(type=='contact_entity')
	{
		App_Contacts.navigate("contact/"+id,{trigger:true});
		$('#contactsmenu').parent().find('.active').removeClass('active');
		$('#contactsmenu').addClass('active');
	}	
	else if(type=='deal')
	{
		App_Deal_Details.navigate("deal/"+id,{trigger:true});
		$('#contactsmenu').parent().find('.active').removeClass('active');
		$('#contactsmenu').addClass('active');
	}
	else if(type == 'case')
	{
		updatecases(entity);
	}
	else if(type == 'document' || entity.attributes.network_type)
	{
		updateDocument(entity);
	}
	
	recent_view_update_required=true;
}

$(function(){
	
	// when caret clicked, show the dropdown menu
	$('#recent-menu').on('click',function(e){ 
	
		if(recent_view==undefined)
			populate_recent_menu();
		else if(recent_view_update_required)
			{
			recent_view.render(true);
			}
		
		recent_view_update_required=false;
	});
	
	$('#recent-menu li:first').mouseenter(function(e){
		e.stopPropagation();
		e.preventDefault();
		$(this).css('background-color','white');
	});
	
	// when an entry clicked
	$('#recent-menu').on('click','ul>li',function(e) {
		e.stopPropagation();
		
		var selected_element=$(e.target).closest('[data-id]',$(this));
				// find the id of the element
		
		if(selected_element.length)
			modelAction(selected_element[0]);
		
		// close the drop down menu
		$('#recent-menu').removeClass('open');
		
		return false;
	});	
});

