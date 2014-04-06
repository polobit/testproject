package com.agilecrm.cleanup;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.util.FileStreamUtil;

public class CleanupUtil
{
	private static List<Tag> tagsList = null;
	private static List<String> simpleTags = null;

	public static void loadTags()
	{
		tagsList = new ArrayList<Tag>();
		simpleTags = new ArrayList<String>();
		try
		{
			String tagResouce = FileStreamUtil.readResource("misc/tags.txt");

			String[] tags = tagResouce.split(System.getProperty("line.separator"));
			for (String tagString : tags)
			{
				if (StringUtils.isBlank(tagString))
					continue;

				Tag tag = new Tag();
				tag.tag = tagString.trim();
				simpleTags.add(tag.tag);
				tagsList.add(tag);
			}

			System.out.println("Tags size " + tagsList.size());
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			// e.printStackTrace();
			System.out.println("Error: " + e.getMessage());
			e.printStackTrace();
		}
	}

	public static void deleteTags(List<Contact> contacts)
	{
		if (tagsList == null || tagsList.isEmpty())
		{
			System.out.println("tags not read");
			return;
		}

		Tag[] tags = new Tag[tagsList.size()];

		tags = tagsList.toArray(tags);

		System.out.println("tag array size : " + tags.length);

		for (Contact contact : contacts)
		{
			contact.removeTagsWithoutSaving(tags);
			contact.update();
		}
	}

	public static void cleanTags()
	{

		List<Tag> tagsList = TagUtil.getTags();

		Set<String> tagsStringList = new HashSet<String>();
		for (Tag tag : tagsList)
		{
			tagsStringList.add(tag.tag);
		}

		java.util.Set<String> tags = new HashSet<String>(tagsStringList);

		System.out.println(tags);

		TagUtil.deleteTags(tags);
	}
}
