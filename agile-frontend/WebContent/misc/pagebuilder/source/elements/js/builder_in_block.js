(function () {

	//remove portfolio overlays

	var overlays = document.querySelectorAll('a > .overlay');

	for ( var i = 0; i < overlays.length; i++ ) overlays[i].remove();

    // control slide click event for background click
	try{                
       

        var firstLi = document.querySelectorAll('.carousel-indicators li[data-slide-to="0"]');
        var secondLi = document.querySelectorAll('.carousel-indicators li[data-slide-to="1"]');
        var thirdLi = document.querySelectorAll('.carousel-indicators li[data-slide-to="2"]');

        if(firstLi.length!==0)
            firstLi[0].addEventListener('click',function(e){
                    e.stopPropagation();
                    $('#myCarousel').carousel(0);
            });
        if(secondLi.length!==0)
            secondLi[0].addEventListener('click',function(e){
                    e.stopPropagation();
                    $('#myCarousel').carousel(1);
            });
        if(thirdLi.length!==0)
            thirdLi[0].addEventListener('click',function(e){
                    e.stopPropagation();
                    $('#myCarousel').carousel(2);
            });

        var leftslide=document.querySelectorAll('.carousel-control.left');
        var rightslide=document.querySelectorAll('.carousel-control.right');

        if(leftslide.length!==0)
            leftslide[0].addEventListener('click', function(e) {
                e.preventDefault();
                $('#myCarousel').carousel('prev');
                e.stopPropagation();
            });

        if(rightslide.length!==0)
            rightslide[0].addEventListener('click',function(e) {
                e.preventDefault();
                $('#myCarousel').carousel('next');
                e.stopPropagation();
            });
    }
    catch(e) {
        console.log(e);
    }


} ());