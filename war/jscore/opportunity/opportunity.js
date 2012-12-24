/**
 * opportunity.js is a script file that handles opportunity pop-over,
 * milestones and owner select list.
 * 
 * @module Deals
 * 
 **/
$(function () {
	
	/**
	 * When mouseover on any row of opportunities list, the popover of deal is shown
	 **/
	$('#opportunities-model-list > tr').live('mouseenter', function () {
        
        var data = $(this).find('.data').attr('data');

        var currentDeal = App_Deals.opportunityCollectionView.collection.get(data);
       
        //console.log(currentDeal.toJSON());
        
        var ele = getTemplate("opportunity-detail-popover", currentDeal.toJSON());
        $(this).attr({
        	"rel" : "popover",
        	"data-placement" : 'right',
        	"data-original-title" : currentDeal.toJSON().name,
        	"data-content" :  ele
        });
       
       
        /**
         * Checks for last 'tr' and change placement of popover to 'top' inorder
         * to prevent scrolling on last row of list
         **/
        $('#opportunities-model-list > tr:last').attr({
        	"rel" : "popover",
        	"data-placement" : 'top',
        	"data-original-title" : currentDeal.toJSON().name,
        	"data-content" :  ele
        });
        $(this).popover('show');
     });
    
	
    /**
     * On mouse out on the row hides the popover.
     **/
	$('#opportunities-model-list > tr').live('mouseleave', function(){
    	 $(this).popover('hide');
    });
    
   /**
    * When deal is added from contact-detail by selecting 'Add Opportunity' from actions 
    * and then close button of deal is clicked, it should navigate to contact-detail.
    **/
	$('#close-deal').live('click', function(e){
    	e.preventDefault();
    	window.history.back();
    });

});

/**
 * Populate users in options of owner input field drop-down.
 * When new deal is created,owner select is filled with owners list.When
 * deal is need to edit,the owner select field is filled with previous option.
 *  
 * @param id - Id of select element of Owner
 * @param el - el references the DOM object created in the browser.
 * @param value - Deal object
 * @param key - key name in the value.It is passed during declaration
 **/
function populateUsers(id, el , value, key) {
	console.log('id',id);
	
	// Users set id of agile user to save agileuser key in opportunities
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	
	 /**
      * Fills owner select with existing Users.
      * 
      * @param id - Id of select element of Owner
      * @param /core/api/users - Url to get users
      * @param 'domainUser' - parse key
      * @param function - callback function
      * @param optionsTemplate- to fill options with users
      **/
	fillSelect(id,'/core/api/users', 'domainUser', function fillOwner() {
		
		if(value)
		{
			// If domain user is deleted owner is undefined
			if(value[key])
				// While deserialize set agile user id from user prefs, to save agile user key in opportunity 
				$('#' + id, el).find('option[value='+value[key].id+']').attr("selected", "selected");
		}			
	}, optionsTemplate); 
}


/**
 * Populate milestones in options of milestone input field drop-down.
 * When new deal is created,milestone select is filled with milestones list.When
 * deal is need to edit,the milestone select field is filled with previous option.
 * 
 * @param el - el references the DOM object created in the browser.
 * @param dealDetails - dealDetails value
 * @param value - Deal Object
 **/
function populateMilestones(el, dealsDetails, value){

	 // Fill milestones in select options
    var milestone_model = Backbone.Model.extend({
   	 url: '/core/api/milestone'
		});
    
    var model = new milestone_model();
    model.fetch({ 
   			 success: function(data) 
   			 { 
   				 		var jsonModel = data.toJSON();
						var milestones = jsonModel.milestones;
						
						// Split , and trim
						var array = [];
						$.each(milestones.split(","), function(){
							array.push($.trim(this));
						});
						if(dealsDetails)
						{
							fillMilestones('move', array);
							return;
						}
						/**
						 * Fills milestone select with existing milestones.
						 * 
						 * @param 'milestone' - Id of select element of Owner
						 * @param  array - array of milestones
						 * @param function - callback function
						 **/
						fillTokenizedSelect('milestone', array, function(){
														
							// Quotes required for option value because milestone can have spaces in between
							if(value && value.milestone)
								$("#milestone",el).find('option[value=\"'+value.milestone+'\"]').attr("selected", "selected");
						});
    			   }
    });
}

/*// To edit and update the opportunity-detail
$("#editOpportunity").live("click", function (e) {

    e.preventDefault();
    
    var view = new Base_Model_View({
        url: 'core/api/opportunity',
        model: App_Deals.opportunityCollectionView.currentDeal,
        template: "opportunity-add",
        window: 'deals',
        postRenderCallback: function(el){
        		populateUsers("owner", el);
        		populateMilestones(el);
             	// Call setupTypeAhead to get contacts
            	agile_type_ahead("relates_to", el, contacts_typeahead);   
            	
            	
            	// Enable the datepicker
                $('#close_date', el).datepicker({
                   format: 'mm-dd-yyyy'
                });
            	
            },
    	});
    
    	var view = view.render();
    	$("#content").html(view.el);   
});
*/

/*
 * // 	To change the progress of the deals
$('#move li a').live('click', function (e) {

    e.preventDefault();
    var opportunity = App_Deals.opportunityCollectionView.currentDeal;
    opportunity.set('milestone',this.id);
    
    //opportunity.milestone = this.id;
    opportunity.url = 'core/api/opportunity';
    opportunity.save();
    App_Deals.opportunityCollectionView.collection.add(opportunity);
});*/
