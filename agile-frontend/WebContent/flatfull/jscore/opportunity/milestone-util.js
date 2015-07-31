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
				$('#'+formId+' .milestone-won').css('visibility','hidden').removeClass('hover-hide').addClass('hover-show');
				$('#'+formId+' a.not-applicable').addClass('hover-show').removeClass('not-applicable');
				ele.closest('tr').find('a.milestone-won').css('visibility','visible').removeClass('hover-show').addClass('hover-hide');
				ele.closest('tr').find('a.milestone-lost').removeClass('hover-hide').addClass('not-applicable');
			});
		}
	};
	
	var setLostMilestone = function(ele){
		var lostMilestone = ele.closest('tr').attr('data');
		if(lostMilestone != undefined && lostMilestone.length > 0){
			var formId = ele.closest('form').attr('id');
			$('#'+formId).find('input[name="lost_milestone"]').val(lostMilestone);
			milestone_util.savePipelineForm(formId,function(resp){
				$('#'+formId+' .milestone-lost').css('visibility','hidden').removeClass('hover-hide').addClass('hover-show');
				$('#'+formId+' a.not-applicable').addClass('hover-show').removeClass('not-applicable');
				ele.closest('tr').find('a.milestone-lost').css('visibility','visible').removeClass('hover-show').addClass('hover-hide');
				ele.closest('tr').find('a.milestone-won').removeClass('hover-show').addClass('not-applicable');
			});
		}
	};
	
	var initEvents = function(){
		$('.milestone-won').die().live('click',function(e){
			e.preventDefault();
			setWonMilestone($(this));
		});
		$('.milestone-lost').die().live('click',function(e){
			e.preventDefault();
			setLostMilestone($(this));
		});
		
	};
	
	milestone_util.init = function(){
		initEvents();
	};
	
}(window.milestone_util = window.deal_bulk_actions || {}, $));