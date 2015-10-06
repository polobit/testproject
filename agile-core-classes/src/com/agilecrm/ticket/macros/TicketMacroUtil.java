package com.agilecrm.ticket.macros;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;

public class TicketMacroUtil
{
	/**
	 * Initialize DataAccessObject.
	 */
	private static ObjectifyGenericDao<TicketMacros> dao = new ObjectifyGenericDao<TicketMacros>(TicketMacros.class);

	/**
	 * Returns all macros as a collection list.
	 * 
	 * @return list of all macros.
	 */
	public static List<TicketMacros> getAllTicketMacros()
	{
		return dao.ofy().query(TicketMacros.class).order("name").list();
	}

	/**
	 * Returns list of macros based on page size.
	 * 
	 * @param max
	 *            Maximum number of macro list based on page size query param.
	 * @param cursor
	 *            Cursor string that points the list that exceeds page_size.
	 * @return Returns list of macros with respective to page size and cursor.
	 */
	public static List<TicketMacros> getAllTicketMacros(int max, String cursor)
	{
		return dao.fetchAllByOrder(max, cursor, null, true, false, "name");
	}

	/**
	 * returns all macros count
	 * 
	 * @return count
	 */
	public static int getCount()
	{
		return TicketMacros.dao.count();
	}

	/**
	 * Locates TicketMacros based on id.
	 * 
	 * @param id
	 *            TicketMacros id.
	 * @return TicketMacros object with that id if exists, otherwise null.
	 */
	public static TicketMacros getMacro(Long id)
	{

		try
		{
			return dao.get(id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Get macro count from name
	 * 
	 * @param macroName
	 * @return count
	 */
	public static int getMacroNameCount(String macroName)
	{
		return dao.ofy().query(TicketMacros.class).filter("name", macroName).count();
	}

	public static void main(String[] arg)
	{
	}
}