(function (){
    "use strict";

    var appUI = require('./ui.js').appUI;
   
    var customAgileEvents={

        //craete thumbnail for vimeo
        createVimeoThumbnail :function(id, element){

            $.ajax({
                url: 'https://vimeo.com/api/v2/video/' + id + '.json',
                dataType: 'jsonp',
                success: function(data) {
                    //console.log("vimeo success");
                    customAgileEvents.addThumbnail(data[0].thumbnail_large,element);
                },
                error: function(data) {
                    console.log("vimeo error");
                }
            });
        },
        
        //craete thumbnail for youtube
        createYoutubeThumbnail :function (id,element) {
            customAgileEvents.addThumbnail("http://i2.ytimg.com/vi/" + id + "/maxresdefault.jpg",element);       
        },

        addThumbnail :function(thumbnail,element){
            $(element).siblings("IMG").attr("src",thumbnail);
        }
    };

    //tooltip for form and video
    $('.agile-tooltip').tooltip({
        container: 'body'
    });
    $('input#youtubeID').focus(function(){
        $('input#youtubeID').addClass("margin-bottom-20");
        $("#err-youtube-msg").next().css("margin-top","");
        $("#err-youtube-msg").hide();
    });
    $('input#vimeoID').focus(function(){
        $('input#vimeoID').addClass("margin-bottom-20");
        $("#err-vimeo-msg").next().css("margin-top","");
        $("#err-vimeo-msg").hide();
    });

    $(document).keyup(function(e) {
        if (e.keyCode === 27 && $("#styleEditor").css("left")=== "0px") 
            $("#styleEditor").css("left","-300px");           
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
     exports.customAgileEvents = customAgileEvents;

}());