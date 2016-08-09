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

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

		// Get server type
		String jwt = request.getParameter("jwt");

		try {
			// On the consumer side, parse the JWS and verify its HMAC
			SignedJWT signedJWT1 = SignedJWT.parse(jwt);

			SingleSignOn secretsso = SingleSignOnUtil.getSecreteKey();
			System.out.println("secret key from db = " + secretsso.secretKey.toString());

			JWSVerifier verifier = new MACVerifier(secretsso.secretKey.toString());
			System.out.println(signedJWT1.verify(verifier));

			if (!signedJWT1.verify(verifier))
				throw new Exception("Please verify your shared key");

			System.out.println(signedJWT1.getJWTClaimsSet().getSubject());
			String claimEmail = (String) signedJWT1.getJWTClaimsSet().getCustomClaim("email");
			String claimName = (String) signedJWT1.getJWTClaimsSet().getCustomClaim("name");

			DomainUser duser = DomainUserUtil.getDomainUserFromEmail(claimEmail);

			System.out.println("Claim email = " + claimEmail + "Claim name = " + claimName);
			System.out.println("Domain info = " + duser + " domain = " + duser.domain + " email = " + duser.email
					+ " name = " + duser.name);

			// Validate with claim details
			if (duser == null || !StringUtils.equalsIgnoreCase(duser.domain, secretsso.domain))
				throw new Exception("Please verify your email and name");

			if (!StringUtils.equalsIgnoreCase(duser.email, claimEmail)
					|| !StringUtils.equalsIgnoreCase(duser.name, claimName))
				throw new Exception("Please verify your email and name");

			System.out.println("Success validation");

			// Set Cookie and forward to /home
			UserInfo userInfo = new UserInfo("agilecrm.com", claimEmail, duser.name);
			request.getSession().setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, userInfo);

			// Set Account Timezone, User Timezone, Browser Fingerprint
			// and OnlineCalendarPrefs
			LoginUtil.setMiscValuesAtLogin(request, duser);
			response.sendRedirect("/");

		} catch (Exception e) {
			System.out.println(e);
			// Set In session and show error in login page
			setError(request, e.getMessage());
			response.sendRedirect("/login/normal");
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