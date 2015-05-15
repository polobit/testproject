package com.agilecrm.validator;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TagValidator
{
    private Pattern pattern;
    private Matcher matcher;

    private static final String TAG_PATTERN = "^(?U)[\\p{Alpha}][\\p{Alpha}\\_\\- \\d]*";

    private static TagValidator tagValidator = new TagValidator();

    private TagValidator()
    {
	pattern = Pattern.compile(TAG_PATTERN);
    }

    /**
     * Validate tag with regular expression
     * 
     * @param tag
     *            tag for validation
     * @return true valid tag, false invalid tag
     */
    public boolean validate(final String tag)
    {
	matcher = pattern.matcher(tag);
	return matcher.matches();
    }

    public static TagValidator getInstance()
    {
	return tagValidator;
    }
}