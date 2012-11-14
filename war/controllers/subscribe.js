var SubscribeRouter = Backbone.Router.extend({
	
	 routes: {
		 "subscribe" : "subscribe",
		 "updatecard": "updateCreditCard",
		 "updateplan": "updatePlan",
		  "invoice" : "invoice",
		  "invoice/:id":"invoiceDetails"
	 },
	 
	 
	 subscribe: function(){

				 var subscribe_plan = new Base_Model_View({
					 url: "core/api/subscription",
					 template: "subscribe",
					 window: 'subscribe',
					 postRenderCallback : function(el) {
						 	
						 	setUpAccountStats(el)
						 
						 	// Load date and year for card expiry
						 	cardExpiry(el);
						 	
						 	// Load countries and respective states
							head.js(LIB_PATH + 'lib/countries.js', function()
									{	
										print_country($("#country",el));
									});
					 }
				 });
				 
				 $('#content').html(subscribe_plan.render().el);
	 },
	 updateCreditCard: function()
	 {
		 console.log("update card");
		 var card_details = new Base_Model_View({
			 url: "core/api/subscription",
			 template: "subscription-card-detail",
			 window: 'subscribe',
			 postRenderCallback : function(el) {

				 	// Load date and year for card expiry
				 	cardExpiry(el);
				 	
				 	// To deserialize
				 	var card_detail_form = el.find('form.card_details'), card_data = card_details.model.toJSON().billingData;
				 	
				 	// Load countries and respective states
					head.js(LIB_PATH + 'lib/countries.js', function()
							{	
								print_country($("#country",el));
								
								// Deserialize card details
								if(!$.isEmptyObject(card_data))
									deserializeCardDetails(JSON.parse(card_data), $(card_detail_form));
							});
				 	
			 }
		 });
		 
		 $('#content').html(card_details.render().el);
	 },
	 updatePlan: function() {
		 var update_plan = new Base_Model_View({
			 url: "core/api/subscription",
			 template: "update-plan",
			 window: 'subscribe'
		 });
		 
		 $('#content').html(update_plan.render().el);
	 },
	 invoice: function() {
		 this.invoice = new Base_Collection_View({
			 url: "core/api/subscription/invoice",
			 templateKey: "invoice",
			 window: 'subscribe',
			 individual_tag_name: 'tr'
		 })
		 
		 this.invoice.collection.fetch();
		 
		 $('#content').html(this.invoice.el);
	 },
	 invoiceDetails: function(id){

		 if(!this.invoice || !this.invoice.collection || this.invoice.collection == 0 || this.invoice.collection.get(id) == null)
			 {
	    		this.navigate("invoice", {
	                trigger: true
	            });
	    		return;
			 }
		 
		 var model = this.invoice.collection.get(id);
		 
		 var invoice_details = new Base_Model_View({
		//	 url: "core/api/subscription/invoice",
			 model:model,
			 template: "invoice-detail",
			 window: 'invoice',
			 isNew: true
		 });

		 $('#content').html(invoice_details.render().el);
	 }
});