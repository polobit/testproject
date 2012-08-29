var DealsRouter = Backbone.Router.extend({

    routes: {
    	
    	 /* Deals/Opportunity */
        "deals": "deals",
        "deals-add": "dealsAdd",
        "deals/:id": "dealsDetails",   
    },
    deals: function () {
    	this.opportunityCollectionView = new Base_Collection_View({
            url: 'core/api/opportunity',
            restKey: "opportunity",
            templateKey: "opportunities",
            individual_tag_name: 'tr'
        });

        this.opportunityCollectionView.collection.fetch(
        		{
        			success:function(){ 
        				// Show Milestones Pie
        				pieMilestones();
        				pieDetails();
        				}
        		});
        
        $('#content').html(this.opportunityCollectionView.render().el);

        $(".active").removeClass("active");
        $("#dealsmenu").addClass("active");        
        	
    },
    dealsAdd: function () {
        
    	this.opportunityModelview = new Base_Model_View({
            url: 'core/api/opportunity',
            template: "opportunity-add",
            isNew: true,
            window: 'deals',
            postRenderCallback: function(el){
            	populateUsers("owner", el);
            	agile_type_ahead("relates_to", el, contacts_typeahead);
            	
            	
            	// Enable the datepicker
                $('#close_date', el).datepicker({
                    format: 'mm-dd-yyyy'
                });
            }
        });

    	var view = this.opportunityModelview.render();
     	
        $('#content').html(view.el);
    },
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

        this.dealsDetailView = new Base_Model_View({
            model: this.opportunityCollectionView.currentDeal,
            template: "opportunity-detail"    
        });	
        
        var el = this.dealsDetailView.render().el;
        $('#content').html(el);
    },
});
    