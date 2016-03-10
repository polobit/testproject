package com.campaignio.logger.util;

import java.util.Comparator;

import com.campaignio.wrapper.LogWrapper;

public class TimeComparator implements Comparator<LogWrapper>
{

	@Override
	public int compare(LogWrapper log1, LogWrapper log2)
	{
		int result = 0;
		try
		{
			result = (log2.time.compareTo(log1.time));
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
