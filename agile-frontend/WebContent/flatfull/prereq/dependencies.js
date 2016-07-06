/*
**
**	This file contains the code that is added to js-all-min-1.js
**	Any javascript functions that are required by other modules have to be added here
**	in case the build is not functioning due to dependencies
**
*/

function agile_is_mobile_browser(){
   return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
   }

