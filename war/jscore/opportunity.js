$(function () {
	
	// On mouseover shows the popover
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
       
        // Check for last tr
        $('#opportunities-model-list > tr:last').attr({
        	"rel" : "popover",
        	"data-placement" : 'top',
        	"data-original-title" : currentDeal.toJSON().name,
        	"data-content" :  ele
        });
        $(this).popover('show');
        
    });
    
	// On mouseout hides the popover
    $('#opportunities-model-list > tr').live('mouseleave', function(){
    	 $(this).popover('hide');
    });
    
    $('#close-deal').live('click', function(e){
    	e.preventDefault();
    	window.history.back();
    });

});



//Populate users in options of owner input field dropdown
function populateUsers(id, el , value, key) {

	// Users set id of agile user to save agileuser key in opportunities
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	
	// Fill owners list
	fillSelect(id,'/core/api/users', 'domainUser', function fillOwner() {
		
		if(value)
		{
			// If domain user is delete owner is undefined
			if(value[key])
				// While deserialize set agile user id from user prefs to save agile user key in opportunity 
				$('#' + id, el).find('option[value='+value[key].id+']').attr("selected", "selected");;
		}			
	}, optionsTemplate); 
}

// To edit and update the opportunity
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
             	// Call setupTypeAhead to get tags
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

function populateMilestones(el, dealsDetails, value){
	
	 // Fill milestones in select options and ul 
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
						fillTokenizedSelect('milestone', array, function(){
							
							// Quotes required for option value because milstone can have spaces in between
							if(value && value.milestone)
								$("#milestone",el).find('option[value=\"'+value.milestone+'\"]').attr("selected", "selected");
						});
    			   }
    });
}

// 	To change the progress of the deals
$('#move li a').live('click', function (e) {

    e.preventDefault();
    var opportunity = App_Deals.opportunityCollectionView.currentDeal;
    opportunity.set('milestone',this.id);
    
    //opportunity.milestone = this.id;
    opportunity.url = 'core/api/opportunity';
    opportunity.save();
    App_Deals.opportunityCollectionView.collection.add(opportunity);
});
