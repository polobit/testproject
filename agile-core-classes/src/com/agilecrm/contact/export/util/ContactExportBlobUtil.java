package com.agilecrm.contact.export.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

public class ContactExportBlobUtil
{

    /**
     * Constructs contact csv and write to blobstore. Returns blob file path to
     * fetch blob later through BlobStore API. There are two cases to handle
     * file writing to blobstore:
     * <p>
     * When there is no filter (i.e., isNoFilter is false), all contacts are
     * obtained at a time. So after writing to CSV completed, writeChannel is
     * closed immediately.
     * </p>
     * <p>
     * If there is a filter, 500 contacts are obtained each time. So
     * writeChannel shouldn't be closed immediately.
     * </p>
     * 
     * @param contacts
     *            - List of Contacts.
     * @param isNoFilter
     *            - Flag to identify whether filter is given or not.
     * @return String
     */
    /*
     * public static String writeContactCSVToBlobstore(List<Contact> contacts,
     * String[] header, Boolean isNoFilter, String fileName) { String path =
     * null;
     * 
     * try { // Get a file service FileService fileService =
     * FileServiceFactory.getFileService();
     * 
     * // Create a new Blob file with mime-type "text/csv" AppEngineFile file =
     * fileService.createNewBlobFile("text/csv", fileName);
     * 
     * // Open a channel to write to it boolean lock = false; FileWriteChannel
     * writeChannel = fileService.openWriteChannel(file, lock);
     * 
     * // Builds Contact CSV ContactExportCSVUtil.writeContactCSV(writeChannel,
     * contacts, header, true);
     * 
     * // Blob file Path path = file.getFullPath();
     * 
     * System.out.println("Path of blob file in writeContactCSVToBlobstore " +
     * path);
     * 
     * // All contacts are obtained at a time. if (isNoFilter == true) { System
     * .out.println("No filter is given, so closing channel immediately.");
     * 
     * lock = true; writeChannel = fileService.openWriteChannel(file, lock);
     * 
     * // Now finalize writeChannel.closeFinally(); }
     * 
     * } catch (Exception e) { e.printStackTrace();
     * System.err.println("Exception occured in writeContactCSVToBlobstore " +
     * e.getMessage()); }
     * 
     * return path; }
     */
    /**
     * Appends content to existing blob file.
     * 
     * @param path
     *            - blob file path
     * @param contacts
     *            - contact list to convert to csv
     * @param isCompleted
     *            - flag to identity whether all contacts completed or not
     */
    /*
     * public static void editExistingBlobFile(String path, List<Contact>
     * contacts, String[] header, Boolean isCompleted) {
     * 
     * try {
     * 
     * System.out.println("Editing existing blob file...");
     * 
     * // If path is null return; if (path == null) {
     * System.out.println("Given blob file path is null in editExistingBlobFile"
     * ); return; }
     * 
     * // Get a file service FileService fileService =
     * FileServiceFactory.getFileService(); AppEngineFile file = new
     * AppEngineFile(path);
     * 
     * FileWriteChannel writeChannel = null; boolean lock = false;
     * 
     * // if contacts list not completed, write to channel without closing if
     * (!isCompleted) { // Open a channel to write to it writeChannel =
     * fileService.openWriteChannel(file, lock);
     * 
     * ContactExportCSVUtil.writeContactCSV(writeChannel, contacts, header,
     * false); return;
     * 
     * }
     * 
     * System.out.println("Closing blob file finally...");
     * 
     * // Close channel completely when contacts list completed lock = true;
     * writeChannel = fileService.openWriteChannel(file, lock);
     * 
     * writeChannel.closeFinally();
     * 
     * } catch (Exception e) { e.printStackTrace();
     * System.err.println("Exception occured in editExistingBlobFile " +
     * e.getMessage()); }
     * 
     * 
     * return; }
     */

    /**
     * Returns data stored in the blobfile with respect to given path.
     * 
     * @param path
     *            - blob file path.
     * @return String
     */
    /*
     * public static List<String> retrieveBlobFileData(String path) {
     * 
     * // if null return if (path == null) {
     * System.out.println("Obtained file path is null in retrieveBlobFileData"
     * ); return null; }
     * 
     * // Get a file service FileService fileService =
     * FileServiceFactory.getFileService(); AppEngineFile file = new
     * AppEngineFile(path);
     * 
     * // Now read from the file using the Blobstore API BlobKey blobKey =
     * fileService.getBlobKey(file);
     * 
     * // if blobKey null return if (blobKey == null) {
     * System.out.println("BlobKey of file having path " + path + " is null");
     * return null; }
     * 
     * // Get blob info BlobInfo blobInfo = new
     * BlobInfoFactory().loadBlobInfo(blobKey);
     * 
     * // BlobstoreService blobStoreService = //
     * BlobstoreServiceFactory.getBlobstoreService();
     * 
     * // Get size Long blobSize = blobInfo.getSize();
     * System.out.println("blobSize = " + blobSize);
     * 
     * // Returns partitions of data in list return
     * ContactExportBlobUtil.readBlobFilePartionsInList(blobKey);
     * 
     * 
     * return null; }
     */

    /**
     * Removes blob file with respect to path.
     * 
     * @param path
     *            - blob file path
     */
    public static void deleteBlobFile(BlobKey blobKey)
    {
	System.out.println("Deleting Blob File under ContactCSVExport...");

	/*
	 * try { // Get a file service FileService fileService =
	 * FileServiceFactory.getFileService(); AppEngineFile file = new
	 * AppEngineFile(path);
	 * 
	 * // Now read from the file using the Blobstore API BlobKey blobKey =
	 * fileService.getBlobKey(file);
	 * 
	 * // Delete blob from store before sending validation exception to //
	 * client BlobstoreService blobstoreService =
	 * BlobstoreServiceFactory.getBlobstoreService();
	 * blobstoreService.delete(blobKey); } catch (Exception e) {
	 * System.err.println("Got Exception in deleteBlobFile " +
	 * e.getMessage()); }
	 */

	try
	{
	    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

	    blobstoreService.delete(blobKey);

	}
	catch (Exception e)
	{
	    System.err.println("Got Exception in deleteBlobFile " + e.getMessage());
	}
    }

    /**
     * Reads entire blob data
     * 
     * @param blobKey
     *            - blobKey
     * @param blobSize
     *            - blob size
     * @param blobStoreService
     *            - blobstore service
     * @return byte[]
     */
    public static byte[] readBlobData(BlobKey blobKey, long blobSize, BlobstoreService blobStoreService)
    {
	byte[] allTheBytes = new byte[0];
	long amountLeftToRead = blobSize;
	long startIndex = 0;
	int attempt = 0;

	while (amountLeftToRead > 0 && attempt < 5)
	{
	    long amountToReadNow = Math.min(BlobstoreService.MAX_BLOB_FETCH_SIZE - 1, amountLeftToRead);
	    byte[] chunkOfBytes = blobStoreService.fetchData(blobKey, startIndex, startIndex + amountToReadNow - 1);

	    try
	    {
		allTheBytes = ArrayUtils.addAll(allTheBytes, chunkOfBytes);
	    }
	    catch (Exception e)
	    {
		System.err.println("Exception occured " + e.getMessage());

		System.out.println("Total size obtained till exception " + allTheBytes.length);

		// As we can fetch 32MB per API call, creating another service
		blobStoreService = BlobstoreServiceFactory.getBlobstoreService();

		amountLeftToRead += amountToReadNow;
		startIndex -= amountToReadNow;

		System.out.println("Attempting " + attempt + " time(s)");

		attempt++;
	    }

	    amountLeftToRead -= amountToReadNow;
	    startIndex += amountToReadNow;
	}

	return allTheBytes;
    }

    /**
     * Returns complete byte data in partitions. It can be used to overcome the
     * mail limit like Mandrill allows 25MB per message
     * 
     * @param blobKey
     *            - Blob key
     * @return partitions in List
     */
    public static List<String> readBlobFilePartionsInList(BlobKey blobKey)
    {

	if (blobKey == null)
	    return null;

	// Get blob info
	BlobInfo blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);
	BlobstoreService blobStoreService = BlobstoreServiceFactory.getBlobstoreService();

	// Get size
	Long blobSize = blobInfo.getSize();
	System.out.println("blobSize = " + blobSize);

	byte[] blobData = readBlobData(blobKey, blobSize, blobStoreService);
	String bytesInString = "";

	// Returns byte data in list
	List<String> blobPartitionList = new ArrayList<String>();

	System.out.println("blobData = " + blobData.length);

	long maxSize = (25 * 1024 * 1024);

	// Max iterations
	long iterations = (blobSize / maxSize) + 1;
	System.out.println("blobSize iterations = " + iterations);

	try
	{
	    bytesInString = new String(blobData, "UTF-8");
	}
	catch (Exception e)
	{
	    bytesInString = new String(blobData);
	}

	System.out.println(bytesInString.length());

	for (int i = 0; i < iterations; i++)
	{
	    String data = "";
	    int beginIndex = (int) (i * maxSize), endIndex = (int) (maxSize * (i + 1));
	    try
	    {
		data = bytesInString.substring(beginIndex, endIndex);

	    }
	    catch (Exception e)
	    {
		System.out.println("1 " + e.getMessage());
		endIndex = bytesInString.length();
		try
		{
		    data = bytesInString.substring(beginIndex, endIndex);
		}
		catch (Exception e2)
		{
		    System.out.println("2 " + e2.getMessage());
		}
	    }

	    blobPartitionList.add(data);

	}

	System.out.println(blobPartitionList.size());
	return blobPartitionList;

    }

    /*    *//**
     * Returns data stored in the blobfile with respect to given path.
     * 
     * @param path
     *            - blob file path.
     * @return String
     */
    /*
     * public static String getBlobKeyFromPath(String path) {
     * 
     * // if null return if (path == null) {
     * System.out.println("Obtained file path is null in retrieveBlobFileData"
     * ); return null; }
     * 
     * // Get a file service FileService fileService =
     * FileServiceFactory.getFileService(); AppEngineFile file = new
     * AppEngineFile(path);
     * 
     * // Now read from the file using the Blobstore API BlobKey blobKey =
     * fileService.getBlobKey(file); if (blobKey == null) {
     * System.out.println("BlobKey of file having path " + path + " is null");
     * return null; }
     * 
     * return blobKey.getKeyString();
     * 
     * return null; }
     */

}
