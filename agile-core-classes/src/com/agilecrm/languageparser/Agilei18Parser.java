package com.agilecrm.languageparser;

import java.util.Map;

public class Agilei18Parser {

	public static String csvPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-core-classes/test1468556653714.csv";
	public static String inputFolderPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/tpl/min/flatfull";
	public static String outputFolderPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/tpl/min/locales/en";

	public static void localize(String csvPath, String inputFolderPath, String outputFolderPath) {
		Map<String, String> map = Csv2Json.readCSV(csvPath);
		HtmlParser.parseAndLocalizeFiles(map, inputFolderPath, outputFolderPath);
	}

	public static void main(String[] args) {
		localize(csvPath, inputFolderPath, outputFolderPath);
	}

}
