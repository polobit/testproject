package com.agilecrm.activities;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Calendar;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class Test {

	public static int filesCount = 0;
	
	public static void listFilesForFolder(final File folder, Map<String, String> map) {
		for (final File fileEntry : folder.listFiles()) {
			if(fileEntry.getName().startsWith("min"))
				continue;
			
			if (fileEntry.isDirectory()) {
				listFilesForFolder(fileEntry, map);
			} else {
				filesCount++;
				try {
					FileInputStream fisTargetFile = new FileInputStream(fileEntry);
					String targetFileStr = IOUtils.toString(fisTargetFile, "UTF-8");
					
					constructHandlebarsTemplate(targetFileStr, map);
					
				} catch (Exception e) {
					e.printStackTrace();
				}
				
			}
		}
	}
	
	public static void constructHandlebarsTemplate(String fileInput, Map<String, String> map){
		Set<String> set = map.keySet();
		for (String key : set) {
			String val = map.get(key);
			
			// Search value in template
			String templateKey = "";
			if(key.split("\\.").length > 1){
				templateKey = "{{agile_translate \"" + key.split("\\.")[0] + "\" \"" + key.split("\\.")[1] + "\"}}";
			} else {
				templateKey = "{{agile_translate \"" + key.split("\\.")[0] + "\"}}"; 
			}
						
			// Search value in template
			// fileInput = fileInput.replace("\n", "");
			
			try {
				// fileInput = fileInput.replaceAll("\\s+" + val + "\\s+<", templateKey + "<");
				fileInput = fileInput.replaceAll(val + "<", templateKey + "<");
				fileInput = fileInput.replaceAll(val + " <", templateKey + "<");
				fileInput = fileInput.replaceAll(val + "\\s+<", templateKey + "<");
			} catch (Exception e) {
				// TODO: handle exception
			}
			
		}
		
		System.out.println(fileInput + "\n\n");
	}
	
	public static void readFiles(Map<String, String> map){
		
		final File folder = new File("/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/flatfull/tpl");
		listFilesForFolder(folder, map);
	}
	
	public static Map<String, String> readCSV(){
		
		Map<String, String> keyMap = new HashMap<String, String>();
		
		//Input file which needs to be parsed
        String fileToParse = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-core-classes/test1467710296757.csv";
        BufferedReader fileReader = null;
         
        //Delimiter used in CSV file
        final String DELIMITER = ",";
        try
        {
            String line = "";
            //Create the file reader
            fileReader = new BufferedReader(new FileReader(fileToParse));
             
            //Read the file line by line
            while ((line = fileReader.readLine()) != null) 
            {
                //Get all tokens available in line
                String[] tokens = line.split(DELIMITER);
                keyMap.put(decodeDelimeter(tokens[0]), decodeDelimeter(tokens[1]));
            }
        } 
        catch (Exception e) {
            e.printStackTrace();
        } 
        finally
        {
            try {
                fileReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        return keyMap;
	}

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

					String encodedValueKey = encodeDelimeter(valueKey);
					String encodedVal = encodeDelimeter(valueJSON.get(valueKey).toString());

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

	public static String encodeDelimeter(String value) {
		return StringUtils.replace(value, ",", "&#44;");
	}
	
	public static String decodeDelimeter(String value) {
		return StringUtils.replace(value, "&#44;", ",");
	}
	
	static <K,V extends Comparable<? super V>>
	SortedSet<Map.Entry<K,V>> entriesSortedByValues(Map<K,V> map) {
	    SortedSet<Map.Entry<K,V>> sortedEntries = new TreeSet<Map.Entry<K,V>>(
	        new Comparator<Map.Entry<K,V>>() {
	            @Override public int compare(Map.Entry<K,V> e1, Map.Entry<K,V> e2) {
	                int res = (e1.getValue().toString().length() - e2.getValue().toString().length());
	                return res != 0 ? res : 1;
	            }
	        }
	    );
	    sortedEntries.addAll(map.entrySet());
	    return sortedEntries;
	}
	
	public static void templatize(){
		Map<String, String> map = readCSV();
		System.out.println(map.size());

		TreeSet set = (TreeSet) ((TreeSet) entriesSortedByValues(map)).descendingSet();
		Map<String, String> navigableMap = new LinkedHashMap<String, String>();
        for (Iterator iterator = set.iterator(); iterator.hasNext();) {
			Map.Entry<String, String> entry = (Map.Entry<String, String>) iterator.next();
			navigableMap.put(entry.getKey(), entry.getValue());
		}
        System.out.println(navigableMap.size());
        
		readFiles(navigableMap);
	}

	public static void main(String[] args) {
		System.out.println(new Long("56348652402114565621"));
		// parseLanguageJSON();
		/*long time = Calendar.getInstance().getTimeInMillis();
		// readFiles();
		templatize();
		
		System.out.println(filesCount);
		System.out.println(Calendar.getInstance().getTimeInMillis() - time); */
	}

}
