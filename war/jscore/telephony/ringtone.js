/* functions related to audio */

/**
 * Add audio tag in home.jsp after SIP registration is done successfully.
 */
function addAudio()
{
	var audioElmt = document.getElementById("audio_remote");

	console.log("audioElmt");console.log(audioElmt);
	
	// Already added.
	if (audioElmt != null)
		return;
	else if (audioElmt == null) // not added.
	{
		// add audio
		$('body')
				.append(
						'<!-- Sip Audios --><audio id="audio_remote" autoplay="autoplay" />');
	}
}

/**
 * On incoming call it starts.
 * On outgoing call after remote connect it will starts.
 */
function startRingTone(sound)
{
	try
	{		
		Sip_Audio = new Audio("../res/"+sound+".mp3");
		Sip_Audio.loop = true;
		/*Sip_Audio.autoplay = true;
		Sip_Audio.preload="auto";*/
		
		var onEnded = function() {
			//console.log("play");
		    this.play();
		};

		Sip_Audio.addEventListener('ended', onEnded, false);
		
		Sip_Audio.play();
	}
	catch (e)
	{
		console.log("Error Sip_Audio play.");
	}
}

/**
 * Incoming call: After receive / missed / ignore from user and on error it stops.
 * Outgoinging call: After received / missed / ignored from callee and on error it stops.
 */
function stopRingTone()
{
	try
	{
		Sip_Audio.pause();
	}
	catch (e)
	{
		console.log("Error Sip_Audio stop.");
	}
}
