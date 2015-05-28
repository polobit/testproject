(function(categories, $, undefined) {
	
	
	categories.setup_categories = function(el){
		head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
			$(el).find('tbody').each(function(index){
				$(this).sortable({
				      containment : "#admin-settings-categories-model-list",
				      items:'tr',
				      helper: function(e, tr){
				          var $originals = tr.children();
				          var $helper = tr.clone();
				          $helper.children().each(function(index)
				          {
				            // Set helper cell sizes to match the original sizes
				            $(this).width($originals.eq(index).width());
				            $(this).css("background","#f5f5f5");
				            $(this).css("border-bottom","1px solid #ddd");
				          });
				          return $helper;
				      },
				     start: function(event, ui){
				    	  $.each(ui.item.children(),function(index,ele){
				    		  ui.helper.children().eq(index).width(ui.helper.children().eq(index).width()-$(this).width());
				    	  });
				    	  ui.helper.width(ui.helper.width());
				      },
				      sort: function(event, ui){
				    	  ui.helper.css("top",(ui.helper.offset().top+ui.item.offset().top)+"px");
				      },
				      forceHelperSize:true,
				      placeholder:'<tr><td></td></tr>',
				      forcePlaceholderSize:true,
				      handle: ".icon-move",
				      cursor: "move",
				      tolerance: "intersect",
				      
				      // When milestone is dropped its input value is changed 
				      update : function(event, ui) {
				    	  console.log($(ui.item).attr('data'));
				    	 // fill_ordered_milestone($(ui.item).closest('form').attr('id'));
				        }
			    });
			});
		});
	};
	
	
}(window.categories = window.categories || {}, $));