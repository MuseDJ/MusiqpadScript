$.getScript("https://rawgit.com/MuseDJ/MusiqpadScript/master/scripts/main.js");
var museLoader = setInterval(function() {
    if(API !== undefined)
        if(muse !== undefined)
            setTimeout(function() {
                muse.fn.init();
                clearInterval(museLoader);
            }, 500);
}, 500);