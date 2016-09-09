var Helpcenter_Base_Model = Base_Model_View.extend({

	events:{
    	"click .removeComment":"" 
	},	

	removeComment : function(e){
      e.preventDefault();
      Tickets_Rest.removeDuedate(e);
	},

	});