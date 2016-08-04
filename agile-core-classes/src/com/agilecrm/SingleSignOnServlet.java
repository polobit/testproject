package com.agilecrm;

import java.io.IOException;
import java.net.URLEncoder;
import java.text.ParseException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.ssologin.SingleSignOn;
import com.agilecrm.ssologin.SingleSignOnUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;

public class SingleSignOnServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException {

	// Get server type
	String jwt = request.getParameter("jwt");


	// On the consumer side, parse the JWS and verify its HMAC
	SignedJWT signedJWT1 = null;
	try {
	    signedJWT1 = SignedJWT.parse(jwt);
	} catch (ParseException e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    response.sendRedirect("/login/normal");
	}

	SingleSignOn secretsso = SingleSignOnUtil.getSecreteKey();
	System.out.println("secret key from db = "+ secretsso.secretKey.toString());

	JWSVerifier verifier = new MACVerifier(secretsso.secretKey.toString());
	try {
	    System.out.println(signedJWT1.verify(verifier));
	    
	    if (signedJWT1.verify(verifier)) {
		System.out.println(signedJWT1.getJWTClaimsSet().getSubject());
		String claimEmail = (String) signedJWT1.getJWTClaimsSet().getCustomClaim("email");
		String claimName = (String) signedJWT1.getJWTClaimsSet().getCustomClaim("name");
		
		DomainUser duser =  DomainUserUtil.getDomainUserFromEmail(claimEmail);
		
		System.out.println("Claim email = " + claimEmail + "Claim name = " + claimName);
		System.out.println("Domain info = " + duser + " domain = " + duser.domain + " email = " + duser.email + " name = " + duser.name);
		
		if(duser != null && duser.domain.equalsIgnoreCase(secretsso.domain) && duser.email.equals(claimEmail) && duser.name.equals(claimName)){
		    	System.out.println("Success full validation");
		    	
			// Set Cookie and forward to /home
			UserInfo userInfo = new UserInfo("agilecrm.com", claimEmail,duser.name);
			request.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

			//Set Account Timezone, User Timezone, Browser Fingerprint and OnlineCalendarPrefs
			LoginUtil.setMiscValuesAtLogin(request, duser);
			response.sendRedirect("/");
		}else{
		    setError(request, "Please verify your email and name");
		    response.sendRedirect("/login/normal");
		}
		
	    }else{
		setError(request, "Please verify your shared key");
		response.sendRedirect("/login/normal");
	    }
	    

	} catch (Exception e) {
	    System.out.println(e);
	    // Set In session and show error in login page
	    setError(request, e.getMessage());
	    response.sendRedirect("/login/normal");
	    return;
	}

    }
    
    void setError(HttpServletRequest request, String message) {
	try {
	    request.getSession().setAttribute("sso_error", message);
	} catch (Exception e) {
	    // TODO: handle exception
	}
    }

}