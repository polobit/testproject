function startDictation(element) {
      if($(element).hasClass("agile-feature-item-blink"))
           return;

      var recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
 
      recognition.lang = "en-US";
      recognition.start();

 	    $(element).addClass("agile-feature-item-blink");

      recognition.onresult = function(e) {
        $('#searchText').val(e.results[0][0].transcript);
        $("#speechDectation").closest(".input-group-btn").find("#search-results").trigger("click");
        stopDictation(element, recognition);
      };
 
      recognition.onerror = function(e) {
      	console.log(e)
        stopDictation(element, recognition);
        
         $("#speechDectation").removeClass("agile-feature-item-blink");
      }
}

function stopDictation(element, recognition){
      recognition.stop();
      $(element).removeClass("agile-feature-item-blink"); 
}