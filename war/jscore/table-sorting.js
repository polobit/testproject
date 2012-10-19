function sortTables(table){
	
	head.js(LIB_PATH + "lib/jquery.tablesorter.min.js", function(){
		console.log("sortinggg");
		   
		$(table).tablesorter({ 
			
			  // pass the headers argument and assing a object 
	        headers: { 
	            0: { 
	                // disable it by setting the property sorter to false 
	                sorter: false 
	            }, 
	            
	        }
		
		});
	});
}