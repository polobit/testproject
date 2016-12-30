define([
		'jquery', 'underscore', 'backbone', 'helper/pubsub', 'collections/my-form-snippets', 'views/my-form'], function($, _, Backbone, PubSub, MyFormSnippetsCollection, MyFormView)
{
	return { agile_form_load : function(fields)
	{
		var url = window.location.protocol + '//' + window.location.host + '/' + 'core/api/forms/form?formId=' + formNumber;
		var orderedSaveform=[];
		$.ajax({
			url : url,
			type: 'GET',
			dataType: 'json',
			success: function(data){
				saveform = JSON.parse(data.formJson);
				
				/*var agilethemeObj=saveform[0].fields.agiletheme;
				var themeClassName="";
				if(agilethemeObj!=undefined || agilethemeObj!=null){
					var agilethemeObjValArr=agilethemeObj.value;
					for(i=0;i<agilethemeObjValArr.length;i++){
						if(agilethemeObjValArr[i].selected){
						     themeClassName=agilethemeObjValArr[i].value;
						     $("#target").addClass(themeClassName);
						     break;
						}
					}
				}*/
				
				 var custThmDiv = document.createElement("div");
				 custThmDiv.setAttribute("id","formContent");
				 $("body").append(custThmDiv);
				 $("#formContent").html(data.formHtml);
				 formClasses=$("#formContent .form-view").attr("class");
				 $("#formContent").remove();
				 var hasTemplateTheme =false;
				 var themeExist = false;
				 $.each(defaultThemes,function(index,value){
				 	if(formClasses.indexOf(value)>-1){
				 		currApplThm=value;
				 		$(document.getElementById("target")).addClass(value);
                        $(".themesSelectEle").val(currApplThm);
                        hasTemplateTheme = true;
                        themeExist = true;
				 		return;
				 	}
				 });
				 if(hasTemplateTheme ==false){
				 $.each(customthemes,function(index,value){
                       	if(formClasses.indexOf("form"+value.id)>-1){
                      		currApplThm=value.name;
                      		$(document.getElementById("target")).addClass("form"+value.id);
                            $(document.getElementById("agileCustTheme")).text(value.themeCss);
                      		$(".themesSelectEle").val(currApplThm);
                      		themeExist = true;
                      		return;
                        }
                     });
				} 
				if(themeExist == false){
					$(".themesSelectEle").val("Choose Theme");
				}
				//Loads form view in form.jsp page
				if($('#agileFormHolder').length != 0) {
					$('#form-label').text('Edit Form');
					new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(saveform) });
					var formHtml = $("#render").val();
			    	  if(formHtml != '') {
			    		  $('#agileFormHolder').html(formHtml);
			    		 
							if(typeof data.formHtml == "undefined" || data.formHtml == "") {
			    		  	data.formHtml = formHtml;
			    		  	try{window.parent.updateAgileFormDB(data);}catch(err){}
			    		  }
			    	  }
				} else {
					if(fields) {
						//Adding on top
						if(isCopyForm){
							saveform[0].fields.name.value = "Copy Of "+ saveform[0].fields.name.value;
					    }
						if(!saveform[0].fields.agileconfirmationmsg){
							var agileconfirmationmsg = {};
							agileconfirmationmsg.label = "Confirmation Message";
							agileconfirmationmsg.type = "input";
							agileconfirmationmsg.value = "Great! Thanks for filling out the form.";
							saveform[0].fields.agileconfirmationmsg=agileconfirmationmsg;
						}

						if(saveform[0].fields.agileapi){
								saveform[0].fields.agileapi.label="";
						}
						if(saveform[0].fields.agiledomain){
								saveform[0].fields.agiledomain.label="";
						}
						//Adding on top
						for ( var j = 0; j < saveform.length; j++){

							if(saveform[j].title=="Text Area"){
								if(saveform[j].fields.placeholder==undefined){
									var placeholder={
										"label": "Placeholder",
                						"type": "input",
                						"value": ""
									};
									saveform[j].fields.placeholder=placeholder;
								}
								if(saveform[j].fields.textarea){
									saveform[j].fields.textarea=null;
								}
							}

							if(saveform[j].fields.agilefield){							
							
								var field = saveform[j].fields.agilefield.value;
								if(saveform[j].title != "Hidden Input"){
									var agileFields = field.slice(0,15);
															
									if(field.length>15){
										for(var k=field.length-1; k>=15; k--){
											if(field[k].selected)
												agileFields.push(field[k]);
										}
									}
						    	}
						    	else if(saveform[j].title == "Hidden Input"){
						    		var agileFields=field.slice(0,1);

						    		if(field.length>0){
										for(var k=1; k<field.length; k++){
											if(field[k].selected)
												agileFields.push(field[k]);
										}
									}
						    	}	

								if(fields.length != 0)
								{ 
									for ( var i = 0; i < fields.length; i++)
									{

										if(fields[i].field_type == "TEXT" || fields[i].field_type == "TEXTAREA" || fields[i].field_type == "LIST"){
											var value = {};
											value.value = fields[i].field_label;
											value.label = fields[i].field_label;
											value.selected = false;
											var count = 0;
											for(var k=agileFields.length-1; k>=15; k--){
												if(value.label == agileFields[k].label)
													count++;								
											}
								
											if(saveform[j].title == "Hidden Input"){
												for(var k = 1;k < agileFields.length;k++){
													if(value.label == agileFields[k].label)
														count++;	
							    				}
											}
											if(count == 0)
												agileFields.push(value);
						    			}

									}
									saveform[j].fields.agilefield.value = agileFields;
					
								}
							}
							saveFormOrdering(j,orderedSaveform,saveform);
						}

					/*if(!saveform[0].fields.agileconfirmationmsg){
							var agileconfirmationmsg = {};
							agileconfirmationmsg.label = "Confirmation Message";
							agileconfirmationmsg.type = "input";
							agileconfirmationmsg.value = "Great! Thanks for filling out the form.";
							saveform[0].fields.agileconfirmationmsg=agileconfirmationmsg;
					}

					if(saveform[0].fields.agileapi){
							saveform[0].fields.agileapi.label="";
					}
					if(saveform[0].fields.agiledomain){
							saveform[0].fields.agiledomain.label="";
					}*/
					saveform = orderedSaveform;
					$('#form-label').text('Edit Form');
					new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(saveform) });				
		}
				}
				$("#loader").fadeOut('fast');
				$("#header").css("display","block");
				$(".container").css("display","block");
			}
		});

	}}

	function saveFormOrdering(i,orderedSaveform,saveform){
		if(i==0){
			orderedSaveform[0]={};
			orderedSaveform[0].title = saveform[0].title;
			orderedSaveform[0].fields = {};
			orderedSaveform[0].fields["name"] = saveform[0].fields["name"]; 
			orderedSaveform[0].fields["agileredirecturl"] = saveform[0].fields["agileredirecturl"];
			orderedSaveform[0].fields["agileconfirmationmsg"] = saveform[0].fields["agileconfirmationmsg"];
			orderedSaveform[0].fields["agilepreloadfields"] = saveform[0].fields["agilepreloadfields"];
			orderedSaveform[0].fields["agileformidtag"] = saveform[0].fields["agileformidtag"];
			orderedSaveform[0].fields["formemailnotification"] = saveform[0].fields["formemailnotification"];
			orderedSaveform[0].fields["agileformcaptcha"] = saveform[0].fields["agileformcaptcha"];
			orderedSaveform[0].fields["agiletransparentbackground"] = saveform[0].fields["agiletransparentbackground"];
			orderedSaveform[0].fields["agiletheme"] = saveform[0].fields["agiletheme"];
			orderedSaveform[0].fields["agileapi"] = saveform[0].fields["agileapi"];
			orderedSaveform[0].fields["agiledomain"] = saveform[0].fields["agiledomain"];
	    }
		else{
			if(saveform[i].title == "Text Input" || saveform[i].title == "Password Input" || saveform[i].title.includes("Text") || saveform[i].title == "Appended Checkbox" || saveform[i].title == "Prepended Checkbox" || saveform.title == "TextArea"){
				orderedSaveform[i]={};
				orderedSaveform[i].title = saveform[i].title;
				orderedSaveform[i].fields = {};
				orderedSaveform[i].fields["id"] = saveform[i].fields["id"];
				orderedSaveform[i].fields["label"]  = saveform[i].fields["label"];
				if(saveform[i].fields["prepend"]!=null){
					orderedSaveform[i].fields["prepend"] = saveform[i].fields["prepend"];
				
				}
				else if(saveform[i].fields["append"]!=null){
					orderedSaveform[i].fields["append"] = saveform[i].fields["append"];
				}
				orderedSaveform[i].fields["placeholder"]  = saveform[i].fields["placeholder"];
				orderedSaveform[i].fields["inputheight"]  = saveform[i].fields["inputheight"];
				orderedSaveform[i].fields["inputsize"]  = saveform[i].fields["inputsize"];
				orderedSaveform[i].fields["agilefield"]  = saveform[i].fields["agilefield"];
				if(saveform[i].fields["checked"]!=null){
					orderedSaveform[i].fields["checked"] = saveform[i].fields["checked"];
				}
				orderedSaveform[i].fields["required"]  = saveform[i].fields["required"];
			}
			else if(saveform[i].title == "Hidden Input"){
				orderedSaveform[i]={};
				orderedSaveform[i].title = saveform[i].title;
				orderedSaveform[i].fields = {};
				orderedSaveform[i].fields["id"] = saveform[i].fields["id"];
				orderedSaveform[i].fields["label"] = saveform[i].fields["label"];
				orderedSaveform[i].fields["placeholder"] = null;
				orderedSaveform[i].fields["required"] = null;
				orderedSaveform[i].fields["inputtype"] = saveform[i].fields["inputtype"];
				orderedSaveform[i].fields["inputvalue"] = saveform[i].fields["inputvalue"];
				orderedSaveform[i].fields["inputheight"] = null;
				orderedSaveform[i].fields["inputsize"] = null;
				orderedSaveform[i].fields["agilefield"] = saveform[i].fields["agilefield"];
			}
			else if(saveform[i].title.includes("Select")){
				orderedSaveform[i]={};
				orderedSaveform[i].title = saveform[i].title;
				orderedSaveform[i].fields = {};
				orderedSaveform[i].fields["id"] = saveform[i].fields["id"];
				orderedSaveform[i].fields["label"] = saveform[i].fields["label"];
				orderedSaveform[i].fields["options"] = saveform[i].fields["options"];
				orderedSaveform[i].fields["inputheight"] = saveform[i].fields["inputheight"];
				orderedSaveform[i].fields["inputsize"] = saveform[i].fields["inputsize"];
				orderedSaveform[i].fields["agilefield"] = saveform[i].fields["agilefield"];
				orderedSaveform[i].fields["required"] = saveform[i].fields["required"];
			}
			else if(saveform[i].title.includes("Radios") || saveform[i].title.includes("Checkboxes")){
				orderedSaveform[i]={};
				orderedSaveform[i].title = saveform[i].title;
				orderedSaveform[i].fields = {};
				orderedSaveform[i].fields["name"] = saveform[i].fields["name"];
				orderedSaveform[i].fields["label"] = saveform[i].fields["label"];
				if(saveform[i].fields["radios"]!=null){
					orderedSaveform[i].fields["radios"] = saveform[i].fields["radios"];
					
				}else if(saveform[i].fields["checkboxes"]!=null){
					orderedSaveform[i].fields["checkboxes"] = saveform[i].fields["checkboxes"];
				}
				orderedSaveform[i].fields["agilefield"] = saveform[i].fields["agilefield"];
			}
			else if(saveform[i].title.includes("Button")){
				orderedSaveform[i] = saveform[i];
			}
		}	
	}

});

