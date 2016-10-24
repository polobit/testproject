define([
		'jquery', 'underscore', 'backbone', 'helper/pubsub', 'collections/my-form-snippets', 'views/my-form'], function($, _, Backbone, PubSub, MyFormSnippetsCollection, MyFormView)
{
	return { agile_form_load : function()
	{
		var url = window.location.protocol + '//' + window.location.host + '/' + 'core/api/forms/form?formId=' + formNumber;
		console.log("customthemes in formload page::"+customthemes);
		$.ajax({
			url : url,
			type: 'GET',
			dataType: 'json',
			success: function(data){
				saveform = JSON.parse(data.formJson);
				var agilethemeObj=saveform[0].fields.agiletheme;
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
				}
				
				 var custThmDiv = document.createElement("div");
				 custThmDiv.setAttribute("id","formContent");
				 $("body").append(custThmDiv);
				 $("#formContent").html(data.formHtml);
				 formClasses=$("#formContent .form-view").attr("class");
				 $("#formContent").remove();
				 $.each(customthemes,function(index,value){
                      /*if(formClasses.indexOf(value.name)>-1){*/
                      	if(formClasses.indexOf("form"+value.id)>-1){
                      	/*$(document.getElementById("target")).addClass(value.name);*/
                      		$(document.getElementById("target")).addClass("form"+value.id);
                            $(document.getElementById("agileCustTheme")).text(value.themeCss);
                      }
                     });
				/*$("#formContent").html(data.formHtml);
				formClasses=$("#formContent .form-view").attr("class");
				console.log("formClassesList:::"+formClasses);
				$("#formContent .form-view").remove();*/

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
					$.getJSON( "/core/api/custom-fields", function(fields) {

					for ( var j = 0; j < saveform.length; j++){

							if(saveform[j].fields.agilefield){							
							
							var field = saveform[j].fields.agilefield.value;
							
							var agileFields = field.slice(0,15);
														
							if(field.length>15){
								for(var k=field.length-1; k>=15; k--){
									if(field[k].selected)
										agileFields.push(field[k]);
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
								if(count == 0)
								agileFields.push(value);
						    }
						}
						saveform[j].fields.agilefield.value = agileFields;
					}else{
						for ( var i = 0; i < saveform.length; i++){
							
							if(saveform[i].fields.agilefield){		
							var field = saveform[i].fields.agilefield.value;							
							if(field.length>15){
								for(var j=field.length; j>15; j--)
									field.pop(field[j]);								
							}
						}
					}
				}
			}
		}
					$('#form-label').text('Edit Form');
					new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(saveform) });				
				});
				}
				
			}
		});
	}}
});