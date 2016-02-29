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

            self.bind('click', function () {

                $('div.row').removeClass('active');
                self.parent("div.row").addClass('active');
                $('#path').val(id);
                var t = self.data('type');

                $('#ptop').val(self.find('td:first').css('padding-top'));
                $('#pbottom').val(self.find('td:first').css('padding-bottom'));
                $('#pleft').val(self.find('td:first').css('padding-left'));
                $('#pright').val(self.find('td:first').css('padding-right'));

                $('#common-settings').show();
                $('#padding-setting').show();
                switch (t) {
                    case 'title':

                        var titleElement = self.find('.title');
                        $('.selected-item').removeClass('selected-item').css('border', 'none');
                        var fontcolor = titleElement.css('fontColor');
                        var text =        titleElement.html();
                        var fontsize =    titleElement.css('font-size');
                        var fontfamily =  titleElement.css('font-family');
                        var background =  self.css('background-color');
                        $('#selector').val('.title');
                        storeValues(self, fontcolor, text, fontsize, fontfamily, background);
                        break;

                    case 'text-block' :
                        $('.selected-item').removeClass('selected-item').css('border', 'none');
                        var fontcolor = $('#' + $('#path').val() + ' tbody tr td').css('fontColor');
                        var text = $('#' + $('#path').val()).find('div.textFix').html();
                        var fontsize = $('#' + $('#path').val()).find('div').css('font-size');
                        var fontfamily = $('#' + $('#path').val()).find('div').css('font-family');
                        var background = $('#' + $('#path').val()).css('backgroundColor');
                        $('#selector').val('div.textFix');
                        storeValues(self, fontcolor, text, fontsize, fontfamily, background);
                        break;

                    case 'image':
                        $('.selected-item').removeClass('selected-item').css('border', 'none');
                        $('#bgcolor').css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        var img = self.find('img');
                        var imageid = img.attr('id');

                        if (typeof imageid === typeof undefined || imageid === false) {
                            img.attr('id', guid());
                            imageid = img.attr('id');
                        }
                        $('#imageid').val(imageid);
                        $('#image-url').val(img.attr('src'));
                        $('#image-url').data('id', imageid );

                        $('#image-w').val(img.css('width'));
                        $('#image-h').val(img.css('height'));

                        $('#image-link').val("");
                        if(img.parent('a').length) {
                            $('#image-link').val(img.parent('a').attr('href'));
                        }

                        hideAllSettings();
                        $('#imageproperties').show();

                        break;
                    case 'imgtxtcol':
                        $('.selected-item').removeClass('selected-item').css('border', 'none');
                        $('#bgcolor').css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
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

                        $('#image-w').val(img.css('width'));
                        $('#image-h').val(img.css('height'));

                        $('#image-link').val("");
                        if(img.parent('a').length) {
                            $('#image-link').val(img.parent('a').attr('href'));
                        }

                        hideAllSettings();
                        $('#imageproperties').show();
                        break;
                    case 'imgtxtincol':
                        $('.selected-item').removeClass('selected-item').css('border', 'none');

                        $('#bgcolor').css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        var imgs = self.find('td.imageInColumn img');

                        imgs.each(function (i) {
                            var img = $(this);
                            var imageid = img.attr('id');
                            if (typeof imageid === typeof undefined || imageid === false) {
                                img.attr('id', guid());
                            }
                        });

                        hideAllSettings();
                        handleButtonsTxt(self);
                        break;
                    case 'imgtxt':
                        $('.selected-item').removeClass('selected-item').css('border', 'none');
                        //    $('#'+$('#path').val()).unbind('click');
                        $('#bgcolor').css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
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

                        $('#image-w').val(img.css('width'));
                        $('#image-h').val(img.css('height'));

                        $('#image-link').val("");
                        if(img.parent('a').length) {
                            $('#image-link').val(img.parent('a').attr('href'));
                        }

                        hideAllSettings();
                        $('#imageproperties').show();

                        break;

                    case 'line':
                        $('#bgcolor').css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('.selected-item').removeClass('selected-item').css('border', 'none');
                        hideAllSettings();
                        break;

                    case 'button':
                        $('#bgcolor').css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('.selected-item').removeClass('selected-item').css('border', 'none');
                        hideAllSettings();
                        handleButtons(self);
                        break;

                    case 'social-links':

                        $('#bgcolor').css('backgroundColor', $('#' + $('#path').val()).css('backgroundColor'));
                        $('.selected-item').removeClass('selected-item').css('border', 'none');
                        $('#selector').val('tr td');


                        if (self.find('a.facebook').is(":visible")) {
                            $('input.social-check :eq(0)').prop('checked', true);
                        } else {
                            $('input.social-check :eq(0)').prop('checked', false);
                        }

                        if (self.find('a.twitter').is(":visible")) {
                            $('input.social-check :eq(1)').prop('checked', true);
                        } else {
                            $('input.social-check :eq(1)').prop('checked', false);
                        }

                        if (self.find('a.linkedin').is(":visible")) {
                            $('input.social-check :eq(2)').prop('checked', true);
                        } else {
                            $('input.social-check :eq(2)').prop('checked', false);
                        }

                        if (self.find('a.youtube').is(":visible")) {
                            $('input.social-check :eq(3)').prop('checked', true);
                        } else {
                            $('input.social-check :eq(3)').prop('checked', false);
                        }


                        $('input.social-input[name="facebook"]').val(self.find('a.facebook').attr('href'));

                        $('input.social-input[name="twitter"]').val(self.find('a.twitter').attr('href'));

                        $('input.social-input[name="linkedin"]').val(self.find('a.linkedin').attr('href'));

                        $('input.social-input[name="youtube"]').val(self.find('a.youtube').attr('href'));

                        hideAllSettings();
                        $('#social-links').show();


                        break;

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

function addhttp(url) {
    // if (url.substr(0, 7) != 'http://') {
    //     url = 'http://' + url;
    // }
    // if (url.substr(url.length - 1, 1) != '/') {
    //     url = url + '/';
    // }
    return url;
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

        // if (btn.data('default') !== '1') {

        clone.find('div.form-group > input[name="btn_title"]').val(btn.html())
                .change(function () {
                    btn.html($(this).val());
                });
        //}

        clone.find('div.input-group > input[name="btn_link"]').val(btn.attr('href'))
                .change(function () {
                    btn.attr('href', addhttp($(this).val()));
                    btn.unbind('click');
                    btn.bind('click', function (e) {
                        e.preventDefault()
                    });
                });

        clone.find('div.buttonStyle').popover({
            title: 'Button Style',
            html: true,
            content: clone.find('div.stylebox').html()
        }).css('backgroundColor', btn.css('backgroundColor')).css('color', btn.css('fontColor'));

        clone.find('.trashbutton').css('cursor', 'pointer').click(function () {
            if ($('#buttonslist li').length !== 2) {
                $(this).parent('li').slideUp(500);
                $(this).parent('li').detach();
                btn.parent('td').detach();
                $('#add-button').show();
            } else {
                alert('You can\'t remove this element');
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

        // if (btn.data('default') !== '1') {

        clone.find('div.form-group > input[name="btn_title"]').val(btn.html())
                .change(function () {
                    btn.html($(this).val());
                });
        //}

        clone.find('div.input-group > input[name="btn_link"]').val(btn.attr('href'))
                .change(function () {
                    btn.attr('href', addhttp($(this).val()));
                    btn.unbind('click');
                    btn.bind('click', function (e) {
                        e.preventDefault()
                    });
                });

        clone.find('div.buttonStyleTxt').popover({
            title: 'Button Style',
            html: true,
            content: clone.find('div.styleboxtxt').html()
        }).css('backgroundColor', btn.css('backgroundColor')).css('color', btn.css('fontColor'));

        clone.find('.trashbutton').css('cursor', 'pointer').click(function () {
            if (true) {
                $(this).parent('li').slideUp(500);
                $(this).parent('li').detach();
                btn.parent('td').detach();
            } else {
                alert('You can\'t remove this element');
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

    $('#bgcolor').css('backgroundColor', background);
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
        if(confirm('are you sure?')){
          //conta elem con lyrow
              if($('#tosave .lyrow').length>1){
                e.preventDefault();
                $(this).parent().remove();
                showElements();
              }else alert('you cannot remove all elements');
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
    var settingsHolderSelectors = ['#editor','#buttons','#buttonstxt','#imageproperties','#social-links'];
    if(typeof exceptThisElement != "undefined") {
        var index = settingsHolderSelectors.indexOf(exceptThisElement);
        if (index >= 0) {
          settingsHolderSelectors.splice( index, 1 );
        }
    }
    $(settingsHolderSelectors.join(',')).hide();
}

$(window).resize(function () {
    // $("body").css("min-height", $(window).height() - 90);
    // $(".demo").css("min-height", $(window).height() - 160);
    $("#tosave").css("height", $(window).height() - 30);
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
});

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

    $('#change-image').on('click', function(e){
        e.preventDefault();
         var id= $('#image-url').data('id');
         $('#'+id).attr('src', $('#image-url').val()) ;
         $('#'+id).attr('width', $('#image-w').val()) ;
         $('#'+id).attr('height', $('#image-h').val()) ;
         if($('#image-link').val()) {
            if($('#'+id).parent("a").length) {
                var anchorTag = $('#'+id).parent("a");
                $(anchorTag).attr('href', $('#image-link').val()) ;
            } else {
                $('#'+id).wrap("<a target='_blank' class='imgLink' href='"+$('#image-link').val()+"'>");
            }
         }
    });

    // paddings functions;
    $(document).on('change', '#ptop,#pbottom,#pleft,#pright', function (e) {

        $('#' + $('#path').val()).find('td:first').css('padding-top', $('#ptop').val());
        $('#' + $('#path').val()).find('td:first').css('padding-left', $('#pleft').val());
        $('#' + $('#path').val()).find('td:first').css('padding-right', $('#pright').val());
        $('#' + $('#path').val()).find('td:first').css('padding-bottom', $('#pbottom').val());

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
            button.find('a').html('default');
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
        var font_color = $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('color');
        var font_size = $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('font-size');
        var btn_size = $('#' + $('#path').val()).find('table tbody tr td:eq(' + index + ') a').css('width');

        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div.background span.picker').css('backgroundColor', bg);
        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div.fontcolor span.picker').css('backgroundColor', font_color);
        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div input[name="FontSize"]').val(font_size);
        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div input[name="ButtonSize"]').val(btn_size);

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

        $('#buttonslist li:eq(' + getIndex($(this).parent().parent(), $('#buttonslist li')) + ') div div div input[name="ButtonSize"]').change(function (e) {
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
        });



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
        var font_color = $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('color');
        var font_size = $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('font-size');
        var btn_size = $('#' + $('#path').val()).find('table tbody tr td a.textbuttonsimg:eq(' + index + ')').css('width');

        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div.background span.pickerTxt').css('backgroundColor', bg);
        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div.fontcolor span.pickerTxt').css('backgroundColor', font_color);
        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div input[name="FontSize"]').val(font_size);
        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div input[name="ButtonSize"]').val(btn_size);

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

        $('#buttonstxtlist li:eq(' + getIndex($(this).parent().parent(), $('#buttonstxtlist li')) + ') div div div input[name="ButtonSize"]').change(function (e) {
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
        });



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
        var name = $(this).attr('name');
        if ($(this).is(':checked')) {
            $('#' + $('#path').val()).find($('#selector').val() + ' a.' + name).show();
        } else {
            $('#' + $('#path').val()).find($('#selector').val() + ' a.' + name).hide();
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
        $('div.row').removeClass('active');
        $('.selected-item').removeClass('selected-item').css('border', 'none');
        // showElements();
        hideSettings();
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


    $(".demo .column").sortable({connectWith: ".column", opacity: .35, handle: ".drag"});
    $(".sidebar-nav .lyrow").draggable({connectToSortable: ".column", helper: 'clone',
        stop: function (e, t) {
            handleObjects();
            $(".demo .column").sortable({opacity: .35, connectWith: ".column"});
            $(".demo .column .lyrow").find('.drag').removeClass('hide');
        }});


    $("#save").click(function () {

        $('div.row').removeClass('active');
        $('.selected-item').removeClass('selected-item').css('border', 'none');

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
        $('.selected-item').removeClass('selected-item').css('border', 'none');
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

    $('#settings').on('click', '.confirm', function(e){
        e.preventDefault();
    });

    $('#tosave').on('click', '.imgLink', function(e){
        e.preventDefault();
    });

    $('#tosave').on('click', 'td.imageInColumn img', function(e) {
        $('.selected-item').removeClass('selected-item').css('border', 'none');
        var img = $(this);
        var imageid = $(this).attr('id');
        $('#imageid').val(imageid);
        $(this).css('border', '1px dotted red');
        $(this).addClass('selected-item');

        $('#image-url').val($(this).attr('src'));
        $('#image-url').data('id', imageid );

        $('#image-w').val($(this).css('width'));
        $('#image-h').val($(this).css('height'));
        $('#image-link').val("");
        if(img.parent('a').length) {
            $('#image-link').val(img.parent('a').attr('href'));
        }
        hideAllSettings();
        $('#imageproperties').show();
    });

    $('#tosave').on('click','.textFix',function(e) {
        e.stopPropagation();
        $('#common-settings').hide();

        var self = $(this).closest(".main");

        $('.selected-item').removeClass('selected-item').css('border', 'none');

        var fontcolor = $(this).css('fontColor');
        var text =        $(this).html();
        var fontsize =    $(this).css('font-size');
        var fontfamily =  $(this).css('font-family');
        var background =  $(this).css('background-color');

        $('#selector').val(".selected-item");
        $(this).addClass('selected-item');
        $(this).css('border','1px dotted red');

        storeValues(self, fontcolor, text, fontsize, fontfamily, background);
    });
    
    handleObjects();
    removeElm();
    configurationElm();
    hideAllSettings();

});


function loadSavedTemplate() {
    //this should be loaded first when dom is ready
    if(AGILE_EB_OPTIONS['templateId'] && AGILE_EB_OPTIONS['action'] == "edit") {
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
                $("#nameoftemplate",parent.document).val(data.name);
                $("#subject",parent.document).val(data.subject);
                $("#text_email",parent.document).val(data.text_email);
                if(data.attachment_id && data.attachment_id != "0") {
                    parent.setAttachmentInTemplateEdit(data.attachment_id);
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
        menubar: false,
        force_br_newlines: false,
        force_p_newlines: true,
        forced_root_block: '',
        selector: "#html5editor",
        plugins: "autolink lists link charmap code paste textcolor colorpicker paste",
        paste_as_text: true,
       // paste_word_valid_elements: "h1,h2,h3,b,strong,i,em",
        toolbar: "bold italic underline | alignleft aligncenter alignright | forecolor backcolor | bullist numlist | link | styleselect | merge_fields",
        setup: function (editor) {
            editor.addButton('merge_fields', { type : 'menubutton', text : 'Agile Contact Fields', icon : false, menu : parent.set_up_merge_fields(editor) });

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
        $("#browseBtn").text("uploading...");

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
              $('#change-image').trigger('click');
              $("#browseBtn").prop("disabled",false);
              $("#browseBtn").text("Browse");
            }
        });
    }
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