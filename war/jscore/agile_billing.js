function cardExpiry(el){
	 var yearMonthsArray = {};
	   yearMonthsArray[1] = "01 (Jan)";yearMonthsArray[2] = "02 (Feb)";yearMonthsArray[3] = "03 (Mar)";
	   yearMonthsArray[4] = "04 (Apr)";yearMonthsArray[5] = "05 (May)";yearMonthsArray[6] = "06 (Jun)";
	   yearMonthsArray[7] = "07 (Jul)";yearMonthsArray[8] = "08 (Aug)";yearMonthsArray[9] = "09 (Sep)";
	   yearMonthsArray[10] = "10 (Oct)";yearMonthsArray[11] = "11 (Nov)";yearMonthsArray[12] = "12 (Dec)";
	  
	 var select = $("#exp_month", el), month = new Date()
     .getMonth() + 1;
   for ( var i = 1; i <= 12; i++) {
    select
      .append($("<option value='"
        + i
        + "' "
        + (month === i ? "selected"
          : "")
        + ">"
        + yearMonthsArray[i]
        + "</option>"))
   }
   
   
   var select = $("#exp_year", el), year = new Date()
   .getFullYear();
 
 for ( var i = 0; i < 22; i++) {
  select
    .append($("<option value='"
      + (i + year)
      + "' "
      + (i === 0 ? "selected"
        : "")
      + ">"
      + (i + year)
      + "</option>"))
 }
}

function deserializeCardDetails(data, form)
{
	console.log(data.activeCard);
	$.each(data.activeCard, function(key, value) {
		var fel;
		if(key.indexOf("name") != -1)
			fel = form.find('*[name="name"]');
		
		else if(key == "addressCountry")
			fel = form.find('*[name="address_country"]');
		else if(key == "addressState")
			fel = form.find('*[name="address_state"]');
		
		else if(key == "addressState")
			fel = form.find('*[name="address_state"]');
		
		else if(key == "addressLine1")
			fel = form.find('*[name="address_line1"]');
		
		else if(key == "addressLine2")
			fel = form.find('*[name="address_line2"]');
		
		else if(key == "addressZip")
			fel = form.find('*[name="address_zip"]');


		if(fel && fel.length > 0)
		{
			 tag = fel[0].tagName.toLowerCase();
			
			 if(tag == "input")
				 {
				 	$(fel).val(value);
				 }
			 else if(tag == "select" && key == "addressCountry")
				 {
				 	//console.log($('#country'));
				 	$("#country").val(value).prop('selected', true).trigger('change');
				 		//$(fel).val(value).trigger('change');
				 	$("#state").val(data.activeCard.addressState).prop('selected', true).trigger('change');
				 }
		}

	});
}

$(function(){
	$("#cancel-account").live('click', function(e){
		e.preventDefault();
		
		var el = getTemplate('warning',{});

		$('#content').append(el);
		
		$("#warning-deletion").modal('show');
		
		var that = this;
		
		$("#confirm-delete-account").live('click',function(e){
			e.preventDefault();
			
			$("#warning-deletion").modal('hide');
			
			// If user is sure change the id so that we add delete class and trigger click event and base model deleteitem will be called
			$(that).attr('id',"changed");
			$(that).addClass('delete').trigger('click');
		});
	})
});