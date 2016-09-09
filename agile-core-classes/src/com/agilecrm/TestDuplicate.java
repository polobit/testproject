package com.agilecrm;

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
import java.util.SortedSet;
import java.util.StringTokenizer;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class TestDuplicate {

	public static String csvPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-core-classes/test1468556653714.csv";
	public static String inputFolderPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/tpl/min/flatfull";
	public static String outputFolderPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/tpl/min/locales/en";
	
	public static void listFilesForFolder(final File folder, Map<String, String> map) {
		for (final File fileEntry : folder.listFiles()) {
			if(fileEntry.getName().startsWith("min"))
				continue;
			
			if (fileEntry.isDirectory()) {
				listFilesForFolder(fileEntry, map);
			} else {
				try {
					FileInputStream fisTargetFile = new FileInputStream(fileEntry);
					String targetFileStr = IOUtils.toString(fisTargetFile, "UTF-8");
					
					constructHandlebarsTemplate(targetFileStr, map, fileEntry);
					
				} catch (Exception e) {
					e.printStackTrace();
				}
				
			}
		}
	}
	
	public static void constructHandlebarsTemplate(String fileInput, Map<String, String> map, File fileEntry) throws IOException{
		System.out.println(fileEntry.getName());
		HashMap<String, String> agilemap = new HashMap<String, String>();
		
		fileInput = fileInput.replace("\n", "");
		
		Matcher m = Pattern.compile(
                Pattern.quote("{{agile_lng_translate")
                + "(.*?)"
                + Pattern.quote("}}")
       ).matcher(fileInput);
		
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
					if(index++ == 0){
						module = object;
						continue;
					}
						
					index++;
					module_key = module_key + " " + object;
				}
		    	
		    	key = replaceEdgeChars(module) + "." + replaceEdgeChars(module_key);
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println(s1);
			}
		    
		    if(map.containsKey(key))
		    	agilemap.put("{{agile_lng_translate" + s1 + "}}", map.get(key));
		    else {
		    	System.out.println(s1);
		    	System.out.println(key);
		    }
		}
		
		
		for (Iterator iterator = agilemap.keySet().iterator(); iterator.hasNext();) {
			String type = (String) iterator.next();
			fileInput = fileInput.replace(type, agilemap.get(type));
		}
		
		// Write into file
		PrintWriter pw = new PrintWriter(new File(outputFolderPath + "/" + fileEntry.getName()));
		pw.write(fileInput);
		pw.close();	
	}
	
	public static void readFiles(Map<String, String> map){
		
		final File folder = new File(inputFolderPath);
		listFilesForFolder(folder, map);
	}
	
	public static Map<String, String> readCSV(){
		
		Map<String, String> keyMap = new HashMap<String, String>();
		
		//Input file which needs to be parsed
        BufferedReader fileReader = null;
         
        //Delimiter used in CSV file
        final String DELIMITER = ",";
        try
        {
            String line = "";
            //Create the file reader
            fileReader = new BufferedReader(new FileReader(csvPath));
             
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
	
	public static String replaceEdgeChars(String str){
		try {
			str = str.trim();
			if(str.startsWith("'") || str.startsWith("\""))
				str = str.substring(1, str.length());
			
			if(str.endsWith("'") || str.endsWith("\""))
				str = str.substring(0, str.length() - 1);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return str;
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

		TreeSet set = (TreeSet) ((TreeSet) entriesSortedByValues(map)).descendingSet();
		Map<String, String> navigableMap = new LinkedHashMap<String, String>();
        for (Iterator iterator = set.iterator(); iterator.hasNext();) {
			Map.Entry<String, String> entry = (Map.Entry<String, String>) iterator.next();
			navigableMap.put(entry.getKey(), entry.getValue());
		}
        
        readFiles(navigableMap);
	}

	public static void main(String[] args) {
		templatize();
	}

}
