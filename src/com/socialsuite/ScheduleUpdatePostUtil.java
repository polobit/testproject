package com.socialsuite;

import java.util.List;

public class ScheduleUpdatePostUtil
{

	public static void postUpdates()
	{
		List<ScheduledUpdate> updates = ScheduledUpdate.getScheduledUpdatesToPost();

		if (updates == null)
			return;

		while (updates.size() > 0)
		{
			String result = null;
			ScheduledUpdate update = updates.get(0);
			Stream stream = new Stream();
			stream.domain_user_id = update.domain_user_id;
			stream.client_channel = null;
			stream.screen_name = update.screen_name;
			stream.network_type = null;
			stream.stream_type = null;
			stream.keyword = null;
			stream.token = update.token;
			stream.secret = update.secret;
			stream.column_index = 0;

			try
			{
				if (update.headline.equalsIgnoreCase("Tweet"))
				{
					result = SocialSuiteTwitterUtil.tweetInTwitter(stream, update.message);
				}
				else if (update.headline.equalsIgnoreCase("Reply"))
				{
					result = SocialSuiteTwitterUtil.replyTweetInTwitter(stream, update.message,
							Long.parseLong(update.tweetId), update.tweetOwner);
				}
				else if (update.headline.equalsIgnoreCase("Direct"))
				{
					result = SocialSuiteTwitterUtil.directMessageInTwitter(stream, update.message, update.tweetOwner);
				}
				else if (update.headline.equalsIgnoreCase("Retweet"))
				{
					result = SocialSuiteTwitterUtil.tweetInTwitter(stream, update.message);
				}

				if (result.equalsIgnoreCase("Successful"))
					update.delete();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}

			updates.remove(0);
		}

	}
}
