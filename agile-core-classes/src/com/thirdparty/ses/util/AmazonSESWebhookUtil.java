package com.thirdparty.ses.util;


import java.io.BufferedReader;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.model.CreateTopicRequest;
import com.amazonaws.services.sns.model.CreateTopicResult;
import com.amazonaws.services.sns.model.DeleteTopicRequest;
import com.amazonaws.services.sns.model.ListSubscriptionsResult;
import com.amazonaws.services.sns.model.SubscribeRequest;
import com.amazonaws.services.sns.model.SubscribeResult;
import com.amazonaws.services.sns.model.Subscription;
/**
 * This <AmazonSESWebhookUtil> is used for adding webhook in Amazon SES through
 * Amazon SNS.
 * 
 * @author Prashannjeet
 *
 */

// Example SNS Receiver
public class AmazonSESWebhookUtil {

    /**
     * AWS Access key
     */
    public static String AWS_ACCESS_KEY = "AKIAJMWQKACPY4JE7D3A";
   
    /**
     * AWS Secret key
     */
    public static String AWS_SECRET_KEY = "5nWJ9saeHN0zfJ399Qedo4C2qd90Y0kKYiZFvsG9";
    
    /**
     *  Webhook url for HardBounce and SoftBoune
     */
    public static String AWS_WEBHOOK_URL = "http://requestb.in/1f3g4j81";
    
    /**
     *  Webhook topic name for HardBounce and SoftBoune
     */
    public static final String AWS_WEBHOOK_TOPIC="Agile-Amazon-Webhook";
    
    
    /**
     * This method will return BasicAWSCredentials of AWS amazon.
     * 
     * @param accessKey
     * @param secretKey
     * 
     * @return BasicAWSCredentials
     */
    public static BasicAWSCredentials getBasicAWSCredentials(String accessKey, String secretKey)
    {
    	return  new BasicAWSCredentials(accessKey, secretKey);
    }
    
    /**
     * This method will return authenticated object of AmazonSNSClient
     * 
     * @param AWS BasicAWSCredentials
     * @param AWS customer region
     * @return AmazonSNSClient
     */
    public static AmazonSNSClient getAmazonSNSCredentials(BasicAWSCredentials basicAWSCredentials, String region)
     {
    	AmazonSNSClient amazonSNSClient = new AmazonSNSClient(basicAWSCredentials);
    	
    	amazonSNSClient.withRegion(Regions.fromName(region));
    	
    	return amazonSNSClient;
    	
    }
    
    /**
     * This method will return authenticated object of AmazonSimpleEmailServiceClient
     * 
     * @param AWS BasicAWSCredentials
     * @param AWS customer region
     * @return AmazonSimpleEmailServiceClient
     *//*
    public static AmazonSimpleEmailServiceClient getAmazonSESCredentials(BasicAWSCredentials basicAWSCredentials, String region)
     {
    	AmazonSimpleEmailServiceClient amazonSESClient = new AmazonSimpleEmailServiceClient(basicAWSCredentials);
    	
    	amazonSESClient.withRegion(Regions.fromName(region));
    	
    	return amazonSESClient;
    	
    }
    
    *//**
     * This method will delete the Amazon SNS topic created for webhooks
     * If same topic name is exist
     * 
     * @param amazonSNSClient
     */
    public static void deleteAmazonSNSTopic(AmazonSNSClient amazonSNSClient)
    {
    	 ListSubscriptionsResult listSubscriptionsResult= amazonSNSClient.listSubscriptions();
    	 
         for(int index=0; index < listSubscriptionsResult.getSubscriptions().size(); index++)
         {
         	System.out.println(listSubscriptionsResult.getSubscriptions().get(index));
         	Subscription subscription=listSubscriptionsResult.getSubscriptions().get(index);
         		
         		if(subscription.getTopicArn().contains(AWS_WEBHOOK_TOPIC))
         		{
         			DeleteTopicRequest dtr=new DeleteTopicRequest().withTopicArn(subscription.getTopicArn());
         			amazonSNSClient.deleteTopic(dtr);
         		    System.out.println("AWS SNS topic of Webhooks deleted : " );
         		}
         }
    }
    
    /**
     * This method will create topic for webhooks in AmazonSNS
     * 
     * @param amazonSNSClient
     * @return Topic ARN name 
     * 						-- String
     */
    public static String createAmazonSNSTopic(AmazonSNSClient amazonSNSClient, String amazonSNSTopic)
    {
    	CreateTopicRequest createTopicRequest = new CreateTopicRequest().withName(amazonSNSTopic);
        
        CreateTopicResult createTopicResult= amazonSNSClient.createTopic(createTopicRequest);
        createTopicResult.getTopicArn();
        System.out.println("AWS SNS topic created successfully : ");
        
        return createTopicResult.getTopicArn();
    }
    
    /**
     * This method will add webhook URL in AmazonSNS topic as an
     * End point and send the subscription URL to webhook URL for 
     * confirmation of subscription
     * 
     * @param amazonSNSClient
     * @param topicArn
     */
    public static void subscribeAmazonSNSWithWebhook(AmazonSNSClient amazonSNSClient, String topicArn, String webhookURL)
    {
    	 SubscribeRequest subscribeRequest = new SubscribeRequest()
    	 .withTopicArn(topicArn)
    	 .withProtocol("http")
    	 .withEndpoint(webhookURL);
    	 
          SubscribeResult subscribeResult=amazonSNSClient.subscribe(subscribeRequest);
          subscribeResult.getSubscriptionArn();
    		        
          System.out.println("AmazonSNS subscription url sent :" );
    }
    
    /**
     * This method will check email domain is exist or not in AWS amazon
     * 
     * @param amazonSESClient
     * @param emailDomain
     * @return boolean
     *//*
    public static boolean isEmailDomainExist(AmazonSimpleEmailServiceClient amazonSESClient, String emailDomain)
    {
    	ListIdentitiesResult listIdentitiesResult=amazonSESClient.listIdentities();
    	
    	for(String amazonDomain :listIdentitiesResult.getIdentities())
    	{
    		if(amazonDomain.equalsIgnoreCase(emailDomain))
    			return true;
    	}
	  return false;
    }
    
    *//**
     * This method will enable headers for bounce and Complaint, means at the
     * time of heating our webhook url they will append email headers
     * 
     * @param amazonSESClient
     * @param emailDomain
     *//*
    public static void enabledAmazonSESNotificationHeaders(AmazonSimpleEmailServiceClient amazonSESClient, String emailDomain)
    {
    	SetIdentityHeadersInNotificationsEnabledRequest headersNotification=new SetIdentityHeadersInNotificationsEnabledRequest()
		.withEnabled(true)
		.withIdentity(emailDomain)
		.withNotificationType(NotificationType.Bounce);
    	
    	System.out.println("Enables AmazonSES header for Bounce : " + amazonSESClient.setIdentityHeadersInNotificationsEnabled(headersNotification));
    	
    	headersNotification.withNotificationType(NotificationType.Complaint);
    	
    	System.out.println("Enables AmazonSES header for Complaint : " + amazonSESClient.setIdentityHeadersInNotificationsEnabled(headersNotification));
    	
    	
    }
    
    public static void setAmazonSNSTopicToAmazonSES(AmazonSimpleEmailServiceClient amazonSESClient, String amazonSNSTopic, String emailDomain)
    {
    	SetIdentityNotificationTopicRequest notificationTopic=new SetIdentityNotificationTopicRequest()
		.withNotificationType(NotificationType.Bounce)
		.withSnsTopic(amazonSNSTopic)
		.withIdentity(emailDomain);
    	
    	System.out.println("Set AmazonSNS topic to AmazonSES for Bounce : " + amazonSESClient.setIdentityNotificationTopic(notificationTopic));
    	
    	notificationTopic.withNotificationType(NotificationType.Complaint);
    	System.out.println("Set AmazonSNS topic to AmazonSES for Complaint : " + amazonSESClient.setIdentityNotificationTopic(notificationTopic));
    }
    
    *//**
     * This method will add webhook ur in AmazonSNS
     * 
     * @param AWS credential accessKey
     * @param AWS credential secretKey
     * @param AWS customer region
     * @return true
     */
    public static void addAmazonSNSWebhooks(String accessKey, String secretKey, String region)
     {
    	//Get BasicAWSCredentials for AWS Amazon
    	BasicAWSCredentials basicAWSCredentials = getBasicAWSCredentials(accessKey, secretKey);
    	
    	/* Get the Authentication for AmazonSES
    	AmazonSimpleEmailServiceClient amazonSESClient = getAmazonSESCredentials(basicAWSCredentials, region);
    	
    	
    	//check email domain exist or not in AWS account
    	if(! isEmailDomainExist(amazonSESClient, emailDomain))
    		return ;*/
    	
    	//Get the authentication credential of AmazonSNS
    	AmazonSNSClient amazonSNSClient = getAmazonSNSCredentials(basicAWSCredentials, region);
    	
    	//Delete existing webhook and topics of AmazonSNS if already topic is there
    	 deleteAmazonSNSTopic(amazonSNSClient);
    	  
    	//Create a topic in AmazonSNS for Hard Bounce, Soft Bounce and Complaint
    	 String topicArn = createAmazonSNSTopic(amazonSNSClient, AWS_WEBHOOK_TOPIC);
    	 
    	//Subscribe topic and webhook url for Hard Bounce, Soft Bounce and Complaint
    	 subscribeAmazonSNSWithWebhook(amazonSNSClient, topicArn, AWS_WEBHOOK_URL);
    	 
    	/* //Set AmazonSNS topic into AmazonSES bounce topic for get notification
    	 setAmazonSNSTopicToAmazonSES(amazonSESClient, topicArn, emailDomain);
    	 
    	 //Enable notification headers for attach message heading with webhooks request.
    	 enabledAmazonSESNotificationHeaders(amazonSESClient, emailDomain);*/
        
     }
    
    /**
     * This method will Confirm Subscription of AmazonSNS
     * @param subscriptionURL
     * @return boolean
     */
    public static void subscribeAmazonSNSEndpoint(String subscriptionURL)
    {
    	try
    	{
			String response = HTTPUtil.accessURLUsingPost(subscriptionURL, null);
			
			System.out.println("Subscription Confirm response of AmazonSNS :" + response);
		} catch (Exception e)
		{
			System.out.println("Error occured while subscribing  AmazonSES webhooks ENdpoint URL. "+e.getMessage());
			return;
		}
    }
    
    
    /**
     * This method is used to read the json data form AmazonSES webhooks request 
     * @param request
     * @return
     */
     
     public static JSONObject readJSONDataFromRequest(HttpServletRequest request)
     {
     	StringBuilder buffer = new StringBuilder();
     	
     	BufferedReader reader;
     	
 		try
 		{
 			reader = request.getReader();
 			String line;
 	        while ((line = reader.readLine()) != null)
 	        {
 	            buffer.append(line);
 	        }
 	        
 	        JSONObject jsonData = new JSONObject(buffer.toString());
 	        
 	        System.out.println("Data is :"+jsonData.toString());
 	        
 	        return jsonData;
 	        
 		} catch (Exception e1) {
 			System.out.println("Error occured while fetching AmazonSES webhooks JSON. "+e1.getMessage());
 			return null;
 		}
     }
    public static void main(String ads[]){
    	subscribeAmazonSNSEndpoint("https://sns.us-west-2.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-west-2:643507279072:Agile-Amazon-Webhook&Token=2336412f37fb687f5d51e6e241d44a2cb367e21e4d39a6af05ab05571463ec3e4db763ea2fe0ddb034cdc4b619d1413cc9406bd656c059eeb795bb2c8b30d52335a85a661e649a9efea59eef368897f3166a4869c166fddb9bbb6fcf38f56ca0344996423dc77231e4330dd350b6a026c12780681a9a0f52c24f2837f7f151e4");
    }
    
    }
