function utmHiddenField() { 
  var hiddenFieldsMarkUp = "";
  for ( var i = 0, len= localStorage.length;i<len; ++i ) {
    if(localStorage.key(i).indexOf("agile_utm_") != -1) {
      hiddenFieldsMarkUp += '<input type="hidden" name="_'+localStorage.key(i)+'" value="'+localStorage.getItem(localStorage.key(i))+'">';
    }
  }

  if(hiddenFieldsMarkUp) {
    var el = document.createElement('div');
    el.innerHTML = hiddenFieldsMarkUp;
    document.getElementById("agile-form").appendChild(el);
  }
}

function deleteAgileHiddenFields(agile_contact) {
  for(var index in agile_contact) {
    if(index.indexOf("_agile_") != -1) {
      delete agile_contact[index];
    }
  }
  return agile_contact;
}

window.addEventListener('load', function() { 
    if(document.getElementById('agile-form') != null) {
      utmHiddenField();
    }
}, false);

