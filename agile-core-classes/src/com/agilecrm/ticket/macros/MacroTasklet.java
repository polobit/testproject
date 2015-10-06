package com.agilecrm.ticket.macros;

import org.json.JSONObject;

public interface MacroTasklet
{

	void run(JSONObject macroJSON, JSONObject ticketJSON, JSONObject nodeJSON);

}
