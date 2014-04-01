$(function()
{

// ------------------------------------------------- agile-score-event.js --------------------------------------------- START --

/**
 * All events related to score board UI block.
 * Add Score/ Subtract Score.
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for add Score ------------------------------------------------- 

	$('.add-score').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.score-scope");
		var Email = $('input[name="email"]', el).val();
		//  ------ Parse score text into integer. ------ 
		var Old_Score = parseInt($.trim($('.score-value', el).text()), 10);
		$('.score-value', el).text(Old_Score + 1);
		//  ------ Add Score ------ 
		_agile.add_score(1,
				{success: function(Response){
							//  ------ Merge Server response object with Contact_Json object. ------ 
							$.extend(Contacts_Json[Email], Response);
					
				}, error: function(Response){
									
											
				}}, Email);
	});

	
//  ------------------------------------------------- Click event for subtract Score --------------------------------------------- 
	
	$('.subtract-score').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.score-scope");
		var Email = $('input[name="email"]', el).val();
		//  ------ Parse score text into integer. ------ 
		var Old_Score = parseInt($.trim($('.score-value', el).text()), 10);

		if (Old_Score > 0) {
			$('.score-value', el).text(Old_Score - 1);
			//  ------ Subtract Score ------ 
			_agile.add_score(-1,
					{success: function(Response){
								//  ------ Merge Server response object with Contact_Json object. ------ 
								$.extend(Contacts_Json[Email], Response);
						
					}, error: function(Response){
										
												
					}}, Email);
		}
	});
	

// ------------------------------------------------- agile-score-event.js ------------------------------------------------ END --
	

});