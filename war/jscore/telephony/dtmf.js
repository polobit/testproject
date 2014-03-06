/**
 * Onclick of number buttons in dialpad, It send dtmf tone to SIP and will play
 * sound on success.
 * 
 * @param c
 */
function sipSendDTMF(c)
{
	console.log("In sipSendDTMF: " + c);

	// session for call is active and number is available.
	if (Sip_Session_Call && c)
	{
		// send dtmf on SIP
		if (Sip_Session_Call.dtmf(c) == 0)
		{
			try
			{
				// play sound.
				play_sound("dtmf");
			}
			catch (e)
			{
			}
		}
	}
}
