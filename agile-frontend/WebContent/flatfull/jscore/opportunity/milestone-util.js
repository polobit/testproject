(function(milestone_util, $, undefined) {
	
	milestone_util.HARD_RELOAD_MILESTONES = false;
	
	var wonIcon = "<i title='Make Milestone Won' class='task-action icon icon-like'></i>";
	var lostIcon = "<i title='Make Milestone Won' class='task-action icon icon-dislike'></i>";
	
	milestone_util.savePipelineForm = function(formId,callback){
		var mile = serializeForm(formId);
    	console.log('---------',mile);
		// Saving that pipeline object
    	var pipeline = new Backbone.Model();
    	pipeline.url = '/core/api/milestone';
    	pipeline.save(mile, {
    		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
    		success : function(model, response) {
    			if(milestone_util.HARD_RELOAD_MILESTONES)
    				App_Admin_Settings.milestones();
    			if(callback)
    				callback(response);
    		},
			error: function(data,response){
				console.log(response);
			}
    	});
	};
	
	var setWonMilestone = function(ele){
		var wonMilestone = ele.closest('tr').attr('data');
		if(wonMilestone != undefined && wonMilestone.length > 0){
			var formId = ele.closest('form').attr('id');
			$('#'+formId).find('input[name="won_milestone"]').val(wonMilestone);
			milestone_util.savePipelineForm(formId,function(resp){
				$('#'+formId+' .milestone-won').removeClass('disabled');
				$('#'+formId+' i.mark-won').remove();
				var container = ele.closest('tr');
				if(container.find('i.mark-lost')){
					container.find('i.mark-lost').remove();
					container.find('.milestone-lost').removeClass('disabled');
					$('#'+formId).find('input[name="lost_milestone"]').val('');
				}
				container.find('.milestone-name-block').append("<i title='Won Milestone' class='icon-like mark-won m-l-sm'></i>");
				container.find('a.milestone-won').addClass('disabled');
			});
		}
	};
	
	var setLostMilestone = function(ele){
		var lostMilestone = ele.closest('tr').attr('data');
		if(lostMilestone != undefined && lostMilestone.length > 0){
			var formId = ele.closest('form').attr('id');
			$('#'+formId).find('input[name="lost_milestone"]').val(lostMilestone);
			milestone_util.savePipelineForm(formId,function(resp){
				$('#'+formId+' .milestone-lost').removeClass('disabled');
				$('#'+formId+' i.mark-lost').remove();
				var container = ele.closest('tr');
				if(container.find('i.mark-won')){
					container.find('i.mark-won').remove();
					container.find('.milestone-won').removeClass('disabled');
					$('#'+formId).find('input[name="won_milestone"]').val('');
				}
				container.find('.milestone-name-block').append("<i title='Lost Milestone' class='icon-dislike mark-lost m-l-sm'></i>");
				container.find('a.milestone-lost').addClass('disabled');
			});
		}
	};
	
	var initEvents = function(){
		$('.milestone-won').die().live('click',function(e){
			e.preventDefault();
			if(!$(this).hasClass('disabled'))
				setWonMilestone($(this));
		});
		$('.milestone-lost').die().live('click',function(e){
			e.preventDefault();
			if(!$(this).hasClass('disabled'))
				setLostMilestone($(this));
		});
		
	};
	
	milestone_util.init = function(){
		initEvents();
	};
	
}(window.milestone_util = window.deal_bulk_actions || {}, $));