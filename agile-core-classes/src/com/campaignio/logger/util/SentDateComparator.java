package com.campaignio.logger.util;

import java.util.Comparator;

import com.campaignio.wrapper.LogWrapper;

public class SentDateComparator implements Comparator<LogWrapper>
{

	@Override
	public int compare(LogWrapper log1, LogWrapper log2)
	{
		int result = 0;
		try
		{
			result = (log1.time.compareTo(log2.time));
			return result;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		return result;
	}

}
