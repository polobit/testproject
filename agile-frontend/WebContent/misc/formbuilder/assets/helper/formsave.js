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
		/*var themeVal= $( "input:checked" ).val()*/;
		var themeVal=null;
		var themeDivArr=$(".themeDiv");
                    $.each(themeDivArr,function(index,value){
                      if($(this).find("i").hasClass("fa") &&
                      $(this).find("i").hasClass("fa-check")){
                      	themeVal=$(this).find(".themeEle").text();
                      }
                      
                     });
		
		 $("#formContent").html($("#render").val());
		 $("#formContent .form-view").addClass(themeVal);
		 console.log("Before::::"+$("#formContent .form-view"));
		 $.ajax({
			type : 'POST',
			url :  window.location.protocol + '//' + window.location.host + '/' + 'core/api/themes/getCustomThemeByName',
			async : false,
			contentType : 'application/json',
			data : themeVal,
			success: function(data){
				console.log("DATA COMING!!!"+data);
				if(!(data==""||data==undefined)){
				var style='<style id="'+data.name+data.id+'" type="text/css">'+data.themeCss+'</style>';
				$("#formContent").append(style);
				}
			},
			error: function(e){
				console.log("Theme not found!!"+e);
			}
		});

		$("#render").val($("#formContent").html());
		form.formHtml = $("#render").val();
		console.log("render val:::"+form.formHtml);
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
