package com.agilecrm.core.api.widgets;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;

import twitter4j.Twitter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.linkedin.LinkedInConnect;
import com.agilecrm.social.linkedin.LinkedInConnections;
import com.agilecrm.social.linkedin.LinkedInExperience;
import com.agilecrm.social.linkedin.LinkedInMessage;
import com.agilecrm.social.linkedin.LinkedInProfile;
import com.agilecrm.social.linkedin.LinkedInSearch;
import com.agilecrm.social.linkedin.LinkedInUpdates;
import com.agilecrm.social.linkedin.LinkedInUtil;
import com.agilecrm.social.stubs.SocialSearchResult;
import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.social.twitter.TwitterFollow;
import com.agilecrm.social.twitter.TwitterFollowers;
import com.agilecrm.social.twitter.TwitterFollowing;
import com.agilecrm.social.twitter.TwitterMessage;
import com.agilecrm.social.twitter.TwitterProfile;
import com.agilecrm.social.twitter.TwitterSearch;
import com.agilecrm.social.twitter.TwitterTweet;
import com.agilecrm.social.twitter.TwitterUpdates;
import com.agilecrm.social.twitter.TwitterUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>LinkedInTwitterWidgetsAPI</code> class includes REST calls to interact
 * with {@link LinkedInUtil} and {@link TwitterUtil} class
 * 
 * <p>
 * It is called from client side for searching, retrieving LinkedIn/ Twitter
 * profiles
 * </p>
 * 
 * @author Tejaswi
 * @since August 2013
 * 
 */
@Path("/api/widgets/social")
public class LinkedInTwitterWidgetsAPI {
	// Get matching profiles for LinkedIn and Twitter
	/**
	 * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
	 * given in widget and fetches matching profiles for the contact in LinkedIn
	 * and Twitter, based on the parameter social id
	 * 
	 * @param contactId
	 *            {@link Long} customer id, to get name of contact
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @return {@link List} of {@link SocialSearchResult}
	 */
	@Path("/match/{widget-id}/{contact-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SocialSearchResult> getSocialMatchingProfiles(
			@PathParam("contact-id") Long contactId,
			@PathParam("widget-id") Long widgetId) {
		try {
			// Get contact and widget based on their id
			Contact contact = ContactUtil.getContact(contactId);
			Widget widget = WidgetUtil.getWidget(widgetId);

			// Returns null if widget doesn't exist with given widget id
			if (widget != null) {
				// Based on widget name, profiles are searched based on first
				// and last name of contact in LinkedIn and Twitter
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInSearch.searchLinkedInProfiles(widget,
							contact);
				} else if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterSearch.searchTwitterProfiles(widget, contact);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} based on the name given in widget and
	 * fetches matching profiles for the contact in LinkedIn based on given
	 * parameters
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param firstName
	 *            {@link String} first name of contact
	 * @param lastName
	 *            {@link String} last name of contact
	 * @param title
	 *            {@link String} title of contact
	 * @param company
	 *            {@link String} company name of contact
	 * @param keywords
	 *            {@link String} keywords of contact
	 * @return {@link List} of {@link SocialSearchResult}
	 */
	@Path("/modified/match/linkedin/{widget-id}")
	@POST
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
	public List<SocialSearchResult> getModifiedMatchingProfilesInLinkedIn(
			@PathParam("widget-id") Long widgetId,

			@FormParam("keywords") String keywords) {
		try {
			// Get widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			// Returns null if widget doesn't exist with given widget id
			if (widget != null) {
				// Profiles are searched based on given keywords in LinkedIn
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInSearch.modifiedSearchForLinkedInProfiles(
							widget, keywords);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link TwitterUtil} based on the name given in widget and
	 * fetches matching profiles for Twitter, based on search string
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param searchString
	 *            {@link String} to be searched
	 * @return {@link List} of {@link SocialSearchResult}
	 */
	@Path("/modified/match/twitter/{widget-id}/{search-string}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SocialSearchResult> getModifiedMatchingProfilesInTwitter(
			@PathParam("widget-id") Long widgetId,
			@PathParam("search-string") String searchString) {
		try {
			// Get widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			// Returns null if widget doesn't exist with given widget id
			if (widget != null) {
				// Profiles are searched based on given search string
				if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterSearch.modifiedSearchForTwitterProfiles(
							widget, searchString);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Retrieves the id of the LinkedIn or Twitter based on widget preferences
	 * provided and URL saved for contact.
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param webUrl
	 *            {@link String} URL saved for the contact
	 * @return {@link String} Id of LinkedIn or Twitter
	 */
	@Path("getidbyurl/{widget-id}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String getSocialIdByUrl(@PathParam("widget-id") Long widgetId,
			@FormParam("web_url") String webUrl) {
		try {
			// Retrieve widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Based on widget name, calls LinkedUtil method to get LinkedIn
				// id of a profile by LinkedIn URL
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInUtil.getLinkedInIdByUrl(widget, webUrl);
				} else if (widget.name.equalsIgnoreCase("TWITTER")) {
					// Calls TwitterUtil method to Twitter id of a profile by
					// Twitter URL
					return TwitterUtil.getTwitterIdByUrl(widget, webUrl);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
	 * given in widget and fetches profile of the contact in LinkedIn or Twitter
	 * based on the parameter social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @return {@link SocialSearchResult}
	 */
	@Path("profile/{widget-id}/{social-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public SocialSearchResult getSocialProfileById(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId) {
		// Retrieves widget based on id
		Widget widget = WidgetUtil.getWidget(widgetId);
		if (widget != null) {
			try {
				// Gets profile from LinkedInUtil based on socialId
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInProfile.getLinkedInProfileById(widget,
							socialId);
				} else if (widget.name.equalsIgnoreCase("TWITTER")) {
					// Gets profile from TwitterUtil based on socialId
					return TwitterProfile.getTwitterProfileById(widget,
							socialId);
				}
			} catch (Exception e) {
				throw ExceptionUtil.catchWebException(e);
			}
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
	 * given in widget and fetches profile of the contact in LinkedIn or Twitter
	 * based on the parameter social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @return {@link SocialSearchResult}
	 */
	@Path("profile/{widget-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public SocialSearchResult getSocialProfile(
			@PathParam("widget-id") Long widgetId) {
		// Retrieves widget based on id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget != null) {
			try {
				// Gets profile from LinkedInUtil based on socialId
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInProfile.getLinkedInProfile(widget);
				} else if (widget.name.equalsIgnoreCase("TWITTER")) {
					// Gets profile from TwitterUtil based on socialId
					return TwitterProfile.getTwitterProfile(widget);
				}

			} catch (Exception e) {
				System.out.println(e.getMessage());
				SocialSearchResult ssr = new SocialSearchResult();
				ssr.picture = null;
				return ssr;
			}
		}
		return null;
	}

	/**
	 * Retrieves the work positions of a person in LinkedIn based on LinkedIn id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id of the profile
	 * @return {@link SocialSearchResult}
	 */
	@Path("/experience/{widget-id}/{social-id}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public SocialSearchResult getExperienceInLinkedIn(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);

			if (widget != null) {
				// If widget name is LinkedIn, retrieve the work positions of a
				// LinkedIn profile based on socialId
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInExperience.getExperience(widget, socialId);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
	 * given in widget and fetches the posts or tweets in LinkedIn and Twitter
	 * based on the parameter social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @return {@link List} of {@link SocialUpdateStream}
	 */
	@Path("/updates/{widget-id}/{social-id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SocialUpdateStream> getSocialNetworkUpdates(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Based on widget name, Calls LinkedUtil or TwitterUtil method
				// to retrieve all network updates based on social id
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInUpdates.getNetworkUpdates(widget, socialId,
							0, 0, null, null);
				} else if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterUpdates.getNetworkUpdates(widget,
							Long.parseLong(socialId));
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link TwitterUtil} based on the name given in widget and
	 * fetches specified number of tweets in Twitter based on the parameter
	 * social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @param tweetId
	 *            {@link String} Id of the tweet after which the tweets are
	 *            given
	 * @param endIndex
	 *            {@link String} count of tweets to be retrieved
	 * @return {@link List} of {@link SocialUpdateStream}
	 */
	@Path("/updates/more/{widget-id}/{social-id}/{tweet_id}/{endIndex}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SocialUpdateStream> getSocialNetworkUpdatesInTwitter(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId,
			@PathParam("tweet_id") String tweetId,
			@PathParam("endIndex") String endIndex) {
		try {
			// Retrieves a widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// If widget name is Twitter, fetches tweets for twitter profile
				// with socialId and filter them to
				// specific(endIndex) number of tweets tweeted before the given
				// tweet id
				if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterUpdates.getNetworkUpdates(widget,
							Long.parseLong(socialId),
							Long.parseLong(tweetId) - 5,
							Integer.parseInt(endIndex));
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} based on the name given in widget and
	 * fetches posts based on index in LinkedIn
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @param startIndex
	 *            {@link String}
	 * @param endIndex
	 *            {@link String}
	 * @return {@link List} of {@link SocialUpdateStream}
	 */
	@Path("/updates/index/{widget-id}/{social-id}/{startIndex}/{endIndex}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SocialUpdateStream> getSocialNetworkUpdatesByIndex(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId,
			@PathParam("startIndex") String startIndex,
			@PathParam("endIndex") String endIndex) {
		try {
			// Retrieves a widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Calls LinkedUtil method to get specific number of network
				// updates based on index
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInUpdates.getNetworkUpdates(widget, socialId,
							Integer.parseInt(startIndex),
							Integer.parseInt(endIndex), null, null);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} based on the name given in widget and
	 * fetches specified number of posts LinkedIn based on the parameter social
	 * id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @param startIndex
	 *            {@link String} start index of list of updates to be retrieved
	 * @param endIndex
	 *            {@link String} end index of list of updates
	 * @param startDate
	 *            {@link String} since which updates are retrieved
	 * @param endDate
	 *            {@link String} until which updates are retrieved
	 * @return {@link List} of {@link SocialUpdateStream}
	 */
	@Path("/updates/more/{widget-id}/{social-id}/{startIndex}/{endIndex}/{startDate}/{endDate}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SocialUpdateStream> getSocialNetworkUpdatesByDate(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId,
			@PathParam("startIndex") String startIndex,
			@PathParam("endIndex") String endIndex,
			@PathParam("startDate") String startDate,
			@PathParam("endDate") String endDate) {
		try {
			// Retrieve a widget by its Id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Calls LinkedUtil method to get specific number of network
				// updates based on index and between the given dates
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					// 5 seconds is delayed to avoid recent update, because it
					// includes the end date update also which we already have
					if (endDate != null) {
						endDate = String.valueOf(Integer.parseInt(endDate) - 5);
					}
					return LinkedInUpdates.getNetworkUpdates(widget, socialId,
							Integer.parseInt(startIndex),
							Integer.parseInt(endIndex), startDate, endDate);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
	 * given in widget and reshares or retweets a post in LinkedIn and Twitter
	 * based on the parameter social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param shareId
	 *            {@link String} Id of the tweet or post in Twitter or LinkedIn
	 * @param comment
	 *            {@link String} Comment to be set while sharing
	 * @return {@link String}
	 */
	@Path("/reshare/{widget-id}/{share-id}/{comment}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String shareSocialNetworkupdates(
			@PathParam("widget-id") Long widgetId,
			@PathParam("share-id") String shareId,
			@PathParam("comment") String comment) {
		try {
			// Retrieves widget based on its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Calls LinkedInUtil method to reshare a share in LinkedIn by
				// id
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInUpdates.reshareLinkedInPost(widget, shareId,
							comment);
				} else if (widget.name.equalsIgnoreCase("TWITTER")) {
					// Calls TwitterUtil method to retweet a tweet in Twitter by
					// its ID
					return TwitterTweet.reTweetByTweetId(widget,
							Long.parseLong(shareId));
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return "Unsuccessfull";
	}

	/**
	 * Retrieves followers of a contact Twitter profile based on {@link Widget}
	 * id and {@link Twitter} id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} {@link Twitter} id of the contact
	 * @return {@link List} of {@link Long} {@link Twitter} IDs of followers
	 */
	@Path("/followers/{widget-id}/{social-id}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public List<Long> getFollowersListInTwitter(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId) {
		try {
			// Retrieve a widget by its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// If widget name is Twitter, retrieves follower IDs of the
				// Twitter profile with socialId
				if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterFollowers.getFollowersIDs(widget, socialId);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Retrieves {@link Twitter} IDs of Twitter profiles whom contact follows
	 * based on {@link Widget} id and {@link Twitter} id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} {@link Twitter} id of the contact
	 * @return {@link List} of {@link Long} {@link Twitter} IDs of following
	 *         {@link Twitter} profiles of contact
	 */
	@Path("/following/{widget-id}/{social-id}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	public List<Long> getFollowingListInTwitter(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId) {
		try {
			// Retrieve widget object from its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// If widget name equals Twitter, get following IDs
				if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterFollowing.getFollowingIDs(widget, socialId);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Retrieves {@link Twitter} profiles for {@link List} of {@link Twitter}
	 * IDs provided based on {@link Widget} id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param twitterIds
	 *            String {@link JSONArray} of {@link Twitter} IDs
	 * @return {@link List} of {@link SocialSearchResult}
	 */
	@Path("/profile/list/{widget-id}")
	@POST
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED })
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<SocialSearchResult> getListOfProfilesByIdsInTwitter(
			@PathParam("widget-id") Long widgetId,
			@FormParam("twitter_ids") String twitterIds) {
		try {
			// Retrieve widget object from its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Form a JSONArray with the given twitter IDs to retrieve
				// profiles for those IDs
				JSONArray twitterIdsJsonArray = new JSONArray(twitterIds);

				// If widget name equals Twitter, get profiles based on IDs
				if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterUtil.getListOfProfiles(widget,
							twitterIdsJsonArray);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Retrieves the shared connections profiles of a person in LinkedIn based
	 * on LinkedIn id
	 * 
	 * <p>
	 * Connections between agile user and the LinkedIn profile with given
	 * socialId
	 * </p>
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id of the profile
	 * @return {@link List} of {@link SocialSearchResult}
	 */
	@Path("/shared/connections/{widget-id}/{social-id}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<SocialSearchResult> getSharedConnectionsInLinkedIn(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId) {
		try {
			// Retrieve widget object from its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Based on widget name, calls LinkedInUtil method to get shared
				// connections between agile user and the profile with socialId
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInConnections.getSharedConnections(widget,
							socialId);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} or {@link TwitterUtil} user based on the
	 * name given in widget and sends an add request to contact in LinkedIn and
	 * Twitter based on the parameter social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @param subject
	 *            {@link String} subject to be sent with request
	 * @param message
	 *            {@link String} message to be sent
	 * @return {@link String}
	 */
	@Path("/connect/{widget-id}/{social-id}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String sendAddRequest(@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId,
			@FormParam("subject") String subject,
			@FormParam("message") String message) {
		try {
			// Retrieve widget object from its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Based on widget name, Calls LinkedUtil method to send message
				// to person by socialId
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInConnect.connectInLinkedIn(widget, socialId,
							subject, message);
				} else if (widget.name.equalsIgnoreCase("TWITTER")) {
					// Calls TwitterUtil method to send message to person by
					// socialId
					return TwitterFollow.follow(widget,
							Long.parseLong(socialId));
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects {@link TwitterUtil} user based on the name given in widget and
	 * unfollows a contact Twitter profile based on the parameter social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @return {@link String}
	 */
	@Path("/disconnect/{widget-id}/{social-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String unfollowInTwitter(@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId)

	{
		try {
			// Retrieve widget object from its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Based on widget name, calls TwitterUtil method to unfollow a
				// profile in Twitter with given Twitter ID
				if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterFollow.unfollow(widget,
							Long.parseLong(socialId));
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link LinkedInUtil} or {@link TwitterUtil} based on the name
	 * given in widget and sends a message to the contact in LinkedIn and
	 * Twitter based on the parameter social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @param subject
	 *            {@link String} subject to be sent with message
	 * @param message
	 *            {@link String} message to be sent
	 * @return {@link String}
	 */
	@Path("/message/{widget-id}/{social-id}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String sendSocialMessageBySocialId(
			@PathParam("widget-id") Long widgetId,
			@PathParam("social-id") String socialId,
			@FormParam("subject") String subject,
			@FormParam("message") String message) {
		try {
			// Retrieve widget object from its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Calls LinkedUtil method to send message to person by
				// socialId, based on widget name
				if (widget.name.equalsIgnoreCase("LINKEDIN")) {
					return LinkedInMessage.sendLinkedInMessageById(widget,
							socialId, subject, message);
				} else if (widget.name.equalsIgnoreCase("TWITTER")) {
					// Calls TwitterUtil method to send message to person by
					// socialId, based on widget name
					return TwitterMessage.sendTwitterMessageById(widget,
							socialId, message);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

	/**
	 * Connects to {@link TwitterUtil} and sends a tweet in Twitter based on the
	 * parameter social id
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @param socialId
	 *            {@link String} LinkedIn id or Twitter id of the contact
	 * @param message
	 *            {@link String} message to tweet
	 * @return {@link String}
	 */
	@Path("/tweet/{widget-id}")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public String tweetInTwitter(@PathParam("widget-id") Long widgetId,
			@FormParam("message") String message) {
		try {
			// Retrieve widget object from its id
			Widget widget = WidgetUtil.getWidget(widgetId);
			if (widget != null) {
				// Calls TwitterUtil method to tweet to a person by their screen
				// name which is included in the message
				if (widget.name.equalsIgnoreCase("TWITTER")) {
					return TwitterTweet.tweetInTwitter(widget, message);
				}
			}
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
		return null;
	}

}