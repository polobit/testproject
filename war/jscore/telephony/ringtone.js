/* functions related to audio */

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
