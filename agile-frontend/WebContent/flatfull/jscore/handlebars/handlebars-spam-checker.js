$(function()
{

	/**
	 * Helper function to return the value of a property matched with the given
	 * name from the array of properties
	 * 
	 * @method getPropertyValue
	 * @param {Object}
	 *            items array of objects
	 * @param {String}
	 *            name to get matched object value
	 * @returns value of the matched object
	 */

	
	/**
	 * Helper function to return the value of Bootstrap class name for 
	 *  Spam Score Popup Panel based on the value of score property
	 */
	Handlebars.registerHelper( "checkSpamScore", function ( score ){
    if (score > 5 )
    {
        return 'danger';
    }
    else if(score < 1)
    {
        return 'success';
    }
     return 'info';
 });

  
	/**
	 * Helper function to return the value of Bootstrap class name for 
	 *  Spam Score Popup Label points based on the value of score property
	 */
   Handlebars.registerHelper( "checkSpamScoreError", function ( score ){
    if (score >= 1 )
    {
        return 'danger';
    }
    else if(score <= 0)
    {
        return 'success';
    }
     return 'warning';
 });

   /**
	 * Helper function to return the value of Spam Score Popup title 
	 *  message based on the value of total spam score property
	 */

Handlebars.registerHelper( "checkSpamMessage", function ( score ){
    if (score > 5 )
    {
        return "Your Email Template Needs Rework";
    }
    else if(score < 1)
    {
        return "Your Email Template Looks Good Score";
    }
     return "Your Email Template Looks Ok";
 });
});