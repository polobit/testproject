/*global  _AGILE_LOCALE_JSON*/
(function (){
    "use strict";

    var canvasElement = require('./canvasElement.js').Element;
    var bConfig = require('./config.js');
    var siteBuilder = require('./builder.js');
    var publisher = require('../vendor/publisher');
    var customAgileEvents = require('./pagebuilderEventlistner.js').customAgileEvents;
    
    var styleeditor = {

        buttonSaveChanges: document.getElementById('saveStyling'),
        activeElement: {}, //holds the element currenty being edited
        allStyleItemsOnCanvas: [],
        _oldIcon: [],
        _oldForm:[],
        preForm_id:[],
        styleEditor: document.getElementById('styleEditor'),
        formStyle: document.getElementById('stylingForm'),
        buttonRemoveElement: document.getElementById('deleteElementConfirm'),
        buttonCloneElement: document.getElementById('cloneElementButton'),
        buttonResetElement: document.getElementById('resetStyleButton'),
        selectLinksInernal: document.getElementById('internalLinksDropdown'),
        selectLinksPages: document.getElementById('pageLinksDropdown'),
        videoInputYoutube: document.getElementById('youtubeID'),
        videoInputVimeo: document.getElementById('vimeoID'),
        imageInputURL: document.getElementById('imageURL'),
        inputCustomLink: document.getElementById('internalLinksCustom'),
        linkImage: null,
        linkIcon: null,
        inputLinkText: document.getElementById('linkText'),
        selectIcons: document.getElementById('icons'),
        buttonDetailsAppliedHide: document.getElementById('detailsAppliedMessageHide'),
        buttonCloseStyleEditor: document.querySelector('#styleEditor > a.close'),
        ulPageList: document.getElementById('pageList'),
        responsiveToggle: document.getElementById('responsiveToggle'),
        theScreen: document.getElementById('screen'),
        prevFocus:null,

        init: function() {

            publisher.subscribe('closeStyleEditor', function () {
                styleeditor.closeStyleEditor();
            });

            publisher.subscribe('onBlockLoaded', function (block) {
                //hide lhs popup when click on ESC
                $(block.frameDocument).keyup(function(e) {
                    if (e.keyCode === 27 && $("#styleEditor").css("left")=== "0px") 
                        $("#styleEditor").css("left","-302px");           
                });
                styleeditor.setupCanvasElements(block);
            });

            publisher.subscribe('onSetMode', function (mode) {
                styleeditor.responsiveModeChange(mode);
            });

            //events
            $(this.buttonSaveChanges).on('click', this.updateStyling);
            $(this.formStyle).on('focus', 'input', this.animateStyleInputIn).on('blur', 'input', this.animateStyleInputOut);
            $(this.buttonRemoveElement).on('click', this.deleteElement);
            $(this.buttonCloneElement).on('click', this.cloneElement);
            $(this.buttonResetElement).on('click', this.resetElement);
            $(this.videoInputYoutube).on('focus',this.focusOnInputYoutube);
            $(this.videoInputVimeo).on('focus',this.focusOnInputVimeo);
            $(this.imageInputURL).on('focus',this.focusImageInputURL);            
            $(this.inputCustomLink).on('focus', this.resetSelectAllLinks);
            $(this.buttonDetailsAppliedHide).on('click', function(){$(this).parent().fadeOut(500);});
            $(this.buttonCloseStyleEditor).on('click', this.closeStyleEditor);
            $(this.inputCustomLink).on('focus', this.inputCustomLinkFocus).on('blur', this.inputCustomLinkBlur);
            $(document).on('modeContent modeBlocks', 'body', this.deActivateMode);

            //chosen font-awesome dropdown
            $(this.selectIcons).chosen({'search_contains': true});

            //check if formData is supported
            if (!window.FormData){
                this.hideFileUploads();
            }

            //listen for the beforeSave event
            $('body').on('beforeSave', this.closeStyleEditor);

            //responsive toggle
            $(this.responsiveToggle).on('click', 'a', this.toggleResponsiveClick);

            //set the default responsive mode
            siteBuilder.builderUI.currentResponsiveMode = Object.keys(bConfig.responsiveModes)[0];

        },

        /*
            Event handler for responsive mode links
        */
        toggleResponsiveClick: function (e) {

            e.preventDefault();
            
            styleeditor.responsiveModeChange(this.getAttribute('data-responsive'));

        },


        /*
            Toggles the responsive mode
        */
        responsiveModeChange: function (mode) {

            var links,
                i;

            //UI stuff
            links = styleeditor.responsiveToggle.querySelectorAll('li');

            for ( i = 0; i < links.length; i++ ) links[i].classList.remove('active');

            document.querySelector('a[data-responsive="' + mode + '"]').parentNode.classList.add('active');


            for ( var key in bConfig.responsiveModes ) {

                if ( bConfig.responsiveModes.hasOwnProperty(key) ) this.theScreen.classList.remove(key);

            }

            if ( bConfig.responsiveModes[mode] ) {

                this.theScreen.classList.add(mode);
                $(this.theScreen).animate({width: bConfig.responsiveModes[mode]}, 650, function () {
                    //height adjustment
                    siteBuilder.site.activePage.heightAdjustment();
                });

            }

            siteBuilder.builderUI.currentResponsiveMode = mode;

        },


        /*
            Activates style editor mode
        */
        setupCanvasElements: function(block) {

            if ( block === undefined ) return false;

            //render agileform latest code
            if(!window.current_agileform && block.frame.hasAttribute('data-originalurl') && (block.frame.getAttribute('data-originalurl').includes("agileform") || block.frame.getAttribute('data-originalurl').includes("header10")))
            {    var agileform_class=$(block.frame.contentWindow.document).find('.agile_crm_form_embed');
                if(agileform_class.size()!==0)
                    styleeditor.loadAgileCRMFormInLandingPage(agileform_class.attr("id")); 
            } 

            var i;           
            //create an object for every editable element on the canvas and setup it's events

            for( var key in bConfig.editableItems ) {

                $(block.frame).contents().find( bConfig.pageContainer + ' '+ key ).each(function () {

                    styleeditor.setupCanvasElementsOnElement(this, key);

                });

            }

        },


        /*
            Sets up canvas elements on element
        */
        setupCanvasElementsOnElement: function (element, key) {

            if(key==='img' && element.id !==null && element.id==='agileform')
                return;
                         
            //Element object extention
            canvasElement.prototype.clickHandler = function(el) {
               if(el.dataset.selector==='.bg.bg1, .bg.bg2, .header10, .header11, .search-box1' && el.getElementsByClassName("editContent").length!==0){
                    $.each(el.getElementsByClassName("editContent"),function( i ){
                        if(el.getElementsByClassName("editContent")[i].style.cursor==="pointer"){
                           el.style.cursor="" ;
                           el.style.outline="";
                        }
                        else {
                           el.style.cursor="pointer" ;
                           el.style.outline="rgba(233, 94, 94, 0.498039) solid 2px";
                        }
                    });
                }
                if(el.style.cursor === "pointer") {                  
                   styleeditor.styleClick(this);
                    if($(el).attr('data-selector').indexOf(".editContent")!==-1)
                        styleeditor.prevFocus = el;
                }
            };

            var newElement = new canvasElement(element);

            newElement.editableAttributes = bConfig.editableItems[key];
            newElement.setParentBlock();
            newElement.activate();

            styleeditor.allStyleItemsOnCanvas.push( newElement );

            if ( typeof key !== undefined ) $(element).attr('data-selector', key);

        },


        /*
            Event handler for when the style editor is envoked on an item
        */
        styleClick: function(element) {

            //if we have an active element, make it unactive
            if( Object.keys(this.activeElement).length !== 0) {
                this.activeElement.activate();
            }

            //set the active element
            this.activeElement = element;

            //unbind hover and click events and make this item active
            this.activeElement.setOpen();

            var theSelector = $(this.activeElement.element).attr('data-selector');

            $('#editingElement').text( theSelector );

            if($(this.activeElement.element).parent().attr("id")=== 'agileform_div' || $(this.activeElement.element).attr("id") === 'agileform_div')
                $('#editingElement').text("Agile Form");

            if(!$('#tab1').hasClass("active")){                
                $('.agileFormTab').removeClass("active");
                $('.videoTab').removeClass("active");
                $('a#default-tab1').css('display','');  
                $('#tab1').addClass("active");
            }

            //activate first tab
            $('#detailTabs a:first').click();

            //hide all by default
            $('ul#detailTabs li:gt(0)').hide();

            //content editor?
            for( var item in bConfig.editableItems ) {

                if( bConfig.editableItems.hasOwnProperty(item) && item === theSelector ) {

                    if ( bConfig.editableItems[item].indexOf('content') !== -1 ) {

                        //edit content
                        publisher.publish('onClickContent', element.element);

                    }

                }

            }

            //what are we dealing with?
            if( $(this.activeElement.element).prop('tagName') === 'A' || $(this.activeElement.element).parent().prop('tagName') === 'A' ) {

                this.editLink(this.activeElement.element);

            }

            if( $(this.activeElement.element).prop('tagName') === 'IMG' ){

                if($(this.activeElement.element).parent().attr("id")=== 'agileform_div')
                    this.editAgileForm(this.activeElement.element);
                else
                    this.editImage(this.activeElement.element);

            }

            if($(this.activeElement.element).attr("id")=== "agileform_div"){
                this.editAgileForm(this.activeElement.element);
            }

            if( $(this.activeElement.element).attr('data-type') === 'video' ) {

                this.editVideo(this.activeElement.element);
                this.editImage(this.activeElement.element);

            }

            if( $(this.activeElement.element).hasClass('fa') ) {

                this.editIcon(this.activeElement.element);

            }

            //load the attributes
            this.buildeStyleElements(theSelector);

            //open side panel
            this.toggleSidePanel('open');

            var $currentClickedEl = $(this.activeElement.element);
            if($currentClickedEl.hasClass("agile-dynamic-text")){
                $('[name="dynamic-text"]').val("yes");
                $('[name="dynamic-text"]').trigger("change");
            }
            if($currentClickedEl.hasClass("agile-dynamic-button")){
                $('[name="dynamic-button"]').val("yes");
                $('[name="dynamic-button"]').trigger("change");
            }
            if($currentClickedEl.hasClass("agile-dynamic-image")){
                $('[name="dynamic-image"]').val("yes");
                $('[name="dynamic-image"]').trigger("change");
            }
            if($currentClickedEl.hasClass("navbar-fixed-top")){
                $('[name="fixed-header"]').val("yes");
                $('[name="fixed-header"]').trigger("change");
            }
            if($currentClickedEl.parent().find('.video__button').css("display")!=="none"){
                $('[name="show-video-icon"]').val("yes");
                $('[name="show-video-icon"]').trigger("change");
            }

            return false;

        },


        /*
            dynamically generates the form fields for editing an elements style attributes
        */
        buildeStyleElements: function(theSelector) {

            //delete the old ones first
            $('#styleElements > *:not(#styleElTemplate)').each(function(){

                $(this).remove();

            });

            for( var x=0; x<bConfig.editableItems[theSelector].length; x++ ) {

                //create style elements
                var newStyleEl = $('#styleElTemplate').clone();
                newStyleEl.attr('id', '');
                newStyleEl.find('.control-label').text( bConfig.editableItems[theSelector][x]+":" );
                if( theSelector + " : " + bConfig.editableItems[theSelector][x] in bConfig.editableItemOptions) {//we've got a dropdown instead of open text input

                    newStyleEl.find('input').remove();

                    var newDropDown = $('<select class="form-control select select-primary btn-block select-sm"></select>');
                    newDropDown.attr('name', bConfig.editableItems[theSelector][x]);


                    for( var z=0; z<bConfig.editableItemOptions[ theSelector+" : "+bConfig.editableItems[theSelector][x] ].length; z++ ) {

                        var newOption = $('<option value="'+bConfig.editableItemOptions[theSelector+" : "+bConfig.editableItems[theSelector][x]][z]+'">'+bConfig.editableItemOptions[theSelector+" : "+bConfig.editableItems[theSelector][x]][z]+'</option>');


                        if( bConfig.editableItemOptions[theSelector+" : "+bConfig.editableItems[theSelector][x]][z] === $(styleeditor.activeElement.element).css( bConfig.editableItems[theSelector][x] ) ) {
                            //current value, marked as selected
                            newOption.attr('selected', 'true');

                        }

                        newDropDown.append( newOption );

                    }

                    newStyleEl.append( newDropDown );
                    newDropDown.select2();

                } else {

                    newStyleEl.find('input').val( $(styleeditor.activeElement.element).css( bConfig.editableItems[theSelector][x] ) ).attr('name', bConfig.editableItems[theSelector][x]);

                    if( bConfig.editableItems[theSelector][x] === 'background-image' ) {

                        newStyleEl.find('input').off('click');
                        newStyleEl.find('input').on('click', function(event){
                             var theInput = $(this);
                            $('#imageModal').modal('show');
                            $('#imageModal .image button.useImage').unbind('click');
                        
                            //console.log("hi");
                        });                                             


                    } else if( bConfig.editableItems[theSelector][x].indexOf("color") > -1 ) {

                        if( bConfig.editableItems[theSelector][x] === 'background-color' )
                            $(newStyleEl).css('margin-top','15px');

                        if( $(styleeditor.activeElement.element).css( bConfig.editableItems[theSelector][x] ) !== 'transparent' && $(styleeditor.activeElement.element).css( bConfig.editableItems[theSelector][x] ) !== 'none' && $(styleeditor.activeElement.element).css( bConfig.editableItems[theSelector][x] ) !== '' ) {

                            newStyleEl.val( $(styleeditor.activeElement.element).css( bConfig.editableItems[theSelector][x] ) );

                        }

                        newStyleEl.find('input').spectrum({
                            preferredFormat: "hex",
                            showPalette: true,
                            allowEmpty: true,
                            showInput: true,
                            palette: [
                                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
                            ]
                        });

                    }

                }

                if(newStyleEl.find('input').attr("name")==="content")
                    newStyleEl.css('display', 'none');
                else 
                    newStyleEl.css('display', 'block'); 

                $('#styleElements').append( newStyleEl );
                if(bConfig.editableItems[theSelector][x] === 'background-image'){
                    //add remove icon in background image
                    var removeIcon=styleeditor.addRemoveIcon(newStyleEl);
                    $('#styleElements').append(removeIcon);
                    $('.remove-icon').tooltip({
                        container: 'body'
                    });
                }
                $('#styleEditor form#stylingForm').height('auto');

            }

        },


        /*
            Applies updated styling to the canvas
        */
        updateStyling: function() {

            var elementID,
                length;

            $('#styleEditor #tab1 .form-group:not(#styleElTemplate) input, #styleEditor #tab1 .form-group:not(#styleElTemplate) select').each(function(){

                if( $(this).attr('name') !== undefined ) {

                    $(styleeditor.activeElement.element).css( $(this).attr('name'),  $(this).val());
                    var nameAttrOfEl = $(this).attr("name");
                    if(nameAttrOfEl === 'font-size'){
                        var nodeName=styleeditor.activeElement.element.nodeName;
                        if(nodeName==='DIV' || nodeName==='BLOCKQUOTE')
                            $(styleeditor.activeElement.element).children().css($(this).attr("name"),$(this).val());
                    }
                    if(styleeditor.activeElement.element.tagName ==='NAV'){
                        if(nameAttrOfEl === 'color')
                            $(styleeditor.activeElement.element).find('[data-selector="nav a"]').css( $(this).attr('name'),  $(this).val());
                         if(nameAttrOfEl=== 'fixed-header'){                            
                            if($(this).val() === "yes") { 
                                $(styleeditor.activeElement.element).parent().find('.duplicate-nav').css('height','76px');                               
                                $(styleeditor.activeElement.element).addClass("navbar-fixed-top");
                                $(styleeditor.activeElement.element).removeClass("navbar-static-top");
                            } else {                                
                                $(styleeditor.activeElement.element).parent().find('.duplicate-nav').css('height','0px');
                                $(styleeditor.activeElement.element).addClass("navbar-static-top");
                                $(styleeditor.activeElement.element).removeClass("navbar-fixed-top");
                            }
                        }   
                    
                    }
                    
                    if( nameAttrOfEl === "dynamic-text" || nameAttrOfEl === "dynamic-button" || nameAttrOfEl === "dynamic-image") {
                        if($(this).val() === "yes") {
                            $(styleeditor.activeElement.element).addClass("agile-" + nameAttrOfEl);
                        } else {
                            $(styleeditor.activeElement.element).removeClass("agile-" + nameAttrOfEl);
                        }
                    }
                    if(nameAttrOfEl === "show-video-icon"){
                        if($(this).val() === "yes") {
                            $(styleeditor.activeElement.element).parent().find('.video__button').show();
                        } else {
                            $(styleeditor.activeElement.element).parent().find('.video__button').hide();
                        }
                    }

                }

                /* SANDBOX */

                if( styleeditor.activeElement.sandbox ) {

                    elementID = $(styleeditor.activeElement.element).attr('id');

                    $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).css( $(this).attr('name'),  $(this).val() );

                }

                /* END SANDBOX */

            });

            //links
            if( $(styleeditor.activeElement.element).prop('tagName') === 'A' ) {

                var link_text=document.getElementById('internalLinksCustom').value;
                if(link_text.match("^(http|https)://|#")===null){
                        styleeditor.showErrorMsg('internalLinksCustom');
                        return;
                 }
                //change the href prop?
                styleeditor.activeElement.element.href = link_text;


                length = styleeditor.activeElement.element.childNodes.length;
                
                //does the link contain an image?
                if( styleeditor.linkImage ) styleeditor.activeElement.element.childNodes[length-1].nodeValue = document.getElementById('linkText').value;
                else if ( styleeditor.linkIcon ) {
                    if($(styleeditor.activeElement.element.childNodes[length-1]).hasClass('fa'))
                        styleeditor.activeElement.element.childNodes[0].nodeValue = document.getElementById('linkText').value;
                    else
                        styleeditor.activeElement.element.childNodes[length-1].nodeValue = document.getElementById('linkText').value;
                }  
                else styleeditor.activeElement.element.innerText = document.getElementById('linkText').value;
                /* SANDBOX */

                if( styleeditor.activeElement.sandbox ) {

                    elementID = $(styleeditor.activeElement.element).attr('id');

                    $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).attr('href', $('input#internalLinksCustom').val());


                }

                //check for open in new tab
                if($('#newtab-option').prop("checked"))            
                    $(styleeditor.activeElement.element).attr('target','_blank');
                else
                    $(styleeditor.activeElement.element).removeAttr('target');       

                /* END SANDBOX */

            }

            if( $(styleeditor.activeElement.element).parent().prop('tagName') === 'A' ) {

                var val=document.getElementById('internalLinksCustom').value;
                if($('#link_Link').parent().hasClass('active'))                    
                    if(val.match("^(http|https)://|#")===null){
                        styleeditor.showErrorMsg('internalLinksCustom');
                        return;
                    }

                //change the href prop?
                styleeditor.activeElement.element.parentNode.href = val;

                length = styleeditor.activeElement.element.childNodes.length;
                

                /* SANDBOX */

                if( styleeditor.activeElement.sandbox ) {

                    elementID = $(styleeditor.activeElement.element).attr('id');

                    $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).parent().attr('href', $('input#internalLinksCustom').val());

                }
                 /* END SANDBOX */

                //check for open in new tab
                if($('#newtab-option').prop("checked"))            
                    $(styleeditor.activeElement.element).parent().attr('target','_blank');
                else
                    $(styleeditor.activeElement.element).parent().removeAttr('target');
               

            }

            //icons
            if( $(styleeditor.activeElement.element).hasClass('fa') ) {

                //out with the old, in with the new :)
                //get icon class name, starting with fa-
                var get = $.grep(styleeditor.activeElement.element.className.split(" "), function(v, i){

                    return v.indexOf('fa-') === 0;

                }).join();

                //if the icons is being changed, save the old one so we can reset it if needed

                if( get !== $('select#icons').val() ) {

                    $(styleeditor.activeElement.element).uniqueId();
                    styleeditor._oldIcon[$(styleeditor.activeElement.element).attr('id')] = get;

                }

                $(styleeditor.activeElement.element).removeClass( get ).addClass( $('select#icons').val() );


                /* SANDBOX */

                if( styleeditor.activeElement.sandbox ) {

                    elementID = $(styleeditor.activeElement.element).attr('id');
                    $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).removeClass( get ).addClass( $('select#icons').val() );

                }

                /* END SANDBOX */

            }

            //video URL
            if( $(styleeditor.activeElement.element).attr('data-type') === 'video' ) {

                var videoRecord_Id = $('select[id=videoRecordId]').val();
                 //image under video section
                if($(styleeditor.activeElement.element).siblings("IMG")!==0 && $('.imageFileTab').hasClass('active')){
                    var url=$('.imageFileTab').find('input#imageURL').val();
                    if(url.match("^(http|https)://")===null|| url.match(/\.(jpeg|jpg|gif|png|svg|JPEG|JPG|GIF|PNG|SVG)$/) === null){
                        styleeditor.showErrorMsg('imageURL');
                        return;
                    }
                    else 
                       $(styleeditor.activeElement.element).siblings("IMG").attr('src',decodeURIComponent(url));
                    // alternate text for image
                    $(styleeditor.activeElement.element).siblings("IMG").attr('alt',$('.imageFileTab').find('input#alttxt').val());
                }
                if(!$('.imageFileTab').hasClass('active')){
                    if( $('input#youtubeID').val() !== '' ) {

                        var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
                        var ytMatch = $('input#youtubeID').val().match(ytRegExp);
                        if (ytMatch && ytMatch[1].length === 11) {
                            var youtubeId = ytMatch[1];
                            $(styleeditor.activeElement.element).prev().attr('data-video', "//www.youtube.com/embed/"+youtubeId);
                            customAgileEvents.createYoutubeThumbnail(youtubeId,$(styleeditor.activeElement.element));
                             
                        }
                        else{
                            styleeditor.showErrorMsg('youtubeID');
                            return;
                        }
                        
                    } else if( $('input#vimeoID').val() !== '' ) {
                        var vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;
                        var vimMatch = $('input#vimeoID').val().match(vimRegExp);
                        if (vimMatch && vimMatch[3].length){
                            var vimeoId = vimMatch[3];
                            $(styleeditor.activeElement.element).prev().attr('data-video', "//player.vimeo.com/video/"+vimeoId+"?title=0&amp;byline=0&amp;portrait=0");
                            customAgileEvents.createVimeoThumbnail(vimeoId,$(styleeditor.activeElement.element));
                        }
                        else{
                            styleeditor.showErrorMsg('vimeoID');
                            return;
                        }
                    } else if ( videoRecord_Id !== '' ) {

                        $(styleeditor.activeElement.element).prev().attr('data-video', siteBuilder.builderUI.siteUrl+"video/"+videoRecord_Id+"?embed=true");
                    }
                    else
                        $(styleeditor.activeElement.element).prev().attr('data-video', "");
                }


                /* SANDBOX */

                if( styleeditor.activeElement.sandbox ) {

                    elementID = $(styleeditor.activeElement.element).attr('id');

                    if( $('input#youtubeID').val() !== '' ) {

                        $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).prev().attr('src', "//www.youtube.com/embed/"+$('#video_Tab input#youtubeID').val());

                    } else if( $('input#vimeoID').val() !== '' ) {

                        $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).prev().attr('src', "//player.vimeo.com/video/"+$('#video_Tab input#vimeoID').val()+"?title=0&amp;byline=0&amp;portrait=0");

                    }                  

                }

                /* END SANDBOX */

            }

             //agile form
            if($(styleeditor.activeElement.element).attr('id') ==='agileform_div' || $(styleeditor.activeElement.element).attr('id') ==='agileform'){

                var form_id=$('select[id=agileform_id]').val();
                if(form_id==='default')                 
                    return;

                window.current_agileform=$(styleeditor.activeElement.element).closest("#page").children().attr("id");
                var current_element=$(styleeditor.activeElement.element).children();

                if(current_element.attr("class")==="agile_crm_form_embed"){
                    current_element=$(styleeditor.activeElement.element).children().children();
                    styleeditor.preForm_id[window.current_agileform]=$(styleeditor.activeElement.element).children().attr("id");
                }               

                styleeditor._oldForm[window.current_agileform]=current_element;                
                styleeditor.loadAgileCRMFormInLandingPage(form_id);
            }

            //direct url pass for image
            if($(styleeditor.activeElement.element).prop('tagName')==="IMG"){

                    var image_url=$('.imageFileTab').find('input#imageURL').val();
                   
                    if( image_url.match("^(http|https)://")===null|| image_url.match(/\.(jpeg|jpg|gif|png|svg|JPEG|JPG|GIF|PNG|SVG)$/) === null){
                        styleeditor.showErrorMsg('imageURL');
                        return;
                    }
                    $(styleeditor.activeElement.element).attr('src',decodeURIComponent(image_url));

                    //apply alternate text for image
                    $(styleeditor.activeElement.element).attr('alt',$('.imageFileTab').find('input#alttxt').val());
                
            }

            $('#detailsAppliedMessage').fadeIn(600, function(){

                setTimeout(function(){ $('#detailsAppliedMessage').fadeOut(1000); }, 3000);

            });

            //adjust frame height
            if(typeof styleeditor.activeElement.parentBlock.heightAdjustment !== "undefined") {
                styleeditor.activeElement.parentBlock.heightAdjustment();
            }


            //we've got pending changes
            siteBuilder.site.setPendingChanges(true);

            publisher.publish('onBlockChange', styleeditor.activeElement.parentBlock, 'change');

        },


        /*
            on focus, we'll make the input fields wider
        */
        animateStyleInputIn: function() {
            if($(this).attr("name") !== "background-image") {
                $(this).css('position', 'absolute');
                $(this).css('right', '0px');
                $(this).animate({'width': '100%'}, 500);
                $(this).focus(function(){
                    this.select();
                });
            }
        },


        /*
            on blur, we'll revert the input fields to their original size
        */
        animateStyleInputOut: function() {

            $(this).animate({'width': '42%'}, 500, function(){
                $(this).css('position', 'relative');
                $(this).css('right', 'auto');
            });

        },


        /*
            builds the dropdown with #blocks on this page
        */
        buildBlocksDropdown: function (currentVal) {

            $(styleeditor.selectLinksInernal).select2('destroy');

            if( typeof currentVal === 'undefined' ) currentVal = null;

            var x,
                newOption;

            styleeditor.selectLinksInernal.innerHTML = '';

            newOption = document.createElement('OPTION');
            newOption.innerText = _AGILE_LOCALE_JSON['choose-a-block-link'];
            newOption.setAttribute('value', '#');
            styleeditor.selectLinksInernal.appendChild(newOption);

            for ( x = 0; x < siteBuilder.site.activePage.blocks.length; x++ ) {

                var frameDoc = siteBuilder.site.activePage.blocks[x].frameDocument;
                var pageContainer  = frameDoc.querySelector(bConfig.pageContainer);
                var theID = pageContainer.children[0].id;

                newOption = document.createElement('OPTION');
                newOption.innerText = '#' + theID;
                newOption.setAttribute('value', '#' + theID);
                if( currentVal === '#' + theID ) newOption.setAttribute('selected', true);

                styleeditor.selectLinksInernal.appendChild(newOption);

            }

            $(styleeditor.selectLinksInernal).select2();
            $(styleeditor.selectLinksInernal).trigger('change');

            $(styleeditor.selectLinksInernal).off('change').on('change', function () {
                styleeditor.inputCustomLink.value = this.value;
                styleeditor.hideErrorMsg('internalLinksCustom');
                styleeditor.resetPageDropdown();
            });

        },


        /*
            blur event handler for the custom link input
        */
        inputCustomLinkBlur: function (e) {

            var value = e.target.value,
                x;

            //pages match?
            for ( x = 0; x < styleeditor.selectLinksPages.querySelectorAll('option').length; x++ ) {

                if ( value === styleeditor.selectLinksPages.querySelectorAll('option')[x].value ) {

                    styleeditor.selectLinksPages.selectedIndex = x;
                    $(styleeditor.selectLinksPages).trigger('change').select2();

                }

            }

            //blocks match?
            for ( x = 0; x < styleeditor.selectLinksInernal.querySelectorAll('option').length; x++ ) {

                if ( value === styleeditor.selectLinksInernal.querySelectorAll('option')[x].value ) {

                    styleeditor.selectLinksInernal.selectedIndex = x;
                    $(styleeditor.selectLinksInernal).trigger('change').select2();

                }

            }

        },


        /*
            focus event handler for the custom link input
        */
        inputCustomLinkFocus: function () {

            styleeditor.resetPageDropdown();
            styleeditor.resetBlockDropdown();

        },


        /*
            builds the dropdown with pages to link to
        */
        buildPagesDropdown: function (currentVal) {

            $(styleeditor.selectLinksPages).select2('destroy');

            if( typeof currentVal === 'undefined' ) currentVal = null;

            var x,
                newOption;

            styleeditor.selectLinksPages.innerHTML = '';

            newOption = document.createElement('OPTION');
            newOption.innerText = _AGILE_LOCALE_JSON['choose-a-page'];
            newOption.setAttribute('value', '#');
            styleeditor.selectLinksPages.appendChild(newOption);

            for( x = 0; x < siteBuilder.site.sitePages.length; x++ ) {

                newOption = document.createElement('OPTION');
                newOption.innerText = siteBuilder.site.sitePages[x].name;
                newOption.setAttribute('value', siteBuilder.site.sitePages[x].name + '.html');
                if( currentVal === siteBuilder.site.sitePages[x].name + '.html') newOption.setAttribute('selected', true);

                styleeditor.selectLinksPages.appendChild(newOption);

            }

            $(styleeditor.selectLinksPages).select2();
            $(styleeditor.selectLinksPages).trigger('change');

            $(styleeditor.selectLinksPages).off('change').on('change', function () {
                styleeditor.inputCustomLink.value = this.value;
                styleeditor.resetBlockDropdown();
            });

        },


        /*
            reset the block link dropdown
        */
        resetBlockDropdown: function () {

            styleeditor.selectLinksInernal.selectedIndex = 0;
            $(styleeditor.selectLinksInernal).select2('destroy').select2();

        },


        /*
            reset the page link dropdown
        */
        resetPageDropdown: function () {

            styleeditor.selectLinksPages.selectedIndex = 0;
            $(styleeditor.selectLinksPages).select2('destroy').select2();

        },


        /*
            when the clicked element is an anchor tag (or has a parent anchor tag)
        */
        editLink: function(el) {

            var theHref;

            $('a#link_Link').parent().show();
            $('#linkText').parent().show();
            //check target attribute
            if(($(el).attr('target') || $(el).parent().attr('target')) ==="_blank")
                $("#newtab-option").prop("checked", "checked");
            else
                $("#newtab-option").prop("checked", "");
            $('a#link_Link').click();

            if($("#err-url-msg").css("display")!=="none"){
                styleeditor.hideErrorMsg('internalLinksCustom');
            }

            //set theHref
            if( $(el).prop('tagName') === 'A' ) {
                theHref = $(el).attr('href');
            } else if( $(el).parent().prop('tagName') === 'A' ) {
                theHref = $(el).parent().attr('href');
            }
            
            $('#linkText').focus();
            styleeditor.buildPagesDropdown(theHref);
            styleeditor.buildBlocksDropdown(theHref);
            styleeditor.inputCustomLink.value = theHref;

            //grab an image?
            if ( el.querySelector('img') ) styleeditor.linkImage = el.querySelector('img');
            else styleeditor.linkImage = null;

            //grab an icon?
            if ( el.querySelector('.fa') ) styleeditor.linkIcon = el.querySelector('.fa').cloneNode(true);
            else styleeditor.linkIcon = null;

            styleeditor.inputLinkText.value = el.innerText;

        },


        /*
            when the clicked element is an image
        */
        editImage: function(el) {

            $('a#img_Link').parent().show();
            $('#linkText').parent().hide();

            if($(el).prop('tagName')=== "IMG"  && $(el).attr('data-type') !== 'video')
                $("a#img_Link").click(); 
    
            if($("#error-img-msg").css("display")!=="none"){
                styleeditor.hideErrorMsg('imageURL');
            }

            //set the current SRC 
            if($(el).siblings("IMG").length!==0){
                $('.imageFileTab').find('input#imageURL').val($(el).siblings("IMG").attr("src"));
                //set if alternate text for image is exist
                $('.imageFileTab').find('input#alttxt').val($(el).siblings("IMG").attr("alt"));
            }            
            else{ 
                $('.imageFileTab').find('input#alttxt').val($(el).attr("alt"));
                $('.imageFileTab').find('input#imageURL').val( $(el).attr('src') );
            }
            
            //reset the file upload
            $('.imageFileTab').find('a.fileinput-exists').click();

        },


        /*
            when the clicked element is a video element
        */
        editVideo: function(el) {

            var matchResults;

            $('a#video_Link').parent().show();
            $('a#video_Link').click();
            //$('a#default-tab1').css("display","none");

            if($("#err-youtube-msg").css("display")!=="none"){
                styleeditor.hideErrorMsg('youtubeID');
            }
            if($("#err-vimeo-msg").css("display")!=="none"){
                styleeditor.hideErrorMsg('vimeoID');
            }
            //inject current video ID,check if we're dealing with Youtube or Vimeo or Recorded video

            if( $(el).prev().attr('data-video').indexOf("vimeo.com") > -1 ) {//vimeo

                //matchResults = $(el).prev().attr('data-video').match(/player\.vimeo\.com\/video\/([0-9]*)/);

                $('#video_Tab input#vimeoID').val("https:"+ $(el).prev().attr('data-video'));
                $('#video_Tab input#youtubeID').val('');
                $('#video_Tab select[id=videoRecordId]').val('').attr('selected','selected');

            } else if( $(el).prev().attr('data-video').indexOf("youtube.com") > -1 ) {//youtube

                //temp = $(el).prev().attr('src').split('/');
               // var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
               // matchResults = $(el).prev().attr('data-video').match(regExp);

                $('#video_Tab input#youtubeID').val("https:"+$(el).prev().attr('data-video'));
                $('#video_Tab input#vimeoID').val('');
                $('#video_Tab select[id=videoRecordId]').val('').attr('selected','selected');

            } else { //Recorded video

                matchResults = $(el).prev().attr('data-video').match(/video\/([0-9]*)/);
                if(matchResults)
                    $('#video_Tab select[id=videoRecordId]').val( matchResults[1] ).attr('selected','selected');
                else
                    $("#video_Tab select[id=videoRecordId]").val("");
                $('#video_Tab input#youtubeID').val('');
                $('#video_Tab input#vimeoID').val('');
            }

        },


        /*
            when the clicked element is an fa icon
        */
        editIcon: function() {

            $('a#icon_Link').parent().show();
            $('a#icon_Link').click();
            $('#linkText').parent().hide();


            //get icon class name, starting with fa-
            var get = $.grep(this.activeElement.element.className.split(" "), function(v, i){

                return v.indexOf('fa-') === 0;

            }).join();

            $('select#icons option').each(function(){

                if( $(this).val() === get ) {

                    $(this).attr('selected', true);

                    $('#icons').trigger('chosen:updated');

                }

            });

        },


        /*
            delete selected element
        */
        deleteElement: function() {

            publisher.publish('onBeforeDelete');

            var toDel;

            //determine what to delete
            if( $(styleeditor.activeElement.element).prop('tagName') === 'A' ) {//ancor

                if( $(styleeditor.activeElement.element).parent().prop('tagName') ==='LI' ) {//clone the LI

                    toDel = $(styleeditor.activeElement.element).parent();

                } else {

                    toDel = $(styleeditor.activeElement.element);

                }

            } else if( $(styleeditor.activeElement.element).prop('tagName') === 'IMG' ) {//image

                if( $(styleeditor.activeElement.element).parent().prop('tagName') === 'A' && $.trim($(styleeditor.activeElement.element).parent().text())==="") {//delete only image if link text is empty

                    toDel = $(styleeditor.activeElement.element).parent();

                } else {

                    toDel = $(styleeditor.activeElement.element);

                }

            } else if( $(styleeditor.activeElement.element).hasClass("frameCover") ) { // To delete video block correctly
                toDel = $(styleeditor.activeElement.element).parent(".videoWrapper");
            } else {//everything else

                toDel = $(styleeditor.activeElement.element);

            }


            toDel.fadeOut(500, function(){

                var randomEl = $(this).closest('body').find('*:first');

                toDel.remove();

                /* SANDBOX */

                var elementID = $(styleeditor.activeElement.element).attr('id');

                $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).remove();

                /* END SANDBOX */

                styleeditor.activeElement.parentBlock.heightAdjustment();

                //we've got pending changes
                siteBuilder.site.setPendingChanges(true);

            });

            $('#deleteElement').modal('hide');

            styleeditor.closeStyleEditor();

            publisher.publish('onBlockChange', styleeditor.activeElement.parentBlock, 'change');

        },


        /*
            clones the selected element
        */
        cloneElement: function() {

            publisher.publish('onBeforeClone');

            // To clone video block correctly
            if( $(styleeditor.activeElement.element).hasClass("frameCover") ) {
                $(styleeditor.activeElement.element).parent(".videoWrapper").addClass("propClone");
            }

            var theClone, theClone2, theOne, cloned, cloneParent, elementID;

            if( $(styleeditor.activeElement.element).parent().hasClass('propClone') ) {//clone the parent element

                theClone = $(styleeditor.activeElement.element).parent().clone();
                theClone.find( $(styleeditor.activeElement.element).prop('tagName') ).attr('style', '');

                theClone2 = $(styleeditor.activeElement.element).parent().clone();
                theClone2.find( $(styleeditor.activeElement.element).prop('tagName') ).attr('style', '');

                theOne = theClone.find( $(styleeditor.activeElement.element).prop('tagName') );
                cloned = $(styleeditor.activeElement.element).parent();

                cloneParent = $(styleeditor.activeElement.element).parent().parent();

            } else {//clone the element itself

                theClone = $(styleeditor.activeElement.element).clone();

                theClone.attr('style', '');

                /*if( styleeditor.activeElement.sandbox ) {
                    theClone.attr('id', '').uniqueId();
                }*/

                theClone2 = $(styleeditor.activeElement.element).clone();
                theClone2.attr('style', '');

                /*
                if( styleeditor.activeElement.sandbox ) {
                    theClone2.attr('id', theClone.attr('id'));
                }*/

                theOne = theClone;
                cloned = $(styleeditor.activeElement.element);

                cloneParent = $(styleeditor.activeElement.element).parent();

            }

            cloned.after( theClone );

            /* SANDBOX */

            if( styleeditor.activeElement.sandbox ) {

                elementID = $(styleeditor.activeElement.element).attr('id');
                $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).after( theClone2 );

            }

            /* END SANDBOX */

            //make sure the new element gets the proper events set on it
            var newElement = new canvasElement(theOne.get(0));
            newElement.activate();

            //possible height adjustments
            styleeditor.activeElement.parentBlock.heightAdjustment();

            //we've got pending changes
            siteBuilder.site.setPendingChanges(true);

            publisher.publish('onBlockChange', styleeditor.activeElement.parentBlock, 'change');

        },


        /*
            resets the active element
        */
        resetElement: function() {

            if( $(styleeditor.activeElement.element).closest('body').width() !== $(styleeditor.activeElement.element).width() ) {

                $(styleeditor.activeElement.element).attr('style', '').css({'outline': '3px dashed red', 'cursor': 'pointer'});

            } else {

                $(styleeditor.activeElement.element).attr('style', '').css({'outline': '3px dashed red', 'outline-offset':'-3px', 'cursor': 'pointer'});

            }

            /* SANDBOX */

            if( styleeditor.activeElement.sandbox ) {

                var elementID = $(styleeditor.activeElement.element).attr('id');
                $('#'+styleeditor.activeElement.sandbox).contents().find('#'+elementID).attr('style', '');

            }

            /* END SANDBOX */

            $('#styleEditor form#stylingForm').height( $('#styleEditor form#stylingForm').height()+"px" );

            $('#styleEditor form#stylingForm .form-group:not(#styleElTemplate)').fadeOut(500, function(){

                $(this).remove();

            });


            //reset icon

            if( styleeditor._oldIcon[$(styleeditor.activeElement.element).attr('id')] !== null ) {

                var get = $.grep(styleeditor.activeElement.element.className.split(" "), function(v, i){

                    return v.indexOf('fa-') === 0;

                }).join();

                $(styleeditor.activeElement.element).removeClass( get ).addClass( styleeditor._oldIcon[$(styleeditor.activeElement.element).attr('id')] );

                $('select#icons option').each(function(){

                    if( $(this).val() === styleeditor._oldIcon[$(styleeditor.activeElement.element).attr('id')] ) {

                        $(this).attr('selected', true);
                        $('#icons').trigger('chosen:updated');

                    }

                });

            }

            //agile form reset 
           if($(styleeditor.activeElement.element).attr('id')==='agileform_div'){
            $("iframe").each(function(i) { 
                if($("iframe")[i].hasAttribute('data-originalurl') && ($("iframe")[i].getAttribute('data-originalurl').includes(window.current_agileform))){
                   var iframe_id=$("iframe")[i].getAttribute("id");                   
                   if(styleeditor._oldForm[window.current_agileform].size()===1){
                        $('#agileform_id').val('default').attr('selected','selected');
                        siteBuilder.site.setPendingChanges(true);
                        $('#'+iframe_id).contents().find('#agileform_div').html(styleeditor._oldForm[window.current_agileform]);           
                    }
                   else {
                        $('#'+iframe_id).contents().find('.agile_crm_form_embed').attr("id",styleeditor.preForm_id[window.current_agileform]);
                        $('#agileform_id').val(styleeditor.preForm_id[window.current_agileform]).attr('selected','selected');
                        siteBuilder.site.setPendingChanges(true);
                        $('#'+iframe_id).contents().find('.agile_crm_form_embed').html(styleeditor._oldForm[window.current_agileform]);
                    }
                   return;
                }
            }); 
           } 

            setTimeout( function(){styleeditor.buildeStyleElements( $(styleeditor.activeElement.element).attr('data-selector') );}, 550);

            siteBuilder.site.setPendingChanges(true);

            publisher.publish('onBlockChange', styleeditor.activeElement.parentBlock, 'change');

        },


        resetSelectLinksPages: function() {

            $('#internalLinksDropdown').select2('val', '#');

        },

        resetSelectLinksInternal: function() {

            $('#pageLinksDropdown').select2('val', '#');

        },

        resetSelectAllLinks: function() {
            styleeditor.hideErrorMsg('internalLinksCustom');
            $('#internalLinksDropdown').select2('val', '#');
            $('#pageLinksDropdown').select2('val', '#');
            this.select();

        },

        /*
            hides file upload forms
        */
        hideFileUploads: function() {

            $('form#imageUploadForm').hide();
            $('#imageModal #uploadTabLI').hide();

        },


        /*
            closes the style editor
        */
        closeStyleEditor: function (e) {

            if ( e !== undefined ) e.preventDefault();

            if(styleeditor.activeElement.element)
                 styleeditor.activeElement.editableAttributes=bConfig.editableItems[styleeditor.activeElement.element.getAttribute('data-selector')];
            
            if ( styleeditor.activeElement.editableAttributes && styleeditor.activeElement.editableAttributes.indexOf('content') === -1 ) {
                styleeditor.activeElement.removeOutline();
                styleeditor.activeElement.activate();
            }

            if( $('#styleEditor').css('left') === '0px' ) {

                styleeditor.toggleSidePanel('close');

            }
            if(styleeditor.prevFocus)
                $(styleeditor.prevFocus).focus();

        },


        /*
            toggles the side panel
        */
        toggleSidePanel: function(val) {

            if( val === 'open' && $('#styleEditor').css('left') === '-302px' ) {
                $('#styleEditor').animate({'left': '0px'}, 250);
            } else if( val === 'close' && $('#styleEditor').css('left') === '0px' ) {
                $('#styleEditor').animate({'left': '-302px'}, 250);
            }

        },

        editAgileForm: function(){
            $('a#agileform_link').parent().show();
            $('a#agileform_link').click();
            $('a#default-tab1').css('display','none');
            if($(this.activeElement.element).find('.agile_crm_form_embed').size()!==0){
                $('#agileform_id').val($(this.activeElement.element).find('.agile_crm_form_embed').attr('id')).attr('selected','selected');
                var form_id=$(this.activeElement.element).find(".agile_crm_form_embed").attr("id").split(window.CURRENT_AGILE_DOMAIN+"_")[1];
                $('#refresh-formlist .edit-form').attr("href",window.siteUrl+"formbuilder?form="+form_id);
                $('#refresh-formlist .edit-form').show();
            }else{

                $('#agileform_id').val('default').attr('selected','selected');
                $('#refresh-formlist .edit-form').hide();
            }

        },

        loadAgileCRMFormInLandingPage: function(id){
            id = id.split("_");
             var agileDomain = id[0];
             var formId = id[id.length-1];
             console.log("domain is :"+agileDomain);
             var script = document.createElement('script');
            script.src = window.siteUrl+'core/api/forms/form/js/'+formId;
            document.body.appendChild(script);  
        },
        addRemoveIcon: function(el){
            $(el).css('margin-bottom','0px');
            var icon=$('<a class="right agile-tooltip remove-icon" data-placement="right" data-original-title="Click to remove background image"></a>');
            icon.append('<i class="fa fa-trash right" style="color: #bdc3c7;"></i>');
            $(icon).off('click');
            $(icon).on('click', function(event){
                $(event.currentTarget).prev().find('input').val("none");
            });
            return icon;
        },
        focusOnInputVimeo : function(e){
            $(styleeditor.videoInputYoutube).val('');             
            if($('#err-youtube-msg').css('display')!=="none")
                styleeditor.hideErrorMsg('youtubeID'); 
            styleeditor.hideErrorMsg('vimeoID');
        },
        focusOnInputYoutube : function(e){
            $(styleeditor.videoInputVimeo).val(''); 
            if($('#err-vimeo-msg').css('display')!=="none")                
                styleeditor.hideErrorMsg('vimeoID');
            styleeditor.hideErrorMsg('youtubeID'); 
        },
        focusImageInputURL :function(el){
            if($('#error-img-msg').css('display')!== "none")
                styleeditor.hideErrorMsg('imageURL');
        },
        hideErrorMsg : function(el){
            $('input#'+el).addClass("margin-bottom-20");
            $("."+el).next().css("margin-top","");
            $("."+el).hide();
        },
        showErrorMsg : function(el){
            $('input#'+el).removeClass("margin-bottom-20");
            $("."+el).next().css("margin-top","6px");
            $("."+el).show();
        }

    };

    styleeditor.init();

    exports.styleeditor = styleeditor;

}());
