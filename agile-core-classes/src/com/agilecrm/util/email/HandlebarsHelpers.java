package com.agilecrm.util.email;

import java.io.IOException;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.widgets.util.ExceptionUtil;
import com.github.jknack.handlebars.Helper;
import com.github.jknack.handlebars.Options;

public class HandlebarsHelpers {

	/**
	 * 
	 * @return
	 */
	public static Helper<Object> safeValueHelper() {
		return new Helper<Object>() {

			public CharSequence apply(Object obj, Options options) throws IOException {

				try {
					String param0 = options.param(0);
					if (obj == null || obj.toString().length() == 0)
						return param0;

					return obj.toString();
				} catch (Exception e) {
					System.out.println("Exception in handlebars helper " + ExceptionUtils.getFullStackTrace(e));
					return "";
				}

			}

		};
	}

	/**
	 * 
	 * @return
	 */
	public static Helper<Object> safeStringHelper() {
		return new Helper<Object>() {

			@Override
			public CharSequence apply(Object s, Options options) throws IOException {

				return s.toString();

			}
		};
	}

}
