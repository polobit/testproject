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

import com.agilecrm.core.DomainUser;

/**
 * Simple representation of an authenticated user.
 */
public class UserInfo implements Serializable
{
    private static final long serialVersionUID = 1L;

    private String claimedId;
    private String email;
    private String firstName;
    private String lastName;

    private Long domainId = 0L;

    public UserInfo()
    {
    }

    public UserInfo(String claimedId, String email, String firstName,
	    String lastName)
    {
	this.claimedId = claimedId;
	this.email = email;
	this.firstName = firstName;
	this.lastName = lastName;

	// Get Domain User for this email and store the id
	DomainUser domainUser = DomainUser.getDomainUserFromEmail(email);
	if (domainUser != null)
	    setDomainId(domainUser.id);
    }

    public String getClaimedId()
    {
	return claimedId;
    }

    public String getEmail()
    {
	return email;
    }

    public String getFirstName()
    {
	return firstName;
    }

    public String getLastName()
    {
	return lastName;
    }

    public String toString()
    {
	return firstName + " " + lastName + " (" + email + ") DomainId "
		+ domainId;
    }

    public void setDomainId(Long domainId)
    {
	this.domainId = domainId;
    }

    public Long getDomainId()
    {
	return domainId;
    }
}
