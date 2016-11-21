
(function (){
    "use strict";

    var appUI = require('./ui.js').appUI;
   
    //tooltip for form and video
    $('.agile-tooltip').tooltip({
        container: 'body'
    });


    $("#lp-instruct-popup").click(function(){

        if($("#lp-instruct-popup").prop("checked"))            
            localStorage.setItem("lp-instruct-popup",true);
        else
            localStorage.removeItem("lp-instruct-popup",false);
    });


}());