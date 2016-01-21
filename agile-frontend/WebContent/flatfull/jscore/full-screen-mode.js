$(function(){
  //on clicking the full screen main page button 
  $("body").on("click", ".enable-element-full-screen", function(e){

      e.preventDefault();
      document.addEventListener("fullscreenchange",Detection);
      document.addEventListener("webkitfullscreenchange", Detection);
      document.addEventListener("mozfullscreenchange", Detection);
      document.addEventListener("MSFullscreenChange", Detection);

      screenfull.toggle();
    //$(this).closest("#content")[0] 
  });
  
});

 function Detection()
 {
      var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
          if(isFullScreen)
          {
              $("#toggle-fullscreen-icon").attr('class','fa fa-compress');
          }
          else
          {
              $("#toggle-fullscreen-icon").attr('class','fa fa-expand');
          }
              

}
//cicking the fullscreen button for the contact page
$("body").on("click",".fullscreenelement",function(elem){

     // Get closest target elem
     var targetEle = $(this).attr("targetFullscreenElement");
     if(!targetEle)
         targetEle = "#content";

      $("#aside").toggleClass("hide");

      // Target closest element 
      var elem1 = $(targetEle)[0];
      $(elem1).toggleClass("fullscreenwidjet");

      // Toggle icons
      $("#toggle-screen-icon", $(targetEle)[0]).attr("class","fa fa-" + ($(elem1).hasClass("fullscreenwidjet") ? "compress" : "expand"));

});
  
  




  /*!
* screenfull
* v3.0.0 - 2015-11-24
* (c) Sindre Sorhus; MIT License
*/
;(function () {
  'use strict';

  var isCommonjs = typeof module !== 'undefined' && module.exports;
  var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

  var fn = (function () {
    var val;
    var valLength;

    var fnMap = [
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
      ],
      // new WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      // old WebKit (Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'

      ],
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
      ],
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
      ]
    ];

    var i = 0;
    var l = fnMap.length;
    var ret = {};

    for (; i < l; i++) {
      val = fnMap[i];
      if (val && val[1] in document) {
        for (i = 0, valLength = val.length; i < valLength; i++)
         {
          ret[fnMap[0][i]] = val[i];
         }
        return ret;
      }
    }

    return false;
  })();

  var screenfull = {
    request: function (elem) {
      var request = fn.requestFullscreen;

      elem = elem || document.documentElement;

      // Work around Safari 5.1 bug: reports support for
      // keyboard in fullscreen even though it doesn't.
      // Browser sniffing, since the alternative with
      // setTimeout is even worse.
      if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) 
      {
          elem[request]();
      } 
      else
      {
        elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
      }
    },
    exit: function ()
     {
      document[fn.exitFullscreen]();
     },
    toggle: function (elem) {

      if (this.isFullscreen) {
        
        this.exit();
      } 
      else
       {
        $("#content").css("height",100+'vh');
       this.request(elem);
       }
      
    },
    raw: fn
  };

  if (!fn) {
    if (isCommonjs) {
      module.exports = false;
    } else {
      window.screenfull = false;
    }

    return;
  }

  Object.defineProperties(screenfull, {
    isFullscreen: {
      get: function () {
        return Boolean(document[fn.fullscreenElement]);
      }
    },
    element: {
      enumerable: true,
      get: function () {
        return document[fn.fullscreenElement];
      }
    },
    enabled: {
      enumerable: true,
      get: function () {
        // Coerce to boolean in case of old WebKit
        return Boolean(document[fn.fullscreenEnabled]);
      }
    }
  });

  if (isCommonjs) {
    module.exports = screenfull;
  } else {
    window.screenfull = screenfull;
  }
})();