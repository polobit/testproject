(function(milestone_util, $, undefined) {
	
	milestone_util.HARD_RELOAD_MILESTONES = false;
	
	var wonIcon = "<i title='Make Milestone Won' class='task-action icon icon-like'></i>";
	var lostIcon = "<i title='Make Milestone Won' class='task-action icon icon-dislike'></i>";
	milestone_util.wonMsg = 'Deals with this milestone are considered as Won.';
	milestone_util.lostMsg = 'Deals with this milestone are considered as Lost.';
	var milestoneMsg = "For better deal reports and sales forecasting, please set your 'Won' and 'Lost' milestones in the <i style='text-decoration:underline;'>Deal settings</i> page.";
	milestone_util.isNotyVisible = true;
	milestone_util.showMilestonePopup = function(track){
		
		if(!(track.lost_milestone && track.won_milestone) || track.won_milestone.length == 0 || track.lost_milestone.length == 0){
			setDefaultLostAndWon(track,function(newTrack){
				if(!(newTrack.lost_milestone && newTrack.won_milestone)){
					milestone_util.showMilestoneNoty();
					milestone_util.isNotyVisible = true;
				}
				return newTrack;
			});
		}
	};
	
	milestone_util.showMilestoneNoty = function(){
		
		// If route is subscribe, it will remove existing noty and returns. If there is not existy nagger noty, it will just return
		if(Current_Route.indexOf('deal') == 0)
		{
			if(Nagger_Noty)
				$.noty.closeAll();
			//return;
		}
		
		if(milestone_util.isNotyVisible)
			return;
		
		// If Noty is present already, then noty is initiated again
		if(Nagger_Noty && $("#" +Nagger_Noty).length > 0)
			return;
		
		setTimeout(function(){ 
			// Show the first one after 3 secs
			showNotyPopUp("warning", milestoneMsg, "topCenter", "none", function(){
					$.noty.close(Nagger_Noty);
					Nagger_Noty = null;
					Backbone.history.navigate('milestones', {
						 trigger : true
						 });
				});
			
			setTimeout(function(){
				$.noty.closeAll();
			}, 10000);
		
		}, 4000);
		milestone_util.isNotyVisible = true;
			
	};
	
	var setWon = function(track,callback){
		var url = 'core/api/milestone/won';
		var input = {};
		input.pipeline_id = track.id;
		input.milestone = track.won_milestone;
		$.ajax({ url : url, type : 'POST', data : input, contentType : "application/x-www-form-urlencoded", success : function(data)
			{
				if(callback)
					callback();
			}});
	};
	
	var setLost = function(track,callback){
		var url = 'core/api/milestone/lost';
		var input = {};
		input.pipeline_id = track.id;
		input.milestone = track.lost_milestone;
		$.ajax({ url : url, type : 'POST', data : input, contentType : "application/x-www-form-urlencoded", success : function(data)
			{
				if(callback)
					callback();
			}});
	};
	
	var setDefaultLostAndWon = function(track, callback){
		var milestones = track.milestones.split(',');
		$.each(milestones, function(index, val){
			if(val.toUpperCase() == 'WON' && (track.won_milestone == undefined || track.won_milestone.length==0) && val != track.lost_milestone){
				track.won_milestone = val;
				setWon(track);
			} else if(val.toUpperCase() == 'LOST' && (track.lost_milestone == undefined || track.lost_milestone.length==0) && val != track.won_milestone){
				track.lost_milestone = val;
				setLost(track);
			}
				
		});
		
		if(callback)
			callback(track);
	};
	
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
			var container = ele.closest('tr');
			if(container.find('i.mark-lost').length > 0){
				container.find('i.mark-lost').remove();
				container.find('.milestone-lost').removeClass('disabled');
				$('#'+formId).find('input[name="lost_milestone"]').val('');
			}
			milestone_util.savePipelineForm(formId,function(resp){
				$('#'+formId+' .milestone-won').removeClass('disabled');
				$('#'+formId+' i.mark-won').remove();
				container.find('.milestone-name-block').append("<i data-toogle='tooltip' title='"+milestone_util.wonMsg+"' class='icon-like mark-won m-l-sm'></i>");
				container.find('a.milestone-won').addClass('disabled');
				$('.mark-won',container).tooltip();
				App_Admin_Settings.pipelineGridView.collection.get(resp.id).set('won_milestone',resp.won_milestone, {silent:true});
			});
		}
	};
	
	var setLostMilestone = function(ele){
		var lostMilestone = ele.closest('tr').attr('data');
		if(lostMilestone != undefined && lostMilestone.length > 0){
			var formId = ele.closest('form').attr('id');
			$('#'+formId).find('input[name="lost_milestone"]').val(lostMilestone);
			var container = ele.closest('tr');
			if(container.find('i.mark-won').length > 0){
				container.find('i.mark-won').remove();
				container.find('.milestone-won').removeClass('disabled');
				$('#'+formId).find('input[name="won_milestone"]').val('');
			}
			milestone_util.savePipelineForm(formId,function(resp){
				$('#'+formId+' .milestone-lost').removeClass('disabled');
				$('#'+formId+' i.mark-lost').remove();
				container.find('.milestone-name-block').append("<i data-toogle='tooltip' title='"+milestone_util.lostMsg+"' class='icon-dislike mark-lost m-l-sm'></i>");
				container.find('a.milestone-lost').addClass('disabled');
				$('.mark-lost',container).tooltip();
				App_Admin_Settings.pipelineGridView.collection.get(resp.id).set('lost_milestone',resp.lost_milestone, {silent:true});
			});
		}
	};
	
	var initEvents = function(el){
		$('#milestone-listner').on('click', '.milestone-won', function(e){
		//$('.milestone-won').die().live('click',function(e){
			e.preventDefault();
			if(!$(this).hasClass('disabled'))
				setWonMilestone($(this));
		});
		
		$('#milestone-listner').on('click', '.milestone-lost', function(e){
		//$('.milestone-lost').die().live('click',function(e){
			e.preventDefault();
			if(!$(this).hasClass('disabled'))
				setLostMilestone($(this));
		});
		
		$('.milestone-won, .milestone-lost, .mark-won, .mark-lost, .milestone-delete',el).tooltip();
		
	};
	
	milestone_util.init = function(el){
		initEvents();
	};
	
}(window.milestone_util = window.deal_bulk_actions || {}, $));