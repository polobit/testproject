/**
 * Creates backbone router to access preferences of the user
 */
var PortletsRouter = Backbone.Router
		.extend({

			routes : {
				"add-dashlet" : "adddashlet"
			},


			adddashlet : function() {

				// Back to dashboard if gridster not initalized
				if (!gridster) {
					App_Portlets.navigate("dashboard", {
						trigger : true
					});
					return;
				} 

					
				$('#content').html("<div id='portlets-add-listener'></div>");

				// Load portlets
				this.Catalog_Portlets_View = new Base_Collection_View(
						{
							url : '/core/api/portlets/default',
							templateKey : "portlets-add",
							sort_collection : false,
							individual_tag_name : 'div',

							postRenderCallback : function(el) {

								// Hide activity/Deals/tasks tab if no deals
								// portlets are there
								// (Previliges not allowing to show)
								var array = [ "deals", "taksAndEvents",
										"userActivity" ];
								$.each(array, function(i, item) {
									if ($('#' + item).children().length == 0)
										$('#' + item).parents('.wrapper-md')
												.hide();
								});

								// Preload images (Images are not showing while
								// popover if they are not preloaded)
								preloadImages([
										updateImageS3Path('flatfull/img/dashboard_images/Mini-Calendar.jpg'),
										updateImageS3Path('flatfull/img/dashboard_images/stats.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Leaderboard.png'),
										updateImageS3Path('flatfull/img/dashboard_images/account-information.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Activities.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Agile-Blog.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Calls.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Deals-Funnel.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Email-opened.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Events.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Milestone.png'),
										updateImageS3Path('flatfull/img/dashboard_images/My-contacts.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Pending-Deals.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Revenue-graph.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Tag-Graph.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Task-report.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Task.png'),
										updateImageS3Path('flatfull/img/dashboard_images/User-Activities.png'),
										updateImageS3Path('flatfull/img/dashboard_images/Campaign-stats.jpg'),

								]);
								// Event initializers
								initializeAddPortletsListeners();
							}
						});

				// Override append Item to show our custom view
				this.Catalog_Portlets_View.appendItem = organize_portlets;

				// 
				this.Catalog_Portlets_View.collection.fetch();

				$('#portlets-add-listener').html(
						this.Catalog_Portlets_View.render().el);

			}
		});

/*
 * Append the dashbaord images to body.
 */
function preloadImages(arrayOfImages) {
	$(arrayOfImages).each(function() {
		$('<img />').attr('src', this).appendTo('body').css('display', 'none');
	});
}

/*
 * Delete pop up modal sholud be open for deleting portlet.
 */
function deletePortlet(el) {

	var p_id = el.id.split("-close")[0];
	var $modal = $('#portletDeleteModal');

	$modal.modal('show');
	$modal.find('.save-modal').attr('id', p_id);

	var model = Portlets_View.collection.get(p_id);
	var header_text = $('#' + p_id).parent()
			.find('.portlet_header > h4 > span').text();
	var header_sub_text = $('#' + p_id).parent().find(
			'.portlet_header > h4 > small').text();

	var deleteWarnHTML = "";

	if (header_text && header_text.trim() != "Getting started")
		deleteWarnHTML = "Are you sure you want to delete Dashlet - "
				+ header_text.trim() + " " + header_sub_text.trim() + "?";

	else if (header_text && header_text.trim() == "Getting started")
		deleteWarnHTML = "Are you sure you want to delete Dashlet - "
				+ header_text.trim()
				+ "?<br/>This dashlet can't be added back again.";

	else if (model.get("name") == "Leaderboard")
		deleteWarnHTML = "Are you sure you want to delete Dashlet - Leaderboard "
				+ portlet_utility.getDurationForPortlets(
						model.get("settings").duration, function(duration) {
							return duration;
						}) + "?";

	else if (model.get("name") == "Mini Calendar")
		deleteWarnHTML = "Are you sure you want to delete Dashlet - Mini Calendar?";

	else if (model.get("name") == "Deal Goals")
		deleteWarnHTML = "Are you sure you want to delete Dashlet - Deal Goals "
				+ portlet_utility.getDurationForPortlets(
						model.get("settings").duration, function(duration) {
							return duration;
						}) + "?";

	else
		deleteWarnHTML = "Are you sure you want to delete Dashlet - Activity Overview "
				+ portlet_utility.getDurationForPortlets(
						model.get("settings").duration, function(duration) {
							return duration;
						}) + "?";


	$modal.find(".modal-body").html(deleteWarnHTML);
}

/**
 * Hiding all errors related to tag graph settings.
 */
function hidePortletErrors(ele) {
	if ($('#' + ele.id).next().is(':visible'))
		$('#' + ele.id).next().hide();
}

/**
 * Convert time in human readable format.
 */
function displayTimeAgo(elmnt)
{
	head.js('lib/jquery.timeago.js', function()
	{
		$(".time-ago", elmnt).timeago();
	});
	
	console.log($("article.stream-item").parent());
	
	$("article.stream-item").parent().addClass("social-striped");
}


function updateImageS3Path(imageUrl){

	if(!imageUrl)
		  imageUrl = "";
	
	try{
		if(imageUrl){
			imageUrl = imageUrl.replace("flatfull/", "").replace(/\.{2}/g, '');
	    }	
	}catch(e){}
		  

	if(!S3_STATIC_IMAGE_PATH)
		S3_STATIC_IMAGE_PATH = "//doxhze3l6s7v9.cloudfront.net/beta/static/";

	return (S3_STATIC_IMAGE_PATH + imageUrl);
}
