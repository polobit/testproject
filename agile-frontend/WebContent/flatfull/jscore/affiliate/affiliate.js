function checkForAffiliateDetails(callback1, callback2){
	if(AFFILIATE_DETAILS){
		callback1();
		return;
	}
	$.ajax({ url : 'core/api/affiliate_details', type : 'GET', success : function(data)
		{
			if(data && data.id){
				AFFILIATE_DETAILS = data;
				callback1();
			}
			else
				callback2();
		}});
}

function getTimeFromDatePicker(){
	var range = $('#range').html().split("-");
    
	    var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
	    var d = new Date();
	    start_time=start_time+(d.getTimezoneOffset()*60*1000);
	    start_time=start_time/1000;
	    var end_value = $.trim(range[1]);

	    // To make end value as end time of day
	    if (end_value)
	        end_value = end_value + " 23:59:59";

	    // Returns milliseconds from end date.
	    //var end_time = Date.parse(end_value).valueOf();
	    //Get the GMT end time
	    var status = $('#status').find('option:selected').val();
	    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	    end_time += (((23*60*60)+(59*60)+59)*1000);
	    end_time=end_time+(d.getTimezoneOffset()*60*1000);
	    end_time=end_time/1000;
	    var time = {"start":start_time, "end":end_time};
	    return time;
}

function showCommission(userId, time, el){
	getCommission(CURRENT_DOMAIN_USER.id, time, function(data){
		$("#aff-count", el).html(data.count);
		$("#aff-commission", el).html((data.commission/100).toFixed(2));
	});
}

function getCommission(userId, time, callback){
	var url = 'core/api/affiliate/total?startTime='+time.start+'&endTime='+time.end;
	if(userId)
		url = url + '&userId='+userId;
	$.ajax({ url : url, type : 'GET', success : function(data)
		{
			if(callback && typeof(callback == "function"))
				callback(data);
		}});
}