/**
 * 
 */
package com.agilecrm.core.api.widgets;

import javax.ws.rs.DELETE;
import javax.ws.rs.Path;

import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * @author jitendra
 *
 */
@Path("/api/widgets/Shopify")
public class ShopifyWidgetApi
{

    /**
     * delete shopify widget
     */

    @DELETE
    public void delete()
    {
	Widget widget = WidgetUtil.getWidget("Shopify");
	if (widget != null)
	{
	    widget.delete();
	}
    }

}
