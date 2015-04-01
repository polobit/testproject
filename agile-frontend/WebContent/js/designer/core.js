// Create cookie
function createCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
}


// Read cookie
function readCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return null;
}

// Delete cookie
function eraseCookie(name) {
    createCookie(name, "", -1);
}


// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}


// URlEncode and decode
function urlEncodeCharacter(c) {
    return '%' + c.charCodeAt(0).toString(16);
};

function urlDecodeCharacter(str, c) {
    return String.fromCharCode(parseInt(c, 16));
};

function urlencode(s) {
    return encodeURIComponent(s).replace(/\%20/g, '+').replace(/[!'()*~]/g, urlEncodeCharacter);
};

function urldecode(s) {
    return decodeURIComponent(s.replace(/\+/g, '%20')).replace(/\%([0-9a-f]{2})/g, urlDecodeCharacter);
};

function ucwords(str) { 
    return (str + '').replace(/^(.)|\s(.)/g, function ($1) {
        return $1.toUpperCase();
    });
}