import java.io.File;
import java.io.FileWriter;

public class SpamFileWriter {
	
	//writing a email template in file
    boolean emailTemplateWriter(String email, String fileName){
		File file = new File("/home/spam-assassin/" + fileName + ".txt");
		
		try{
			    // creates the file
			    file.createNewFile();
			    
			    // creates a FileWriter Object
			    FileWriter writer = new FileWriter(file); 
			    
			    // Writes the content to the file
			    writer.write(email); 
			    writer.flush();
			    writer.close();
		   }
		catch(Exception e){
			System.err.println(e);
		}
		return true;
	}
	
}
