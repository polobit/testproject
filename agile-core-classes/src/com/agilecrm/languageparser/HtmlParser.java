package com.agilecrm.languageparser;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;

public class HtmlParser {

	static Pattern pattern = Pattern.compile(Pattern.quote("{{agile_lng_translate") + "(.*?)" + Pattern.quote("}}"));

	public static void parseAndLocalizeFiles(Map<String, String> map, String inputFolderPath, String outputFolderPath) {

		final File folder = new File(inputFolderPath);
		localizeFilesForFolder(folder, map, outputFolderPath);
	}

	public static void localizeFilesForFolder(final File folder, Map<String, String> map, String outputFolderPath) {
		for (final File fileEntry : folder.listFiles()) {
			if (fileEntry.getName().startsWith("min"))
				continue;

			if (fileEntry.isDirectory()) {
				localizeFilesForFolder(fileEntry, map, outputFolderPath);
			} else {
				try {
					FileInputStream fisTargetFile = new FileInputStream(fileEntry);
					String targetFileStr = IOUtils.toString(fisTargetFile, "UTF-8");

					constructHandlebarsTemplate(targetFileStr, map, fileEntry, outputFolderPath);

				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	public static void constructHandlebarsTemplate(String fileInput, Map<String, String> map, File fileEntry,
			String outputFolderPath) throws IOException {
		System.out.println(fileEntry.getName());

		HashSet newLinePositions = newLinePositions(fileInput);

		// Replace all newlines into single lines
		fileInput = fileInput.replace("\n", "");

		Matcher m = pattern.matcher(fileInput);
		HashMap<String, String> agilemap = getKeysMapOfFile(m, map);

		for (Iterator iterator = agilemap.keySet().iterator(); iterator.hasNext();) {
			String type = (String) iterator.next();
			fileInput = fileInput.replace(type, agilemap.get(type));
		}

		fileInput = updatePositionsInFileString(fileInput, newLinePositions);

		// Write into file
		PrintWriter pw = new PrintWriter(new File(outputFolderPath + "/" + fileEntry.getName()));
		pw.write(fileInput);
		pw.close();
	}

	static String updatePositionsInFileString(String fileInput, HashSet newLinePositions) {
		System.out.println(newLinePositions);
		return fileInput;
	}

	static HashSet newLinePositions(String str) {
		String newLine = "\n";
		HashSet set = new HashSet();
		for (int index = str.indexOf(newLine); index >= 0; index = str.indexOf(newLine, index + 1)) {
			set.add(index);
		}
		return set;
	}

	static HashMap<String, String> getKeysMapOfFile(Matcher m, Map<String, String> map) {
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

					index++;
					module_key = module_key + " " + object;
				}

				key = ParserUtil.replaceEdgeChars(module) + "." + ParserUtil.replaceEdgeChars(module_key);
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println(s1);
			}

			if (map.containsKey(key))
				agilemap.put("{{agile_lng_translate" + s1 + "}}", map.get(key));
			else {
				System.out.println(s1);
				System.out.println(key);
			}
		}

		return agilemap;
	}
}
