// receive sound
function playRecvSound() {
  playSound();
}
// send sound
function playSendSound(){
	playSound();
	
}
function playSound(){

    var smp3url = '../resources/sound.mp3';
    var swavurl = '../resources/sound.wav';
    var snd;
    try
    {   
    	// If browser supports html5 audio
         snd = new Audio(smp3url);
         snd.play();
         
    }catch(err)
   {
    	clickdeskLog("playSound Error :"+err);
    	
        try{
		        if(cd_ie_browser_version !== undefined && cd_ie_browser_version != null && cd_ie_browser_version <= 9){
		      	  
		      	    return;
		        }
		        try{  
		        	
		        if(BrowserDetect.browser == "Firefox" && BrowserDetect.version < 3.6 ){
		        	return;
		        }
		        
				if(FlashDetect.installed)
				{
			        document.getElementById("cd_playsound").innerHTML= 
						        '<object width="0" height="0">'+
								'<param name="src" value="'+smp3url+'">' +
								'<param name="autoplay" value="true">' +
								'<param name="autostart" value="true">' +
								'<param name="controller" value="true">'+
								'<embed src="'+smp3url+'" controller="true" autoplay="true" autostart="True" type="audio/mp3" />'+
								'</object>';
				}
				else {
					return;
				}
		        }catch(e){}
      	  
        }catch(err){
      	  clickdeskLog("playSound in flash :"+err);
        }    
   }
}