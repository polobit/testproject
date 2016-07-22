$(function(){

    //checkboxes
    $(':checkbox').radiocheck();

    //tabs
    $(".nav-tabs a").on('click', function (e) {
        e.preventDefault();
        $(this).tab("show");
    });

    $('.portfolio a.over').each(function(){

        overlay = $('<span class="overlay"><span class="fui-eye"></span></span>');

        $(this).append( overlay );
    });


    $('.videoWrapper').on('click', function(e) {
        e.preventDefault();
        $currentEl = $(this);
        var videoPlaceholder = $currentEl.find("img.video_placeholder");
        var videoUrl = videoPlaceholder.attr('data-video');
        var splitArr = videoUrl.split("?");
        var queryStringArr = ["autoplay=1"];
        if(typeof splitArr[1] != "undefined") {
            queryStringArr = queryStringArr.concat(splitArr[1].split("&"));
        }
        var autoPlayVideoUrl = splitArr[0] + "?" + queryStringArr.join("&");
        var videoIFrame = '<iframe src="' + autoPlayVideoUrl + '" frameborder="0" allowfullscreen></iframe>';
        $currentEl.html(videoIFrame);
    });

});