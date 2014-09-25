function getSubscription(customer, plan)
{
	if(!plan)
		return null;
	
	if(!customer)
		return null;
	
	if(typeof customer != "object")
		{
			customer = JSON.parse(customer);
		}
	
	var subscriptions = customer.subscriptions;
	if(!subscriptions)
		{
			if(!customer.subscription)
				return null;
			else
				return customer.subscription;
			
			return null;
		}
	
	var has_subscription_id = false;
	if(plan.subscription_id)
		has_subscription_id = true;
	for(var i = 0; i < subscriptions.data.length ; i ++)
		{
			var subscription = subscriptions.data[i];
			if(has_subscription_id)
				{
					if(subscription.id != plan.subscription_id)
						continue;
					
					return subscription;
				}
			else if(subscription.plan.id == plan.plan_id)
				return subscription;
		}
	
	return null;
}

function getSubscriptionWithAmount(customer, plan)
{
	var subscription = getSubscription(customer, plan);
	
	if(!subscription)
		return null;
	
	if(!subscription.plan)
		return subscription;
	
	var amount = subscription.plan.amount/100;
	var quantity = subscription.quantity;
	subscription.total = amount * quantity;
	return subscription;
}

function getActiveCard(customer)
{
	if(!customer)
		return null;
	
	if(typeof customer != "object")
	{
		customer = JSON.parse(customer);
	}
	
	return customer.cards.data[0];
	
}
