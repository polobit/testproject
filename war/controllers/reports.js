var ReportsRouter = Backbone.Router.extend({
	
	 routes: {
		 "reports" : "reports",
		 "report-add": "reportAdd",
		 "report-edit/:id":  "reportEdit",
	 },
	 
	 
	 reports: function() {
	    	this.reports = new Base_Collection_View({
	            url: '/core/api/reports',
	            restKey: "reports",
	            templateKey: "report",
	            individual_tag_name: 'tr'
	        });
	    	
	    	this.reports.collection.fetch();
	    	$("#content").html(this.reports.render().el);
	    },
	 
	 
	 reportAdd: function()
	 {
		 var report_add = new Base_Model_View({
				url:'core/api/reports',
	            template: "reports-add",
	            window: "reports",
	            isNew : true,
	            postRenderCallback: function(el) {
					
	            	populateUsers("owners", el);
	            	
	            	head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
	           		    	{	
	            				
	           					var LHS, condition, RHS, RHS_NEW;
	           					
	           					LHS = $("#LHS", el);
	           					condition = $("#condition", el)
	           					RHS = $("#RHS", el)
	           					
	           					// Extra field required for (Between values condition)
	           					RHS_NEW = $("#RHS-NEW", el)
	           					
	           					// Chaining dependencies of input fields with jquery.chained.js
	           					condition.chained(LHS);
	           					RHS_NEW.chained(condition);
	           					RHS.chained(LHS);
	            			        	            			    
	           		    	})
	               }
	        });
	
		 $('#content').html(report_add.render().el);
	 },
	 
	 reportEdit: function(id)
	 {
		 if (!this.reports || !this.reports.collection || this.reports.collection.length == 0 || this.reports.collection.get(id) == null)
	    	{
	    		this.navigate("reports", {
	                trigger: true
	            });
	    		return;
	    	}
	    	
	    	var report = this.reports.collection.get(id);
	    	  var report_model = new Base_Model_View({
	    	        url: 'core/api/reports',
	    	        model: report,
	    	        template: "reports-add",
	    	        window: 'reports',
		            postRenderCallback: function(el) {  
		            	populateUsers("owners", el, report.toJSON(), 'domainUser');
		            	
		            	head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
		           		    	{	
		            				var LHS, condition, RHS, RHS_NEW;
	       					
		            				LHS = $("#LHS", el);
		            				condition = $("#condition", el)
		            				RHS = $("#RHS", el)
	       					
		            				// Extra field required for (Between values condition)
		            				RHS_NEW = $("#RHS-NEW", el)
	       					
		            				// Chaining dependencies of input fields with jquery.chained.js
		            				condition.chained(LHS);
		            				RHS_NEW.chained(condition);
		            				RHS.chained(LHS);
	        			        	            
		            			        	            			    
		           		    	})
		               }
	    	    	});

	    	    	$("#content").html(report_model.render().el); 
	    	
	    },

})