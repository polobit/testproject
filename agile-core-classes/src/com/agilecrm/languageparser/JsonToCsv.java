package com.agilecrm.languageparser;

import java.io.File;
import java.io.FileReader;
import java.io.PrintWriter;
import java.util.Calendar;
import java.util.Iterator;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class JsonToCsv {

	public static void parseLanguageJSON() {

		try {

			JSONParser parser = new JSONParser();
			JSONObject obj = (JSONObject) parser
					.parse(new FileReader("/Users/govindchunchula/Desktop/i18/resources_en-4.json"));

			obj = (JSONObject) obj.get("en");

			PrintWriter pw = new PrintWriter(new File("test" + Calendar.getInstance().getTimeInMillis() + ".csv"));
			StringBuilder sb = new StringBuilder();
			sb.append("Key");
			sb.append(',');
			sb.append("Value");
			sb.append('\n');
			int i = 0;

			Iterator iterator = obj.keySet().iterator();
			while (iterator.hasNext()) {
				String key = (String) iterator.next();
				System.out.println(key);

				JSONObject valueJSON = (JSONObject) obj.get(key);
				Iterator valueIterator = valueJSON.keySet().iterator();
				while (valueIterator.hasNext()) {
					String valueKey = (String) valueIterator.next();

					String encodedValueKey = ParserUtil.encodeDelimeter(valueKey);
					String encodedVal = ParserUtil.encodeDelimeter(valueJSON.get(valueKey).toString());

					sb.append(key + "." + encodedValueKey);
					sb.append(',');
					sb.append(encodedVal);

					sb.append('\n');
				}
			}

			pw.write(sb.toString());
			pw.close();
			System.out.println("done!" + i);

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}
}
