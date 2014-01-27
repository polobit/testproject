// Contacts on querying
var QUERY_RESULTS;

// Saves map of key: name and value: contact id
var TYPEHEAD_TAGS = {};

/**
 * This script file defines simple search keywords entered in input fields are 
 * sent to back end as query through bootstrap typeahead. Methods render, matcher 
 * and updater are overridden for custom functionality. Last 2 parameters were 
 * added later for Companies autofill. They can be left undefined and things 
 * will go to default, the way its normally used otherwise throughout the project.
 * 
 * @method agile_type_ahead
 * @param id
 *            Html element id of input field
 * @param el
 *            Html element of the view
 * @param callback
 *            To customer contacts to show in dropdown
 * @param isSearch
 *            Callback to override functionalities of updater function
 * @param urlParams
 * 			  [Added later] Additional parameters to be append, e.g. type=COMPANY
 * @param noResultText           
 * 			  [Added later] HTML text to display in case of no result
 * @module Search
 * @author Yaswanth
 * 
 */
function agile_type_ahead(id, el, callback, isSearch, urlParams, noResultText, url) {

    // Turn off browser default auto complete
    $('#' + id, el).attr("autocomplete", "off");
    if(!url)
    	url = "core/api/search/"
    	

    var CONTACTS = {};

    $('#' + id, el).typeahead({
    	
        source: function (query, process) {
        	
        	
        	/* Resets the results before query */
        	CONTACTS = {};

        	/* Stores type ahead object in temporary variable */
        	var that = this;

        	that.$menu.empty();
        	/* Sets css to html data to be displayed */
        	that.$menu.css("width", 300);

     		/*
        	 * Calls render because menu needs to be initialized
        	 * even before first result is fetched to show
        	 * loading 
        	 */
        

        	/*
        	 * If loading image is not available in menu then
        	 * appends it to menu
        	 */
        	if (!$(this.$menu.find('li').last()).hasClass('loading-results')){
        			that.$menu.html('<li class="divider"></li><li class="loading-results"><p align="center">' + LOADING_ON_CURSOR + '</p></li>');
        			that.render();
        	}

        	// Drop down with loading image is shown
        	//this.shown = true;

        	// Get data on query
        	
        	var type_url="";
        	
        	if(urlParams && urlParams.length)type_url='&'+urlParams;
        	
        	$.getJSON(url + query+"?page_size=10"+type_url, function (data){

        	    /*
        		 * Stores query results to use them in updater and render
        		 * functions
        		 */
        		CONTACTS = data;

        		/*
        		 * Sets results in global variable, used to show results 
        		 * in different page (when search symbol is clicked)
        		 */
        		QUERY_RESULTS = data;

        		/*
        		 * If no result found based on query, shows info in
        		 * type-ahead drop-down and return
        		 */
        		if (data.length == 0) {
        			var txt='<b>No Results Found</b>';
        			if(noResultText && noResultText.length)txt=noResultText;
        			that.$menu.html('<div style="margin-top:10px"><p align="center">'+txt+'<p></div>');
        			that.render();
        			return;
        		}

        		var items_list = [];

        		/*
        		 * Customizes data for type ahead, items_list contains list of  contact 
        		 * names (first_name + last_name without space). callback is contacts_typeahead
        		 */ 
        		if (callback && typeof (callback) === "function")
        			items_list = callback(data);

        		/*
        		 * Stores contacts in a map with first_name+last_name as key and id as value
        		 */
        		$.each(data, function (index, item){
        			tag_name = items_list[index];
        			TYPEHEAD_TAGS[tag_name] = item.id;
        		});

        		/*
        		 * Calls matcher and render methods by verifying the data
        		 */
        		process(items_list);
        	});
        },
        
        /**
         * Overridden to return always true (when contacts are fetched based on 
         * email or company name etc..)
         */
        matcher: function (item){
            if (~item.toLowerCase().indexOf(this.query.toLowerCase()) != 0)
            	return~item.toLowerCase().indexOf(this.query.toLowerCase());
            else return -1;
        },
        
        /**
         * Overridden to customize the view of matched drop down entities 
         * (i.e with image, email address etc..)  
         */
        render: function (){
        	var that = this;

            // If query results are not available activate the menu to show info and return
            if (!CONTACTS.length){
                this.show();
                return;
            }

            // Stores all the matched elements (<li> drop down) in items
            items = buildcategorizedResultDropdown (CONTACTS, that.options);
            	
            
            items.css("overflow", "hidden");

            //this.$menu.css("max-height", "400px");
            //this.$menu.css("overflow", "auto");
            
            // Keeps the list of items in menu (ul) and shows the drop down
            this.$menu.html(items).show();
            this.shown = true;
            return this
        },
        
        /**
         * Handles the select (clicking a drop down element) event of drop down elements.
         * If, it is search fiel navigates to detail view, related to field prepends the 
         * name as tag to the field. Also shows all the matched entities in other page 
         * when search symbol is clicked. 
         */
        updater: function (items) {
            // To verify whether the entity (task, deal etc..) related to same contact twice 
        	var tag_not_exist = true;

            /* Stores items in temp variable so that, shows first
             * name and last name separated by space
             */
        	if (items)
        		var items_temp = items.substr(0, items.lastIndexOf('-'));

            // Trims spaces in names to retrieve contact id from JSON (TYPEHEAD_TAGS)
            if (items) items = items.split(" ").join("")

            // Customizes data for type ahead
            if (isSearch && typeof (isSearch) === "function")
            {

                /* 
                 * If no item is selected (when clicked on search symbol or enter) then show
                 * results in different page
                 */ 
                if (!items)
                {
                    showSearchResults(); // fails automatically for non main search bar typeaheads.
                    return this.query; // return text of query to set in input field
                }
                
                
                // Navigates the item to its detail view
                isSearch(TYPEHEAD_TAGS[items], items_temp);
                return;
            }

            // Return if items are not defined and it is not search in nav bar
            if (!items) return;

            // If tag already exists returns
            $.each($('.tags', el).children('li'), function (index, tag){

                if ($(tag).attr('data') == TYPEHEAD_TAGS[items]){
                    tag_not_exist = false;
                    return;
                }
            });

            // add tag
            if (tag_not_exist)
            	{
            	
            		$('.tags', el).append('<li class="tag"  style="display: inline-block;" data="' + TYPEHEAD_TAGS[items] + '"><a href="#contact/' + TYPEHEAD_TAGS[items] +'">' + items_temp + '</a><a class="close" id="remove_tag">&times</a></li>');
            	}
        },
        
        // Hides the results list
        hide: function () {
        	this.$menu.hide();
            this.shown = false;
            return this;
        },
        
        // Handles cursor exiting the textbox
        blur: function (e) {
            var that = this;
            e.stopPropagation();
            e.preventDefault();
            setTimeout(function () {
                if (!that.$menu.is(':focus'))
                  that.hide();
            }, 150)
        },
        minLength: 2,
    })
}

// Removes tags ("Related to" field contacts)
$('#remove_tag').die().live('click', function (event)
{
    event.preventDefault();
    $(this).parent().remove();
});

/* Customization of Type-Ahead data */

/**
 * Returns list of contact names (with no space separation) for type ahead
 * 
 * @method contacts_typeahead
 * @param data
 *           contacts on querying, from type-ahead
 */
function contacts_typeahead(data)
{
    if (data == null)
    	return;
    
    // To store contact names list
    var contact_names_list = [];
       
    /*
     * Iterates through all the contacts and get name property
     */
    $.each(data, function (index, contact){
            
    	var contact_name;

        // Appends first and last name to push in to a list
        contact_name = getContactName(contact) +"-"+ contact.id;
            
        // Spaces are removed from the name, name should be used as a key in map "TYPEHEAD_TAGS"
        contact_names_list.push(contact_name.split(" ").join(""));
    });
        
    // Returns list of contact/company names
    return contact_names_list;
    
}


function getContactName(contact)
{
	var name="";
	if(!contact.type || contact.type == 'PERSON')
	{	
		var first_name = getPropertyValue(contact.properties, "first_name");
		var last_name = getPropertyValue(contact.properties, "last_name");
		last_name = last_name != undefined ? last_name.trim() : "";
		first_name = first_name != undefined ? first_name.trim() : "";
		name = (first_name + " " + last_name).trim();
	}	
	else if(contact.type == "COMPANY")
	{
		var company_name=getPropertyValue(contact.properties, "name");
		company_name = company_name !=undefined ? company_name.trim():"";
		name = company_name.trim();
	}
	
	if(name.length)return name;
	
	var email=getPropertyValue(contact.properties, "email");
	email = email!=undefined ? email.trim():"";
	
	if(email.length)return email;

	// if nothing found, assume Company and return with id.
	
	return 'Company '+contact.id;
}

function buildcategorizedResultDropdown(items, options)
{	
	var contact_custom_view = new Base_Collection_View({ 
		data : items,
		templateKey : "typeahead-contacts", 
		individual_tag_name : 'li' ,
		typeahead_options:options
	});
	
	contact_custom_view.appendItem = appendItemInResult;
	
	var el = contact_custom_view.render(true).el;
	return $(el);
		
	/*$(items).each(function (i, item){
		
		if()

    		 Check if item if of company type get
    		 * company name instead of first name
    		 * and last name of person
    		 
    			var fullname = getContactName(item) +  "-" +  item.id;

    			console.log(fullname);
    			
    		// Sets data-value to name
    		i = $(that.options.item).attr('data-value', fullname);

    		// To add border to all after li except to last one
    		i.addClass('typeahead-border');
    		
    		// Returns template, can be contact or company compares in template
    		i.find('a').html(getTemplate('typeahead-contacts', item));
    		return i[0];
		});*/
}

function appendItemInResult(item)
{

	var fullname = getContactName(item.toJSON()) +  "-" +  item.id;

	
	var itemView = new Base_List_View({
		model : item,
		"view" : "inline",
		template : this.options.templateKey + "-model",
		tagName : 'tr',
	});
	
	// Sets data-value to name
	i = $(this.options.typeahead_options.item).attr('data-value', fullname);

	// To add border to all after li except to last one
	i.addClass('typeahead-border');
	// Returns template, can be contact or company compares in template
	i.find('a').html(itemView.render(true).el);
	
	
	var type = item.toJSON().entity_type;
	if(type)
	{
		if(type == "contact_entity")
			{
			
				$("#contact-typeahead-heading", this.el).show();
				$("#contact-results", this.el).append(i);
			}
		if(type == "deal")
			{
				$("#deal-typeahead-heading",  this.el).show();
				$("#deals-results", this.el).append(i);
			}
		if(type == "entity_type")
			{
				$("#case-typeahead-heading",  this.el).show();
				$("#case-results", this.el).append(i);
			}
	}

}