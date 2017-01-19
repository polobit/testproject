$.cssHooks.backgroundColor = {
    get: function (elem) {
         $('#imageproperties').hide();
        if (elem.currentStyle)
            var bg = elem.currentStyle["background-color"];
        else if (window.getComputedStyle)
            var bg = document.defaultView.getComputedStyle(elem,
                    null).getPropertyValue("background-color");
        if (bg.search("rgb") == -1)
            return bg;
        else {
            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            //return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
        }
    }
}

$.cssHooks.fontColor = {
    get: function (elem) {
        if (elem.currentStyle)
            var bg = elem.currentStyle["color"];
        else if (window.getComputedStyle)
            var bg = document.defaultView.getComputedStyle(elem,
                    null).getPropertyValue("color");
        if (bg.search("rgb") == -1)
            return bg;
        else {
            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
        }
    }
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgb?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

/* this generate the id of item */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
}

/* give the attribute id to item and build the function on event onclick */
function showSettings() {
    var settings = $('#settings');
    // var elements = $('#elements');
    if (settings.hasClass('hide')) {
        // elements.slideUp(300);
        settings.removeClass('hide');
        settings.show('slide',{direction:'right'},1000);
    }
}

function hideSettings() {
    var settings = $('#settings');
    if (!settings.hasClass('hide')) {
        settings.addClass('hide');
        $('#block-drag').show();
    }
}

function showElements() {
    // var settings = $('#settings');
    // var elements = $('#elements');
    // if (!settings.hasClass('hide')) {
    //     settings.slideUp(300);
    //     settings.addClass('hide');
    //     elements.slideDown(300);
    // }
    hideSettings();
}

function handleObjects() {

    $(".demo .column .lyrow").each(function (i) {

        $(this).removeClass('dragitem');
        $(this).css('display', 'block');

        var self = $(this).find('div.row table.main'); // tabella
        var id = self.attr('id');

        if (typeof id === typeof undefined || id === false) {
            id = guid();
            self.attr('id', id);
        }
            self.hide();
            self.unbind('click');

            hideAllSettings();
            $('#block-drag').show();

            self.bind('click', function () {

                $('div.row').removeClass('active');
                self.parent("div.row").addClass('active');
                $('#path').val(id);
                var t = self.data('type');

                    $('#ptop').val(parseInt(self.find('td:first').css('padding-top')));
                    $('#pbottom').val(parseInt(self.find('td:first').css('padding-bottom')));
                    $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                    $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                    $('#image-caption-position').val(self.find('.image-caption-column-text').attr('data-align'));
                
                hideAllSettings();
                $('#common-settings').show();
                $('#padding-setting').show();
                $('#settings').show();
                $('#content-tab').show();
                $('#settings-panel-close').show();

                switch (t) {
                    case 'title':

                        var titleElement = self.find('.title');
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        var fontcolor = titleElement.css('fontColor');
                        var text =        titleElement.html();
                        var fontsize =    titleElement.css('font-size');
                        var fontfamily =  titleElement.css('font-family');
                        var background =  self.css('background-color');
                        $('#selector').val('.title');
                        storeValues(self, fontcolor, text, fontsize, fontfamily, background);
                        break;

                    case 'text-block' :
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        var fontcolor = $('#' + $('#path').val() + ' tbody tr td').css('fontColor');
                        var text = $('#' + $('#path').val()).find('div.textFix').html();
                        var fontsize = $('#' + $('#path').val()).find('div').css('font-size');
                        var fontfamily = $('#' + $('#path').val()).find('div').css('font-family');
                        var background = $('#' + $('#path').val()).css('backgroundColor');
                        $('#selector').val('div.textFix');
                        storeValues(self, fontcolor, text, fontsize, fontfamily, background);
                        break;

                    case 'image':
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        var img = self.find('img');
                        var imageid = img.attr('id');

                        if (typeof imageid === typeof undefined || imageid === false) {
                            img.attr('id', guid());
                            imageid = img.attr('id');
                        }
                        $('#imageid').val(imageid);
                        $('#image-url').val(img.attr('src'));
                        $('#image-url').data('id', imageid );

                        $('#image-w').val(parseFloat(0 + img.attr("width")));
                        $('#image-h').val(parseFloat(0 + img.attr("height")));
                        $('#image-alt-text').val(img.attr('alt'));

                        $('#video-link').val("");
                        $('#image-link').val("");
                        $("#select_alignment").find('.image-align-picker').val(img.closest('td').attr('align'));
                        if(img.parent('a').length) {
                            $('#image-link').val(addhttp(img.parent('a').attr('href')));
                        }

                        hideAllSettings();
                        $('#imageproperties').show();
                        $("#imageHeaderId").html("Image");
                        $('#image-link-holder').show();
                        $('#settings').show();
                        $("#select_alignment").show();

                        break;
                    case 'video-record':
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        var img = self.find('img');
                        var imageid = img.attr('id');

                        if (typeof imageid === typeof undefined || imageid === false) {
                            img.attr('id', guid());
                            imageid = img.attr('id');
                        }
                        $('#imageid').val(imageid);
                        $('#image-url').val(img.attr('src'));
                        $('#image-url').data('id', imageid );

                        $('#image-w').val(parseFloat(0 + img.attr("width")));
                        $('#image-h').val(parseFloat(0 + img.attr("height")));
                        $('#image-alt-text').val(img.attr('alt'));

                        $('#image-link').val("");
                        $('#video-link').val("");
                        if(img.parent('a').length) {
                            $('#video-link').val(addhttp(img.parent('a').attr('href')));
                        }

                        hideAllSettings();
                        $('#imageproperties').show();
                        $('#video-record-btn-holder').show();
                        $("#imageHeaderId").html("Video");
                        $('#videoThumbnail').show();
                        $('#settings').show();
                        break;

                    case 'imgtxtcol':
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        var img = self.find('tbody tr td table tbody tr td img');

                        var imageid = img.attr('id');
                        if (typeof imageid === typeof undefined || imageid === false) {
                            img.attr('id', guid());
                            imageid = img.attr('id');
                        }
                        $('#imageid').val(imageid);

                        $('#imageid').val(imageid);
                        $('#image-url').val(img.attr('src'));
                        $('#image-url').data('id', imageid );

                        $('#image-w').val(parseFloat(0 + img.attr("width")));
                        $('#image-h').val(parseFloat(0 + img.attr("height")));
                        $('#image-alt-text').val(img.attr('alt'));

                        $('#video-link').val("");
                        $('#image-link').val("");
                        if(img.parent('a').length) {
                            $('#image-link').val(addhttp(img.parent('a').attr('href')));
                        }

                        hideAllSettings();
                        $('#imageproperties').show();
                        $("#imageHeaderId").html("Image");
                        $('#image-link-holder').show();
                        $('#settings').show();
                        break;

                    case 'imgtxtincol':
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');

                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        var imgs = self.find('td.imageInColumn img');

                        imgs.each(function (i) {
                            var img = $(this);
                            var imageid = img.attr('id');
                            if (typeof imageid === typeof undefined || imageid === false) {
                                img.attr('id', guid());
                            }
                        });

                        hideAllSettings();
                        $('#settings').show();
                        handleButtonsTxt(self);
                        break;

                    case 'imgtxt':
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        //    $('#'+$('#path').val()).unbind('click');
                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        var img = self.find('tbody tr td table tbody tr td img');
                        // devi mettere un each perchè ci sono piu di un immagine.


                        var imageid = img.attr('id');

                        if (typeof imageid === typeof undefined || imageid === false) {
                            img.attr('id', guid());
                            imageid = img.attr('id');
                        }
                        $('#imageid').val(imageid);

                        $('#imageid').val(imageid);
                        $('#image-url').val(img.attr('src'));
                        $('#image-url').data('id', imageid );

                        $('#image-w').val(parseFloat(0 + img.attr("width")));
                        $('#image-h').val(parseFloat(0 + img.attr("height")));
                        $('#image-alt-text').val(img.attr('alt'));

                        $('#video-link').val("");
                        $('#image-link').val("");
                        if(img.parent('a').length) {
                            $('#image-link').val(addhttp(img.parent('a').attr('href')));
                        }

                        hideAllSettings();
                        $('#imageproperties').show();
                        $("#imageHeaderId").html("Image");
                        $('#image-link-holder').show();
                        $('#settings').show();
                        break;

                    case 'line':
                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        hideAllSettings();
                        $('#settings').show();
                        $('#content-tab').hide();
                        $('#settings-panel-close').hide();
                        $('#customize-tab').trigger('click');
                        break;

                    case 'button':
                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        hideAllSettings();
                        $('#settings').show();
                        handleButtons(self);
                        break;

                    case 'social-links':

                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        $('#selector').val('tr td');


                        if (self.find('a.facebook').is(":visible")) {
                            $('input.social-check[name=facebook]').prop('checked', true);
                        } else {
                            $('input.social-check[name=facebook]').prop('checked', false);
                        }

                        if (self.find('a.twitter').is(":visible")) {
                            $('input.social-check[name=twitter]').prop('checked', true);
                        } else {
                            $('input.social-check[name=twitter]').prop('checked', false);
                        }

                        if (self.find('a.linkedin').is(":visible")) {
                            $('input.social-check[name=linkedin]').prop('checked', true);
                        } else {
                            $('input.social-check[name=linkedin]').prop('checked', false);
                        }

                        if (self.find('a.youtube').is(":visible")) {
                            $('input.social-check[name=youtube]').prop('checked', true);
                        } else {
                            $('input.social-check[name=youtube]').prop('checked', false);
                        }

                        if (self.find('a.instagram').is(":visible")) {
                            $('input.social-check[name=instagram]').prop('checked', true);
                        } else {
                            $('input.social-check[name=instagram]').prop('checked', false);
                        }

                        if (self.find('a.pinterest').is(":visible")) {
                            $('input.social-check[name=pinterest]').prop('checked', true);
                        } else {
                            $('input.social-check[name=pinterest]').prop('checked', false);
                        }

                        $('input.social-input[name="facebook"]').val(addhttp(self.find('a.facebook').attr('href')));
                        $('input.social-input[name="twitter"]').val(addhttp(self.find('a.twitter').attr('href')));
                        $('input.social-input[name="linkedin"]').val(addhttp(self.find('a.linkedin').attr('href')));
                        $('input.social-input[name="youtube"]').val(addhttp(self.find('a.youtube').attr('href')));
                        $('input.social-input[name="instagram"]').val(addhttp(self.find('a.instagram').attr('href')));
                        $('input.social-input[name="pinterest"]').val(addhttp(self.find('a.pinterest').attr('href')));

                        hideAllSettings();
                        $('#settings').show();
                        $('#social-links').show();


                        break;


                    case 'imgcaption':

                         $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        //    $('#'+$('#path').val()).unbind('click');
                        $('#bgcolor').find(".color-preview").css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('#bgcolor').find(".hex-col-val").text(rgb2hex($('#' + $('#path').val()).css('backgroundColor')));
                        var img = self.find('tbody tr td table tbody tr td img');
                        // devi mettere un each perchè ci sono piu di un immagine.


                        var imageid = img.attr('id');

                        if (typeof imageid === typeof undefined || imageid === false) {
                            img.attr('id', guid());
                            imageid = img.attr('id');
                        }
                        $('#imageid').val(imageid);

                        $('#imageid').val(imageid);
                        $('#image-url').val(img.attr('src'));
                        $('#image-url').data('id', imageid );

                        $('#image-w').val(parseFloat(0 + img.attr("width")));
                        $('#image-h').val(parseFloat(0 + img.attr("height")));
                        $('#image-alt-text').val(img.attr('alt'));

                        $('#video-link').val("");
                        $('#image-link').val("");
                        if(img.parent('a').length) {
                            $('#image-link').val(addhttp(img.parent('a').attr('href')));
                        }

                        $('#image-caption-position').val(self.find('.image-caption-column-text').attr('data-align'));

                        hideAllSettings();
                        $('#imageproperties').show();
                        $("#imageHeaderId").html("Image");
                        $('#image-link-holder').show();
                        $('#settings').show();
                        $('#image-caption-settings').show();

                        break;

                    /*case 'user-poll':

                        $('#bgcolor').css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('.selected-item').removeClass('selected-item').css('outline', 'none');
                        hideAllSettings();
                        handlePolls(self);
                        break;*/

                    default:
                        // console.log(t);
                        break;
                }
                // end of bind click function
                showSettings();

            });

            self.fadeIn(800);


    });
}

function addhttp(linkUrl) {
    if(linkUrl.length == 0) return;
    return /^[A-Za-z][A-Za-z0-9+-.]*\:[\/\/]?/.test(linkUrl) ? linkUrl : 'http://' + linkUrl;
}

function handleButtons(obj) {
    var buttons = obj.find('table tbody tr td a');
    $('#buttons').show();
    var btn_settings = $('#buttonslist li');
    var ul = $('#buttonslist');
    btn_settings.each(function () {
        if (!$(this).hasClass('hide')) {
            $(this).detach();
        }
    });

    buttons.each(function () {
        var clone = ul.find('li:first').clone(true);
        // clone.next('div.form-group > input[value="btn_title"]').val("wsu");

        var btn = $(this);

        var btn_title = $(this).find("span");

        if (btn_title.length != 0) 
        {
        clone.find('div.form-group > input[name="btn_title"]').val(btn_title.html())
                .change(function () {
                    btn_title.html($(this).val());
                });

        clone.find('div.buttonStyle').popover({
            title: 'Button Style',
            html: true,
            content: clone.find('div.stylebox').html()
        }).css('backgroundColor', btn.css('backgroundColor')).css('color', btn_title.css('color'));

        }else{
            clone.find('div.form-group > input[name="btn_title"]').val(btn.html())
                .change(function () {
                    btn.html($(this).val());
                });

        clone.find('div.buttonStyle').popover({
            title: 'Button Style',
            html: true,
            content: clone.find('div.stylebox').html()
        }).css('backgroundColor', btn.css('backgroundColor')).css('color', btn.css('fontColor'));

        }

        clone.find('div.input-group > input[name="btn_link"]').val(btn.attr('href'))
                .change(function () {
                    btn.attr('href', addhttp($(this).val()));
                    btn.unbind('click');
                    btn.bind('click', function (e) {
                        e.preventDefault()
                    });
                });

       /* clone.find('div.buttonStyle').popover({
            title: 'Button Style',
            html: true,
            content: clone.find('div.stylebox').html()
        }).css('backgroundColor', btn.css('backgroundColor')).css('color', btn.css('fontColor'));*/

        clone.find('.trashbutton').css('cursor', 'pointer').click(function () {
            if ($('#buttonslist li').length !== 2) {
                $(this).parent('li').slideUp(500);
                $(this).parent('li').detach();
                btn.parent('td').detach();
                $('#add-button').show();
            } else {
                alert(localeJSON['you-cant-remove']);
            }
        });

        clone.appendTo(ul).removeClass('hide');

    });
}

function handleButtonsTxt(obj) {
    $('#buttons').hide();
    var buttons = obj.find('table tbody tr td a.textbuttonsimg');
    if(buttons.length) {
        $('#buttonstxt').show();
    }
    
    var btn_settings = $('#buttonstxtlist li');
    var ul = $('#buttonstxtlist');
    btn_settings.each(function () {
        if (!$(this).hasClass('hide')) {
            $(this).detach();
        }
    });

    buttons.each(function () {
        var clone = ul.find('li:first').clone(true);
        // clone.next('div.form-group > input[value="btn_title"]').val("wsu");

        var btn = $(this);

        var btn_title = $(this).find("span");

        if (btn_title.length != 0) 
        {
                clone.find('div.form-group > input[name="btn_title"]').val(btn_title.html())
                        .change(function () {
                            btn_title.html($(this).val());
                        });
                clone.find('div.buttonStyleTxt').popover({
                    title: 'Button Style',
                    html: true,
                    content: clone.find('div.styleboxtxt').html()
                }).css('backgroundColor', btn.css('backgroundColor')).css('color', btn_title.css('color'));
        }else{
                clone.find('div.form-group > input[name="btn_title"]').val(btn.html())
                        .change(function () {
                            btn.html($(this).val());
                        });
                clone.find('div.buttonStyleTxt').popover({
                    title: 'Button Style',
                    html: true,
                    content: clone.find('div.styleboxtxt').html()
                }).css('backgroundColor', btn.css('backgroundColor')).css('color', btn.css('fontColor'));
        }

        clone.find('div.input-group > input[name="btn_link"]').val(btn.attr('href'))
                .change(function () {
                    btn.attr('href', addhttp($(this).val()));
                    btn.unbind('click');
                    btn.bind('click', function (e) {
                        e.preventDefault()
                    });
                });

       /* clone.find('div.buttonStyleTxt').popover({
            title: 'Button Style',
            html: true,
            content: clone.find('div.styleboxtxt').html()
        }).css('backgroundColor', btn.css('backgroundColor')).css('color', btn.css('fontColor'));*/

        clone.find('.trashbutton').css('cursor', 'pointer').click(function () {
            if (true) {
                $(this).parent('li').slideUp(500);
                $(this).parent('li').detach();
                btn.parent('td').detach();
            } else {
                alert(localeJSON['you-cant-remove']);
            }
        });

        clone.appendTo(ul).removeClass('hide');

    });
}

function storeValues(obj, fontcolor, text, fontsize, fontfamily, background) {

    // tinyMCE.activeEditor.setContent(text);
    var theeditor = tinyMCE.get('html5editor');
    theeditor.setContent(text);

    tinyMCE.execCommand('mceFocus',false,'html5editor');

    hideAllSettings();
    $('#editor').show();
    $('#settings').show();
    if(obj.data('type') == 'imgcaption') 
        $('#image-caption-settings').show();

    obj.data('fontcolor', fontcolor);
    obj.data('text', text);
    obj.data('fontsize', fontsize);
    obj.data('fontfamily', fontfamily);
    obj.data('background', background);
}

function configurationElm(e, t) {
    $(".demo").delegate(".configuration > a", "click", function (e) {
        e.preventDefault();
        var t = $(this).parent().parent();
        var clone = t.clone();
        //t.css('border', '4px solid red');

        clone.find('table.main').removeAttr('id');
        clone.find("img").removeAttr("id");
        $(clone).insertAfter(t);
        handleObjects();
    });
}

function removeElm() {
    $(".demo").delegate(".remove", "click", function (e) {
        if(confirm(localeJSON['are-you-sure'] + '?')){
          //conta elem con lyrow
              if($('#tosave .lyrow').length>1){
                e.preventDefault();
                $(this).parent().remove();
                showElements();
              }else alert(localeJSON['you-cant-remove-all']);
        }
    })
}

function removeMenuClasses() {
    $("#menu-layoutit li button").removeClass("active")
}
/*function changeStructure(e, t) {
    $("#download-layout ." + e).removeClass(e).addClass(t)
}
function cleanHtml(e) {
    $(e).parent().append($(e).children().html())
}

function cleanHtml(e) {
    $(e).parent().append($(e).children().html());
    $(e).remove();
}*/

function downloadLayoutSrc() {
    var e = "";
    $("#download-layout").html($("#tosave").html());
    var t = $("#download-layout");
    t.find(".preview, .configuration, .drag, .remove").remove();
    // applica le proprietà al bottone;
    t.find("a.button-1").each(function () {

        $(this).attr('href', $(this).data('href'));
    });

    var clone = t.find('td#primary').parent().parent().parent();

    //console.log(clone);

    var preheader = ""; //t.find('td#primary .lyrow .view .row table.preheader').parent().html();
    var header = ""; //t.find('td#primary .lyrow .view .row table#header').parent().html();    <-- se si vogliono mettere header statici
    var body = '';


    t.find('div.column .lyrow .view .row').each(function () {
        var self = $(this);
        body += self.html();
    });

    var footer = "";  //t.find('table#footer').parent().html();   <-- se si vogliono mettere footer statici

    clone.find('td#primary').html(preheader + header + body + footer);

    $("#download").val(clone.parent().html());
}

function getIndex(itm, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (itm[0] === list[i])
            break;
    }
    return i >= list.length ? -1 : i;
}

function hideAllSettings(exceptThisElement) {

    var settingsHolderSelectors = ['#editor','#buttons','#buttonstxt','#imageproperties','#social-links', '#user-poll', '#select_alignment', '#video-record-btn-holder',
                                    '#image-link-holder', '#videoThumbnail', '#block-drag', '#settings', '#image-caption-settings'];

    if(typeof exceptThisElement != "undefined") {
        var index = settingsHolderSelectors.indexOf(exceptThisElement);
        if (index >= 0) {
          settingsHolderSelectors.splice( index, 1 );
        }
    }
    $(settingsHolderSelectors.join(',')).hide();
}

function handlePolls(obj){

    var polls = obj.find('table tbody tr td a');  
    $('#user-poll').show(); 

    var poll_settings = $('#poll-list li'); 
    var ul = $('#poll-list');

    poll_settings.each(function () {
        if (!$(this).hasClass('hide')) {
            $(this).detach();
        }
    });

    polls.each(function () {
        
        var clone = ul.find('li:first').clone(true);

        var poll = $(this);

        //for redirect url
        var url = window.location.origin+"/emailPollServlet?email={{email}}&pollanswer="+poll.attr('data-tag');
        var displayurl = poll.attr("href").indexOf("redirecturl=");


        clone.find('div.input-group > input[name="poll_value"]').val(poll.html())
                .change(function () {
                    poll.html($(this).val());
                });

        clone.find('div.input-group > input[name="poll_tag"]').val(poll.attr('data-tag'))
                .change(function () {
                    //validating tag
                    if (!isValidTag($(this).val(), true)) {
                     return;
                    }
                    poll.attr("data-tag", $(this).val());
                    //adding in href url
                    var href = poll.attr("href");
                    var index = href.indexOf("pollanswer=");
                    index += 11;
                    var urlindex = href.indexOf("&redirecturl");
                    var output = [href.slice(0, index), $(this).val()].join('');

                    if(urlindex.length > 0)
                        output += href.substring(urlindex);

                    poll.attr("href", output);
                });

        clone.find('.delbutton').css('cursor', 'pointer').click(function () {
            if ($('#poll-list li div').length !== 4) {
                $(this).closest('li').slideUp(500);
                $(this).parent('div').detach();
                poll.closest('td').detach();
                $('#add-poll').show();
            } else {
                alert(localeJSON['you-cant-remove']);
            }
        });

        
        if(displayurl == -1)
        {
        poll.attr("href", url); 
        $('#user-poll').find('div:last input').val("");
        }
        else
        {
            var disp = poll.attr("href").substring(displayurl+12);
            $('#user-poll').find('div:last input').val(disp);
        } 

        clone.appendTo(ul).removeClass("hide");

    });
}

 


/*$(window).resize(function () {
    // $("body").css("min-height", $(window).height() - 90);
    // $(".demo").css("min-height", $(window).height() - 160);
    $("#tosave").css("height", $(window).height() - 30);
    var closeButton = '<div class="pull-right settings-panel-close-holder" style="font-size: 18px;"><i class="glyphicon glyphicon-remove settings-panel-close" style="cursor: pointer;"></i></div>';
    $("#settings").prepend(closeButton);

    var widthOfWindow = $(window).width();
    if(widthOfWindow <= 1362) {
        var $settings = $("#settings");
        if(!$settings.hasClass("settings-panel-fixed")) {
            $settings.addClass("settings-panel-fixed");
            $( ".settings-panel-fixed" ).draggable();
            var closeButton = '<div class="pull-right settings-panel-close-holder" style="font-size: 18px;"><i class="glyphicon glyphicon-remove settings-panel-close" style="cursor: pointer;"></i></div>';
            $settings.prepend(closeButton);
        }
    } else {
        $("#settings").removeClass("settings-panel-fixed");
        $(".settings-panel-close-holder").remove();
    }

});*/

$(document).ready(function () {

    loadSavedTemplate();

    parent.get_custom_fields(function(data){
        initializeEditor();
    });

    $('#tosave').on('click', 'a', function(e) {
        if(!$(this).hasClass("remove") || !$(this).hasClass("drag") || !$(this).hasClass("clone")) {
            e.preventDefault();
        }    
    });

    $(document.getElementById('previewFrame').contentWindow.document.body).on('click', 'a', function(e) {
        // e.preventDefault();  
        $(this).attr("target","_blank");
    });

    $(document).on('change', '#image-link,#image-alt-text,#image-w,#image-h,#video-link,#image-url', function(e){
        e.preventDefault();
         var id= $('#image-url').data('id');
         $('#'+id).attr('src', $('#image-url').val());

         if(parseInt($('#'+id).attr("data-maxwidth")) < parseInt($('#image-w').val())) 
         {          
            alert("Image width must be less than or equal to "+$('#'+id).attr("data-maxwidth"));
            $('#image-w').val(parseInt($('#'+id).css("max-width")));
        }
         else
         {
            if($("#"+id).closest(".main").data('type') == "imgcaption")
            {
                var imageWidth = parseInt($("#"+id).closest(".main").find('.image-caption-column img').attr('width'));
                var textWidth = parseInt($("#"+id).closest(".main").find('.image-caption-column-text').attr('width'));
                var width = imageWidth - parseInt($('#image-w').val());

                var textAlign = $("#"+id).closest(".main").find('.image-caption-column-text').attr('align'); 
                $('#'+id).attr('width', $('#image-w').val());
                $('#'+id).css('max-width', parseInt($('#image-w').val()));

                if(textAlign == "left" || textAlign == "right")
                {
    
                        $("#"+id).closest(".main").find('.image-caption-column').attr('width', parseInt($('#image-w').val()));
                        $("#"+id).closest(".main").find('.image-caption-column-text').attr('width', textWidth + width);
    
                }
               
            }

        }

         $('#'+id).attr('height', $('#image-h').val());
         $('#'+id).attr('alt', $('#image-alt-text').val());
         //for new text field is adding on the 
         if($('#image-link').val()) {
            if($('#'+id).parent("a").length) {
                var anchorTag = $('#'+id).parent("a");
                $(anchorTag).attr('href', addhttp($('#image-link').val())) ;
            } else {
                $('#'+id).wrap("<a target='_blank' class='imgLink' href='" + addhttp($('#image-link').val()) + "'>");
            }
         }else if ($('#video-link').val()) {
            var absolute_href =  addhttp($('#video-link').val());
            if($('#'+id).parent("a").length) {
                var anchorTag = $('#'+id).parent("a");
                $(anchorTag).attr('href', absolute_href) ;
            } else {
                $('#'+id).wrap("<a target='_blank' class='imgLink' href='"+absolute_href+"'>");
            }
         }
       
         
    });

    $(document).on('change', '.image-align-picker', function(e){
        var id = $('#path').val();
        $('#'+id).find('.image').attr('align', e.target.value);
        var width = parseInt($('#'+id).find('.image img').attr('width'));
        if(e.target.value == 'left' && width <= 520)
            $('#'+id).find('.image').css('padding-left', '50px');
        if(e.target.value == 'right' && width <= 520)
            $('#'+id).find('.image').css('padding-right', '50px');
        if(e.target.value == 'center')
            $('#'+id).find('.image').css({'padding-right': '0px', 'padding-left': '0px'});
    });

    
    $(document).on('change', '#image-caption-position', function(e){
        var id = $('#path').val();
        var width;
        var textWidth = parseInt($('#'+id).closest('table').find(".image-caption-column-text").attr('width'));
        var imageWidth = parseInt($("#"+id).closest(".main").find('.image-caption-column img').attr('width'));

        if($('#'+id).closest('table').find(".image-caption-column-text").attr('width') != '100%')
            width = textWidth;
        else
            width = 505 - imageWidth;
        

        if(e.target.value == "left"){
            $('#'+id).closest('table').find(".image-caption-column").attr("align", "right");
            $('#'+id).closest('table').find(".image-caption-column-text").attr({'align': 'left', 'data-align': 'left', 'width': width});
            var image = $('#'+id).closest('table').find(".image-caption-column");
            $('#'+id).closest('table').find(".image-caption-column").remove();
            $('#'+id).closest('table').find(".image-caption-column-text").after(image);
        }
        else if(e.target.value == "right"){
            $('#'+id).closest('table').find(".image-caption-column").attr("align", "left");
            $('#'+id).closest('table').find(".image-caption-column-text").attr({'align': 'right',  'data-align': 'right', 'width': width});
            var text = $('#'+id).closest('table').find(".image-caption-column-text");
            $('#'+id).closest('table').find(".image-caption-column-text").remove();
            $('#'+id).closest('table').find(".image-caption-column").after(text);
        }
        else if(e.target.value == "top"){
            $('#'+id).closest('table').find(".image-caption-column").attr("align", "center");
            $('#'+id).closest('table').find(".image-caption-column-text").attr({"align": "center", 'data-align': 'top', "width": "100%"});
            var image = $('#'+id).closest('table').find(".image-caption-column");
            $('#'+id).closest('table').find(".image-caption-column").remove();
            $('#'+id).closest('table').find(".image-caption-column-text").after(image);
        }
        else if(e.target.value == "bottom"){
            $('#'+id).closest('table').find(".image-caption-column").attr("align", "center");
            $('#'+id).closest('table').find(".image-caption-column-text").attr({"align": "center", 'data-align': 'bottom', "width": "100%"});
            var text = $('#'+id).closest('table').find(".image-caption-column-text");
            $('#'+id).closest('table').find(".image-caption-column-text").remove();
            $('#'+id).closest('table').find(".image-caption-column").after(text);
        }
    });

    $(document).on('change', '#bg-image-url', function(e){
        console.log("coming to background image link");
        var id = $('#path').val();
        $('#'+id).closest('table').css({ 'background-image' : 'url('+$('#bg-image-url').val()+')',
                                         'background-repeat': 'repeat'
                                     });
    });

    $(document).on('change', 'input.social-input', function(e){
        console.log("hai"+e);
         $('input.social-input[name="'+e.target.name+'"]').val($(this).val().length >0 ? addhttp($(this).val()) : $(this).val());
    });

    
    // paddings functions;
    $(document).on('change', '#ptop,#pbottom,#pleft,#pright', function (e) {

        $('#' + $('#path').val()).find('td:first').css('padding-top', parseInt($('#ptop').val()));
        $('#' + $('#path').val()).find('td:first').css('padding-bottom', parseInt($('#pbottom').val()));

    });


    var indexBefore = -1;
    $('#buttonslist').sortable({
        handle: '.orderbutton',
        start: function (event, ui) {
            indexBefore = getIndex(ui.item, $('#buttonslist li')) - 1;

        },
        stop: function (event, ui) {
            var indexAfter = getIndex(ui.item, $("#buttonslist li")) - 1;
            // var td = $('#' + $('#path').val()).find('table tbody tr td');

            if (indexBefore < indexAfter) {
                $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBefore + ')')).insertAfter(
                        $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexAfter + ')')));
            }
            else {
                $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexBefore + ')')).insertBefore(
                        $($('#' + $('#path').val()).find('table tbody tr td:eq(' + indexAfter + ')')));
            }

        }
    });


    $('#add-button').click(function (e) {
        e.preventDefault();
        //$('#buttonslist').first();

        var obj = $('#' + $('#path').val());

        var ul = $('#buttonslist');
        var nn = ul.children().length;

        if (nn !== 5) {
            var button = obj.find('table tbody tr td:first').clone(true);
            
            //to work on outlook properly  
            if(typeof(button.find('a span').html()) == 'undefined'){
                button.find('a').html('default');
            }else{
                button.find('a span').html('default');
            }

            button.appendTo(obj.find('table tbody tr'));

            handleButtons(obj);


        } else {
            $(this).hide();
        }
    });


    $('#fontstyle').on('shown.bs.popover', function () {
        // carico le propieta dell'oggetto dal selettore.
        var obj = $('#' + $('#path').val());

        $('#colortext').val(obj.data('fontcolor'));
        $('#colortext').next('span.input-group-addon').css('backgroundColor', obj.data('fontcolor'));
        $('#fonttext').val(obj.data('fontfamily'));
        $('#sizetext').val(obj.data('fontsize'));
    });

    $('div#buttons .form-group select.form-control').change(function (e) {
        e.preventDefault();
        $('#' + $('#path').val()).find('table.button').attr('align', $(this).val());
    });


    $('div.buttonStyle').on('shown.bs.popover', function () {
        // carico le propieta dell'oggetto dal selettore.
        var self = $(this);

        var index = getIndex($(this).parent().parent(), $('#buttonslist li')) - 1;

        var bg = $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') > a').css('background-color');
        var font_color = $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a span');
        var font_size = $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('font-size');
        var btn_size = $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('width');

        if(font_color.length > 0 ){
            font_color = font_color.css('color');
        }else{
            font_color = $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a span').css('color');
        }

        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div.background span.picker').css('backgroundColor', bg);
        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div.fontcolor span.picker').css('backgroundColor', font_color);
        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div input[name="FontSize"]').val(font_size);
        //$('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div input[name="ButtonSize"]').val(btn_size);

        // font size

        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div input[name="FontSize"]').change(function (e) {
            var fontSize = parseInt($(this).val());
            $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('font-size', fontSize);
        });


        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div span.font i.fa-plus').click(function (e) {
            var fontSize = parseInt($(this).parent().next('input').val());
            fontSize = fontSize + 1 + "px";
            $(this).parent().next('input').val(fontSize);
            $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('font-size', fontSize);
        });

        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div span.font i.fa-minus').click(function (e) {
            var fontSize = parseInt($(this).parent().prev('input').val());
            fontSize = fontSize - 1 + "px";
            $(this).parent().prev('input').val(fontSize);
            $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('font-size', fontSize);
        });

        // button size

        /*$('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div input[name="ButtonSize"]').change(function (e) {
            var btnsize = parseInt($(this).val());
            $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('width', btnsize);
        });


        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div span.button i.fa-plus').click(function (e) {
            var btnsize = parseInt($(this).parent().next('input').val());
            btnsize = btnsize + 1 + "px";
            $(this).parent().next('input').val(btnsize);
            $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('width', btnsize);
        });

        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div span.button i.fa-minus').click(function (e) {
            var btnsize = parseInt($(this).parent().prev('input').val());
            btnsize = btnsize - 1 + "px";
            $(this).parent().prev('input').val(btnsize);
            $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('width', btnsize);
        });*/



        $(this).parent().find('div div.text a').click(function () {
            // self.popover('hide');
            self.click();
        });


        


    });

$('div.buttonStyleTxt').on('shown.bs.popover', function () {
        // carico le propieta dell'oggetto dal selettore.
        var self = $(this);

        var index = getIndex($(this).parent().parent(), $('#buttonstxtlist li')) - 1;

       var bg = $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('background-color');
        var font_color = $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ') span');
        var font_size = $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('font-size');
        //var btn_size = $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('width');

        if(font_color.length > 0 ){
            font_color = font_color.css('color');
        }else{
            font_color = $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('color');
        }

        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div.background span.pickerTxt').css('backgroundColor', bg);
        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div.fontcolor span.pickerTxt').css('backgroundColor', font_color);
        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div input[name="FontSize"]').val(font_size);
        //$('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div input[name="ButtonSize"]').val(btn_size);

        // font size

        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div input[name="FontSize"]').change(function (e) {
            var fontSize = parseInt($(this).val());
            $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('font-size', fontSize);
        });


        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div span.font i.fa-plus').click(function (e) {
            var fontSize = parseInt($(this).parent().next('input').val());
            fontSize = fontSize + 1 + "px";
            $(this).parent().next('input').val(fontSize);
            $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('font-size', fontSize);
        });

        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div span.font i.fa-minus').click(function (e) {
            var fontSize = parseInt($(this).parent().prev('input').val());
            fontSize = fontSize - 1 + "px";
            $(this).parent().prev('input').val(fontSize);
            $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('font-size', fontSize);
        });

        // button size

        /*$('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div input[name="ButtonSize"]').change(function (e) {
            var btnsize = parseInt($(this).val());
            $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('width', btnsize);
        });


        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div span.button i.fa-plus').click(function (e) {
            var btnsize = parseInt($(this).parent().next('input').val());
            btnsize = btnsize + 1 + "px";
            $(this).parent().next('input').val(btnsize);
            $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('width', btnsize);
        });

        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div span.button i.fa-minus').click(function (e) {
            var btnsize = parseInt($(this).parent().prev('input').val());
            btnsize = btnsize - 1 + "px";
            $(this).parent().prev('input').val(btnsize);
            $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('width', btnsize);
        });*/



        $(this).parent().find('div div.text a').click(function () {
            // self.popover('hide');
            self.click();
        });

    });


    // social links

    $(document).on('change', '.social-input', function (e) {
        e.preventDefault();
        var name = $(this).attr('name');
        $('#' + $('#path').val()).find($('#selector').val() + ' a.' + name).attr('href', '' + $(this).val()).attr('target', '_blank');
    });

    $(document).on('change', '.social-check', function (e) {
        e.preventDefault();
        var $currentEl = $('#' + $('#path').val()).find($('#selector').val() + ' a.' + $(this).attr('name'));
        var $imgEl = $currentEl.find("img");
        if ($(this).is(':checked')) {
            if ($currentEl.val() == undefined) {
                var currentElName = $(this).attr('name');
                var tempHtml = '<a href="#" style="border: none; text-decoration: none;" class="'+currentElName+'">';
                tempHtml += '<img border="0" src="https://s3.amazonaws.com/agilecrm/editor/email/staticfiles/'+currentElName+'.png" width="35" height="35"></a>&nbsp;';
                $('#' + $('#path').val() + ' tbody tr td').append(tempHtml);
            }
            $currentEl.show();
            $imgEl.attr("width","35");
            $imgEl.attr("height","35");
        } else {
            $currentEl.hide();
            $imgEl.attr("width","0");
            $imgEl.attr("height","0");
        }
    });

    /*settings functions*/

    $(document).on('click', '#saveElement,.settings-panel-close', function (e) {
        e.preventDefault();
        /*
         * must apply element properties
         */
        /*  e.data('fontcolor');
         e.data('text');
         e.data('fontsize');
         e.data('fontfamily');
         e.data('background');
         */
        $("#settings").find("#image-link,#image-alt-text,#image-h,#video-link,#image-url").trigger('change');
        $('div.row').removeClass('active');
        $('.selected-item').removeClass('selected-item').css('outline', 'none');
        // showElements();
        hideSettings();
        $('#block-drag').show();
    });



    $(document).on("click", "#fonttext", function (e) {
        e.preventDefault();
        $('#mainfontproperties').hide('slow');
        $('#fontselector').removeClass('hide').toggle();
        $('#fontselector').slideDown();
    });


    $(document).on('click', '#fontselector ul li', function (e) {
        var selectedFont = $(this).text();
        $('#fontselector').slideUp();
        $('#fonttext').css('font-family', selectedFont).val(selectedFont);
        $('#mainfontproperties').show('slow');
    });

    $(document).on('click', '#fontselector ul li', function (e) {
        var selectedFont = $(this).text();
        $('#fontselector').slideUp();
        $('#fonttext').css('font-family', selectedFont).val(selectedFont);
        $('#mainfontproperties').show('slow');
    });


    $(document).on("click", ".minus", function (e) {
        e.preventDefault();
        var val = $(this).parent().find('input').val();
        if (val === '') {
            val = 0;
        }
        var value = parseInt(val) - 1;
        if (value < 4) {
            return;
        }
        $(this).parent().find('input').val(value + 'px');
    });

    $(document).on("click", ".plus", function (e) {
        e.preventDefault();
        var val = $(this).parent().find('input').val();
        if (val === '') {
            val = 0;
        }
        var value = parseInt(val) + 1;
        if (value > 74) {
            return;
        }

        $(this).parent().find('input').val(value + 'px');
    });

    $(document).on("click", '#confirm-font-properties', function (e) {
        e.preventDefault();

        var obj = $('#' + $('#path').val()).find($('#selector').val());

        // applying font properties

        obj.css('font-family', $('#fonttext').val());
        obj.css('color', $('#colortext').val());
        obj.css('font-size', $('#sizetext').val());

        //$('#fontstyle').popover('hide');
        $('#fontstyle').click();

    });
    $('#fontstyle').on('hide.bs.popover', function () {
        $('.popover').css('z-index', '-1');
    });
    $('#fontstyle').on('shown.bs.popover', function () {
        $('.popover').css('z-index', '25000');
    });
    $('#fontstyle').popover({
        html: true,
        trigger: "click",
        placement: "right",
        title: "Font Style",
        content: function () {
            return  $('#font-style').html();
        }
    });


    $(".demo .column").sortable({connectWith: ".column", opacity: .35, handle: ".drag",axis:"y"});
    $(".sidebar-nav .lyrow").draggable({connectToSortable: ".column", helper: 'clone',
        stop: function (e, t) {
            $('html, body').animate({scrollTop: $('body').offset().top}, 500);
            handleObjects();
            $(".demo .column").sortable({opacity: .35, connectWith: ".column"});
            $(".demo .column .lyrow").find('.drag').removeClass('hide');
            $('.font-family-picker').trigger('change');
            $('.font-size-picker').trigger('change');
            $('.line-height-picker').trigger('change');
        }});


    $("#save").click(function () {

        $('div.row').removeClass('active');
        $('.selected-item').removeClass('selected-item').css('outline', 'none');

        downloadLayoutSrc();

        var save = $('#tosave');
        var templateContent = $("#templateHtmlContent").val();
        var fullSource = templateContent.replace("{body}",escapeHtmlEntities($('#download').val()));
        var builderSource = save.html();
        parent.saveEmailTemplateFromBuilder(fullSource,escapeHtmlEntities(builderSource));
        return;
        // console.log(save.html());
        // console.log($('#download').val());
        // return;

        $.post(path + '/save_source.php', {html: save.html(), data : save.data()}, function (data) {
            //alert(data);
            $('#messagefromphp').html("<i class='fa fa-check-circle'></i> "+data);
        }, 'html');

        $.post(path + '/save.php', {option: 'save', id: save.data('id'), html: $('#download').val()}, function (data) {
            //alert(data);
            $('#messagefromphp2').html("<i class='fa fa-check-circle'></i> <a style='color:#ffffff' target=_blank href="+data+">"+data+"</a>");
        }, 'html');


        return false;
    });

    $("#sendTestEmail").click(function () {

        $('div.row').removeClass('active');
        $('.selected-item').removeClass('selected-item').css('outline', 'none');

        downloadLayoutSrc();

        var save = $('#tosave');
        var templateContent = $("#templateHtmlContent").val();
        var fullSource = templateContent.replace("{body}",escapeHtmlEntities($('#download').val()));
        var builderSource = save.html();
        parent.sendTestEmailTemplate(fullSource,escapeHtmlEntities(builderSource));
        return;
        // console.log(save.html());
        // console.log($('#download').val());
        // return;

    });

    $("#edit").click(function () {
        $("body").removeClass("devpreview sourcepreview");
        $("body").addClass("edit");
        removeMenuClasses();
        $(this).addClass("active");
        return false;
    });

    $("#previewModal").on("show.bs.modal", function () {
        $('div.previewActions a').click(function (e) {
            e.preventDefault();
            var t = $(this).data("val");
            $('div.previewActions a').removeClass('active');
            $(this).addClass('active');

            $('#previewFrame').removeClass('iphone');
            $('#previewFrame').removeClass('ipad');
            $('#previewFrame').removeClass('smalltablet');

            $('#previewFrame').addClass(t);
            var w = parseInt($('#previewFrame').css('width')) + 50;
            $("#previewModal").find(".modal-content").css("width", w);

        });


        var w = parseInt($('#previewFrame').css('width')) + 50;
        $("#previewModal").find(".modal-content").css("width", w);
    });

    $("#sourcepreview").click(function (i) {
        i.preventDefault();
        $('div.row').removeClass('active');
        $('.selected-item').removeClass('selected-item').css('outline', 'none');
        showElements();

        downloadLayoutSrc();
        var templateContent = $("#templateHtmlContent").val();

        document.getElementById('previewFrame').contentWindow.document.body.innerHTML = templateContent.replace("{body}",$('#download').val());

        // $.post(path + '/save.php', {html: $('#download').val(), id: $('#tosave').data('id')}, function (data) {
        //     $('#httphref').val(data);
        //     $('#previewFrame').attr('src', data);
        // }, 'html');

        $('#previewModal').modal('show');
        return false;
    });

    $('#edittamplate').click(function (e) {
        e.preventDefault();
        hideAllSettings();
        $('#common-settings').show();
        $('#padding-setting').hide();
        $('#path').val('tosave table:first');
        $('#bgcolor').css('background-color', $('#tosave table').css('backgroundColor'));
        showSettings();
    });

    $("#uploadImageToS3Btn").change(function(){

        var fileInput = document.getElementById('uploadImageToS3Btn');
        uploadImageToS3ThroughBtn(fileInput.files[0]);
    
    });

    $("#uploadBgImageToS3ThroughBtn").change(function(){

        var fileInput = document.getElementById('uploadBgImageToS3ThroughBtn');
        uploadBgImageToS3ThroughBtn(fileInput.files[0]);
    
    });

    $('#settings').on('click', '.confirm', function(e){
        e.preventDefault();
    });

    $('#tosave').on('click', '.imgLink', function(e){
        e.preventDefault();
    });

    $('#tosave').on('click', 'td.imageInColumn img', function(e) {
        $('.selected-item').removeClass('selected-item').css('outline', 'none');
        var img = $(this);
        var imageid = $(this).attr('id');
        $('#imageid').val(imageid);
        $(this).addClass('selected-item');

        $('#image-url').val($(this).attr('src'));
        $('#image-url').data('id', imageid );

        $('#image-w').val(parseFloat(0 + img.attr("width")));
        $('#image-h').val(parseFloat(0 + img.attr("height")));
        $('#image-alt-text').val($(this).attr('alt'));
        $(this).css('outline', '1px dotted red');

        $('#video-link').val("");
        $('#image-link').val("");
        if(img.parent('a').length) {
            $('#image-link').val(addhttp(img.parent('a').attr('href')));
        }
        hideAllSettings();
        $('#imageproperties').show();
        $("#imageHeaderId").html("Image");
        $('#image-link-holder').show();
        $('#settings').show();
        if(img.closest('.main').data('type') == 'imgcaption') 
            $('#image-caption-settings').show();

    });

    $('#tosave').on('click','.textFix',function(e) {
        e.stopPropagation();
        //$('#common-settings').hide();

        var self = $(this).closest(".main");

        $('.selected-item').removeClass('selected-item').css('outline', 'none');

        var fontcolor = $(this).css('fontColor');
        var text =        $(this).html();
        var fontsize =    $(this).css('font-size');
        var fontfamily =  $(this).css('font-family');
        var background =  $(this).css('background-color');

        $('#selector').val(".selected-item");
        $(this).addClass('selected-item');
        $(this).css('outline','1px dotted red');

        storeValues(self, fontcolor, text, fontsize, fontfamily, background);
    });

    $('#custom-val').on('click', function(){
        
        //font styles of template
        $('#customize').find('.font-family-picker:selected').val($('#tosave').find('.textFix:first').css('font-family'));
        $('#customize').find('.font-size-picker').val($('#tosave').find('.textFix:first').css('font-size'));
        $('#customize').find('.line-height-picker').val($('#tosave').find('.textFix:first').css('line-height'));

        //template background color
        $('#customize').find('#background-color .color-preview').css('background-color', rgb2hex($('#tosave').find('table:first').css('background-color').replace("#","")));
        $('#customize').find('#background-color .hex-col-val').text(rgb2hex($('#tosave').find('table:first').css('background-color').replace("#","")));

        //template content area background color
        $('#customize').find('#content-bg-color .color-preview').css('background-color', rgb2hex($('#tosave').find('#primary .main:not([data-color=true])').css('background-color').replace("#","")));
        $('#customize').find('#content-bg-color .hex-col-val').text(rgb2hex($('#tosave').find('#primary .main:not([data-color=true])').css('background-color').replace("#","")));

        //template font color
        $('#customize').find('#font-color .color-preview').css('background-color', rgb2hex($('#tosave').find('.textFix:first').css('color').replace("#","")));
        $('#customize').find('#font-color .hex-col-val').text(rgb2hex($('#tosave').find('.textFix:first').css('color').replace("#","")));

    });

    $('.font-family-picker').on('change', function(){
        $('#tosave').find('.textFix').css('font-family', $(this).val());
        $('#tosave').find('.textbuttonsimg').css('font-family', $(this).val());
    });

    $('.font-size-picker').on('change', function(){
        $('#tosave').find('.textFix').css('font-size', $(this).find('option:selected').text());
        $('#tosave').find('.textbuttonsimg').css('font-size', $(this).find('option:selected').text());
    });

    $('.line-height-picker').on('change', function(){
        $('#tosave').find('.textFix').css('line-height', $(this).find('option:selected').text());
    });


    $('.panel-click').on('click', function(e){
        var $this = $(this).children().find('span');
        if(!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        } else {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
});




    $('#user-poll').on('change', 'input[name="poll_url"]',function (){

            var addhttp = $(this).val();
            var prefix1 = "http://";
            var prefix2 = "https://";

            var obj = $("#"+$("#path").val());

            var polls = obj.find('table tbody tr td a');  

            if(addhttp.length != 0 && addhttp.substring(0, prefix1.length) != prefix1 && addhttp.substring(0, prefix2.length) != prefix2)
            {
                addhttp = prefix1 + addhttp;
            }


            polls.each(function(){
                var poll = $(this);
                var url = window.location.origin+"/emailPollServlet?email={{email}}&pollanswer="+poll.attr('data-tag');
                if(addhttp.length != 0)
                {
                    poll.attr("href", "");
                    poll.attr("href", url+"&redirecturl="+addhttp);
                }
                else
                {
                    poll.attr("href", "");
                    poll.attr("href", url);
                }
            });
        });

    $(document).on('click', '#add-poll', function (e){
            e.preventDefault();
            var obj = $('#' + $('#path').val());

        var ul = $('#poll-list');
        var nn = ul.children().length;
        var count = 0;
        
        for(var i=0; i<nn; i++){
            if($(ul.children()[i]).css("display") !== "none")
                count++;
        }
        nn = count;

        if (nn <= 9) {
            
            var poll = obj.find('table tbody tr td:first').clone(true);
            poll.find('a').html('poll');
            poll.find('a').attr('data-tag','poll-tag')
            poll.appendTo(obj.find('table tbody tr'));

            handlePolls(obj);

        } else {
            //$(this).hide();
            alert(localeJSON['limit-reached']);
        }
        });
    
    handleObjects();
    removeElm();
    configurationElm();
    hideAllSettings();
    $('#block-drag').show();

    $(document).on('click', '#videoRecordBtn', function(e){
        e.preventDefault();
        window.parent.$(".videoRecordHiddenBtn").trigger("click");
    });

    $(document).on('click', '#videoRecordBtnNew', function(e){
        e.preventDefault();
        window.parent.$(".videoRecordHiddenBtnNew").trigger("click");
    });


});


function loadSavedTemplate() {
    //this should be loaded first when dom is ready
    if(AGILE_EB_OPTIONS['templateId'] && (AGILE_EB_OPTIONS['action'] == "edit" || AGILE_EB_OPTIONS['action'] == "copy")) {
        $.ajax({
            url: AGILE_EB_ROOT+"core/api/email/templates/"+AGILE_EB_OPTIONS['templateId'],
            dataType: 'json',
            async: false,
            data: {},
            success: function(data) {
                if(!data['is_template_built_using_builder']) {
                    parent.redirectToOldEditor(AGILE_EB_OPTIONS['templateId']);
                    return;
                }
                if(AGILE_EB_OPTIONS['action'] == "edit") {
                    $("#nameoftemplate",parent.document).val(data.name);
                    $("#subject",parent.document).val(data.subject);
                    $("#text_email",parent.document).val(data.text_email);
                    if(data.attachment_id && data.attachment_id != "0") {
                        parent.setAttachmentInTemplateEdit(data.attachment_id);
                    }
                    if(data.emailTemplate_category_id && data.emailTemplate_category_id != "0"){
                        $("select#emailTemplate-category-select",parent.document).val(data.emailTemplate_category_id);
                        parent._agile_set_prefs('emailTempCtg_id', data.emailTemplate_category_id);
                    }
                }else if(AGILE_EB_OPTIONS['action'] == "copy"){
                    if(data.emailTemplate_category_id && data.emailTemplate_category_id != "0"){
                        $("select#emailTemplate-category-select",parent.document).val(data.emailTemplate_category_id);
                        parent._agile_set_prefs('emailTempCtg_id', data.emailTemplate_category_id);
                    }
                }

                $("#tosave").html(data.html_for_builder);
            }
        });
    } else if(AGILE_EB_OPTIONS['templateId'] && AGILE_EB_OPTIONS['action'] == "new") {
        $.ajax({
            url: "templates/"+AGILE_EB_OPTIONS['templateId']+"/body_index.html",
            async: false,
            data: {},
            success: function(data) {
                $("#tosave").html(data);
            }
        });
    }
}

function initializeEditor() {
    
    tinymce.init({
        language : parent.get_tinymce_supported_language(),
        menubar: false,
        force_br_newlines: false,
        force_p_newlines: true,
        forced_root_block: '',
        selector: "#html5editor",
        plugins: "autolink lists link charmap code paste textcolor colorpicker paste lineheight",
        paste_as_text: true,
       // paste_word_valid_elements: "h1,h2,h3,b,strong,i,em",
        relative_urls : false,
        convert_urls : false,
        toolbar: "bold italic underline | alignleft aligncenter alignright | forecolor backcolor | bullist numlist | link | styleselect | fontsizeselect | fontselect | lineheightselect| merge_fields | lineheightselect",
        fontsize_formats: "8px 10px 12px 14px 16px 18px 24px 36px",
        lineheight_formats: "8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 36px",
        height: "200px",
        statusbar: false,
        setup: function (editor) {
            editor.addButton('merge_fields', { type : 'menubutton', text : localeJSON["merge-fields"], icon : false, menu : parent.set_up_merge_fields(editor) });

            // editor.addButton('calltoaction', {
            //     text : 'Add Button',
            //     onclick : function() {
            //         tinyMCE.execCommand('mceInsertContent',false, '<table><tbody><tr><td>&nbsp;</td><td class="button"><span style="font-size: 15px; line-height: 21px; display: block; border-radius: 6px; text-align: center; text-decoration: none; font-weight: bold; margin: 0px; padding: 12px 20px; color: #ffffff; background-color: #3498db;"><a href="http://example.com" class="button-1"><span style="color: #ffffff; background-color: #3498db;">Call to Action</span></a></span></td><td>&nbsp;</td></tr></tbody></table>'); 
            //     }
            // });

            editor.on('keyup', function (e) {
                $('#' + $('#path').val()).find($('#selector').val()).html(tinyMCE.get('html5editor').getContent());
            }),
            editor.on('change', function (e) {
                $('#' + $('#path').val()).find($('#selector').val()).html(tinyMCE.get('html5editor').getContent());
            });
        }
    });

}

function uploadImageToS3ThroughBtn(file) {
    if(typeof file != "undefined") {
        $("#browseBtn").prop("disabled",true);
        $("#browseBtn").text(localeJSON['uploading'] + "...");

        var uploadedFileName = file.name;
        var filename = uploadedFileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = filename + "_" + new Date().getTime() + "." + uploadedFileName.split('.').pop();

        formData = new FormData();
        formData.append('key',  "editor/email/"+window.parent.CURRENT_DOMAIN_USER.domain+"/"+filename);
        formData.append('AWSAccessKeyId', 'AKIAIBK7MQYG5BPFHSRQ');
        formData.append('acl', 'public-read');
        formData.append('content-type', 'image/png');
        formData.append('policy', 'CnsKICAiZXhwaXJhdGlvbiI6ICIyMDI1LTAxLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAiYWdpbGVjcm0iIH0sCiAgICB7ImFjbCI6ICJwdWJsaWMtcmVhZCIgfSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJlZGl0b3IvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRzdWNjZXNzX2FjdGlvbl9zdGF0dXMiLCAiMjAxIl0sCiAgXQp9');
        formData.append('signature', '59pSO5qgWElDA/pNt+mCxxzYC4g=');
        formData.append('success_action_status', '201');
        formData.append('file', file);

        $.ajax({
            data: formData,
            dataType: 'xml',
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            url: "https://agilecrm.s3.amazonaws.com/",
            success: function(data) {
              // getting the url of the file from amazon and insert it into the editor
              var url = $(data).find('Location').text();
              $('#image-url').val(decodeURIComponent(url));
              $('#image-link').trigger('change');
              $("#browseBtn").prop("disabled",false);
              $("#browseBtn").text(localeJSON['browse']);
            }
        });
    }
}


var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}



function uploadBgImageToS3ThroughBtn(file) {
    if(typeof file != "undefined") {
        $("#bg-image-browseBtn").prop("disabled",true);
        $("#bg-image-browseBtn").text(localeJSON['uploading'] + "...");

        var uploadedFileName = file.name;
        var filename = uploadedFileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = filename + "_" + new Date().getTime() + "." + uploadedFileName.split('.').pop();

        formData = new FormData();
        formData.append('key',  "editor/email/"+window.parent.CURRENT_DOMAIN_USER.domain+"/"+filename);
        formData.append('AWSAccessKeyId', 'AKIAIBK7MQYG5BPFHSRQ');
        formData.append('acl', 'public-read');
        formData.append('content-type', 'image/png');
        formData.append('policy', 'CnsKICAiZXhwaXJhdGlvbiI6ICIyMDI1LTAxLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAiYWdpbGVjcm0iIH0sCiAgICB7ImFjbCI6ICJwdWJsaWMtcmVhZCIgfSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJlZGl0b3IvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRzdWNjZXNzX2FjdGlvbl9zdGF0dXMiLCAiMjAxIl0sCiAgXQp9');
        formData.append('signature', '59pSO5qgWElDA/pNt+mCxxzYC4g=');
        formData.append('success_action_status', '201');
        formData.append('file', file);

        $.ajax({
            data: formData,
            dataType: 'xml',
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            url: "https://agilecrm.s3.amazonaws.com/",
            success: function(data) {
              // getting the url of the file from amazon and insert it into the editor
              var url = $(data).find('Location').text();
              $('#bg-image-url').val(decodeURIComponent(url));
              $('#bg-image-url').trigger('change');
              $("#bg-image-browseBtn").prop("disabled",false);
              $("#bg-image-browseBtn").text(localeJSON['browse']);
            }
        });
    }
}


function isValidTag(tag, showAlert) {
    
    var r = '\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC';
    var regexString = '^['+r+']['+r+' 0-9_-]*$';
    var is_valid = new RegExp(regexString).test(tag);
    if (showAlert && !is_valid)
        alert(localeJSON['tag-name-start-desc']);
    return is_valid;
}


if(typeof escapeHtmlEntities == 'undefined') {
    escapeHtmlEntities = function (text) {
        return text.replace(/(?!(>|<|"|'|&))[\u00A0-\u2666<>\&]/g, function(c) {
            return '&' + 
            (escapeHtmlEntities.entityTable[c.charCodeAt(0)] || '#'+c.charCodeAt(0)) + ';';
        });
    };

    // all HTML4 entities as defined here: http://www.w3.org/TR/html4/sgml/entities.html
    // added: amp, lt, gt, quot and apos
    escapeHtmlEntities.entityTable = {
        34 : 'quot', 
        38 : 'amp', 
        39 : 'apos', 
        60 : 'lt', 
        62 : 'gt', 
        160 : 'nbsp', 
        161 : 'iexcl', 
        162 : 'cent', 
        163 : 'pound', 
        164 : 'curren', 
        165 : 'yen', 
        166 : 'brvbar', 
        167 : 'sect', 
        168 : 'uml', 
        169 : 'copy', 
        170 : 'ordf', 
        171 : 'laquo', 
        172 : 'not', 
        173 : 'shy', 
        174 : 'reg', 
        175 : 'macr', 
        176 : 'deg', 
        177 : 'plusmn', 
        178 : 'sup2', 
        179 : 'sup3', 
        180 : 'acute', 
        181 : 'micro', 
        182 : 'para', 
        183 : 'middot', 
        184 : 'cedil', 
        185 : 'sup1', 
        186 : 'ordm', 
        187 : 'raquo', 
        188 : 'frac14', 
        189 : 'frac12', 
        190 : 'frac34', 
        191 : 'iquest', 
        192 : 'Agrave', 
        193 : 'Aacute', 
        194 : 'Acirc', 
        195 : 'Atilde', 
        196 : 'Auml', 
        197 : 'Aring', 
        198 : 'AElig', 
        199 : 'Ccedil', 
        200 : 'Egrave', 
        201 : 'Eacute', 
        202 : 'Ecirc', 
        203 : 'Euml', 
        204 : 'Igrave', 
        205 : 'Iacute', 
        206 : 'Icirc', 
        207 : 'Iuml', 
        208 : 'ETH', 
        209 : 'Ntilde', 
        210 : 'Ograve', 
        211 : 'Oacute', 
        212 : 'Ocirc', 
        213 : 'Otilde', 
        214 : 'Ouml', 
        215 : 'times', 
        216 : 'Oslash', 
        217 : 'Ugrave', 
        218 : 'Uacute', 
        219 : 'Ucirc', 
        220 : 'Uuml', 
        221 : 'Yacute', 
        222 : 'THORN', 
        223 : 'szlig', 
        224 : 'agrave', 
        225 : 'aacute', 
        226 : 'acirc', 
        227 : 'atilde', 
        228 : 'auml', 
        229 : 'aring', 
        230 : 'aelig', 
        231 : 'ccedil', 
        232 : 'egrave', 
        233 : 'eacute', 
        234 : 'ecirc', 
        235 : 'euml', 
        236 : 'igrave', 
        237 : 'iacute', 
        238 : 'icirc', 
        239 : 'iuml', 
        240 : 'eth', 
        241 : 'ntilde', 
        242 : 'ograve', 
        243 : 'oacute', 
        244 : 'ocirc', 
        245 : 'otilde', 
        246 : 'ouml', 
        247 : 'divide', 
        248 : 'oslash', 
        249 : 'ugrave', 
        250 : 'uacute', 
        251 : 'ucirc', 
        252 : 'uuml', 
        253 : 'yacute', 
        254 : 'thorn', 
        255 : 'yuml', 
        402 : 'fnof', 
        913 : 'Alpha', 
        914 : 'Beta', 
        915 : 'Gamma', 
        916 : 'Delta', 
        917 : 'Epsilon', 
        918 : 'Zeta', 
        919 : 'Eta', 
        920 : 'Theta', 
        921 : 'Iota', 
        922 : 'Kappa', 
        923 : 'Lambda', 
        924 : 'Mu', 
        925 : 'Nu', 
        926 : 'Xi', 
        927 : 'Omicron', 
        928 : 'Pi', 
        929 : 'Rho', 
        931 : 'Sigma', 
        932 : 'Tau', 
        933 : 'Upsilon', 
        934 : 'Phi', 
        935 : 'Chi', 
        936 : 'Psi', 
        937 : 'Omega', 
        945 : 'alpha', 
        946 : 'beta', 
        947 : 'gamma', 
        948 : 'delta', 
        949 : 'epsilon', 
        950 : 'zeta', 
        951 : 'eta', 
        952 : 'theta', 
        953 : 'iota', 
        954 : 'kappa', 
        955 : 'lambda', 
        956 : 'mu', 
        957 : 'nu', 
        958 : 'xi', 
        959 : 'omicron', 
        960 : 'pi', 
        961 : 'rho', 
        962 : 'sigmaf', 
        963 : 'sigma', 
        964 : 'tau', 
        965 : 'upsilon', 
        966 : 'phi', 
        967 : 'chi', 
        968 : 'psi', 
        969 : 'omega', 
        977 : 'thetasym', 
        978 : 'upsih', 
        982 : 'piv', 
        8226 : 'bull', 
        8230 : 'hellip', 
        8242 : 'prime', 
        8243 : 'Prime', 
        8254 : 'oline', 
        8260 : 'frasl', 
        8472 : 'weierp', 
        8465 : 'image', 
        8476 : 'real', 
        8482 : 'trade', 
        8501 : 'alefsym', 
        8592 : 'larr', 
        8593 : 'uarr', 
        8594 : 'rarr', 
        8595 : 'darr', 
        8596 : 'harr', 
        8629 : 'crarr', 
        8656 : 'lArr', 
        8657 : 'uArr', 
        8658 : 'rArr', 
        8659 : 'dArr', 
        8660 : 'hArr', 
        8704 : 'forall', 
        8706 : 'part', 
        8707 : 'exist', 
        8709 : 'empty', 
        8711 : 'nabla', 
        8712 : 'isin', 
        8713 : 'notin', 
        8715 : 'ni', 
        8719 : 'prod', 
        8721 : 'sum', 
        8722 : 'minus', 
        8727 : 'lowast', 
        8730 : 'radic', 
        8733 : 'prop', 
        8734 : 'infin', 
        8736 : 'ang', 
        8743 : 'and', 
        8744 : 'or', 
        8745 : 'cap', 
        8746 : 'cup', 
        8747 : 'int', 
        8756 : 'there4', 
        8764 : 'sim', 
        8773 : 'cong', 
        8776 : 'asymp', 
        8800 : 'ne', 
        8801 : 'equiv', 
        8804 : 'le', 
        8805 : 'ge', 
        8834 : 'sub', 
        8835 : 'sup', 
        8836 : 'nsub', 
        8838 : 'sube', 
        8839 : 'supe', 
        8853 : 'oplus', 
        8855 : 'otimes', 
        8869 : 'perp', 
        8901 : 'sdot', 
        8968 : 'lceil', 
        8969 : 'rceil', 
        8970 : 'lfloor', 
        8971 : 'rfloor', 
        9001 : 'lang', 
        9002 : 'rang', 
        9674 : 'loz', 
        9824 : 'spades', 
        9827 : 'clubs', 
        9829 : 'hearts', 
        9830 : 'diams', 
        338 : 'OElig', 
        339 : 'oelig', 
        352 : 'Scaron', 
        353 : 'scaron', 
        376 : 'Yuml', 
        710 : 'circ', 
        732 : 'tilde', 
        8194 : 'ensp', 
        8195 : 'emsp', 
        8201 : 'thinsp', 
        8204 : 'zwnj', 
        8205 : 'zwj', 
        8206 : 'lrm', 
        8207 : 'rlm', 
        8211 : 'ndash', 
        8212 : 'mdash', 
        8216 : 'lsquo', 
        8217 : 'rsquo', 
        8218 : 'sbquo', 
        8220 : 'ldquo', 
        8221 : 'rdquo', 
        8222 : 'bdquo', 
        8224 : 'dagger', 
        8225 : 'Dagger', 
        8240 : 'permil', 
        8249 : 'lsaquo', 
        8250 : 'rsaquo', 
        8364 : 'euro'
    };
}

