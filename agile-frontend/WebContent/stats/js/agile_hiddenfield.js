


window.addEventListener('load', 
  function() { 
    if(document.getElementById('agile-form')!=null){
      utmHiddenField();
    }    
  }, false);


function utmHiddenField(){  
  
  
    for ( var i = 0, len= localStorage.length;i<len; ++i ) {

      if(new RegExp("agile_").test(localStorage.key(i))){
       var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "_"+localStorage.key(i));
      input.setAttribute("value",localStorage.getItem(localStorage.key(i) ));
      document.getElementById("agile-form").appendChild(input);
      }
    }
  
}

