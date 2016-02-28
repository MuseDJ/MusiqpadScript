$.getScript("https://rawgit.com/MuseDJ/MusiqpadScript/master/scripts/main.js");
var startTime = Date.now();
var museLoader = setInterval(function() {
    if (typeof API !== "undefined")
        if (typeof muse !== "undefined"){
			clearInterval(museLoader);
            muse.fn.init();
            muse.fn.logger.info("Initialized in " + Date.now() - startTime);
		}
}, 250);
