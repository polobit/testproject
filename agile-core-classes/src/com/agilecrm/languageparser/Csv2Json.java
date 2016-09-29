package com.agilecrm.languageparser;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;

public class Csv2Json {

	public static Map<String, String> readCSV(String csvPath) {

		Map<String, String> keyMap = new HashMap<String, String>();

		// Input file which needs to be parsed
		BufferedReader fileReader = null;

		// Delimiter used in CSV file
		final String DELIMITER = ",";
		try {
			String line = "";
			// Create the file reader
			fileReader = new BufferedReader(new FileReader(csvPath));

			// Read the file line by line
			while ((line = fileReader.readLine()) != null) {
				// Get all tokens available in line
				String[] tokens = line.split(DELIMITER);
				keyMap.put(ParserUtil.decodeDelimeter(tokens[0]), ParserUtil.decodeDelimeter(tokens[1]));
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				fileReader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return sortMap(keyMap);
	}

	static Map<String, String> sortMap(Map<String, String> map) {
		TreeSet set = (TreeSet) ((TreeSet) entriesSortedByValues(map)).descendingSet();
		Map<String, String> navigableMap = new LinkedHashMap<String, String>();
		for (Iterator iterator = set.iterator(); iterator.hasNext();) {
			Map.Entry<String, String> entry = (Map.Entry<String, String>) iterator.next();
			navigableMap.put(entry.getKey(), entry.getValue());
		}

		return navigableMap;

	}

	static <K, V extends Comparable<? super V>> SortedSet<Map.Entry<K, V>> entriesSortedByValues(Map<K, V> map) {
		SortedSet<Map.Entry<K, V>> sortedEntries = new TreeSet<Map.Entry<K, V>>(new Comparator<Map.Entry<K, V>>() {
			@Override
			public int compare(Map.Entry<K, V> e1, Map.Entry<K, V> e2) {
				int res = (e1.getValue().toString().length() - e2.getValue().toString().length());
				return res != 0 ? res : 1;
			}
		});
		sortedEntries.addAll(map.entrySet());
		return sortedEntries;
	}

}
