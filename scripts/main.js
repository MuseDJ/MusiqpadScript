var muse = {
    VERSION: "0.0.0",
    NAME: "MuseScript",
    AUTHOR: "MuseDJ",
    prefix: "[" + this.NAME + this.VERSION + "]",
    fn: {
        logger: {
            log: function(msg, options) {
                console.log(muse.prefix, msg);
            }
        },
        init: function() {
            muse.fn.logger.log("Started.");
        }
    },
};