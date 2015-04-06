/*******************************************************************************
 * Copyright 2011 Google Inc. All Rights Reserved.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
package com.agilecrm.session;

import java.io.Serializable;
import java.util.HashSet;

import com.agilecrm.account.NavbarConstants;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.util.DomainUserUtil;

/**
 * Simple representation of an authenticated user. Represents the claimedId
 * (agilecrm.com), email of the logged in user, name of the user and domain user
 * id. It Include methods to access claimId, email, name, domainId.
 */
public class UserInfo implements Serializable
{
    private static final long serialVersionUID = 1L;

    private String claimedId;

    /**
     * Email address of the user logged in
     */
    private String email;

    /**
     * Name of the user logged in
     */
    private String name;

    /**
     * Domain user id logged in
     */
    private Long domainId = 0L;

    private HashSet<UserAccessScopes> scopes;

    private HashSet<NavbarConstants> menuScopes;
    /**
     * Number of users allowed in current plan
     */
    private Integer usersCount = 0;

    /**
     * Plan name
     */
    private String plan;

    public UserInfo()
    {
    }

    public UserInfo(String claimedId, String email, String name)
    {
	this.claimedId = claimedId;
	this.email = email;
	this.name = name;

	// Lower case
	if (this.email != null)
	    this.email.toLowerCase();

	// Get Domain User for this email and store the id
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
	if (domainUser != null)
	{
	    setDomainId(domainUser.id);

	    try
	    {
		BillingRestrictionUtil.setPlan(this, domainUser.domain);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

    }

    // For Twilio IO
    public UserInfo(DomainUser domainUser)
    {
	if (domainUser != null)
	{
	    setDomainId(domainUser.id);

	    this.email = domainUser.email;

	    try
	    {
		BillingRestrictionUtil.setPlan(this, domainUser.domain);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
    }

    /**
     * Returns claimedId
     * 
     * @return {@link String} claimedId
     */
    public String getClaimedId()
    {
	return claimedId;
    }

    /**
     * Returns email of user
     * 
     * @return {@link String} email
     */
    public String getEmail()
    {
	return email;
    }

    /**
     * Returns name of the user
     * 
     * @return {@link String} name
     */
    public String getName()
    {
	return name;
    }

    public String toString()
    {
	return name + " (" + email + ") DomainId " + domainId;
    }

    /**
     * Sets domain id
     * 
     * @param domainId
     */
    public void setDomainId(Long domainId)
    {
	this.domainId = domainId;
    }

    /**
     * Returns the domain id of the user logged ins
     * 
     * @return {@link Long} domain user id
     */
    public Long getDomainId()
    {
	return domainId;
    }

    public Integer getUsersCount()
    {
	return usersCount;
    }

    public void setUsersCount(Integer usersCount)
    {
	this.usersCount = usersCount;
    }

    public String getPlan()
    {
	return plan;
    }

    public void setPlan(String plan)
    {
	this.plan = plan;
    }

    public HashSet<UserAccessScopes> getScopes()
    {
	return this.scopes;
    }

    public void setScopes(HashSet<UserAccessScopes> scopes)
    {
	this.scopes = scopes;
    }

    /**
     * @return the menuScopes
     */
    public HashSet<NavbarConstants> getMenuScopes()
    {
	return this.menuScopes;
    }

    /**
     * @param menuScopes
     *            the menuScopes to set
     */
    public void setMenuScopes(HashSet<NavbarConstants> menuScopes)
    {
	this.menuScopes = menuScopes;
    }
}
