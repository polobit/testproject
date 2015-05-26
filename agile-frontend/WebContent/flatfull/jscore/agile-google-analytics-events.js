

 function push_signup_plan(plan)
 {
 	try
 	{
 		if(!window.ga)
 		{
 			setTimeout(function(){
 				push_signup_plan(plan);
 			}, 2000);
 		}
 		ga('send', 'event', 'Dashboard', 'Signup', _plan_on_signup["plan_type"], _plan_on_signup["quantity"]);	
 	}
 	catch(err)
 	{
 		console.error(err);
 	}
	
	
 }

 function push_actual_plan(plan)
 {
	try
	{
		if(!window.ga)
 		{
 			setTimeout(function(){
 				push_actual_plan(plan);
 			}, 2000);
 		}

		ga('send', 'event', 'Dashboard', 'Paid', plan["plan_type"], plan["quantity"]);
	}
 	catch(err)
 	{
 		console.error(err);
 	}
 }

 $(function(){
 	try
 	{
 		if(IS_NEW_USER && _plan_on_signup)
 		push_signup_plan(_plan_on_signup)	
 	
 	}catch(err)
 	{
 		console.log(err);
 	}
 	
 })