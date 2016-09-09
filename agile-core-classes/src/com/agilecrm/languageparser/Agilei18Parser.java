package com.agilecrm.languageparser;

import java.io.File;
import java.util.Map;

public class Agilei18Parser {
	// Defaults
	public static String csvPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-core-classes/test1468556653714.csv";
	public static String inputFolderPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/tpl/min/flatfull";
	public static String outputFolderPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/tpl/min";

	// Server files
	public static String serverInputFolderPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/flatfull/tpl";
	public static String serverOutputFolderPath = "/Users/govindchunchula/Documents/agile-git/agile-java-server/agile-frontend/WebContent/tpl/localestmp";

	public static void localize(String csvPath, String inputFolderPath, String outputFolderPath, String language) {
		Map<String, String> map = Csv2Json.readCSV(csvPath);

		// Create destination folders
		new File(outputFolderPath).mkdir();
		// Add locales folder
		outputFolderPath += "/locales";
		new File(outputFolderPath).mkdir();

		// Add language folder
		outputFolderPath += "/" + language;
		new File(outputFolderPath).mkdir();

		parseAndLocalizeFiles(map, inputFolderPath, outputFolderPath);
	}

	public static void parseAndLocalizeFiles(Map<String, String> map, String inputFolderPath, String outputFolderPath) {

		final File folder = new File(inputFolderPath);
		final File outputFolder = new File(outputFolderPath);
		HtmlParser.localizeFilesForFolder(folder, map, outputFolder);
	}

	public static void main(String[] args) {

		if (args == null || args.length == 0)
			return;

		String inputFolder = "", outputFolder = "", languages = "";
		for (int i = 0; i < args.length; i++) {
			if (i == 0)
				inputFolder = args[i];
			else if (i == 1)
				outputFolder = args[i];
			else if (i == 2)
				languages = args[i];
		}

		String[] languagesArray = languages.split(",");
		for (int i = 0; i < languagesArray.length; i++) {
			localize(csvPath, inputFolder, outputFolder, languagesArray[i]);
		}
	}

}
