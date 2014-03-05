function sipSendDTMF(c)
{
	console.log("In sipSendDTMF: " + c);

	if (Sip_Session_Call && c)
	{
		if (Sip_Session_Call.dtmf(c) == 0)
		{
			try
			{
				var sound = $("#dtmfTone")[0];
				sound.load();
				sound.play();
			}
			catch (e)
			{
			}
		}
	}
}
