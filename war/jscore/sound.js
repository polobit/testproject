/**
 * sound.js plays sounds within the browser. It uses HTML5 Audio to play sounds.
 * @param sound - sound name.
 **/
function play_sound(sound, is_web_url)
{
	var sound_url;

	if(sound)
		sound_url = '../res/' + sound + '.mp3';
	else
		sound_url = '../res/sound.wav';
	
	if(is_web_url)
		sound_url = sound
	try
	{
		// If browser supports html5 audio
		var audio = new Audio(sound_url);
		audio.play();
	}
	catch (err)
	{
		console.log("Error occured while playing sound " + err);
	}
}


