/**
 * Creates backbone router for Deals/Opportunities CRU operations
 **/
var DealsRouter = Backbone.Router.extend({

    routes: {
    	
    	 /* Deals/Opportunity */
        "deals": "deals",
        "deals-add": "dealsAdd",
        "deals/:id": "dealsDetails"
    },
    /**
     * Fetches all the opportunities and shows them as a list.Also fetches Milestones pie-chart 
     * and Details graph if deals exist.
     *  
     */
    deals: function () {
    	this.opportunityCollectionView = new Base_Collection_View({
            url: 'core/api/opportunity',
            restKey: "opportunity",
            templateKey: "opportunities",
            individual_tag_name: 'tr'
        });

        /* Fetches Milestones Pie-Chart and Details Graph */
    	this.opportunityCollectionView.collection.fetch(
        		{
        			success:function(){ 
        				// Shows Milestones Pie
        				pieMilestones();
        				// Shows deals chart
        				pieDetails();
        				}
        		});
        
        $('#content').html(this.opportunityCollectionView.render().el);

        $(".active").removeClass("active");
        $("#dealsmenu").addClass("active");        
        	
    },
    /**
     * Saves new Deal.Initializes contacts typeahead, milestone select, date-picker 
     * and owner select list.
     * 
     **/
    dealsAdd: function () {
        
    	this.opportunityModelview = new Base_Model_View({
            url: 'core/api/opportunity',
            template: "opportunity-add",
            isNew: true,
            window: 'deals',
            postRenderCallback: function(el){
            	
            	// Contacts type-ahead
            	agile_type_ahead("relates_to", el, contacts_typeahead);
            	// Fills milestone select element
            	populateMilestones(el);
            	// Fills owner select element
            	populateUsers("owners-list", el);
            	        	
            	// Enable the datepicker
                $('#close_date', el).datepicker({
                    format: 'mm-dd-yyyy',
                });
            }
        });

    	var view = this.opportunityModelview.render();
        $('#content').html(view.el);
    },
    /**
     * Updates Deal.Initializes contacts typeahead,milestones select and
     * owner select.
     **/
    dealsDetails: function (id) {
        
    	// Send to deals if the user refreshes it directly
    	if (!this.opportunityCollectionView || this.opportunityCollectionView.collection.length == 0) {
            this.navigate("deals", {
                trigger: true
            });
            return;
        }
        
    	this.opportunityCollectionView.collection.fetch();
        this.opportunityCollectionView.currentDeal = this.opportunityCollectionView.collection.get(id);

        var view = new Base_Model_View({
            url: 'core/api/opportunity',
            model: this.opportunityCollectionView.currentDeal,
            template: "opportunity-add",
            window: 'deals',
            postRenderCallback: function(el){

            	// Call setupTypeAhead to get contacts
            	agile_type_ahead("relates_to", el, contacts_typeahead);
            	// Fills milestone select element
            	populateMilestones(el,undefined, App_Deals.opportunityCollectionView.currentDeal.toJSON());
            	// Fills owner select element
            	populateUsers("owners-list", el, App_Deals.opportunityCollectionView.currentDeal.toJSON(), 'owner');
            	
            },
        	});
        
        	var view = view.render();
        	$("#content").html(view.el);   
    }
});
    