function initializeTelephonyListners(el){
	
	console.log("initialised telephony admin sttting prefs initialising clicks");
	makeTDSortable(el);
	//initializeTelephonyEvents(el);
	
}



function makeTDSortable(el){
	/**
	 * For UI setup of categories tab.
	 */
		head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
			$(el).find('tbody').each(function(index){
				$(this).sortable({
				      containment : "#admin-settings-telephony-model-list",
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
				      
				      // When call status is dropped its input value is changed 
				      update : function(event, ui) {
				    	  console.log($(ui.item).attr('data'));
				    	  saveTelephonyStatusOrder();
				    	 // fill_ordered_milestone($(ui.item).closest('form').attr('id'));
				        }
			    });
			});
		});
}


function saveTelephonyStatusOrder(){
	var url = '/core/api/categories/order';
	var statusIds = [];
	
	$('#admin-settings-telephony-model-list').find('tr').each(function(index){
		statusIds[index] = $(this).find('input[name="id"]').val();
	});
	var data = {};
	data.ids = JSON.stringify(statusIds);
	console.log('------------',data);
	makeAjaxCall(url, true, "POST", data, 'json', function(response)
	{
		//App_Admin_Settings.telephony();
		console.log("status ordered");
	});
	
}



/*function initializeTelephonyEvents(el){
	
	$(el).on('click','.show_telephony_status_field',function(e){
		e.preventDefault();
			$(".show_field").show();
			$(this).hide();
	});
	
	$(el).on('keypress','#add_new_telephony_status',function(e){
		e.preventDefault();
		if(e.keyCode == 13)
    	{
    		$("#add_telephony_status").click();
    	}
    });
	
	$(el).on('click','#add_telephony_status',function(e){

		e.preventDefault();
		saveTelephonyStatus(this);
		
	    });
	
	$(el).on('click','.telephony-status-delete',function(e){

		e.preventDefault();
		$('#telephony-status-delete-modal').modal('show');
		var id = $(this).attr("id");
		var label = $(this).attr("data");
		$("#delete-telephony-confirm-dialog input[name=id]").val(id);
		$("#delete-telephony-confirm-dialog #telephony-status-name").html(label);
	    });
	
	$(el).on('click','#telephony-status-delete-confirm',function(e){
		
		e.preventDefault();
		var data = {};
		data.id = $("#delete-telephony-confirm-dialog input[name=id]").val();
		deleteTelephonyStatus(data);
	});
	
	}*/

function deleteTelephonyStatus(data){

	var url = '/core/api/categories/delete';
	makeAjaxCall(url, true, "POST", data, 'json', function(response)
			{
		App_Admin_Settings.telephonyGridView.collection.remove(App_Admin_Settings.telephonyGridView.collection.get(data.id));
		$('#telephony-status-delete-modal').modal('hide');
		var ele = $('#admin-settings-telephony-model-list').find('tr input[value='+data.id+']');
		if(ele){
			ele.closest("tr").remove();
		}
		
		//App_Admin_Settings.telephonyGridView.render(true);
		//App_Admin_Settings.telephony();
			},function(response){
				console.log("unable to delete the status");
				$('#telephony-status-delete-modal').modal('hide');
			});
}

function saveTelephonyStatus(that){
	
	var label = $('#add_new_telephony_status').val().trim();
	// Returns, if the save button has disabled attributeR
	if ($(that).attr('disabled'))
		return;
	// Disables save button to prevent multiple click event issues
	disable_save_button($(that));//$(saveBtn).attr('disabled', 'disabled');
	
	var regexString = '^[a-zA-Z][a-zA-Z 0-9_-]*$';
	var is_valid = new RegExp(regexString).test(label);
		if(!is_valid){
			$(that).parent().find('.save-status').html('<span style="color:red;">Status should begin with alphabet and can contain "-" and "_" as special character</span>');
			setTimeout(function(){ 
				$(that).parent().find('.save-status').html("");
				}, 3000);
			// Removes disabled attribute of save button
			enable_save_button($(that));//$(saveBtn).removeAttr('disabled');
			return false;
		}
		if(label.length === 0){
			$(that).parent().find('.save-status').html('<span style="color:red;">This field is required.</span>');
			setTimeout(function(){ 
				$(that).parent().find('.save-status').html("");
				}, 3000);
			// Removes disabled attribute of save button
			enable_save_button($(that));//$(saveBtn).removeAttr('disabled');
			return false;
		}

	
	var telJson = {};
	telJson.label = label;
	
	var orderNew =0;
	var length = 0;
	$('#admin-settings-telephony-model-list').find('tr').each(function(index){
		length = parseInt($(this).find('input[name="id"]').attr("order"));
		if(length > orderNew){
			orderNew = length;
		}
	});
	
	telJson.order = parseInt(orderNew) + 1;
	telJson.entity_type='TELEPHONY_STATUS';
	console.log(telJson);

	var telephony = new Backbone.Model();
	telephony.url = '/core/api/categories';

	telephony.save(telJson, {
		success : function(model, response) {
			// Removes disabled attribute of save button
			enable_save_button($(that));
			App_Admin_Settings.telephonyGridView.collection.add(model);
			$(".show_telephony_status_field").show();
			$("#add_new_telephony_status").val("");
			$(".show_field").hide();
			//App_Admin_Settings.telephony();
		},
		error: function(data,response){
			console.log(response,data);
			$(that).parent().find('.save-status').html('<span style="color:red;">'+response.responseText+'</span>');
			setTimeout(function(){ 
				$('.save-status','#telephony-callstatus-fields').html("");
				}, 3000);
			enable_save_button($(that));
		}
	});
}