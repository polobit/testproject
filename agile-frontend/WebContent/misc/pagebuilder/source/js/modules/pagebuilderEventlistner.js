(function (){
    "use strict";

    var appUI = require('./ui.js').appUI;
   
    var customAgileEvents={

        agileformId: document.getElementById('agileform_id'),
        refreshFormList: document.querySelector('#refresh-formlist > .refresh-formlist'),
        lpInstructPopupId: document.getElementById('lp-instruct-popup'),

        init: function() {
            //events
            $(this.agileformId).on('change', this.chnageAgileform);
            $(this.refreshFormList).on('click', this.refreshFormsLists);  
            $(this.lpInstructPopupId).on('click', this.lpInstructPopup);           

        },

        refreshFormsLists : function(e) {
            $('#refresh-formlist .edit-form').hide();
            $.getJSON(appUI.siteUrl+"core/api/forms", function(respData){ 
                $("#agileform_id option:not(':first')").remove();              
                for(var i=0;i<respData.length;i++){
                    $('#agileform_id').append("<option value= "+ window.CURRENT_AGILE_DOMAIN +"_"+respData[i].id +">"+respData[i].formName+"</option>");
                }    
            });
        },
        chnageAgileform : function(e) {
            if($(e.target).val()!=="default"){
                var form_id=$("#agileform_id").val().split(window.CURRENT_AGILE_DOMAIN+"_")[1];
                $('#refresh-formlist .edit-form').attr("href",appUI.siteUrl+"formbuilder?form="+form_id);
                $('#refresh-formlist .edit-form').show();
            }
            else
                $('#refresh-formlist .edit-form').hide();
        },
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
            $('.imageFileTab').find('input#imageURL').val(thumbnail);
        },
        lpInstructPopup :function(){
            if($("#lp-instruct-popup").prop("checked"))            
                localStorage.setItem("lp-instruct-popup",true);
            else
                localStorage.removeItem("lp-instruct-popup",false);
        }
    };

    $(document).keyup(function(e) {
        if (e.keyCode === 27 && $("#styleEditor").css("left")=== "0px") 
            $("#styleEditor").css("left","-302px");           
    });
    $('.agile-tooltip').tooltip({
        container: 'body'
    });

    customAgileEvents.init();
    exports.customAgileEvents = customAgileEvents;

}());