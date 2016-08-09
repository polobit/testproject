package com.agilecrm.languageparser;

public class ParserUtil {
	public static String encodeDelimeter(String value) {
		if (value != null)
			return value.replace(",", "&#44;");

		return value;
	}

	public static String decodeDelimeter(String value) {
		if (value != null)
			return value.replace("&#44;", ",");

		return value;

	}

	public static String replaceEdgeChars(String str) {
		try {
			str = str.trim();
			if (str.startsWith("'") || str.startsWith("\""))
				str = str.substring(1, str.length());

			if (str.endsWith("'") || str.endsWith("\""))
				str = str.substring(0, str.length() - 1);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return str;
	}
}
