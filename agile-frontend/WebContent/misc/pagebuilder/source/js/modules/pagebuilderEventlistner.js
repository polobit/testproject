(function (){
    "use strict";

    var appUI = require('./ui.js').appUI;
   
    //tooltip for form and video
    $('.agile-tooltip').tooltip({
        container: 'body'
    });

    //show edit form option when select any form
     $('#agileform_id').change(function(e){
     	if($(e.target).val()!=="default"){
     		var form_id=$("#agileform_id").val().split(window.CURRENT_AGILE_DOMAIN+"_")[1];
     		$('#refresh-formlist .edit-form').attr("href",appUI.siteUrl+"formbuilder?form="+form_id);
    		$('#refresh-formlist .edit-form').show();
    	}
    	else
    		$('#refresh-formlist .edit-form').hide();
    });

    //render latest form list click on refresh
    $('#refresh-formlist .refresh-formlist').click(function(){
    	
        $('#refresh-formlist .edit-form').hide();
        $.getJSON(appUI.siteUrl+"core/api/forms", function(respData){ 
            $("#agileform_id option:not(':first')").remove();              
            for(var i=0;i<respData.length;i++){
                $('#agileform_id').append("<option value= "+ window.CURRENT_AGILE_DOMAIN +"_"+respData[i].id +">"+respData[i].formName+"</option>");
            }    
        });
    });
    
    $('input#imageURL').focus(function(){
        $('input#imageURL').css("margin-bottom","");
        $("#error-img-msg").next().css("margin-top","");
        $("#error-img-msg").hide();
    });
}());