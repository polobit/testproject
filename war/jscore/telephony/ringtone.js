/* functions related to audio */

/**
 * Add audio tag in home.jsp after SIP registration is done successfully.
 */
function addAudio()
{
	var audioElmt = document.getElementById("audio_remote");

	// Already added.
	if (audioElmt != null)
		return;
	else if (audioElmt == null) // not added.
	{
		// add audio
		$('body')
				.append(
						'<!-- Audios --><audio id="audio_remote" autoplay="autoplay" /><audio id="ringtone" loop><source src="/sounds/ringtone.wav" type="audio/wav" preload="auto"></source></audio><audio id="ringbacktone" loop><source src="/sounds/ringbacktone.wav" type="audio/wav" preload="auto"></source></audio><audio id="dtmfTone"><source src="/sounds/dtmf.wav" type="audio/wav" preload="auto"></source></audio>');
	}
}

/**
 * On incoming call it starts.
 */
function startRingTone()
{
	try
	{
		var sound = $("#ringtone")[0];
		sound.load();
		sound.play();
	}
	catch (e)
	{
	}
}

/**
 * After receive / missed / ignore from user and on error it stops.
 */
function stopRingTone()
{
	try
	{
		ringtone.pause();
	}
	catch (e)
	{
	}
}

/**
 * On outgoing call after remote connect it will starts.
 */
function startRingbackTone()
{
	try
	{
		var sound = $("#ringbacktone")[0];
		sound.load();
		sound.play();
	}
	catch (e)
	{
	}
}

/**
 * After received / missed / ignored from callee and on error it stops.
 */
function stopRingbackTone()
{
	try
	{
		ringbacktone.pause();
	}
	catch (e)
	{
	}
}
