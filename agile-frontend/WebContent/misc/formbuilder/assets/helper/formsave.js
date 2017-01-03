define([
	'jquery', 'underscore', 'backbone', 'helper/pubsub' , 'text!templates/app/save-nextaction.html'
], function($, _, Backbone, PubSub,NextActionPopUp)
{
	return { agile_form_save : function(e){

		var target = $("#"+e.target.id);
		target.attr("disabled", "disabled");

		var url = window.location.protocol + '//' + window.location.host + '/' + 'core/api/forms';
		form = {};
		form.formName = saveform[0].fields.name.value;
		form.formJson = saveform;
		
        var themeVal =$(".themesSelectEle option:selected").val();
    
		if(themeVal){
			 var custThmDiv = document.createElement("div");
			 custThmDiv.setAttribute("id","formContent");
			 $("body").append(custThmDiv);
			 $("#formContent").css("display","none");
			 $("#formContent").html($("#render").val());
			 var renderformArr = $("#formContent .form-view").attr("class").split(" ");
			 $.each(renderformArr,function(index,value){
			 	if(value != "form-view"){
			 		$("#formContent .form-view").removeClass(value);
			 	}
			 });
			 var styleArr = $("#formContent").find("style");
			 $.each(styleArr,function(index,value){
			 	if(value.id && value.id.indexOf("custTheme")>-1)
			 		$("#"+value.id).remove();
			});
			 var hasTemplateTheme =false;
			 var defaultThemes = ["theme1","theme2","theme3","theme4"];
				 $.each(defaultThemes,function(index,value){
				 	if(value==themeVal){
				 		$("#formContent .form-view").addClass(value);
						hasTemplateTheme = true;
				 		return;
				 	}
				 });
			if(hasTemplateTheme ==false){
				$.each( customthemes, function( index, value ) {
					if(value.name==themeVal){
						var style='<style id="custTheme'+value.id+'" type="text/css">'+value.themeCss+'</style>';
						$("#formContent .form-view").addClass("form"+value.id);
						$("#formContent").append(style);
					}
			    });
			} 
			$("#render").val($("#formContent").html());    
		}
		
		form.formHtml = $("#render").val();
		$("#formContent").remove();
		if(formNumber){
			//form.id = formNumber;
			//window link contains copy text then treat it as new form else old form
			if(!isCopyForm){
				form.id = formNumber;
			}
			else{
				formNumber = null;
			}
		}
		$("#form-save").text("Saving...");
		$("#top-right-items").attr("class","open");
		$.ajax({
			type : 'POST',
			url : url,
			async : true,
			contentType : 'application/json',
			data : JSON.stringify(form),
			success: function(data){
				if(data != null){
					
					$("#form-save").text("Save");
					target.removeAttr("disabled");
					$("#form_preview").removeAttr("disabled");
					if(!formNumber){
						//If no form Number
						formNumber = data.id;
						isCopyForm = false;
						$("#form-copy-dropdown").css("display","block");
						$("#copy-formbuilder").attr("href",window.location.origin+"/formbuilder?form="+formNumber+"&copy=1");
						if(window.history)
							window.history.replaceState(null,null,window.location.origin+"/formbuilder?form="+formNumber);
					}
					$("#form_preview").attr("href",window.location.origin+"/forms/"+formNumber);
					
					if(localStorage.getItem("form-save-popup") == null || localStorage.getItem("form-save-popup") == "false"){
						var embedbaselink;
						if(window.location.hostname.indexOf(".")>0){
							embedbaselink = window.location.hostname.substr(0,window.location.hostname.indexOf("."));
						}
						else{
							embedbaselink = window.location.hostname;
						}
	
						var form_perm_link = window.location.origin + "/forms/"+data.id;
						var encodedLink=encodeURIComponent(form_perm_link);
						var next_action_popup = _.template(NextActionPopUp)({"permanentlink" : form_perm_link,
						"embed_formid" : embedbaselink+"_"+data.id,
						"form_fb_link" : 'https://www.facebook.com/sharer.php?u='+encodedLink+'?usp=fb_send_fb&t='+data.formName,
						"form_tweet_link" : 'https://twitter.com/intent/tweet?url='+form_perm_link+'?usp=fb_send_twt&text='+data.formName,
						"form_google_link" : 'https://plus.google.com/share?url='+encodedLink+'?usp=fb_send_gp',
						"form_analytics" : window.location.origin+'/#api-analytics',
						"form_name" : data.formName
						});

						$("#form_preview").attr("href",form_perm_link);

						var $formNextActionModal = $("#formNextActionModal");
						$("#header").css("z-index","0");
						$formNextActionModal.html(next_action_popup).modal("show");
						$('#success-msg').fadeIn('slow').delay(2000).fadeOut('slow');
					}
					$(".popover").remove();
				}
				isFormChange = false;
			},
			error: function(){
				alert("Form with this name is already saved, or this is an invalid form name. Please change form name and try again.");
				target.removeAttr("disabled");
				$("#form-save").text("Save");
					
			}});
	}}
});
 var hideFormNextActionPopup =function(){
 	if($("#form-save-popup").prop("checked"))
        localStorage.setItem("form-save-popup", true);
    else
        localStorage.setItem("form-save-popup", false);
 }
  var nextActionCloseClick = function(){
 	$("#header").css("z-index","2001");
 }

