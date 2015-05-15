

 function push_signup_plan(plan)
 {
	_gaq.push(['_trackEvent', 'Dashboard', 'Signup', _plan_on_signup["plan_type"], _plan_on_signup["quantity"]]);
 }

 function push_actual_plan(plan)
 {
	_gaq.push(['_trackEvent', 'Dashboard', 'Paid', plan["plan_type"], plan["quantity"]]);
 }

 $(function(){
 	try
 	{
 		if(IS_NEW_USER && _plan_on_signup)
 		push_signup_plan(plan)(_plan_on_signup)	
 	
 	}catch(err)
 	{
 		console.log(err);
 	}
 	
 })