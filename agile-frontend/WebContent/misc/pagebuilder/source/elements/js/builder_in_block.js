(function () {

	//remove portfolio overlays

	var overlays = document.querySelectorAll('a > .overlay');

	for ( var i = 0; i < overlays.length; i++ ) overlays[i].remove();

	$('.carousel-control.left').click(function(e) {
        $('#myCarousel').carousel('prev');
        e.stopPropagation();
    });

    $('.carousel-control.right').click(function(e) {
        $('#myCarousel').carousel('next');
        e.stopPropagation();
	});

} ());