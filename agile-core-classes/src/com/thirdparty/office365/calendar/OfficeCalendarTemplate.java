package com.thirdparty.office365.calendar;

public class OfficeCalendarTemplate {

	private String start;
	private String end;
	private String title;
	private String type;
	private String backgroundColor;
	private boolean allDay;

	/**
	 * @return the start
	 */
	public String getStart() {
		return start;
	}

	/**
	 * @return the end
	 */
	public String getEnd() {
		return end;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}

	/**
	 * @return the backgroundColor
	 */
	public String getBackgroundColor() {
		return backgroundColor;
	}

	/**
	 * @return the allDay
	 */
	public boolean isAllDay() {
		return allDay;
	}

	/**
	 * @param start
	 *            the start to set
	 */
	public void setStart(String start) {
		this.start = start;
	}

	/**
	 * @param end
	 *            the end to set
	 */
	public void setEnd(String end) {
		this.end = end;
	}

	/**
	 * @param title
	 *            the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * @param backgroundColor
	 *            the backgroundColor to set
	 */
	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}

	/**
	 * @param allDay
	 *            the allDay to set
	 */
	public void setAllDay(boolean allDay) {
		this.allDay = allDay;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("OfficeCalendarTemplate [start=").append(start)
				.append(", end=").append(end).append(", title=").append(title)
				.append(", type=").append(type).append(", backgroundColor=")
				.append(backgroundColor).append(", allDay=").append(allDay)
				.append("]");
		return builder.toString();
	}

}
