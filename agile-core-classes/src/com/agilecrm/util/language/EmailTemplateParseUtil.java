package com.agilecrm.util.language;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONObject;

import com.agilecrm.languageparser.ParserUtil;
import com.agilecrm.util.JSONUtil;

public class EmailTemplateParseUtil {

	static Pattern pattern = Pattern.compile(Pattern.quote("{{agile_lng_translate") + "(.*?)" + Pattern.quote("}}"));

	public static String constructEmailTemplate(String fileInput, JSONObject map) throws IOException {

		// Replace all newlines(\r\n/\n) into empty space to make single line
		// fileInput = fileInput.replace("\n", "");

		if(map == null)
			 return fileInput;
					 
		Matcher m = pattern.matcher(fileInput);
		HashMap<String, String> agilemap = getKeysMapOfFile(m, map);
System.out.println(m);

		for (Iterator iterator = agilemap.keySet().iterator(); iterator.hasNext();) {
			String type = (String) iterator.next();
			fileInput = fileInput.replace(type, agilemap.get(type));
		}

		return fileInput;
	}

	static HashMap<String, String> getKeysMapOfFile(Matcher m, JSONObject map) {
		HashMap<String, String> agilemap = new HashMap<String, String>();

		while (m.find()) {
			String s = m.group(1);
			String s1 = s;
			String key = "", module = "", module_key = "";
			int index = 0;

			try {
				s = s.trim();
				StringTokenizer tokenizer = new StringTokenizer(s, " ");
				while (tokenizer.hasMoreTokens()) {
					String object = (String) tokenizer.nextToken();
					if (index++ == 0) {
						module = object;
						continue;
					}

					// index++;
					module_key = module_key + " " + object;
				}

				key = ParserUtil.replaceEdgeChars(module) + "." + ParserUtil.replaceEdgeChars(module_key);
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println(s1);
			}

			if (map.has(key))
				agilemap.put("{{agile_lng_translate" + s1 + "}}", JSONUtil.getJSONValue(map, key));
			else {
				// Error Key not found in CSV
				System.out.println("ERROR -> " + s1 + " : " + key);
			}
		}

		return agilemap;
	}
}
