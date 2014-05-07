// Maintain changes in UI
function displaySettings()
{
	// Creates normal time.
	displayTimeAgo($(".list"));

	$(".listed-task").parent().css('padding-bottom', '5px');

	// Get selected criteria
	var criteria = getCriteria();

	// Change task UI as per group selection
	if (criteria == "CATEGORY")
	{
		// Remove type of task from UI when category filter selected
		$(".task-type").remove();

		// Assign new setting to Owner image
		$(".task-owner").addClass("shift-up");
		
		// Assign new min height to task
		$(".task-body").addClass("task-body-category");
	}

	if (criteria == "OWNER")
	{
		// Remove owner pic of task from UI when owner filter selected
		$(".task-owner").remove();

		// Assign new min height to task
		$(".task-body").addClass("task-body-owner");
	}
}

// Load and display slider in edit modal of task for progress.
function loadProgressSlider(el)
{
	head.load(CSS_PATH + 'css/jslider.css', LIB_PATH + 'lib/jquery.slider.min.js', function()
			{
				$(".progress_slider", el).slider({ from : 0, to : 100, step : 1, skin : "plastic", onstatechange : function(value)
				{
					$("#progress", el).val(value);
				} });

				$(".progress_slider").slider("value", $("#editTaskForm #progress").val());
			});	
}

/**/
function changeStatus()
{
	
}

/**/
function changeProgress()
{
	
}

/**/
function changeStatusProgress()
{
	
}



