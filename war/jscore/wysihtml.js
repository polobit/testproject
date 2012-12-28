/**
 * wysihtml.js is used to embed beautiful html editors to email body. Inserts
 * merge fields into email body. wysihtml makes use of wysihtml5 which is a
 * javascript plugin that makes it easy to create simple, beautiful wysiwyg
 * editors with the help of wysihtml5 and Twitter Bootstrap.
 */
$(function() {

	// Code for Merge fields in Email Template
	$(".merge-field").die().live('click',
			function(e) {

				e.preventDefault();
				// console.log("Merge field");

				// Get Selected Value
				var fieldContent = $(this).attr("name");

				// Get Current HTML
				var val = $('#email-template-html').val();

				// Set New HTML
				var wysihtml5 = $('#email-template-html').data('wysihtml5');
				if (wysihtml5) {
					// console.log("Setting content ");
					// console.log(fieldContent);

					// wysihtml5.editor.setValue(fieldcontent + " " + val,
					// true);
					wysihtml5.editor.composer.commands.exec("insertHTML", '{{'
							+ fieldContent + '}}');
				}
			});
});

/**
 * Sets HTML Editor for UserPrefs, EmailTemplates etc.
 **/
function setupHTMLEditor(selector) {
	head.js('lib/wysihtml5-0.3.0-min.js', 'lib/bootstrap-wysihtml5-min.js',
			function() {
				console.log('setting up text');
				console.log(selector.html());

				selector.wysihtml5();
			});
}
