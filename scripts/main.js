var muse = {
    VERSION: "0.0.0",
    NAME: "MuseScript",
    AUTHOR: "MuseDJ",
    prefix: "[MuseDJ]",
    settings: {
        autolike: true,
        theme: "",
        verbose: 4
    },
    fn: {
        logger: {
            log: function(msg, options) {
                if (options.verbose)
                    if (muse.settings.verbose >= options.verbose)
                        console.log(muse.prefix, msg);
                console.log(muse.prefix, msg);
            },
            error: function(msg, options) {
                if (options.verbose)
                    if (muse.settings.verbose >= options.verbose)
                        console.error(muse.prefix, msg);
                console.errer(muse.prefix, msg);
            }
        },
        chat: {
            log: function(msg, options) {
                API.chat.log("<span class=\"muse-log\">" + msg + "</span>", muse.NAME);
            },
            error: function(msg, options) {
                API.chat.log("<span class=\"muse-error\">" + msg + "</span>", muse.NAME);
            },
            info: function(msg, options) {
                API.chat.log("<span class=\"muse-info\">" + msg + "</span>", muse.NAME);
            },
            warn: function(msg, options) {
                API.chat.log("<span class=\"muse-warn\">" + msg + "</span>", muse.NAME);
            },
        },
        init: function() {
            muse.prefix = "[" + this.NAME + " " + this.VERSION + "]";
            muse.fn.logger.log("Started.");

            API.on(API.DATA.EVENTS.DJ_QUEUE_CYCLE, function(event) {
                muse.fn.logger.log("Liking Current Song", {
                    verbose: 2
                });
                $(".mdi.mdi-thumb-up").click()
            });

            API.on(API.DATA.EVENTS.CHAT_COMMAND, function(err, msg, cmd) {
                cmd.main = msg.split(" ");
                cmd.base = cmd.main[0].substring(1, cmd.main[0].length);
                cmd.args = cmd.main.slice(0, cmd.main.length);
                cmd.args.splice(0, 1);

                if (err)
                    muse.fn.logger.error("Unknown error with, " + msg);
                muse.fn.logger.log("Triggering \"" + cmd.type + cmd.base.substring(0, 1).toUpperCase() + cmd.base.substring(1, cmd.base.length) + "\" with " + JSON.stringify(cmd.args));
                $(document).trigger(cmd.type + cmd.base.substring(0, 1).toUpperCase() + cmd.base.substring(1, cmd.base.length), cmd.args);
            });

            muse.fn.initCmds();
        },
        initCmds: function() {
            $(document).on("chatCommandMuse", function(event, arg1, arg2, arg3) {
                if (arg1.toLowerCase() == "help" || arg1 == undefined) {
                    API.chat.system(
                        "<span>Muse Help Menu.</span>" +
                        "<ul>" +
                        "<li><b>/muse&nbsp;</b><b style=\"color: #fff;\">help</b>&nbsp;<i>view this help menu</i></li>" +
                        "<li><b>/muse&nbsp;</b><b style=\"color: #fff;\">off</b>&nbsp;<i>Disable MuseScript</i></li>" +
                        "</ul>"
                    );
                } else if (arg1.toLowerCase() == "off") {
                    $(document).on("chatCommandMuse", function(event, arg1, arg2, arg3) {
                        if (arg1.toLowerCase() == "help" || arg1 == undefined) {
                            API.chat.system(
                                "<span>Muse Help Menu.</span>" +
                                "<ul>" +
                                "<li><b>/muse&nbsp;</b><b style=\"color: #fff;\">help</b>&nbsp;<i>view this help menu</i></li>" +
                                "<li><b>/muse&nbsp;</b><b style=\"color: #fff;\">off</b>&nbsp;<i>Disable MuseScript</i></li>" +
                                "</ul>"
                            );
                        }
                    });
                }
            });
        },
    },
};