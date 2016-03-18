var existingDocumentsView;

// Documents actions
var contact_details_documentandtasks_actions = {

	    // Edit task
        edit_task : function(e){
        	var targetEl = $(e.currentTarget);

        	var id = $(targetEl).attr('data');
			var value = tasksView.collection.get(id).toJSON();

			$("#updateTaskModal").html(getTemplate("task-update-modal")).modal('show');

				loadProgressSlider($("#updateTaskForm"), function(el){

				deserializeForm(value, $("#updateTaskForm"));
				
				$('.update-task-timepicker').val(fillTimePicker(value.due));
				categories.getCategoriesHtml(value,function(catsHtml){
					$('#type',$("#updateTaskForm")).html(catsHtml);
					// Fills owner select element
					populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data)
					{
						$("#updateTaskForm").find("#owners-list").html(data);
						if (value.taskOwner)
							$("#owners-list", $("#updateTaskForm")).find('option[value=' + value['taskOwner'].id + ']').attr("selected", "selected");
			
						$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
					});
				});

				// Add notes in task modal
				showNoteOnForm("updateTaskForm", value.notes);
			});
			// activateSliderAndTimerToTaskModal();
        },

        // Event edit in contact details tab
        edit_event : function(e){
        	var targetEl = $(e.currentTarget);

        	$("#updateActivityModal").html(getTemplate("update-activity-modal"));
        	
        	var id = $(targetEl).attr('data');
			var value = eventsView.collection.get(id).toJSON();
			deserializeForm(value, $("#updateActivityForm"));
			$('.update-start-timepicker').val(fillTimePicker(value.start));
			$('.update-end-timepicker').val(fillTimePicker(value.end));

			$("#updateActivityModal").modal('show');
			
			if (value.type == "WEB_APPOINTMENT" && parseInt(value.start) > parseInt(new Date().getTime() / 1000))
			{
				$("[id='event_delete']").attr("id", "delete_web_event");
				web_event_title = value.title;
				if (value.contacts.length > 0)
				{
					var firstname = getPropertyValue(value.contacts[0].properties, "first_name");
					if (firstname == undefined)
						firstname = "";
					var lastname = getPropertyValue(value.contacts[0].properties, "last_name");
					if (lastname == undefined)
						lastname = "";
					web_event_contact_name = firstname + " " + lastname;
				}
			}
			else
			{
				$("[id='delete_web_event']").attr("id", "event_delete");
			}
			if (value.description)
			{
				var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
				$("#event_desc").html(description);
				$("textarea#description").val(value.description);
			}
			else
			{
				var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>' + '</div></div></div>'
				$("#event_desc").html(desc);
			}
			// Fills owner select element
			populateUsersInUpdateActivityModal(value);
        },

        complete_task : function(e){
        	var targetEl = $(e.currentTarget);

        	if ($(targetEl).is(':checked'))
			{
				var id = $(targetEl).attr('data');
				var that = targetEl;
				complete_task(id, tasksView.collection, undefined, function(data)
				{
					$(that).parent().siblings(".task-subject").css("text-decoration", "line-through");
					console.log($(that).parents('.activity-text-block').css("background-color", "#FFFAFA"));
					$(that).parent().replaceWith('<span style="margin-right:9px;"><i class="fa fa-check"></i></span>');
					tasksView.collection.add(data, { silent : true });
				});
			}
        },

        // For adding new deal from contact-details
        add_deal : function(e){
        		var targetEl = $(e.currentTarget);

        		var el = $("#opportunityForm");

        		if($('#color1', el).is(':hidden')){

			    	$('.colorPicker-picker', el).remove();

			    	$('#color1', el).colorPicker();
				}

				var colorcode = "#808080";
			    $('#color1' , el).attr('value', colorcode);
			    $('.colorPicker-picker', el).css("background-color", colorcode); 
			    // Disable color input field
			    $('.colorPicker-palette').find('input').attr('disabled', 'disabled');

				$("#opportunityModal").modal('show');

				add_custom_fields_to_form({}, function(data)
				{
					var el_custom_fields = show_custom_fields_helper(data["custom_fields"], [
						"modal"
					]);
					$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));

					$('.contact_input', el).each(function(){
						agile_type_ahead($(this).attr("id"), $('#custom_contact_'+$(this).attr("id"), el), contacts_typeahead, undefined, 'type=PERSON');
					});

					$('.company_input', el).each(function(){
						agile_type_ahead($(this).attr("id"), $('#custom_company_'+$(this).attr("id"), el), contacts_typeahead, undefined, 'type=COMPANY');
					});

				}, "DEAL");

				// Fills owner select element
				populateUsers("owners-list", el, undefined, undefined, function(data)
				{

					$("#opportunityForm").find("#owners-list").html(data);
					$("#owners-list", $("#opportunityForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
					$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
				});

				//Populate products
				populate_deal_products(el, undefined,"#opportunityForm");
				// Contacts type-ahead
				agile_type_ahead("relates_to", el, contacts_typeahead);

				// Fills the pipelines list in select box.
				populateTrackMilestones(el, undefined, undefined, function(pipelinesList)
				{
					console.log(pipelinesList);
					$.each(pipelinesList, function(index, pipe)
					{
						if (pipe.isDefault)
						{
							var val = pipe.id + '_';
							if (pipe.milestones.length > 0)
							{
								val += pipe.milestones.split(',')[0];
								$('#pipeline_milestone', el).val(val);
								$('#pipeline', el).val(pipe.id);
								$('#milestone', el).val(pipe.milestones.split(',')[0]);
							}

						}
					});
				});

				populateLostReasons(el, undefined);

				populateDealSources(el, undefined);

				// Enable the datepicker

				$('#close_date', el).datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY});


				var json = null;
				if(company_util.isCompany()){
					json = App_Companies.companyDetailView.model.toJSON();
				} else {
					json = App_Contacts.contactDetailView.model.toJSON();
				}
				var contact_name = getContactName(json);

				var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{id}}">{{name}}</li>');
  
			 	// Adds contact name to tags ul as li element
			 	$('.tags',el).html(template({name : contact_name, id : json.id}));
        },

       add_case : function(e){
       		var targetEl = $(e.currentTarget);

       		$("#casesModal").html(getTemplate("cases-new-modal", {}));
			var el = $("#casesForm");

			// Fills owner select element
			populateUsers("owners-list", el, undefined, undefined, function(data)
			{

				$("#casesForm").find("#owners-list").html(data);
				$("#owners-list", $("#casesForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
				// Contacts type-ahead
				agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);

				var json = null;
				if(company_util.isCompany()){
					json = App_Companies.companyDetailView.model.toJSON();
				} else {
					json = App_Contacts.contactDetailView.model.toJSON();
				}
				var contact_name = getContactName(json);

				var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{id}}">{{name}}</li>');
  
			 	// Adds contact name to tags ul as li element
			 	$('.tags',el).html(template({name : contact_name, id : json.id}));
				$("#casesModal").modal('show');
			});
       },

       add_contact : function(e){
       		// This is a hacky method. ( See jscore/contact-management/modals.js for
			// its use )
			// 'forceCompany' is a global variable. It is used to enforce Company
			// name on Add Contact modal.
			// Prevents user from removing this company from the modal that is
			// shown.
			// Disables typeahead, as it won't be needed as there will be no Company
			// input text box.
			var json = {};

			if(Current_Route.indexOf("company") > -1)
				 json = App_Companies.companyDetailView.model.toJSON();
			else 
				 json = App_Contacts.contactDetailView.model.toJSON();

			forceCompany.name = getContactName(json); // name of Company
			forceCompany.id = json.id; // id of Company
			forceCompany.doit = true; // yes force it. If this is false the
			// Company won't be forced.
			// Also after showing modal, it is set to false internally, so
			// Company is not forced otherwise.
			//$('#personModal').modal('show');
			$.ajax({
				url : 'core/api/custom-fields/scope?scope=CONTACT',
				type : 'GET',
				dataType : 'json',
				success : function(data){
					if(data.length > 0)
					{
						Backbone.history.navigate("contact-add" , {trigger: true});
						setTimeout(function(){ 
						$("#continueform").find("ul[name=contact_company_id]").html('<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="'+forceCompany.id+'"><span><a class="text-white m-r-xs" href="#contact/'+forceCompany.id+'">'+forceCompany.name+'</a><a class="close text-white" id="remove_tag">×</a></span></li>')
						}, 800);
					}
					else
						$("#personModal").modal("show");
				}
			});
       },

       add_document : function(e){

       		$('#uploadDocumentModal').html(getTemplate("upload-document-modal", {})).modal('show');
		
			var el = $("#uploadDocumentForm");
			// Contacts type-ahead
			agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

			// Deals type-ahead
			agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

			var json = null;
			if(company_util.isCompany()){
				json = App_Companies.companyDetailView.model.toJSON();
			} else {
				json = App_Contacts.contactDetailView.model.toJSON();
			}
			var contact_name = getContactName(json);
			var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{id}}">{{name}}</li>');
  
		 	// Adds contact name to tags ul as li element
		 	$('.tags',el).html(template({name : contact_name, id : json.id}));
		 },

       document_unlink : function(e){
       		var targetEl = $(e.currentTarget);

       		var id = $(targetEl).attr('data');
			var json = documentsView.collection.get(id).toJSON();

			// To get the contact id and converting into string
			var contact_id = "";
			
			if(company_util.isCompany())
				contact_id = App_Companies.companyDetailView.model.id + "";
			else
				contact_id = App_Contacts.contactDetailView.model.id + "";

			// Removes the contact id from related to contacts
			json.contact_ids.splice(json.contact_ids.indexOf(contact_id), 1);

			// Updates the document object and hides
			var newDocument = new Backbone.Model();
			newDocument.url = 'core/api/documents';
			newDocument.save(json, { success : function(data)
			{
				documentsView.collection.remove(json);
				documentsView.render(true);
			} });
       },

 		/*show_document_list : function(e){
       		var targetEl = $(e.currentTarget);
       		var el = $(targetEl).closest("div");
			$(targetEl).css("display", "none");
			el.find(".contact-document-select").css("display", "inline");
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
			fillSelect('document-select', 'core/api/documents', 'documents', function fillNew()
			{
				el.find("#document-select").append("<option value='new'>Add New Doc</option>");

			}, optionsTemplate, false, el);
	    },*/
	    navigate_to_edocument:function(e,type)
	    {
	    	var id="";
	    	if(type=="company")
	    	{
				json = App_Companies.companyDetailView.model.toJSON();
			} else 
			{
				json = App_Contacts.contactDetailView.model.toJSON();
			}
			
			
			Backbone.history.navigate("documents/"+type+"/" + json.id+ "/edoc",{trigger: true});	
	    },
	    navigate_to_edit_document:function(e,type)
	    {
	    	
	    	var document_id=$(e.currentTarget).attr("data");

	    	if(type=="company")
	    	{
				json = App_Companies.companyDetailView.model.toJSON();
			} else 
			{
				json = App_Contacts.contactDetailView.model.toJSON();
			}
			
			
			Backbone.history.navigate("documents/"+document_id+"/" + json.id,{trigger: true});	
	    },
       show_document_list : function(e){

       		var targetEl = $(e.currentTarget);
       		var el = $(targetEl).closest("div");
			$(targetEl).css("display", "none");
			//$(targetEl).previous().css("display", "none");
			$(".add-contact-edocument-select,.add-company-edocument-select",el).css("display", "none");
			if(agile_is_mobile_browser()){
			el.find(".contact-document-select").css("display", "block");
			}
			else {
			el.find(".contact-document-select").css("display", "inline");	
			}
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
			fillSelect('document-select', 'core/api/documents', 'documents', function fillNew()
			{
				el.find("#document-select > option:first").after("<option value='new'>Add New Doc</option><option style='font-size: 1pt; background-color: #EDF1F2;'disabled>&nbsp;</option>");
				el.find("#document-select > option:first").remove();

			}, optionsTemplate, false, el);
	    },


        add_selected_document : function(e,type){
       		var targetEl = $(e.currentTarget);

       		var document_id = $(targetEl).closest(".contact-document-select").find("#document-select").val();

			var saveBtn = $(targetEl);

			// To check whether the document is selected or not
			if (document_id == "")
			{
				saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>This field is required.</span>");
				saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
				return;
			}
			else if (document_id == "new")
			{
				
				var id="";
		    	if(type=="company")
		    	{
					json = App_Companies.companyDetailView.model.toJSON();
				} else 
				{
					json = App_Contacts.contactDetailView.model.toJSON();
				}
				Backbone.history.navigate("documents/"+type+"/" + json.id + "/attachment",{trigger: true});	        
				
				return;
				$('#uploadDocumentModal').html(getTemplate("upload-document-modal", {})).modal('show');
				var el = $("#uploadDocumentForm");
				
				// Contacts type-ahead
				agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

				// Deals type-ahead
				agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

				var json = null;
				if(company_util.isCompany())
				{
					json = App_Companies.companyDetailView.model.toJSON();
				}
				else 
				{
					json = App_Contacts.contactDetailView.model.toJSON();
				}
				var contact_name = getContactName(json);

				var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{id}}">{{name}}</li>');
	  
			 	// Adds contact name to tags ul as li element
			 	$('.tags',el).html(template({name : contact_name, id : json.id}));
			}
			else if (document_id != undefined && document_id != null)
			{
				if (!existingDocumentsView)
				{
					existingDocumentsView = new Base_Collection_View({ url : 'core/api/documents', restKey : "documents", });
					existingDocumentsView.collection.fetch({ success : function(data)
					{
						existing_document_attach(document_id, saveBtn);
					} });
				}
				else
					existing_document_attach(document_id, saveBtn);
			}
			$('#doc_type','#uploadDocumentUpdateModal,#uploadDocumentModal').attr("editor-loaded","no")	
			$('#uploadDocumentUpdateModal,#uploadDocumentModal').on('change', '#doc_type', function(e)
			{
				if($(this).val()=="SENDDOC")
				{

					if($(this).attr("editor-loaded")!="yes")
					{	
						$(this).attr("editor-loaded","yes"	)
						setupTinyMCEEditor('textarea#signdoc-template-html', false, undefined, function()
						{
							set_tinymce_content('signdoc-template-html', "");
							// Register focus
							register_focus_on_tinymce('signdoc-template-html');
							// Reset tinymce
						});		
						var optionsTemplate = "<option doc_type='SENDDOC' value='{{id}}'>{{name}}</option>";
						fillSelect('template_type', '/core/api/document/templates', 'documents', function fillNew(coll)
						{
						
						$('#template_type','#uploadDocumentUpdateModal,#uploadDocumentModal').get(0).document_templates=coll;
						
						//console.log(coll);

						}, optionsTemplate, false, el);
					
						$('#uploadDocumentUpdateModal,#uploadDocumentModal').on('change', '#template_type', function(e)
						{
								var template_id = $("#template_type option:selected").val();
								var sTemplateText="";
								$.each($(this).get(0).document_templates.toJSON(), function(index, model)
								{
									if(model.id==template_id)
									{
										var template;
										sTemplateText=model.text;
										var json = get_contact_json_for_merge_fields();
										try
										{
											template = Handlebars.compile(sTemplateText);
											sTemplateText = template(json);
										}
										catch (err)
										{
											sTemplateText = add_square_brackets_to_merge_fields(sTemplateText);

											template = Handlebars.compile(sTemplateText);
											sTemplateText = template(json);
										}
										return false;
									}
								});
								set_tinymce_content('signdoc-template-html', sTemplateText);
						});			
						$('#uploadDocumentUpdateModal,#uploadDocumentModal').on('click', '#document_send', function(e)
						{
								$("#signDocSendEmailModal").html(getTemplate("send-email-template")).modal('show');
						});			
					}

					$(".senddoc",'#uploadDocumentUpdateModal,#uploadDocumentModal').removeClass("hide ");
					$(".send-doc-button",'#uploadDocumentUpdateModal,#uploadDocumentModal').removeClass("hide ");
					$(".attachment",'#uploadDocumentUpdateModal,#uploadDocumentModal').addClass("hide");
					

				}	
				else
				{
					$(".senddoc",'#uploadDocumentUpdateModal,#uploadDocumentModal').addClass("hide ");
					$(".send-doc-button",'#uploadDocumentUpdateModal,#uploadDocumentModal').addClass("hide ");
					$(".attachment",'#uploadDocumentUpdateModal,#uploadDocumentModal').removeClass("hide");	
				}
			});	

		},
};


/**
 * To attach the document to a contact
 * 
 * @param document_id
 * @param saveBtn
 */
function existing_document_attach(document_id, saveBtn)
{
	var json = existingDocumentsView.collection.get(document_id).toJSON();

	// To get the contact id and converting into string
	var contact_id = null;
	
	if(company_util.isCompany()){
		contact_id = App_Companies.companyDetailView.model.id + "";
	} else {
		contact_id = App_Contacts.contactDetailView.model.id + "";
	}

	// Checks whether the selected document is already attached to that contact
	if ((json.contact_ids).indexOf(contact_id) < 0)
	{
		json.contact_ids.push(contact_id);
		saveDocument(null, null, saveBtn, false, json);
	}
	else
	{
		saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>Linked Already</span>");
		saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
		hideTransitionBar();
		return;
	}
}
