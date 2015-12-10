/**
 * For sorting of web rules
 * @param el
 */
function enableWebrulesSorting(el)
{
	$("#webrule-model-list").append("<tr class='pseduo-row' style='display:none;'><td></td><td></td><td></td><td></td></tr>");
	// Loads jquery-ui to get sortable functionality on widgets
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function()
	{
		$('.webrule-sortable', el).sortable( 
		{
				axis: "y" ,
				forcePlaceholderSize: true,
				placeholder:'<tr><td></td></tr>',
				handle: ".icon-move",
				containment: "#webrule-model-list",
				cursor: "move",
				forceHelperSize: true,
				scroll: false,
				items: "> tr",
				helper: function(e, tr)
				{
				    var $originals = tr.children();
				    var $helper = tr.clone();
				    $helper.children().each(function(index)
				    {
				      // Set helper cell sizes to match the original sizes
				      $(this).width($originals.eq(index).width());
				    });
				    return $helper;

				}

		});

		/*
		 * This event is called after sorting stops to save new positions of
		 * widgets
		 */
		$('.webrule-sortable', el).on("sortstop", function(event, ui) {

			var models = [];

			/*
			 * Iterate through each all the widgets and set each widget
			 * position and store it in array
			 */
			$('.webrule-sortable > tr', el).each(function(index, element)
			{
				if(!$(element).hasClass("pseduo-row")){


					var model_id = $(element).find('.data').attr('data');

					// Get Model, model is set as data to widget element
					var model = App_WebReports.webrules.collection.get(model_id);

					model.set({ 'position' : index+1 }, { silent : true });

					models.push({ id : model.get("id"), position : index+1 });
				}

			});

			// Saves new positions in server
			$.ajax({ type : 'POST', url : '/core/api/webrule/positions', data : JSON.stringify(models),
				contentType : "application/json; charset=utf-8", dataType : 'json' });
		});
	});
}
