window.muse = {
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
                if (options !== undefined)
                    if (options.verbose !== undefined)
                        if (muse.settings.verbose >= options.verbose)
                            console.log(muse.prefix, msg);
                console.log(muse.prefix, msg);
            },
            error: function(msg, options) {
                if (options !== undefined)
                    if (options.verbose !== undefined)
                        if (muse.settings.verbose >= options.verbose)
                            console.error(muse.prefix, msg);
                console.error(muse.prefix, msg);
            },
            warn: function(msg, options) {
                if (options !== undefined)
                    if (options.verbose !== undefined)
                        if (muse.settings.verbose >= options.verbose)
                            console.warn(muse.prefix, msg);
                console.warn(muse.prefix, msg);
            },
            info: function(msg, options) {
                if (options !== undefined)
                    if (options.verbose !== undefined)
                        if (muse.settings.verbose >= options.verbose)
                            console.info(muse.prefix, msg);
                console.info(muse.prefix, msg);
            }
        },
        chat: {
            raw: function(opt) {
                console.log(opt);
                var options = {
                    type: (opt.type == undefined) ? "message" : opt.type,
                    icon: (opt.icon == undefined) ? "send" : opt.icon,
                    class: (opt.class == undefined) ? "" : opt.class,
                    msg: (opt.msg == undefined) ? "" : opt.msg,
                    style: (opt.style == undefined) ? "" : opt.style,
                    name: (opt.name == undefined) ? muse.prefix : opt.name,
                    time: (opt.time == undefined) ? (API.util.timeConvert(Date.now()).hours + ":" + (API.util.timeConvert(Date.now()).minutes < 10) ? "0" + API.util.timeConvert(Date.now()).minutes : API.util.timeConvert(Date.now()).minutes) : opt.time
                };
                var raw = '<div class="cm room-' + options.type + ' ' + options.class + '"><span class="time">' + options.time + '</span><div class="mdi mdi-' + options.icon + ' msg" style="' + options.style + '"></div><div class="text"><span class="uname">' + options.name + '</span><span class="umsg">' + options.msg + '</span></div></div>';
                console.log(raw);
                console.log($.parseHTML(raw));
                $('#messages').append(raw);
				$('#chat').scrollTop($('#chat')[0].scrollHeight);
            },
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
            success: function(msg, options) {
                API.chat.log("<span class=\"muse-success\">" + msg + "</span>", muse.NAME);
            },
        },
        loadCSS: function(url, callback) {
            $('head').append(
                $('<link rel="stylesheet" type="text/css" />').attr('href', encodeURI(url))
            );
            callback(url, undefined);
        },
        init: function() {
            muse.prefix = "[" + muse.NAME + " " + muse.VERSION + "]";
            muse.fn.logger.log("Started.");

            muse.fn.loadCSS("https://rawgit.com/MuseDJ/MusiqpadScript/master/css/muse.min.css", function(url, err) {
                if (err) {
                    muse.fn.logger.warn("Failed to load CSS.");
                } else {
                    muse.fn.logger.log("Loaded CSS for " + url + ".");
                }
            });

            API.on(API.DATA.EVENTS.ADVANCE, function(event) {
                muse.fn.logger.log("Song Update", {
                    verbose: 1
                });
                if (muse.settings.autolike) {
                    muse.fn.logger.log("Liking Current Song", {
                        verbose: 2
                    });
                    $(".mdi.mdi-thumb-up").click()
                }
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
        getETA: function() {
            var totalSong = 0,
                avgSong = 1;
            API.room.getHistory().forEach(function(o, i) {
                totalSong += o.song.duration;
            });
            avgSong = totalSong / API.room.getHistory().length;
            if (API.queue.getPosition(API.room.getUser().uid) == 1) {
                return
            } else if (API.queue.getDJ().uid == API.room.getUser().uid) {
                return avgSong * API.queue.getPosition(API.room.getUser().uid);
            }
        },
        end: function(err) {
            for (var i in API.DATA.EVENTS) {
                API.off(API.DATA.EVENTS[i], function(err, data) {
                    muse.fn.chat.warn("ENDING EVENT: " + i + "(" + err + ")");
                });
            }

            muse.fn.endCmds();

            if (err) {
                muse.fn.logger.error(err);
                muse.fn.chat.error("ENDING: " + err);
            } else {
                muse.fn.chat.warn("Shutting down.");
            }

            delete window.muse;
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
                        muse.fn.end();
                    });
                }
            });
        },
        endCmds: function() {
            $(document).off("chatCommandMuse");
        }
    },
};
