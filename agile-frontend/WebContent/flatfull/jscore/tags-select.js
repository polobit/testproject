/*$(function(){

		head.js('/flatfull/css/misc/chosen.css', '/lib/chosen.jquery.min.js', function() {
			var tags_list = [];
			_(TAGS).each(function (item) { 
			        var tag = item.get("tag");
			        if ($.inArray(tag, tags_list) == -1) tags_list.push(tag);
			    });
			
			console.log(tags_list);
			$.each(tags_list, function( index, val ) {
			  $('.tag-chosen-select').append($('<option>', { 
			        value: index,
			        text : val 
			   }));
			});

			var $select = $(".tag-chosen-select");
			// Initliazing multi select drop down
			$select.chosen({no_results_text: "No labels found"});
            
            if(execute_callback) {
				$select.off('change');
				$select.on('change', function(evt, params) {

				});
		    }
		    });

});*/

var Tag_List ={

	initChoosenSelect : function(el) {

		this.loadChosenLibrary(function() {
			var $select = $(".tag-chosen-select", el);
			// Initliazing multi select drop down
			$select.chosen({no_results_text: "No labels found"});
           /* if(execute_callback) {
				$select.off('change');
				$select.on('change', function(evt, params) {

				});
		    }*/
		});
	},
	loadChosenLibrary: function(callback){

		head.js('/flatfull/css/misc/chosen.css', '/lib/chosen.jquery.min.js', function() {
			var tags_list = [];
			_(TAGS).each(function (item) { 
			        var tag = item.get("tag");
			        if ($.inArray(tag, tags_list) == -1) tags_list.push(tag);
			    });
			
			console.log("tags-list "+tags_list);
			$.each(tags_list, function( index, val ) {
			  $('.tag-chosen-select').append($('<option>', { 
			        value: index,
			        text : val 
			   }));
			});
		});
	}
};