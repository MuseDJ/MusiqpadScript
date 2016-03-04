window.muse = {
	VERSION: "0.1.0",
	NAME: "MuseScript",
	AUTHOR: "MuseDJ",
	prefix: "[MuseDJ]",
	tick: {
		rate: 10,
		number: 0,
		tick: undefined
	},
	fn: {
		logger: {
			log: function(msg, options) {
				if (options !== undefined) {
					if (options.verbose !== undefined) {
						if (muse.fn.settings.get().verbose >= options.verbose) {
							console.log(muse.prefix, msg);
						}
					}
				} else {
					console.log(muse.prefix, msg);
				}
			},
			error: function(msg, options) {
				if (options !== undefined) {
					if (options.verbose !== undefined) {
						if (muse.fn.settings.get().verbose >= options.verbose) {
							console.error(muse.prefix, msg);
						}
					}
				} else {
					console.error(muse.prefix, msg);
				}
			},
			warn: function(msg, options) {
				if (options !== undefined) {
					if (options.verbose !== undefined) {
						if (muse.fn.settings.get().verbose >= options.verbose) {
							console.warn(muse.prefix, msg);
						}
					}
				} else {
					console.warn(muse.prefix, msg);
				}
			},
			info: function(msg, options) {
				if (options !== undefined) {
					if (options.verbose !== undefined) {
						if (muse.fn.settings.get().verbose >= options.verbose) {
							console.info(muse.prefix, msg);
						}
					}
				} else {
					console.info(muse.prefix, msg);
				}
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
					name: (opt.name == undefined) ? muse.NAME : opt.name,
					time: (opt.time == undefined) ? muse.fn.utils.makeTime(new Date()) : opt.time
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
		utils: {
			makeTime: function(dateObj) {
				var settings = JSON.parse(localStorage.settings);
				if (settings.roomSettings && settings.roomSettings.chatTimestampFormat == API.DATA.CHAT.TSFORMAT.HR12)
					return ((dateObj.getHours()) % 12 || 12) + ':' + ('0' + dateObj.getMinutes()).slice(-2);
				else
					return (dateObj.getHours() + ':' + ('0' + dateObj.getMinutes()).slice(-2));
			},
			makeTimeFromMs: function(ms) {
				ms = Math.floor(ms);
				var hours = Math.floor(ms / (60 * 60 * 1000)),
					mins = Math.floor((ms - (hours * 60 * 60 * 1000)) / (60 * 1000)),
					secs = Math.floor((ms - (hours * 60 * 60 * 1000) - (mins * 60 * 1000)) / (1000));

				hours = (hours < 10) ? "0" + hours : hours;
				mins = (mins < 10) ? "0" + mins : mins;
				secs = (secs < 10) ? "0" + secs : secs;

				return hours + ":" + mins + ":" + secs;
			}
		},
		settings: {
			get: function() {
				return JSON.parse(localStorage.getItem("musedj"));
			},
			set: function(item, value) {
				var settings = muse.fn.settings.get();
				settings[item] = value;
				localStorage.setItem("musedj", JSON.stringify(settings));
				return settings;
			},
			reset: function() {
				for (var i in muse.fn.settings.defaults) {
					muse.fn.settings.set(i, defaults[i]);
				}
			},
			init: function() {
				localStorage.setItem("musedj", JSON.stringify(muse.fn.settings.defaults));
			},
			defaults: {
				autolike: true,
				theme: "",
				verbose: 4
			}
		},
		tick: function() {
			var startTime = Date.now();

			muse.fn.logger.info("Current ETA " + muse.fn.utils.makeTimeFromMs(muse.fn.getETA() * 1000), {
				verbose: 5
			});

			$('.muse-time').text(muse.fn.utils.makeTimeFromMs(muse.fn.getETA() * 1000));

			muse.fn.logger.info("Tick #" + muse.tick.number + " took " + API.util.timeConvert(Date.now(), startTime).milisseconds, {
				verbose: 5
			});
			if (API.util.timeConvert(Date.now(), startTime).milisseconds > 1 / (muse.tick.rate) * 1000) {
				muse.fn.logger.error("Tick #" + muse.tick.number + " took longer than expected, stopping " + muse.name, {
					verbose: 0
				});
				muse.fn.end("Tick took to long.");
			}
		},
		loadCSS: function(url, callback) {
			if ($('link[href="' + encodeURI(url) + '"]').length == 0) {
				$('head').append(
					$('<link rel="stylesheet" type="text/css" />').attr('href', encodeURI(url))
				);
			} else {
				$('link[href*="muse"]').attr('href', encodeURI(url));
			}
			callback(url, undefined);
		},
		addMenu: function() {
			//TODO IMPROVE THE TOGGLING, use the built in functions from Angular
			$('<div ng-click="prop.t = 555" data-ng-show="isLoggedIn" data-ng-class="{\'active\' : prop.t == 555}" class="nav logo-btn-muse" title="Muse Settings"><div class="mdi mdi-headphones-box"></div></div>').insertAfter('.nav.logo-btn-history');
			$('.logo-menu').append('<div ng-show="prop.t == 555" class="logo-muse muse ng-hide"><section><div class="label">Muse Settings</div></section></div>');
			// $(".dash .tray").append('<div data-ng-click="changeTab(\'c\', 555)" data-ng-class="{\'active\' : prop.c == 555}" class="tab btn-muse" title="Muse"><div class="mdi mdi-headphones"></div></div>');
			// $("#app-right").append('<div data-ng-show="(prop.c == 555)" id="muse-back" class="ng-hide"><div class="muse">Muse Settings</div></div>');
			$('[class^="nav logo-btn"]').on('click', function(e) {
				var scope = angular.element($('body')).scope();
				if ($(e.currentTarget).attr('ng-click') == 'prop.t = 555') {
					scope.prop.t = 555;
					setTimeout(function() {
						$('.logo-muse.muse').removeClass('ng-hide');
					}, 500);
				} else {
					$('.logo-muse.muse').addClass('ng-hide');
				}
			});
		},
		firstTime: function() {
			//Runs on the first time the script is run
			API.util.makeCustomModal({
				content: '<img src="https://placehold.it/250x250">',
				buttons: [{
					icon: "mdi-close",
					handler: function(e) {
						$('.modal-bg').remove();
						console.log("Close modal", e);
					},
					classes: 'modal-no'
				}, {
					icon: "mdi-check",
					text: "text",
					classes: 'modal-yes',
					handler: function(e) {
						muse.settings.fn.reset();
						$('.modal-bg').remove();
					}
				}],
				onDismiss: function() {
					console.log("Dismissed");
				},
				dismissable: true
			});
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

			muse.tick.tick = setInterval(function() {
				if (muse.fn.tick !== undefined) {
					muse.fn.tick()
				}
				muse.tick.number++;
			}, 1 / (muse.tick.rate / 1000));

			$('.btn-join').append('<div class="muse-time">' + "00:00:00" + '</div>');
			$('.btn-snooze').after('<div class="ctrl muse-videotoggle"><i class="mdi mdi-eye"></i></div>');
			$('.btn-join').after('<div class="ctrl muse-notiftoggle"><i class="mdi mdi-bell-off"></i></div>');

			API.on(API.DATA.EVENTS.ADVANCE, function(event) {
				muse.fn.logger.log("Song Update", {
					verbose: 1
				});
				if (muse.fn.settings.get().autolike) {
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

			muse.fn.chat.raw({
				msg: "Has launched successfully",
				icon: "music-note",
				class: "muse-success"
			});
		},
		getETA: function() {
			var total = 0,
				avgSong = 1;
			API.room.getHistory().forEach(function(o, i) {
				total += o.song.duration;
			});
			avgSong = total / API.room.getHistory().length;
			if (API.queue.getPosition(API.room.getUser().uid) == 1) {
				return
			} else if (API.queue.getDJ().uid == API.room.getUser().uid) {
				return Math.ceil(avgSong * API.queue.getPosition(API.room.getUser().uid) + +API.room.getTimeRemaining());
			} else if (API.queue.getPosition(API.room.getUser().uid) == -1) {
				return Math.ceil(avgSong * API.queue.getInfo().length + API.room.getTimeRemaining());
			} else {
				return Math.abs(Math.max())
			}
		},
		end: function(err) {
			for (var i in API.DATA.EVENTS) {
				API.off(API.DATA.EVENTS[i], function(err, data) {
					muse.fn.chat.warn("ENDING EVENT: " + i + "(" + err + ")");
				});
			}

			muse.fn.endCmds();
			clearInterval(muse.tick.tick);

			$('.muse-time').remove();

			if (err) {
				muse.fn.logger.error(err);
				muse.fn.chat.error("ENDING: " + err);
			} else {
				muse.fn.chat.warn("Shutting down.");
			}

			delete window.muse;
		},
		initCmds: function() {
			$('.autocomplete.ac-cmd ul').append("<li>/muse</li>");
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
