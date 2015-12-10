/* functions related to audio */

/**
 * Add audio tag in home.jsp after SIP registration is done successfully.
 * It is required for Voice in Call. It is SIP API requirement.
 */
function addAudio() {
	var audioElmt = document.getElementById("audio_remote");

	// Already added.
	if (audioElmt != undefined)
		return;
	else if (audioElmt == undefined) // not added.
	{
		// add audio
		$('body')
				.append(
						'<!-- Sip Audios --><audio id="audio_remote" autoplay="autoplay" />');
	}
}

/**
 * On incoming call it starts. On outgoing call after remote connect it will
 * starts.
 */
function startRingTone(sound) {
	try {
		Sip_Audio = new Audio("../res/" + sound + ".mp3");
		if (typeof Sip_Audio.loop == 'boolean') {
			Sip_Audio.loop = true;
		} else {
			var onEnded = function() {
				//console.log("play");
				this.play();
			};

			Sip_Audio.addEventListener('ended', onEnded, false);
		}

		Sip_Audio.play();
	} catch (e) {
		console.log("Error Sip_Audio can not play.");
	}
}

/**
 * Incoming call: After receive / missed / ignore from user and on error it
 * stops. Outgoing call: After received / missed / ignored from callee and on
 * error it stops.
 */
function stopRingTone() {
	try {
		Sip_Audio.pause();
	} catch (e) {
		console.log("Error Sip_Audio can not stop.");
	}
}
