/**
 * Creates backbone router for Deals/Opportunities create, read and update 
 * operations
 **/
var CasesRouter = Backbone.Router.extend({

    routes: {
    	
    	 /* Deals/Opportunity */
        "cases": "listCases",
        //"deals-add": "dealsAdd",
        //"deals/:id": "dealsDetails"
    },
    
    /**
     * Fetches all the opportunities and shows them as a list. Also fetches Miapplestones pie-chart 
     * and Details graph if deals exist.
     *  
     */
    listCases: function () 
	{	
		this.casesCollectionView = new Base_Collection_View({ 
			url: 'core/api/cases',
			restKey: "case",
			templateKey: "cases",
			individual_tag_name: 'tr'
		});

        /* Fetches Milestones Pie-Chart and Details Graph */
    	this.casesCollectionView.collection.fetch();
        
        $('#content').html(this.casesCollectionView.render().el);

        $(".active").removeClass("active");
        $("#casesmenu").addClass("active");        
    }
	
});
    