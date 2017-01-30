(function (){
    "use strict";

    var appUI = require('./ui.js').appUI;
    var styleEditor = require('./styleeditor.js');
   
    var customAgileEvents={

        agileformId: document.getElementById('agileform_id'),
        refreshFormList: document.querySelector('#refresh-formlist > .refresh-formlist'),
        lpInstructPopupId: document.getElementById('lp-instruct-popup'),
        chooseMediaMode: document.getElementsByClassName('choose-media-mode'),
        applyMediaOption: document.getElementById('apply-media'),

        init: function() {
            //events
            $(this.agileformId).on('change', this.chnageAgileform);
            $(this.refreshFormList).on('click', this.refreshFormsLists);  
            $(this.lpInstructPopupId).on('click', this.lpInstructPopup);
            $(this.chooseMediaMode).on('click', this.showchooseMediaModalPopup);  
            $(this.applyMediaOption).on('click', this.applyMediaType);         

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
        },
        showchooseMediaModalPopup : function(el){
            $('#chooseMediaModal').modal('show');
        },
        applyMediaType : function(el){
            //console.log(styleEditor.activeElement);
            $("#styleEditor").css("left","-305px");
            var mediaSelected= $('#choose-media-option').val();
            if($(styleEditor.styleeditor.activeElement.element).hasClass('frameCover')){
                $(styleEditor.styleeditor.activeElement.element).siblings().remove();
                $(styleEditor.styleeditor.activeElement.element).parent().removeClass('videoWrapper');
            }
            if(mediaSelected === "form"){
                window.current_agileform=null;
                var formel= $('<div class="choose-media-options" id="agileform_div"><img id= "agileform" src="https://agilecrm.s3.amazonaws.com/pagebuilder/static/images/lp-form-placeholder.png" class="img-responsive" /></div>  ');
                $(styleEditor.styleeditor.activeElement.element).replaceWith(formel);
                styleEditor.styleeditor.setupCanvasElements(styleEditor.styleeditor.activeElement.parentBlock);
            }
            else if (mediaSelected === "image"){
                var imgel= $('<img src="https://s3.amazonaws.com/agilecrm/pagebuilder/static/elements/images/image1.png"  class="img-responsive choose-media-options" /> ');
                $(styleEditor.styleeditor.activeElement.element).replaceWith(imgel);
                styleEditor.styleeditor.setupCanvasElements(styleEditor.styleeditor.activeElement.parentBlock);
           
            }
            else if (mediaSelected === "video"){
                var videoel=$('<div class="videoWrapper"><img data-video="" src="https://agilecrm.s3.amazonaws.com/pagebuilder/static/images/lp-video-thumb.jpg"  title="Play Video" class="video_placeholder img-responsive" /><div class="frameCover choose-media-options" data-type="video"></div><button class="video__button"></button></div>');
                $(styleEditor.styleeditor.activeElement.element).replaceWith(videoel);
                styleEditor.styleeditor.setupCanvasElements(styleEditor.styleeditor.activeElement.parentBlock);
               
            }

        }

    };

    $(document).keyup(function(e) {
        if (e.keyCode === 27 && $("#styleEditor").css("left")=== "0px") 
            $("#styleEditor").css("left","-305px");           
    });
    $('.agile-tooltip').tooltip({
        container: 'body'
    });

    customAgileEvents.init();
    exports.customAgileEvents = customAgileEvents;

}());