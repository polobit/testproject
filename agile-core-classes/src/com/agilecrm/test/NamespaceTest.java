package com.agilecrm.test;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.util.NamespaceUtil;

public class NamespaceTest extends HttpServlet
{
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
	// TODO Auto-generated method stub
	Long startTime = System.currentTimeMillis();

	System.out.println(NamespaceUtil.getAllNamespaces());

	System.out.println("total time takes : " + (startTime - System.currentTimeMillis()));
    }
}
