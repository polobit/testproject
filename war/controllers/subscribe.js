var SubscribeRouter = Backbone.Router.extend({
	
	 routes: {
		 "subscribe" : "subscribe",
	 },
	 subscribe: function(){
		 var subscribe_plan = new Base_Model_View({
			 url: "core/api/subscription",
			 template: "subscribe",
			 isNew:true,
			 window: 'home',
		 }) ;
		 
		 $('#content').html(subscribe_plan.render().el);
	 }

});