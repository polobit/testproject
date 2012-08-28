$(function(){
	
    $('#searchForm').keyup(function () {
    	   	
    	console.log('Searching');
    	
        // Get Value
        var keyword = $('#searchText').val();
        if (isNotValid(keyword) || keyword.length <= 2) {
            $('#searchForm').removeClass("open");
            return;
        }

    	console.log('Keyword ' + keyword);
        
        var view = new Base_Collection_View({
            url: '/core/api/contacts/search/' + keyword,
            restKey: "contact",
            templateKey: "search",
            individual_tag_name: 'li'
        });

        view.collection.fetch({
        	success: function()
        	{
        		 $('#searchForm').find('ul').remove();
        	     $('#searchForm').append(view.render().el);
        	     $('#searchForm').addClass("open");
        	}
        });
       
    });


    $('#search-menu').click(function () {
        $('#searchForm').removeClass("open");
        $('#searchText').val('');
    });	
});