var startTime = Date.now();
if (typeof muse !== "undefined") {
    muse.fn.end();
}

$.getScript("https://rawgit.com/MuseDJ/MusiqpadScript/master/scripts/main.js");

museLoader = function() {
    if (typeof API !== "undefined" && typeof muse !== "undefined") {
        muse.fn.init();
        muse.fn.logger.info("Initialized in " + API.util.timeConvert(Date.now()).milisseconds, startTime);
		delete museLoader;
    } else {
        setTimeout(museLoader, 250);
    }
};

museLoader();
