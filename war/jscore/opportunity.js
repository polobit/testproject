// On click on row in Opportunities triggers the details of particular opportunity
$(function () {
    $('#opportunities-model-list > tr').live('click', function (e) {
        e.preventDefault();
        var data = $(this).find('.leads').attr('leads');

        if (data) {
            Backbone.history.navigate("deals/" + data, {
                trigger: true
            });
        }
    });
});


//Populate users in options of owner input field dropdown
function populateUsers(id, el) {
	// Users
	 var users = new Base_Collection_View({
         url: '/core/api/deal-owners',
         restKey: 'userPrefs',
         templateKey: 'owners',
         individual_tag_name: 'option'
     });
	users.collection.fetch();
     $('#owner',el).html(users.el);

     return el;
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
        	console.log(el);
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

function populateMilestones(el, dealsDetails){
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
							fillTokenizedSelect('milestone', array);
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
