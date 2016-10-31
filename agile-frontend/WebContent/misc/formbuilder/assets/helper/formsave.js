define([
	'jquery', 'underscore', 'backbone', 'helper/pubsub'
], function($, _, Backbone, PubSub)
{
	return { agile_form_save : function(e){

		var target = $("#"+e.target.id);
		target.attr("disabled", "disabled");

		var url = window.location.protocol + '//' + window.location.host + '/' + 'core/api/forms';
		var form = {};
		form.formName = saveform[0].fields.name.value;
		form.formJson = saveform;
		
        var themeVal =$(".themesSelectEle option:selected").text();
    
		 
		 /*$.ajax({
			type : 'POST',
			url :  window.location.protocol + '//' + window.location.host + '/' + 'core/api/themes/getCustomThemeByName',
			async : false,
			contentType : 'application/json',
			data : themeVal,
			success: function(data){
				console.log("DATA COMING!!!"+data);
				if(!(data==""||data==undefined)){
				var style='<style id="custTheme'+data.id+'" type="text/css">'+data.themeCss+'</style>';
				$("#formContent .form-view").addClass("form"+data.id);
				$("#formContent").append(style);
				}
			},
			error: function(e){
				console.log("Theme not found!!"+e);
			}
		});*/

		if(themeVal!="Choose Theme"){
			 var custThmDiv = document.createElement("div");
			 custThmDiv.setAttribute("id","formContent");
			 $("body").append(custThmDiv);
			 $("#formContent").css("display","none");
			 $("#formContent").html($("#render").val());
			$.each( customthemes, function( index, value ) {
			if(value.name==themeVal){
				var style='<style id="custTheme'+value.id+'" type="text/css">'+value.themeCss+'</style>';
				$("#formContent .form-view").addClass("form"+value.id);
				$("#formContent").append(style);
				$("#render").val($("#formContent").html());
			}
		}); 
		}
		
		form.formHtml = $("#render").val();
		/*console.log("render val:::"+form.formHtml);*/
		if(formNumber){
			form.id = formNumber;
		}
		$.ajax({
			type : 'POST',
			url : url,
			async : true,
			contentType : 'application/json',
			data : JSON.stringify(form),
			success: function(){
				var url = window.location.origin + "/#forms";
				window.location.replace(url);
			},
			error: function(){
				alert("Form with this name is already saved, or this is an invalid form name. Please change form name and try again.");
				target.removeAttr("disabled");
			}});
	}}
});
