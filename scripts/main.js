var muse = {
    VERSION: "0.0.0",
    NAME: "MuseScript",
    AUTHOR: "MuseDJ",
    prefix: "[" + this.NAME + " " + this.VERSION + "]" | "[MuseDJ]",
    settings: {
        autowoot: true,
        theme: "",
        verbose: 4
    },
    fn: {
        logger: {
            log: function(msg, options) {
                if(options.verbose)
                    if(muse.settings.verbose >= options.verbose)
                        console.log(muse.prefix, msg);
                console.log(muse.prefix, msg);
            },
        },
        init: function() {
            muse.fn.logger.log("Started.");
            API.on(API.DATA.EVENTS.DJ_QUEUE_CYCLE, function(event) {
                muse.fn.logger.log("Liking Current Song", {
                    verbose: 2
                });
            });
        },
    },
};