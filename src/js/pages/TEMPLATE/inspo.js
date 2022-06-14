function getShoptetDataLayer(key) {
    if (dataLayer[0].shoptet) return key ? dataLayer[0].shoptet[key] : dataLayer[0].shoptet;
}
function getShoptetProductsList() {
    return shoptet.tracking.productsList;
}
function AjaxResponse(result, customSettings) {
    (this.R200_OK = 200),
        (this.R301_REDIRECT = 301),
        (this.R302_REDIRECT = 302),
        (this.R303_REDIRECT = 303),
        (this.R500_SERVER_ERROR = 500),
        (this.settings = $.extend({ complete: null, success: null, failed: null, redirect: null }, customSettings));
    try {
        "object" == typeof result ? (this.response = result) : "string" == typeof result && (this.response = JSON.parse(result));
    } catch (e) {
        this.response = { code: this.R200_OK, message: null, payload: result };
    }
    return this;
}
function toggleRequiredAttributes($el, job, preserveNoJsValidation) {
    "remove" === job
        ? ($('[autocomplete="email"]').attr("autocomplete", "new-email"),
            $.each($el.find(":required"), function () {
                $(this).removeAttr("required").attr("data-required", "required"), $(this).addClass("js-validate");
            }),
            $.each($el.find(".js-validate"), function () {
                shoptet.validator.removeErrorMessage(this),
                    $(this)
                        .addClass("js-validation-suspended")
                        .removeClass("js-error-field")
                        .attr("data-original-value", $(this).val())
                        .attr("data-original-autocomplete", $(this).attr("autocomplete"))
                        .attr("autocomplete", "autocomplete-off")
                        .val("");
            }),
        preserveNoJsValidation ||
        $.each($el.find("[data-disabled-validation]"), function () {
            $(this).addClass("no-js-validation"), $(this).removeAttr("data-disabled-validation");
        }))
        : ($('[autocomplete="new-email"]').attr("autocomplete", "email"),
            $.each($el.find("[data-required]"), function () {
                $(this).removeAttr("data-required").attr("required", "required");
            }),
            $.each($el.find(".js-validation-suspended"), function () {
                $(this)
                    .removeClass("js-validation-suspended")
                    .attr("autocomplete", $(this).attr("data-original-autocomplete"))
                    .val($(this).attr("data-original-value"))
                    .removeAttr("data-original-autocomplete")
                    .removeAttr("data-original-value");
            }),
        preserveNoJsValidation ||
        $.each($el.find(".no-js-validation"), function () {
            $(this).removeClass("no-js-validation"), $(this).attr("data-disabled-validation", !0);
        }));
}
!(function ($) {
    $.fn.unveil = function (threshold, callback) {
        var loaded,
            $w = $(window),
            th = threshold || 0,
            attrib = 1 < window.devicePixelRatio ? "data-src-retina" : "data-src",
            images = this;
        function unveil() {
            var inview = images.filter(function () {
                var eb = $(this);
                if (!eb.is(":hidden")) {
                    var wt = $w.scrollTop(),
                        wb = wt + $w.height(),
                        et = eb.offset().top,
                        eb = et + eb.height();
                    return wt - th <= eb && et <= wb + th;
                }
            });
            (loaded = inview.trigger("unveil")), (images = images.not(loaded));
        }
        return (
            this.one("unveil", function () {
                var source = this.getAttribute(attrib);
                (source = source || this.getAttribute("data-src")) && (this.setAttribute("src", source), "function" == typeof callback && callback.call(this));
            }),
                $w.on("scroll.unveil resize.unveil lookup.unveil load.unveil", unveil),
                unveil(),
                this
        );
    };
})(window.jQuery || window.Zepto),
    (function ($) {
        "use strict";
        ($.fn.emulateTransitionEnd = function (duration) {
            var called = !1,
                $el = this;
            $(this).one("bsTransitionEnd", function () {
                called = !0;
            });
            return (
                setTimeout(function () {
                    called || $($el).trigger($.support.transition.end);
                }, duration),
                    this
            );
        }),
            $(function () {
                ($.support.transition = (function () {
                    var name,
                        el = document.createElement("bootstrap"),
                        transEndEventNames = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" };
                    for (name in transEndEventNames) if (void 0 !== el.style[name]) return { end: transEndEventNames[name] };
                    return !1;
                })()),
                $.support.transition &&
                ($.event.special.bsTransitionEnd = {
                    bindType: $.support.transition.end,
                    delegateType: $.support.transition.end,
                    handle: function (e) {
                        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
                    },
                });
            });
    })(jQuery),
    (function ($) {
        "use strict";
        function Carousel(element, options) {
            (this.$element = $(element)),
                (this.$indicators = this.$element.find(".carousel-indicators")),
                (this.options = options),
                (this.paused = null),
                (this.sliding = null),
                (this.interval = null),
                (this.$active = null),
                (this.$items = null),
            this.options.keyboard && this.$element.on("keydown.bs.carousel", $.proxy(this.keydown, this)),
            "hover" != this.options.pause || "ontouchstart" in document.documentElement || this.$element.on("mouseenter.bs.carousel", $.proxy(this.pause, this)).on("mouseleave.bs.carousel", $.proxy(this.cycle, this));
        }
        function Plugin(option) {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data("bs.carousel"),
                    options = $.extend({}, Carousel.DEFAULTS, $this.data(), "object" == typeof option && option),
                    action = "string" == typeof option ? option : options.slide;
                data || $this.data("bs.carousel", (data = new Carousel(this, options))), "number" == typeof option ? data.to(option) : action ? data[action]() : options.interval && data.pause().cycle();
            });
        }
        (Carousel.VERSION = "3.3.5"),
            (Carousel.TRANSITION_DURATION = 600),
            (Carousel.DEFAULTS = { interval: 5e3, pause: "hover", wrap: !0, keyboard: !0 }),
            (Carousel.prototype.keydown = function (e) {
                if (!/input|textarea/i.test(e.target.tagName)) {
                    switch (e.which) {
                        case 37:
                            this.prev();
                            break;
                        case 39:
                            this.next();
                            break;
                        default:
                            return;
                    }
                    e.preventDefault();
                }
            }),
            (Carousel.prototype.cycle = function (e) {
                return e || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval)), this;
            }),
            (Carousel.prototype.getItemIndex = function (item) {
                return (this.$items = item.parent().children(".item")), this.$items.index(item || this.$active);
            }),
            (Carousel.prototype.getItemForDirection = function (itemIndex, active) {
                var activeIndex = this.getItemIndex(active);
                if ((("prev" == itemIndex && 0 === activeIndex) || ("next" == itemIndex && activeIndex == this.$items.length - 1)) && !this.options.wrap) return active;
                itemIndex = (activeIndex + ("prev" == itemIndex ? -1 : 1)) % this.$items.length;
                return this.$items.eq(itemIndex);
            }),
            (Carousel.prototype.to = function (pos) {
                var that = this,
                    activeIndex = this.getItemIndex((this.$active = this.$element.find(".item.active")));
                if (!(pos > this.$items.length - 1 || pos < 0))
                    return this.sliding
                        ? this.$element.one("slid.bs.carousel", function () {
                            that.to(pos);
                        })
                        : activeIndex == pos
                            ? this.pause().cycle()
                            : this.slide(activeIndex < pos ? "next" : "prev", this.$items.eq(pos));
            }),
            (Carousel.prototype.pause = function (e) {
                return e || (this.paused = !0), this.$element.find(".next, .prev").length && $.support.transition && (this.$element.trigger($.support.transition.end), this.cycle(!0)), (this.interval = clearInterval(this.interval)), this;
            }),
            (Carousel.prototype.next = function () {
                if (!this.sliding) return this.slide("next");
            }),
            (Carousel.prototype.prev = function () {
                if (!this.sliding) return this.slide("prev");
            }),
            (Carousel.prototype.slide = function (type, $nextIndicator) {
                var $active = this.$element.find(".item.active"),
                    $next = $nextIndicator || this.getItemForDirection(type, $active),
                    isCycling = this.interval,
                    direction = "next" == type ? "left" : "right",
                    that = this;
                if ($next.hasClass("active")) return (this.sliding = !1);
                var relatedTarget = $next[0],
                    $nextIndicator = $.Event("slide.bs.carousel", { relatedTarget: relatedTarget, direction: direction });
                if ((this.$element.trigger($nextIndicator), !$nextIndicator.isDefaultPrevented())) {
                    (this.sliding = !0),
                    isCycling && this.pause(),
                    this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), ($nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])) && $nextIndicator.addClass("active"));
                    var slidEvent = $.Event("slid.bs.carousel", { relatedTarget: relatedTarget, direction: direction });
                    return (
                        $.support.transition && this.$element.hasClass("slide")
                            ? ($next.addClass(type),
                                $next[0].offsetWidth,
                                $active.addClass(direction),
                                $next.addClass(direction),
                                $active
                                    .one("bsTransitionEnd", function () {
                                        $next.removeClass([type, direction].join(" ")).addClass("active"),
                                            $active.removeClass(["active", direction].join(" ")),
                                            (that.sliding = !1),
                                            setTimeout(function () {
                                                that.$element.trigger(slidEvent);
                                            }, 0);
                                    })
                                    .emulateTransitionEnd(Carousel.TRANSITION_DURATION))
                            : ($active.removeClass("active"), $next.addClass("active"), (this.sliding = !1), this.$element.trigger(slidEvent)),
                        isCycling && this.cycle(),
                            this
                    );
                }
            });
        var old = $.fn.carousel;
        ($.fn.carousel = Plugin),
            ($.fn.carousel.Constructor = Carousel),
            ($.fn.carousel.noConflict = function () {
                return ($.fn.carousel = old), this;
            });
        function clickHandler(e) {
            var options,
                slideIndex = $(this),
                $target = $(slideIndex.attr("data-target") || ((options = slideIndex.attr("href")) && options.replace(/.*(?=#[^\s]+$)/, "")));
            $target.hasClass("carousel") &&
            ((options = $.extend({}, $target.data(), slideIndex.data())),
            (slideIndex = slideIndex.attr("data-slide-to")) && (options.interval = !1),
                Plugin.call($target, options),
            slideIndex && $target.data("bs.carousel").to(slideIndex),
                e.preventDefault());
        }
        $(document).on("click.bs.carousel.data-api", "[data-slide]", clickHandler).on("click.bs.carousel.data-api", "[data-slide-to]", clickHandler),
            $(window).on("load", function () {
                $('[data-ride="carousel"]').each(function () {
                    var $carousel = $(this);
                    Plugin.call($carousel, $carousel.data());
                });
            });
    })(jQuery),
    (function ($) {
        "use strict";
        function Dropdown(element) {
            $(element).on("click.bs.dropdown", this.toggle);
        }
        var toggle = '[data-toggle="dropdown"]';
        function getParent($this) {
            var $parent = $this.attr("data-target"),
                $parent = ($parent = $parent || (($parent = $this.attr("href")) && /#[A-Za-z]/.test($parent) && $parent.replace(/.*(?=#[^\s]*$)/, ""))) && $($parent);
            return $parent && $parent.length ? $parent : $this.parent();
        }
        function clearMenus(e) {
            (e && 3 === e.which) ||
            ($(".dropdown-backdrop").remove(),
                $(toggle).each(function () {
                    var $this = $(this),
                        $parent = getParent($this),
                        relatedTarget = { relatedTarget: this };
                    $parent.hasClass("open") &&
                    ((e && "click" == e.type && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) ||
                        ($parent.trigger((e = $.Event("hide.bs.dropdown", relatedTarget))), e.isDefaultPrevented() || ($this.attr("aria-expanded", "false"), $parent.removeClass("open").trigger("hidden.bs.dropdown", relatedTarget))));
                }));
        }
        (Dropdown.VERSION = "3.3.5"),
            (Dropdown.prototype.toggle = function (e) {
                var $this = $(this);
                if (!$this.is(".disabled, :disabled")) {
                    var $parent = getParent($this),
                        relatedTarget = $parent.hasClass("open");
                    if ((clearMenus(), !relatedTarget)) {
                        "ontouchstart" in document.documentElement && !$parent.closest(".navbar-nav").length && $(document.createElement("div")).addClass("dropdown-backdrop").insertAfter($(this)).on("click", clearMenus);
                        relatedTarget = { relatedTarget: this };
                        if (($parent.trigger((e = $.Event("show.bs.dropdown", relatedTarget))), e.isDefaultPrevented())) return;
                        $this.trigger("focus").attr("aria-expanded", "true"), $parent.toggleClass("open").trigger("shown.bs.dropdown", relatedTarget);
                    }
                    return !1;
                }
            }),
            (Dropdown.prototype.keydown = function (e) {
                if (/(38|40|27|32)/.test(e.which) && !/input|textarea/i.test(e.target.tagName)) {
                    var $items = $(this);
                    if ((e.preventDefault(), e.stopPropagation(), !$items.is(".disabled, :disabled"))) {
                        var index = getParent($items),
                            isActive = index.hasClass("open");
                        if ((!isActive && 27 != e.which) || (isActive && 27 == e.which)) return 27 == e.which && index.find(toggle).trigger("focus"), $items.trigger("click");
                        $items = index.find(".dropdown-menu li:not(.disabled):visible a");
                        $items.length && ((index = $items.index(e.target)), 38 == e.which && 0 < index && index--, 40 == e.which && index < $items.length - 1 && index++, ~index || (index = 0), $items.eq(index).trigger("focus"));
                    }
                }
            });
        var old = $.fn.dropdown;
        ($.fn.dropdown = function (option) {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data("bs.dropdown");
                data || $this.data("bs.dropdown", (data = new Dropdown(this))), "string" == typeof option && data[option].call($this);
            });
        }),
            ($.fn.dropdown.Constructor = Dropdown),
            ($.fn.dropdown.noConflict = function () {
                return ($.fn.dropdown = old), this;
            }),
            $(document)
                .on("click.bs.dropdown.data-api", clearMenus)
                .on("click.bs.dropdown.data-api", ".dropdown form", function (e) {
                    e.stopPropagation();
                })
                .on("click.bs.dropdown.data-api", toggle, Dropdown.prototype.toggle)
                .on("keydown.bs.dropdown.data-api", toggle, Dropdown.prototype.keydown)
                .on("keydown.bs.dropdown.data-api", ".dropdown-menu", Dropdown.prototype.keydown);
    })(jQuery),
    (function ($) {
        "use strict";
        function Tab(element) {
            this.element = $(element);
        }
        function Plugin(option) {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data("bs.tab");
                data || $this.data("bs.tab", (data = new Tab(this))), "string" == typeof option && data[option]();
            });
        }
        (Tab.VERSION = "3.3.5"),
            (Tab.TRANSITION_DURATION = 150),
            (Tab.prototype.show = function () {
                var $previous,
                    hideEvent,
                    showEvent,
                    $this = this.element,
                    $ul = $this.closest("ul:not(.dropdown-menu)"),
                    $target = ($target = $this.data("target")) || (($target = $this.attr("href")) && $target.replace(/.*(?=#[^\s]*$)/, ""));
                $this.parent("li").hasClass("active") ||
                (($previous = $ul.find(".active:last a")),
                    (hideEvent = $.Event("hide.bs.tab", { relatedTarget: $this[0] })),
                    (showEvent = $.Event("show.bs.tab", { relatedTarget: $previous[0] })),
                    $previous.trigger(hideEvent),
                    $this.trigger(showEvent),
                showEvent.isDefaultPrevented() ||
                hideEvent.isDefaultPrevented() ||
                (($target = $($target)),
                    this.activate($this.closest("li"), $ul),
                    this.activate($target, $target.parent(), function () {
                        $previous.trigger({ type: "hidden.bs.tab", relatedTarget: $this[0] }), $this.trigger({ type: "shown.bs.tab", relatedTarget: $previous[0] });
                    })));
            }),
            (Tab.prototype.activate = function (element, container, callback) {
                var $active = container.find("> .active"),
                    transition = callback && $.support.transition && (($active.length && $active.hasClass("fade")) || !!container.find("> .fade").length);
                function next() {
                    $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1),
                        element.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0),
                        transition ? (element[0].offsetWidth, element.addClass("in")) : element.removeClass("fade"),
                    element.parent(".dropdown-menu").length && element.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0),
                    callback && callback();
                }
                $active.length && transition ? $active.one("bsTransitionEnd", next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next(), $active.removeClass("in");
            });
        var old = $.fn.tab;
        ($.fn.tab = Plugin),
            ($.fn.tab.Constructor = Tab),
            ($.fn.tab.noConflict = function () {
                return ($.fn.tab = old), this;
            });
        function clickHandler(e) {
            e.preventDefault(), Plugin.call($(this), "show");
        }
        $(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', clickHandler).on("click.bs.tab.data-api", '[data-toggle="pill"]', clickHandler);
    })(jQuery),
    (function ($) {
        "use strict";
        function Tooltip(element, options) {
            (this.type = null), (this.options = null), (this.enabled = null), (this.timeout = null), (this.hoverState = null), (this.$element = null), (this.inState = null), this.init("tooltip", element, options);
        }
        (Tooltip.VERSION = "3.3.5"),
            (Tooltip.TRANSITION_DURATION = 150),
            (Tooltip.DEFAULTS = {
                animation: !0,
                placement: "top",
                selector: !1,
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: "hover focus",
                title: "",
                delay: 0,
                html: !1,
                container: !1,
                viewport: { selector: "body", padding: 0 },
            }),
            (Tooltip.prototype.init = function (type, element, options) {
                if (
                    ((this.enabled = !0),
                        (this.type = type),
                        (this.$element = $(element)),
                        (this.options = this.getOptions(options)),
                        (this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport)),
                        (this.inState = { click: !1, hover: !1, focus: !1 }),
                    this.$element[0] instanceof document.constructor && !this.options.selector)
                )
                    throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
                for (var triggers = this.options.trigger.split(" "), i = triggers.length; i--; ) {
                    var eventIn,
                        eventOut = triggers[i];
                    "click" == eventOut
                        ? this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this))
                        : "manual" != eventOut &&
                        ((eventIn = "hover" == eventOut ? "mouseenter" : "focusin"),
                            (eventOut = "hover" == eventOut ? "mouseleave" : "focusout"),
                            this.$element.on(eventIn + "." + this.type, this.options.selector, $.proxy(this.enter, this)),
                            this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this)));
                }
                this.options.selector ? (this._options = $.extend({}, this.options, { trigger: "manual", selector: "" })) : this.fixTitle();
            }),
            (Tooltip.prototype.getDefaults = function () {
                return Tooltip.DEFAULTS;
            }),
            (Tooltip.prototype.getOptions = function (options) {
                return (options = $.extend({}, this.getDefaults(), this.$element.data(), options)).delay && "number" == typeof options.delay && (options.delay = { show: options.delay, hide: options.delay }), options;
            }),
            (Tooltip.prototype.getDelegateOptions = function () {
                var options = {},
                    defaults = this.getDefaults();
                return (
                    this._options &&
                    $.each(this._options, function (key, value) {
                        defaults[key] != value && (options[key] = value);
                    }),
                        options
                );
            }),
            (Tooltip.prototype.enter = function (obj) {
                var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
                if (
                    (self || ((self = new this.constructor(obj.currentTarget, this.getDelegateOptions())), $(obj.currentTarget).data("bs." + this.type, self)),
                    obj instanceof $.Event && (self.inState["focusin" == obj.type ? "focus" : "hover"] = !0),
                    self.tip().hasClass("in") || "in" == self.hoverState)
                )
                    self.hoverState = "in";
                else {
                    if ((clearTimeout(self.timeout), (self.hoverState = "in"), !self.options.delay || !self.options.delay.show)) return self.show();
                    self.timeout = setTimeout(function () {
                        "in" == self.hoverState && self.show();
                    }, self.options.delay.show);
                }
            }),
            (Tooltip.prototype.isInStateTrue = function () {
                for (var key in this.inState) if (this.inState[key]) return !0;
                return !1;
            }),
            (Tooltip.prototype.leave = function (obj) {
                var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
                if (
                    (self || ((self = new this.constructor(obj.currentTarget, this.getDelegateOptions())), $(obj.currentTarget).data("bs." + this.type, self)),
                    obj instanceof $.Event && (self.inState["focusout" == obj.type ? "focus" : "hover"] = !1),
                        !self.isInStateTrue())
                ) {
                    if ((clearTimeout(self.timeout), (self.hoverState = "out"), !self.options.delay || !self.options.delay.hide)) return self.hide();
                    self.timeout = setTimeout(function () {
                        "out" == self.hoverState && self.hide();
                    }, self.options.delay.hide);
                }
            }),
            (Tooltip.prototype.show = function () {
                var that,
                    $tip,
                    actualWidth,
                    orgPlacement,
                    viewportDim,
                    calculatedOffset,
                    complete,
                    pos = $.Event("show.bs." + this.type);
                this.hasContent() &&
                this.enabled &&
                (this.$element.trigger(pos),
                    (actualWidth = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])),
                !pos.isDefaultPrevented() &&
                actualWidth &&
                (($tip = (that = this).tip()),
                    (calculatedOffset = this.getUID(this.type)),
                    this.setContent(),
                    $tip.attr("id", calculatedOffset),
                    this.$element.attr("aria-describedby", calculatedOffset),
                this.options.animation && $tip.addClass("fade"),
                    (complete = "function" == typeof this.options.placement ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement),
                (viewportDim = (orgPlacement = /\s?auto?\s?/i).test(complete)) && (complete = complete.replace(orgPlacement, "") || "top"),
                    $tip
                        .detach()
                        .css({ top: 0, left: 0, display: "block" })
                        .addClass(complete)
                        .data("bs." + this.type, this),
                    this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element),
                    this.$element.trigger("inserted.bs." + this.type),
                    (pos = this.getPosition()),
                    (actualWidth = $tip[0].offsetWidth),
                    (calculatedOffset = $tip[0].offsetHeight),
                viewportDim &&
                ((orgPlacement = complete),
                    (viewportDim = this.getPosition(this.$viewport)),
                    (complete =
                        "bottom" == complete && pos.bottom + calculatedOffset > viewportDim.bottom
                            ? "top"
                            : "top" == complete && pos.top - calculatedOffset < viewportDim.top
                                ? "bottom"
                                : "right" == complete && pos.right + actualWidth > viewportDim.width
                                    ? "left"
                                    : "left" == complete && pos.left - actualWidth < viewportDim.left
                                        ? "right"
                                        : complete),
                    $tip.removeClass(orgPlacement).addClass(complete)),
                    (calculatedOffset = this.getCalculatedOffset(complete, pos, actualWidth, calculatedOffset)),
                    this.applyPlacement(calculatedOffset, complete),
                    (complete = function () {
                        var prevHoverState = that.hoverState;
                        that.$element.trigger("shown.bs." + that.type), (that.hoverState = null), "out" == prevHoverState && that.leave(that);
                    }),
                    $.support.transition && this.$tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete()));
            }),
            (Tooltip.prototype.applyPlacement = function (offset, isVertical) {
                var $tip = this.tip(),
                    width = $tip[0].offsetWidth,
                    arrowDelta = $tip[0].offsetHeight,
                    arrowOffsetPosition = parseInt($tip.css("margin-top"), 10),
                    delta = parseInt($tip.css("margin-left"), 10);
                isNaN(arrowOffsetPosition) && (arrowOffsetPosition = 0),
                isNaN(delta) && (delta = 0),
                    (offset.top += arrowOffsetPosition),
                    (offset.left += delta),
                    $.offset.setOffset(
                        $tip[0],
                        $.extend(
                            {
                                using: function (props) {
                                    $tip.css({ top: Math.round(props.top), left: Math.round(props.left) });
                                },
                            },
                            offset
                        ),
                        0
                    ),
                    $tip.addClass("in");
                var actualWidth = $tip[0].offsetWidth,
                    arrowOffsetPosition = $tip[0].offsetHeight;
                "top" == isVertical && arrowOffsetPosition != arrowDelta && (offset.top = offset.top + arrowDelta - arrowOffsetPosition);
                delta = this.getViewportAdjustedDelta(isVertical, offset, actualWidth, arrowOffsetPosition);
                delta.left ? (offset.left += delta.left) : (offset.top += delta.top);
                (isVertical = /top|bottom/.test(isVertical)),
                    (arrowDelta = isVertical ? 2 * delta.left - width + actualWidth : 2 * delta.top - arrowDelta + arrowOffsetPosition),
                    (arrowOffsetPosition = isVertical ? "offsetWidth" : "offsetHeight");
                $tip.offset(offset), this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
            }),
            (Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
                this.arrow()
                    .css(isVertical ? "left" : "top", 50 * (1 - delta / dimension) + "%")
                    .css(isVertical ? "top" : "left", "");
            }),
            (Tooltip.prototype.setContent = function () {
                var $tip = this.tip(),
                    title = this.getTitle();
                $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title), $tip.removeClass("fade in top bottom left right");
            }),
            (Tooltip.prototype.hide = function (callback) {
                var that = this,
                    $tip = $(this.$tip),
                    e = $.Event("hide.bs." + this.type);
                function complete() {
                    "in" != that.hoverState && $tip.detach(), that.$element.removeAttr("aria-describedby").trigger("hidden.bs." + that.type), callback && callback();
                }
                if ((this.$element.trigger(e), !e.isDefaultPrevented()))
                    return $tip.removeClass("in"), $.support.transition && $tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete(), (this.hoverState = null), this;
            }),
            (Tooltip.prototype.fixTitle = function () {
                var $e = this.$element;
                (!$e.attr("title") && "string" == typeof $e.attr("data-original-title")) || $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
            }),
            (Tooltip.prototype.hasContent = function () {
                return this.getTitle();
            }),
            (Tooltip.prototype.getPosition = function (scroll) {
                var elOffset = (scroll = scroll || this.$element)[0],
                    outerDims = "BODY" == elOffset.tagName,
                    elRect = elOffset.getBoundingClientRect();
                null == elRect.width && (elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top }));
                (elOffset = outerDims ? { top: 0, left: 0 } : scroll.offset()),
                    (scroll = { scroll: outerDims ? document.documentElement.scrollTop || document.body.scrollTop : scroll.scrollTop() }),
                    (outerDims = outerDims ? { width: $(window).width(), height: $(window).height() } : null);
                return $.extend({}, elRect, scroll, outerDims, elOffset);
            }),
            (Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
                return "bottom" == placement
                    ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 }
                    : "top" == placement
                        ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 }
                        : "left" == placement
                            ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth }
                            : { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
            }),
            (Tooltip.prototype.getViewportAdjustedDelta = function (topEdgeOffset, pos, rightEdgeOffset, actualHeight) {
                var delta = { top: 0, left: 0 };
                if (!this.$viewport) return delta;
                var leftEdgeOffset,
                    viewportPadding = (this.options.viewport && this.options.viewport.padding) || 0,
                    viewportDimensions = this.getPosition(this.$viewport);
                return (
                    /right|left/.test(topEdgeOffset)
                        ? ((topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll),
                            (leftEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight),
                            topEdgeOffset < viewportDimensions.top
                                ? (delta.top = viewportDimensions.top - topEdgeOffset)
                                : leftEdgeOffset > viewportDimensions.top + viewportDimensions.height && (delta.top = viewportDimensions.top + viewportDimensions.height - leftEdgeOffset))
                        : ((leftEdgeOffset = pos.left - viewportPadding),
                            (rightEdgeOffset = pos.left + viewportPadding + rightEdgeOffset),
                            leftEdgeOffset < viewportDimensions.left
                                ? (delta.left = viewportDimensions.left - leftEdgeOffset)
                                : rightEdgeOffset > viewportDimensions.right && (delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset)),
                        delta
                );
            }),
            (Tooltip.prototype.getTitle = function () {
                var $e = this.$element,
                    o = this.options;
                return $e.attr("data-original-title") || ("function" == typeof o.title ? o.title.call($e[0]) : o.title);
            }),
            (Tooltip.prototype.getUID = function (prefix) {
                for (; (prefix += ~~(1e6 * Math.random())), document.getElementById(prefix); );
                return prefix;
            }),
            (Tooltip.prototype.tip = function () {
                if (!this.$tip && ((this.$tip = $(this.options.template)), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
                return this.$tip;
            }),
            (Tooltip.prototype.arrow = function () {
                return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"));
            }),
            (Tooltip.prototype.enable = function () {
                this.enabled = !0;
            }),
            (Tooltip.prototype.disable = function () {
                this.enabled = !1;
            }),
            (Tooltip.prototype.toggleEnabled = function () {
                this.enabled = !this.enabled;
            }),
            (Tooltip.prototype.toggle = function (e) {
                var self = this;
                e && ((self = $(e.currentTarget).data("bs." + this.type)) || ((self = new this.constructor(e.currentTarget, this.getDelegateOptions())), $(e.currentTarget).data("bs." + this.type, self))),
                    e ? ((self.inState.click = !self.inState.click), self.isInStateTrue() ? self.enter(self) : self.leave(self)) : self.tip().hasClass("in") ? self.leave(self) : self.enter(self);
            }),
            (Tooltip.prototype.destroy = function () {
                var that = this;
                clearTimeout(this.timeout),
                    this.hide(function () {
                        that.$element.off("." + that.type).removeData("bs." + that.type), that.$tip && that.$tip.detach(), (that.$tip = null), (that.$arrow = null), (that.$viewport = null);
                    });
            });
        var old = $.fn.tooltip;
        ($.fn.tooltip = function (option) {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data("bs.tooltip"),
                    options = "object" == typeof option && option;
                (!data && /destroy|hide/.test(option)) || (data || $this.data("bs.tooltip", (data = new Tooltip(this, options))), "string" == typeof option && data[option]());
            });
        }),
            ($.fn.tooltip.Constructor = Tooltip),
            ($.fn.tooltip.noConflict = function () {
                return ($.fn.tooltip = old), this;
            });
    })(jQuery),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery"], factory) : factory(jQuery);
    })(function ($) {
        var selectorEscape, uuid, eventType;
        function focusable(element, hasTabindex) {
            var map,
                img,
                nodeName = element.nodeName.toLowerCase();
            return "area" === nodeName
                ? ((img = (map = element.parentNode).name), !(!element.href || !img || "map" !== map.nodeName.toLowerCase()) && !!(img = $("img[usemap='#" + img + "']")[0]) && visible(img))
                : (/^(input|select|textarea|button|object)$/.test(nodeName) ? !element.disabled : ("a" === nodeName && element.href) || hasTabindex) && visible(element);
        }
        function visible(element) {
            return (
                $.expr.filters.visible(element) &&
                !$(element)
                    .parents()
                    .addBack()
                    .filter(function () {
                        return "hidden" === $.css(this, "visibility");
                    }).length
            );
        }
        ($.ui = $.ui || {}),
            $.extend($.ui, {
                version: "@VERSION",
                keyCode: { BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38 },
                safeActiveElement: function (document) {
                    var activeElement;
                    try {
                        activeElement = document.activeElement;
                    } catch (error) {
                        activeElement = document.body;
                    }
                    return (activeElement = activeElement || document.body).nodeName || (activeElement = document.body), activeElement;
                },
                safeBlur: function (element) {
                    element && "body" !== element.nodeName.toLowerCase() && $(element).trigger("blur");
                },
                escapeSelector:
                    ((selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g),
                        function (selector) {
                            return selector.replace(selectorEscape, "\\$1");
                        }),
            }),
            $.fn.extend({
                scrollParent: function (scrollParent) {
                    var position = this.css("position"),
                        excludeStaticParent = "absolute" === position,
                        overflowRegex = scrollParent ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                        scrollParent = this.parents()
                            .filter(function () {
                                var parent = $(this);
                                return (!excludeStaticParent || "static" !== parent.css("position")) && overflowRegex.test(parent.css("overflow") + parent.css("overflow-y") + parent.css("overflow-x"));
                            })
                            .eq(0);
                    return "fixed" !== position && scrollParent.length ? scrollParent : $(this[0].ownerDocument || document);
                },
                uniqueId:
                    ((uuid = 0),
                        function () {
                            return this.each(function () {
                                this.id || (this.id = "ui-id-" + ++uuid);
                            });
                        }),
                removeUniqueId: function () {
                    return this.each(function () {
                        /^ui-id-\d+$/.test(this.id) && $(this).removeAttr("id");
                    });
                },
                form: function () {
                    return "string" == typeof this[0].form ? this.closest("form") : $(this[0].form);
                },
                labels: function () {
                    var selector, labels, ancestors;
                    return this[0].labels && this[0].labels.length
                        ? this.pushStack(this[0].labels)
                        : ((labels = this.eq(0).parents("label")),
                        (selector = this.attr("id")) &&
                        ((ancestors = (ancestors = this.eq(0).parents().last()).add((ancestors.length ? ancestors : this).siblings())),
                            (selector = "label[for='" + $.ui.escapeSelector(selector) + "']"),
                            (labels = labels.add(ancestors.find(selector).addBack(selector)))),
                            this.pushStack(labels));
                },
            }),
            $.extend($.expr[":"], {
                data: $.expr.createPseudo
                    ? $.expr.createPseudo(function (dataName) {
                        return function (elem) {
                            return !!$.data(elem, dataName);
                        };
                    })
                    : function (elem, i, match) {
                        return !!$.data(elem, match[3]);
                    },
                focusable: function (element) {
                    return focusable(element, null != $.attr(element, "tabindex"));
                },
                tabbable: function (element) {
                    var tabIndex = $.attr(element, "tabindex"),
                        hasTabindex = null != tabIndex;
                    return (!hasTabindex || 0 <= tabIndex) && focusable(element, hasTabindex);
                },
            }),
        "1.7" === $.fn.jquery.substring(0, 3) &&
        ($.each(["Width", "Height"], function (i, name) {
            var side = "Width" === name ? ["Left", "Right"] : ["Top", "Bottom"],
                type = name.toLowerCase(),
                orig = { innerWidth: $.fn.innerWidth, innerHeight: $.fn.innerHeight, outerWidth: $.fn.outerWidth, outerHeight: $.fn.outerHeight };
            function reduce(elem, size, border, margin) {
                return (
                    $.each(side, function () {
                        (size -= parseFloat($.css(elem, "padding" + this)) || 0), border && (size -= parseFloat($.css(elem, "border" + this + "Width")) || 0), margin && (size -= parseFloat($.css(elem, "margin" + this)) || 0);
                    }),
                        size
                );
            }
            ($.fn["inner" + name] = function (size) {
                return void 0 === size
                    ? orig["inner" + name].call(this)
                    : this.each(function () {
                        $(this).css(type, reduce(this, size) + "px");
                    });
            }),
                ($.fn["outer" + name] = function (size, margin) {
                    return "number" != typeof size
                        ? orig["outer" + name].call(this, size)
                        : this.each(function () {
                            $(this).css(type, reduce(this, size, !0, margin) + "px");
                        });
                });
        }),
            ($.fn.addBack = function (selector) {
                return this.add(null == selector ? this.prevObject : this.prevObject.filter(selector));
            })),
            ($.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase())),
            $.fn.extend({
                disableSelection:
                    ((eventType = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown"),
                        function () {
                            return this.on(eventType + ".ui-disableSelection", function (event) {
                                event.preventDefault();
                            });
                        }),
                enableSelection: function () {
                    return this.off(".ui-disableSelection");
                },
            }),
            ($.ui.plugin = {
                add: function (module, option, set) {
                    var i,
                        proto = $.ui[module].prototype;
                    for (i in set) (proto.plugins[i] = proto.plugins[i] || []), proto.plugins[i].push([option, set[i]]);
                },
                call: function (instance, name, args, allowDisconnected) {
                    var i,
                        set = instance.plugins[name];
                    if (set && (allowDisconnected || (instance.element[0].parentNode && 11 !== instance.element[0].parentNode.nodeType)))
                        for (i = 0; i < set.length; i++) instance.options[set[i][0]] && set[i][1].apply(instance.element, args);
                },
            });
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery"], factory) : factory(jQuery);
    })(function ($) {
        var orig,
            widget_uuid = 0,
            widget_slice = Array.prototype.slice;
        return (
            ($.cleanData =
                ((orig = $.cleanData),
                    function (elems) {
                        for (var events, elem, i = 0; null != (elem = elems[i]); i++)
                            try {
                                (events = $._data(elem, "events")) && events.remove && $(elem).triggerHandler("remove");
                            } catch (e) {}
                        orig(elems);
                    })),
                ($.widget = function (name, base, prototype) {
                    var fullName,
                        existingConstructor,
                        constructor,
                        basePrototype,
                        proxiedPrototype = {},
                        namespace = name.split(".")[0];
                    return (
                        (name = name.split(".")[1]),
                            (fullName = namespace + "-" + name),
                        prototype || ((prototype = base), (base = $.Widget)),
                        $.isArray(prototype) && (prototype = $.extend.apply(null, [{}].concat(prototype))),
                            ($.expr[":"][fullName.toLowerCase()] = function (elem) {
                                return !!$.data(elem, fullName);
                            }),
                            ($[namespace] = $[namespace] || {}),
                            (existingConstructor = $[namespace][name]),
                            (constructor = $[namespace][name] = function (options, element) {
                                if (!this._createWidget) return new constructor(options, element);
                                arguments.length && this._createWidget(options, element);
                            }),
                            $.extend(constructor, existingConstructor, { version: prototype.version, _proto: $.extend({}, prototype), _childConstructors: [] }),
                            ((basePrototype = new base()).options = $.widget.extend({}, basePrototype.options)),
                            $.each(prototype, function (prop, value) {
                                function _super() {
                                    return base.prototype[prop].apply(this, arguments);
                                }
                                function _superApply(args) {
                                    return base.prototype[prop].apply(this, args);
                                }
                                $.isFunction(value)
                                    ? (proxiedPrototype[prop] = function () {
                                        var returnValue,
                                            __super = this._super,
                                            __superApply = this._superApply;
                                        return (this._super = _super), (this._superApply = _superApply), (returnValue = value.apply(this, arguments)), (this._super = __super), (this._superApply = __superApply), returnValue;
                                    })
                                    : (proxiedPrototype[prop] = value);
                            }),
                            (constructor.prototype = $.widget.extend(basePrototype, { widgetEventPrefix: (existingConstructor && basePrototype.widgetEventPrefix) || name }, proxiedPrototype, {
                                constructor: constructor,
                                namespace: namespace,
                                widgetName: name,
                                widgetFullName: fullName,
                            })),
                            existingConstructor
                                ? ($.each(existingConstructor._childConstructors, function (i, child) {
                                    var childPrototype = child.prototype;
                                    $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
                                }),
                                    delete existingConstructor._childConstructors)
                                : base._childConstructors.push(constructor),
                            $.widget.bridge(name, constructor),
                            constructor
                    );
                }),
                ($.widget.extend = function (target) {
                    for (var key, value, input = widget_slice.call(arguments, 1), inputIndex = 0, inputLength = input.length; inputIndex < inputLength; inputIndex++)
                        for (key in input[inputIndex])
                            (value = input[inputIndex][key]),
                            input[inputIndex].hasOwnProperty(key) &&
                            void 0 !== value &&
                            ($.isPlainObject(value) ? (target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : $.widget.extend({}, value)) : (target[key] = value));
                    return target;
                }),
                ($.widget.bridge = function (name, object) {
                    var fullName = object.prototype.widgetFullName || name;
                    $.fn[name] = function (options) {
                        var isMethodCall = "string" == typeof options,
                            args = widget_slice.call(arguments, 1),
                            returnValue = this;
                        return (
                            isMethodCall
                                ? this.each(function () {
                                    var methodValue,
                                        instance = $.data(this, fullName);
                                    return "instance" === options
                                        ? ((returnValue = instance), !1)
                                        : instance
                                            ? $.isFunction(instance[options]) && "_" !== options.charAt(0)
                                                ? (methodValue = instance[options].apply(instance, args)) !== instance && void 0 !== methodValue
                                                    ? ((returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue), !1)
                                                    : void 0
                                                : $.error("no such method '" + options + "' for " + name + " widget instance")
                                            : $.error("cannot call methods on " + name + " prior to initialization; attempted to call method '" + options + "'");
                                })
                                : (args.length && (options = $.widget.extend.apply(null, [options].concat(args))),
                                    this.each(function () {
                                        var instance = $.data(this, fullName);
                                        instance ? (instance.option(options || {}), instance._init && instance._init()) : $.data(this, fullName, new object(options, this));
                                    })),
                                returnValue
                        );
                    };
                }),
                ($.Widget = function () {}),
                ($.Widget._childConstructors = []),
                ($.Widget.prototype = {
                    widgetName: "widget",
                    widgetEventPrefix: "",
                    defaultElement: "<div>",
                    options: { classes: {}, disabled: !1, create: null },
                    _createWidget: function (options, element) {
                        (element = $(element || this.defaultElement || this)[0]),
                            (this.element = $(element)),
                            (this.uuid = widget_uuid++),
                            (this.eventNamespace = "." + this.widgetName + this.uuid),
                            (this.bindings = $()),
                            (this.hoverable = $()),
                            (this.focusable = $()),
                            (this.classesElementLookup = {}),
                        element !== this &&
                        ($.data(element, this.widgetFullName, this),
                            this._on(!0, this.element, {
                                remove: function (event) {
                                    event.target === element && this.destroy();
                                },
                            }),
                            (this.document = $(element.style ? element.ownerDocument : element.document || element)),
                            (this.window = $(this.document[0].defaultView || this.document[0].parentWindow))),
                            (this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options)),
                            this._create(),
                            this._trigger("create", null, this._getCreateEventData()),
                            this._init();
                    },
                    _getCreateOptions: $.noop,
                    _getCreateEventData: $.noop,
                    _create: $.noop,
                    _init: $.noop,
                    destroy: function () {
                        var that = this;
                        this._destroy(),
                            $.each(this.classesElementLookup, function (key, value) {
                                that._removeClass(value, key);
                            }),
                            this.element.off(this.eventNamespace).removeData(this.widgetFullName),
                            this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),
                            this.bindings.off(this.eventNamespace);
                    },
                    _destroy: $.noop,
                    widget: function () {
                        return this.element;
                    },
                    option: function (key, value) {
                        var parts,
                            curOption,
                            i,
                            options = key;
                        if (0 === arguments.length) return $.widget.extend({}, this.options);
                        if ("string" == typeof key)
                            if (((options = {}), (key = (parts = key.split(".")).shift()), parts.length)) {
                                for (curOption = options[key] = $.widget.extend({}, this.options[key]), i = 0; i < parts.length - 1; i++) (curOption[parts[i]] = curOption[parts[i]] || {}), (curOption = curOption[parts[i]]);
                                if (((key = parts.pop()), 1 === arguments.length)) return void 0 === curOption[key] ? null : curOption[key];
                                curOption[key] = value;
                            } else {
                                if (1 === arguments.length) return void 0 === this.options[key] ? null : this.options[key];
                                options[key] = value;
                            }
                        return this._setOptions(options), this;
                    },
                    _setOptions: function (options) {
                        for (var key in options) this._setOption(key, options[key]);
                        return this;
                    },
                    _setOption: function (key, value) {
                        return (
                            "classes" === key && this._setOptionClasses(value),
                                (this.options[key] = value),
                            "disabled" === key &&
                            (this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!value),
                            value && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))),
                                this
                        );
                    },
                    _setOptionClasses: function (value) {
                        var classKey, elements, currentElements;
                        for (classKey in value)
                            (currentElements = this.classesElementLookup[classKey]),
                            value[classKey] !== this.options.classes[classKey] &&
                            currentElements &&
                            currentElements.length &&
                            ((elements = $(currentElements.get())), this._removeClass(currentElements, classKey), elements.addClass(this._classes({ element: elements, keys: classKey, classes: value, add: !0 })));
                    },
                    enable: function () {
                        return this._setOptions({ disabled: !1 });
                    },
                    disable: function () {
                        return this._setOptions({ disabled: !0 });
                    },
                    _classes: function (options) {
                        var full = [],
                            that = this;
                        function processClassString(classes, checkOption) {
                            for (var current, i = 0; i < classes.length; i++)
                                (current = that.classesElementLookup[classes[i]] || $()),
                                    (current = options.add ? $($.unique(current.get().concat(options.element.get()))) : $(current.not(options.element).get())),
                                    (that.classesElementLookup[classes[i]] = current),
                                    full.push(classes[i]),
                                checkOption && options.classes[classes[i]] && full.push(options.classes[classes[i]]);
                        }
                        return (
                            (options = $.extend({ element: this.element, classes: this.options.classes || {} }, options)).keys && processClassString(options.keys.match(/\S+/g) || [], !0),
                            options.extra && processClassString(options.extra.match(/\S+/g) || []),
                                full.join(" ")
                        );
                    },
                    _removeClass: function (element, keys, extra) {
                        return this._toggleClass(element, keys, extra, !1);
                    },
                    _addClass: function (element, keys, extra) {
                        return this._toggleClass(element, keys, extra, !0);
                    },
                    _toggleClass: function (options, keys, extra, add) {
                        add = "boolean" == typeof add ? add : extra;
                        var shift = "string" == typeof options || null === options,
                            options = { extra: shift ? keys : extra, keys: shift ? options : keys, element: shift ? this.element : options, add: add };
                        return options.element.toggleClass(this._classes(options), add), this;
                    },
                    _on: function (suppressDisabledCheck, element, handlers) {
                        var delegateElement,
                            instance = this;
                        "boolean" != typeof suppressDisabledCheck && ((handlers = element), (element = suppressDisabledCheck), (suppressDisabledCheck = !1)),
                            handlers ? ((element = delegateElement = $(element)), (this.bindings = this.bindings.add(element))) : ((handlers = element), (element = this.element), (delegateElement = this.widget())),
                            $.each(handlers, function (eventName, handler) {
                                function handlerProxy() {
                                    if (suppressDisabledCheck || (!0 !== instance.options.disabled && !$(this).hasClass("ui-state-disabled"))) return ("string" == typeof handler ? instance[handler] : handler).apply(instance, arguments);
                                }
                                "string" != typeof handler && (handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++);
                                var selector = eventName.match(/^([\w:-]*)\s*(.*)$/),
                                    eventName = selector[1] + instance.eventNamespace,
                                    selector = selector[2];
                                selector ? delegateElement.on(eventName, selector, handlerProxy) : element.on(eventName, handlerProxy);
                            });
                    },
                    _off: function (element, eventName) {
                        (eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace),
                            element.off(eventName).off(eventName),
                            (this.bindings = $(this.bindings.not(element).get())),
                            (this.focusable = $(this.focusable.not(element).get())),
                            (this.hoverable = $(this.hoverable.not(element).get()));
                    },
                    _delay: function (handler, delay) {
                        var instance = this;
                        return setTimeout(function () {
                            return ("string" == typeof handler ? instance[handler] : handler).apply(instance, arguments);
                        }, delay || 0);
                    },
                    _hoverable: function (element) {
                        (this.hoverable = this.hoverable.add(element)),
                            this._on(element, {
                                mouseenter: function (event) {
                                    this._addClass($(event.currentTarget), null, "ui-state-hover");
                                },
                                mouseleave: function (event) {
                                    this._removeClass($(event.currentTarget), null, "ui-state-hover");
                                },
                            });
                    },
                    _focusable: function (element) {
                        (this.focusable = this.focusable.add(element)),
                            this._on(element, {
                                focusin: function (event) {
                                    this._addClass($(event.currentTarget), null, "ui-state-focus");
                                },
                                focusout: function (event) {
                                    this._removeClass($(event.currentTarget), null, "ui-state-focus");
                                },
                            });
                    },
                    _trigger: function (type, event, data) {
                        var prop,
                            orig,
                            callback = this.options[type];
                        if (((data = data || {}), ((event = $.Event(event)).type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase()), (event.target = this.element[0]), (orig = event.originalEvent)))
                            for (prop in orig) prop in event || (event[prop] = orig[prop]);
                        return this.element.trigger(event, data), !(($.isFunction(callback) && !1 === callback.apply(this.element[0], [event].concat(data))) || event.isDefaultPrevented());
                    },
                }),
                $.each({ show: "fadeIn", hide: "fadeOut" }, function (method, defaultEffect) {
                    $.Widget.prototype["_" + method] = function (element, options, callback) {
                        "string" == typeof options && (options = { effect: options });
                        var hasOptions,
                            effectName = options ? (!0 !== options && "number" != typeof options && options.effect) || defaultEffect : method;
                        "number" == typeof (options = options || {}) && (options = { duration: options }),
                            (hasOptions = !$.isEmptyObject(options)),
                            (options.complete = callback),
                        options.delay && element.delay(options.delay),
                            hasOptions && $.effects && $.effects.effect[effectName]
                                ? element[method](options)
                                : effectName !== method && element[effectName]
                                    ? element[effectName](options.duration, options.easing, callback)
                                    : element.queue(function (next) {
                                        $(this)[method](), callback && callback.call(element[0]), next();
                                    });
                    };
                }),
                $.widget
        );
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery", "./widget"], factory) : factory(jQuery);
    })(function ($) {
        var mouseHandled = !1;
        return (
            $(document).on("mouseup", function () {
                mouseHandled = !1;
            }),
                $.widget("ui.mouse", {
                    version: "@VERSION",
                    options: { cancel: "input, textarea, button, select, option", distance: 1, delay: 0 },
                    _mouseInit: function () {
                        var that = this;
                        this.element
                            .on("mousedown." + this.widgetName, function (event) {
                                return that._mouseDown(event);
                            })
                            .on("click." + this.widgetName, function (event) {
                                if (!0 === $.data(event.target, that.widgetName + ".preventClickEvent")) return $.removeData(event.target, that.widgetName + ".preventClickEvent"), event.stopImmediatePropagation(), !1;
                            }),
                            (this.started = !1);
                    },
                    _mouseDestroy: function () {
                        this.element.off("." + this.widgetName), this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate);
                    },
                    _mouseDown: function (event) {
                        if (!mouseHandled) {
                            (this._mouseMoved = !1), this._mouseStarted && this._mouseUp(event), (this._mouseDownEvent = event);
                            var that = this,
                                btnIsLeft = 1 === event.which,
                                elIsCancel = !("string" != typeof this.options.cancel || !event.target.nodeName) && $(event.target).closest(this.options.cancel).length;
                            return btnIsLeft && !elIsCancel && this._mouseCapture(event)
                                ? ((this.mouseDelayMet = !this.options.delay),
                                this.mouseDelayMet ||
                                (this._mouseDelayTimer = setTimeout(function () {
                                    that.mouseDelayMet = !0;
                                }, this.options.delay)),
                                    this._mouseDistanceMet(event) && this._mouseDelayMet(event) && ((this._mouseStarted = !1 !== this._mouseStart(event)), !this._mouseStarted)
                                        ? (event.preventDefault(), !0)
                                        : (!0 === $.data(event.target, this.widgetName + ".preventClickEvent") && $.removeData(event.target, this.widgetName + ".preventClickEvent"),
                                            (this._mouseMoveDelegate = function (event) {
                                                return that._mouseMove(event);
                                            }),
                                            (this._mouseUpDelegate = function (event) {
                                                return that._mouseUp(event);
                                            }),
                                            this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate),
                                            event.preventDefault(),
                                            (mouseHandled = !0)))
                                : !0;
                        }
                    },
                    _mouseMove: function (event) {
                        if (this._mouseMoved) {
                            if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) return this._mouseUp(event);
                            if (!event.which) return this._mouseUp(event);
                        }
                        return (
                            (event.which || event.button) && (this._mouseMoved = !0),
                                this._mouseStarted
                                    ? (this._mouseDrag(event), event.preventDefault())
                                    : (this._mouseDistanceMet(event) && this._mouseDelayMet(event) && ((this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, event)), this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event)),
                                        !this._mouseStarted)
                        );
                    },
                    _mouseUp: function (event) {
                        return (
                            this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate),
                            this._mouseStarted && ((this._mouseStarted = !1), event.target === this._mouseDownEvent.target && $.data(event.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(event)),
                                (mouseHandled = !1)
                        );
                    },
                    _mouseDistanceMet: function (event) {
                        return Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance;
                    },
                    _mouseDelayMet: function () {
                        return this.mouseDelayMet;
                    },
                    _mouseStart: function () {},
                    _mouseDrag: function () {},
                    _mouseStop: function () {},
                    _mouseCapture: function () {
                        return !0;
                    },
                })
        );
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery"], factory) : factory(jQuery);
    })(function ($) {
        return (
            (function () {
                $.ui = $.ui || {};
                var cachedScrollbarWidth,
                    supportsOffsetFractions,
                    max = Math.max,
                    abs = Math.abs,
                    round = Math.round,
                    rhorizontal = /left|center|right/,
                    rvertical = /top|center|bottom/,
                    roffset = /[\+\-]\d+(\.[\d]+)?%?/,
                    rposition = /^\w+/,
                    rpercent = /%$/,
                    _position = $.fn.position;
                function getOffsets(offsets, width, height) {
                    return [parseFloat(offsets[0]) * (rpercent.test(offsets[0]) ? width / 100 : 1), parseFloat(offsets[1]) * (rpercent.test(offsets[1]) ? height / 100 : 1)];
                }
                function parseCss(element, property) {
                    return parseInt($.css(element, property), 10) || 0;
                }
                (supportsOffsetFractions = function () {
                    var element = $("<div>").css("position", "absolute").appendTo("body").offset({ top: 1.5, left: 1.5 }),
                        support = 1.5 === element.offset().top;
                    return (
                        element.remove(),
                            (supportsOffsetFractions = function () {
                                return support;
                            }),
                            support
                    );
                }),
                    ($.position = {
                        scrollbarWidth: function () {
                            if (void 0 !== cachedScrollbarWidth) return cachedScrollbarWidth;
                            var w1,
                                div = $("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                                w2 = div.children()[0];
                            return $("body").append(div), (w1 = w2.offsetWidth), div.css("overflow", "scroll"), w1 === (w2 = w2.offsetWidth) && (w2 = div[0].clientWidth), div.remove(), (cachedScrollbarWidth = w1 - w2);
                        },
                        getScrollInfo: function (within) {
                            var hasOverflowX = within.isWindow || within.isDocument ? "" : within.element.css("overflow-x"),
                                overflowY = within.isWindow || within.isDocument ? "" : within.element.css("overflow-y"),
                                hasOverflowX = "scroll" === hasOverflowX || ("auto" === hasOverflowX && within.width < within.element[0].scrollWidth);
                            return { width: "scroll" === overflowY || ("auto" === overflowY && within.height < within.element[0].scrollHeight) ? $.position.scrollbarWidth() : 0, height: hasOverflowX ? $.position.scrollbarWidth() : 0 };
                        },
                        getWithinInfo: function (withinElement) {
                            withinElement = $(withinElement || window);
                            return {
                                element: withinElement,
                                isWindow: $.isWindow(withinElement[0]),
                                isDocument: !!withinElement[0] && 9 === withinElement[0].nodeType,
                                offset: withinElement.offset() || { left: 0, top: 0 },
                                scrollLeft: withinElement.scrollLeft(),
                                scrollTop: withinElement.scrollTop(),
                                width: withinElement.outerWidth(),
                                height: withinElement.outerHeight(),
                            };
                        },
                    }),
                    ($.fn.position = function (options) {
                        if (!options || !options.of) return _position.apply(this, arguments);
                        options = $.extend({}, options);
                        var atOffset,
                            targetWidth,
                            targetHeight,
                            targetOffset,
                            basePosition,
                            raw,
                            target = $(options.of),
                            within = $.position.getWithinInfo(options.within),
                            scrollInfo = $.position.getScrollInfo(within),
                            collision = (options.collision || "flip").split(" "),
                            offsets = {},
                            dimensions =
                                9 === (raw = (dimensions = target)[0]).nodeType
                                    ? { width: dimensions.width(), height: dimensions.height(), offset: { top: 0, left: 0 } }
                                    : $.isWindow(raw)
                                        ? { width: dimensions.width(), height: dimensions.height(), offset: { top: dimensions.scrollTop(), left: dimensions.scrollLeft() } }
                                        : raw.preventDefault
                                            ? { width: 0, height: 0, offset: { top: raw.pageY, left: raw.pageX } }
                                            : { width: dimensions.outerWidth(), height: dimensions.outerHeight(), offset: dimensions.offset() };
                        return (
                            target[0].preventDefault && (options.at = "left top"),
                                (targetWidth = dimensions.width),
                                (targetHeight = dimensions.height),
                                (targetOffset = dimensions.offset),
                                (basePosition = $.extend({}, targetOffset)),
                                $.each(["my", "at"], function () {
                                    var horizontalOffset,
                                        verticalOffset,
                                        pos = (options[this] || "").split(" ");
                                    1 === pos.length && (pos = rhorizontal.test(pos[0]) ? pos.concat(["center"]) : rvertical.test(pos[0]) ? ["center"].concat(pos) : ["center", "center"]),
                                        (pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center"),
                                        (pos[1] = rvertical.test(pos[1]) ? pos[1] : "center"),
                                        (horizontalOffset = roffset.exec(pos[0])),
                                        (verticalOffset = roffset.exec(pos[1])),
                                        (offsets[this] = [horizontalOffset ? horizontalOffset[0] : 0, verticalOffset ? verticalOffset[0] : 0]),
                                        (options[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]]);
                                }),
                            1 === collision.length && (collision[1] = collision[0]),
                                "right" === options.at[0] ? (basePosition.left += targetWidth) : "center" === options.at[0] && (basePosition.left += targetWidth / 2),
                                "bottom" === options.at[1] ? (basePosition.top += targetHeight) : "center" === options.at[1] && (basePosition.top += targetHeight / 2),
                                (atOffset = getOffsets(offsets.at, targetWidth, targetHeight)),
                                (basePosition.left += atOffset[0]),
                                (basePosition.top += atOffset[1]),
                                this.each(function () {
                                    var collisionPosition,
                                        using,
                                        elem = $(this),
                                        elemWidth = elem.outerWidth(),
                                        elemHeight = elem.outerHeight(),
                                        marginLeft = parseCss(this, "marginLeft"),
                                        marginTop = parseCss(this, "marginTop"),
                                        collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
                                        collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
                                        position = $.extend({}, basePosition),
                                        myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());
                                    "right" === options.my[0] ? (position.left -= elemWidth) : "center" === options.my[0] && (position.left -= elemWidth / 2),
                                        "bottom" === options.my[1] ? (position.top -= elemHeight) : "center" === options.my[1] && (position.top -= elemHeight / 2),
                                        (position.left += myOffset[0]),
                                        (position.top += myOffset[1]),
                                    supportsOffsetFractions() || ((position.left = round(position.left)), (position.top = round(position.top))),
                                        (collisionPosition = { marginLeft: marginLeft, marginTop: marginTop }),
                                        $.each(["left", "top"], function (i, dir) {
                                            $.ui.position[collision[i]] &&
                                            $.ui.position[collision[i]][dir](position, {
                                                targetWidth: targetWidth,
                                                targetHeight: targetHeight,
                                                elemWidth: elemWidth,
                                                elemHeight: elemHeight,
                                                collisionPosition: collisionPosition,
                                                collisionWidth: collisionWidth,
                                                collisionHeight: collisionHeight,
                                                offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
                                                my: options.my,
                                                at: options.at,
                                                within: within,
                                                elem: elem,
                                            });
                                        }),
                                    options.using &&
                                    (using = function (props) {
                                        var left = targetOffset.left - position.left,
                                            right = left + targetWidth - elemWidth,
                                            top = targetOffset.top - position.top,
                                            bottom = top + targetHeight - elemHeight,
                                            feedback = {
                                                target: { element: target, left: targetOffset.left, top: targetOffset.top, width: targetWidth, height: targetHeight },
                                                element: { element: elem, left: position.left, top: position.top, width: elemWidth, height: elemHeight },
                                                horizontal: right < 0 ? "left" : 0 < left ? "right" : "center",
                                                vertical: bottom < 0 ? "top" : 0 < top ? "bottom" : "middle",
                                            };
                                        targetWidth < elemWidth && abs(left + right) < targetWidth && (feedback.horizontal = "center"),
                                        targetHeight < elemHeight && abs(top + bottom) < targetHeight && (feedback.vertical = "middle"),
                                            max(abs(left), abs(right)) > max(abs(top), abs(bottom)) ? (feedback.important = "horizontal") : (feedback.important = "vertical"),
                                            options.using.call(this, props, feedback);
                                    }),
                                        elem.offset($.extend(position, { using: using }));
                                })
                        );
                    }),
                    ($.ui.position = {
                        fit: {
                            left: function (position, data) {
                                var newOverRight = data.within,
                                    withinOffset = newOverRight.isWindow ? newOverRight.scrollLeft : newOverRight.offset.left,
                                    outerWidth = newOverRight.width,
                                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                                    overLeft = withinOffset - collisionPosLeft,
                                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset;
                                data.collisionWidth > outerWidth
                                    ? 0 < overLeft && overRight <= 0
                                        ? ((newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset), (position.left += overLeft - newOverRight))
                                        : (position.left = !(0 < overRight && overLeft <= 0) && overRight < overLeft ? withinOffset + outerWidth - data.collisionWidth : withinOffset)
                                    : 0 < overLeft
                                        ? (position.left += overLeft)
                                        : 0 < overRight
                                            ? (position.left -= overRight)
                                            : (position.left = max(position.left - collisionPosLeft, position.left));
                            },
                            top: function (position, data) {
                                var newOverBottom = data.within,
                                    withinOffset = newOverBottom.isWindow ? newOverBottom.scrollTop : newOverBottom.offset.top,
                                    outerHeight = data.within.height,
                                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                                    overTop = withinOffset - collisionPosTop,
                                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset;
                                data.collisionHeight > outerHeight
                                    ? 0 < overTop && overBottom <= 0
                                        ? ((newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset), (position.top += overTop - newOverBottom))
                                        : (position.top = !(0 < overBottom && overTop <= 0) && overBottom < overTop ? withinOffset + outerHeight - data.collisionHeight : withinOffset)
                                    : 0 < overTop
                                        ? (position.top += overTop)
                                        : 0 < overBottom
                                            ? (position.top -= overBottom)
                                            : (position.top = max(position.top - collisionPosTop, position.top));
                            },
                        },
                        flip: {
                            left: function (position, data) {
                                var atOffset = data.within,
                                    newOverRight = atOffset.offset.left + atOffset.scrollLeft,
                                    outerWidth = atOffset.width,
                                    newOverLeft = atOffset.isWindow ? atOffset.scrollLeft : atOffset.offset.left,
                                    offset = position.left - data.collisionPosition.marginLeft,
                                    overLeft = offset - newOverLeft,
                                    overRight = offset + data.collisionWidth - outerWidth - newOverLeft,
                                    myOffset = "left" === data.my[0] ? -data.elemWidth : "right" === data.my[0] ? data.elemWidth : 0,
                                    atOffset = "left" === data.at[0] ? data.targetWidth : "right" === data.at[0] ? -data.targetWidth : 0,
                                    offset = -2 * data.offset[0];
                                overLeft < 0
                                    ? ((newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - newOverRight) < 0 || newOverRight < abs(overLeft)) && (position.left += myOffset + atOffset + offset)
                                    : 0 < overRight &&
                                    (0 < (newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - newOverLeft) || abs(newOverLeft) < overRight) &&
                                    (position.left += myOffset + atOffset + offset);
                            },
                            top: function (position, data) {
                                var atOffset = data.within,
                                    newOverBottom = atOffset.offset.top + atOffset.scrollTop,
                                    outerHeight = atOffset.height,
                                    newOverTop = atOffset.isWindow ? atOffset.scrollTop : atOffset.offset.top,
                                    offset = position.top - data.collisionPosition.marginTop,
                                    overTop = offset - newOverTop,
                                    overBottom = offset + data.collisionHeight - outerHeight - newOverTop,
                                    myOffset = "top" === data.my[1] ? -data.elemHeight : "bottom" === data.my[1] ? data.elemHeight : 0,
                                    atOffset = "top" === data.at[1] ? data.targetHeight : "bottom" === data.at[1] ? -data.targetHeight : 0,
                                    offset = -2 * data.offset[1];
                                overTop < 0
                                    ? ((newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - newOverBottom) < 0 || newOverBottom < abs(overTop)) && (position.top += myOffset + atOffset + offset)
                                    : 0 < overBottom &&
                                    (0 < (newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - newOverTop) || abs(newOverTop) < overBottom) &&
                                    (position.top += myOffset + atOffset + offset);
                            },
                        },
                        flipfit: {
                            left: function () {
                                $.ui.position.flip.left.apply(this, arguments), $.ui.position.fit.left.apply(this, arguments);
                            },
                            top: function () {
                                $.ui.position.flip.top.apply(this, arguments), $.ui.position.fit.top.apply(this, arguments);
                            },
                        },
                    });
            })(),
                $.ui.position
        );
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget", "./position", "./menu"], factory) : factory(jQuery);
    })(function ($) {
        return (
            $.widget("ui.autocomplete", {
                version: "@VERSION",
                defaultElement: "<input>",
                options: {
                    appendTo: null,
                    autoFocus: !1,
                    delay: 300,
                    minLength: 1,
                    position: { my: "left top", at: "left bottom", collision: "none" },
                    source: null,
                    change: null,
                    close: null,
                    focus: null,
                    open: null,
                    response: null,
                    search: null,
                    select: null,
                },
                requestIndex: 0,
                pending: 0,
                _create: function () {
                    var suppressKeyPress,
                        suppressKeyPressRepeat,
                        suppressInput,
                        isInput = this.element[0].nodeName.toLowerCase(),
                        isTextarea = "textarea" === isInput,
                        isInput = "input" === isInput;
                    (this.isMultiLine = isTextarea || (!isInput && this.element.prop("isContentEditable"))),
                        (this.valueMethod = this.element[isTextarea || isInput ? "val" : "text"]),
                        (this.isNewMenu = !0),
                        this._addClass("ui-autocomplete-input"),
                        this.element.attr("autocomplete", "off"),
                        this._on(this.element, {
                            keydown: function (event) {
                                if (this.element.prop("readOnly")) suppressKeyPressRepeat = suppressInput = suppressKeyPress = !0;
                                else {
                                    suppressKeyPressRepeat = suppressInput = suppressKeyPress = !1;
                                    var keyCode = $.ui.keyCode;
                                    switch (event.keyCode) {
                                        case keyCode.PAGE_UP:
                                            (suppressKeyPress = !0), this._move("previousPage", event);
                                            break;
                                        case keyCode.PAGE_DOWN:
                                            (suppressKeyPress = !0), this._move("nextPage", event);
                                            break;
                                        case keyCode.UP:
                                            (suppressKeyPress = !0), this._keyEvent("previous", event);
                                            break;
                                        case keyCode.DOWN:
                                            (suppressKeyPress = !0), this._keyEvent("next", event);
                                            break;
                                        case keyCode.ENTER:
                                            this.menu.active && ((suppressKeyPress = !0), event.preventDefault(), this.menu.select(event));
                                            break;
                                        case keyCode.TAB:
                                            this.menu.active && this.menu.select(event);
                                            break;
                                        case keyCode.ESCAPE:
                                            this.menu.element.is(":visible") && (this.isMultiLine || this._value(this.term), this.close(event), event.preventDefault());
                                            break;
                                        default:
                                            (suppressKeyPressRepeat = !0), this._searchTimeout(event);
                                    }
                                }
                            },
                            keypress: function (event) {
                                if (suppressKeyPress) return (suppressKeyPress = !1), void ((this.isMultiLine && !this.menu.element.is(":visible")) || event.preventDefault());
                                if (!suppressKeyPressRepeat) {
                                    var keyCode = $.ui.keyCode;
                                    switch (event.keyCode) {
                                        case keyCode.PAGE_UP:
                                            this._move("previousPage", event);
                                            break;
                                        case keyCode.PAGE_DOWN:
                                            this._move("nextPage", event);
                                            break;
                                        case keyCode.UP:
                                            this._keyEvent("previous", event);
                                            break;
                                        case keyCode.DOWN:
                                            this._keyEvent("next", event);
                                    }
                                }
                            },
                            input: function (event) {
                                if (suppressInput) return (suppressInput = !1), void event.preventDefault();
                                this._searchTimeout(event);
                            },
                            focus: function () {
                                (this.selectedItem = null), (this.previous = this._value());
                            },
                            blur: function (event) {
                                this.cancelBlur ? delete this.cancelBlur : (clearTimeout(this.searching), this.close(event), this._change(event));
                            },
                        }),
                        this._initSource(),
                        (this.menu = $("<ul>").appendTo(this._appendTo()).menu({ role: null }).hide().menu("instance")),
                        this._addClass(this.menu.element, "ui-autocomplete", "ui-front"),
                        this._on(this.menu.element, {
                            mousedown: function (event) {
                                event.preventDefault(),
                                    (this.cancelBlur = !0),
                                    this._delay(function () {
                                        delete this.cancelBlur, this.element[0] !== $.ui.safeActiveElement(this.document[0]) && this.element.trigger("focus");
                                    });
                                var menuElement = this.menu.element[0];
                                $(event.target).closest(".ui-menu-item").length ||
                                this._delay(function () {
                                    var that = this;
                                    this.document.one("mousedown", function (event) {
                                        event.target === that.element[0] || event.target === menuElement || $.contains(menuElement, event.target) || that.close();
                                    });
                                });
                            },
                            menufocus: function (event, ui) {
                                var label;
                                if (this.isNewMenu && ((this.isNewMenu = !1), event.originalEvent && /^mouse/.test(event.originalEvent.type)))
                                    return (
                                        "function" == typeof this.menu.trigger && this.menu.trigger("blur"),
                                            void this.document.one("mousemove", function () {
                                                $(event.target).trigger(event.originalEvent);
                                            })
                                    );
                                (label = ui.item.data("ui-autocomplete-item")),
                                !1 !== this._trigger("focus", event, { item: label }) && event.originalEvent && /^key/.test(event.originalEvent.type) && this._value(label.value),
                                (label = ui.item.attr("aria-label") || label.value) && $.trim(label).length && (this.liveRegion.children().hide(), $("<div>").text(label).appendTo(this.liveRegion));
                            },
                            menuselect: function (event, ui) {
                                var item = ui.item.data("ui-autocomplete-item"),
                                    previous = this.previous;
                                this.element[0] !== $.ui.safeActiveElement(this.document[0]) &&
                                (this.element.trigger("focus"),
                                    (this.previous = previous),
                                    this._delay(function () {
                                        (this.previous = previous), (this.selectedItem = item);
                                    })),
                                !1 !== this._trigger("select", event, { item: item }) && this._value(item.value),
                                    (this.term = this._value()),
                                    this.close(event),
                                    (this.selectedItem = item);
                            },
                        }),
                        (this.liveRegion = $("<span>", { role: "status", "aria-live": "assertive", "aria-relevant": "additions" }).appendTo(this.document[0].body)),
                        this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible"),
                        this._on(this.window, {
                            beforeunload: function () {
                                this.element.removeAttr("autocomplete");
                            },
                        });
                },
                _destroy: function () {
                    clearTimeout(this.searching), this.element.removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove();
                },
                _setOption: function (key, value) {
                    this._super(key, value), "source" === key && this._initSource(), "appendTo" === key && this.menu.element.appendTo(this._appendTo()), "disabled" === key && value && this.xhr && this.xhr.abort();
                },
                _appendTo: function () {
                    var element = this.options.appendTo;
                    return (
                        ((element = element && (element.jquery || element.nodeType ? $(element) : this.document.find(element).eq(0))) && element[0]) || (element = this.element.closest(".ui-front, dialog")),
                        element.length || (element = this.document[0].body),
                            element
                    );
                },
                _initSource: function () {
                    var array,
                        url,
                        that = this;
                    $.isArray(this.options.source)
                        ? ((array = this.options.source),
                            (this.source = function (request, response) {
                                response($.ui.autocomplete.filter(array, request.term));
                            }))
                        : "string" == typeof this.options.source
                            ? ((url = this.options.source),
                                (this.source = function (request, response) {
                                    that.xhr && that.xhr.abort(),
                                        (that.xhr = $.ajax({
                                            url: url,
                                            data: request,
                                            dataType: "json",
                                            success: function (data) {
                                                response(data);
                                            },
                                            error: function () {
                                                response([]);
                                            },
                                        }));
                                }))
                            : (this.source = this.options.source);
                },
                _searchTimeout: function (event) {
                    clearTimeout(this.searching),
                        (this.searching = this._delay(function () {
                            var equalValues = this.term === this._value(),
                                menuVisible = this.menu.element.is(":visible"),
                                modifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
                            (equalValues && (!equalValues || menuVisible || modifierKey)) || ((this.selectedItem = null), this.search(null, event));
                        }, this.options.delay));
                },
                search: function (value, event) {
                    return (value = null != value ? value : this._value()), (this.term = this._value()), value.length < this.options.minLength ? this.close(event) : !1 !== this._trigger("search", event) ? this._search(value) : void 0;
                },
                _search: function (value) {
                    this.pending++, this._addClass("ui-autocomplete-loading"), (this.cancelSearch = !1), this.source({ term: value }, this._response());
                },
                _response: function () {
                    var index = ++this.requestIndex;
                    return $.proxy(function (content) {
                        index === this.requestIndex && this.__response(content), this.pending--, this.pending || this._removeClass("ui-autocomplete-loading");
                    }, this);
                },
                __response: function (content) {
                    (content = content && this._normalize(content)),
                        this._trigger("response", null, { content: content }),
                        !this.options.disabled && content && content.length && !this.cancelSearch ? (this._suggest(content), this._trigger("open")) : this._close();
                },
                close: function (event) {
                    (this.cancelSearch = !0), this._close(event);
                },
                _close: function (event) {
                    this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), (this.isNewMenu = !0), this._trigger("close", event));
                },
                _change: function (event) {
                    this.previous !== this._value() && this._trigger("change", event, { item: this.selectedItem });
                },
                _normalize: function (items) {
                    return items.length && items[0].label && items[0].value
                        ? items
                        : $.map(items, function (item) {
                            return "string" == typeof item ? { label: item, value: item } : $.extend({}, item, { label: item.label || item.value, value: item.value || item.label });
                        });
                },
                _suggest: function (items) {
                    var ul = this.menu.element.empty();
                    this._renderMenu(ul, items), (this.isNewMenu = !0), this.menu.refresh(), ul.show(), this._resizeMenu(), ul.position($.extend({ of: this.element }, this.options.position)), this.options.autoFocus && this.menu.next();
                },
                _resizeMenu: function () {
                    var ul = this.menu.element;
                    ul.outerWidth(Math.max(ul.width("").outerWidth() + 1, this.element.outerWidth()));
                },
                _renderMenu: function (ul, items) {
                    var that = this;
                    $.each(items, function (index, item) {
                        that._renderItemData(ul, item);
                    });
                },
                _renderItemData: function (ul, item) {
                    return this._renderItem(ul, item).data("ui-autocomplete-item", item);
                },
                _renderItem: function (ul, item) {
                    return $("<li>").append($("<div>").text(item.label)).appendTo(ul);
                },
                _move: function (direction, event) {
                    if (this.menu.element.is(":visible"))
                        return (this.menu.isFirstItem() && /^previous/.test(direction)) || (this.menu.isLastItem() && /^next/.test(direction))
                            ? (this.isMultiLine || this._value(this.term), void this.menu.blur())
                            : void this.menu[direction](event);
                    this.search(null, event);
                },
                widget: function () {
                    return this.menu.element;
                },
                _value: function () {
                    return this.valueMethod.apply(this.element, arguments);
                },
                _keyEvent: function (keyEvent, event) {
                    (this.isMultiLine && !this.menu.element.is(":visible")) || (this._move(keyEvent, event), event.preventDefault());
                },
            }),
                $.extend($.ui.autocomplete, {
                    escapeRegex: function (value) {
                        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
                    },
                    filter: function (array, term) {
                        var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
                        return $.grep(array, function (value) {
                            return matcher.test(value.label || value.value || value);
                        });
                    },
                }),
                $.widget("ui.autocomplete", $.ui.autocomplete, {
                    options: {
                        messages: {
                            noResults: "No search results.",
                            results: function (amount) {
                                return amount + (1 < amount ? " results are" : " result is") + " available, use up and down arrow keys to navigate.";
                            },
                        },
                    },
                    __response: function (content) {
                        var message;
                        this._superApply(arguments),
                        this.options.disabled ||
                        this.cancelSearch ||
                        ((message = content && content.length ? this.options.messages.results(content.length) : this.options.messages.noResults), this.liveRegion.children().hide(), $("<div>").text(message).appendTo(this.liveRegion));
                    },
                }),
                $.ui.autocomplete
        );
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget"], factory) : factory(jQuery);
    })(function ($) {
        function formResetHandler() {
            var form = $(this);
            setTimeout(function () {
                form.find(":ui-button").button("refresh");
            }, 1);
        }
        function radioGroup(radio) {
            var name = radio.name,
                form = radio.form,
                radios = $([]);
            return (
                name &&
                ((name = name.replace(/'/g, "\\'")),
                    (radios = form
                        ? $(form).find("[name='" + name + "'][type=radio]")
                        : $("[name='" + name + "'][type=radio]", radio.ownerDocument).filter(function () {
                            return !this.form;
                        }))),
                    radios
            );
        }
        var lastActive,
            baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
            typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only";
        return (
            $.widget("ui.button", {
                version: "@VERSION",
                defaultElement: "<button>",
                options: { disabled: null, text: !0, label: null, icons: { primary: null, secondary: null } },
                _create: function () {
                    this.element
                        .closest("form")
                        .off("reset" + this.eventNamespace)
                        .on("reset" + this.eventNamespace, formResetHandler),
                        "boolean" != typeof this.options.disabled ? (this.options.disabled = !!this.element.prop("disabled")) : this.element.prop("disabled", this.options.disabled),
                        this._determineButtonType(),
                        (this.hasTitle = !!this.buttonElement.attr("title"));
                    var that = this,
                        options = this.options,
                        toggleButton = "checkbox" === this.type || "radio" === this.type,
                        activeClass = toggleButton ? "" : "ui-state-active";
                    null === options.label && (options.label = "input" === this.type ? this.buttonElement.val() : this.buttonElement.html()),
                        this._hoverable(this.buttonElement),
                        this.buttonElement
                            .addClass(baseClasses)
                            .attr("role", "button")
                            .on("mouseenter" + this.eventNamespace, function () {
                                options.disabled || (this === lastActive && $(this).addClass("ui-state-active"));
                            })
                            .on("mouseleave" + this.eventNamespace, function () {
                                options.disabled || $(this).removeClass(activeClass);
                            })
                            .on("click" + this.eventNamespace, function (event) {
                                options.disabled && (event.preventDefault(), event.stopImmediatePropagation());
                            }),
                        this._on({
                            focus: function () {
                                this.buttonElement.addClass("ui-state-focus");
                            },
                            blur: function () {
                                this.buttonElement.removeClass("ui-state-focus");
                            },
                        }),
                    toggleButton &&
                    this.element.on("change" + this.eventNamespace, function () {
                        that.refresh();
                    }),
                        "checkbox" === this.type
                            ? this.buttonElement.on("click" + this.eventNamespace, function () {
                                if (options.disabled) return !1;
                            })
                            : "radio" === this.type
                                ? this.buttonElement.on("click" + this.eventNamespace, function () {
                                    if (options.disabled) return !1;
                                    $(this).addClass("ui-state-active"), that.buttonElement.attr("aria-pressed", "true");
                                    var radio = that.element[0];
                                    radioGroup(radio)
                                        .not(radio)
                                        .map(function () {
                                            return $(this).button("widget")[0];
                                        })
                                        .removeClass("ui-state-active")
                                        .attr("aria-pressed", "false");
                                })
                                : (this.buttonElement
                                    .on("mousedown" + this.eventNamespace, function () {
                                        return (
                                            !options.disabled &&
                                            ($(this).addClass("ui-state-active"),
                                                (lastActive = this),
                                                void that.document.one("mouseup", function () {
                                                    lastActive = null;
                                                }))
                                        );
                                    })
                                    .on("mouseup" + this.eventNamespace, function () {
                                        return !options.disabled && void $(this).removeClass("ui-state-active");
                                    })
                                    .on("keydown" + this.eventNamespace, function (event) {
                                        return !options.disabled && void ((event.keyCode !== $.ui.keyCode.SPACE && event.keyCode !== $.ui.keyCode.ENTER) || $(this).addClass("ui-state-active"));
                                    })
                                    .on("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function () {
                                        $(this).removeClass("ui-state-active");
                                    }),
                                this.buttonElement.is("a") &&
                                this.buttonElement.on("keyup", function (event) {
                                    event.keyCode === $.ui.keyCode.SPACE && $(this).trigger("click");
                                })),
                        this._setOption("disabled", options.disabled),
                        this._resetButton();
                },
                _determineButtonType: function () {
                    var ancestor, checked;
                    this.element.is("[type=checkbox]") ? (this.type = "checkbox") : this.element.is("[type=radio]") ? (this.type = "radio") : this.element.is("input") ? (this.type = "input") : (this.type = "button"),
                        "checkbox" === this.type || "radio" === this.type
                            ? ((ancestor = this.element.parents().last()),
                                (checked = "label[for='" + this.element.attr("id") + "']"),
                                (this.buttonElement = ancestor.find(checked)),
                            this.buttonElement.length ||
                            ((ancestor = (ancestor.length ? ancestor : this.element).siblings()), (this.buttonElement = ancestor.filter(checked)), this.buttonElement.length || (this.buttonElement = ancestor.find(checked))),
                                this.element.addClass("ui-helper-hidden-accessible"),
                            (checked = this.element.is(":checked")) && this.buttonElement.addClass("ui-state-active"),
                                this.buttonElement.prop("aria-pressed", checked))
                            : (this.buttonElement = this.element);
                },
                widget: function () {
                    return this.buttonElement;
                },
                _destroy: function () {
                    this.element.removeClass("ui-helper-hidden-accessible"),
                        this.buttonElement
                            .removeClass(baseClasses + " ui-state-active " + typeClasses)
                            .removeAttr("role aria-pressed")
                            .html(this.buttonElement.find(".ui-button-text").html()),
                    this.hasTitle || this.buttonElement.removeAttr("title");
                },
                _setOption: function (key, value) {
                    if ((this._super(key, value), "disabled" === key))
                        return (
                            this.widget().toggleClass("ui-state-disabled", !!value),
                                this.element.prop("disabled", !!value),
                                void (value && ("checkbox" === this.type || "radio" === this.type ? this.buttonElement.removeClass("ui-state-focus") : this.buttonElement.removeClass("ui-state-focus ui-state-active")))
                        );
                    this._resetButton();
                },
                refresh: function () {
                    var isDisabled = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
                    isDisabled !== this.options.disabled && this._setOption("disabled", isDisabled),
                        "radio" === this.type
                            ? radioGroup(this.element[0]).each(function () {
                                $(this).is(":checked") ? $(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : $(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false");
                            })
                            : "checkbox" === this.type &&
                            (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false"));
                },
                _resetButton: function () {
                    var buttonElement, buttonText, icons, multipleIcons, buttonClasses;
                    "input" !== this.type
                        ? ((buttonElement = this.buttonElement.removeClass(typeClasses)),
                            (buttonText = $("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(buttonElement.empty()).text()),
                            (multipleIcons = (icons = this.options.icons).primary && icons.secondary),
                            (buttonClasses = []),
                            icons.primary || icons.secondary
                                ? (this.options.text && buttonClasses.push("ui-button-text-icon" + (multipleIcons ? "s" : icons.primary ? "-primary" : "-secondary")),
                                icons.primary && buttonElement.prepend("<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>"),
                                icons.secondary && buttonElement.append("<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>"),
                                this.options.text || (buttonClasses.push(multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || buttonElement.attr("title", $.trim(buttonText))))
                                : buttonClasses.push("ui-button-text-only"),
                            buttonElement.addClass(buttonClasses.join(" ")))
                        : this.options.label && this.element.val(this.options.label);
                },
            }),
                $.widget("ui.buttonset", {
                    version: "@VERSION",
                    options: { items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)" },
                    _create: function () {
                        this.element.addClass("ui-buttonset");
                    },
                    _init: function () {
                        this.refresh();
                    },
                    _setOption: function (key, value) {
                        "disabled" === key && this.buttons.button("option", key, value), this._super(key, value);
                    },
                    refresh: function () {
                        var rtl = "rtl" === this.element.css("direction"),
                            allButtons = this.element.find(this.options.items),
                            existingButtons = allButtons.filter(":ui-button");
                        allButtons.not(":ui-button").button(),
                            existingButtons.button("refresh"),
                            (this.buttons = allButtons
                                .map(function () {
                                    return $(this).button("widget")[0];
                                })
                                .removeClass("ui-corner-all ui-corner-left ui-corner-right")
                                .filter(":first")
                                .addClass(rtl ? "ui-corner-right" : "ui-corner-left")
                                .end()
                                .filter(":last")
                                .addClass(rtl ? "ui-corner-left" : "ui-corner-right")
                                .end()
                                .end());
                    },
                    _destroy: function () {
                        this.element.removeClass("ui-buttonset"),
                            this.buttons
                                .map(function () {
                                    return $(this).button("widget")[0];
                                })
                                .removeClass("ui-corner-left ui-corner-right")
                                .end()
                                .button("destroy");
                    },
                }),
                $.ui.button
        );
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery", "./core"], factory) : factory(jQuery);
    })(function ($) {
        var datepicker_instActive;
        function Datepicker() {
            (this._curInst = null),
                (this._keyEvent = !1),
                (this._disabledInputs = []),
                (this._datepickerShowing = !1),
                (this._inDialog = !1),
                (this._mainDivId = "ui-datepicker-div"),
                (this._inlineClass = "ui-datepicker-inline"),
                (this._appendClass = "ui-datepicker-append"),
                (this._triggerClass = "ui-datepicker-trigger"),
                (this._dialogClass = "ui-datepicker-dialog"),
                (this._disableClass = "ui-datepicker-disabled"),
                (this._unselectableClass = "ui-datepicker-unselectable"),
                (this._currentClass = "ui-datepicker-current-day"),
                (this._dayOverClass = "ui-datepicker-days-cell-over"),
                (this.regional = []),
                (this.regional[""] = {
                    closeText: "Done",
                    prevText: "Prev",
                    nextText: "Next",
                    currentText: "Today",
                    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                    weekHeader: "Wk",
                    dateFormat: "mm/dd/yy",
                    firstDay: 0,
                    isRTL: !1,
                    showMonthAfterYear: !1,
                    yearSuffix: "",
                }),
                (this._defaults = {
                    showOn: "focus",
                    showAnim: "fadeIn",
                    showOptions: {},
                    defaultDate: null,
                    appendText: "",
                    buttonText: "...",
                    buttonImage: "",
                    buttonImageOnly: !1,
                    hideIfNoPrevNext: !1,
                    navigationAsDateFormat: !1,
                    gotoCurrent: !1,
                    changeMonth: !1,
                    changeYear: !1,
                    yearRange: "c-10:c+10",
                    showOtherMonths: !1,
                    selectOtherMonths: !1,
                    showWeek: !1,
                    calculateWeek: this.iso8601Week,
                    shortYearCutoff: "+10",
                    minDate: null,
                    maxDate: null,
                    duration: "fast",
                    beforeShowDay: null,
                    beforeShow: null,
                    onSelect: null,
                    onChangeMonthYear: null,
                    onClose: null,
                    numberOfMonths: 1,
                    showCurrentAtPos: 0,
                    stepMonths: 1,
                    stepBigMonths: 12,
                    altField: "",
                    altFormat: "",
                    constrainInput: !0,
                    showButtonPanel: !1,
                    autoSize: !1,
                    disabled: !1,
                }),
                $.extend(this._defaults, this.regional[""]),
                (this.regional.en = $.extend(!0, {}, this.regional[""])),
                (this.regional["en-US"] = $.extend(!0, {}, this.regional.en)),
                (this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")));
        }
        function datepicker_bindHover(dpDiv) {
            var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
            return dpDiv
                .on("mouseout", selector, function () {
                    $(this).removeClass("ui-state-hover"),
                    -1 !== this.className.indexOf("ui-datepicker-prev") && $(this).removeClass("ui-datepicker-prev-hover"),
                    -1 !== this.className.indexOf("ui-datepicker-next") && $(this).removeClass("ui-datepicker-next-hover");
                })
                .on("mouseover", selector, datepicker_handleMouseover);
        }
        function datepicker_handleMouseover() {
            $.datepicker._isDisabledDatepicker((datepicker_instActive.inline ? datepicker_instActive.dpDiv.parent() : datepicker_instActive.input)[0]) ||
            ($(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),
                $(this).addClass("ui-state-hover"),
            -1 !== this.className.indexOf("ui-datepicker-prev") && $(this).addClass("ui-datepicker-prev-hover"),
            -1 !== this.className.indexOf("ui-datepicker-next") && $(this).addClass("ui-datepicker-next-hover"));
        }
        function datepicker_extendRemove(target, props) {
            for (var name in ($.extend(target, props), props)) null == props[name] && (target[name] = props[name]);
            return target;
        }
        return (
            $.extend($.ui, { datepicker: { version: "@VERSION" } }),
                $.extend(Datepicker.prototype, {
                    markerClassName: "hasDatepicker",
                    maxRows: 4,
                    _widgetDatepicker: function () {
                        return this.dpDiv;
                    },
                    setDefaults: function (settings) {
                        return datepicker_extendRemove(this._defaults, settings || {}), this;
                    },
                    _attachDatepicker: function (target, settings) {
                        var inst,
                            nodeName = target.nodeName.toLowerCase(),
                            inline = "div" === nodeName || "span" === nodeName;
                        target.id || ((this.uuid += 1), (target.id = "dp" + this.uuid)),
                            ((inst = this._newInst($(target), inline)).settings = $.extend({}, settings || {})),
                            "input" === nodeName ? this._connectDatepicker(target, inst) : inline && this._inlineDatepicker(target, inst);
                    },
                    _newInst: function (target, inline) {
                        return {
                            id: target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"),
                            input: target,
                            selectedDay: 0,
                            selectedMonth: 0,
                            selectedYear: 0,
                            drawMonth: 0,
                            drawYear: 0,
                            inline: inline,
                            dpDiv: inline ? datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")) : this.dpDiv,
                        };
                    },
                    _connectDatepicker: function (target, inst) {
                        var input = $(target);
                        (inst.append = $([])),
                            (inst.trigger = $([])),
                        input.hasClass(this.markerClassName) ||
                        (this._attachments(input, inst),
                            input.addClass(this.markerClassName).on("keydown", this._doKeyDown).on("keypress", this._doKeyPress).on("keyup", this._doKeyUp),
                            this._autoSize(inst),
                            $.data(target, "datepicker", inst),
                        inst.settings.disabled && this._disableDatepicker(target));
                    },
                    _attachments: function (input, inst) {
                        var buttonImage,
                            buttonText = this._get(inst, "appendText"),
                            isRTL = this._get(inst, "isRTL");
                        inst.append && inst.append.remove(),
                        buttonText && ((inst.append = $("<span class='" + this._appendClass + "'>" + buttonText + "</span>")), input[isRTL ? "before" : "after"](inst.append)),
                            input.off("focus", this._showDatepicker),
                        inst.trigger && inst.trigger.remove(),
                        ("focus" !== (buttonImage = this._get(inst, "showOn")) && "both" !== buttonImage) || input.on("focus", this._showDatepicker),
                        ("button" !== buttonImage && "both" !== buttonImage) ||
                        ((buttonText = this._get(inst, "buttonText")),
                            (buttonImage = this._get(inst, "buttonImage")),
                            (inst.trigger = $(
                                this._get(inst, "buttonImageOnly")
                                    ? $("<img/>").addClass(this._triggerClass).attr({ src: buttonImage, alt: buttonText, title: buttonText })
                                    : $("<button type='button'></button>")
                                        .addClass(this._triggerClass)
                                        .html(buttonImage ? $("<img/>").attr({ src: buttonImage, alt: buttonText, title: buttonText }) : buttonText)
                            )),
                            input[isRTL ? "before" : "after"](inst.trigger),
                            inst.trigger.on("click", function () {
                                return (
                                    $.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]
                                        ? $.datepicker._hideDatepicker()
                                        : ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0] && $.datepicker._hideDatepicker(), $.datepicker._showDatepicker(input[0])),
                                        !1
                                );
                            }));
                    },
                    _autoSize: function (inst) {
                        var findMax, max, maxI, i, date, dateFormat;
                        this._get(inst, "autoSize") &&
                        !inst.inline &&
                        ((date = new Date(2009, 11, 20)),
                        (dateFormat = this._get(inst, "dateFormat")).match(/[DM]/) &&
                        ((findMax = function (names) {
                            for (i = maxI = max = 0; i < names.length; i++) names[i].length > max && ((max = names[i].length), (maxI = i));
                            return maxI;
                        }),
                            date.setMonth(findMax(this._get(inst, dateFormat.match(/MM/) ? "monthNames" : "monthNamesShort"))),
                            date.setDate(findMax(this._get(inst, dateFormat.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - date.getDay())),
                            inst.input.attr("size", this._formatDate(inst, date).length));
                    },
                    _inlineDatepicker: function (target, inst) {
                        var divSpan = $(target);
                        divSpan.hasClass(this.markerClassName) ||
                        (divSpan.addClass(this.markerClassName).append(inst.dpDiv),
                            $.data(target, "datepicker", inst),
                            this._setDate(inst, this._getDefaultDate(inst), !0),
                            this._updateDatepicker(inst),
                            this._updateAlternate(inst),
                        inst.settings.disabled && this._disableDatepicker(target),
                            inst.dpDiv.css("display", "block"));
                    },
                    _dialogDatepicker: function (input, scrollX, onSelect, browserHeight, scrollY) {
                        var browserWidth,
                            inst = this._dialogInst;
                        return (
                            inst ||
                            ((this.uuid += 1),
                                (browserWidth = "dp" + this.uuid),
                                (this._dialogInput = $("<input type='text' id='" + browserWidth + "' style='position: absolute; top: -100px; width: 0px;'/>")),
                                this._dialogInput.on("keydown", this._doKeyDown),
                                $("body").append(this._dialogInput),
                                ((inst = this._dialogInst = this._newInst(this._dialogInput, !1)).settings = {}),
                                $.data(this._dialogInput[0], "datepicker", inst)),
                                datepicker_extendRemove(inst.settings, browserHeight || {}),
                                (scrollX = scrollX && scrollX.constructor === Date ? this._formatDate(inst, scrollX) : scrollX),
                                this._dialogInput.val(scrollX),
                                (this._pos = scrollY ? (scrollY.length ? scrollY : [scrollY.pageX, scrollY.pageY]) : null),
                            this._pos ||
                            ((browserWidth = document.documentElement.clientWidth),
                                (browserHeight = document.documentElement.clientHeight),
                                (scrollX = document.documentElement.scrollLeft || document.body.scrollLeft),
                                (scrollY = document.documentElement.scrollTop || document.body.scrollTop),
                                (this._pos = [browserWidth / 2 - 100 + scrollX, browserHeight / 2 - 150 + scrollY])),
                                this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"),
                                (inst.settings.onSelect = onSelect),
                                (this._inDialog = !0),
                                this.dpDiv.addClass(this._dialogClass),
                                this._showDatepicker(this._dialogInput[0]),
                            $.blockUI && $.blockUI(this.dpDiv),
                                $.data(this._dialogInput[0], "datepicker", inst),
                                this
                        );
                    },
                    _destroyDatepicker: function (target) {
                        var nodeName,
                            $target = $(target),
                            inst = $.data(target, "datepicker");
                        $target.hasClass(this.markerClassName) &&
                        ((nodeName = target.nodeName.toLowerCase()),
                            $.removeData(target, "datepicker"),
                            "input" === nodeName
                                ? (inst.append.remove(),
                                    inst.trigger.remove(),
                                    $target.removeClass(this.markerClassName).off("focus", this._showDatepicker).off("keydown", this._doKeyDown).off("keypress", this._doKeyPress).off("keyup", this._doKeyUp))
                                : ("div" !== nodeName && "span" !== nodeName) || $target.removeClass(this.markerClassName).empty(),
                        datepicker_instActive === inst && (datepicker_instActive = null));
                    },
                    _enableDatepicker: function (target) {
                        var nodeName,
                            inline = $(target),
                            inst = $.data(target, "datepicker");
                        inline.hasClass(this.markerClassName) &&
                        ("input" === (nodeName = target.nodeName.toLowerCase())
                            ? ((target.disabled = !1),
                                inst.trigger
                                    .filter("button")
                                    .each(function () {
                                        this.disabled = !1;
                                    })
                                    .end()
                                    .filter("img")
                                    .css({ opacity: "1.0", cursor: "" }))
                            : ("div" !== nodeName && "span" !== nodeName) ||
                            ((inline = inline.children("." + this._inlineClass)).children().removeClass("ui-state-disabled"), inline.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)),
                            (this._disabledInputs = $.map(this._disabledInputs, function (value) {
                                return value === target ? null : value;
                            })));
                    },
                    _disableDatepicker: function (target) {
                        var nodeName,
                            inline = $(target),
                            inst = $.data(target, "datepicker");
                        inline.hasClass(this.markerClassName) &&
                        ("input" === (nodeName = target.nodeName.toLowerCase())
                            ? ((target.disabled = !0),
                                inst.trigger
                                    .filter("button")
                                    .each(function () {
                                        this.disabled = !0;
                                    })
                                    .end()
                                    .filter("img")
                                    .css({ opacity: "0.5", cursor: "default" }))
                            : ("div" !== nodeName && "span" !== nodeName) ||
                            ((inline = inline.children("." + this._inlineClass)).children().addClass("ui-state-disabled"), inline.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)),
                            (this._disabledInputs = $.map(this._disabledInputs, function (value) {
                                return value === target ? null : value;
                            })),
                            (this._disabledInputs[this._disabledInputs.length] = target));
                    },
                    _isDisabledDatepicker: function (target) {
                        if (!target) return !1;
                        for (var i = 0; i < this._disabledInputs.length; i++) if (this._disabledInputs[i] === target) return !0;
                        return !1;
                    },
                    _getInst: function (target) {
                        try {
                            return $.data(target, "datepicker");
                        } catch (err) {
                            throw "Missing instance data for this datepicker";
                        }
                    },
                    _optionDatepicker: function (target, name, value) {
                        var settings,
                            date,
                            minDate,
                            maxDate,
                            inst = this._getInst(target);
                        if (2 === arguments.length && "string" == typeof name) return "defaults" === name ? $.extend({}, $.datepicker._defaults) : inst ? ("all" === name ? $.extend({}, inst.settings) : this._get(inst, name)) : null;
                        (settings = name || {}),
                        "string" == typeof name && ((settings = {})[name] = value),
                        inst &&
                        (this._curInst === inst && this._hideDatepicker(),
                            (date = this._getDateDatepicker(target, !0)),
                            (minDate = this._getMinMaxDate(inst, "min")),
                            (maxDate = this._getMinMaxDate(inst, "max")),
                            datepicker_extendRemove(inst.settings, settings),
                        null !== minDate && void 0 !== settings.dateFormat && void 0 === settings.minDate && (inst.settings.minDate = this._formatDate(inst, minDate)),
                        null !== maxDate && void 0 !== settings.dateFormat && void 0 === settings.maxDate && (inst.settings.maxDate = this._formatDate(inst, maxDate)),
                        "disabled" in settings && (settings.disabled ? this._disableDatepicker(target) : this._enableDatepicker(target)),
                            this._attachments($(target), inst),
                            this._autoSize(inst),
                            this._setDate(inst, date),
                            this._updateAlternate(inst),
                            this._updateDatepicker(inst));
                    },
                    _changeDatepicker: function (target, name, value) {
                        this._optionDatepicker(target, name, value);
                    },
                    _refreshDatepicker: function (inst) {
                        inst = this._getInst(inst);
                        inst && this._updateDatepicker(inst);
                    },
                    _setDateDatepicker: function (inst, date) {
                        inst = this._getInst(inst);
                        inst && (this._setDate(inst, date), this._updateDatepicker(inst), this._updateAlternate(inst));
                    },
                    _getDateDatepicker: function (inst, noDefault) {
                        inst = this._getInst(inst);
                        return inst && !inst.inline && this._setDateFromField(inst, noDefault), inst ? this._getDate(inst) : null;
                    },
                    _doKeyDown: function (event) {
                        var onSelect,
                            dateStr,
                            inst = $.datepicker._getInst(event.target),
                            handled = !0,
                            isRTL = inst.dpDiv.is(".ui-datepicker-rtl");
                        if (((inst._keyEvent = !0), $.datepicker._datepickerShowing))
                            switch (event.keyCode) {
                                case 9:
                                    $.datepicker._hideDatepicker(), (handled = !1);
                                    break;
                                case 13:
                                    return (
                                        (dateStr = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", inst.dpDiv))[0] && $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, dateStr[0]),
                                            (onSelect = $.datepicker._get(inst, "onSelect")) ? ((dateStr = $.datepicker._formatDate(inst)), onSelect.apply(inst.input ? inst.input[0] : null, [dateStr, inst])) : $.datepicker._hideDatepicker(),
                                            !1
                                    );
                                case 27:
                                    $.datepicker._hideDatepicker();
                                    break;
                                case 33:
                                    $.datepicker._adjustDate(event.target, event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths"), "M");
                                    break;
                                case 34:
                                    $.datepicker._adjustDate(event.target, event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths"), "M");
                                    break;
                                case 35:
                                    (event.ctrlKey || event.metaKey) && $.datepicker._clearDate(event.target), (handled = event.ctrlKey || event.metaKey);
                                    break;
                                case 36:
                                    (event.ctrlKey || event.metaKey) && $.datepicker._gotoToday(event.target), (handled = event.ctrlKey || event.metaKey);
                                    break;
                                case 37:
                                    (event.ctrlKey || event.metaKey) && $.datepicker._adjustDate(event.target, isRTL ? 1 : -1, "D"),
                                        (handled = event.ctrlKey || event.metaKey),
                                    event.originalEvent.altKey && $.datepicker._adjustDate(event.target, event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths"), "M");
                                    break;
                                case 38:
                                    (event.ctrlKey || event.metaKey) && $.datepicker._adjustDate(event.target, -7, "D"), (handled = event.ctrlKey || event.metaKey);
                                    break;
                                case 39:
                                    (event.ctrlKey || event.metaKey) && $.datepicker._adjustDate(event.target, isRTL ? -1 : 1, "D"),
                                        (handled = event.ctrlKey || event.metaKey),
                                    event.originalEvent.altKey && $.datepicker._adjustDate(event.target, event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths"), "M");
                                    break;
                                case 40:
                                    (event.ctrlKey || event.metaKey) && $.datepicker._adjustDate(event.target, 7, "D"), (handled = event.ctrlKey || event.metaKey);
                                    break;
                                default:
                                    handled = !1;
                            }
                        else 36 === event.keyCode && event.ctrlKey ? $.datepicker._showDatepicker(this) : (handled = !1);
                        handled && (event.preventDefault(), event.stopPropagation());
                    },
                    _doKeyPress: function (event) {
                        var chars,
                            chr = $.datepicker._getInst(event.target);
                        if ($.datepicker._get(chr, "constrainInput"))
                            return (
                                (chars = $.datepicker._possibleChars($.datepicker._get(chr, "dateFormat"))),
                                    (chr = String.fromCharCode(null == event.charCode ? event.keyCode : event.charCode)),
                                event.ctrlKey || event.metaKey || chr < " " || !chars || -1 < chars.indexOf(chr)
                            );
                    },
                    _doKeyUp: function (event) {
                        var inst = $.datepicker._getInst(event.target);
                        if (inst.input.val() !== inst.lastVal)
                            try {
                                $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.input ? inst.input.val() : null, $.datepicker._getFormatConfig(inst)) &&
                                ($.datepicker._setDateFromField(inst), $.datepicker._updateAlternate(inst), $.datepicker._updateDatepicker(inst));
                            } catch (err) {}
                        return !0;
                    },
                    _showDatepicker: function (input) {
                        var isFixed, showAnim, duration, inst;
                        "input" !== (input = input.target || input).nodeName.toLowerCase() && (input = $("input", input.parentNode)[0]),
                        $.datepicker._isDisabledDatepicker(input) ||
                        $.datepicker._lastInput === input ||
                        ((inst = $.datepicker._getInst(input)),
                        $.datepicker._curInst && $.datepicker._curInst !== inst && ($.datepicker._curInst.dpDiv.stop(!0, !0), inst && $.datepicker._datepickerShowing && $.datepicker._hideDatepicker($.datepicker._curInst.input[0])),
                        !1 !== (showAnim = (duration = $.datepicker._get(inst, "beforeShow")) ? duration.apply(input, [input, inst]) : {}) &&
                        (datepicker_extendRemove(inst.settings, showAnim),
                            (inst.lastVal = null),
                            ($.datepicker._lastInput = input),
                            $.datepicker._setDateFromField(inst),
                        $.datepicker._inDialog && (input.value = ""),
                        $.datepicker._pos || (($.datepicker._pos = $.datepicker._findPos(input)), ($.datepicker._pos[1] += input.offsetHeight)),
                            (isFixed = !1),
                            $(input)
                                .parents()
                                .each(function () {
                                    return !(isFixed |= "fixed" === $(this).css("position"));
                                }),
                            (duration = { left: $.datepicker._pos[0], top: $.datepicker._pos[1] }),
                            ($.datepicker._pos = null),
                            inst.dpDiv.empty(),
                            inst.dpDiv.css({ position: "absolute", display: "block", top: "-1000px" }),
                            $.datepicker._updateDatepicker(inst),
                            (duration = $.datepicker._checkOffset(inst, duration, isFixed)),
                            inst.dpDiv.css({ position: $.datepicker._inDialog && $.blockUI ? "static" : isFixed ? "fixed" : "absolute", display: "none", left: duration.left + "px", top: duration.top + "px" }),
                        inst.inline ||
                        ((showAnim = $.datepicker._get(inst, "showAnim")),
                            (duration = $.datepicker._get(inst, "duration")),
                            inst.dpDiv.css(
                                "z-index",
                                (function (elem) {
                                    for (var position, value; elem.length && elem[0] !== document; ) {
                                        if (("absolute" === (position = elem.css("position")) || "relative" === position || "fixed" === position) && ((value = parseInt(elem.css("zIndex"), 10)), !isNaN(value) && 0 !== value))
                                            return value;
                                        elem = elem.parent();
                                    }
                                    return 0;
                                })($(input)) + 1
                            ),
                            ($.datepicker._datepickerShowing = !0),
                            $.effects && $.effects.effect[showAnim] ? inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration) : inst.dpDiv[showAnim || "show"](showAnim ? duration : null),
                        $.datepicker._shouldFocusInput(inst) && inst.input.trigger("focus"),
                            ($.datepicker._curInst = inst))));
                    },
                    _updateDatepicker: function (inst) {
                        (this.maxRows = 4), (datepicker_instActive = inst).dpDiv.empty().append(this._generateHTML(inst)), this._attachHandlers(inst);
                        var origyearshtml,
                            numMonths = this._getNumberOfMonths(inst),
                            cols = numMonths[1],
                            activeCell = inst.dpDiv.find("." + this._dayOverClass + " a");
                        0 < activeCell.length && datepicker_handleMouseover.apply(activeCell.get(0)),
                            inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),
                        1 < cols && inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", 17 * cols + "em"),
                            inst.dpDiv[(1 !== numMonths[0] || 1 !== numMonths[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"),
                            inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"),
                        inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput(inst) && inst.input.trigger("focus"),
                        inst.yearshtml &&
                        ((origyearshtml = inst.yearshtml),
                            setTimeout(function () {
                                origyearshtml === inst.yearshtml && inst.yearshtml && inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml), (origyearshtml = inst.yearshtml = null);
                            }, 0));
                    },
                    _shouldFocusInput: function (inst) {
                        return inst.input && inst.input.is(":visible") && !inst.input.is(":disabled") && !inst.input.is(":focus");
                    },
                    _checkOffset: function (inst, offset, isFixed) {
                        var dpWidth = inst.dpDiv.outerWidth(),
                            dpHeight = inst.dpDiv.outerHeight(),
                            inputWidth = inst.input ? inst.input.outerWidth() : 0,
                            inputHeight = inst.input ? inst.input.outerHeight() : 0,
                            viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
                            viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());
                        return (
                            (offset.left -= this._get(inst, "isRTL") ? dpWidth - inputWidth : 0),
                                (offset.left -= isFixed && offset.left === inst.input.offset().left ? $(document).scrollLeft() : 0),
                                (offset.top -= isFixed && offset.top === inst.input.offset().top + inputHeight ? $(document).scrollTop() : 0),
                                (offset.left -= Math.min(offset.left, offset.left + dpWidth > viewWidth && dpWidth < viewWidth ? Math.abs(offset.left + dpWidth - viewWidth) : 0)),
                                (offset.top -= Math.min(offset.top, offset.top + dpHeight > viewHeight && dpHeight < viewHeight ? Math.abs(dpHeight + inputHeight) : 0)),
                                offset
                        );
                    },
                    _findPos: function (obj) {
                        for (var position = this._getInst(obj), isRTL = this._get(position, "isRTL"); obj && ("hidden" === obj.type || 1 !== obj.nodeType || $.expr.filters.hidden(obj)); ) obj = obj[isRTL ? "previousSibling" : "nextSibling"];
                        return [(position = $(obj).offset()).left, position.top];
                    },
                    _hideDatepicker: function (onClose) {
                        var showAnim,
                            duration,
                            inst = this._curInst;
                        !inst ||
                        (onClose && inst !== $.data(onClose, "datepicker")) ||
                        (this._datepickerShowing &&
                            ((showAnim = this._get(inst, "showAnim")),
                                (duration = this._get(inst, "duration")),
                                (onClose = function () {
                                    $.datepicker._tidyDialog(inst);
                                }),
                                $.effects && ($.effects.effect[showAnim] || $.effects[showAnim])
                                    ? inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, onClose)
                                    : inst.dpDiv["slideDown" === showAnim ? "slideUp" : "fadeIn" === showAnim ? "fadeOut" : "hide"](showAnim ? duration : null, onClose),
                            showAnim || onClose(),
                                (this._datepickerShowing = !1),
                            (onClose = this._get(inst, "onClose")) && onClose.apply(inst.input ? inst.input[0] : null, [inst.input ? inst.input.val() : "", inst]),
                                (this._lastInput = null),
                            this._inDialog && (this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" }), $.blockUI && ($.unblockUI(), $("body").append(this.dpDiv))),
                                (this._inDialog = !1)));
                    },
                    _tidyDialog: function (inst) {
                        inst.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar");
                    },
                    _checkExternalClick: function (inst) {
                        var $target;
                        $.datepicker._curInst &&
                        (($target = $(inst.target)),
                            (inst = $.datepicker._getInst($target[0])),
                        (($target[0].id === $.datepicker._mainDivId ||
                                0 !== $target.parents("#" + $.datepicker._mainDivId).length ||
                                $target.hasClass($.datepicker.markerClassName) ||
                                $target.closest("." + $.datepicker._triggerClass).length ||
                                !$.datepicker._datepickerShowing ||
                                ($.datepicker._inDialog && $.blockUI)) &&
                            (!$target.hasClass($.datepicker.markerClassName) || $.datepicker._curInst === inst)) ||
                        $.datepicker._hideDatepicker());
                    },
                    _adjustDate: function (inst, offset, period) {
                        var target = $(inst),
                            inst = this._getInst(target[0]);
                        this._isDisabledDatepicker(target[0]) || (this._adjustInstDate(inst, offset + ("M" === period ? this._get(inst, "showCurrentAtPos") : 0), period), this._updateDatepicker(inst));
                    },
                    _gotoToday: function (date) {
                        var target = $(date),
                            inst = this._getInst(target[0]);
                        this._get(inst, "gotoCurrent") && inst.currentDay
                            ? ((inst.selectedDay = inst.currentDay), (inst.drawMonth = inst.selectedMonth = inst.currentMonth), (inst.drawYear = inst.selectedYear = inst.currentYear))
                            : ((date = new Date()), (inst.selectedDay = date.getDate()), (inst.drawMonth = inst.selectedMonth = date.getMonth()), (inst.drawYear = inst.selectedYear = date.getFullYear())),
                            this._notifyChange(inst),
                            this._adjustDate(target);
                    },
                    _selectMonthYear: function (inst, select, period) {
                        var target = $(inst),
                            inst = this._getInst(target[0]);
                        (inst["selected" + ("M" === period ? "Month" : "Year")] = inst["draw" + ("M" === period ? "Month" : "Year")] = parseInt(select.options[select.selectedIndex].value, 10)),
                            this._notifyChange(inst),
                            this._adjustDate(target);
                    },
                    _selectDay: function (id, month, year, td) {
                        var inst = $(id);
                        $(td).hasClass(this._unselectableClass) ||
                        this._isDisabledDatepicker(inst[0]) ||
                        (((inst = this._getInst(inst[0])).selectedDay = inst.currentDay = $("a", td).html()),
                            (inst.selectedMonth = inst.currentMonth = month),
                            (inst.selectedYear = inst.currentYear = year),
                            this._selectDate(id, this._formatDate(inst, inst.currentDay, inst.currentMonth, inst.currentYear)));
                    },
                    _clearDate: function (target) {
                        target = $(target);
                        this._selectDate(target, "");
                    },
                    _selectDate: function (inst, dateStr) {
                        var onSelect = $(inst),
                            inst = this._getInst(onSelect[0]);
                        (dateStr = null != dateStr ? dateStr : this._formatDate(inst)),
                        inst.input && inst.input.val(dateStr),
                            this._updateAlternate(inst),
                            (onSelect = this._get(inst, "onSelect")) ? onSelect.apply(inst.input ? inst.input[0] : null, [dateStr, inst]) : inst.input && inst.input.trigger("change"),
                            inst.inline ? this._updateDatepicker(inst) : (this._hideDatepicker(), (this._lastInput = inst.input[0]), "object" != typeof inst.input[0] && inst.input.trigger("focus"), (this._lastInput = null));
                    },
                    _updateAlternate: function (inst) {
                        var altFormat,
                            date,
                            dateStr,
                            altField = this._get(inst, "altField");
                        altField &&
                        ((altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat")),
                            (date = this._getDate(inst)),
                            (dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst))),
                            $(altField).each(function () {
                                $(this).val(dateStr);
                            }));
                    },
                    noWeekends: function (day) {
                        day = day.getDay();
                        return [0 < day && day < 6, ""];
                    },
                    iso8601Week: function (time) {
                        var checkDate = new Date(time.getTime());
                        return checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)), (time = checkDate.getTime()), checkDate.setMonth(0), checkDate.setDate(1), Math.floor(Math.round((time - checkDate) / 864e5) / 7) + 1;
                    },
                    parseDate: function (format, value, settings) {
                        if (null == format || null == value) throw "Invalid arguments";
                        if ("" === (value = "object" == typeof value ? value.toString() : value + "")) return null;
                        function lookAhead(matches) {
                            return (matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === matches) && iFormat++, matches;
                        }
                        function getNumber(match) {
                            var num = lookAhead(match),
                                num = "@" === match ? 14 : "!" === match ? 20 : "y" === match && num ? 4 : "o" === match ? 3 : 2,
                                num = new RegExp("^\\d{" + ("y" === match ? num : 1) + "," + num + "}");
                            if (!(num = value.substring(iValue).match(num))) throw "Missing number at position " + iValue;
                            return (iValue += num[0].length), parseInt(num[0], 10);
                        }
                        function getName(match, names, longNames) {
                            var index = -1,
                                names = $.map(lookAhead(match) ? longNames : names, function (v, k) {
                                    return [[k, v]];
                                }).sort(function (a, b) {
                                    return -(a[1].length - b[1].length);
                                });
                            if (
                                ($.each(names, function (i, pair) {
                                    var name = pair[1];
                                    if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) return (index = pair[0]), (iValue += name.length), !1;
                                }),
                                -1 !== index)
                            )
                                return index + 1;
                            throw "Unknown name at position " + iValue;
                        }
                        function checkLiteral() {
                            if (value.charAt(iValue) !== format.charAt(iFormat)) throw "Unexpected literal at position " + iValue;
                            iValue++;
                        }
                        for (
                            var dim,
                                extra,
                                date,
                                iValue = 0,
                                shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
                                shortYearCutoff = "string" != typeof shortYearCutoff ? shortYearCutoff : (new Date().getFullYear() % 100) + parseInt(shortYearCutoff, 10),
                                dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
                                dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
                                monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
                                monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
                                year = -1,
                                month = -1,
                                day = -1,
                                doy = -1,
                                literal = !1,
                                iFormat = 0;
                            iFormat < format.length;
                            iFormat++
                        )
                            if (literal) "'" !== format.charAt(iFormat) || lookAhead("'") ? checkLiteral() : (literal = !1);
                            else
                                switch (format.charAt(iFormat)) {
                                    case "d":
                                        day = getNumber("d");
                                        break;
                                    case "D":
                                        getName("D", dayNamesShort, dayNames);
                                        break;
                                    case "o":
                                        doy = getNumber("o");
                                        break;
                                    case "m":
                                        month = getNumber("m");
                                        break;
                                    case "M":
                                        month = getName("M", monthNamesShort, monthNames);
                                        break;
                                    case "y":
                                        year = getNumber("y");
                                        break;
                                    case "@":
                                        (year = (date = new Date(getNumber("@"))).getFullYear()), (month = date.getMonth() + 1), (day = date.getDate());
                                        break;
                                    case "!":
                                        (year = (date = new Date((getNumber("!") - this._ticksTo1970) / 1e4)).getFullYear()), (month = date.getMonth() + 1), (day = date.getDate());
                                        break;
                                    case "'":
                                        lookAhead("'") ? checkLiteral() : (literal = !0);
                                        break;
                                    default:
                                        checkLiteral();
                                }
                        if (iValue < value.length && ((extra = value.substr(iValue)), !/^\s+/.test(extra))) throw "Extra/unparsed characters found in date: " + extra;
                        if ((-1 === year ? (year = new Date().getFullYear()) : year < 100 && (year += new Date().getFullYear() - (new Date().getFullYear() % 100) + (year <= shortYearCutoff ? 0 : -100)), -1 < doy))
                            for (month = 1, day = doy; ; ) {
                                if (day <= (dim = this._getDaysInMonth(year, month - 1))) break;
                                month++, (day -= dim);
                            }
                        if ((date = this._daylightSavingAdjust(new Date(year, month - 1, day))).getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) throw "Invalid date";
                        return date;
                    },
                    ATOM: "yy-mm-dd",
                    COOKIE: "D, dd M yy",
                    ISO_8601: "yy-mm-dd",
                    RFC_822: "D, d M y",
                    RFC_850: "DD, dd-M-y",
                    RFC_1036: "D, d M y",
                    RFC_1123: "D, d M yy",
                    RFC_2822: "D, d M yy",
                    RSS: "D, d M y",
                    TICKS: "!",
                    TIMESTAMP: "@",
                    W3C: "yy-mm-dd",
                    _ticksTo1970: 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 60 * 60 * 1e7,
                    formatDate: function (format, date, settings) {
                        if (!date) return "";
                        function lookAhead(matches) {
                            return (matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === matches) && iFormat++, matches;
                        }
                        function formatNumber(match, value, len) {
                            var num = "" + value;
                            if (lookAhead(match)) for (; num.length < len; ) num = "0" + num;
                            return num;
                        }
                        function formatName(match, value, shortNames, longNames) {
                            return (lookAhead(match) ? longNames : shortNames)[value];
                        }
                        var iFormat,
                            dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
                            dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
                            monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
                            monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
                            output = "",
                            literal = !1;
                        if (date)
                            for (iFormat = 0; iFormat < format.length; iFormat++)
                                if (literal) "'" !== format.charAt(iFormat) || lookAhead("'") ? (output += format.charAt(iFormat)) : (literal = !1);
                                else
                                    switch (format.charAt(iFormat)) {
                                        case "d":
                                            output += formatNumber("d", date.getDate(), 2);
                                            break;
                                        case "D":
                                            output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                                            break;
                                        case "o":
                                            output += formatNumber("o", Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                                            break;
                                        case "m":
                                            output += formatNumber("m", date.getMonth() + 1, 2);
                                            break;
                                        case "M":
                                            output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                                            break;
                                        case "y":
                                            output += lookAhead("y") ? date.getFullYear() : (date.getYear() % 100 < 10 ? "0" : "") + (date.getYear() % 100);
                                            break;
                                        case "@":
                                            output += date.getTime();
                                            break;
                                        case "!":
                                            output += 1e4 * date.getTime() + this._ticksTo1970;
                                            break;
                                        case "'":
                                            lookAhead("'") ? (output += "'") : (literal = !0);
                                            break;
                                        default:
                                            output += format.charAt(iFormat);
                                    }
                        return output;
                    },
                    _possibleChars: function (format) {
                        function lookAhead(matches) {
                            return (matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === matches) && iFormat++, matches;
                        }
                        for (var chars = "", literal = !1, iFormat = 0; iFormat < format.length; iFormat++)
                            if (literal) "'" !== format.charAt(iFormat) || lookAhead("'") ? (chars += format.charAt(iFormat)) : (literal = !1);
                            else
                                switch (format.charAt(iFormat)) {
                                    case "d":
                                    case "m":
                                    case "y":
                                    case "@":
                                        chars += "0123456789";
                                        break;
                                    case "D":
                                    case "M":
                                        return null;
                                    case "'":
                                        lookAhead("'") ? (chars += "'") : (literal = !0);
                                        break;
                                    default:
                                        chars += format.charAt(iFormat);
                                }
                        return chars;
                    },
                    _get: function (inst, name) {
                        return (void 0 !== inst.settings[name] ? inst.settings : this._defaults)[name];
                    },
                    _setDateFromField: function (inst, noDefault) {
                        if (inst.input.val() !== inst.lastVal) {
                            var dateFormat = this._get(inst, "dateFormat"),
                                dates = (inst.lastVal = inst.input ? inst.input.val() : null),
                                defaultDate = this._getDefaultDate(inst),
                                date = defaultDate,
                                settings = this._getFormatConfig(inst);
                            try {
                                date = this.parseDate(dateFormat, dates, settings) || defaultDate;
                            } catch (event) {
                                dates = noDefault ? "" : dates;
                            }
                            (inst.selectedDay = date.getDate()),
                                (inst.drawMonth = inst.selectedMonth = date.getMonth()),
                                (inst.drawYear = inst.selectedYear = date.getFullYear()),
                                (inst.currentDay = dates ? date.getDate() : 0),
                                (inst.currentMonth = dates ? date.getMonth() : 0),
                                (inst.currentYear = dates ? date.getFullYear() : 0),
                                this._adjustInstDate(inst);
                        }
                    },
                    _getDefaultDate: function (inst) {
                        return this._restrictMinMax(inst, this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
                    },
                    _determineDate: function (inst, newDate, defaultDate) {
                        newDate =
                            null == newDate || "" === newDate
                                ? defaultDate
                                : "string" == typeof newDate
                                    ? (function (offset) {
                                        try {
                                            return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), offset, $.datepicker._getFormatConfig(inst));
                                        } catch (e) {}
                                        for (
                                            var date = (offset.toLowerCase().match(/^c/) ? $.datepicker._getDate(inst) : null) || new Date(),
                                                year = date.getFullYear(),
                                                month = date.getMonth(),
                                                day = date.getDate(),
                                                pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                                                matches = pattern.exec(offset);
                                            matches;

                                        ) {
                                            switch (matches[2] || "d") {
                                                case "d":
                                                case "D":
                                                    day += parseInt(matches[1], 10);
                                                    break;
                                                case "w":
                                                case "W":
                                                    day += 7 * parseInt(matches[1], 10);
                                                    break;
                                                case "m":
                                                case "M":
                                                    (month += parseInt(matches[1], 10)), (day = Math.min(day, $.datepicker._getDaysInMonth(year, month)));
                                                    break;
                                                case "y":
                                                case "Y":
                                                    (year += parseInt(matches[1], 10)), (day = Math.min(day, $.datepicker._getDaysInMonth(year, month)));
                                            }
                                            matches = pattern.exec(offset);
                                        }
                                        return new Date(year, month, day);
                                    })(newDate)
                                    : "number" == typeof newDate
                                        ? isNaN(newDate)
                                            ? defaultDate
                                            : (function (offset) {
                                                var date = new Date();
                                                return date.setDate(date.getDate() + offset), date;
                                            })(newDate)
                                        : new Date(newDate.getTime());
                        return (
                            (newDate = newDate && "Invalid Date" === newDate.toString() ? defaultDate : newDate) && (newDate.setHours(0), newDate.setMinutes(0), newDate.setSeconds(0), newDate.setMilliseconds(0)),
                                this._daylightSavingAdjust(newDate)
                        );
                    },
                    _daylightSavingAdjust: function (date) {
                        return date ? (date.setHours(12 < date.getHours() ? date.getHours() + 2 : 0), date) : null;
                    },
                    _setDate: function (inst, newDate, noChange) {
                        var clear = !newDate,
                            origMonth = inst.selectedMonth,
                            origYear = inst.selectedYear,
                            newDate = this._restrictMinMax(inst, this._determineDate(inst, newDate, new Date()));
                        (inst.selectedDay = inst.currentDay = newDate.getDate()),
                            (inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth()),
                            (inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear()),
                        (origMonth === inst.selectedMonth && origYear === inst.selectedYear) || noChange || this._notifyChange(inst),
                            this._adjustInstDate(inst),
                        inst.input && inst.input.val(clear ? "" : this._formatDate(inst));
                    },
                    _getDate: function (inst) {
                        return !inst.currentYear || (inst.input && "" === inst.input.val()) ? null : this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay));
                    },
                    _attachHandlers: function (inst) {
                        var stepMonths = this._get(inst, "stepMonths"),
                            id = "#" + inst.id.replace(/\\\\/g, "\\");
                        inst.dpDiv.find("[data-handler]").map(function () {
                            var handler = {
                                prev: function () {
                                    $.datepicker._adjustDate(id, -stepMonths, "M");
                                },
                                next: function () {
                                    $.datepicker._adjustDate(id, +stepMonths, "M");
                                },
                                hide: function () {
                                    $.datepicker._hideDatepicker();
                                },
                                today: function () {
                                    $.datepicker._gotoToday(id);
                                },
                                selectDay: function () {
                                    return $.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1;
                                },
                                selectMonth: function () {
                                    return $.datepicker._selectMonthYear(id, this, "M"), !1;
                                },
                                selectYear: function () {
                                    return $.datepicker._selectMonthYear(id, this, "Y"), !1;
                                },
                            };
                            $(this).on(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
                        });
                    },
                    _generateHTML: function (inst) {
                        var maxDraw,
                            prev,
                            next,
                            firstDay,
                            showWeek,
                            dayNames,
                            dayNamesMin,
                            monthNames,
                            monthNamesShort,
                            beforeShowDay,
                            showOtherMonths,
                            selectOtherMonths,
                            defaultDate,
                            html,
                            dow,
                            row,
                            group,
                            col,
                            selectedDate,
                            calender,
                            thead,
                            day,
                            leadDays,
                            curRows,
                            numRows,
                            printDate,
                            dRow,
                            tbody,
                            daySettings,
                            otherMonth,
                            unselectable,
                            stepMonths = new Date(),
                            today = this._daylightSavingAdjust(new Date(stepMonths.getFullYear(), stepMonths.getMonth(), stepMonths.getDate())),
                            isRTL = this._get(inst, "isRTL"),
                            showButtonPanel = this._get(inst, "showButtonPanel"),
                            currentText = this._get(inst, "hideIfNoPrevNext"),
                            buttonPanel = this._get(inst, "navigationAsDateFormat"),
                            numMonths = this._getNumberOfMonths(inst),
                            gotoDate = this._get(inst, "showCurrentAtPos"),
                            stepMonths = this._get(inst, "stepMonths"),
                            isMultiMonth = 1 !== numMonths[0] || 1 !== numMonths[1],
                            currentDate = this._daylightSavingAdjust(inst.currentDay ? new Date(inst.currentYear, inst.currentMonth, inst.currentDay) : new Date(9999, 9, 9)),
                            minDate = this._getMinMaxDate(inst, "min"),
                            maxDate = this._getMinMaxDate(inst, "max"),
                            drawMonth = inst.drawMonth - gotoDate,
                            drawYear = inst.drawYear;
                        if ((drawMonth < 0 && ((drawMonth += 12), drawYear--), maxDate))
                            for (
                                maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(), maxDate.getMonth() - numMonths[0] * numMonths[1] + 1, maxDate.getDate())), maxDraw = minDate && maxDraw < minDate ? minDate : maxDraw;
                                this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw;

                            )
                                --drawMonth < 0 && ((drawMonth = 11), drawYear--);
                        for (
                            inst.drawMonth = drawMonth,
                                inst.drawYear = drawYear,
                                gotoDate = this._get(inst, "prevText"),
                                gotoDate = buttonPanel ? this.formatDate(gotoDate, this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)), this._getFormatConfig(inst)) : gotoDate,
                                prev = this._canAdjustMonth(inst, -1, drawYear, drawMonth)
                                    ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" +
                                    gotoDate +
                                    "'><span class='ui-icon ui-icon-circle-triangle-" +
                                    (isRTL ? "e" : "w") +
                                    "'>" +
                                    gotoDate +
                                    "</span></a>"
                                    : currentText
                                        ? ""
                                        : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + gotoDate + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + gotoDate + "</span></a>",
                                gotoDate = this._get(inst, "nextText"),
                                gotoDate = buttonPanel ? this.formatDate(gotoDate, this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)), this._getFormatConfig(inst)) : gotoDate,
                                next = this._canAdjustMonth(inst, 1, drawYear, drawMonth)
                                    ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" +
                                    gotoDate +
                                    "'><span class='ui-icon ui-icon-circle-triangle-" +
                                    (isRTL ? "w" : "e") +
                                    "'>" +
                                    gotoDate +
                                    "</span></a>"
                                    : currentText
                                        ? ""
                                        : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + gotoDate + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + gotoDate + "</span></a>",
                                currentText = this._get(inst, "currentText"),
                                gotoDate = this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today,
                                currentText = buttonPanel ? this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)) : currentText,
                                buttonPanel = inst.inline
                                    ? ""
                                    : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(inst, "closeText") + "</button>",
                                buttonPanel = showButtonPanel
                                    ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" +
                                    (isRTL ? buttonPanel : "") +
                                    (this._isInRange(inst, gotoDate)
                                        ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + currentText + "</button>"
                                        : "") +
                                    (isRTL ? "" : buttonPanel) +
                                    "</div>"
                                    : "",
                                firstDay = parseInt(this._get(inst, "firstDay"), 10),
                                firstDay = isNaN(firstDay) ? 0 : firstDay,
                                showWeek = this._get(inst, "showWeek"),
                                dayNames = this._get(inst, "dayNames"),
                                dayNamesMin = this._get(inst, "dayNamesMin"),
                                monthNames = this._get(inst, "monthNames"),
                                monthNamesShort = this._get(inst, "monthNamesShort"),
                                beforeShowDay = this._get(inst, "beforeShowDay"),
                                showOtherMonths = this._get(inst, "showOtherMonths"),
                                selectOtherMonths = this._get(inst, "selectOtherMonths"),
                                defaultDate = this._getDefaultDate(inst),
                                html = "",
                                row = 0;
                            row < numMonths[0];
                            row++
                        ) {
                            for (group = "", this.maxRows = 4, col = 0; col < numMonths[1]; col++) {
                                if (((selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay))), (leadDays = " ui-corner-all"), (calender = ""), isMultiMonth)) {
                                    if (((calender += "<div class='ui-datepicker-group"), 1 < numMonths[1]))
                                        switch (col) {
                                            case 0:
                                                (calender += " ui-datepicker-group-first"), (leadDays = " ui-corner-" + (isRTL ? "right" : "left"));
                                                break;
                                            case numMonths[1] - 1:
                                                (calender += " ui-datepicker-group-last"), (leadDays = " ui-corner-" + (isRTL ? "left" : "right"));
                                                break;
                                            default:
                                                (calender += " ui-datepicker-group-middle"), (leadDays = "");
                                        }
                                    calender += "'>";
                                }
                                for (
                                    calender +=
                                        "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" +
                                        leadDays +
                                        "'>" +
                                        (/all|left/.test(leadDays) && 0 === row ? (isRTL ? next : prev) : "") +
                                        (/all|right/.test(leadDays) && 0 === row ? (isRTL ? prev : next) : "") +
                                        this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate, 0 < row || 0 < col, monthNames, monthNamesShort) +
                                        "</div><table class='ui-datepicker-calendar'><thead><tr>",
                                        thead = showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "",
                                        dow = 0;
                                    dow < 7;
                                    dow++
                                )
                                    thead += "<th scope='col'" + (5 <= (dow + firstDay + 6) % 7 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + dayNames[(day = (dow + firstDay) % 7)] + "'>" + dayNamesMin[day] + "</span></th>";
                                for (
                                    calender += thead + "</tr></thead><tbody>",
                                        curRows = this._getDaysInMonth(drawYear, drawMonth),
                                    drawYear === inst.selectedYear && drawMonth === inst.selectedMonth && (inst.selectedDay = Math.min(inst.selectedDay, curRows)),
                                        leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7,
                                        curRows = Math.ceil((leadDays + curRows) / 7),
                                        numRows = isMultiMonth && this.maxRows > curRows ? this.maxRows : curRows,
                                        this.maxRows = numRows,
                                        printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays)),
                                        dRow = 0;
                                    dRow < numRows;
                                    dRow++
                                ) {
                                    for (calender += "<tr>", tbody = showWeek ? "<td class='ui-datepicker-week-col'>" + this._get(inst, "calculateWeek")(printDate) + "</td>" : "", dow = 0; dow < 7; dow++)
                                        (daySettings = beforeShowDay ? beforeShowDay.apply(inst.input ? inst.input[0] : null, [printDate]) : [!0, ""]),
                                            (unselectable = ((otherMonth = printDate.getMonth() !== drawMonth) && !selectOtherMonths) || !daySettings[0] || (minDate && printDate < minDate) || (maxDate && maxDate < printDate)),
                                            (tbody +=
                                                "<td class='" +
                                                (5 <= (dow + firstDay + 6) % 7 ? " ui-datepicker-week-end" : "") +
                                                (otherMonth ? " ui-datepicker-other-month" : "") +
                                                ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) ||
                                                (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime())
                                                    ? " " + this._dayOverClass
                                                    : "") +
                                                (unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "") +
                                                (otherMonth && !showOtherMonths
                                                    ? ""
                                                    : " " + daySettings[1] + (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) +
                                                "'" +
                                                ((otherMonth && !showOtherMonths) || !daySettings[2] ? "" : " title='" + daySettings[2].replace(/'/g, "&#39;") + "'") +
                                                (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") +
                                                ">" +
                                                (otherMonth && !showOtherMonths
                                                    ? "&#xa0;"
                                                    : unselectable
                                                        ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>"
                                                        : "<a class='ui-state-default" +
                                                        (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                                                        (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") +
                                                        (otherMonth ? " ui-priority-secondary" : "") +
                                                        "' href='#'>" +
                                                        printDate.getDate() +
                                                        "</a>") +
                                                "</td>"),
                                            printDate.setDate(printDate.getDate() + 1),
                                            (printDate = this._daylightSavingAdjust(printDate));
                                    calender += tbody + "</tr>";
                                }
                                11 < ++drawMonth && ((drawMonth = 0), drawYear++),
                                    (group += calender += "</tbody></table>" + (isMultiMonth ? "</div>" + (0 < numMonths[0] && col === numMonths[1] - 1 ? "<div class='ui-datepicker-row-break'></div>" : "") : ""));
                            }
                            html += group;
                        }
                        return (html += buttonPanel), (inst._keyEvent = !1), html;
                    },
                    _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate, secondary, determineYear, monthNamesShort) {
                        var inMinYear,
                            inMaxYear,
                            month,
                            years,
                            thisYear,
                            year,
                            endYear,
                            changeMonth = this._get(inst, "changeMonth"),
                            changeYear = this._get(inst, "changeYear"),
                            showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
                            html = "<div class='ui-datepicker-title'>",
                            monthHtml = "";
                        if (secondary || !changeMonth) monthHtml += "<span class='ui-datepicker-month'>" + determineYear[drawMonth] + "</span>";
                        else {
                            for (
                                inMinYear = minDate && minDate.getFullYear() === drawYear,
                                    inMaxYear = maxDate && maxDate.getFullYear() === drawYear,
                                    monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",
                                    month = 0;
                                month < 12;
                                month++
                            )
                                (!inMinYear || month >= minDate.getMonth()) &&
                                (!inMaxYear || month <= maxDate.getMonth()) &&
                                (monthHtml += "<option value='" + month + "'" + (month === drawMonth ? " selected='selected'" : "") + ">" + monthNamesShort[month] + "</option>");
                            monthHtml += "</select>";
                        }
                        if ((showMonthAfterYear || (html += monthHtml + (!secondary && changeMonth && changeYear ? "" : "&#xa0;")), !inst.yearshtml))
                            if (((inst.yearshtml = ""), secondary || !changeYear)) html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
                            else {
                                for (
                                    years = this._get(inst, "yearRange").split(":"),
                                        thisYear = new Date().getFullYear(),
                                        year = (determineYear = function (year) {
                                            year = year.match(/c[+\-].*/) ? drawYear + parseInt(year.substring(1), 10) : year.match(/[+\-].*/) ? thisYear + parseInt(year, 10) : parseInt(year, 10);
                                            return isNaN(year) ? thisYear : year;
                                        })(years[0]),
                                        endYear = Math.max(year, determineYear(years[1] || "")),
                                        year = minDate ? Math.max(year, minDate.getFullYear()) : year,
                                        endYear = maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear,
                                        inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
                                    year <= endYear;
                                    year++
                                )
                                    inst.yearshtml += "<option value='" + year + "'" + (year === drawYear ? " selected='selected'" : "") + ">" + year + "</option>";
                                (inst.yearshtml += "</select>"), (html += inst.yearshtml), (inst.yearshtml = null);
                            }
                        return (html += this._get(inst, "yearSuffix")), showMonthAfterYear && (html += (!secondary && changeMonth && changeYear ? "" : "&#xa0;") + monthHtml), (html += "</div>");
                    },
                    _adjustInstDate: function (inst, date, period) {
                        var year = inst.drawYear + ("Y" === period ? date : 0),
                            month = inst.drawMonth + ("M" === period ? date : 0),
                            date = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + ("D" === period ? date : 0),
                            date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, date)));
                        (inst.selectedDay = date.getDate()), (inst.drawMonth = inst.selectedMonth = date.getMonth()), (inst.drawYear = inst.selectedYear = date.getFullYear()), ("M" !== period && "Y" !== period) || this._notifyChange(inst);
                    },
                    _restrictMinMax: function (maxDate, newDate) {
                        var minDate = this._getMinMaxDate(maxDate, "min"),
                            maxDate = this._getMinMaxDate(maxDate, "max"),
                            newDate = minDate && newDate < minDate ? minDate : newDate;
                        return maxDate && maxDate < newDate ? maxDate : newDate;
                    },
                    _notifyChange: function (inst) {
                        var onChange = this._get(inst, "onChangeMonthYear");
                        onChange && onChange.apply(inst.input ? inst.input[0] : null, [inst.selectedYear, inst.selectedMonth + 1, inst]);
                    },
                    _getNumberOfMonths: function (numMonths) {
                        numMonths = this._get(numMonths, "numberOfMonths");
                        return null == numMonths ? [1, 1] : "number" == typeof numMonths ? [1, numMonths] : numMonths;
                    },
                    _getMinMaxDate: function (inst, minMax) {
                        return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
                    },
                    _getDaysInMonth: function (year, month) {
                        return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
                    },
                    _getFirstDayOfMonth: function (year, month) {
                        return new Date(year, month, 1).getDay();
                    },
                    _canAdjustMonth: function (inst, offset, curYear, curMonth) {
                        var date = this._getNumberOfMonths(inst),
                            date = this._daylightSavingAdjust(new Date(curYear, curMonth + (offset < 0 ? offset : date[0] * date[1]), 1));
                        return offset < 0 && date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth())), this._isInRange(inst, date);
                    },
                    _isInRange: function (yearSplit, date) {
                        var minDate = this._getMinMaxDate(yearSplit, "min"),
                            maxDate = this._getMinMaxDate(yearSplit, "max"),
                            minYear = null,
                            maxYear = null,
                            currentYear = this._get(yearSplit, "yearRange");
                        return (
                            currentYear &&
                            ((yearSplit = currentYear.split(":")),
                                (currentYear = new Date().getFullYear()),
                                (minYear = parseInt(yearSplit[0], 10)),
                                (maxYear = parseInt(yearSplit[1], 10)),
                            yearSplit[0].match(/[+\-].*/) && (minYear += currentYear),
                            yearSplit[1].match(/[+\-].*/) && (maxYear += currentYear)),
                            (!minDate || date.getTime() >= minDate.getTime()) && (!maxDate || date.getTime() <= maxDate.getTime()) && (!minYear || date.getFullYear() >= minYear) && (!maxYear || date.getFullYear() <= maxYear)
                        );
                    },
                    _getFormatConfig: function (inst) {
                        var shortYearCutoff = this._get(inst, "shortYearCutoff");
                        return {
                            shortYearCutoff: (shortYearCutoff = "string" != typeof shortYearCutoff ? shortYearCutoff : (new Date().getFullYear() % 100) + parseInt(shortYearCutoff, 10)),
                            dayNamesShort: this._get(inst, "dayNamesShort"),
                            dayNames: this._get(inst, "dayNames"),
                            monthNamesShort: this._get(inst, "monthNamesShort"),
                            monthNames: this._get(inst, "monthNames"),
                        };
                    },
                    _formatDate: function (inst, date, month, year) {
                        date || ((inst.currentDay = inst.selectedDay), (inst.currentMonth = inst.selectedMonth), (inst.currentYear = inst.selectedYear));
                        date = date ? ("object" == typeof date ? date : this._daylightSavingAdjust(new Date(year, month, date))) : this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay));
                        return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
                    },
                }),
                ($.fn.datepicker = function (options) {
                    if (!this.length) return this;
                    $.datepicker.initialized || ($(document).on("mousedown", $.datepicker._checkExternalClick), ($.datepicker.initialized = !0)), 0 === $("#" + $.datepicker._mainDivId).length && $("body").append($.datepicker.dpDiv);
                    var otherArgs = Array.prototype.slice.call(arguments, 1);
                    return ("string" == typeof options && ("isDisabled" === options || "getDate" === options || "widget" === options)) || ("option" === options && 2 === arguments.length && "string" == typeof arguments[1])
                        ? $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this[0]].concat(otherArgs))
                        : this.each(function () {
                            "string" == typeof options ? $.datepicker["_" + options + "Datepicker"].apply($.datepicker, [this].concat(otherArgs)) : $.datepicker._attachDatepicker(this, options);
                        });
                }),
                ($.datepicker = new Datepicker()),
                ($.datepicker.initialized = !1),
                ($.datepicker.uuid = new Date().getTime()),
                ($.datepicker.version = "@VERSION"),
                $.datepicker
        );
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["../datepicker"], factory) : factory(jQuery.datepicker);
    })(function (datepicker) {
        return (
            (datepicker.regional.cs = {
                closeText: "ZavÅ™Ã­t",
                prevText: "&#x3C;DÅ™Ã­ve",
                nextText: "PozdÄ›ji&#x3E;",
                currentText: "NynÃ­",
                monthNames: ["leden", "Ãºnor", "bÅ™ezen", "duben", "kvÄ›ten", "Äerven", "Äervenec", "srpen", "zÃ¡Å™Ã­", "Å™Ã­jen", "listopad", "prosinec"],
                monthNamesShort: ["led", "Ãºno", "bÅ™e", "dub", "kvÄ›", "Äer", "Ävc", "srp", "zÃ¡Å™", "Å™Ã­j", "lis", "pro"],
                dayNames: ["nedÄ›le", "pondÄ›lÃ­", "ÃºterÃ½", "stÅ™eda", "Ätvrtek", "pÃ¡tek", "sobota"],
                dayNamesShort: ["ne", "po", "Ãºt", "st", "Ät", "pÃ¡", "so"],
                dayNamesMin: ["ne", "po", "Ãºt", "st", "Ät", "pÃ¡", "so"],
                weekHeader: "TÃ½d",
                dateFormat: "d.m.yy",
                firstDay: 1,
                isRTL: !1,
                showMonthAfterYear: !1,
                yearSuffix: "",
            }),
                datepicker.setDefaults(datepicker.regional.cs),
                datepicker.regional.cs
        );
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget", "./position"], factory) : factory(jQuery);
    })(function ($) {
        return $.widget("ui.menu", {
            version: "@VERSION",
            defaultElement: "<ul>",
            delay: 300,
            options: { icons: { submenu: "ui-icon-caret-1-e" }, items: "> *", menus: "ul", position: { my: "left top", at: "right top" }, role: "menu", blur: null, focus: null, select: null },
            _create: function () {
                (this.activeMenu = this.element),
                    (this.mouseHandled = !1),
                    this.element.uniqueId().attr({ role: this.options.role, tabIndex: 0 }),
                this.options.disabled && (this._addClass(null, "ui-state-disabled"), this.element.attr("aria-disabled", "true")),
                    this._addClass("ui-menu", "ui-widget ui-widget-content"),
                    this._on({
                        "mousedown .ui-menu-item": function (event) {
                            event.preventDefault();
                        },
                        "click .ui-menu-item": function (event) {
                            var target = $(event.target);
                            !this.mouseHandled &&
                            target.not(".ui-state-disabled").length &&
                            (this.select(event),
                            event.isPropagationStopped() || (this.mouseHandled = !0),
                                target.has(".ui-menu").length
                                    ? this.expand(event)
                                    : !this.element.is(":focus") &&
                                    $($.ui.safeActiveElement(this.document[0])).closest(".ui-menu").length &&
                                    (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)));
                        },
                        "mouseenter .ui-menu-item": function (event) {
                            var actualTarget, target;
                            this.previousFilter ||
                            ((actualTarget = $(event.target).closest(".ui-menu-item")),
                                (target = $(event.currentTarget)),
                            actualTarget[0] === target[0] && (this._removeClass(target.siblings().children(".ui-state-active"), null, "ui-state-active"), this.focus(event, target)));
                        },
                        mouseleave: "collapseAll",
                        "mouseleave .ui-menu": "collapseAll",
                        focus: function (event, keepActiveItem) {
                            var item = this.active || this.element.find(this.options.items).eq(0);
                            keepActiveItem || this.focus(event, item);
                        },
                        blur: function (event) {
                            this._delay(function () {
                                $.contains(this.element[0], $.ui.safeActiveElement(this.document[0])) || this.collapseAll(event);
                            });
                        },
                        keydown: "_keydown",
                    }),
                    this.refresh(),
                    this._on(this.document, {
                        click: function (event) {
                            this._closeOnDocumentClick(event) && this.collapseAll(event), (this.mouseHandled = !1);
                        },
                    });
            },
            _destroy: function () {
                var submenus = this.element.find(".ui-menu-item").removeAttr("role aria-disabled").children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");
                this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex").removeUniqueId().show(),
                    submenus.children().each(function () {
                        var elem = $(this);
                        elem.data("ui-menu-submenu-caret") && elem.remove();
                    });
            },
            _keydown: function (event) {
                var match,
                    character,
                    skip,
                    preventDefault = !0;
                switch (event.keyCode) {
                    case $.ui.keyCode.PAGE_UP:
                        this.previousPage(event);
                        break;
                    case $.ui.keyCode.PAGE_DOWN:
                        this.nextPage(event);
                        break;
                    case $.ui.keyCode.HOME:
                        this._move("first", "first", event);
                        break;
                    case $.ui.keyCode.END:
                        this._move("last", "last", event);
                        break;
                    case $.ui.keyCode.UP:
                        this.previous(event);
                        break;
                    case $.ui.keyCode.DOWN:
                        this.next(event);
                        break;
                    case $.ui.keyCode.LEFT:
                        this.collapse(event);
                        break;
                    case $.ui.keyCode.RIGHT:
                        this.active && !this.active.is(".ui-state-disabled") && this.expand(event);
                        break;
                    case $.ui.keyCode.ENTER:
                    case $.ui.keyCode.SPACE:
                        this._activate(event);
                        break;
                    case $.ui.keyCode.ESCAPE:
                        this.collapse(event);
                        break;
                    default:
                        (preventDefault = !1),
                            (match = this.previousFilter || ""),
                            (character = String.fromCharCode(event.keyCode)),
                            (skip = !1),
                            clearTimeout(this.filterTimer),
                            character === match ? (skip = !0) : (character = match + character),
                            (match = this._filterMenuItems(character)),
                        (match = skip && -1 !== match.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : match).length || ((character = String.fromCharCode(event.keyCode)), (match = this._filterMenuItems(character))),
                            match.length
                                ? (this.focus(event, match),
                                    (this.previousFilter = character),
                                    (this.filterTimer = this._delay(function () {
                                        delete this.previousFilter;
                                    }, 1e3)))
                                : delete this.previousFilter;
                }
                preventDefault && event.preventDefault();
            },
            _activate: function (event) {
                this.active.is(".ui-state-disabled") || (this.active.children("[aria-haspopup='true']").length ? this.expand(event) : this.select(event));
            },
            refresh: function () {
                var items,
                    newItems,
                    that = this,
                    icon = this.options.icons.submenu,
                    newWrappers = this.element.find(this.options.menus);
                this._toggleClass("ui-menu-icons", null, !!this.element.find(".ui-icon").length),
                    (newItems = newWrappers
                        .filter(":not(.ui-menu)")
                        .hide()
                        .attr({ role: this.options.role, "aria-hidden": "true", "aria-expanded": "false" })
                        .each(function () {
                            var menu = $(this),
                                item = menu.prev(),
                                submenuCaret = $("<span>").data("ui-menu-submenu-caret", !0);
                            that._addClass(submenuCaret, "ui-menu-icon", "ui-icon " + icon), item.attr("aria-haspopup", "true").prepend(submenuCaret), menu.attr("aria-labelledby", item.attr("id"));
                        })),
                    this._addClass(newItems, "ui-menu", "ui-widget ui-widget-content ui-front"),
                    (items = newWrappers.add(this.element).find(this.options.items)).not(".ui-menu-item").each(function () {
                        var item = $(this);
                        that._isDivider(item) && that._addClass(item, "ui-menu-divider", "ui-widget-content");
                    }),
                    (newWrappers = (newItems = items.not(".ui-menu-item, .ui-menu-divider")).children().not(".ui-menu").uniqueId().attr({ tabIndex: -1, role: this._itemRole() })),
                    this._addClass(newItems, "ui-menu-item")._addClass(newWrappers, "ui-menu-item-wrapper"),
                    items.filter(".ui-state-disabled").attr("aria-disabled", "true"),
                this.active && !$.contains(this.element[0], this.active[0]) && this.blur();
            },
            _itemRole: function () {
                return { menu: "menuitem", listbox: "option" }[this.options.role];
            },
            _setOption: function (key, value) {
                var icons;
                "icons" === key && ((icons = this.element.find(".ui-menu-icon")), this._removeClass(icons, null, this.options.icons.submenu)._addClass(icons, null, value.submenu)),
                "disabled" === key && (this.element.attr("aria-disabled", value), this._toggleClass(null, "ui-state-disabled", !!value)),
                    this._super(key, value);
            },
            focus: function (event, item) {
                var nested;
                this.blur(event, event && "focus" === event.type),
                    this._scrollIntoView(item),
                    (this.active = item.first()),
                    (nested = this.active.children(".ui-menu-item-wrapper")),
                    this._addClass(nested, null, "ui-state-active"),
                this.options.role && this.element.attr("aria-activedescendant", nested.attr("id")),
                    (nested = this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper")),
                    this._addClass(nested, null, "ui-state-active"),
                    event && "keydown" === event.type
                        ? this._close()
                        : (this.timer = this._delay(function () {
                            this._close();
                        }, this.delay)),
                (nested = item.children(".ui-menu")).length && event && /^mouse/.test(event.type) && this._startOpening(nested),
                    (this.activeMenu = item.parent()),
                    this._trigger("focus", event, { item: item });
            },
            _scrollIntoView: function (itemHeight) {
                var offset, scroll, elementHeight;
                this._hasScroll() &&
                ((scroll = parseFloat($.css(this.activeMenu[0], "borderTopWidth")) || 0),
                    (elementHeight = parseFloat($.css(this.activeMenu[0], "paddingTop")) || 0),
                    (offset = itemHeight.offset().top - this.activeMenu.offset().top - scroll - elementHeight),
                    (scroll = this.activeMenu.scrollTop()),
                    (elementHeight = this.activeMenu.height()),
                    (itemHeight = itemHeight.outerHeight()),
                    offset < 0 ? this.activeMenu.scrollTop(scroll + offset) : elementHeight < offset + itemHeight && this.activeMenu.scrollTop(scroll + offset - elementHeight + itemHeight));
            },
            blur: function (event, fromFocus) {
                fromFocus || clearTimeout(this.timer), this.active && (this._removeClass(this.active.children(".ui-menu-item-wrapper"), null, "ui-state-active"), (this.active = null), this._trigger("blur", event, { item: this.active }));
            },
            _startOpening: function (submenu) {
                clearTimeout(this.timer),
                "true" === submenu.attr("aria-hidden") &&
                (this.timer = this._delay(function () {
                    this._close(), this._open(submenu);
                }, this.delay));
            },
            _open: function (submenu) {
                var position = $.extend({ of: this.active }, this.options.position);
                clearTimeout(this.timer), this.element.find(".ui-menu").not(submenu.parents(".ui-menu")).hide().attr("aria-hidden", "true"), submenu.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(position);
            },
            collapseAll: function (event, all) {
                clearTimeout(this.timer),
                    (this.timer = this._delay(function () {
                        var currentMenu = all ? this.element : $(event && event.target).closest(this.element.find(".ui-menu"));
                        currentMenu.length || (currentMenu = this.element), this._close(currentMenu), this.blur(event), (this.activeMenu = currentMenu);
                    }, this.delay));
            },
            _close: function (active) {
                active = (active = active || (this.active ? this.active.parent() : this.element))
                    .find(".ui-menu")
                    .hide()
                    .attr("aria-hidden", "true")
                    .attr("aria-expanded", "false")
                    .end()
                    .find(".ui-state-active")
                    .not(".ui-menu-item-wrapper");
                this._removeClass(active, null, "ui-state-active");
            },
            _closeOnDocumentClick: function (event) {
                return !$(event.target).closest(".ui-menu").length;
            },
            _isDivider: function (item) {
                return !/[^\-\u2014\u2013\s]/.test(item.text());
            },
            collapse: function (event) {
                var newItem = this.active && this.active.parent().closest(".ui-menu-item", this.element);
                newItem && newItem.length && (this._close(), this.focus(event, newItem));
            },
            expand: function (event) {
                var newItem = this.active && this.active.children(".ui-menu ").find(this.options.items).first();
                newItem &&
                newItem.length &&
                (this._open(newItem.parent()),
                    this._delay(function () {
                        this.focus(event, newItem);
                    }));
            },
            next: function (event) {
                this._move("next", "first", event);
            },
            previous: function (event) {
                this._move("prev", "last", event);
            },
            isFirstItem: function () {
                return this.active && !this.active.prevAll(".ui-menu-item").length;
            },
            isLastItem: function () {
                return this.active && !this.active.nextAll(".ui-menu-item").length;
            },
            _move: function (direction, filter, event) {
                var next;
                this.active && (next = "first" === direction || "last" === direction ? this.active["first" === direction ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[direction + "All"](".ui-menu-item").eq(0)),
                (next && next.length && this.active) || (next = this.activeMenu.find(this.options.items)[filter]()),
                    this.focus(event, next);
            },
            nextPage: function (event) {
                var item, base, height;
                this.active
                    ? this.isLastItem() ||
                    (this._hasScroll()
                        ? ((base = this.active.offset().top),
                            (height = this.element.height()),
                            this.active.nextAll(".ui-menu-item").each(function () {
                                return (item = $(this)).offset().top - base - height < 0;
                            }),
                            this.focus(event, item))
                        : this.focus(event, this.activeMenu.find(this.options.items)[this.active ? "last" : "first"]()))
                    : this.next(event);
            },
            previousPage: function (event) {
                var item, base, height;
                this.active
                    ? this.isFirstItem() ||
                    (this._hasScroll()
                        ? ((base = this.active.offset().top),
                            (height = this.element.height()),
                            this.active.prevAll(".ui-menu-item").each(function () {
                                return 0 < (item = $(this)).offset().top - base + height;
                            }),
                            this.focus(event, item))
                        : this.focus(event, this.activeMenu.find(this.options.items).first()))
                    : this.next(event);
            },
            _hasScroll: function () {
                return this.element.outerHeight() < this.element.prop("scrollHeight");
            },
            select: function (event) {
                this.active = this.active || $(event.target).closest(".ui-menu-item");
                var ui = { item: this.active };
                this.active.has(".ui-menu").length || this.collapseAll(event, !0), this._trigger("select", event, ui);
            },
            _filterMenuItems: function (escapedCharacter) {
                var escapedCharacter = escapedCharacter.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"),
                    regex = new RegExp("^" + escapedCharacter, "i");
                return this.activeMenu
                    .find(this.options.items)
                    .filter(".ui-menu-item")
                    .filter(function () {
                        return regex.test($.trim($(this).children(".ui-menu-item-wrapper").text()));
                    });
            },
        });
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget", "./position", "./menu"], factory) : factory(jQuery);
    })(function ($) {
        return $.widget("ui.selectmenu", {
            version: "@VERSION",
            defaultElement: "<select>",
            options: {
                appendTo: null,
                classes: { "ui-selectmenu-button-open": "ui-corner-top", "ui-selectmenu-button-closed": "ui-corner-all" },
                disabled: null,
                icons: { button: "ui-icon-triangle-1-s" },
                position: { my: "left top", at: "left bottom", collision: "none" },
                width: !1,
                change: null,
                close: null,
                focus: null,
                open: null,
                select: null,
            },
            _create: function () {
                var selectmenuId = this.element.uniqueId().attr("id");
                (this.ids = { element: selectmenuId, button: selectmenuId + "-button", menu: selectmenuId + "-menu" }),
                    this._drawButton(),
                    this._drawMenu(),
                    (this._rendered = !1),
                    (this.menuItems = $()),
                this.options.disabled && this.disable();
            },
            _drawButton: function () {
                var icon,
                    that = this,
                    item = this._parseOption(this.element.find("option:selected"), this.element[0].selectedIndex);
                (this.labels = this.element.labels().attr("for", this.ids.button)),
                    this._on(this.labels, {
                        click: function (event) {
                            this.button.focus(), event.preventDefault();
                        },
                    }),
                    this.element.hide(),
                    (this.button = $("<span>", {
                        tabindex: this.options.disabled ? -1 : 0,
                        id: this.ids.button,
                        role: "combobox",
                        "aria-expanded": "false",
                        "aria-autocomplete": "list",
                        "aria-owns": this.ids.menu,
                        "aria-haspopup": "true",
                        title: this.element.attr("title"),
                    }).insertAfter(this.element)),
                    this._addClass(this.button, "ui-selectmenu-button ui-selectmenu-button-closed", "ui-widget ui-state-default"),
                    (icon = $("<span>").prependTo(this.button)),
                    this._addClass(icon, null, "ui-icon " + this.options.icons.button),
                    (this.buttonItem = this._renderButtonItem(item).appendTo(this.button)),
                !1 !== this.options.width && this._resizeButton(),
                    this._on(this.button, this._buttonEvents),
                    this.button.one("focusin", function () {
                        that._rendered || that._refreshMenu();
                    }),
                    this._hoverable(this.button),
                    this._focusable(this.button);
            },
            _drawMenu: function () {
                var that = this;
                (this.menu = $("<ul>", { "aria-hidden": "true", "aria-labelledby": this.ids.button, id: this.ids.menu })),
                    (this.menuWrap = $("<div>").append(this.menu)),
                    this._addClass(this.menuWrap, "ui-selectmenu-menu", "ui-front"),
                    this.menuWrap.appendTo(this._appendTo()),
                    (this.menuInstance = this.menu
                        .menu({
                            classes: { "ui-menu": "ui-corner-bottom" },
                            role: "listbox",
                            select: function (event, ui) {
                                event.preventDefault(), that._setSelection(), that._select(ui.item.data("ui-selectmenu-item"), event);
                            },
                            focus: function (event, item) {
                                item = item.item.data("ui-selectmenu-item");
                                null != that.focusIndex && item.index !== that.focusIndex && (that._trigger("focus", event, { item: item }), that.isOpen || that._select(item, event)),
                                    (that.focusIndex = item.index),
                                    that.button.attr("aria-activedescendant", that.menuItems.eq(item.index).attr("id"));
                            },
                        })
                        .menu("instance")),
                    this.menuInstance._off(this.menu, "mouseleave"),
                    (this.menuInstance._closeOnDocumentClick = function () {
                        return !1;
                    }),
                    (this.menuInstance._isDivider = function () {
                        return !1;
                    });
            },
            refresh: function () {
                this._refreshMenu(), this.buttonItem.replaceWith((this.buttonItem = this._renderButtonItem(this._getSelectedItem().data("ui-selectmenu-item") || {}))), null === this.options.width && this._resizeButton();
            },
            _refreshMenu: function () {
                var item = this.element.find("option");
                this.menu.empty(),
                    this._parseOptions(item),
                    this._renderMenu(this.menu, this.items),
                    this.menuInstance.refresh(),
                    (this.menuItems = this.menu.find("li").not(".ui-selectmenu-optgroup").find(".ui-menu-item-wrapper")),
                    (this._rendered = !0),
                item.length && ((item = this._getSelectedItem()), this.menuInstance.focus(null, item), this._setAria(item.data("ui-selectmenu-item")), this._setOption("disabled", this.element.prop("disabled")));
            },
            open: function (event) {
                this.options.disabled ||
                (this._rendered ? (this._removeClass(this.menu.find(".ui-state-active"), null, "ui-state-active"), this.menuInstance.focus(null, this._getSelectedItem())) : this._refreshMenu(),
                this.menuItems.length && ((this.isOpen = !0), this._toggleAttr(), this._resizeMenu(), this._position(), this._on(this.document, this._documentClick), this._trigger("open", event)));
            },
            _position: function () {
                this.menuWrap.position($.extend({ of: this.button }, this.options.position));
            },
            close: function (event) {
                this.isOpen && ((this.isOpen = !1), this._toggleAttr(), (this.range = null), this._off(this.document), this._trigger("close", event));
            },
            widget: function () {
                return this.button;
            },
            menuWidget: function () {
                return this.menu;
            },
            _renderButtonItem: function (item) {
                var buttonItem = $("<span>");
                return this._setText(buttonItem, item.label), this._addClass(buttonItem, "ui-selectmenu-text"), buttonItem;
            },
            _renderMenu: function (ul, items) {
                var that = this,
                    currentOptgroup = "";
                $.each(items, function (index, item) {
                    var li;
                    item.optgroup !== currentOptgroup &&
                    ((li = $("<li>", { text: item.optgroup })),
                        that._addClass(li, "ui-selectmenu-optgroup", "ui-menu-divider" + (item.element.parent("optgroup").prop("disabled") ? " ui-state-disabled" : "")),
                        li.appendTo(ul),
                        (currentOptgroup = item.optgroup)),
                        that._renderItemData(ul, item);
                });
            },
            _renderItemData: function (ul, item) {
                return this._renderItem(ul, item).data("ui-selectmenu-item", item);
            },
            _renderItem: function (ul, item) {
                var li = $("<li>"),
                    wrapper = $("<div>", { title: item.element.attr("title") });
                return item.disabled && this._addClass(li, null, "ui-state-disabled"), this._setText(wrapper, item.label), li.append(wrapper).appendTo(ul);
            },
            _setText: function (element, value) {
                value ? element.text(value) : element.html("&#160;");
            },
            _move: function (direction, event) {
                var item,
                    next = ".ui-menu-item";
                this.isOpen ? (item = this.menuItems.eq(this.focusIndex).parent("li")) : ((item = this.menuItems.eq(this.element[0].selectedIndex).parent("li")), (next += ":not(.ui-state-disabled)")),
                (next = "first" === direction || "last" === direction ? item["first" === direction ? "prevAll" : "nextAll"](next).eq(-1) : item[direction + "All"](next).eq(0)).length && this.menuInstance.focus(event, next);
            },
            _getSelectedItem: function () {
                return this.menuItems.eq(this.element[0].selectedIndex).parent("li");
            },
            _toggle: function (event) {
                this[this.isOpen ? "close" : "open"](event);
            },
            _setSelection: function () {
                var selection;
                this.range && (window.getSelection ? ((selection = window.getSelection()).removeAllRanges(), selection.addRange(this.range)) : this.range.select(), this.button.focus());
            },
            _documentClick: {
                mousedown: function (event) {
                    this.isOpen && ($(event.target).closest(".ui-selectmenu-menu, #" + $.ui.escapeSelector(this.ids.button)).length || this.close(event));
                },
            },
            _buttonEvents: {
                mousedown: function () {
                    var selection;
                    window.getSelection ? (selection = window.getSelection()).rangeCount && (this.range = selection.getRangeAt(0)) : (this.range = document.selection.createRange());
                },
                click: function (event) {
                    this._setSelection(), this._toggle(event);
                },
                keydown: function (event) {
                    var preventDefault = !0;
                    switch (event.keyCode) {
                        case $.ui.keyCode.TAB:
                        case $.ui.keyCode.ESCAPE:
                            this.close(event), (preventDefault = !1);
                            break;
                        case $.ui.keyCode.ENTER:
                            this.isOpen && this._selectFocusedItem(event);
                            break;
                        case $.ui.keyCode.UP:
                            event.altKey ? this._toggle(event) : this._move("prev", event);
                            break;
                        case $.ui.keyCode.DOWN:
                            event.altKey ? this._toggle(event) : this._move("next", event);
                            break;
                        case $.ui.keyCode.SPACE:
                            this.isOpen ? this._selectFocusedItem(event) : this._toggle(event);
                            break;
                        case $.ui.keyCode.LEFT:
                            this._move("prev", event);
                            break;
                        case $.ui.keyCode.RIGHT:
                            this._move("next", event);
                            break;
                        case $.ui.keyCode.HOME:
                        case $.ui.keyCode.PAGE_UP:
                            this._move("first", event);
                            break;
                        case $.ui.keyCode.END:
                        case $.ui.keyCode.PAGE_DOWN:
                            this._move("last", event);
                            break;
                        default:
                            this.menu.trigger(event), (preventDefault = !1);
                    }
                    preventDefault && event.preventDefault();
                },
            },
            _selectFocusedItem: function (event) {
                var item = this.menuItems.eq(this.focusIndex).parent("li");
                item.hasClass("ui-state-disabled") || this._select(item.data("ui-selectmenu-item"), event);
            },
            _select: function (item, event) {
                var oldIndex = this.element[0].selectedIndex;
                (this.element[0].selectedIndex = item.index),
                    this.buttonItem.replaceWith((this.buttonItem = this._renderButtonItem(item))),
                    this._setAria(item),
                    this._trigger("select", event, { item: item }),
                item.index !== oldIndex && this._trigger("change", event, { item: item }),
                    this.close(event);
            },
            _setAria: function (id) {
                id = this.menuItems.eq(id.index).attr("id");
                this.button.attr({ "aria-labelledby": id, "aria-activedescendant": id }), this.menu.attr("aria-activedescendant", id);
            },
            _setOption: function (key, value) {
                var icon;
                "icons" === key && ((icon = this.button.find("span.ui-icon")), this._removeClass(icon, null, this.options.icons.button)._addClass(icon, null, value.button)),
                    this._super(key, value),
                "appendTo" === key && this.menuWrap.appendTo(this._appendTo()),
                "disabled" === key &&
                (this.menuInstance.option("disabled", value),
                    this.button.attr("aria-disabled", value),
                    this._toggleClass(this.button, null, "ui-state-disabled", value),
                    this.element.prop("disabled", value),
                    value ? (this.button.attr("tabindex", -1), this.close()) : this.button.attr("tabindex", 0)),
                "width" === key && this._resizeButton();
            },
            _appendTo: function () {
                var element = this.options.appendTo;
                return (
                    ((element = element && (element.jquery || element.nodeType ? $(element) : this.document.find(element).eq(0))) && element[0]) || (element = this.element.closest(".ui-front, dialog")),
                    element.length || (element = this.document[0].body),
                        element
                );
            },
            _toggleAttr: function () {
                this.button.attr("aria-expanded", this.isOpen),
                    this._removeClass(this.button, "ui-selectmenu-button-" + (this.isOpen ? "closed" : "open"))
                        ._addClass(this.button, "ui-selectmenu-button-" + (this.isOpen ? "open" : "closed"))
                        ._toggleClass(this.menuWrap, "ui-selectmenu-open", null, this.isOpen),
                    this.menu.attr("aria-hidden", !this.isOpen);
            },
            _resizeButton: function () {
                var width = this.options.width;
                !1 !== width ? (null === width && ((width = this.element.show().outerWidth()), this.element.hide()), this.button.outerWidth(width)) : this.button.css("width", "");
            },
            _resizeMenu: function () {
                this.menu.outerWidth(Math.max(this.button.outerWidth(), this.menu.width("").outerWidth() + 1));
            },
            _getCreateOptions: function () {
                return { disabled: this.element.prop("disabled") };
            },
            _parseOptions: function (options) {
                var that = this,
                    data = [];
                options.each(function (index, item) {
                    data.push(that._parseOption($(item), index));
                }),
                    (this.items = data);
            },
            _parseOption: function (option, index) {
                var optgroup = option.parent("optgroup");
                return { element: option, index: index, value: option.val(), label: option.text(), optgroup: optgroup.attr("label") || "", disabled: optgroup.prop("disabled") || option.prop("disabled") };
            },
            _destroy: function () {
                this.menuWrap.remove(), this.button.remove(), this.element.show(), this.element.removeUniqueId(), this.labels.attr("for", this.ids.element);
            },
        });
    }),
    (function (factory) {
        "function" == typeof define && define.amd ? define(["jquery", "./core", "./mouse", "./widget"], factory) : factory(jQuery);
    })(function ($) {
        return $.widget("ui.slider", $.ui.mouse, {
            version: "@VERSION",
            widgetEventPrefix: "slide",
            options: {
                animate: !1,
                classes: { "ui-slider": "ui-corner-all", "ui-slider-handle": "ui-corner-all", "ui-slider-range": "ui-corner-all ui-widget-header" },
                distance: 0,
                max: 100,
                min: 0,
                orientation: "horizontal",
                range: !1,
                step: 1,
                value: 0,
                values: null,
                change: null,
                slide: null,
                start: null,
                stop: null,
            },
            numPages: 5,
            _create: function () {
                (this._keySliding = !1),
                    (this._mouseSliding = !1),
                    (this._animateOff = !0),
                    (this._handleIndex = null),
                    this._detectOrientation(),
                    this._mouseInit(),
                    this._calculateNewMax(),
                    this._addClass("ui-slider ui-slider-" + this.orientation, "ui-widget ui-widget-content"),
                    this._refresh(),
                    this._setOption("disabled", this.options.disabled),
                    (this._animateOff = !1);
            },
            _refresh: function () {
                this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue();
            },
            _createHandles: function () {
                var i,
                    options = this.options,
                    existingHandles = this.element.find(".ui-slider-handle"),
                    handles = [],
                    handleCount = (options.values && options.values.length) || 1;
                for (existingHandles.length > handleCount && (existingHandles.slice(handleCount).remove(), (existingHandles = existingHandles.slice(0, handleCount))), i = existingHandles.length; i < handleCount; i++)
                    handles.push("<span tabindex='0'></span>");
                (this.handles = existingHandles.add($(handles.join("")).appendTo(this.element))),
                    this._addClass(this.handles, "ui-slider-handle", "ui-state-default"),
                    (this.handle = this.handles.eq(0)),
                    this.handles.each(function (i) {
                        $(this).data("ui-slider-handle-index", i);
                    });
            },
            _createRange: function () {
                var options = this.options;
                options.range
                    ? (!0 === options.range &&
                    (options.values
                        ? options.values.length && 2 !== options.values.length
                            ? (options.values = [options.values[0], options.values[0]])
                            : $.isArray(options.values) && (options.values = options.values.slice(0))
                        : (options.values = [this._valueMin(), this._valueMin()])),
                        this.range && this.range.length
                            ? (this._removeClass(this.range, "ui-slider-range-min ui-slider-range-max"), this.range.css({ left: "", bottom: "" }))
                            : ((this.range = $("<div>").appendTo(this.element)), this._addClass(this.range, "ui-slider-range")),
                    ("min" !== options.range && "max" !== options.range) || this._addClass(this.range, "ui-slider-range-" + options.range))
                    : (this.range && this.range.remove(), (this.range = null));
            },
            _setupEvents: function () {
                this._off(this.handles), this._on(this.handles, this._handleEvents), this._hoverable(this.handles), this._focusable(this.handles);
            },
            _destroy: function () {
                this.handles.remove(), this.range && this.range.remove(), this._mouseDestroy();
            },
            _mouseCapture: function (event) {
                var normValue,
                    distance,
                    closestHandle,
                    index,
                    offset,
                    mouseOverHandle,
                    that = this,
                    o = this.options;
                return (
                    !o.disabled &&
                    ((this.elementSize = { width: this.element.outerWidth(), height: this.element.outerHeight() }),
                        (this.elementOffset = this.element.offset()),
                        (mouseOverHandle = { x: event.pageX, y: event.pageY }),
                        (normValue = this._normValueFromMouse(mouseOverHandle)),
                        (distance = this._valueMax() - this._valueMin() + 1),
                        this.handles.each(function (i) {
                            var thisDistance = Math.abs(normValue - that.values(i));
                            (thisDistance < distance || (distance === thisDistance && (i === that._lastChangedValue || that.values(i) === o.min))) && ((distance = thisDistance), (closestHandle = $(this)), (index = i));
                        }),
                    !1 !== this._start(event, index) &&
                    ((this._mouseSliding = !0),
                        (this._handleIndex = index),
                        this._addClass(closestHandle, null, "ui-state-active"),
                        closestHandle.trigger("focus"),
                        (offset = closestHandle.offset()),
                        (mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle")),
                        (this._clickOffset = mouseOverHandle
                            ? { left: 0, top: 0 }
                            : {
                                left: event.pageX - offset.left - closestHandle.width() / 2,
                                top:
                                    event.pageY -
                                    offset.top -
                                    closestHandle.height() / 2 -
                                    (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) -
                                    (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) +
                                    (parseInt(closestHandle.css("marginTop"), 10) || 0),
                            }),
                    this.handles.hasClass("ui-state-hover") || this._slide(event, index, normValue),
                        (this._animateOff = !0)))
                );
            },
            _mouseStart: function () {
                return !0;
            },
            _mouseDrag: function (event) {
                var normValue = { x: event.pageX, y: event.pageY },
                    normValue = this._normValueFromMouse(normValue);
                return this._slide(event, this._handleIndex, normValue), !1;
            },
            _mouseStop: function (event) {
                return (
                    this._removeClass(this.handles, null, "ui-state-active"),
                        (this._mouseSliding = !1),
                        this._stop(event, this._handleIndex),
                        this._change(event, this._handleIndex),
                        (this._handleIndex = null),
                        (this._clickOffset = null),
                        (this._animateOff = !1)
                );
            },
            _detectOrientation: function () {
                this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal";
            },
            _normValueFromMouse: function (percentMouse) {
                var valueMouse,
                    percentMouse =
                        "horizontal" === this.orientation
                            ? ((valueMouse = this.elementSize.width), percentMouse.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0))
                            : ((valueMouse = this.elementSize.height), percentMouse.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)),
                    percentMouse = percentMouse / valueMouse;
                return (
                    1 < percentMouse && (percentMouse = 1),
                    percentMouse < 0 && (percentMouse = 0),
                    "vertical" === this.orientation && (percentMouse = 1 - percentMouse),
                        (valueMouse = this._valueMax() - this._valueMin()),
                        (valueMouse = this._valueMin() + percentMouse * valueMouse),
                        this._trimAlignValue(valueMouse)
                );
            },
            _uiHash: function (index, value, values) {
                var uiHash = { handle: this.handles[index], handleIndex: index, value: void 0 !== value ? value : this.value() };
                return this._hasMultipleValues() && ((uiHash.value = void 0 !== value ? value : this.values(index)), (uiHash.values = values || this.values())), uiHash;
            },
            _hasMultipleValues: function () {
                return this.options.values && this.options.values.length;
            },
            _start: function (event, index) {
                return this._trigger("start", event, this._uiHash(index));
            },
            _slide: function (event, index, newVal) {
                var otherVal,
                    currentValue = this.value(),
                    newValues = this.values();
                this._hasMultipleValues() &&
                ((otherVal = this.values(index ? 0 : 1)),
                    (currentValue = this.values(index)),
                2 === this.options.values.length && !0 === this.options.range && (newVal = 0 === index ? Math.min(otherVal, newVal) : Math.max(otherVal, newVal)),
                    (newValues[index] = newVal)),
                newVal !== currentValue && !1 !== this._trigger("slide", event, this._uiHash(index, newVal, newValues)) && (this._hasMultipleValues() ? this.values(index, newVal) : this.value(newVal));
            },
            _stop: function (event, index) {
                this._trigger("stop", event, this._uiHash(index));
            },
            _change: function (event, index) {
                this._keySliding || this._mouseSliding || ((this._lastChangedValue = index), this._trigger("change", event, this._uiHash(index)));
            },
            value: function (newValue) {
                return arguments.length ? ((this.options.value = this._trimAlignValue(newValue)), this._refreshValue(), void this._change(null, 0)) : this._value();
            },
            values: function (index, newValue) {
                var vals, newValues, i;
                if (1 < arguments.length) return (this.options.values[index] = this._trimAlignValue(newValue)), this._refreshValue(), void this._change(null, index);
                if (!arguments.length) return this._values();
                if (!$.isArray(index)) return this._hasMultipleValues() ? this._values(index) : this.value();
                for (vals = this.options.values, newValues = index, i = 0; i < vals.length; i += 1) (vals[i] = this._trimAlignValue(newValues[i])), this._change(null, i);
                this._refreshValue();
            },
            _setOption: function (key, value) {
                var i,
                    valsLength = 0;
                switch (
                    ("range" === key &&
                    !0 === this.options.range &&
                    ("min" === value ? ((this.options.value = this._values(0)), (this.options.values = null)) : "max" === value && ((this.options.value = this._values(this.options.values.length - 1)), (this.options.values = null))),
                    $.isArray(this.options.values) && (valsLength = this.options.values.length),
                    "disabled" === key && this._toggleClass(null, "ui-state-disabled", !!value),
                        this._super(key, value),
                        key)
                    ) {
                    case "orientation":
                        this._detectOrientation(),
                            this._removeClass("ui-slider-horizontal ui-slider-vertical")._addClass("ui-slider-" + this.orientation),
                            this._refreshValue(),
                        this.options.range && this._refreshRange(value),
                            this.handles.css("horizontal" === value ? "bottom" : "left", "");
                        break;
                    case "value":
                        (this._animateOff = !0), this._refreshValue(), this._change(null, 0), (this._animateOff = !1);
                        break;
                    case "values":
                        for (this._animateOff = !0, this._refreshValue(), i = valsLength - 1; 0 <= i; i--) this._change(null, i);
                        this._animateOff = !1;
                        break;
                    case "step":
                    case "min":
                    case "max":
                        (this._animateOff = !0), this._calculateNewMax(), this._refreshValue(), (this._animateOff = !1);
                        break;
                    case "range":
                        (this._animateOff = !0), this._refresh(), (this._animateOff = !1);
                }
            },
            _value: function () {
                var val = this.options.value;
                return (val = this._trimAlignValue(val));
            },
            _values: function (index) {
                var val, vals, i;
                if (arguments.length) return (val = this.options.values[index]), this._trimAlignValue(val);
                if (this._hasMultipleValues()) {
                    for (vals = this.options.values.slice(), i = 0; i < vals.length; i += 1) vals[i] = this._trimAlignValue(vals[i]);
                    return vals;
                }
                return [];
            },
            _trimAlignValue: function (alignValue) {
                if (alignValue <= this._valueMin()) return this._valueMin();
                if (alignValue >= this._valueMax()) return this._valueMax();
                var step = 0 < this.options.step ? this.options.step : 1,
                    valModStep = (alignValue - this._valueMin()) % step,
                    alignValue = alignValue - valModStep;
                return 2 * Math.abs(valModStep) >= step && (alignValue += 0 < valModStep ? step : -step), parseFloat(alignValue.toFixed(5));
            },
            _calculateNewMax: function () {
                var max = this.options.max,
                    min = this._valueMin(),
                    step = this.options.step,
                    max = Math.floor(+(max - min).toFixed(this._precision()) / step) * step + min;
                this.max = parseFloat(max.toFixed(this._precision()));
            },
            _precision: function () {
                var precision = this._precisionOf(this.options.step);
                return null !== this.options.min && (precision = Math.max(precision, this._precisionOf(this.options.min))), precision;
            },
            _precisionOf: function (decimal) {
                var str = decimal.toString(),
                    decimal = str.indexOf(".");
                return -1 === decimal ? 0 : str.length - decimal - 1;
            },
            _valueMin: function () {
                return this.options.min;
            },
            _valueMax: function () {
                return this.max;
            },
            _refreshRange: function (orientation) {
                "vertical" === orientation && this.range.css({ width: "", left: "" }), "horizontal" === orientation && this.range.css({ height: "", bottom: "" });
            },
            _refreshValue: function () {
                var lastValPercent,
                    valPercent,
                    value,
                    valueMin,
                    valueMax,
                    oRange = this.options.range,
                    o = this.options,
                    that = this,
                    animate = !this._animateOff && o.animate,
                    _set = {};
                this._hasMultipleValues()
                    ? this.handles.each(function (i) {
                        (valPercent = ((that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin())) * 100),
                            (_set["horizontal" === that.orientation ? "left" : "bottom"] = valPercent + "%"),
                            $(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate),
                        !0 === that.options.range &&
                        ("horizontal" === that.orientation
                            ? (0 === i && that.range.stop(1, 1)[animate ? "animate" : "css"]({ left: valPercent + "%" }, o.animate),
                            1 === i && that.range[animate ? "animate" : "css"]({ width: valPercent - lastValPercent + "%" }, { queue: !1, duration: o.animate }))
                            : (0 === i && that.range.stop(1, 1)[animate ? "animate" : "css"]({ bottom: valPercent + "%" }, o.animate),
                            1 === i && that.range[animate ? "animate" : "css"]({ height: valPercent - lastValPercent + "%" }, { queue: !1, duration: o.animate }))),
                            (lastValPercent = valPercent);
                    })
                    : ((value = this.value()),
                        (valueMin = this._valueMin()),
                        (valueMax = this._valueMax()),
                        (valPercent = valueMax !== valueMin ? ((value - valueMin) / (valueMax - valueMin)) * 100 : 0),
                        (_set["horizontal" === this.orientation ? "left" : "bottom"] = valPercent + "%"),
                        this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate),
                    "min" === oRange && "horizontal" === this.orientation && this.range.stop(1, 1)[animate ? "animate" : "css"]({ width: valPercent + "%" }, o.animate),
                    "max" === oRange && "horizontal" === this.orientation && this.range.stop(1, 1)[animate ? "animate" : "css"]({ width: 100 - valPercent + "%" }, o.animate),
                    "min" === oRange && "vertical" === this.orientation && this.range.stop(1, 1)[animate ? "animate" : "css"]({ height: valPercent + "%" }, o.animate),
                    "max" === oRange && "vertical" === this.orientation && this.range.stop(1, 1)[animate ? "animate" : "css"]({ height: 100 - valPercent + "%" }, o.animate));
            },
            _handleEvents: {
                keydown: function (event) {
                    var curVal,
                        newVal,
                        step,
                        index = $(event.target).data("ui-slider-handle-index");
                    switch (event.keyCode) {
                        case $.ui.keyCode.HOME:
                        case $.ui.keyCode.END:
                        case $.ui.keyCode.PAGE_UP:
                        case $.ui.keyCode.PAGE_DOWN:
                        case $.ui.keyCode.UP:
                        case $.ui.keyCode.RIGHT:
                        case $.ui.keyCode.DOWN:
                        case $.ui.keyCode.LEFT:
                            if ((event.preventDefault(), !this._keySliding && ((this._keySliding = !0), this._addClass($(event.target), null, "ui-state-active"), !1 === this._start(event, index)))) return;
                    }
                    switch (((step = this.options.step), (curVal = newVal = this._hasMultipleValues() ? this.values(index) : this.value()), event.keyCode)) {
                        case $.ui.keyCode.HOME:
                            newVal = this._valueMin();
                            break;
                        case $.ui.keyCode.END:
                            newVal = this._valueMax();
                            break;
                        case $.ui.keyCode.PAGE_UP:
                            newVal = this._trimAlignValue(curVal + (this._valueMax() - this._valueMin()) / this.numPages);
                            break;
                        case $.ui.keyCode.PAGE_DOWN:
                            newVal = this._trimAlignValue(curVal - (this._valueMax() - this._valueMin()) / this.numPages);
                            break;
                        case $.ui.keyCode.UP:
                        case $.ui.keyCode.RIGHT:
                            if (curVal === this._valueMax()) return;
                            newVal = this._trimAlignValue(curVal + step);
                            break;
                        case $.ui.keyCode.DOWN:
                        case $.ui.keyCode.LEFT:
                            if (curVal === this._valueMin()) return;
                            newVal = this._trimAlignValue(curVal - step);
                    }
                    this._slide(event, index, newVal);
                },
                keyup: function (event) {
                    var index = $(event.target).data("ui-slider-handle-index");
                    this._keySliding && ((this._keySliding = !1), this._stop(event, index), this._change(event, index), this._removeClass($(event.target), null, "ui-state-active"));
                },
            },
        });
    }),
    (function ($) {
        var mouseProto, _mouseInit, _mouseDestroy, touchHandled;
        function simulateMouseEvent(event, simulatedType) {
            var touch, simulatedEvent;
            1 < event.originalEvent.touches.length ||
            (event.preventDefault(),
                (touch = event.originalEvent.changedTouches[0]),
                (simulatedEvent = document.createEvent("MouseEvents")).initMouseEvent(simulatedType, !0, !0, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, !1, !1, !1, !1, 0, null),
                event.target.dispatchEvent(simulatedEvent));
        }
        ($.support.touch = "ontouchend" in document),
        $.support.touch &&
        ((mouseProto = $.ui.mouse.prototype),
            (_mouseInit = mouseProto._mouseInit),
            (_mouseDestroy = mouseProto._mouseDestroy),
            (mouseProto._touchStart = function (event) {
                !touchHandled &&
                this._mouseCapture(event.originalEvent.changedTouches[0]) &&
                ((touchHandled = !0), (this._touchMoved = !1), simulateMouseEvent(event, "mouseover"), simulateMouseEvent(event, "mousemove"), simulateMouseEvent(event, "mousedown"));
            }),
            (mouseProto._touchMove = function (event) {
                touchHandled && ((this._touchMoved = !0), simulateMouseEvent(event, "mousemove"));
            }),
            (mouseProto._touchEnd = function (event) {
                touchHandled && (simulateMouseEvent(event, "mouseup"), simulateMouseEvent(event, "mouseout"), this._touchMoved || simulateMouseEvent(event, "click"), (touchHandled = !1));
            }),
            (mouseProto._mouseInit = function () {
                this.element.bind({ touchstart: $.proxy(this, "_touchStart"), touchmove: $.proxy(this, "_touchMove"), touchend: $.proxy(this, "_touchEnd") }), _mouseInit.call(this);
            }),
            (mouseProto._mouseDestroy = function () {
                this.element.unbind({ touchstart: $.proxy(this, "_touchStart"), touchmove: $.proxy(this, "_touchMove"), touchend: $.proxy(this, "_touchEnd") }), _mouseDestroy.call(this);
            }));
    })(jQuery),
    (function ($, document, window) {
        var $overlay,
            $box,
            $wrap,
            $content,
            $topBorder,
            $leftBorder,
            $rightBorder,
            $bottomBorder,
            $related,
            $window,
            $loaded,
            $loadingBay,
            $loadingOverlay,
            $title,
            $current,
            $slideshow,
            $next,
            $prev,
            $close,
            $groupControls,
            settings,
            interfaceHeight,
            interfaceWidth,
            loadedHeight,
            loadedWidth,
            index,
            photo,
            open,
            active,
            closing,
            loadingTimer,
            publicMethod,
            init,
            defaults = {
                html: !1,
                photo: !1,
                iframe: !1,
                inline: !1,
                transition: "elastic",
                speed: 300,
                fadeOut: 300,
                width: !1,
                initialWidth: "600",
                innerWidth: !1,
                maxWidth: !1,
                height: !1,
                initialHeight: "450",
                innerHeight: !1,
                maxHeight: !1,
                scalePhotos: !0,
                scrolling: !0,
                opacity: 0.9,
                preloading: !0,
                className: !1,
                overlayClose: !0,
                escKey: !0,
                arrowKey: !0,
                top: !1,
                bottom: !1,
                left: !1,
                right: !1,
                fixed: !1,
                data: void 0,
                closeButton: !0,
                fastIframe: !0,
                open: !1,
                reposition: !0,
                loop: !0,
                slideshow: !1,
                slideshowAuto: !0,
                slideshowSpeed: 2500,
                slideshowStart: "start slideshow",
                slideshowStop: "stop slideshow",
                photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
                retinaImage: !1,
                retinaUrl: !1,
                retinaSuffix: "@2x.$1",
                current: "image {current} of {total}",
                previous: "previous",
                next: "next",
                close: "close",
                xhrError: "This content failed to load.",
                imgError: "This image failed to load.",
                returnFocus: !0,
                trapFocus: !0,
                onOpen: !1,
                onLoad: !1,
                onComplete: !1,
                onCleanup: !1,
                onClosed: !1,
                rel: function () {
                    return this.rel;
                },
                href: function () {
                    return $(this).attr("href");
                },
                title: function () {
                    return this.title;
                },
                createImg: function () {
                    var img = new Image(),
                        attrs = $(this).data("cbox-img-attrs");
                    return (
                        "object" == typeof attrs &&
                        $.each(attrs, function (key, val) {
                            img[key] = val;
                        }),
                            img
                    );
                },
                createIframe: function () {
                    var iframe = document.createElement("iframe"),
                        attrs = $(this).data("cbox-iframe-attrs");
                    return (
                        "object" == typeof attrs &&
                        $.each(attrs, function (key, val) {
                            iframe[key] = val;
                        }),
                        "frameBorder" in iframe && (iframe.frameBorder = 0),
                        "allowTransparency" in iframe && (iframe.allowTransparency = "true"),
                            (iframe.name = new Date().getTime()),
                            (iframe.allowFullscreen = !0),
                            iframe
                    );
                },
            },
            colorbox = "colorbox",
            prefix = "cbox",
            boxElement = prefix + "Element",
            event_open = prefix + "_open",
            event_load = prefix + "_load",
            event_complete = prefix + "_complete",
            event_cleanup = prefix + "_cleanup",
            event_closed = prefix + "_closed",
            event_purge = prefix + "_purge",
            $events = $("<a/>"),
            div = "div",
            requests = 0,
            previousCSS = {};
        function $tag(element, id, css) {
            element = document.createElement(element);
            return id && (element.id = prefix + id), css && (element.style.cssText = css), $(element);
        }
        function winheight() {
            return window.innerHeight || $(window).height();
        }
        function Settings(element, options) {
            options !== Object(options) && (options = {}),
                (this.cache = {}),
                (this.el = element),
                (this.value = function (key) {
                    var dataAttr;
                    return (
                        void 0 === this.cache[key] &&
                        (void 0 !== (dataAttr = $(this.el).attr("data-cbox-" + key))
                            ? (this.cache[key] = dataAttr)
                            : void 0 !== options[key]
                                ? (this.cache[key] = options[key])
                                : void 0 !== defaults[key] && (this.cache[key] = defaults[key])),
                            this.cache[key]
                    );
                }),
                (this.get = function (value) {
                    value = this.value(value);
                    return $.isFunction(value) ? value.call(this.el, this) : value;
                });
        }
        function getIndex(newIndex) {
            var max = $related.length,
                newIndex = (index + newIndex) % max;
            return newIndex < 0 ? max + newIndex : newIndex;
        }
        function setSize(size, dimension) {
            return Math.round((/%/.test(size) ? ("x" === dimension ? $window.width() : winheight()) / 100 : 1) * parseInt(size, 10));
        }
        function isImage(settings, url) {
            return settings.get("photo") || settings.get("photoRegex").test(url);
        }
        function retinaUrl(settings, url) {
            return settings.get("retinaUrl") && 1 < window.devicePixelRatio ? url.replace(settings.get("photoRegex"), settings.get("retinaSuffix")) : url;
        }
        function trapFocus(e) {
            "contains" in $box[0] && !$box[0].contains(e.target) && e.target !== $overlay[0] && (e.stopPropagation(), $box.focus());
        }
        function setClass(str) {
            setClass.str !== str && ($box.add($overlay).removeClass(setClass.str).addClass(str), (setClass.str = str));
        }
        function trigger(event) {
            $(document).trigger(event), $events.triggerHandler(event);
        }
        var slideshow = (function () {
            var active,
                timeOut,
                className = prefix + "Slideshow_",
                click = "click." + prefix;
            function clear() {
                clearTimeout(timeOut);
            }
            function set() {
                (settings.get("loop") || $related[index + 1]) && (clear(), (timeOut = setTimeout(publicMethod.next, settings.get("slideshowSpeed"))));
            }
            function start() {
                $slideshow.html(settings.get("slideshowStop")).unbind(click).one(click, stop), $events.bind(event_complete, set).bind(event_load, clear), $box.removeClass(className + "off").addClass(className + "on");
            }
            function stop() {
                clear(),
                    $events.unbind(event_complete, set).unbind(event_load, clear),
                    $slideshow
                        .html(settings.get("slideshowStart"))
                        .unbind(click)
                        .one(click, function () {
                            publicMethod.next(), start();
                        }),
                    $box.removeClass(className + "on").addClass(className + "off");
            }
            function reset() {
                (active = !1), $slideshow.hide(), clear(), $events.unbind(event_complete, set).unbind(event_load, clear), $box.removeClass(className + "off " + className + "on");
            }
            return function () {
                active
                    ? settings.get("slideshow") || ($events.unbind(event_cleanup, reset), reset())
                    : settings.get("slideshow") && $related[1] && ((active = !0), $events.one(event_cleanup, reset), (settings.get("slideshowAuto") ? start : stop)(), $slideshow.show());
            };
        })();
        function launch(maxWidth) {
            var initialWidth, maxHeight, opacity, rel;
            closing ||
            ((maxHeight = $(maxWidth).data(colorbox)),
                (settings = new Settings(maxWidth, maxHeight)),
                (rel = settings.get("rel")),
                (index = 0),
                rel && !1 !== rel && "nofollow" !== rel
                    ? (($related = $("." + boxElement).filter(function () {
                        return new Settings(this, $.data(this, colorbox)).get("rel") === rel;
                    })),
                    -1 === (index = $related.index(settings.el)) && (($related = $related.add(settings.el)), (index = $related.length - 1)))
                    : ($related = $(settings.el)),
            open ||
            ((open = active = !0),
                setClass(settings.get("className")),
                $box.css({ visibility: "hidden", display: "block", opacity: "" }),
                ($loaded = $tag(div, "LoadedContent", "width:0; height:0; overflow:hidden; visibility:hidden")),
                $content.css({ width: "", height: "" }).append($loaded),
                (interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(!0) - $content.height()),
                (interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(!0) - $content.width()),
                (loadedHeight = $loaded.outerHeight(!0)),
                (loadedWidth = $loaded.outerWidth(!0)),
                (initialWidth = setSize(settings.get("initialWidth"), "x")),
                (opacity = setSize(settings.get("initialHeight"), "y")),
                (maxWidth = settings.get("maxWidth")),
                (maxHeight = settings.get("maxHeight")),
                (settings.w = Math.max((!1 !== maxWidth ? Math.min(initialWidth, setSize(maxWidth, "x")) : initialWidth) - loadedWidth - interfaceWidth, 0)),
                (settings.h = Math.max((!1 !== maxHeight ? Math.min(opacity, setSize(maxHeight, "y")) : opacity) - loadedHeight - interfaceHeight, 0)),
                $loaded.css({ width: "", height: settings.h }),
                publicMethod.position(),
                trigger(event_open),
                settings.get("onOpen"),
                $groupControls.add($title).hide(),
                $box.focus(),
            settings.get("trapFocus") &&
            document.addEventListener &&
            (document.addEventListener("focus", trapFocus, !0),
                $events.one(event_closed, function () {
                    document.removeEventListener("focus", trapFocus, !0);
                })),
            settings.get("returnFocus") &&
            $events.one(event_closed, function () {
                $(settings.el).focus();
            })),
                (opacity = parseFloat(settings.get("opacity"))),
                $overlay.css({ opacity: opacity == opacity ? opacity : "", cursor: settings.get("overlayClose") ? "pointer" : "", visibility: "visible" }).show(),
                settings.get("closeButton") ? $close.html(settings.get("close")).appendTo($content) : $close.appendTo("<div/>"),
                (function () {
                    var href,
                        setResize,
                        $inline,
                        prep = publicMethod.prep,
                        request = ++requests;
                    (photo = !(active = !0)),
                        trigger(event_purge),
                        trigger(event_load),
                        settings.get("onLoad"),
                        (settings.h = settings.get("height") ? setSize(settings.get("height"), "y") - loadedHeight - interfaceHeight : settings.get("innerHeight") && setSize(settings.get("innerHeight"), "y")),
                        (settings.w = settings.get("width") ? setSize(settings.get("width"), "x") - loadedWidth - interfaceWidth : settings.get("innerWidth") && setSize(settings.get("innerWidth"), "x")),
                        (settings.mw = settings.w),
                        (settings.mh = settings.h),
                    settings.get("maxWidth") && ((settings.mw = setSize(settings.get("maxWidth"), "x") - loadedWidth - interfaceWidth), (settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw));
                    settings.get("maxHeight") && ((settings.mh = setSize(settings.get("maxHeight"), "y") - loadedHeight - interfaceHeight), (settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh));
                    {
                        var $target;
                        (href = settings.get("href")),
                            (loadingTimer = setTimeout(function () {
                                $loadingOverlay.show();
                            }, 100)),
                            settings.get("inline")
                                ? (($target = $(href)),
                                    ($inline = $("<div>").hide().insertBefore($target)),
                                    $events.one(event_purge, function () {
                                        $inline.replaceWith($target);
                                    }),
                                    prep($target))
                                : settings.get("iframe")
                                    ? prep(" ")
                                    : settings.get("html")
                                        ? prep(settings.get("html"))
                                        : isImage(settings, href)
                                            ? ((href = retinaUrl(settings, href)),
                                                (photo = settings.get("createImg")),
                                                $(photo)
                                                    .addClass(prefix + "Photo")
                                                    .bind("error." + prefix, function () {
                                                        prep($tag(div, "Error").html(settings.get("imgError")));
                                                    })
                                                    .one("load", function () {
                                                        request === requests &&
                                                        setTimeout(function () {
                                                            var percent;
                                                            settings.get("retinaImage") && 1 < window.devicePixelRatio && ((photo.height = photo.height / window.devicePixelRatio), (photo.width = photo.width / window.devicePixelRatio)),
                                                            settings.get("scalePhotos") &&
                                                            ((setResize = function () {
                                                                (photo.height -= photo.height * percent), (photo.width -= photo.width * percent);
                                                            }),
                                                            settings.mw && photo.width > settings.mw && ((percent = (photo.width - settings.mw) / photo.width), setResize()),
                                                            settings.mh && photo.height > settings.mh && ((percent = (photo.height - settings.mh) / photo.height), setResize())),
                                                            settings.h && (photo.style.marginTop = Math.max(settings.mh - photo.height, 0) / 2 + "px"),
                                                            $related[1] &&
                                                            (settings.get("loop") || $related[index + 1]) &&
                                                            ((photo.style.cursor = "pointer"),
                                                                $(photo).bind("click." + prefix, function () {
                                                                    publicMethod.next();
                                                                })),
                                                                (photo.style.width = photo.width + "px"),
                                                                (photo.style.height = photo.height + "px"),
                                                                prep(photo);
                                                        }, 1);
                                                    }),
                                                (photo.src = href))
                                            : href &&
                                            ($.ajaxSetup({ headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" } }),
                                                $loadingBay.load(href, settings.get("data"), function (data, status) {
                                                    request === requests && prep("error" === status ? $tag(div, "Error").html(settings.get("xhrError")) : $(this).contents());
                                                }),
                                                delete $.ajaxSettings.headers["X-Shoptet-XHR"]);
                    }
                })());
        }
        function appendHTML() {
            $box ||
            ((init = !1),
                ($window = $(window)),
                ($box = $tag(div)
                    .attr({ id: colorbox, class: !1 === $.support.opacity ? prefix + "IE" : "", role: "dialog", tabindex: "-1" })
                    .hide()),
                ($overlay = $tag(div, "Overlay").hide()),
                ($loadingOverlay = $([$tag(div, "LoadingOverlay")[0], $tag(div, "LoadingGraphic")[0]])),
                ($wrap = $tag(div, "Wrapper")),
                ($content = $tag(div, "Content").append(
                    ($title = $tag(div, "Title")),
                    ($current = $tag(div, "Current")),
                    ($prev = $('<button type="button"/>').attr({ id: prefix + "Previous" })),
                    ($next = $('<button type="button"/>').attr({ id: prefix + "Next" })),
                    ($slideshow = $tag("button", "Slideshow")),
                    $loadingOverlay
                )),
                ($close = $('<button type="button"/>').attr({ id: prefix + "Close" })),
                $wrap
                    .append(
                        $tag(div).append($tag(div, "TopLeft"), ($topBorder = $tag(div, "TopCenter")), $tag(div, "TopRight")),
                        $tag(div, !1, "clear:left").append(($leftBorder = $tag(div, "MiddleLeft")), $content, ($rightBorder = $tag(div, "MiddleRight"))),
                        $tag(div, !1, "clear:left").append($tag(div, "BottomLeft"), ($bottomBorder = $tag(div, "BottomCenter")), $tag(div, "BottomRight"))
                    )
                    .find("div div")
                    .css({ float: "left" }),
                ($loadingBay = $tag(div, !1, "position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;")),
                ($groupControls = $next.add($prev).add($current).add($slideshow))),
            document.body && !$box.parent().length && $(document.body).append($overlay, $box.append($wrap, $loadingBay));
        }
        function addBindings() {
            function clickHandler(e) {
                1 < e.which || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey || (e.preventDefault(), launch(this));
            }
            return (
                $box &&
                (init ||
                ((init = !0),
                    $next.click(function () {
                        publicMethod.next();
                    }),
                    $prev.click(function () {
                        publicMethod.prev();
                    }),
                    $close.click(function () {
                        publicMethod.close();
                    }),
                    $overlay.click(function () {
                        settings.get("overlayClose") && publicMethod.close();
                    }),
                    $(document).bind("keydown." + prefix, function (e) {
                        var key = e.keyCode;
                        open && settings.get("escKey") && 27 === key && (e.preventDefault(), publicMethod.close()),
                        open && settings.get("arrowKey") && $related[1] && !e.altKey && (37 === key ? (e.preventDefault(), $prev.click()) : 39 === key && (e.preventDefault(), $next.click()));
                    }),
                    $.isFunction($.fn.on) ? $(document).on("click." + prefix, "." + boxElement, clickHandler) : $("." + boxElement).live("click." + prefix, clickHandler)),
                    1)
            );
        }
        $[colorbox] ||
        ($(appendHTML),
            ((publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
                var $obj = this;
                return (
                    (options = options || {}),
                    $.isFunction($obj) && (($obj = $("<a/>")), (options.open = !0)),
                    $obj[0] &&
                    (appendHTML(),
                    addBindings() &&
                    (callback && (options.onComplete = callback),
                        $obj
                            .each(function () {
                                var old = $.data(this, colorbox) || {};
                                $.data(this, colorbox, $.extend(old, options));
                            })
                            .addClass(boxElement),
                    new Settings($obj[0], options).get("open") && launch($obj[0]))),
                        $obj
                );
            }).position = function (speed, loadedCallback) {
                var css,
                    scrollTop,
                    scrollLeft,
                    tempSpeed,
                    top = 0,
                    left = 0,
                    offset = $box.offset();
                function modalDimensions() {
                    ($topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = parseInt($box[0].style.width, 10) - interfaceWidth + "px"),
                        ($content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = parseInt($box[0].style.height, 10) - interfaceHeight + "px");
                }
                $window.unbind("resize." + prefix),
                    $box.css({ top: -9e4, left: -9e4 }),
                    (scrollTop = $window.scrollTop()),
                    (scrollLeft = $window.scrollLeft()),
                    settings.get("fixed") ? ((offset.top -= scrollTop), (offset.left -= scrollLeft), $box.css({ position: "fixed" })) : ((top = scrollTop), (left = scrollLeft), $box.css({ position: "absolute" })),
                    !1 !== settings.get("right")
                        ? (left += Math.max($window.width() - settings.w - loadedWidth - interfaceWidth - setSize(settings.get("right"), "x"), 0))
                        : !1 !== settings.get("left")
                            ? (left += setSize(settings.get("left"), "x"))
                            : (left += Math.round(Math.max($window.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2)),
                    !1 !== settings.get("bottom")
                        ? (top += Math.max(winheight() - settings.h - loadedHeight - interfaceHeight - setSize(settings.get("bottom"), "y"), 0))
                        : !1 !== settings.get("top")
                            ? (top += setSize(settings.get("top"), "y"))
                            : (top += Math.round(Math.max(winheight() - settings.h - loadedHeight - interfaceHeight, 0) / 2)),
                    $box.css({ top: offset.top, left: offset.left, visibility: "visible" }),
                    ($wrap[0].style.width = $wrap[0].style.height = "9999px"),
                    (css = { width: settings.w + loadedWidth + interfaceWidth, height: settings.h + loadedHeight + interfaceHeight, top: top, left: left }),
                speed &&
                ((tempSpeed = 0),
                    $.each(css, function (i) {
                        css[i] !== previousCSS[i] && (tempSpeed = speed);
                    }),
                    (speed = tempSpeed)),
                    (previousCSS = css),
                speed || $box.css(css),
                    $box.dequeue().animate(css, {
                        duration: speed || 0,
                        complete: function () {
                            modalDimensions(),
                                (active = !1),
                                ($wrap[0].style.width = settings.w + loadedWidth + interfaceWidth + "px"),
                                ($wrap[0].style.height = settings.h + loadedHeight + interfaceHeight + "px"),
                            settings.get("reposition") &&
                            setTimeout(function () {
                                $window.bind("resize." + prefix, publicMethod.position);
                            }, 1),
                            $.isFunction(loadedCallback) && loadedCallback();
                        },
                        step: modalDimensions,
                    });
            }),
            (publicMethod.resize = function (options) {
                var scrolltop;
                open &&
                ((options = options || {}).width && (settings.w = setSize(options.width, "x") - loadedWidth - interfaceWidth),
                options.innerWidth && (settings.w = setSize(options.innerWidth, "x")),
                    $loaded.css({ width: settings.w }),
                options.height && (settings.h = setSize(options.height, "y") - loadedHeight - interfaceHeight),
                options.innerHeight && (settings.h = setSize(options.innerHeight, "y")),
                options.innerHeight || options.height || ((scrolltop = $loaded.scrollTop()), $loaded.css({ height: "auto" }), (settings.h = $loaded.height())),
                    $loaded.css({ height: settings.h }),
                scrolltop && $loaded.scrollTop(scrolltop),
                    publicMethod.position("none" === settings.get("transition") ? 0 : settings.get("speed")));
            }),
            (publicMethod.prep = function (object) {
                var callback, speed;
                open &&
                ((speed = "none" === settings.get("transition") ? 0 : settings.get("speed")),
                    $loaded.remove(),
                    ($loaded = $tag(div, "LoadedContent").append(object))
                        .hide()
                        .appendTo($loadingBay.show())
                        .css({ width: ((settings.w = settings.w || $loaded.width()), (settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w), settings.w), overflow: settings.get("scrolling") ? "auto" : "hidden" })
                        .css({ height: ((settings.h = settings.h || $loaded.height()), (settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h), settings.h) })
                        .prependTo($content),
                    $loadingBay.hide(),
                    $(photo).css({ float: "none" }),
                    setClass(settings.get("className")),
                    (callback = function () {
                        var iframe,
                            complete,
                            total = $related.length;
                        function removeFilter() {
                            !1 === $.support.opacity && $box[0].style.removeAttribute("filter");
                        }
                        open &&
                        ((complete = function () {
                            clearTimeout(loadingTimer), $loadingOverlay.hide(), trigger(event_complete), settings.get("onComplete");
                        }),
                            $title.html(settings.get("title")).show(),
                            $loaded.show(),
                            1 < total
                                ? ("string" == typeof settings.get("current") &&
                                $current
                                    .html(
                                        settings
                                            .get("current")
                                            .replace("{current}", index + 1)
                                            .replace("{total}", total)
                                    )
                                    .show(),
                                    $next[settings.get("loop") || index < total - 1 ? "show" : "hide"]().html(settings.get("next")),
                                    $prev[settings.get("loop") || index ? "show" : "hide"]().html(settings.get("previous")),
                                    slideshow(),
                                settings.get("preloading") &&
                                $.each([getIndex(-1), getIndex(1)], function () {
                                    var src = $related[this],
                                        settings = new Settings(src, $.data(src, colorbox)),
                                        src = settings.get("href");
                                    src && isImage(settings, src) && ((src = retinaUrl(settings, src)), (document.createElement("img").src = src));
                                }))
                                : $groupControls.hide(),
                            settings.get("iframe")
                                ? ((iframe = settings.get("createIframe")),
                                settings.get("scrolling") || (iframe.scrolling = "no"),
                                    $(iframe)
                                        .attr({ src: settings.get("href"), class: prefix + "Iframe" })
                                        .one("load", complete)
                                        .appendTo($loaded),
                                    $events.one(event_purge, function () {
                                        iframe.src = "//about:blank";
                                    }),
                                settings.get("fastIframe") && $(iframe).trigger("load"))
                                : complete(),
                            "fade" === settings.get("transition") ? $box.fadeTo(speed, 1, removeFilter) : removeFilter());
                    }),
                    "fade" === settings.get("transition")
                        ? $box.fadeTo(speed, 0, function () {
                            publicMethod.position(0, callback);
                        })
                        : publicMethod.position(speed, callback));
            }),
            (publicMethod.next = function () {
                !active && $related[1] && (settings.get("loop") || $related[index + 1]) && ((index = getIndex(1)), launch($related[index]));
            }),
            (publicMethod.prev = function () {
                !active && $related[1] && (settings.get("loop") || index) && ((index = getIndex(-1)), launch($related[index]));
            }),
            (publicMethod.close = function () {
                open &&
                !closing &&
                ((open = !(closing = !0)),
                    trigger(event_cleanup),
                    settings.get("onCleanup"),
                    $window.unbind("." + prefix),
                    $overlay.fadeTo(settings.get("fadeOut") || 0, 0),
                    $box.stop().fadeTo(settings.get("fadeOut") || 0, 0, function () {
                        $box.hide(),
                            $overlay.hide(),
                            trigger(event_purge),
                            $loaded.remove(),
                            setTimeout(function () {
                                (closing = !1), trigger(event_closed), settings.get("onClosed");
                            }, 1);
                    }));
            }),
            (publicMethod.remove = function () {
                $box &&
                ($box.stop(),
                    $[colorbox].close(),
                    $box.stop(!1, !0).remove(),
                    $overlay.remove(),
                    (closing = !1),
                    ($box = null),
                    $("." + boxElement)
                        .removeData(colorbox)
                        .removeClass(boxElement),
                    $(document)
                        .unbind("click." + prefix)
                        .unbind("keydown." + prefix));
            }),
            (publicMethod.element = function () {
                return $(settings.el);
            }),
            (publicMethod.settings = defaults));
    })(jQuery, document, window),
    (function (shoptet) {
        function applyFunction(fn, args) {
            var namespace = "";
            void 0 !== fn.prototype.shoptetNamespace && (namespace = fn.prototype.shoptetNamespace), "object" != typeof args && (args = []);
            try {
                handleFunctionCall(fn, args, namespace);
                var returnValue = fn.apply(null, args);
                return handleFunctionCallback(fn, args, namespace), returnValue;
            } catch (e) {
                console.log("%cFunction " + namespace + fn.name + " was not applied.", shoptet.dev.config.log.styles.error), console.log("%cException:", shoptet.dev.config.log.styles.error), console.log(e);
            }
        }
        function handleFunctionCall(fn, args, namespace) {
            var event = new CustomEvent(namespace + fn.name);
            (shoptet.scripts.arguments[namespace + fn.name] = args), document.dispatchEvent(event);
        }
        function handleFunctionCallback(fnToApply, args, namespace) {
            fnToApply = shoptet.scripts.customCallbacks[namespace + fnToApply.name];
            "function" == typeof fnToApply && fnToApply(args);
        }
        function setCustomCallback(fnName, customCallback) {
            var fn = eval(fnName),
                previousCallback;
            "function" == typeof fn &&
            "function" == typeof customCallback &&
            ((previousCallback = function () {}),
            "function" == typeof shoptet.scripts.customCallbacks[fnName] && (previousCallback = shoptet.scripts.customCallbacks[fnName]),
                (shoptet.scripts.customCallbacks[fnName] = function (args) {
                    previousCallback(args), customCallback(args);
                }));
        }
        function setCustomFunction(fnName, fn) {
            var previousCallback;
            "function" == typeof fn &&
            "function" == typeof shoptet.custom[fnName] &&
            ((previousCallback = shoptet.custom[fnName]),
                (shoptet.custom[fnName] = function (el, returnValue) {
                    var originalReturnValue = previousCallback(el, returnValue),
                        returnValue = fn(el, returnValue);
                    return !(!1 === originalReturnValue || !1 === returnValue);
                }));
        }
        function signal(event, element, eventSource, globalEvent) {
            (void 0 !== element && element) || (element = document);
            try {
                return null !== eventSource && -1 === eventSource.indexOf(event)
                    ? !1
                    : (globalEvent && ((ev = new CustomEvent(globalEvent, { bubbles: !0 })), element.dispatchEvent(ev)),
                        (ev = new CustomEvent(event, { bubbles: !0 })),
                        element.dispatchEvent(ev),
                    shoptet.dev.config.monitorEvents &&
                    (globalEvent && console.log('%cEvent "' + globalEvent + '" was dispatched.', shoptet.dev.config.log.styles.success),
                        console.log('%cEvent "' + event + '" was dispatched.', shoptet.dev.config.log.styles.success),
                        console.log("%cElement on which the event was dispatched: ", shoptet.dev.config.log.styles.success),
                        console.log(element)),
                        !0);
                var ev;
            } catch (e) {
                console.log('%cEvent "' + event + '" was not dispatched.', shoptet.dev.config.log.styles.error),
                    console.log("%cElement on which the event should be dispatched: ", shoptet.dev.config.log.styles.error),
                    console.log(element),
                    console.log("%cException:", shoptet.dev.config.log.styles.error),
                    console.log(e);
            }
        }
        function signalDomLoad(event, element) {
            signal(event, element, shoptet.scripts.availableDOMLoadEvents, "ShoptetDOMContentLoaded");
        }
        function signalDomUpdate(event, element) {
            signal(event, element, shoptet.scripts.availableDOMUpdateEvents, "ShoptetDOMContentChanged");
        }
        function signalCustomEvent(event, element) {
            signal(event, element, shoptet.scripts.availableCustomEvents, !1);
        }
        function signalNativeEvent(event, element) {
            signal(event, element, null, !1);
        }
        function registerFunction(fn, lib) {
            (fn.prototype.shoptetNamespace = "shoptet." + lib + "."),
                (shoptet[lib][fn.name] = function () {
                    return shoptet.scripts.applyFunction(fn, arguments);
                });
        }
        for (var key in (!function () {}.name &&
        Object.defineProperty(Function.prototype, "name", {
            get: function () {
                var name = (this.toString().match(/^function\s*([^\s(]+)/) || [])[1];
                return Object.defineProperty(this, "name", { value: name }), name;
            },
        }),
            (shoptet.scripts = shoptet.scripts || {}),
            (shoptet.scripts.arguments = {}),
            (shoptet.scripts.monitoredFunctions = []),
            (shoptet.scripts.availableDOMLoadEvents = [
                "ShoptetDOMContentLoaded",
                "ShoptetDOMRegisterFormLoaded",
                "ShoptetDOMCartContentLoaded",
                "ShoptetDOMAdvancedOrderLoaded",
                "ShoptetDOMPageContentLoaded",
                "ShoptetDOMPageMoreProductsLoaded",
            ]),
            (shoptet.scripts.availableDOMUpdateEvents = ["ShoptetDOMCartCountUpdated"]),
            (shoptet.scripts.availableCustomEvents = [
                "ShoptetPhoneCodeChange",
                "ShoptetPhoneCodeActive",
                "ShoptetBillZipPatternChange",
                "ShoptetDeliveryZipPatternChange",
                "ShoptetCompanyIdPatternChange",
                "ShoptetSelectedParametersReset",
                "ShoptetSplitVariantParameterChange",
                "ShoptetSimpleVariantChange",
                "ShoptetVariantAvailable",
                "ShoptetVariantUnavailable",
                "ShoptetCartSetCartItemAmount",
                "ShoptetCartAddCartItem",
                "ShoptetCartAddCartItemFailed",
                "ShoptetCartDeleteCartItem",
                "ShoptetCartSetSelectedGift",
                "ShoptetCartAddDiscountCoupon",
                "ShoptetCartUpdated",
                "validatedFormSubmit",
                "ShoptetPagePaginationUsed",
                "ShoptetPageSortingChanged",
                "ShoptetPageFiltersRecalledFromHistory",
                "ShoptetPagePriceFilterChange",
                "ShoptetPageFilterValueChange",
                "ShoptetPageFiltersCleared",
                "ShoptetPageMoreProductsRequested",
                "ShoptetSuccessfulValidation",
                "ShoptetFailedValidation",
                "ShoptetProductsTracked",
                "ShoptetFacebookPixelTracked",
                "ShoptetGoogleCartTracked",
                "ShoptetGoogleProductDetailTracked",
                "ShoptetDataLayerUpdated",
                "ShoptetValidationTransform",
                "ShoptetValidationWarning",
                "ShoptetValidationError",
                "ShoptetBaseShippingInfoObtained",
                "ShoptetShippingMethodUpdated",
                "ShoptetBillingMethodUpdated",
                "ShoptetSurchargesPriceUpdated",
            ]),
            (shoptet.scripts.libs = {
                cart: ["updateCartButton", "getCartContent", "getAdvancedOrder", "functionsForCart", "functionsForStep1", "handleCartPostUpdate", "ajaxSubmitForm", "updateQuantityInCart", "removeItemFromCart", "toggleRelatedProducts"],
                cartShared: ["addToCart", "removeFromCart", "updateQuantityInCart"],
                cookie: ["get", "create"],
                consent: ["get", "set", "isSet", "isAccepted", "onAccept", "openCookiesSettingModal", "cookiesConsentSubmit"],
                checkout: ["toggleAnotherShipping"],
                checkoutShared: [
                    "displaySelectedPriceByShippingBillingMethods",
                    "callShippingBillingRelations",
                    "changePaymentRelations",
                    "replacingChosenShippingAndBilling",
                    "setActiveShippingAndPayments",
                    "checkIsSelectedActive",
                    "payu",
                    "getStatedValues",
                    "setFieldValues",
                    "displayApplePay",
                    "updatePrice",
                    "getPriceFromElement",
                    "updatePriceSummary",
                    "afterPriceChange",
                    "setExternalShippingMethod",
                    "getDefaultShippingInfo",
                    "setTimeoutForExpiration",
                    "setupExternalShipping",
                    "handleExternalShippingLinks",
                    "setupDeliveryShipping",
                    "chooseABranchModal",
                    "modalMagic",
                    "initBranchSelect",
                ],
                validator: ["initNewValidator", "formContainsInvalidFields", "handleValidators", "getExistingMessage", "removeErrorMessage", "addErrorMessage"],
                validatorRequired: ["validateRequiredField"],
                validatorPhone: ["validateNumber"],
                validatorZipCode: ["validateZipCode", "updateZipValidPattern"],
                validatorCompanyId: ["validateCompanyId", "updateCompanyIdValidPattern"],
                global: ["showPopupWindow", "hideContentWindows", "updateSelectedRegions", "toggleRegionsWrapper", "restoreDefaultRegionSelect"],
                helpers: [
                    "toFloat",
                    "toLocaleFloat",
                    "resolveDecimalSeparator",
                    "resolveThousandSeparator",
                    "resolveDecimalPlaces",
                    "resolveCurrencySymbol",
                    "resolveCurrencySymbolPosition",
                    "formatNumber",
                    "formatAsCurrency",
                    "resolveMinimumAmount",
                    "updateQuantity",
                    "isTouchDevice",
                    "getFunctionFromString",
                    "loadDataAttributes",
                ],
                products: [
                    "splitWidgetParameters",
                    "splitSingleWidgetParameter",
                    "replaceImage",
                    "highlightActiveThumbnail",
                    "browseProducts",
                    "setThumbnailsDirection",
                    "setThumbnails",
                    "checkThumbnailsAction",
                    "checkThumbnails",
                    "switchThumbnails",
                    "checkDiscountFlag",
                    "changeStyle",
                    "setStyle",
                    "returnStyle",
                    "sameHeightOfProductsLoop",
                    "setHeightOfBigProduct",
                    "sameHeightOfProducts",
                    "unveilProductVideoTab",
                    "changeQuantity",
                ],
                menu: ["toggleMenu", "splitMenu", "splitHelperMenu", "showMenuHelper", "hideMenuHelper", "showSubmenu", "hideSubmenu", "updateMenu", "hideNavigation"],
                variantsCommon: ["disableAddingToCart", "enableAddingToCart", "hasToDisableCartButton", "handleSubmit", "handleBrowserValueRestoration", "updateQuantityTooltips", "hideQuantityTooltips"],
                variantsSimple: ["handler", "switcher"],
                variantsSplit: ["handler", "getData", "showVariantDependent"],
                surcharges: ["initSurcharges", "updatePrices", "getSurchargePrices", "writePrices"],
                variantsUnavailable: [
                    "setupAllParameters",
                    "attachEventListeners",
                    "getAvailableCombinations",
                    "getSelected",
                    "getExistingOptions",
                    "getUnavailableOptgroup",
                    "handleOptions",
                    "getOption",
                    "moveOptionFromUnavailable",
                    "areUnavailableOptionsSelected",
                    "setupCurrentParameter",
                    "sortOptions",
                ],
                phoneInput: ["handleFlags", "interconnectFlagsWithSelect", "hideCountriesSelect", "setSelectedCountry", "setLastPreferredCountry", "handleKeyCodes", "selectSelectedOption", "positionCountriesSelect"],
                common: [
                    "getSelectValue",
                    "getCheckedInputValue",
                    "createDocumentFromString",
                    "serializeData",
                    "serializeForm",
                    "createEventNameFromFormAction",
                    "fitsToParentWidth",
                    "addClassToElements",
                    "removeClassFromElements",
                    "moveCursorToEnd",
                    "throttle",
                ],
                stockAvailabilities: ["getDeliveryPointName", "getDeliveryPointAmount", "getStockAvailabilities", "setStockAvailabilities", "attachEventListeners", "mouseEnterListener", "mouseLeaveListener"],
                cofidis: ["getElements", "setMinPayment", "calculator", "handleClick", "addCalculatorListeners"],
                tracking: [
                    "getFormAction",
                    "resolveUpdateAction",
                    "resolveAmount",
                    "resolveTrackingAction",
                    "handleAction",
                    "trackProducts",
                    "trackFacebookPixel",
                    "trackGoogleCart",
                    "trackGoogleProductDetail",
                    "updateDataLayer",
                    "handlePromoClick",
                    "trackProductsFromPayload",
                    "updateDataLayerCartInfo",
                ],
                runtime: ["resizeEnd"],
                modal: ["open", "close", "resize", "shoptetResize"],
                productSlider: ["runProductSlider"],
                csrf: ["refreshCSRFToken", "injectCSRFToken", "validateCSRFToken", "appendCSRFInput", "submitLink"],
            }),
            shoptet.scripts.libs))
            if (shoptet.scripts.libs.hasOwnProperty(key)) for (var i = 0; i < shoptet.scripts.libs[key].length; i++) shoptet.scripts.monitoredFunctions.push("shoptet." + key + "." + shoptet.scripts.libs[key][i]);
        (shoptet.scripts.applyFunction = applyFunction),
            (shoptet.scripts.handleFunctionCall = handleFunctionCall),
            (shoptet.scripts.handleFunctionCallback = handleFunctionCallback),
            (shoptet.scripts.setCustomCallback = setCustomCallback),
            (shoptet.scripts.setCustomFunction = setCustomFunction),
            (shoptet.scripts.signal = signal),
            (shoptet.scripts.signalDomLoad = signalDomLoad),
            (shoptet.scripts.signalDomUpdate = signalDomUpdate),
            (shoptet.scripts.signalCustomEvent = signalCustomEvent),
            (shoptet.scripts.signalNativeEvent = signalNativeEvent),
            (shoptet.scripts.registerFunction = registerFunction),
            (shoptet.scripts.customCallbacks = {});
    })(shoptet),
    (function (shoptet) {
        function printMonitoringInfo() {
            console.log("%c" + shoptet.dev.config.name + " version " + shoptet.dev.config.version, shoptet.dev.config.log.styles.infoInv),
                shoptet.dev.config.monitorEvents
                    ? (console.log("%cEvents monitoring is enabled.", shoptet.dev.config.log.styles.success), console.log("To disable events monitoring, run %cshoptet.dev.disableEventsMonitoring()", shoptet.dev.config.log.styles.shell))
                    : (console.log("%cEvents monitoring is disabled.", shoptet.dev.config.log.styles.error), console.log("To enable events monitoring, run %cshoptet.dev.enableEventsMonitoring()", shoptet.dev.config.log.styles.shell));
        }
        document.addEventListener("DOMContentLoaded", function () {
            return (
                !(!shoptet.abilities || 3 !== shoptet.abilities.about.generation) &&
                (printMonitoringInfo(),
                    void shoptet.scripts.monitoredFunctions.forEach(function (key) {
                        !(function (key) {
                            document.addEventListener(key, shoptet.dev.attachEventInfo);
                        })(key);
                    }))
            );
        }),
            (shoptet.dev = shoptet.dev || {}),
            (shoptet.dev.config = {}),
            (shoptet.dev.config.log = {
                colors: { success: { front: "#fff", back: "#5cb85c" }, error: { front: "#fff", back: "#d9534f" }, info: { front: "#fff", back: "#3276b1" }, shell: { front: "#CBCAB4", back: "#002B36" } },
                fontSize: { larger: "14px" },
            }),
            (shoptet.dev.config.log.styles = {
                success: "background: " + shoptet.dev.config.log.colors.success.back + "; color: " + shoptet.dev.config.log.colors.success.front,
                error: "background: " + shoptet.dev.config.log.colors.error.back + "; color: " + shoptet.dev.config.log.colors.error.front,
                info: "background: " + shoptet.dev.config.log.colors.info.back + "; color: " + shoptet.dev.config.log.colors.info.front,
                successInv: "background: " + shoptet.dev.config.log.colors.success.front + "; color: " + shoptet.dev.config.log.colors.success.back,
                errorInv: "background: " + shoptet.dev.config.log.colors.error.front + "; color: " + shoptet.dev.config.log.colors.error.back,
                infoInv: "background: " + shoptet.dev.config.log.colors.info.front + "; color: " + shoptet.dev.config.log.colors.info.back,
                shell: "background: " + shoptet.dev.config.log.colors.shell.back + "; color: " + shoptet.dev.config.log.colors.shell.front,
                fontLarger: "font-size: " + shoptet.dev.config.log.fontSize.larger,
            }),
            (shoptet.dev.config.name = "Shoptet developers tools"),
            (shoptet.dev.config.version = "0.1.2"),
            (shoptet.dev.config.monitorEvents = !1),
            (shoptet.dev.enableEventsMonitoring = function () {
                return (shoptet.dev.config.monitorEvents = !0), console.log("%cEvents monitoring enabled.", shoptet.dev.config.log.styles.success), !0;
            }),
            (shoptet.dev.disableEventsMonitoring = function () {
                return (shoptet.dev.config.monitorEvents = !1), console.log("%cEvents monitoring disabled.", shoptet.dev.config.log.styles.error), !0;
            }),
            (shoptet.dev.printMonitoringInfo = printMonitoringInfo),
            (shoptet.dev.printEventInfo = function (key) {
                console.log("%cApplied function name:%c " + key, shoptet.dev.config.log.styles.infoInv, shoptet.dev.config.log.styles.fontLarger),
                    console.log("%cPassed arguments:", shoptet.dev.config.log.styles.infoInv),
                    console.log(shoptet.scripts.arguments[key]);
            }),
            (shoptet.dev.attachEventInfo = function (event) {
                shoptet.dev.config.monitorEvents && shoptet.dev.printEventInfo(event.type);
            }),
            document.addEventListener("DOMContentLoaded", function () {
                shoptet.cookie.get("monitorJSEvents") && shoptet.dev.enableEventsMonitoring();
            });
    })(shoptet),
    (function (shoptet) {
        (shoptet.custom = shoptet.custom || {}),
            (shoptet.custom.config = shoptet.custom.config || {}),
            (shoptet.custom.postSuccessfulValidation =
                shoptet.custom.postSuccessfulValidation ||
                function (form, args) {
                    return !0;
                }),
            (shoptet.custom.postFailedValidation = shoptet.custom.postSuccessfulValidation || function (form, args) {});
    })(shoptet),
    (function (shoptet) {
        (shoptet.config = shoptet.config || {}),
            (shoptet.config.animationDuration = void 0 !== shoptet.custom.config.animationDuration ? shoptet.custom.config.animationDuration : 300),
            (shoptet.config.submenuTimeout = void 0 !== shoptet.custom.config.submenuTimeout ? shoptet.custom.config.submenuTimeout : 150),
            (shoptet.config.dismissTimeout = void 0 !== shoptet.custom.config.dismissTimeout ? shoptet.custom.config.dismissTimeout : 6e3),
            (shoptet.config.unveilTimeout = void 0 !== shoptet.custom.config.unveilTimeout ? shoptet.custom.config.unveilTimeout : 1e3),
            (shoptet.config.updateQuantityTimeout = void 0 !== shoptet.custom.config.updateQuantityTimeout ? shoptet.custom.config.updateQuantityTimeout : 1e3),
            (shoptet.config.adminBarTimeout = void 0 !== shoptet.custom.config.adminBarTimeout ? shoptet.custom.config.adminBarTimeout : 800),
            (shoptet.config.breakpoints = {}),
            (shoptet.config.breakpoints.xs = 479),
            (shoptet.config.breakpoints.sm = 767),
            (shoptet.config.breakpoints.md = 991),
            (shoptet.config.breakpoints.lg = 1199),
            (shoptet.config.breakpoints.xl = 1439);
    })(shoptet),
    (function (shoptet) {
        function resizeEnd() {
            var height;
            new Date() - shoptet.runtime.resize.rtime < shoptet.runtime.resize.delta
                ? setTimeout(resizeEnd, shoptet.runtime.resize.delta)
                : ((shoptet.runtime.resize.timeout = !1),
                    shoptet.scripts.signalNativeEvent("resizeEnd", document),
                $(window).width() !== shoptet.runtime.resize.windowWidth && (resizeEndCallback(), (shoptet.runtime.resize.windowWidth = $(window).width())),
                (height = window.innerHeight) !== shoptet.runtime.resize.windowHeight && (document.documentElement.style.setProperty("--vh", 0.01 * height + "px"), (shoptet.runtime.resize.windowHeight = height)));
        }
        (shoptet.runtime = shoptet.runtime || {}),
            (shoptet.runtime.setPcsTimeout = !1),
            (shoptet.runtime.dismiss = setTimeout(function () {
                hideMsg();
            }, shoptet.config.dismissTimeout)),
            (shoptet.runtime.resize = { delta: 300, rtime: !1, timeout: !1, windowWidth: !1, windowHeight: !1 }),
            (shoptet.runtime.cloudZoom = !1),
            (shoptet.runtime.updateMenu = !1),
            (shoptet.runtime.adminBar = !1),
            shoptet.scripts.libs.runtime.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "runtime");
            }),
            document.addEventListener("DOMContentLoaded", function () {
                (shoptet.runtime.resize.windowWidth = $(window).width()), (shoptet.runtime.resize.windowHeight = window.innerHeight), document.documentElement.style.setProperty("--vh", 0.01 * shoptet.runtime.resize.windowHeight + "px");
            }),
            window.addEventListener("resize", function () {
                (shoptet.runtime.resize.rtime = new Date()),
                !1 === shoptet.runtime.resize.timeout &&
                ((shoptet.runtime.resize.timeout = !0),
                    setTimeout(function () {
                        shoptet.runtime.resizeEnd();
                    }, shoptet.runtime.resize.delta));
            });
    })(shoptet),
    (function (shoptet) {
        function open(options) {
            $.colorbox(options);
        }
        function close() {
            $.colorbox.close();
        }
        function resize(options) {
            $.colorbox.resize(options), document.dispatchEvent(new Event(shoptet.modal.resizeDoneEvent));
        }
        function shoptetResize() {
            var responsiveWidth,
                width,
                $colorbox = $("#colorbox");
            (width =
                $colorbox.hasClass("colorbox-xs") || $colorbox.hasClass(shoptet.modal.config.classXs)
                    ? shoptet.modal.config.widthXs
                    : $colorbox.hasClass("colorbox-sm") || $colorbox.hasClass(shoptet.modal.config.classSm)
                        ? shoptet.modal.config.widthSm
                        : $colorbox.hasClass("colorbox-lg") || $colorbox.hasClass(shoptet.modal.config.classLg)
                            ? shoptet.modal.config.widthLg
                            : shoptet.modal.config.widthMd),
            detectResolution(shoptet.config.breakpoints.lg) ||
            ((width = width < (responsiveWidth = (3 === shoptet.abilities.about.generation ? $(".content-wrapper") : $("#content")).width()) ? width : responsiveWidth),
            $colorbox.hasClass("productDetail") && (width = shoptet.modal.config.maxWidth)),
                shoptet.modal.resize({ width: width });
        }
        (shoptet.modal = shoptet.modal || {}),
            shoptet.scripts.libs.modal.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "modal");
            }),
            (shoptet.modal.config = {}),
            (shoptet.modal.config.opacity = 0.65),
            (shoptet.modal.config.maxWidth = "98%"),
            (shoptet.modal.config.maxHeight = "95%"),
            (shoptet.modal.config.initialHeight = 480),
            (shoptet.modal.config.widthXs = 300),
            (shoptet.modal.config.widthSm = 500),
            (shoptet.modal.config.widthMd = 700),
            (shoptet.modal.config.widthLg = 1152),
            (shoptet.modal.config.classXs = "shoptet-modal-xs"),
            (shoptet.modal.config.classSm = "shoptet-modal-sm"),
            (shoptet.modal.config.classMd = "shoptet-modal-md"),
            (shoptet.modal.config.classLg = "shoptet-modal-lg"),
            (shoptet.modal.resizeDoneEvent = "ShoptetModalResizeDone");
    })(shoptet),
    (function (shoptet) {
        function getSelectValue(select) {
            return select.value;
        }
        function getCheckedInputValue(containingElement) {
            for (var inputs = containingElement.querySelectorAll('input[type="radio"]'), i = 0; i < inputs.length; i++) if (inputs[i].checked) return inputs[i].value;
        }
        function createDocumentFromString(string) {
            return new DOMParser().parseFromString(string, "text/html");
        }
        function serializeData(data) {
            if ("object" == typeof data)
                try {
                    var params = [];
                    for (key in data) params.push(key + "=" + data[key]);
                    return params.join("&");
                } catch (e) {
                    return console.error(e), data;
                }
            return data;
        }
        function serializeForm(form) {
            var fallBack = form;
            if (null == form) return form;
            if ((form instanceof jQuery && (form = form.get(0)), form instanceof HTMLFormElement && (form = new FormData(form)), !(form instanceof FormData))) return form;
            var object = {};
            try {
                for (var pair, formDataEntries = form.entries(), formDataEntry = formDataEntries.next(); !formDataEntry.done; ) (object[(pair = formDataEntry.value)[0]] = pair[1]), (formDataEntry = formDataEntries.next());
                return serializeData(object);
            } catch (e) {
                return console.error(e), (form = $(fallBack).serialize());
            }
        }
        function createEventNameFromFormAction(actionName) {
            actionName = actionName.replace(shoptet.config.cartActionUrl, "");
            return (actionName = "ShoptetCart" + (actionName = actionName.replace(/\//gi, "")).charAt(0).toUpperCase() + actionName.slice(1));
        }
        function fitsToParentWidth(el, parent) {
            var reserved = void 0 === parent ? 0 : parent,
                parent = el.offsetParent;
            return !parent || !(el.offsetLeft + el.offsetWidth > parent.offsetWidth - reserved);
        }
        function addClassToElements(elements, className) {
            for (var i = 0; i < elements.length; i++) elements[i].classList.add(className);
        }
        function removeClassFromElements(elements, className) {
            for (var i = 0; i < elements.length; i++) elements[i].classList.remove(className);
        }
        function moveCursorToEnd(range) {
            "number" == typeof range.selectionStart ? (range.selectionStart = range.selectionEnd = range.value.length) : void 0 !== range.createTextRange && (range.focus(), (range = range.createTextRange()).collapse(!1), range.select());
        }
        function throttle(func, wait, options) {
            var timeout;
            Date.now;
            return function () {
                clearTimeout(timeout), (timeout = null);
            };
        }
        (shoptet.common = shoptet.common || {}),
            shoptet.scripts.libs.common.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "common");
            }),
            (shoptet.common.keyCodes = { backspace: 8, enter: 13, escape: 27 });
    })(shoptet),
    (function (shoptet) {
        function get() {
            var content = shoptet.cookie.get(shoptet.config.cookiesConsentName);
            return content && JSON.parse(content);
        }
        function set(agreements) {
            var consentValidity = 180,
                cookieData = Object.create(agreements);
            0 == cookieData.length && (cookieData.push(shoptet.config.cookiesConsentOptNone), (consentValidity = shoptet.config.cookiesConsentRefuseDuration));
            var cookieId = "";
            for (i = 0; i < 8; i++) cookieId += Math.random().toString(32).substr(2, 4);
            cookieData = { consent: cookieData.join(","), cookieId: cookieId };
            return (
                shoptet.cookie.create(shoptet.config.cookiesConsentName, JSON.stringify(cookieData), { days: consentValidity }) &&
                ($.ajax({
                    type: "POST",
                    headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
                    url: shoptet.config.cookiesConsentUrl,
                    data: cookieData,
                    success: function (data) {
                        200 == data.code && console.debug("ajax db saving ok");
                    },
                }),
                0 < shoptet.consent.acceptEvents.length &&
                shoptet.consent.acceptEvents.forEach(function (fn) {
                    fn(agreements);
                }),
                    1)
            );
        }
        function onAccept(event) {
            "function" == typeof event && shoptet.consent.acceptEvents.push(event);
        }
        function isSet() {
            return !1 !== shoptet.consent.get();
        }
        function isAccepted(agreementType) {
            if (1 !== shoptet.config.cookiesConsentIsActive) return 1;
            var cookie = shoptet.consent.get();
            return cookie.consent && cookie.consent.split(",").includes(agreementType);
        }
        function openCookiesSettingModal() {
            $("html").addClass("cookies-visible"), showSpinner();
            shoptet.ajax.makeAjaxRequest(
                shoptet.config.cookiesConsentSettingsUrl,
                shoptet.ajax.requestTypes.get,
                "",
                {
                    success: function (content) {
                        (content = shoptet.common.createDocumentFromString(content.getPayload())), (content = $(content).find(".js-cookiesSetting"));
                        content.find(".js-cookiesConsentOption").each(function () {
                            shoptet.consent.isAccepted(this.value) && $(this).attr("checked", "checked");
                        }),
                            (content = content.html()),
                            hideSpinner(),
                            shoptet.modal.open({
                                scrolling: !0,
                                opacity: ".95",
                                html: shoptet.content.colorboxHeader + content + shoptet.content.colorboxFooter,
                                className: shoptet.modal.config.classMd,
                                width: shoptet.modal.config.widthMd,
                                onComplete: function () {
                                    $("#cboxContent").addClass("cookiesDialog"), shoptet.modal.shoptetResize();
                                },
                                onClosed: function () {
                                    $("html").removeClass("cookies-visible"), $("#cboxContent").removeClass("cookiesDialog");
                                },
                            }),
                            shoptet.scripts.signalDomLoad("ShoptetDOMContentLoaded");
                    },
                },
                { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
            );
        }
        function cookiesConsentSubmit(value) {
            var possibleAgreements = [shoptet.config.cookiesConsentOptAnalytics, shoptet.config.cookiesConsentOptPersonalisation],
                agreements = [];
            switch (value) {
                case "all":
                    agreements = possibleAgreements;
                    break;
                case "reject":
                    value = "none";
                    break;
                case "selection":
                    $(".js-cookiesConsentOption").each(function () {
                        1 == this.checked && possibleAgreements.includes(this.value) && agreements.push(this.value);
                    });
                    break;
                default:
                    if ("none" != value) return void console.debug("unknown consent action");
            }
            shoptet.consent.set(agreements) ? ($(".js-siteCookies").remove(), shoptet.modal.close()) : console.debug("error setting consent cookie");
        }
        document.addEventListener("DOMContentLoaded", function () {
            !(function () {
                "use strict";
                var init = "initCookieConsent";
                "function" != typeof window[init] &&
                (window[init] = function (root) {
                    var _cookieconsent = {
                            run: function () {
                                var accepted_categories, scripts, _loadScripts;
                                !shoptet.consent.isSet() ||
                                ((scripts = shoptet.consent.get()) &&
                                    ((accepted_categories = scripts.consent.split(",")),
                                        (scripts = document.querySelectorAll("script[data-cookiecategory]")),
                                        (_loadScripts = function (scripts, index) {
                                            if (index < scripts.length) {
                                                var curr_script = scripts[index],
                                                    src = curr_script.getAttribute("data-cookiecategory");
                                                if (-1 < _inArray(accepted_categories, src)) {
                                                    (curr_script.type = "text/javascript"), curr_script.removeAttribute("data-cookiecategory");
                                                    var src = curr_script.getAttribute("data-src"),
                                                        fresh_script = _createNode("script");
                                                    if (
                                                        ((fresh_script.textContent = curr_script.innerHTML),
                                                            (function (destination) {
                                                                for (var attr, attributes = curr_script.attributes, len = attributes.length, i = 0; i < len; i++)
                                                                    (attr = attributes[i]), destination.setAttribute(attr.nodeName, attr.nodeValue);
                                                            })(fresh_script),
                                                            src ? (fresh_script.src = src) : (src = curr_script.src),
                                                        src &&
                                                        (fresh_script.readyState
                                                            ? (fresh_script.onreadystatechange = function () {
                                                                ("loaded" !== fresh_script.readyState && "complete" !== fresh_script.readyState) || ((fresh_script.onreadystatechange = null), _loadScripts(scripts, ++index));
                                                            })
                                                            : (fresh_script.onload = function () {
                                                                (fresh_script.onload = null), _loadScripts(scripts, ++index);
                                                            })),
                                                            curr_script.parentNode.replaceChild(fresh_script, curr_script),
                                                            src)
                                                    )
                                                        return;
                                                }
                                                _loadScripts(scripts, ++index);
                                            }
                                        })(scripts, 0)));
                            },
                        },
                        _inArray = function (arr, value) {
                            for (var len = arr.length, i = 0; i < len; i++) if (arr[i] === value) return i;
                            return -1;
                        },
                        _createNode = function (type) {
                            var el = document.createElement(type);
                            return "button" === type && el.setAttribute("type", type), el;
                        };
                    return _cookieconsent;
                });
            })();
            var cc = initCookieConsent();
            cc.run(),
                shoptet.consent.onAccept(function (agreements) {
                    cc.run();
                });
        }),
            (shoptet.consent = shoptet.consent || {}),
            shoptet.scripts.libs.consent.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "consent");
            }),
            (shoptet.consent.acceptEvents = []);
    })(shoptet),
    (function (shoptet) {
        function get(cookieName) {
            var match = new RegExp("; " + cookieName + "=([^;]*);"),
                match = ("; " + document.cookie + ";").match(match);
            return cookieName && match && unescape(match[1]);
        }
        function create(name, value, expires) {
            if (void 0 !== expires) {
                if ("string" == typeof name) {
                    var key,
                        defaultExpiration = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
                    for (key in expires) expires.hasOwnProperty(key) && (defaultExpiration[key] = expires[key]);
                    var maxAge = new Date(),
                        year = maxAge.getFullYear(),
                        month = maxAge.getMonth(),
                        day = maxAge.getDate(),
                        hour = maxAge.getHours(),
                        expiration = maxAge.getMinutes(),
                        maxAge = maxAge.getSeconds(),
                        expiration = new Date(
                            year + parseInt(defaultExpiration.years),
                            month + parseInt(defaultExpiration.months),
                            day + parseInt(defaultExpiration.days),
                            hour + parseInt(defaultExpiration.hours),
                            expiration + parseInt(defaultExpiration.minutes),
                            maxAge + parseInt(defaultExpiration.seconds)
                        ),
                        maxAge = 24 * (parseInt(defaultExpiration.days) + 1) * 60 * 60;
                    return (document.cookie = name + "=" + value + "; expires=" + expiration + "; max-age=" + maxAge + "; path=/"), 1;
                }
                console.log("%cCookie name must be a string", shoptet.dev.config.log.styles.error);
            } else console.log("%cCookie expiration is required", shoptet.dev.config.log.styles.error);
        }
        (shoptet.cookie = shoptet.cookie || {}),
            shoptet.scripts.libs.cookie.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "cookie");
            });
    })(shoptet),
    (function (shoptet) {
        function toFloat(value) {
            return "string" != typeof value && (value += ""), parseFloat(value.replace(shoptet.config.decSeparator, "."));
        }
        function toLocaleFloat(value, decimals, trim) {
            return "number" == typeof value
                ? ((value = value.toFixed("undefined" === decimals ? 0 : decimals).toString()), trim && -1 != value.indexOf(".") && (value = value.replace(/\.?0*$/, "")), value.replace(".", shoptet.config.decSeparator))
                : value;
        }
        function resolveDecimalSeparator(decimalSeparator) {
            return void 0 !== decimalSeparator ? decimalSeparator : shoptet.config.decSeparator;
        }
        function resolveThousandSeparator(thousandSeparator) {
            return void 0 !== thousandSeparator ? thousandSeparator : shoptet.config.thousandSeparator;
        }
        function resolveDecimalPlaces(decimalPlaces) {
            return void 0 === decimalPlaces || isNaN(decimalPlaces) ? (isNaN(shoptet.config.decPlaces) ? 0 : Math.abs(shoptet.config.decPlaces)) : Math.abs(decimalPlaces);
        }
        function resolveCurrencySymbol(symbol) {
            return void 0 !== symbol ? symbol : shoptet.config.currencySymbol;
        }
        function resolveCurrencySymbolPosition(symbolPositionLeft) {
            return void 0 !== symbolPositionLeft ? symbolPositionLeft : parseInt(shoptet.config.currencySymbolLeft);
        }
        function formatNumber(j, i, s) {
            var number,
                decSep,
                thSep = resolveThousandSeparator(s),
                decPlaces = Number.isInteger(this.valueOf()) ? (decSep = 0) : ((decSep = resolveDecimalSeparator(i)), resolveDecimalPlaces(j)),
                s = this < 0 ? "-" : "",
                i = parseInt((number = Math.abs(+this || 0).toFixed(decPlaces))) + "",
                j = 3 < (j = i.length) ? j % 3 : 0;
            return (
                s +
                (j ? i.substr(0, j) + thSep : "") +
                i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thSep) +
                (decPlaces
                    ? decSep +
                    Math.abs(number - i)
                        .toFixed(decPlaces)
                        .slice(2)
                    : "")
            );
        }
        function formatAsCurrency(symbol, positionLeft, decimalPlaces, decimalSeparator, thousandSeparator) {
            (symbol = resolveCurrencySymbol(symbol)), (positionLeft = resolveCurrencySymbolPosition(positionLeft));
            return ((positionLeft ? symbol : "") + this.ShoptetFormatNumber(decimalPlaces, decimalSeparator, thousandSeparator) + (positionLeft ? "" : " " + symbol)).trim();
        }
        function roundForDocument() {
            switch (shoptet.config.documentsRounding) {
                case "1":
                    return Math.ceil(this);
                case "2":
                    return Math.floor(this);
                case "3":
                    return Math.round(this);
                default:
                    return this;
            }
        }
        function resolveMinimumAmount(decimals) {
            switch (decimals) {
                case 1:
                    return 0.1;
                case 2:
                    return 0.01;
                case 3:
                    return 0.001;
                default:
                    return 1;
            }
        }
        function updateQuantity(el, min, max, decimals, action, callback) {
            var value = shoptet.helpers.toFloat(el.value);
            if (!isNaN(value)) {
                (decimals = void 0 !== decimals ? toFloat(decimals) : 0), (min = void 0 !== min ? toFloat(min) : resolveMinimumAmount(decimals)), (max = toFloat(void 0 !== max ? max : shoptet.config.defaultProductMaxAmount));
                return (-1 !== action.indexOf("increase") ? (value += 1 < min ? 1 : min) : (value -= 1 < min ? 1 : min), (value = shoptet.helpers.toFloat(value.toFixed(decimals))) < min)
                    ? ($(el).siblings(".js-decrease-tooltip").tooltip("show"), void $(el).siblings(".js-remove-pcs-tooltip").tooltip().show())
                    : max < value
                        ? ($(el).siblings(".js-increase-tooltip").tooltip("show"), void $(el).siblings(".js-add-pcs-tooltip").tooltip().show())
                        : (shoptet.variantsCommon.hideQuantityTooltips(), (el.value = value), "function" == typeof callback && callback(), 1);
            }
        }
        function isTouchDevice() {
            var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
            return (
                "ontouchstart" in window ||
                (window.DocumentTouch && document instanceof DocumentTouch) ||
                (function (query) {
                    return window.matchMedia(query).matches;
                })(["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(""))
            );
        }
        function getFunctionFromString(string) {
            if (void 0 !== string) {
                var scope = window,
                    scopeSplit = string.split(".");
                for (i = 0; i < scopeSplit.length - 1; i++) if (null == (scope = scope[scopeSplit[i]])) return;
                return scope[scopeSplit[scopeSplit.length - 1]];
            }
        }
        function loadDataAttributes($elem) {
            var names = $elem.data("names").toString().split(","),
                values = $elem.data("values").toString().split(","),
                attributes = {};
            for (i = 0, cnt = names.length; i < cnt; i++) attributes[names[i]] = values[i];
            return attributes;
        }
        (Number.prototype.ShoptetFormatNumber = formatNumber),
            (Number.prototype.ShoptetFormatAsCurrency = formatAsCurrency),
            (Number.prototype.ShoptetRoundForDocument = roundForDocument),
            $("html").on("click", function (e) {
                $(e.target).is(".decrease, .increase, .remove-pcs, .add-pcs") || shoptet.variantsCommon.hideQuantityTooltips();
            }),
            $(".cart-widget, .product").on("mouseleave", function () {
                shoptet.variantsCommon.hideQuantityTooltips();
            }),
            document.addEventListener("ShoptetCartUpdated", function () {
                shoptet.variantsCommon.hideQuantityTooltips();
            }),
            (shoptet.helpers = shoptet.helpers || {}),
            shoptet.scripts.libs.helpers.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "helpers");
            });
    })(shoptet),
    (function (shoptet) {
        function getFormAction(formAction) {
            return formAction === shoptet.config.addToCartUrl
                ? shoptet.config.addToCartUrl
                : formAction === shoptet.config.removeFromCartUrl
                    ? shoptet.config.removeFromCartUrl
                    : formAction === shoptet.config.updateCartUrl
                        ? shoptet.config.updateCartUrl
                        : formAction === shoptet.config.addDiscountCouponUrl
                            ? shoptet.config.addDiscountCouponUrl
                            : formAction === shoptet.config.setSelectedGiftUrl && shoptet.config.setSelectedGiftUrl;
        }
        function resolveUpdateAction(data) {
            return data.amount < data.previousAmount || 0 < data.amount;
        }
        function resolveAmount(formAction, data) {
            var amount = data.amount;
            return shoptet.tracking.getFormAction(formAction) === shoptet.config.updateCartUrl && 0 === (amount = Math.abs(data.amount - data.previousAmount)) && (amount = data.previousAmount), amount;
        }
        function resolveTrackingAction(formAction, data) {
            return formAction === shoptet.config.updateCartUrl ? shoptet.tracking.resolveUpdateAction(data) : (formAction === shoptet.config.addToCartUrl || shoptet.config.removeFromCartUrl, 1);
        }
        function handleAction(form, response) {
            var formAction = shoptet.tracking.getFormAction(form.getAttribute("action"));
            if (formAction) {
                var priceId = !1,
                    priceIdInput = form.querySelector("[name=priceId]"),
                    productCodeInput = form.querySelector("[name=productCode]");
                if ((priceIdInput && (priceId = priceIdInput.value), !priceId && productCodeInput)) {
                    var product,
                        tracking = JSON.parse(response.getFromPayload("trackingContainer"));
                    for (product in tracking.products)
                        tracking.products[product].content_ids.forEach(function (e) {
                            e === productCodeInput.value && (priceId = product);
                        });
                }
                shoptet.tracking.updateDataLayerCartInfo(response), priceId && trackProducts(form, priceId, formAction, [shoptet.tracking.trackGoogleCart, shoptet.tracking.trackFacebookPixel, shoptet.tracking.updateDataLayer]);
            }
        }
        function trackProducts(amountInput, previousAmount, formAction, trackingFunctions) {
            var amount;
            "object" == typeof shoptet.tracking.productsList &&
            ((productData = shoptet.tracking.productsList[previousAmount]),
            "object" == typeof productData &&
            ((previousAmount = !(amount = 1)),
            (amountInput = amountInput.querySelector("input[name=amount]")) && ((amount = 0 < (amount = parseFloat(amountInput.value)) ? amount : 1), (previousAmount = parseFloat(amountInput.defaultValue))),
                (productData.amount = amount),
                (productData.previousAmount = previousAmount),
                trackingFunctions.forEach(function (trackingFunction) {
                    "function" == typeof trackingFunction && trackingFunction(productData, formAction);
                }),
                shoptet.scripts.signalCustomEvent("ShoptetProductsTracked")));
        }
        function trackFacebookPixel(data, priceValue) {
            if ("function" == typeof fbq) {
                var eventName,
                    action = shoptet.tracking.resolveTrackingAction(priceValue, data),
                    amount = shoptet.tracking.resolveAmount(priceValue, data),
                    priceValue = data.facebookPixelVat ? data.value : data.valueWoVat,
                    data = { content_name: data.content_name, content_category: data.content_category, content_ids: data.content_ids, content_type: "product", value: parseFloat(priceValue) * amount, currency: data.currency };
                switch (action) {
                    case "remove":
                        (eventName = "trackCustom"), (action = "RemoveFromCart");
                        break;
                    case "add":
                        (eventName = "track"), (action = "AddToCart");
                        break;
                    case "ViewContent":
                        (eventName = "track"), (action = "ViewContent");
                        break;
                    default:
                        return;
                }
                fbq(eventName, action, data);
            }
            shoptet.scripts.signalCustomEvent("ShoptetFacebookPixelTracked");
        }
        function trackGoogleProductDetail(gaData, action) {
            "function" == typeof gtag &&
            gtag("event", "view_item", {
                send_to: "analytics",
                items: [{ id: gaData.content_ids[0], name: gaData.base_name, category: gaData.content_category, brand: gaData.manufacturer, variant: gaData.variant, price: gaData.valueWoVat }],
            }),
                shoptet.scripts.signalCustomEvent("ShoptetGoogleProductDetailTracked");
        }
        function trackGoogleCart(gaData, amount) {
            var eventName = "";
            switch (shoptet.tracking.resolveTrackingAction(amount, gaData)) {
                case "add":
                    eventName = "add_to_cart";
                    break;
                case "remove":
                    eventName = "remove_from_cart";
                    break;
                default:
                    return;
            }
            amount = shoptet.tracking.resolveAmount(amount, gaData);
            "function" == typeof gtag &&
            gtag("event", eventName, {
                send_to: "analytics",
                items: [{ id: gaData.content_ids[0], name: gaData.base_name, brand: gaData.manufacturer, category: gaData.content_category, variant: gaData.variant, quantity: amount, price: gaData.valueWoVat }],
            }),
                shoptet.scripts.signalCustomEvent("ShoptetGoogleCartTracked");
        }
        function updateDataLayer(data, formAction) {
            if ("object" == typeof dataLayer) {
                var key,
                    action = shoptet.tracking.resolveTrackingAction(formAction, data),
                    amount = shoptet.tracking.resolveAmount(formAction, data),
                    itemWasHandled = !1,
                    GTMshoppingCart = { ecommerce: { currencyCode: data.currency } };
                for (key in ((productData = {}),
                    (productData.id = data.content_ids[0]),
                    (productData.name = data.base_name),
                    (productData.brand = data.manufacturer),
                    (productData.category = data.content_category),
                    (productData.variant = data.variant),
                    (productData.price = data.value),
                    (productData.quantity = data.amount),
                    productData))
                    null === productData[key] && delete productData[key];
                dataLayer[0].shoptet.cart.forEach(function (el, i) {
                    if (!itemWasHandled && el.code === data.content_ids[0])
                        switch (action) {
                            case "add":
                                (el.quantity = el.quantity + amount), (itemWasHandled = !0);
                                break;
                            case "remove":
                                0 < el.quantity - amount ? (el.quantity = el.quantity - amount) : dataLayer[0].shoptet.cart.splice(i, 1),
                                    (GTMshoppingCart.event = "removeFromCart"),
                                    (GTMshoppingCart.ecommerce.remove = []),
                                    GTMshoppingCart.ecommerce.remove.push(productData),
                                    (itemWasHandled = !0);
                        }
                }),
                itemWasHandled || dataLayer[0].shoptet.cart.push({ code: data.content_ids[0], quantity: amount, priceWithVat: data.value }),
                void 0 === GTMshoppingCart.event && ((GTMshoppingCart.event = "addToCart"), (GTMshoppingCart.ecommerce.add = []), GTMshoppingCart.ecommerce.add.push(productData)),
                    dataLayer.push(GTMshoppingCart);
            }
            shoptet.scripts.signalCustomEvent("ShoptetDataLayerUpdated");
        }
        function handlePromoClick(promo) {
            promo = shoptet.tracking.bannersList[promo.dataset.ecPromoId];
            promo && "function" == typeof gtag && gtag("event", "select_content", { send_to: "analytics", promotions: [{ id: promo.id, name: promo.name }] });
        }
        function trackProductsFromPayload(trackingProducts) {
            trackingProducts = trackingProducts.getElementById("trackingScript");
            trackingProducts && ((trackingProducts = JSON.parse(trackingProducts.getAttribute("data-products"))), (shoptet.tracking.productsList = $.extend(trackingProducts.products, shoptet.tracking.productsList)));
        }
        function updateDataLayerCartInfo(trackingContainer) {
            var freeGift;
            "object" == typeof dataLayer &&
            (null !== (freeGift = trackingContainer.getFromPayload("leftToFreeShipping")) && (dataLayer[0].shoptet.cartInfo.leftToFreeShipping = freeGift),
            null !== (freeGift = trackingContainer.getFromPayload("freeShipping")) && (dataLayer[0].shoptet.cartInfo.freeShipping = freeGift),
            null !== (freeGift = trackingContainer.getFromPayload("discountCoupon")) && (dataLayer[0].shoptet.cartInfo.discountCoupon = freeGift),
            null !== (freeGift = trackingContainer.getFromPayload("leftToFreeGift")) && (dataLayer[0].shoptet.cartInfo.leftToFreeGift = freeGift),
            null !== (freeGift = trackingContainer.getFromPayload("freeGift")) && (dataLayer[0].shoptet.cartInfo.freeGift = freeGift),
            null !== (trackingContainer = trackingContainer.getFromPayload("trackingContainer")) &&
            ((trackingContainer = JSON.parse(trackingContainer)), (shoptet.tracking.productsList = $.extend(trackingContainer.products, shoptet.tracking.productsList))));
        }
        document.addEventListener("DOMContentLoaded", function () {
            for (var imageBanners = document.querySelectorAll("a[data-ec-promo-id]"), i = 0; i < imageBanners.length; i++)
                !(function (i) {
                    imageBanners[i].addEventListener("click", function () {
                        shoptet.tracking.handlePromoClick(imageBanners[i]);
                    });
                })(i);
            var textBanners = document.querySelectorAll("span[data-ec-promo-id]");
            for (i = 0; i < textBanners.length; i++)
                !(function (i) {
                    !(function (links, banner) {
                        for (var i = 0; i < links.length; i++)
                            links[i].addEventListener("click", function () {
                                shoptet.tracking.handlePromoClick(banner);
                            });
                    })(textBanners[i].querySelectorAll("a"), textBanners[i]);
                })(i);
        }),
            (shoptet.tracking = shoptet.tracking || {}),
            shoptet.scripts.libs.tracking.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "tracking");
            });
    })(shoptet),
    (function (shoptet) {
        function photo360init(imageHolder) {
            var imageContainer = imageHolder,
                config = { rotationSpeed: 100, pixelsPerFrame: 10, fullscreenDelay: 300, url: "/action/ProductDetail/Get360Images/" },
                classes = {
                    container: "image360",
                    holder: "image360-holder",
                    preview: "image360-preview",
                    loadedEl: "image360-loaded",
                    fullscreenOn: "image360-fullscreen-on",
                    fullscreenTarget: "image360-fullscreen-target",
                    iconFullscreenTurnedOn: "icon-contract",
                    iconFullscreenTurnedOff: "icon-expand",
                    navigation: { play: "image360-play", prev: "image360-prev", next: "image360-next", fullscreen: "image360-fullscreen" },
                },
                runtime = {
                    currentFrame: 0,
                    framesCount: 0,
                    fullscreenImagesLoaded: !1,
                    fullscreenOn: !1,
                    image360images: { normal: [], fullscreen: [] },
                    intervals: { prevImage: !1, nextImage: !1, play: !1 },
                    lastPosition: 0,
                    normalImagesLoaded: !1,
                    scriptRotationInProgress: !1,
                    userRotationInProgress: !1,
                },
                imageHolder = document.createElement("div");
            function buildImage(imageContainer, size) {
                imageContainer.classList.add(shoptet.ajax.pendingClass);
                var productId = imageContainer.dataset.productid;
                if ("" === productId) return imageContainer.classList.remove(shoptet.ajax.pendingClass), void showMessage(shoptet.messages.ajaxError, "error");
                shoptet.ajax.makeAjaxRequest(
                    config.url,
                    shoptet.ajax.requestTypes.post,
                    { productId: productId, imageSize: imageContainer.dataset[size] },
                    {
                        success: function (response) {
                            !(function (imageContainer, imageURLs, size) {
                                runtime.framesCount = imageURLs.length - 1;
                                for (var i = 0; i < imageURLs.length; i++) {
                                    var image = new Image();
                                    (image.src = imageURLs[i]),
                                        image.complete || 4 === image.readyState
                                            ? loadSuccess(imageContainer, imageURLs[i], i, size)
                                            : (image.addEventListener(
                                                "load",
                                                (function (i) {
                                                    loadSuccess(imageContainer, imageURLs[i], i, size);
                                                })(i)
                                            ),
                                                image.addEventListener(
                                                    "error",
                                                    (function (i) {
                                                        loadSuccess(imageContainer, imageURLs[i], i, size);
                                                    })(i)
                                                ));
                                }
                            })(imageContainer, response.getPayload(), size);
                        },
                        failed: function () {
                            imageContainer.classList.remove(shoptet.ajax.pendingClass);
                        },
                    },
                    { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
                );
            }
            function getPositionX(event) {
                return void 0 !== event.clientX ? event.clientX : event.changedTouches[0].pageX;
            }
            function loadSuccess(imageContainer, imageHolder, index, imagePreview) {
                (runtime.image360images[imagePreview][index] = imageHolder),
                runtime.image360images[imagePreview].length === runtime.framesCount &&
                (runtime.normalImagesLoaded ||
                ((runtime.normalImagesLoaded = !0),
                    (imageHolder = imageContainer.querySelector("." + classes.holder)),
                    (imagePreview = imageContainer.querySelector("." + classes.preview)),
                    imageHolder.appendChild(imagePreview),
                    (function (imageContainer) {
                        var playButton = document.createElement("span");
                        playButton.classList.add(classes.navigation.play), playButton.classList.add("shoptet-icon"), playButton.classList.add("icon-play");
                        var prevButton = document.createElement("span");
                        prevButton.classList.add(classes.navigation.prev), prevButton.classList.add("shoptet-icon"), prevButton.classList.add("icon-previous");
                        var nextButton = document.createElement("span");
                        nextButton.classList.add(classes.navigation.next), nextButton.classList.add("shoptet-icon"), nextButton.classList.add("icon-next");
                        var fullscreenButton = document.createElement("span");
                        fullscreenButton.classList.add(classes.navigation.fullscreen), fullscreenButton.classList.add("shoptet-icon"), fullscreenButton.classList.add(classes.iconFullscreenTurnedOff);
                        var imageNav = document.createElement("div");
                        imageNav.classList.add("image360-navigation"),
                            imageNav.appendChild(playButton),
                            imageNav.appendChild(prevButton),
                            imageNav.appendChild(nextButton),
                            imageNav.appendChild(fullscreenButton),
                            imageContainer.appendChild(imageNav),
                            shoptet.helpers.isTouchDevice()
                                ? (playButton.addEventListener("touchstart", function (event) {
                                    event.stopPropagation(), play(event.target);
                                }),
                                    prevButton.addEventListener("touchstart", function (event) {
                                        event.stopPropagation(), navigationPrevMousedown(event);
                                    }),
                                    prevButton.addEventListener("touchend", function (event) {
                                        event.stopPropagation(), clearInterval(runtime.intervals.prevImage);
                                    }),
                                    nextButton.addEventListener("touchstart", function (event) {
                                        event.stopPropagation(), navigationNextMousedown(event);
                                    }),
                                    nextButton.addEventListener("touchend", function (event) {
                                        event.stopPropagation(), clearInterval(runtime.intervals.nextImage);
                                    }),
                                    fullscreenButton.addEventListener("touchstart", function (event) {
                                        event.stopPropagation(),
                                            setTimeout(function () {
                                                navigationFullscreenClick(event);
                                            }, config.fullscreenDelay);
                                    }))
                                : (playButton.addEventListener("click", function (event) {
                                    event.stopPropagation(), play(event.target);
                                }),
                                    prevButton.addEventListener("mousedown", function (event) {
                                        event.stopPropagation(), navigationPrevMousedown(event);
                                    }),
                                    prevButton.addEventListener("mouseup", function (event) {
                                        event.stopPropagation(), clearInterval(runtime.intervals.prevImage);
                                    }),
                                    prevButton.addEventListener("mouseleave", function (event) {
                                        event.stopPropagation(), clearInterval(runtime.intervals.prevImage);
                                    }),
                                    nextButton.addEventListener("mousedown", function (event) {
                                        event.stopPropagation(), navigationNextMousedown(event);
                                    }),
                                    nextButton.addEventListener("mouseup", function (event) {
                                        event.stopPropagation(), clearInterval(runtime.intervals.nextImage);
                                    }),
                                    nextButton.addEventListener("mouseleave", function (event) {
                                        event.stopPropagation(), clearInterval(runtime.intervals.nextImage);
                                    }),
                                    fullscreenButton.addEventListener("click", function (event) {
                                        event.stopPropagation(), navigationFullscreenClick(event);
                                    }));
                    })(imageContainer)),
                    imageContainer.classList.remove(shoptet.ajax.pendingClass),
                    imageContainer.classList.add(classes.loadedEl));
            }
            function nextImage(imageContainer) {
                0 < runtime.currentFrame ? (runtime.currentFrame = runtime.currentFrame - 1) : (runtime.currentFrame = runtime.framesCount);
                var size = runtime.fullscreenOn ? "fullscreen" : "normal";
                switchSrc(imageContainer, runtime.currentFrame, size);
            }
            function prevImage(imageContainer) {
                runtime.currentFrame < runtime.framesCount ? (runtime.currentFrame = runtime.currentFrame + 1) : (runtime.currentFrame = 0);
                var size = runtime.fullscreenOn ? "fullscreen" : "normal";
                switchSrc(imageContainer, runtime.currentFrame, size);
            }
            function switchSrc(imageContainer, frame, fallbackSize) {
                var newSrc = runtime.image360images[fallbackSize][frame];
                void 0 === newSrc && ((fallbackSize = "fullscreen" === fallbackSize ? "normal" : "fullscreen"), (newSrc = runtime.image360images[fallbackSize][frame])),
                    imageContainer.querySelector("." + classes.preview).setAttribute("src", newSrc);
            }
            function holderMousedown(event) {
                event.stopPropagation();
                var touchLength = 1;
                void 0 === event.clientX && (touchLength = event.touches.length), 1 === touchLength && ((runtime.userRotationInProgress = !0), (runtime.lastPosition = getPositionX(event)));
            }
            function holderMousemove(event) {
                event.stopPropagation();
                var deltaX,
                    imageContainer = event.target.closest("." + classes.container);
                runtime.userRotationInProgress &&
                ((deltaX = runtime.lastPosition - getPositionX(event)),
                Math.abs(deltaX) > config.pixelsPerFrame && (0 < deltaX ? prevImage(imageContainer) : deltaX < 0 && nextImage(imageContainer), (runtime.lastPosition = getPositionX(event))));
            }
            function holderMouseup() {
                runtime.userRotationInProgress = !1;
            }
            function play(playButton) {
                var imageContainer = playButton.parentElement.parentElement;
                playButton.classList.toggle("icon-play"),
                    playButton.classList.toggle("icon-pause"),
                    runtime.scriptRotationInProgress
                        ? ((runtime.scriptRotationInProgress = !1), window.clearInterval(runtime.intervals.play))
                        : ((runtime.scriptRotationInProgress = !0),
                            window.clearInterval(runtime.intervals.play),
                            (runtime.intervals.play = setInterval(function () {
                                nextImage(imageContainer);
                            }, config.rotationSpeed)));
            }
            function navigationPrevMousedown(event) {
                var imageContainer = event.target.parentElement.parentElement;
                runtime.scriptRotationInProgress
                    ? play(imageContainer.querySelector("." + classes.navigation.play))
                    : (prevImage(imageContainer),
                        clearInterval(runtime.intervals.prevImage),
                        (runtime.intervals.prevImage = setInterval(function () {
                            prevImage(imageContainer);
                        }, config.rotationSpeed)));
            }
            function navigationNextMousedown(event) {
                var imageContainer = event.target.parentElement.parentElement;
                runtime.scriptRotationInProgress
                    ? play(imageContainer.querySelector("." + classes.navigation.play))
                    : (nextImage(imageContainer),
                        clearInterval(runtime.intervals.nextImage),
                        (runtime.intervals.nextImage = setInterval(function () {
                            nextImage(imageContainer);
                        }, config.rotationSpeed)));
            }
            function navigationFullscreenClick(body, imageContainer) {
                var fullscreenButton,
                    imageContainer = (fullscreenButton = void 0 !== imageContainer ? document.getElementsByClassName(classes.fullscreenTarget)[0].querySelector("." + classes.navigation.fullscreen) : body.target).closest(".image360"),
                    body = document.getElementsByTagName("body")[0];
                fullscreenButton.classList.contains(classes.iconFullscreenTurnedOff)
                    ? (runtime.fullscreenImagesLoaded || ((runtime.fullscreenImagesLoaded = !0), buildImage(imageContainer, "fullscreen")),
                        (runtime.fullscreenOn = !0),
                        body.classList.add(classes.fullscreenOn),
                        imageContainer.classList.add(classes.fullscreenTarget),
                        fullscreenButton.classList.add(classes.iconFullscreenTurnedOn),
                        fullscreenButton.classList.remove(classes.iconFullscreenTurnedOff),
                        switchSrc(imageContainer, runtime.currentFrame, "fullscreen"))
                    : ((runtime.fullscreenOn = !1),
                        body.classList.remove(classes.fullscreenOn),
                        imageContainer.classList.remove(classes.fullscreenTarget),
                        fullscreenButton.classList.remove(classes.iconFullscreenTurnedOn),
                        fullscreenButton.classList.add(classes.iconFullscreenTurnedOff),
                        switchSrc(imageContainer, runtime.currentFrame, "normal"));
            }
            imageHolder.classList.add(classes.holder),
                imageContainer.appendChild(imageHolder),
                (function (imageContainer, imageHolder) {
                    imageHolder.addEventListener("dragstart", function (event) {
                        event.preventDefault(), runtime.scriptRotationInProgress && play(imageContainer.querySelector("." + classes.navigation.play));
                    }),
                        shoptet.helpers.isTouchDevice()
                            ? (imageContainer.addEventListener("touchstart", function handler() {
                                buildImage(imageContainer, "normal"), imageContainer.removeEventListener("touchstart", handler);
                            }),
                                imageHolder.addEventListener("touchstart", holderMousedown),
                                imageHolder.addEventListener("touchmove", function (event) {
                                    holderMousemove(event);
                                }),
                                imageHolder.addEventListener("touchend", holderMouseup),
                                document.addEventListener("touchend", holderMouseup))
                            : (imageContainer.addEventListener("mouseenter", function handler() {
                                buildImage(imageContainer, "normal"), imageContainer.removeEventListener("mouseenter", handler);
                            }),
                                imageHolder.addEventListener("mousedown", holderMousedown),
                                imageHolder.addEventListener("mousemove", function (event) {
                                    holderMousemove(event);
                                }),
                                imageHolder.addEventListener("mouseup", holderMouseup),
                                document.addEventListener("mouseup", holderMouseup));
                    window.addEventListener("keydown", function (e) {
                        !runtime.fullscreenOn || (e.keyCode !== shoptet.common.keyCodes.escape && e.keyCode !== shoptet.common.keyCodes.backspace) || (e.preventDefault(), navigationFullscreenClick(e, !0));
                    });
                })(imageContainer, imageHolder);
        }
        document.addEventListener("DOMContentLoaded", function () {
            var key,
                elements = document.getElementsByClassName("image360");
            for (key in elements) elements.hasOwnProperty(key) && photo360init(elements[key]);
        });
    })(shoptet),
    (function (shoptet) {
        function getDeliveryPointName(stockCode) {
            return shoptet.stockAvailabilities.content.stocks[stockCode].title;
        }
        function getDeliveryPointAmount(stockCode, productId, variantCode) {
            return shoptet.stockAvailabilities.content.products[productId].codes.hasOwnProperty(variantCode) && shoptet.stockAvailabilities.content.products[productId].codes[variantCode].stocks[stockCode];
        }
        function getStockAvailabilities(productIds) {
            !1 === shoptet.stockAvailabilities.content &&
            shoptet.ajax.makeAjaxRequest(
                shoptet.config.stockAmountUrl + "?ids[]=" + productIds.join("&ids[]="),
                shoptet.ajax.requestTypes.get,
                "",
                {
                    success: function (response) {
                        (shoptet.stockAvailabilities.content = response.getPayload()), shoptet.stockAvailabilities.setStockAvailabilities();
                    },
                    error: function () {
                        showMessage(shoptet.messages.ajaxError, "error");
                    },
                },
                { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
            );
        }
        function setStockAvailabilities() {
            for (var elements = document.getElementsByClassName("product-stock-amount"), i = 0; i < elements.length; i++) {
                var stock,
                    deliveryPointName,
                    deliveryPointAmount,
                    element = elements[i],
                    title = [];
                for (stock in shoptet.stockAvailabilities.content.stocks) {
                    shoptet.stockAvailabilities.content.stocks.hasOwnProperty(stock) &&
                    ((deliveryPointName = shoptet.stockAvailabilities.getDeliveryPointName(stock)),
                    void 0 !== (deliveryPointAmount = shoptet.stockAvailabilities.getDeliveryPointAmount(stock, element.getAttribute("data-product-id"), element.getAttribute("data-variant-code"))) &&
                    (!1 === deliveryPointAmount
                        ? (deliveryPointAmount = "-")
                        : "number" == typeof deliveryPointAmount && (deliveryPointAmount = shoptet.helpers.toLocaleFloat(deliveryPointAmount, element.getAttribute("data-decimals"), !0)),
                    deliveryPointName &&
                    !1 !== deliveryPointAmount &&
                    (title.push(deliveryPointName + " " + deliveryPointAmount + element.getAttribute("data-variant-unit")), element.setAttribute("title", title.join("<br />")), fixTooltipAfterChange(element))));
                }
            }
        }
        function attachEventListeners() {
            shoptet.stockAvailabilities.content = !1;
            for (var elements = document.getElementsByClassName("product-stock-amount"), i = 0; i < elements.length; i++) {
                var element = elements[i];
                element.removeEventListener("mouseenter", shoptet.stockAvailabilities.mouseEnterListener),
                    element.addEventListener("mouseenter", shoptet.stockAvailabilities.mouseEnterListener),
                    element.removeEventListener("mouseleave", shoptet.stockAvailabilities.mouseLeaveListener),
                    element.addEventListener("mouseleave", shoptet.stockAvailabilities.mouseLeaveListener);
            }
        }
        function mouseEnterListener(e) {
            if ((e.target.classList.add("hovered"), !1 === shoptet.stockAvailabilities.content)) {
                for (var productIds = [], elements = document.getElementsByClassName("product-stock-amount"), i = 0; i < elements.length; i++) productIds.push(elements[i].getAttribute("data-product-id"));
                shoptet.stockAvailabilities.getStockAvailabilities(productIds);
            }
        }
        function mouseLeaveListener(e) {
            e.target.classList.remove("hovered");
        }
        (shoptet.stockAvailabilities = shoptet.stockAvailabilities || {}),
            (shoptet.stockAvailabilities.content = !1),
            (shoptet.stockAvailabilities.events = ["DOMContentLoaded", "ShoptetDOMPageContentLoaded", "ShoptetDOMPageMoreProductsLoaded", "ShoptetDOMCartContentLoaded"]),
            shoptet.scripts.libs.stockAvailabilities.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "stockAvailabilities");
            });
        for (var i = 0; i < shoptet.stockAvailabilities.events.length; i++) document.addEventListener(shoptet.stockAvailabilities.events[i], shoptet.stockAvailabilities.attachEventListeners);
    })(shoptet),
    (function (shoptet) {
        function initSurcharges() {
            var dataLayer,
                savePriceRatio,
                surcharges = document.querySelectorAll(".surcharge-list .surcharge-parameter");
            try {
                dataLayer = getShoptetDataLayer();
            } catch (error) {
                dataLayer = !1;
            }
            dataLayer && (savePriceRatio = dataLayer.customer.priceRatio),
            savePriceRatio && (shoptet.surcharges.customerPriceRatio = savePriceRatio),
            surcharges.length &&
            surcharges.forEach(function (elem) {
                elem.addEventListener("change", shoptet.surcharges.updatePrices);
            });
        }
        function getSurchargePrices(activeOptions) {
            activeOptions = activeOptions.querySelectorAll("select.surcharge-parameter option:checked");
            (shoptet.surcharges.totalSurchargeFinalPrice = 0),
                (shoptet.surcharges.totalSurchargeAdditionalPrice = 0),
                activeOptions.forEach(function (additionalPrice) {
                    var finalPrice,
                        property,
                        valueId = additionalPrice.value;
                    for (property in (valueId &&
                    !shoptet.surcharges.values.hasOwnProperty(valueId) &&
                    ((shoptet.surcharges.values[valueId] = {}),
                        (finalPrice = additionalPrice.getAttribute("data-surcharge-final-price")),
                        (additionalPrice = additionalPrice.getAttribute("data-surcharge-additional-price")),
                        (shoptet.surcharges.values[valueId].finalPrice = null === finalPrice ? 0 : parseFloat(finalPrice)),
                        (shoptet.surcharges.values[valueId].additionalPrice = null === additionalPrice ? 0 : parseFloat(additionalPrice))),
                        shoptet.surcharges.values))
                        property === valueId &&
                        ((shoptet.surcharges.totalSurchargeFinalPrice += shoptet.surcharges.values[property].finalPrice), (shoptet.surcharges.totalSurchargeAdditionalPrice += shoptet.surcharges.values[property].additionalPrice));
                });
        }
        function writePrices(wrapper) {
            var finalPriceWrapper = wrapper.querySelectorAll(".price-final-holder.calculated:not(.noDisplay)"),
                additionalPriceWrapper = wrapper.querySelectorAll(".price-additional-holder.calculated:not(.noDisplay)");
            shoptet.surcharges.customerPriceRatio && ((shoptet.surcharges.totalSurchargeFinalPrice *= shoptet.surcharges.customerPriceRatio), (shoptet.surcharges.totalSurchargeAdditionalPrice *= shoptet.surcharges.customerPriceRatio));
            for (var i = 0; i < finalPriceWrapper.length; i++) {
                var finalPrice = parseFloat(finalPriceWrapper.item(i).getAttribute("data-price"));
                (finalPrice += shoptet.surcharges.totalSurchargeFinalPrice), (finalPrice = Number(finalPrice).ShoptetFormatAsCurrency()), (finalPriceWrapper.item(i).querySelector(".calculated-price").textContent = finalPrice);
            }
            for (i = 0; i < additionalPriceWrapper.length; i++) {
                var additionalPrice = parseFloat(additionalPriceWrapper.item(i).getAttribute("data-price"));
                (additionalPrice += shoptet.surcharges.totalSurchargeAdditionalPrice),
                    (additionalPrice = Number(additionalPrice).ShoptetFormatAsCurrency()),
                    (additionalPriceWrapper.item(i).querySelector(".calculated-price").textContent = additionalPrice);
            }
        }
        function updatePrices(e) {
            getSurchargePrices(document), writePrices(document), shoptet.scripts.signalCustomEvent("ShoptetSurchargesPriceUpdated", e.target);
        }
        (shoptet.surcharges = shoptet.surcharges || {}),
            shoptet.scripts.libs.surcharges.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "surcharges");
            }),
            (shoptet.surcharges.values = {}),
            (shoptet.surcharges.totalSurchargeFinalPrice = 0),
            (shoptet.surcharges.totalSurchargeAdditionalPrice = 0),
            (shoptet.surcharges.customerPriceRatio = null);
    })(shoptet),
    (function (shoptet) {
        function disableAddingToCart() {
            document.getElementsByTagName("body")[0].classList.add("disabled-add-to-cart");
        }
        function enableAddingToCart() {
            document.getElementsByTagName("body")[0].classList.remove("disabled-add-to-cart", "variant-not-chosen");
        }
        function hasToDisableCartButton() {
            return (
                $("body").hasClass("type-product") &&
                !!$('.variant-list option[value=""]:selected, .variant-list option[data-disable-button="1"]:selected, .variant-default:checked, .variant-list .advanced-parameter input[data-disable-button="1"]:checked').length
            );
        }
        function handleSubmit($el) {
            if ("product-detail-form" === $el.attr("id")) {
                var variantNotSelected = !1;
                $(".variant-list select").each(function () {
                    "" == $(this).val() && (variantNotSelected = !0);
                });
                var $target = $(".variant-not-chosen-anchor");
                if (variantNotSelected || $(".variant-default").is(":checked"))
                    return (
                        $("body").addClass("variant-not-chosen"),
                            (shoptet.variantsCommon.reasonToDisable = shoptet.messages.chooseVariant),
                            showMessage(shoptet.variantsCommon.reasonToDisable, "error", "", !1, !1),
                            void setTimeout(function () {
                                scrollToEl($target);
                            }, shoptet.config.animationDuration)
                    );
                if ($("body").hasClass("disabled-add-to-cart"))
                    return void (
                        shoptet.variantsCommon.reasonToDisable &&
                        (showMessage(shoptet.variantsCommon.reasonToDisable, "error", "", !1, !1),
                            setTimeout(function () {
                                scrollToEl($target);
                            }, shoptet.config.animationDuration))
                    );
            }
            return 1;
        }
        function handleBrowserValueRestoration() {
            window.addEventListener("load", function () {
                for (var elements = document.querySelectorAll(".variant-list select, .surcharge-list select, .advanced-parameter input:checked"), i = 0; i < elements.length; i++)
                    "" !== elements[i].value && shoptet.scripts.signalNativeEvent("change", elements[i]);
            });
        }
        function updateQuantityTooltips($form, minimumAmount, maximumAmount) {
            var templateGeneration = shoptet.abilities.about.generation;
            function updateQuantityTooltip_2gen(el, newToolTipTitle) {
                el &&
                (el.tooltip().getTip() || el.tooltip().show().hide(),
                    (newToolTipTitle = replaceNumberAtTooltip(el.tooltip().getTip().find(".tooltip-content").text(), newToolTipTitle)),
                    el.tooltip().getTip().find(".tooltip-content").text(newToolTipTitle));
            }
            function updateQuantityTooltip_3gen(el, newToolTipTitle) {
                el && ((newToolTipTitle = replaceNumberAtTooltip(el.data("original-title"), newToolTipTitle)), el.attr("data-original-title", newToolTipTitle), fixTooltipAfterChange(el));
            }
            function replaceNumberAtTooltip(txt, val) {
                return txt.replace(/\b\d+([\.,]\d+)?/g, val);
            }
            3 === templateGeneration
                ? (updateQuantityTooltip_3gen($form.find(".js-decrease-tooltip"), minimumAmount), updateQuantityTooltip_3gen($form.find(".js-increase-tooltip"), maximumAmount))
                : (2 !== templateGeneration && 1 !== templateGeneration) || (updateQuantityTooltip_2gen($form.find(".js-remove-pcs-tooltip"), minimumAmount), updateQuantityTooltip_2gen($form.find(".js-add-pcs-tooltip"), maximumAmount));
        }
        function hideQuantityTooltips() {
            $(".js-increase-tooltip, .js-decrease-tooltip").tooltip("hide"),
                $(".js-add-pcs-tooltip, .js-remove-pcs-tooltip").each(function () {
                    $(this).tooltip().hide();
                });
        }
        (shoptet.variantsCommon = shoptet.variantsCommon || {}),
            shoptet.scripts.libs.variantsCommon.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "variantsCommon");
            }),
            (shoptet.variantsCommon.reasonToDisable = !1),
            (shoptet.variantsCommon.noDisplayClasses = "no-display noDisplay");
    })(shoptet),
    (function (shoptet) {
        function handler() {
            var $simpleVariants,
                $variant,
                $activeOption = $(".advanced-parameter input").length
                    ? (($simpleVariants = $(".advanced-parameter input")), $(".advanced-parameter input:checked"))
                    : (($simpleVariants = $("#simple-variants-select")), $("#simple-variants-select option:selected"));
            $simpleVariants.length &&
            ($activeOption.attr("data-disable-reason") && (shoptet.variantsCommon.reasonToDisable = $activeOption.attr("data-disable-reason")),
                shoptet.variantsCommon.hasToDisableCartButton() ? shoptet.variantsCommon.disableAddingToCart() : shoptet.variantsCommon.enableAddingToCart()),
                $simpleVariants.bind("change ShoptetSelectedParametersReset", function (e) {
                    if ((shoptet.scripts.signalCustomEvent("ShoptetSimpleVariantChange", e.target), hideMsg(!0), $(this).is("input"))) {
                        if ((($variant = $(this)).parents(".variant-list").find(".advanced-parameter-inner").removeClass("yes-before"), "ShoptetSelectedParametersReset" === e.type)) return;
                        $variant.siblings(".advanced-parameter-inner").addClass("yes-before");
                    } else $variant = $(this).find("option:selected");
                    shoptet.variantsSimple.switcher($variant),
                        (shoptet.variantsSimple.loadedVariant = $variant),
                        (shoptet.variantsCommon.reasonToDisable = $variant.attr("data-disable-reason")),
                        shoptet.variantsCommon.reasonToDisable
                            ? (shoptet.variantsCommon.disableAddingToCart(), showMessage(shoptet.variantsCommon.reasonToDisable, "error", "", !1, !1), shoptet.scripts.signalCustomEvent("ShoptetVariantUnavailable"))
                            : shoptet.scripts.signalCustomEvent("ShoptetVariantAvailable");
                });
        }
        function switcher($variant) {
            shoptet.variantsCommon.hasToDisableCartButton() ? shoptet.variantsCommon.disableAddingToCart() : shoptet.variantsCommon.enableAddingToCart();
            var $form = $("form#product-detail-form");
            $variant.attr("data-codeid") && $form.find("input[name=priceId]").val($variant.attr("data-codeid"));
            var bigImageUrl = !$variant.attr("data-preselected");
            shoptet.tracking.trackProducts($form[0], $variant.data("codeid"), "ViewContent", [shoptet.tracking.trackFacebookPixel]),
            bigImageUrl && shoptet.tracking.trackProducts($form[0], $variant.data("codeid"), "detail", [shoptet.tracking.trackGoogleProductDetail]);
            bigImageUrl = $variant.attr("data-big");
            void 0 !== bigImageUrl && (($cofidis = resolveImageFormat()), shoptet.products.replaceImage(bigImageUrl, $variant.attr("data-" + $cofidis.format), $cofidis.link));
            var $cofidis = $variant.data("index");
            void 0 !== $cofidis &&
            ($(".p-detail-inner .choose-variant, .p-detail-inner .default-variant, .p-code .choose-variant, .p-code .default-variant").addClass(shoptet.variantsCommon.noDisplayClasses),
                0 == $cofidis
                    ? $(".p-detail-inner .default-variant, .p-code .default-variant").removeClass(shoptet.variantsCommon.noDisplayClasses)
                    : ($(".p-detail-inner .choose-variant." + $cofidis + ", .p-code .choose-variant." + $cofidis).removeClass(shoptet.variantsCommon.noDisplayClasses),
                        $(".add-to-cart .amount")
                            .val($variant.data("min"))
                            .attr({ min: $variant.data("min"), max: $variant.data("max") })
                            .data({ min: $variant.data("min"), max: $variant.data("max"), decimals: $variant.data("decimals") }),
                    ($cofidis = $("#cofidis")).length && shoptet.cofidis.calculator($(".price-final-holder:visible"), $cofidis),
                        shoptet.variantsCommon.updateQuantityTooltips($form, $variant.data("min"), $variant.data("max")))),
            "function" == typeof shoptet.products.checkDiscountFlag && shoptet.products.checkDiscountFlag();
        }
        (shoptet.variantsSimple = shoptet.variantsSimple || {}),
            shoptet.scripts.libs.variantsSimple.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "variantsSimple");
            }),
            (shoptet.variantsSimple.loadedVariant = !1);
    })(shoptet),
    (function (shoptet) {
        function handler() {
            shoptet.surcharges.initSurcharges();
            var $splitParameters = $(".variant-list .hidden-split-parameter, .variant-list .split-parameter");
            $splitParameters.length &&
            (shoptet.variantsCommon.hasToDisableCartButton() ? shoptet.variantsCommon.disableAddingToCart() : shoptet.variantsCommon.enableAddingToCart(),
                $splitParameters.bind("change ShoptetSelectedParametersReset", function (variantCode) {
                    shoptet.scripts.signalCustomEvent("ShoptetSplitVariantParameterChange", variantCode.target), shoptet.variantsSplit.showVariantDependent(), shoptet.surcharges.updatePrices(), hideMsg(!0);
                    var parameterValues = [],
                        parameterNames = [],
                        valueIsMissing = !1;
                    if (
                        ($splitParameters.each(function () {
                            parameterNames.push($(this).attr("data-parameter-id"));
                            var value = $("input:checked, option:selected", this).val();
                            "" === $.trim(value)
                                ? ((valueIsMissing = !0), (shoptet.variantsCommon.reasonToDisable = shoptet.messages.chooseVariant), $(this).parents(".variant-list").removeClass("variant-selected"))
                                : $(this).parents(".variant-list").addClass("variant-selected"),
                                parameterValues.push(value);
                        }),
                            !valueIsMissing)
                    ) {
                        for (var tempVariantCode = [], i = 0; i < parameterValues.length; i++) tempVariantCode.push(String(parameterNames[i]) + "-" + String(parameterValues[i]));
                        tempVariantCode.sort();
                        variantCode = tempVariantCode.join("-");
                        shoptet.variantsCommon.disableAddingToCart(), $("input:checked, option:selected", this).attr("data-preselected") ? shoptet.variantsSplit.getData(variantCode, 0) : shoptet.variantsSplit.getData(variantCode, 1);
                    }
                }),
            $("input:not(.variant-default):checked, option:not(.variant-default):selected", $splitParameters).length && $splitParameters.trigger("change"));
        }
        function getData($cofidis, replaceInfo) {
            var data, $form;
            shoptet.variantsSplit.necessaryVariantData.hasOwnProperty($cofidis)
                ? ((data = shoptet.variantsSplit.necessaryVariantData[$cofidis]),
                    ($form = $("form#product-detail-form")),
                    ($cofidis = $("#product-detail-form .amount")),
                    $form.find("input[name=priceId]").val(data.id),
                    shoptet.tracking.trackProducts($form[0], data.id, "ViewContent", [shoptet.tracking.trackFacebookPixel]),
                replaceInfo && shoptet.tracking.trackProducts($form[0], data.id, "detail", [shoptet.tracking.trackGoogleProductDetail]),
                data.variantImage && ((replaceInfo = resolveImageFormat()), shoptet.products.replaceImage(data.variantImage.big, data.variantImage[replaceInfo.format], replaceInfo.link)),
                    data.isNotSoldOut
                        ? (shoptet.variantsCommon.enableAddingToCart(), hideMsg())
                        : ((shoptet.variantsCommon.reasonToDisable = shoptet.messages.unavailableVariant), showMessage(shoptet.variantsCommon.reasonToDisable, "error", "", !1, !1)),
                    $cofidis.val(data.minimumAmount).data({ min: data.minimumAmount, max: data.maximumAmount, decimals: data.decimalCount }).attr({ min: data.minimumAmount, max: data.maximumAmount }),
                ($cofidis = $("#cofidis")).length && shoptet.cofidis.calculator($(".price-final-holder:visible"), $cofidis),
                    shoptet.variantsCommon.updateQuantityTooltips($form, data.minimumAmount, data.maximumAmount),
                    shoptet.scripts.signalCustomEvent("ShoptetVariantAvailable"))
                : ((shoptet.variantsCommon.reasonToDisable = shoptet.messages.unavailableVariant), showMessage(shoptet.messages.unavailableVariant, "error", "", !1, !1), shoptet.scripts.signalCustomEvent("ShoptetVariantUnavailable"));
        }
        function showVariantDependent() {
            var parameterIds = [],
                showDefault = !1;
            $(".variant-list .hidden-split-parameter, .variant-list .split-parameter").each(function () {
                var parameterId = this.id.replace("parameter-id-", ""),
                    valueId = $(this).find("input:checked, option:selected").val();
                "" == valueId ? (showDefault = !0) : parameterIds.push(parameterId + "-" + valueId);
            }),
                $(".p-detail-inner .parameter-dependent, .p-code .parameter-dependent").addClass(shoptet.variantsCommon.noDisplayClasses);
            var classToDisplay = "default-variant";
            showDefault || (parameterIds.sort(), (classToDisplay = parameterIds.join("-"))),
                $(".p-detail-inner .parameter-dependent." + classToDisplay + ", .p-code .parameter-dependent." + classToDisplay).removeClass(shoptet.variantsCommon.noDisplayClasses),
            "function" == typeof shoptet.products.checkDiscountFlag && shoptet.products.checkDiscountFlag();
        }
        (shoptet.variantsSplit = shoptet.variantsSplit || {}),
            shoptet.scripts.libs.variantsSplit.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "variantsSplit");
            });
    })(shoptet),
    (function (shoptet) {
        function setupAllParameters(params) {
            var displayMessage = !1;
            params.forEach(function (param) {
                displayMessage = shoptet.variantsUnavailable.setupCurrentParameter(document.getElementById(param), params, shoptet.variantsUnavailable.availableVariants);
            });
            var jsUnavailableCombinationMessage = document.getElementById("jsUnavailableCombinationMessage");
            jsUnavailableCombinationMessage && (displayMessage ? jsUnavailableCombinationMessage.classList.remove("no-display") : jsUnavailableCombinationMessage.classList.add("no-display"));
        }
        function attachEventListeners(el, params) {
            ["change", "ShoptetSelectedParametersReset"].forEach(function (event) {
                el.addEventListener(event, function () {
                    shoptet.variantsUnavailable.setupAllParameters(params);
                });
            });
        }
        function getAvailableCombinations(variants, selected, currentParam) {
            var available = {};
            return (
                variants.forEach(function (variant) {
                    var param,
                        matches = !0;
                    for (param in selected)
                        if (selected.hasOwnProperty(param) && null !== selected[param] && variant[param] !== selected[param]) {
                            matches = !1;
                            break;
                        }
                    matches && (available[variant[currentParam]] = !0);
                }),
                    available
            );
        }
        function getSelected(params, currentParam) {
            var selected = {};
            return (
                params.forEach(function (element) {
                    var val;
                    element !== currentParam &&
                    ((val = "SELECT" === (val = document.getElementById(element)).tagName ? shoptet.common.getSelectValue(val) : shoptet.common.getCheckedInputValue(val) ? shoptet.common.getCheckedInputValue(val) : ""),
                        (selected[element] = "" === val ? null : val));
                }),
                    selected
            );
        }
        function getExistingOptions(el) {
            var existingOptions = [];
            options = "SELECT" === el.tagName ? el.options : el.querySelectorAll(".advanced-parameter");
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                option.getAttribute("data-choose") || existingOptions.push(option);
            }
            return existingOptions;
        }
        function getUnavailableOptgroup(el) {
            var optgroup,
                unavailableOptgroup = el.querySelector("." + shoptet.variantsUnavailable.classes.unavailableOptgroup);
            return (
                unavailableOptgroup ||
                ((optgroup = document.createElement("optgroup")).setAttribute("label", shoptet.messages.unavailableCombination),
                    optgroup.classList.add("unavailable-variants"),
                    el.append(optgroup),
                    (unavailableOptgroup = el.querySelector("." + shoptet.variantsUnavailable.classes.unavailableOptgroup))),
                    unavailableOptgroup
            );
        }
        function handleOptions(el, available, existing) {
            for (var param in existing) {
                var unavailableOptgroup, option;
                existing.hasOwnProperty(param) &&
                ((option = "SELECT" === el.tagName ? ((unavailableOptgroup = shoptet.variantsUnavailable.getUnavailableOptgroup(el)), existing[param]) : existing[param].querySelector("input")),
                    available.hasOwnProperty(option.value)
                        ? (option.classList.remove(shoptet.variantsUnavailable.classes.unavailableOption),
                            "SELECT" === el.tagName ? shoptet.variantsUnavailable.moveOptionFromUnavailable(option, unavailableOptgroup) : option.parentElement.classList.remove(shoptet.variantsUnavailable.classes.unavailableOptionWrapper))
                        : (option.classList.add(shoptet.variantsUnavailable.classes.unavailableOption),
                            "SELECT" === el.tagName ? unavailableOptgroup.append(option) : option.parentElement.classList.add(shoptet.variantsUnavailable.classes.unavailableOptionWrapper)));
            }
        }
        function getOption(el, param) {
            var selector;
            return "SELECT" === el.tagName ? ((selector = 'option[value="' + param + '"]'), el.querySelector(selector)) : ((selector = 'input[value="' + param + '"]'), el.querySelector(selector).parentNode);
        }
        function moveOptionFromUnavailable(option, unavailableOptgroup) {
            for (var options = unavailableOptgroup.querySelectorAll("option"), i = 0; i < options.length; i++) {
                options[i].value === option.value && unavailableOptgroup.parentNode.insertBefore(option, unavailableOptgroup);
            }
        }
        function areUnavailableOptionsSelected(unavailableOptions) {
            for (var i = 0; i < unavailableOptions.length; i++) if (unavailableOptions[i].selected || unavailableOptions[i].checked) return 1;
        }
        function setupCurrentParameter(unavailableOptions, selected, variants) {
            var unavailableOptgroup = shoptet.variantsUnavailable.getExistingOptions(unavailableOptions),
                available = unavailableOptions.getAttribute("id"),
                selected = shoptet.variantsUnavailable.getSelected(selected, available),
                available = shoptet.variantsUnavailable.getAvailableCombinations(variants, selected, available);
            if ((shoptet.variantsUnavailable.handleOptions(unavailableOptions, available, unavailableOptgroup), "SELECT" === unavailableOptions.tagName)) {
                unavailableOptgroup = unavailableOptions.querySelector("." + shoptet.variantsUnavailable.classes.unavailableOptgroup);
                if (!unavailableOptgroup) return;
                unavailableOptgroup.childElementCount || unavailableOptgroup.parentNode.removeChild(unavailableOptgroup), shoptet.variantsUnavailable.sortOptions(unavailableOptions);
            }
            unavailableOptions = unavailableOptions.querySelectorAll("." + shoptet.variantsUnavailable.classes.unavailableOption);
            return !(unavailableOptions.length < 1) && shoptet.variantsUnavailable.areUnavailableOptionsSelected(unavailableOptions);
        }
        function sortOptions(el) {
            for (var options = [], i = 0; i < el.options.length; i++) "SELECT" === el.options[i].parentNode.tagName && options.push(el.options[i]);
            options.sort(function (a, b) {
                return a.getAttribute("data-index") - b.getAttribute("data-index");
            }),
                options.forEach(function (option) {
                    el.appendChild(option);
                });
            var optgroup = el.querySelector("optgroup");
            optgroup && el.appendChild(optgroup);
        }
        document.addEventListener("DOMContentLoaded", function () {
            if (void 0 !== shoptet.variantsUnavailable.availableVariantsResource) {
                shoptet.variantsUnavailable.availableVariants = [];
                for (var i = 0; i < shoptet.variantsUnavailable.availableVariantsResource.length; i++) {
                    var splitted = shoptet.variantsUnavailable.availableVariantsResource[i].split("-"),
                        currentVariant = {};
                    !(function () {
                        for (var i = 0; i < splitted.length - 1; i++) i % 2 == 0 && (currentVariant["parameter-id-" + splitted[i]] = splitted[i + 1]);
                    })(),
                        shoptet.variantsUnavailable.availableVariants.push(currentVariant);
                }
                var el,
                    params = [],
                    parametersHolders = document.getElementsByClassName(shoptet.variantsUnavailable.classes.parametersHolder);
                for (el in parametersHolders) parametersHolders.hasOwnProperty(el) && params.push(parametersHolders[el].getAttribute("id"));
                shoptet.variantsUnavailable.setupAllParameters(params),
                    params.forEach(function (optionsWrapper) {
                        optionsWrapper = document.getElementById(optionsWrapper);
                        if ("SELECT" === optionsWrapper.tagName) shoptet.variantsUnavailable.attachEventListeners(optionsWrapper, params);
                        else for (var inputs = optionsWrapper.querySelectorAll(".advanced-parameter input"), i = 0; i < inputs.length; i++) shoptet.variantsUnavailable.attachEventListeners(inputs[i], params);
                    }),
                    (resetLink = document.getElementById("jsSplitVariantsReset")),
                resetLink &&
                resetLink.addEventListener("click", function (e) {
                    e.preventDefault();
                    for (var activeInput, parametersHolder = document.querySelectorAll("." + shoptet.variantsUnavailable.classes.parametersHolder), i = 0; i < parametersHolder.length; i++) {
                        "SELECT" === parametersHolder[i].tagName
                            ? (shoptet.scripts.signalCustomEvent("ShoptetSelectedParametersReset", parametersHolder[i]), (parametersHolder[i].options.selectedIndex = 0))
                            : ((parametersHolder[i].querySelector('[data-index="0"]').checked = !0),
                                (activeInput = parametersHolder[i].querySelector('input:not([data-index="0"])')),
                                shoptet.scripts.signalCustomEvent("ShoptetSelectedParametersReset", activeInput));
                    }
                });
            }
        }),
            (shoptet.variantsUnavailable = shoptet.variantsUnavailable || {}),
            shoptet.scripts.libs.variantsUnavailable.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "variantsUnavailable");
            }),
            (shoptet.variantsUnavailable.classes = {
                parametersHolder: "hidden-split-parameter",
                unavailableOptgroup: "unavailable-variants",
                unavailableOption: "unavailable-option",
                unavailableOptionWrapper: "unavailable-option-wrapper",
            });
    })(shoptet),
    (function (shoptet) {
        (shoptet.ajax = shoptet.ajax || {}),
            (shoptet.ajax.makeAjaxRequest = function (url, type, data, callbacks, header) {
                return new Promise(function (resolve, reject) {
                    void 0 === callbacks && (callbacks = {});
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open(type, url, !0),
                    header && header.hasOwnProperty("X-Shoptet-XHR") && "Shoptet_Coo7ai" === header["X-Shoptet-XHR"] && xmlhttp.setRequestHeader("X-Shoptet-XHR", "Shoptet_Coo7ai"),
                        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
                        header && header.hasOwnProperty("Content-Type")
                            ? xmlhttp.setRequestHeader("Content-Type", header["Content-Type"])
                            : type === shoptet.ajax.requestTypes.post && xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"),
                        (xmlhttp.onload = function () {
                            var response;
                            200 <= xmlhttp.status && xmlhttp.status < 300
                                ? ((response = new AjaxResponse(xmlhttp.response)),
                                    ["success", "failed", "redirect", "complete"].forEach(function (callback) {
                                        response.setCallback(callback, function () {
                                            callbacks.hasOwnProperty(callback) && "function" == typeof callbacks[callback] && callbacks[callback](response);
                                        });
                                    }),
                                    response.processResult(),
                                    response.showNotification(),
                                    resolve(response))
                                : reject({ status: this.status, statusText: this.statusText });
                        }),
                        (xmlhttp.onerror = function () {
                            reject({ status: this.status, statusText: this.statusText });
                        }),
                        xmlhttp.send(shoptet.common.serializeData(data));
                });
            }),
            (shoptet.ajax.requestTypes = { get: "GET", post: "POST" }),
            (shoptet.ajax.pendingClass = "ajax-pending-element");
    })(shoptet),
    (AjaxResponse.prototype.setCallback = function (callback, fn) {
        if ("function" != typeof fn) throw new Error("Argument is not a function");
        return (this.settings[callback] = fn), this;
    }),
    (AjaxResponse.prototype.isFailed = function () {
        return this.getCode() === this.R500_SERVER_ERROR;
    }),
    (AjaxResponse.prototype.isSuccess = function () {
        return this.getCode() === this.R200_OK;
    }),
    (AjaxResponse.prototype.isRedirected = function () {
        return null !== this.getFromPayload("returnUrl") && (this.getCode() === this.R301_REDIRECT || this.getCode() === this.R302_REDIRECT || this.getCode() === this.R303_REDIRECT);
    }),
    (AjaxResponse.prototype.redirect = function () {
        return this.isRedirected() && location.replace(this.getFromPayload("returnUrl")), !1;
    }),
    (AjaxResponse.prototype.getCode = function () {
        return this.response.code;
    }),
    (AjaxResponse.prototype.getMessage = function () {
        return this.response.message;
    }),
    (AjaxResponse.prototype.getMessages = function () {
        return this.response.messages;
    }),
    (AjaxResponse.prototype.getPayload = function () {
        return this.response.payload;
    }),
    (AjaxResponse.prototype.getFromPayload = function (key) {
        var payload = this.getPayload();
        return null !== payload && payload.hasOwnProperty(key) ? payload[key] : null;
    }),
    (AjaxResponse.prototype.showNotification = function () {
        var message = this.getMessage();
        return !!message && (this.isFailed() ? showMessage(message, "error") : showMessage(message, "success"), this);
    }),
    (AjaxResponse.prototype.processResult = function () {
        var callback = this.isFailed() ? this.settings.failed : this.isRedirected() ? (this.redirect(), this.settings.redirect) : this.settings.success;
        "function" == typeof callback && callback(this.getCode(), this.getMessage(), this.getPayload()), "function" == typeof this.settings.complete && this.settings.complete(this.getCode(), this.getMessage(), this.getPayload());
    }),
    (function (shoptet) {
        function updateCartButton(count, price) {
            var i,
                $cartWrapper = $(".place-cart-here"),
                $cartButton = $("#header .cart-count"),
                $priceHolder = $cartButton.find(".cart-price"),
                $overviewWrapper = $(".cart-overview");
            0 < count
                ? ($cartWrapper.addClass("full"),
                    (i = $cartButton.find("i")),
                0 < parseFloat(count) &&
                ((count = 99 < count ? "99+" : Math.round(parseFloat(count))), i.length ? i.text(count) : $cartButton.append("<i>" + count + "</i>").addClass("full"), $priceHolder.length && $priceHolder.text(price)))
                : ($cartWrapper.removeClass("full"), $cartButton.removeClass("full").find("i").remove(), $priceHolder.length && $priceHolder.text(shoptet.messages.emptyCart)),
            $overviewWrapper.length && ($overviewWrapper.find(".cart-overview-item-count").text(count), $overviewWrapper.find(".cart-overview-final-price").text(price)),
                shoptet.scripts.signalDomUpdate("ShoptetDOMCartCountUpdated");
        }
        function getCartContent(hide, callback) {
            var el,
                $cartContentWrapper,
                cartUrlSuffix = "";
            shoptet.config.orderingProcess.active && (cartUrlSuffix += "?orderingProcessActive=1"),
            shoptet.abilities.feature.simple_ajax_cart && $("body").hasClass("cart-window-visible") && ((cartUrlSuffix += -1 !== cartUrlSuffix.indexOf("?") ? "&" : "?"), (cartUrlSuffix += "simple_ajax_cart=1")),
                ($cartContentWrapper = $("#cart-wrapper").length ? ((el = "#cart-wrapper"), $(el).parent()) : ((el = ".place-cart-here"), $(el)));
            shoptet.ajax.makeAjaxRequest(
                shoptet.config.cartContentUrl + cartUrlSuffix,
                shoptet.ajax.requestTypes.get,
                "",
                {
                    success: function (response) {
                        -1 !== (response = response.getFromPayload("content")).indexOf("cart-empty") && $("body").addClass("cart-emptied"),
                            $cartContentWrapper.html(response),
                            $(el + " img").unveil(),
                            initColorbox(),
                            initTooltips(),
                        !1 !== hide && hideSpinner(),
                        "function" == typeof callback && callback(),
                            shoptet.scripts.signalDomLoad("ShoptetDOMCartContentLoaded");
                    },
                },
                { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
            );
        }
        function getAdvancedOrder() {
            shoptet.ajax.makeAjaxRequest(
                shoptet.config.advancedOrderUrl,
                shoptet.ajax.requestTypes.get,
                "",
                {
                    success: function (content) {
                        content = content.getFromPayload("content");
                        !1 !== content &&
                        shoptet.modal.open({
                            html: shoptet.content.colorboxHeader + content + shoptet.content.colorboxFooter,
                            width: shoptet.modal.config.widthLg,
                            className: shoptet.modal.config.classLg,
                            onComplete: function () {
                                $(".colorbox-html-content img").unveil(),
                                    $("body").removeClass(shoptet.config.bodyClasses),
                                0 < $(".overlay").length && $(".overlay").detach(),
                                    setTimeout(function () {
                                        "function" == typeof shoptet.productSlider.runProductSlider && shoptet.productSlider.runProductSlider(".advanced-order .product-slider"), shoptet.modal.shoptetResize();
                                    }, 1),
                                    shoptet.scripts.signalDomLoad("ShoptetDOMAdvancedOrderLoaded");
                            },
                        });
                    },
                },
                { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
            );
        }
        function functionsForCart(form, response) {
            shoptet.tracking.handleAction(form, response),
            void 0 === shoptet.config.showAdvancedOrder || shoptet.config.orderingProcess.active || $(form).hasClass("js-quantity-form") || $(form).hasClass("js-remove-form") || shoptet.cart.getAdvancedOrder();
        }
        function functionsForStep1() {
            shoptet.checkoutShared.getStatedValues(), shoptet.checkoutShared.setActiveShippingAndPayments(), shoptet.checkoutShared.displayApplePay(), shoptet.checkoutShared.setupDeliveryShipping(), shoptet.checkoutShared.payu();
        }
        function handleCartPostUpdate(action, el) {
            initTooltips(), shoptet.scripts.signalCustomEvent(shoptet.common.createEventNameFromFormAction(action), el), shoptet.scripts.signalCustomEvent("ShoptetCartUpdated", el);
        }
        function ajaxSubmitForm(action, form, callingFunctions, replaceContent, cartUrlSuffix) {
            var body = document.getElementsByTagName("body")[0];
            !0 === cartUrlSuffix && showSpinner();
            cartUrlSuffix = "";
            shoptet.abilities.feature.simple_ajax_cart && !shoptet.config.orderingProcess.active && ((cartUrlSuffix = "?simple_ajax_cart=1"), body.classList.add("ajax-pending"));
            shoptet.ajax.makeAjaxRequest(
                action + cartUrlSuffix,
                shoptet.ajax.requestTypes.post,
                shoptet.common.serializeForm(form),
                {
                    success: function (response) {
                        switch (replaceContent) {
                            case "cart":
                                var cartCallback;
                                shoptet.cart.updateCartButton(response.getFromPayload("count"), response.getFromPayload("price")),
                                    0 === shoptet.config.orderingProcess.step || body.classList.contains("cart-window-visible")
                                        ? ("functionsForCart" === callingFunctions &&
                                        (cartCallback = function () {
                                            shoptet.cart.functionsForCart(form, response), shoptet.cart.handleCartPostUpdate(action, document);
                                        }),
                                            shoptet.cart.getCartContent(!0, cartCallback))
                                        : (delete shoptet.events.cartLoaded,
                                            setTimeout(function () {
                                                hideSpinner();
                                            }, shoptet.config.dismissTimeout),
                                            hideSpinner());
                                break;
                            case !0:
                                var payloadContent = $(payload.content).find("#content-wrapper");
                                payloadContent.find("#toplist").remove(),
                                    $("#content-wrapper").replaceWith(payloadContent),
                                    $("#content-wrapper img").unveil(),
                                    initColorbox(),
                                    shoptet.modal.shoptetResize(),
                                    shoptet.scripts.signalDomLoad("ShoptetDOMPageContentLoaded");
                        }
                        dismissMessages(),
                        "functionsForCart" === callingFunctions && void 0 === cartCallback && shoptet.cart.functionsForCart(form, response),
                        "functionsForStep1" === callingFunctions && shoptet.cart.functionsForStep1(),
                        void 0 === cartCallback && shoptet.cart.handleCartPostUpdate(action, form);
                    },
                    failed: function (response) {
                        hideSpinner(),
                            $("html, body").animate({ scrollTop: 0 }, shoptet.config.animationDuration),
                        "functionsForCart" === callingFunctions &&
                        (0 === shoptet.config.orderingProcess.step || body.classList.contains("cart-window-visible")
                            ? shoptet.cart.getCartContent(!0, function () {
                                shoptet.cart.functionsForCart(form, response);
                            })
                            : (delete shoptet.events.cartLoaded, shoptet.cart.functionsForCart(form, response)));
                    },
                    complete: function () {
                        void 0 !== shoptet.content.addToNotifier && (500 !== response.response.code && (response.response.message += " " + shoptet.content.addToNotifier), delete shoptet.content.addToNotifier),
                            body.classList.remove("ajax-pending");
                    },
                },
                { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
            );
        }
        function updateQuantityInCart($input, timeout) {
            clearTimeout(shoptet.runtime.setPcsTimeout);
            var $parentForm = $input.parents("form"),
                displaySpinner = !0;
            !shoptet.abilities.feature.extended_ajax_cart && $("body").hasClass("user-action-visible") && (displaySpinner = !1),
                (shoptet.runtime.setPcsTimeout = setTimeout(function () {
                    shoptet.cart.ajaxSubmitForm($parentForm.attr("action"), $parentForm[0], "functionsForCart", "cart", displaySpinner);
                }, timeout));
        }
        function removeItemFromCart(displaySpinner) {
            var $parentForm = displaySpinner.parents("form"),
                displaySpinner = !0;
            !shoptet.abilities.feature.extended_ajax_cart && $("body").hasClass("user-action-visible") && (displaySpinner = !1),
                shoptet.cart.ajaxSubmitForm($parentForm.attr("action"), $parentForm[0], "functionsForCart", "cart", displaySpinner);
        }
        function toggleRelatedProducts($target) {
            $target.toggleClass("visible"), $target.prev("tr").toggleClass("related-visible");
        }
        document.addEventListener("DOMContentLoaded", function () {
            var $anotherShipping = $("html");
            $anotherShipping.on("change", "input.amount", function () {
                ($(this).parents(".cart-table").length || $(this).parents(".cart-widget-product-amount").length || $(this).parents(".ao-product").length) && shoptet.cart.updateQuantityInCart($(this), shoptet.config.updateQuantityTimeout);
            }),
                $anotherShipping.on("submit", ".quantity-form", function (e) {
                    return e.preventDefault(), shoptet.cart.updateQuantityInCart($(this).find("input.amount"), shoptet.config.updateQuantityTimeout), !1;
                }),
                $anotherShipping.on("click", ".show-related", function ($tr) {
                    $tr.preventDefault();
                    $tr = $(this).parents("tr").next(".related");
                    shoptet.cart.toggleRelatedProducts($tr), $tr.find("img").unveil();
                }),
                $anotherShipping.on("click", "#continue-order-button", function (e) {
                    $("#discountCouponCode").val() && (e.preventDefault(), showMessage(shoptet.messages.discountCouponWarning, "warning", "", !1, !0));
                }),
                $anotherShipping.on("click", ".free-gift-trigger", function (content) {
                    content.preventDefault(),
                        $(".free-gifts-wrapper img").each(function () {
                            $(this).attr("src", $(this).attr("data-src"));
                        });
                    content = $(".free-gifts-wrapper").html();
                    shoptet.modal.open({
                        html: shoptet.content.colorboxHeader + content + shoptet.content.colorboxFooter,
                        width: shoptet.modal.config.widthSm,
                        maxWidth: shoptet.modal.config.maxWidth,
                        maxHeight: shoptet.modal.config.maxHeight,
                        className: shoptet.modal.config.classSm,
                    }),
                        $("#colorbox input").remove();
                }),
                $anotherShipping.on("click", ".remove-item", function (e) {
                    e.preventDefault(), ($el = $(this)), shoptet.cart.removeItemFromCart($el);
                }),
                $anotherShipping.on("click", "#colorbox .free-gifts label", function ($form) {
                    $form.preventDefault();
                    var id = $(this).attr("for");
                    $(".free-gifts input").each(function () {
                        id == $(this).attr("id") ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                    }),
                        shoptet.modal.close();
                    $form = $(".free-gifts-wrapper form");
                    shoptet.cart.ajaxSubmitForm($form.attr("action"), $form[0], "functionsForCart", "cart", !0);
                }),
                $anotherShipping.on("submit", "form.pr-action, form.variant-submit", function (min) {
                    var $this, $amount, max, value;
                    min.preventDefault(),
                    shoptet.variantsCommon.handleSubmit($(this)) &&
                    ((value = ($amount = ($this = $(this)).find(".amount")).data("decimals") || 0),
                        (max = shoptet.helpers.toFloat($amount.data("max")) || shoptet.config.defaultProductMaxAmount),
                        (min = shoptet.helpers.toFloat($amount.data("min")) || shoptet.helpers.resolveMinimumAmount(value)),
                    max < (value = $amount.length ? shoptet.helpers.toFloat($amount.val()) : 1) && ($amount.val(max), (shoptet.content.addToNotifier = shoptet.messages.amountChanged)),
                    value < min && ($amount.val(min), (shoptet.content.addToNotifier = shoptet.messages.amountChanged)),
                        shoptet.cart.ajaxSubmitForm($this.attr("action"), $this[0], "functionsForCart", "cart", !0));
                }),
                $anotherShipping.on("submit", ".discount-coupon form", function ($this) {
                    $this.preventDefault();
                    $this = $(this);
                    shoptet.cart.ajaxSubmitForm($this.attr("action"), $this[0], "functionsForCart", "cart", !0);
                });
            var $shippingAddress = $("#additionalInformation");
            $shippingAddress.length && !$shippingAddress.hasClass("visible") && toggleRequiredAttributes($shippingAddress, "remove", !1);
            $shippingAddress = $("#shipping-address");
            $shippingAddress.length && !$shippingAddress.hasClass("visible") && toggleRequiredAttributes($shippingAddress, "remove", !1);
            var $companyInfo = $("#company-info");
            $companyInfo.length && !$companyInfo.hasClass("visible") && toggleRequiredAttributes($companyInfo, "remove", !1),
                $anotherShipping.on("change", 'input[name="customerGroupId"]', function () {
                    var $additionalInformation = $("#additionalInformation");
                    $(this).hasClass("show-full-profile")
                        ? $additionalInformation.hasClass("visible") ||
                        ($additionalInformation.addClass("visible"),
                            $(this).hasClass("is-wholesale")
                                ? ($("#company-shopping").parent().hasClass("unveiled") || $("#company-shopping").trigger("click"), $("#company-shopping").parent().hide(), toggleRequiredAttributes($companyInfo, "add", !1))
                                : ($("#company-shopping").parent().show(), toggleRequiredAttributes($companyInfo, "remove", !1)),
                            toggleRequiredAttributes($additionalInformation, "add", !0))
                        : $additionalInformation.hasClass("visible") && ($additionalInformation.removeClass("visible"), toggleRequiredAttributes($additionalInformation, "remove", !0));
                }),
                $anotherShipping.on("change", "#company-shopping", function () {
                    $companyInfo.hasClass("visible") ? toggleRequiredAttributes($companyInfo, "add", !1) : toggleRequiredAttributes($companyInfo, "remove", !1);
                }),
                $anotherShipping.on("change", "#another-shipping", function () {
                    shoptet.checkout.toggleAnotherShipping();
                });
            $anotherShipping = $("#another-shipping");
            $anotherShipping.length && $anotherShipping[0].hasAttribute("data-change") && ($anotherShipping.prop("checked", !0), shoptet.checkout.toggleAnotherShipping(!1));
        }),
            (shoptet.cart = shoptet.cart || {}),
            shoptet.scripts.libs.cart.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "cart");
            });
    })(shoptet),
    (function (shoptet) {
        function addToCart(payload, silent, configUrlType) {
            if ("object" != typeof payload) throw (shoptet.scripts.signalCustomEvent("ShoptetCartAddCartItemFailed"), new Error("Invalid function arguments"));
            configUrl = void 0 === configUrlType ? shoptet.config.addToCartUrl : configUrlType;
            var key,
                input,
                form = document.createElement("form");
            for (key in (form.setAttribute("action", configUrl), payload)) {
                if ("object" == typeof payload[key])
                    for (var j in payload[key]) {
                        (input = document.createElement("input")).setAttribute("name", key + "[" + j + "]"), input.setAttribute("value", payload[key][j]), form.appendChild(input);
                    }
                else (input = document.createElement("input")).setAttribute("name", key), input.setAttribute("value", payload[key]), form.appendChild(input);
            }
            void 0 !== silent && silent
                ? ((cartUrlSuffix = "?simple_ajax_cart=1"),
                    shoptet.ajax.makeAjaxRequest(
                        configUrl + cartUrlSuffix,
                        shoptet.ajax.requestTypes.post,
                        shoptet.common.serializeForm(form),
                        {
                            complete: function (response) {
                                console.log(response.response);
                            },
                        },
                        { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
                    ))
                : 3 !== shoptet.abilities.about.generation
                    ? ajaxAddToCart(configUrl, form)
                    : shoptet.cart.ajaxSubmitForm(configUrl, form, "functionsForCart", "cart", !0);
        }
        function removeFromCart(payload, silent) {
            addToCart(payload, silent, shoptet.config.removeFromCartUrl);
        }
        function updateQuantityInCart(payload, silent) {
            addToCart(payload, silent, shoptet.config.updateCartUrl);
        }
        (shoptet.cartShared = shoptet.cartShared || {}),
            shoptet.scripts.libs.cartShared.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "cartShared");
            });
    })(shoptet),
    (function (shoptet) {
        function initNewValidator(validator, element, event) {
            element.addEventListener(event, function () {
                validator(element);
            });
        }
        function formContainsInvalidFields(form) {
            return form.querySelectorAll(shoptet.validator.invalidFieldClasses).length;
        }
        function handleValidators(validators) {
            Object.keys(validators).forEach(function (key) {
                var innerKey,
                    currentValidator = validators[key];
                for (innerKey in currentValidator.elements)
                    "object" == typeof currentValidator.elements[innerKey] &&
                    currentValidator.events.forEach(function (event, index) {
                        shoptet.validator.initNewValidator(currentValidator.validator, currentValidator.elements[innerKey], event),
                        currentValidator.fireEvent &&
                        ((currentValidator.fireOneEvent && 0 < index) ||
                            (-1 !== shoptet.scripts.availableCustomEvents.indexOf(event)
                                ? shoptet.scripts.signalCustomEvent(event, currentValidator.elements[innerKey])
                                : shoptet.scripts.signalNativeEvent(event, currentValidator.elements[innerKey])));
                    });
            });
        }
        function getExistingMessage(elementWrapper) {
            return elementWrapper.querySelectorAll(".js-validator-msg");
        }
        function removeErrorMessage(element, messageType, errorRemoveEvent) {
            void 0 === errorRemoveEvent && (errorRemoveEvent = element.closest(".js-validated-element-wrapper"));
            var existingMessage = shoptet.validator.getExistingMessage(errorRemoveEvent);
            if (existingMessage.length) {
                for (var i = 0; i < existingMessage.length; i++)
                    (void 0 === messageType || existingMessage[i].dataset.type === messageType) && (existingMessage[i].parentNode.removeChild(existingMessage[i]), element.classList.remove("js-error-field"));
                errorRemoveEvent = new CustomEvent("shoptetRemoveErrorMessage", { bubbles: !0, detail: { element: element } });
                element.dispatchEvent(errorRemoveEvent);
            }
        }
        function addErrorMessage(element, messageType) {
            var elementWrapper = element.closest(".js-validated-element-wrapper");
            shoptet.validator.removeErrorMessage(element, void 0, elementWrapper), element.classList.add("js-error-field");
            var errorAddEvent = document.createElement("div");
            errorAddEvent.classList.add("js-validator-msg"),
                errorAddEvent.classList.add("msg-error"),
                errorAddEvent.setAttribute("data-type", messageType),
                (errorAddEvent.innerHTML = shoptet.messages[messageType]),
                elementWrapper.insertAdjacentElement("beforeend", errorAddEvent);
            errorAddEvent = new CustomEvent("shoptetAddErrorMessage", { bubbles: !0, detail: { element: element } });
            element.dispatchEvent(errorAddEvent);
        }
        document.addEventListener("DOMContentLoaded", function () {}),
            document.addEventListener("change", function (e) {
                e.target && e.target.matches('input[type="text"], input[type="email"]') && (e.target.value = e.target.value.trim());
            }),
            (shoptet.validator = shoptet.validator || {}),
            shoptet.scripts.libs.validator.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "validator");
            }),
            (shoptet.validator.invalidFieldClasses = ".js-error-field, .js-validated-field"),
            (shoptet.validator.events = ["DOMContentLoaded", "ShoptetDOMContentLoaded"]);
    })(shoptet),
    (function (shoptet) {
        function validateNumber(el) {
            if (el.classList.contains("js-validation-suspended")) return 1;
            el.classList.add("js-validated-field"), el.setAttribute("disabled", !0);
            var validatedValue = el.value.replace(/[^0-9|'+']/g, "");
            if (-1 !== validatedValue.indexOf("+"))
                for (var i = 3; 0 < i; i--) {
                    var phoneCode = validatedValue.substr(1, i);
                    if (phoneCode.match(/^\d+$/) && -1 !== shoptet.phoneInput.phoneCodes.indexOf(parseInt(phoneCode))) {
                        var activeFlag = el.parentElement.querySelector(".country-flag.selected"),
                            flag = el.parentElement.querySelector('.country-flag[data-dial="' + phoneCode + '"]');
                        if (flag) {
                            activeFlag.getAttribute("data-dial") !== phoneCode && shoptet.phoneInput.setSelectedCountry(flag, flag.parentElement.parentElement, !1),
                                (validatedValue = validatedValue.substring(i + 1)),
                                (el.value = validatedValue);
                            break;
                        }
                    }
                }
            var url,
                phoneInfo = {},
                phoneInfoEl = el.parentElement.querySelector(".js-phone-code");
            try {
                phoneInfo = JSON.parse(phoneInfoEl.value);
            } catch (e) {
                return el.classList.remove("js-validated-field"), void el.removeAttribute("disabled");
            }
            return 0 === validatedValue.length && 0 !== el.value.length
                ? (shoptet.validator.addErrorMessage(el, shoptet.validatorPhone.messageType), el.classList.remove("js-validated-field"), void el.removeAttribute("disabled"))
                : validatedValue.length
                    ? void (++shoptet.validatorPhone.ajaxPending > shoptet.validatorPhone.validators.phoneInputs.elements.length
                        ? shoptet.validatorPhone.ajaxPending--
                        : ((url = shoptet.validatorPhone.validateUrl),
                            (url += "?number=" + encodeURIComponent(validatedValue) + "&phoneCode=" + encodeURIComponent(phoneInfo.phoneCode) + "&countryCode=" + encodeURIComponent(phoneInfo.countryCode)),
                            shoptet.ajax
                                .makeAjaxRequest(
                                    url,
                                    shoptet.ajax.requestTypes.get,
                                    "",
                                    {
                                        success: function (response) {
                                            response.getFromPayload("isValidForRegion")
                                                ? ((el.value = response.getFromPayload("nationalNumber")),
                                                    shoptet.validator.removeErrorMessage(el, shoptet.validatorPhone.messageType),
                                                    shoptet.validator.removeErrorMessage(el, shoptet.validatorRequired.messageType))
                                                : (shoptet.validator.addErrorMessage(el, shoptet.validatorPhone.messageType), shoptet.scripts.signalCustomEvent("ShoptetValidationError", el)),
                                                el.classList.remove("js-validated-field"),
                                                el.removeAttribute("disabled"),
                                                shoptet.validatorPhone.ajaxPending--;
                                        },
                                        failed: function () {
                                            el.classList.remove("js-validated-field"), el.removeAttribute("disabled"), shoptet.validatorPhone.ajaxPending--;
                                        },
                                    },
                                    { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
                                )
                                .then(function () {
                                    0 === shoptet.validatorPhone.ajaxPending && document.dispatchEvent(new Event(shoptet.validatorPhone.ajaxDoneEvent));
                                })))
                    : (shoptet.validator.removeErrorMessage(el, shoptet.validatorPhone.messageType), el.classList.remove("js-validated-field"), el.removeAttribute("disabled"), 1);
        }
        (shoptet.validatorPhone = shoptet.validatorPhone || {}),
            shoptet.scripts.libs.validatorPhone.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "validatorPhone");
            }),
            (shoptet.validatorPhone.validateUrl = "/action/ShoptetValidatePhone/index/"),
            (shoptet.validatorPhone.messageType = "validatorInvalidPhoneNumber"),
            (shoptet.validatorPhone.validators = {
                phoneInputs: { elements: document.getElementsByClassName("js-validate-phone"), events: ["change", "ShoptetPhoneCodeChange"], validator: shoptet.validatorPhone.validateNumber, fireEvent: !0, fireOneEvent: !0 },
            }),
            (shoptet.validatorPhone.ajaxPending = 0),
            (shoptet.validatorPhone.ajaxDoneEvent = "ShoptetAjaxValidationDone");
        for (var i = 0; i < shoptet.validator.events.length; i++)
            document.addEventListener(shoptet.validator.events[i], function () {
                shoptet.validator.handleValidators(shoptet.validatorPhone.validators);
            });
    })(shoptet),
    (function (shoptet) {
        function validateZipCode(el) {
            if (el.classList.contains("js-validation-suspended")) return 1;
            var validatedValue = el.value.trim();
            el.value = validatedValue;
            var regex = el.getAttribute("data-pattern"),
                regex = !!regex && new RegExp(regex, "i");
            regex && validatedValue && !regex.test(validatedValue)
                ? (shoptet.validator.addErrorMessage(el, shoptet.validatorZipCode.messageType), shoptet.scripts.signalCustomEvent("ShoptetValidationError", el))
                : shoptet.validator.removeErrorMessage(el, shoptet.validatorZipCode.messageType);
        }
        function updateZipValidPattern($el) {
            "billCountryId" === $el.attr("id")
                ? ($("#billZip").attr("data-pattern", $el.find("option:selected").data("zip-code-pattern")), shoptet.scripts.signalCustomEvent("ShoptetBillZipPatternChange", $("#billZip")[0]))
                : "deliveryCountryId" === $el.attr("id") &&
                ($("#deliveryZip").attr("data-pattern", $el.find("option:selected").data("zip-code-pattern")), shoptet.scripts.signalCustomEvent("ShoptetDeliveryZipPatternChange", $("#deliveryZip")[0]));
        }
        (shoptet.validatorZipCode = shoptet.validatorZipCode || {}),
            shoptet.scripts.libs.validatorZipCode.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "validatorZipCode");
            }),
            (shoptet.validatorZipCode.messageType = "validatorZipCode"),
            (shoptet.validatorZipCode.validators = {
                zipCodeInputs: {
                    elements: document.getElementsByClassName("js-validate-zip-code"),
                    events: ["change", "ShoptetBillZipPatternChange", "ShoptetDeliveryZipPatternChange"],
                    validator: shoptet.validatorZipCode.validateZipCode,
                    fireEvent: !0,
                    fireOneEvent: !0,
                },
            });
        for (var i = 0; i < shoptet.validator.events.length; i++)
            document.addEventListener(shoptet.validator.events[i], function () {
                shoptet.validator.handleValidators(shoptet.validatorZipCode.validators);
            });
    })(shoptet),
    (function (shoptet) {
        function validateCompanyId(el) {
            if (el.classList.contains("js-validation-suspended")) return 1;
            var validatedValue = el.value.trim(),
                regex = el.getAttribute("data-pattern"),
                regex = !!regex && new RegExp(regex, "i");
            regex && validatedValue && !regex.test(validatedValue)
                ? (shoptet.validator.addErrorMessage(el, shoptet.validatorCompanyId.messageTypeCustomized), shoptet.scripts.signalCustomEvent("ShoptetValidationError", el))
                : shoptet.validator.removeErrorMessage(el, shoptet.validatorCompanyId.messageTypeCustomized);
        }
        function updateCompanyIdValidPattern() {
            var currentOption = $("#billCountryId").find("option:selected");
            currentOption.length &&
            ($("#companyId").attr("data-pattern", currentOption.data("company-id-pattern")),
                (shoptet.messages[shoptet.validatorCompanyId.messageTypeCustomized] = shoptet.messages[shoptet.validatorCompanyId.messageType].replace("%1", currentOption.data("company-id-example"))),
                shoptet.scripts.signalCustomEvent("ShoptetCompanyIdPatternChange", $("#companyId")[0]));
        }
        (shoptet.validatorCompanyId = shoptet.validatorCompanyId || {}),
            shoptet.scripts.libs.validatorCompanyId.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "validatorCompanyId");
            }),
            (shoptet.validatorCompanyId.messageType = "validatorInvalidCompanyId"),
            (shoptet.validatorCompanyId.messageTypeCustomized = "validatorInvalidCompanyIdCustomized"),
            (shoptet.validatorCompanyId.validators = {
                companyIdInputs: {
                    elements: document.getElementsByClassName("js-validate-company-id"),
                    events: ["ShoptetCompanyIdPatternChange", "change"],
                    validator: shoptet.validatorCompanyId.validateCompanyId,
                    fireEvent: !0,
                    fireOneEvent: !0,
                },
            }),
            document.addEventListener("DOMContentLoaded", function () {
                document.querySelector(".js-validate-company-id") && shoptet.validatorCompanyId.updateCompanyIdValidPattern();
            });
        for (var i = 0; i < shoptet.validator.events.length; i++)
            document.addEventListener(shoptet.validator.events[i], function () {
                shoptet.validator.handleValidators(shoptet.validatorCompanyId.validators);
            });
    })(shoptet),
    (function (shoptet) {
        function validateRequiredField(el) {
            if (el.classList.contains("js-validation-suspended")) return 1;
            el.value.length || el.classList.contains("no-js-validation")
                ? ((phoneWrapper = el.parentElement), shoptet.validator.removeErrorMessage(el, shoptet.validatorRequired.messageType))
                : (shoptet.validator.addErrorMessage(el, shoptet.validatorRequired.messageType), shoptet.scripts.signalCustomEvent("ShoptetValidationError", el));
        }
        (shoptet.validatorRequired = shoptet.validatorRequired || {}),
            shoptet.scripts.libs.validatorRequired.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "validatorRequired");
            }),
            (shoptet.validatorRequired.messageType = "validatorRequired"),
            (shoptet.validatorRequired.validators = {
                requiredInputs: { elements: document.getElementsByClassName("js-validate-required"), events: ["change", "blur", "validatedFormSubmit"], validator: shoptet.validatorRequired.validateRequiredField, fireEvent: !1 },
            });
        for (var i = 0; i < shoptet.validator.events.length; i++)
            document.addEventListener(shoptet.validator.events[i], function () {
                shoptet.validator.handleValidators(shoptet.validatorRequired.validators);
            });
    })(shoptet),
    (function (shoptet) {
        function handleFlags(el) {
            el.addEventListener("keydown", function (e) {
                el.classList.contains("active") ? shoptet.phoneInput.handleKeyCodes(e, el) : e.keyCode === shoptet.common.keyCodes.enter && (el.classList.add("active"), el.querySelector(".country-flag").focus());
            });
            var key,
                parentGroup,
                flagsEl = el.getElementsByClassName("country-flag");
            for (key in flagsEl) {
                "object" == typeof flagsEl[key] &&
                ((parentGroup = flagsEl[key].parentElement.parentElement),
                    (function (flag, parentGroup) {
                        flag.addEventListener("click", function (e) {
                            e.stopPropagation(),
                                parentGroup.focus(),
                                parentGroup.classList.contains("active")
                                    ? shoptet.phoneInput.hideCountriesSelect(parentGroup)
                                    : (parentGroup.classList.add("active"), shoptet.phoneInput.positionCountriesSelect(parentGroup), shoptet.scripts.signalCustomEvent("ShoptetPhoneCodeActive", parentGroup)),
                            flag.classList.contains("selected") || shoptet.phoneInput.setSelectedCountry(flag, parentGroup, !0),
                                shoptet.phoneInput.setLastPreferredCountry(parentGroup);
                        });
                    })(flagsEl[key], parentGroup));
            }
        }
        function interconnectFlagsWithSelect() {
            var key,
                flagsGroups = document.querySelectorAll(".country-flags:not(.initialized)");
            for (key in flagsGroups) "object" == typeof flagsGroups[key] && (shoptet.phoneInput.handleFlags(flagsGroups[key]), flagsGroups[key].classList.add("initialized"));
        }
        function hideCountriesSelect(el) {
            (el.querySelector(".country-flags-inner").scrollTop = 0), el.classList.remove("active"), el.blur();
        }
        function setSelectedCountry(el, parentGroup, signal) {
            var select = parentGroup.nextElementSibling,
                input = select.nextElementSibling,
                originalValue = JSON.parse(select.value),
                selectedItem = el.dataset.rel;
            originalValue.countryCode !== selectedItem &&
            ((selectedItem = parentGroup.querySelector(".selected")) && selectedItem.classList.remove("selected"),
                el.classList.add("selected"),
                shoptet.phoneInput.selectSelectedOption(parentGroup, el, select),
            signal && shoptet.scripts.signalCustomEvent("ShoptetPhoneCodeChange", input));
        }
        function setLastPreferredCountry(preferred) {
            var lastPreferred = preferred.querySelector(".country-flag-preferred-last");
            lastPreferred && lastPreferred.classList.remove("country-flag-preferred-last");
            preferred = preferred.querySelectorAll(".country-flag-preferred:not(.selected)");
            0 < preferred.length && (lastPreferred = preferred[preferred.length - 1]).classList.add("country-flag-preferred-last");
        }
        function selectSelectedOption(parentGroup, el, select) {
            for (var options = select.getElementsByTagName("option"), selectedIndex = !1, i = 0; i < options.length; i++) {
                options[i].removeAttribute("selected"), JSON.parse(options[i].value).countryCode === el.dataset.rel && (selectedIndex = i);
            }
            options[selectedIndex].setAttribute("selected", "selected");
        }
        function handleKeyCodes(e, matchedElement) {
            var focusedFlag = matchedElement.querySelector(".country-flag.suggested");
            if ((focusedFlag && focusedFlag.classList.remove("suggested"), e.keyCode === shoptet.common.keyCodes.escape)) return shoptet.phoneInput.hideCountriesSelect(matchedElement), void (shoptet.phoneInput.pressedKeys = "");
            focusedFlag = matchedElement.querySelector(".country-flag:focus");
            if (40 === e.keyCode && focusedFlag) {
                e.preventDefault();
                var prevFlag = focusedFlag.nextElementSibling;
                prevFlag && prevFlag.focus();
            } else if (38 === e.keyCode && focusedFlag) {
                e.preventDefault();
                prevFlag = focusedFlag.previousElementSibling;
                prevFlag && prevFlag.focus();
            } else {
                if (e.keyCode === shoptet.common.keyCodes.enter)
                    return (
                        focusedFlag && focusedFlag.click(),
                        shoptet.phoneInput.matchedElement && (shoptet.phoneInput.matchedElement.click(), (shoptet.phoneInput.matchedElement = !1)),
                            shoptet.phoneInput.hideCountriesSelect(matchedElement),
                            void (shoptet.phoneInput.pressedKeys = "")
                    );
                clearTimeout(shoptet.phoneInput.phoneInputKeyup),
                    (shoptet.phoneInput.pressedKeys += translateKeys(String.fromCharCode(e.keyCode))),
                    (shoptet.phoneInput.phoneInputKeyup = setTimeout(function () {
                        shoptet.phoneInput.pressedKeys = "";
                    }, 1e3));
                matchedElement = matchedElement.querySelector('[data-country-name^="' + shoptet.phoneInput.pressedKeys + '"]');
                matchedElement ? ((shoptet.phoneInput.matchedElement = matchedElement).classList.add("suggested"), (matchedElement.offsetParent.scrollTop = matchedElement.offsetTop)) : (shoptet.phoneInput.matchedElement = !1);
            }
        }
        function positionCountriesSelect(el) {
            el.classList.remove("turned");
            var rect = el.querySelector(".country-flags-inner").getBoundingClientRect(),
                documentHeight = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.offsetHeight,
                    document.body.clientHeight,
                    document.documentElement.clientHeight
                );
            window.pageYOffset + rect.bottom > documentHeight && el.classList.add("turned");
        }
        function translateKeys(key) {
            switch (key) {
                case "2":
                    return "Äš";
                case "3":
                    return "Å ";
                case "4":
                    return "ÄŒ";
                case "5":
                    return "Å˜";
                case "6":
                    return "Å½";
                case "7":
                    return "Ã";
                case "8":
                    return "Ã";
                case "9":
                    return "Ã";
                case "0":
                    return "Ã‰";
                default:
                    return key;
            }
        }
        for (var i = 0; i < shoptet.validator.events.length; i++)
            document.addEventListener(shoptet.validator.events[i], function () {
                shoptet.phoneInput.interconnectFlagsWithSelect();
            });
        document.addEventListener("click", function () {
            var key,
                flagsGroups = document.getElementsByClassName("country-flags");
            for (key in flagsGroups) "object" == typeof flagsGroups[key] && shoptet.phoneInput.hideCountriesSelect(flagsGroups[key]);
        }),
            (shoptet.phoneInput = shoptet.phoneInput || {}),
            shoptet.scripts.libs.phoneInput.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "phoneInput");
            }),
            (shoptet.phoneInput.phoneInputKeyup = !1),
            (shoptet.phoneInput.pressedKeys = ""),
            (shoptet.phoneInput.matchedElement = !1);
    })(shoptet),
    (function (shoptet) {
        function getElements() {
            return document.querySelectorAll(".btn-cofidis");
        }
        function setMinPayment(el, minPayment) {
            (el.querySelector("b").textContent = minPayment), el.classList.remove("hidden");
        }
        function calculator(newPrice, $cofidis) {
            newPrice = parseFloat(newPrice.text().replace(/[^\d,.-]/g, ""));
            $cofidis.attr("data-url", $cofidis.attr("data-url").replace(/(cenaZbozi=)(.+)(&idObchodu)/, "$1" + newPrice + "$3"));
        }
        function handleClick(url) {
            url.preventDefault();
            url = url.currentTarget.dataset.url;
            window.open(url, "iPlatba", "width=770,height=650,menubar=no,toolbar=no");
        }
        function addCalculatorListeners() {
            for (var cofidisCalculatorLinks = document.querySelectorAll(".js-cofidis-open"), i = 0; i < cofidisCalculatorLinks.length; i++)
                cofidisCalculatorLinks[i].removeEventListener("click", shoptet.cofidis.handleClick), cofidisCalculatorLinks[i].addEventListener("click", shoptet.cofidis.handleClick);
        }
        document.addEventListener("DOMContentLoaded", function () {
            shoptet.cofidis.addCalculatorListeners();
            function successCallback(minPayment) {
                var index = minPayment.getFromPayload("index");
                (minPayment = minPayment.getFromPayload("minPayment")) && shoptet.cofidis.setMinPayment(elements[index], minPayment);
            }
            for (var elements = shoptet.cofidis.getElements(), i = 0; i < elements.length; i++) {
                var minPayment = parseInt(elements[i].getAttribute("data-minpay"));
                minPayment
                    ? shoptet.cofidis.setMinPayment(elements[i], minPayment)
                    : shoptet.ajax.makeAjaxRequest(
                        "/action/Iplatba/GetMinPayment/",
                        shoptet.ajax.requestTypes.post,
                        { price: parseInt(elements[i].getAttribute("data-price")), index: i },
                        { success: successCallback },
                        { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
                    );
            }
        }),
            document.addEventListener("ShoptetDOMContentLoaded", function () {
                shoptet.cofidis.addCalculatorListeners();
            }),
            (shoptet.cofidis = shoptet.cofidis || {}),
            shoptet.scripts.libs.cofidis.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "cofidis");
            });
    })(shoptet),
    (function (shoptet) {
        document.addEventListener("DOMContentLoaded", function () {
            for (var menus = document.querySelectorAll(".admin-bar #bar-menu > li"), i = 0; i < menus.length; i++)
                menus[i].addEventListener("mouseenter", function (e) {
                    for (clearTimeout(shoptet.runtime.adminBar), i = 0; i < menus.length; i++) menus[i].classList.remove("hover");
                    e.target.classList.add("hover");
                }),
                    menus[i].addEventListener("mouseleave", function (e) {
                        clearTimeout(shoptet.runtime.adminBar);
                        var menus = $("#bar-menu > li");
                        shoptet.runtime.adminBar = setTimeout(function () {
                            for (i = 0; i < menus.length; i++) menus[i].classList.remove("hover");
                        }, shoptet.config.adminBarTimeout);
                    });
        }),
            (shoptet.adminBar = shoptet.adminBar || {});
    })(shoptet),
    (shoptet.validator.invalidEmails = [
        "centum.cz",
        "cetrum.cz",
        "emai.cz",
        "eznam.cz",
        "gamil.com",
        "gmail.co",
        "gmai.com",
        "gmail.cz",
        "gmail.sk",
        "gmail.pl",
        "gmail.de",
        "gmail.ro",
        "setnam.cz",
        "seunam.cz",
        "seynam.cz",
        "sezmam.cz",
        "sezn.cz",
        "sezna.cz",
        "seznam.com",
        "seznan.cz",
        "seznma.cz",
        "sznam.cz",
    ]);
var transformers = {
        "titlecase-words": function (elementValue) {
            for (var words = elementValue.split(/\s+/), i = 0; i < words.length; ++i) {
                var word = words[i];
                words[i] = word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
            }
            return words.join(" ");
        },
        "uppercase-first": function (elementValue) {
            return elementValue.charAt(0).toUpperCase() + elementValue.substr(1);
        },
    },
    transform = function () {
        var elementValue = new String($(this).val()),
            transformed = $(this).attr("data-transform");
        if (!(transformed in transformers)) throw new Error("Unknown transformation.");
        (elementValue = elementValue.trim())
            ? $(this).data("transformed") ||
            ((transformed = transformers[transformed](elementValue)),
                $(this).val(transformed),
            elementValue !== transformed &&
            ($(this).data("transformed", elementValue !== transformed),
            $(this).is(".warning-field, .error-field") || shoptet.validator.showValidatorMessage($(this), shoptet.messages.validatorTextWasTransformed, "msg-info"),
                shoptet.scripts.signalCustomEvent("ShoptetValidationTransform", this)))
            : $(this).data("transformed", !1);
    },
    softWarning = !1,
    validators = {
        required: function (elementValue) {
            var specialMessage,
                isValid = !0;
            return (
                ($(this).attr("required") || $(this).hasClass("required")) &&
                ("checkbox" == $(this).attr("type")
                    ? $(this).is(":checked") ||
                    ((isValid = !1), (specialMessage = $(this).attr("data-special-message")), (shoptet.validator.message = specialMessage ? shoptet.messages[specialMessage] : shoptet.messages.validatorCheckbox))
                    : elementValue.trim() || ((isValid = !1), (shoptet.validator.message = shoptet.messages.validatorRequired))),
                    isValid
            );
        },
        password: function (elementValue) {
            var $password,
                isValid = !0;
            return (
                "password" != $(this).attr("type") ||
                "passwordAgain" != $(this).attr("id") ||
                (($password = $(this).closest("form").find("input#password[type=password]")) && $(this).val() != $password.val() && ((isValid = !1), (shoptet.validator.message = shoptet.messages.validatorPassword))),
                    isValid
            );
        },
        email: function (tld) {
            var domain,
                isValid = !0;
            return (
                "email" == $(this).attr("type") &&
                ((isValid = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(
                    tld.trim()
                )),
                    (shoptet.validator.message = shoptet.messages.validatorEmail),
                isValid && ((tld = (tld = (domain = tld.trim().split("@")[1]).split("."))[tld.length - 1]).length < 2 && (isValid = !1), -1 !== $.inArray(domain, shoptet.validator.invalidEmails) && (isValid = !1))),
                    isValid
            );
        },
        fullname: function (elementValue) {
            var isValid = !0;
            return ("billFullName" != $(this).attr("id") && "deliveryFullName" != $(this).attr("id")) || ((isValid = / /i.test(elementValue.trim())), (shoptet.validator.message = shoptet.messages.validatorFullName)), isValid;
        },
        billStreet: function (elementValue) {
            var isValid = !0;
            return "billStreet" == $(this).attr("id") && $(this).attr("data-warning") && ((isValid = !/\s(\d+)(\/\d+)?[a-z]?$/i.test(elementValue.trim())), (shoptet.validator.message = shoptet.messages.validatorStreet)), isValid;
        },
        billHouseNumber: function (elementValue) {
            var isValid = !0;
            return "billHouseNumber" == $(this).attr("id") && ((isValid = /^[1-9]\d*(\s*[-/]\s*([1-9]|[a-zA-Z])\d*)? ?[a-zA-Z]?$/gim.test(elementValue.trim())), (shoptet.validator.message = shoptet.messages.validatorHouseNumber)), isValid;
        },
    },
    validate = function (isSubmit) {
        var isValid = !0;
        if (!$(this).hasClass("no-js-validation")) {
            var elementValue = new String($(this).val());
            if (isSubmit || elementValue.length)
                for (var validator in validators)
                    if (!(isValid = validators[validator].call(this, elementValue))) {
                        if (!$(this).attr("data-warning")) {
                            var softWarning = !1;
                            break;
                        }
                        (softWarning = !0), (isValid = !0);
                    }
        }
        return (
            isValid
                ? ($(this).removeClass("error-field"),
                    $(this).removeClass("warning-field"),
                    shoptet.validator.removeValidatorMessage($(this)),
                softWarning &&
                ($(this).addClass("warning-field"),
                void 0 !== shoptet.validator.message && shoptet.validator.showValidatorMessage($(this), shoptet.validator.message, "msg-warning"),
                    shoptet.scripts.signalCustomEvent("ShoptetValidationWarning", $(this)[0]),
                    (softWarning = !1)))
                : ($(this).addClass("error-field"),
                void 0 !== shoptet.validator.message && shoptet.validator.showValidatorMessage($(this), shoptet.validator.message, "msg-error"),
                    shoptet.scripts.signalCustomEvent("ShoptetValidationError", $(this)[0])),
                isValid
        );
    };
function topMenuFits() {
    var $topMenuWrapper = $(".top-navigation-menu");
    if (!detectResolution(shoptet.config.breakpoints.sm) && !$topMenuWrapper.is(":visible")) return !1;
    var fits = !0;
    $(".top-navigation-bar-menu li").removeClass("cropped"), $(".top-navigation-bar-menu-helper").empty();
    var menuPadding = parseInt($topMenuWrapper.css("padding-right"));
    return (
        $(".top-navigation-bar-menu li").each(function () {
            if (!shoptet.common.fitsToParentWidth($(this)[0], menuPadding))
                return $(this).addClass("cropped"), $(this).nextAll().addClass("cropped"), $(this).parents("ul").find(".cropped").clone().appendTo(".top-navigation-bar-menu-helper"), (fits = !1);
        }),
            fits
    );
}
function showTopMenuTrigger() {
    $("body").addClass("top-menu-trigger-visible");
}
function hideTopMenuTrigger() {
    $("body").removeClass("top-menu-trigger-visible");
}
(shoptet.validator.initValidator = function ($el, settings) {
    return $el.each(function () {
        shoptet.validator.shoptetFormValidator.init(this, settings);
    });
}),
    (shoptet.validator.shoptetFormValidator = {
        messages: {},
        init: function (currentForm, settings) {
            if ("FORM" == currentForm.tagName) {
                var $currentForm = $(currentForm),
                    $elements = $currentForm.find("input[required], input.required, textarea[required], input#companyId, input#passwordAgain, .js-validate");
                if ($elements.length)
                    return (
                        $elements.change(function () {
                            return validate.call($(this), !1);
                        }),
                            $currentForm.find("[data-transform]").blur(transform),
                            (settings = settings || {}),
                            $currentForm.data("validatorSettings", settings),
                            $currentForm.submit(function (event) {
                                var invalidElementsCounter = 0;
                                if (
                                    ($elements.each(function () {
                                        var isElementValid;
                                        $(this).hasClass("js-validation-suspended") ||
                                        ((isElementValid = validate.call($(this), !0)),
                                            shoptet.scripts.signalCustomEvent("validatedFormSubmit", this),
                                        isElementValid || 0 != invalidElementsCounter++ || 0 !== shoptet.validatorPhone.ajaxPending || $(this).focus());
                                    }),
                                    0 !== shoptet.validatorPhone.ajaxPending &&
                                    (event.preventDefault(),
                                        new Promise(function (resolve) {
                                            document.addEventListener(shoptet.validatorPhone.ajaxDoneEvent, resolve);
                                        }).then(function () {
                                            $currentForm.submit();
                                        })),
                                        invalidElementsCounter)
                                )
                                    return (
                                        $currentForm.addClass("validation-failed"),
                                        $.isFunction($currentForm.data("validatorSettings").onFailed) && $currentForm.data("validatorSettings").onFailed(),
                                            event.stopImmediatePropagation(),
                                            setTimeout(function () {
                                                $("body").css("cursor", "inherit");
                                            }, 100),
                                            shoptet.scripts.signalCustomEvent("ShoptetFailedValidation", $currentForm[0]),
                                            shoptet.custom.postFailedValidation($currentForm[0]),
                                            !1
                                    );
                                $currentForm.removeClass("validation-failed"),
                                    $currentForm.find("[data-unveil]").each(function () {
                                        var clearBlockId;
                                        $(this).is(":checked") ||
                                        ((clearBlockId = $(this).data("unveil")),
                                            $("#" + clearBlockId)
                                                .find("input, textarea")
                                                .each(function () {
                                                    $(this).val("");
                                                }));
                                    });
                                var key,
                                    requiredFields = document.getElementsByClassName("js-validate-required");
                                for (key in requiredFields) "object" == typeof requiredFields[key] && shoptet.scripts.signalCustomEvent("validatedFormSubmit", requiredFields[key]);
                                return shoptet.validator.formContainsInvalidFields($currentForm[0])
                                    ? (scrollToEl($currentForm.find(shoptet.validator.invalidFieldClasses).first().parents(".form-group")),
                                        shoptet.scripts.signalCustomEvent("ShoptetFailedValidation", $currentForm[0]),
                                        shoptet.custom.postFailedValidation($currentForm[0]),
                                        !1)
                                    : (shoptet.scripts.signalCustomEvent("ShoptetSuccessfulValidation", $currentForm[0]), shoptet.custom.postSuccessfulValidation($currentForm[0]));
                            }),
                            this
                    );
            }
        },
    }),
    (shoptet.validator.showValidatorMessage = function ($el, message, cssClass) {
        return (
            $el.data("validatorMessageMessage", message),
                $el.each(function () {
                    shoptet.validator.validatorMessage.show($el, cssClass);
                })
        );
    }),
    (shoptet.validator.removeValidatorMessage = function ($el) {
        return $el.each(function () {
            shoptet.validator.validatorMessage.hide($el);
        });
    }),
    (shoptet.validator.validatorMessage = {
        init: function ($el) {
            var id = "id-" + Math.floor(1024 * Math.random() + 2048 * Math.random());
            $('<div class="validator-msg js-validator-msg" id="' + id + '"></div>').appendTo($("body"));
            var $container = $("#" + id);
            $("html").on("click", "#" + id, function () {
                $container.prev("input").removeClass("error-field"), $container.remove(), $el.data("validatorMessage", !1);
            }),
                $el.data("validatorMessage", $container),
                $container.data("parent", $el);
        },
        show: function ($el, cssClass) {
            $el.data("validatorMessage") || this.init($el);
            var $container = $el.data("validatorMessage");
            $container.addClass(cssClass).html($el.data("validatorMessageMessage")), $el.closest(".js-validated-element-wrapper").append($container), $container.fadeIn(150);
        },
        hide: function ($el) {
            $el.data("validatorMessage") && ($el.data("validatorMessage").remove(), $el.data("validatorMessage", !1));
        },
    }),
    (function ($) {
        function format(str) {
            for (var i = 1; i < arguments.length; i++) str = str.replace("%" + (i - 1), arguments[i]);
            return str;
        }
        function CloudZoom(jWin, opts) {
            var img2,
                zoomImage,
                cw,
                ch,
                destU,
                destV,
                mx,
                my,
                zw,
                sImg = $("img", jWin),
                zoomDiv = null,
                $mouseTrap = null,
                lens = null,
                $tint = null,
                softFocus = null,
                controlTimer = 0,
                currV = 0,
                currU = 0,
                filesLoaded = 0,
                touchTimer = 0,
                zoomActive = !1,
                zoomActiveShow = !0,
                ctx = this;
            setTimeout(function () {
                var w;
                null === $mouseTrap &&
                ((w = jWin.width()),
                    jWin
                        .parent()
                        .append(format('<div style="width:%0px;position:absolute;top:75%;left:%1px;text-align:center" class="cloud-zoom-loading" >Loading...</div>', w / 3, w / 2 - w / 6))
                        .find(":last")
                        .css("opacity", 0.5));
            }, 200),
                (this.removeBits = function () {
                    lens && (lens.remove(), (lens = null)),
                    $tint && ($tint.remove(), ($tint = null)),
                    softFocus && (softFocus.remove(), (softFocus = null)),
                        (filesLoaded = filesLoaded && 0),
                        $(".cloud-zoom-loading", jWin.parent()).remove();
                }),
                (this.destroy = function () {
                    jWin.data("zoom", null), $mouseTrap && ($mouseTrap.unbind(), $mouseTrap.remove(), ($mouseTrap = null)), zoomDiv && (zoomDiv.remove(), (zoomDiv = null)), this.removeBits();
                }),
                (this.fadedOut = function () {
                    zoomDiv && (zoomDiv.remove(), (zoomDiv = null)), this.removeBits();
                }),
                (this.controlLoop = function () {
                    var x, y;
                    lens &&
                    ((x = (mx - sImg.offset().left - 0.5 * cw) >> 0),
                        (y = (my - sImg.offset().top - 0.5 * ch) >> 0),
                        x < 0 ? (x = 0) : x > sImg.outerWidth() - cw && (x = sImg.outerWidth() - cw),
                        y < 0 ? (y = 0) : y > sImg.outerHeight() - ch && (y = sImg.outerHeight() - ch),
                        lens.css({ left: x, top: y }),
                        lens.css("background-position", -x + "px " + -y + "px"),
                        (destU = ((x / sImg.outerWidth()) * zoomImage.width) >> 0),
                        (destV = ((y / sImg.outerHeight()) * zoomImage.height) >> 0),
                        (currU += (destU - currU) / opts.smoothMove),
                        (currV += (destV - currV) / opts.smoothMove),
                        zoomDiv.css("background-position", -(currU >> 0) + "px " + -(currV >> 0) + "px"),
                        zoomActive ? zoomDiv.css("display", "block") : zoomDiv.css("display", "none")),
                        (controlTimer = setTimeout(function () {
                            ctx.controlLoop();
                        }, 30));
                }),
                (this.init2 = function (img, id) {
                    1 === id && (zoomImage = img), 2 === ++filesLoaded && this.init();
                }),
                (this.setPositionZoom = function (event) {
                    (mx = event.originalEvent.touches[0].pageX), (my = event.originalEvent.touches[0].pageY);
                }),
                (this.startZoom = function (appendTo) {
                    if (zoomActiveShow) {
                        (zoomActiveShow = !1), (mx = appendTo.pageX), (my = appendTo.pageY), (zw = appendTo.data), zoomDiv && (zoomDiv.stop(!0, !1), zoomDiv.remove());
                        var xPos = opts.adjustX,
                            yPos = opts.adjustY,
                            siw = sImg.outerWidth(),
                            sih = sImg.outerHeight(),
                            w = opts.zoomWidth,
                            noTrans = opts.zoomHeight;
                        "auto" == opts.zoomWidth && (w = siw), "auto" == opts.zoomHeight && (noTrans = sih);
                        appendTo = jWin.parent();
                        switch (opts.position) {
                            case "top":
                                yPos -= noTrans;
                                break;
                            case "right":
                                xPos += siw;
                                break;
                            case "bottom":
                                yPos += sih;
                                break;
                            case "left":
                                xPos -= w;
                                break;
                            case "inside":
                                (w = siw), (noTrans = sih);
                                break;
                            default:
                                (appendTo = $("#" + opts.position)).length ? ((w = appendTo.innerWidth()), (noTrans = appendTo.innerHeight())) : ((appendTo = jWin), (xPos += siw), (yPos += sih));
                        }
                        (zoomDiv = appendTo
                            .append(
                                format(
                                    '<div id="cloud-zoom-big" class="cloud-zoom-big" style="display:none;position:absolute;left:%0px;top:%1px;width:100%;height:%3px;background-image:url(\'%4\');background-repeat:no-repeat;background-color:#fff;z-index:40;"></div>',
                                    xPos,
                                    yPos,
                                    w,
                                    noTrans,
                                    zoomImage.src
                                )
                            )
                            .find(":last")),
                        sImg.attr("title") &&
                        opts.showTitle &&
                        zoomDiv
                            .append(format('<div class="cloud-zoom-title">%0</div>', sImg.attr("title")))
                            .find(":last")
                            .css("opacity", opts.titleOpacity),
                            zoomDiv.fadeIn(500),
                        lens && (lens.remove(), (lens = null)),
                            (cw = (sImg.outerWidth() / zoomImage.width) * zoomDiv.width()),
                            (ch = (sImg.outerHeight() / zoomImage.height) * zoomDiv.height()),
                            (lens = jWin.append(format("<div class='cloud-zoom-lens' style='display:none;z-index:1;position:absolute;width:%0px;height:%1px;'></div>", cw, ch)).find(":last")),
                            $mouseTrap.css("cursor", lens.css("cursor"));
                        noTrans = !1;
                        opts.tint &&
                        (lens.css("background", 'url("' + sImg.attr("src") + '")'),
                            ($tint = jWin
                                .append(format('<div style="display:none;position:absolute; left:0px; top:0px; width:%0px; height:%1px; background-color:%2;" />', sImg.outerWidth(), sImg.outerHeight(), opts.tint))
                                .find(":last")).css("opacity", opts.tintOpacity),
                            (noTrans = !0),
                            $tint.fadeIn(500)),
                        opts.softFocus &&
                        (lens.css("background", 'url("' + sImg.attr("src") + '")'),
                            (softFocus = jWin.append(format('<div style="position:absolute;display:none;top:2px; left:2px; width:%0px; height:%1px;" />', sImg.outerWidth() - 2, sImg.outerHeight() - 2, opts.tint)).find(":last")).css(
                                "background",
                                'url("' + sImg.attr("src") + '")'
                            ),
                            softFocus.css("opacity", 0.5),
                            (noTrans = !0),
                            softFocus.fadeIn(500)),
                        noTrans || lens.css("opacity", opts.lensOpacity),
                        "inside" !== opts.position && lens.fadeIn(500),
                            zw.controlLoop();
                    }
                }),
                (this.closeZoom = function () {
                    return (
                        (zoomActiveShow = !0),
                            clearTimeout(controlTimer),
                        lens && lens.fadeOut(299),
                        $tint && $tint.fadeOut(299),
                        softFocus && softFocus.fadeOut(299),
                            zoomDiv.fadeOut(300, function () {
                                ctx.fadedOut();
                            }),
                            !1
                    );
                }),
                (this.init = function () {
                    $(".cloud-zoom-loading", jWin.parent()).remove(),
                        ($mouseTrap = jWin
                            .parent()
                            .append(
                                format(
                                    "<div class='mousetrap' style='background-image:url(\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\");z-index:50;position:absolute;width:100%;height:%1px;left:%2px;top:%3px;'></div>",
                                    sImg.outerWidth(),
                                    sImg.outerHeight(),
                                    0,
                                    0
                                )
                            )
                            .find(":last")).bind("touchstart", this, function (event) {
                            touchTimer = setTimeout(function () {
                                ctx.startZoom(event), ctx.setPositionZoom(event), (zoomActive = !0);
                            }, 150);
                        }),
                        $mouseTrap.bind("touchmove", this, function (event) {
                            zoomActive ? (ctx.setPositionZoom(event), event.preventDefault()) : clearTimeout(touchTimer);
                        }),
                        $mouseTrap.bind("touchend", this, function (event) {
                            zoomActive ? ctx.closeZoom(event) : clearTimeout(touchTimer), (zoomActive = !1);
                        }),
                        $mouseTrap.bind("mousemove", this, function (event) {
                            (mx = event.pageX), (my = event.pageY);
                        }),
                        $mouseTrap.bind("mouseenter", this, function (event) {
                            (zoomActive = !0), ctx.startZoom(event);
                        }),
                        $mouseTrap.bind("mouseleave", this, function (event) {
                            ctx.closeZoom(event);
                        });
                }),
                (img2 = new Image()),
                $(img2).load(function () {
                    ctx.init2(this, 0);
                }),
                (img2.src = sImg.attr("src")),
                (img2 = new Image()),
                $(img2).load(function () {
                    ctx.init2(this, 1);
                }),
                (img2.src = jWin.attr("data-href"));
        }
        ($.fn.CloudZoom = function (options) {
            return (
                this.each(function () {
                    var opts,
                        relOpts = $(this).attr("rel");
                    $(this).is(".cloud-zoom")
                        ? ($(this).css({ position: "relative", display: "block" }),
                            $("img", $(this)).css({ display: "block" }),
                        "wrap" != $(this).parent().attr("id") && $(this).wrap('<div id="wrap" style="top:0px;z-index:0;position:relative;"></div>'),
                            (opts = $.extend({}, $.fn.CloudZoom.defaults, options)),
                            (opts = $.extend({}, opts, relOpts)),
                            $(this).data("zoom", new CloudZoom($(this), opts)))
                        : $(this).is(".cloud-zoom-gallery") &&
                        ((opts = $.extend({}, relOpts, options)),
                            $(this).data("relOpts", opts),
                            $(this).bind("click", $(this), function (event) {
                                var data = event.data.data("relOpts"),
                                    $useZoom = $("#" + data.useZoom);
                                return (
                                    $useZoom.data("zoom").destroy(),
                                        $useZoom.attr("data-href", event.data.attr("data-href")),
                                        $("#" + data.useZoom + " img").attr("src", event.data.data("relOpts").smallImage),
                                        $("#" + event.data.data("relOpts").useZoom).CloudZoom(),
                                        !1
                                );
                            }));
                }),
                    this
            );
        }),
            ($.fn.CloudZoom.defaults = { zoomWidth: "auto", zoomHeight: "auto", position: "right", tint: !1, tintOpacity: 0.5, lensOpacity: 0.5, softFocus: !1, smoothMove: 3, showTitle: !0, titleOpacity: 0.5, adjustX: 0, adjustY: 0 });
    })(jQuery),
    $(document).ready(function () {
        (shoptet.config.cloudZoomOptions = { position: "inside", showTitle: !1, adjustX: 0, adjustY: 0 }),
            $(".cloud-zoom").CloudZoom(shoptet.config.cloudZoomOptions),
            $("html").on("click", ".mousetrap", function () {
                $(this).prev("a.p-main-image").trigger("click");
            });
    }),
shoptet.abilities.feature.tabs_accordion &&
$(document).ready(function () {
    $(".shp-accordion.active .shp-accordion-content").show(),
        $(".shp-accordion-link").click(function (href) {
            href = href.target.getAttribute("href");
            return $(this).parent().toggleClass("active"), $(this).next(".shp-accordion-content").slideToggle(), "#productVideos" === href && shoptet.products.unveilProductVideoTab(href), !1;
        }),
    $(".shp-accordion.active [data-iframe-src]").length && shoptet.products.unveilProductVideoTab();
}),
shoptet.abilities.feature.tabs_responsive &&
((function ($) {
    $.fn.shpResponsiveNavigation = function () {
        return this.each(function () {
            var maxWidth,
                visibleLinks,
                hiddenLinks,
                button,
                $this = $(this);
            function update(resNavDiv) {
                maxWidth = resNavDiv.width();
                var filledSpace = button.outerWidth();
                visibleLinks.outerWidth() + filledSpace > maxWidth
                    ? visibleLinks.children("li").each(function (index) {
                        (filledSpace += $(this).data("width")), maxWidth <= filledSpace && $(this).appendTo(hiddenLinks);
                    })
                    : ((filledSpace += visibleLinks.width()),
                        hiddenLinks.children("li").each(function (index) {
                            (filledSpace += $(this).data("width")) < maxWidth && $(this).appendTo(visibleLinks);
                        })),
                    0 == hiddenLinks.children("li").length ? button.hide() : button.show(),
                    $(".responsive-nav li a").on("click", function () {
                        hiddenLinks.addClass("hidden");
                    });
            }
            0 < (maxWidth = $(this).width()) &&
            ((function (resNavDiv) {
                (visibleLinks = resNavDiv.find(".visible-links")).children("li").each(function () {
                    $(this).attr("data-width", $(this).outerWidth());
                }),
                resNavDiv.find(".hidden-links").length || resNavDiv.append('<button class="navigation-btn" style="display: none;">&#9776;</button><ul class="hidden-links hidden"></ul>');
                (hiddenLinks = resNavDiv.find(".hidden-links")), (button = resNavDiv.find("button")), update($this);
            })($this),
                $(window).resize(function () {
                    update($this);
                }),
                $(button).click(function () {
                    hiddenLinks.toggleClass("hidden");
                }));
        });
    };
})(jQuery),
    $(document).ready(function () {
        $(".responsive-nav").shpResponsiveNavigation();
    })),
shoptet.abilities.feature.top_navigation_menu &&
($(document).on("menuUnveiled resizeEnd", function () {
    (topMenuFits() ? hideTopMenuTrigger : showTopMenuTrigger)();
}),
    $(document).on("click", function () {
        $("body").removeClass("top-navigation-menu-visible");
    }),
    $(document).ready(function () {
        $("html").on("click", ".top-navigation-menu-trigger", function (e) {
            e.stopPropagation(), $("body").toggleClass("top-navigation-menu-visible");
        }),
            (topMenuFits() ? hideTopMenuTrigger : showTopMenuTrigger)();
    }));
var categoryMinValue = parseInt($("#categoryMinValue").text()),
    categoryMaxValue = parseInt($("#categoryMaxValue").text()),
    currencyExchangeRate = shoptet.helpers.toFloat($("#currencyExchangeRate").text());
function showMessage(content, message, id, cancel, overlay, parent) {
    (parent = parent || ".messages"), void 0 === id && (id = ""), void 0 === cancel && (cancel = !1), void 0 === overlay && (overlay = !1), hideMsg(!0), clearTimeout(shoptet.config.dismiss), $(".msg").length && hideMsg(!0);
    message = '<div class="msg msg-' + message + '" role="alert"><div class="container">';
    (message += content + (cancel = !1 !== cancel ? ' <a href="#" class="cancel-action" data-id="' + id + '">' + shoptet.messages.cancel + "</a>" : "") + "</div></div>"),
        $(message).prependTo(parent),
    !0 === overlay && ($('<div class="overlay visible" />').appendTo("body"), $("body").addClass("msg-visible")),
        dismissMessages();
}
function hideMsg(action) {
    $("body").removeClass("msg-visible"),
        void 0 !== action
            ? $(".msg, .overlay.visible").remove()
            : ($(".msg, .overlay.visible").addClass("hidden"),
                setTimeout(function () {
                    $(".msg, .overlay.visible").remove();
                }, shoptet.config.animationDuration));
}
function dismissMessages() {
    shoptet.runtime.dismiss = setTimeout(function () {
        hideMsg();
    }, shoptet.config.dismissTimeout);
}
function cancelAction(id) {
    void 0 === id ||
    ($("#" + id)
        .removeClass("hidden")
        .removeAttr("id"),
        clearTimeout(removeItem)),
        hideMsg();
}
function showSpinner() {
    $("body").addClass("spinner-visible").append('<div class="overlay spinner"><div class="loader" /></div>');
}
function hideSpinner() {
    $(".overlay.spinner").addClass("invisible"),
        setTimeout(function () {
            $("body").removeClass("spinner-visible"), $(".overlay.spinner").detach();
        }, shoptet.config.animationDuration);
}
function initTooltips() {
    $(".tooltip").hide(), $(".show-tooltip").tooltip({ html: !0, placement: "auto", container: "body" });
}
function getScrollBarWidth() {
    var w2 = document.createElement("p");
    (w2.style.width = "100%"), (w2.style.height = "200px");
    var outer = document.createElement("div");
    (outer.style.position = "absolute"),
        (outer.style.top = "0px"),
        (outer.style.left = "0px"),
        (outer.style.visibility = "hidden"),
        (outer.style.width = "200px"),
        (outer.style.height = "150px"),
        (outer.style.overflow = "hidden"),
        outer.appendChild(w2),
        document.body.appendChild(outer);
    var w1 = w2.offsetWidth;
    outer.style.overflow = "scroll";
    w2 = w2.offsetWidth;
    return w1 == w2 && (w2 = outer.clientWidth), document.body.removeChild(outer), w1 - w2;
}
function detectResolution(resolution) {
    return parseInt($(window).width()) + getScrollBarWidth() > resolution;
}
function detectScrolled(direction) {
    var navigationVisible, $html, classToRemove, adminBarHeight, top;
    (!shoptet.abilities.feature.fixed_header && "1" !== shoptet.config.mobileHeaderVersion) ||
    ((navigationVisible = detectResolution(shoptet.abilities.config.navigation_breakpoint)),
        ($html = $("html")),
        (classToRemove = "up" === direction ? "scrolled-down" : "scrolled-up"),
        (top = shoptet.abilities.feature.fixed_header || navigationVisible ? 0 : 50),
    shoptet.abilities.feature.fixed_header &&
    navigationVisible &&
    ((adminBarHeight = $(".admin-bar").length ? $(".admin-bar").height() : 0), (top = ($(".top-navigation-bar").length ? $(".top-navigation-bar").height() : 0) + adminBarHeight)),
        $(window).scrollTop() > top
            ? ($html.addClass("scrolled scrolled-" + direction),
                $html.removeClass(classToRemove),
            shoptet.abilities.feature.fixed_header && navigationVisible && !$("body").hasClass("submenu-visible") && !$("body").hasClass("menu-helper-visible") && shoptet.menu.hideNavigation())
            : ($html.removeClass("scrolled scrolled-up scrolled-down"), shoptet.abilities.feature.fixed_header && navigationVisible && shoptet.menu.hideSubmenu()));
}
function toggleText($el, text, showText, hideText) {
    text == hideText ? ($el.attr("data-text", hideText), $el.html(showText)) : ($el.attr("data-text", showText), $el.html(hideText));
}
function toggleContacts($el) {
    var text = $el.html(),
        hideText = shoptet.messages.hideContacts,
        showText = $el.attr("data-original-text");
    $el.siblings(".box").toggleClass("visible"), $el.toggleClass("expanded"), toggleText($el, text, showText, hideText);
}
($.colorbox.settings.opacity = shoptet.modal.config.opacity),
    ($.colorbox.settings.maxWidth = shoptet.modal.config.maxWidth),
    ($.colorbox.settings.initialWidth = shoptet.modal.config.widthMd),
    ($.colorbox.settings.initialHeight = shoptet.modal.config.initialHeight),
    (shoptet.config.bodyClasses =
        "user-action-visible navigation-window-visible cart-window-visible search-window-visible login-window-visible currency-window-visible language-window-visible register-window-visible menu-helper-visible submenu-visible navigation-hovered top-navigation-menu-visible categories-window-visible search-focused");
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer), (timer = setTimeout(callback, ms));
    };
})();
function scrollToEl(adminBarHeight) {
    var margin = $(".messages .msg"),
        messageHeight = margin.length ? margin.outerHeight() : 0,
        offset = adminBarHeight.offset(),
        margin = "fixed" === $("#header").css("position") || shoptet.abilities.feature.fixed_header ? $("#header").outerHeight() : 0;
    (adminBarHeight = $(".admin-bar").length && detectResolution(shoptet.config.breakpoints.sm) ? $(".admin-bar").height() : 0),
        $("html, body")
            .stop(!0, !0)
            .animate({ scrollTop: offset.top - messageHeight - margin - adminBarHeight - 10 }, shoptet.config.animationDuration);
}
function unveilImages() {
    var imgResizeDone = 0;
    $("img:not(.js-postpone-lazyload)").unveil(100, function () {
        $(this).data("lazy") &&
        $(this).load(function () {
            imgResizeDone && shoptet.products.sameHeightOfProducts();
        }),
        $("body").hasClass("unveiled") ||
        setTimeout(function () {
            shoptet.products.sameHeightOfProducts(), detectResolution(shoptet.config.breakpoints.sm) && $(".carousel").length && (setCarouselHeight($(".carousel-inner")), $("body").addClass("carousel-set")), (imgResizeDone = 1);
        }, shoptet.config.unveilTimeout),
            $("body").addClass("unveiled");
    }),
    $(".carousel").length && !$("body").hasClass("carousel-set") && setCarouselHeight($(".carousel-inner"));
}
function setCarouselHeight($carousel) {
    $carousel.removeAttr("style");
    var maxHeight = 0;
    $(".carousel .item").addClass("active"),
        $carousel.find("img").each(function () {
            var h = $(this).height();
            maxHeight < h && (maxHeight = h);
        }),
        $(".carousel .item").removeClass("active"),
        $(".carousel .item:first-child").addClass("active"),
        $carousel.css("min-height", maxHeight);
}
function initColorbox() {
    $(".variant-image a").colorbox();
    var $lightboxes = {};
    if (
        ($("a[data-gallery]").each(function () {
            $lightboxes[$(this).data("gallery")] = 1;
        }),
            !$.isEmptyObject($lightboxes))
    )
        for (var key in $lightboxes) $('*[data-gallery="' + key + '"]').colorbox({ rel: key, maxWidth: shoptet.modal.config.maxWidth, width: shoptet.modal.config.widthLg, className: shoptet.modal.config.classLg + " productDetail" });
}
function addPaddingToOverallWrapper() {
    var topNavigationBarHeight;
    shoptet.abilities.feature.positioned_footer &&
    (detectResolution(shoptet.config.breakpoints.sm)
        ? $(".overall-wrapper").css("padding-bottom", 0)
        : ((topNavigationBarHeight = $(".top-navigation-bar").outerHeight()), $(".overall-wrapper").css("padding-bottom", topNavigationBarHeight)));
}
function detectVideoBackground($video) {
    return 0 < $video.length;
}
function detectVideoBackgroundHeight($videoWrapper) {
    return $videoWrapper.height();
}
function pauseVideo($video) {
    $video[0].paused || $video[0].pause();
}
function resumeVideo($video) {
    $video[0].paused && $video[0].play();
}
function handleWithVideo($video, $videoWrapper) {
    var offset = $videoWrapper.offset(),
        scrollTop = $("body").scrollTop();
    (offset.top + detectVideoBackgroundHeight($videoWrapper) > scrollTop ? resumeVideo : pauseVideo)($video);
}
function moveElementAfterSelector($whatSelector, $whereSelector) {
    $whatSelector.insertAfter($whereSelector);
}
function updateQueryStringParameter(key, value) {
    var url = window.location.href,
        re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
        separator = -1 !== url.indexOf("?") ? "&" : "?";
    url.match(re) ? (window.location.href = url.replace(re, "$1" + key + "=" + value + "$2")) : (window.location.href = url + separator + key + "=" + value);
}
var availableElementsIds = ["#ratingWrapper"],
    hashUnveiledElements = [],
    hashHiddenElements = [];
function unveilElementByHash(elementId) {
    if (($(elementId).parents(".tab-pane").length && $('[data-toggle="tab"][href="#' + $(elementId).attr("data-parent-tab") + '"]').tab("show"), $(hashUnveiledElements[elementId]).length)) {
        for (i = 0; i < $(hashUnveiledElements[elementId]).length; i++) $(hashUnveiledElements[elementId][i]).removeClass("js-hidden");
        for (i = 0; i < $(hashHiddenElements[elementId]).length; i++) $(hashHiddenElements[elementId][i]).addClass("js-hidden");
    }
    $(window).load(function () {
        setTimeout(function () {
            scrollToEl($(elementId));
        }, shoptet.config.animationDuration + 1);
    });
}
function locationSearchToObject() {
    var locationSearch = window.location.search.substring(1).split("&"),
        object = {};
    return (
        locationSearch.forEach(function (splittedPair) {
            "" !== splittedPair && ((splittedPair = splittedPair.split("=")), (object[decodeURIComponent(splittedPair[0])] = decodeURIComponent(splittedPair[1])));
        }),
            object
    );
}
function getRelativeOffset(parentOffset, relativeOffset) {
    void 0 === relativeOffset && (relativeOffset = parentOffset.parent());
    var elOffset = parentOffset.offset(),
        parentOffset = relativeOffset.offset(),
        relativeOffset = {};
    return (relativeOffset.top = elOffset.top - parentOffset.top), (relativeOffset.left = elOffset.left - parentOffset.left), relativeOffset;
}
function fixTooltipAfterChange(element) {
    $(element).tooltip("fixTitle").tooltip("setContent"), $(element).hasClass("hovered") && $(element).tooltip("show");
}
function initDatepickers() {
    $(".datepicker.birthdate").each(function () {
        var $elem = $(this);
        $elem.datepicker({ changeMonth: !0, changeYear: !0, yearRange: "c-110;c:+0" }),
        $elem.data("value") && $elem.datepicker("setDate", new Date($elem.data("value"))),
        $elem.data("format") && $elem.datepicker("option", "dateFormat", $elem.data("format"));
    });
}
function resizeEndCallback() {
    shoptet.products.sameHeightOfProducts(),
        setTimeout(function () {
            detectFilters();
        }, 1e3),
        shoptet.products.setThumbnailsDirection(),
        shoptet.products.checkThumbnails(shoptet.config.thumbnailsDirection, "set", !0),
    detectResolution(shoptet.abilities.config.navigation_breakpoint) && (shoptet.menu.splitMenu(), 0 < $(".overlay").length && shoptet.menu.toggleMenu()),
        shoptet.products.sameHeightOfProducts(),
        shoptet.products.splitWidgetParameters(),
    $(".carousel").length && setCarouselHeight($(".carousel-inner")),
        shoptet.modal.shoptetResize(),
        addPaddingToOverallWrapper(),
    void 0 !== shoptet.checkout && shoptet.checkout.$checkoutSidebar.length && (detectResolution(shoptet.config.breakpoints.sm) ? shoptet.checkout.handleWithSidebar() : shoptet.checkout.$checkoutSidebar.removeAttr("style"));
}
function resolveImageFormat() {
    return !0;
}
function fulltextSearch($searchInput, $searchContainer) {
    var xhr,
        $form = $searchInput.parents("form");
    function clearSearchWhisperer($elementClicked) {
        $searchContainer.removeClass("active"), $searchContainer.empty(), $elementClicked && !$elementClicked.hasClass("search-input-icon") && clearSearchFocus();
    }
    $searchInput.on("keyup focus", function (e) {
        if (shoptet.abilities.feature.extended_search_whisperer) {
            if ($searchInput.val().length <= 2) return void clearSearchWhisperer();
            $searchContainer.addClass("active"), $("body").addClass("search-focused"), $(".searchWhisperer__loaderWrapper").length || $searchContainer.html('<div class="searchWhisperer__loaderWrapper"><div class="loader"></div></div>');
        } else if ("focus" === e.type) return;
        -1 == $searchInput.val().indexOf(" ") && $(".search-whisperer-empty").hide(),
            delay(function () {
                2 < $searchInput.val().length
                    ? (xhr && 4 !== xhr.readyState) ||
                    (xhr = $.ajax({ url: "/action/ProductSearch/ajaxSearch/", type: "GET", headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" }, data: $form.serialize() })
                        .done(function (response) {
                            response = $.parseJSON(response);
                            $searchContainer.html(response), $searchInput.is(":focus") && ($searchContainer.addClass("active"), $("body").addClass("search-focused"));
                        })
                        .fail(function () {}))
                    : $searchInput.val().length <= 2 && clearSearchWhisperer();
            }, 500);
    }),
        $searchContainer.click(function (e) {
            $(e.target).hasClass("whisperer-trigger") || e.stopPropagation(), $(e.target).hasClass("js-searchWhisperer__button") && $form.submit();
        }),
        $(document).click(function ($target) {
            $target = $($target.target);
            $target.is(".js-search-input, .js-try-search-button") || clearSearchWhisperer($target);
        });
}
function clearSearchFocus() {
    setTimeout(function () {
        $("body").removeClass("search-focused");
    }, shoptet.config.animationDuration / 2);
}
function checkMinimalLength(length) {
    var passed = !0,
        length = length.val().length;
    return ((length < 3 && 0 < length) || 0 == length) && (showMessage(shoptet.messages.charsNeeded, "warning", "", !1, !1), (passed = !1)), passed;
}
function detectRecommended() {
    return $(".recommended-products .row").length;
}
function hideRecommended() {
    $(".recommended-products .browse, .recommended-products .indicator").detach();
}
function updateIndicator(className) {
    var $indicator = $(".recommended-products .indicator");
    !1 === className ? $indicator.removeClass("indicator-1 indicator-2") : $indicator.removeClass("indicator-1 indicator-2").addClass(className);
}
function switchRecommended(indicatorClassName) {
    var $el, $arrows, $targetEl, $targetElSibling, $arrow;
    1 < detectRecommended() &&
    (($el = $(".recommended-products .row.active")),
        ($arrows = $(".recommended-products .browse")),
        (indicatorClassName =
            "prev" === indicatorClassName
                ? (($targetElSibling = ($targetEl = $el.prev(".row")).prev(".row")), ($arrow = $(".recommended-products .prev")), "indicator-prev")
                : (($targetElSibling = ($targetEl = $el.next(".row")).next(".row")), ($arrow = $(".recommended-products .next")), "indicator-next")),
    0 < $targetEl.length &&
    ($arrows.removeClass("inactive"),
        $el.removeClass("active"),
        $targetEl.addClass("active"),
        $(".recommended-products img").unveil(),
        $targetElSibling.length < 1 ? ($arrow.addClass("inactive"), updateIndicator("indicator-prev" !== indicatorClassName && "indicator-2")) : updateIndicator("indicator-1")));
}
(hashUnveiledElements["#ratingWrapper"] = ["#rate-form"]),
    (hashHiddenElements["#ratingWrapper"] = [".rate-form-trigger"]),
    document.addEventListener("DOMContentLoaded", function () {
        $(".regions-wrapper").length && shoptet.global.toggleRegionsWrapper(),
            $("html").on("change", "#billCountryId, #deliveryCountryId", function () {
                shoptet.global.updateSelectedRegions($(this)), shoptet.global.toggleRegionsWrapper(), shoptet.validatorZipCode.updateZipValidPattern($(this));
            });
        var hash = window.location.hash;
        if (hash.length)
            for (i = 0; i < availableElementsIds.length; i++)
                if ((availableElementsIds[i], availableElementsIds[i] === hash)) {
                    $(hash).length && unveilElementByHash(hash);
                    break;
                }
        (window.onbeforeprint = unveilImages()), detectResolution(shoptet.config.breakpoints.sm) || addPaddingToOverallWrapper(), detectScrolled("up");
        var $headerVideo,
            showOnly,
            hidePopupWindow,
            lastScrollTop = 0,
            $headerVideoWrapper = $("#videoWrapper"),
            headerVideoBackgroundExists = detectVideoBackground($headerVideoWrapper);
        headerVideoBackgroundExists &&
        (($headerVideo = $("#videoWrapper video")),
            setTimeout(function () {
                handleWithVideo($headerVideo, $headerVideoWrapper);
            }, 1e3)),
            $(window).scroll(
                shoptet.common.throttle(function () {
                    headerVideoBackgroundExists && handleWithVideo($headerVideo, $headerVideoWrapper);
                    var st = $(this).scrollTop();
                    detectScrolled(lastScrollTop < st ? "down" : "up"), (lastScrollTop = st);
                }, 100)
            ),
            unveilImages(),
            $(".content-window-in").scroll(
                shoptet.common.throttle(function () {
                    $("img").unveil();
                }, 100)
            ),
            $(".CookiesOK").on("click", function (e) {
                e.preventDefault(),
                    shoptet.cookie.create("CookiesOK", "agreed", { days: $(".CookiesOK").data("cookie-notice-ttl") }),
                    $(".cookies").fadeOut(shoptet.config.animationDuration),
                    setTimeout(function () {
                        $(".cookies").remove();
                    }, shoptet.config.animationDuration),
                $(".site-msg.information").length && $(".site-msg.information").css("bottom", $(".site-msg.information").offset().left);
            }),
            $("html").on("click", "#site-agree-button", function (e) {
                e.preventDefault(), shoptet.cookie.create(shoptet.config.agreementCookieName, "agreed", { days: shoptet.config.agreementCookieExpire }), shoptet.modal.close();
            }),
            $(".js-close-information-msg").on("click", function () {
                shoptet.cookie.create("informationBanner", "1", { days: 1 }),
                    $(".site-msg.information").fadeOut(shoptet.config.animationDuration),
                    setTimeout(function () {
                        $(".site-msg.information").remove();
                    }, shoptet.config.animationDuration);
            }),
        $(".site-agreement").length &&
        ((showOnly = !!$(this).hasClass("show-only")),
            (escClasses = $(".site-agreement").html()),
            shoptet.modal.open({
                opacity: ".95",
                closeButton: showOnly,
                overlayClose: showOnly,
                html: shoptet.content.colorboxHeader + escClasses + shoptet.content.colorboxFooter,
                className: shoptet.modal.config.classMd,
                width: shoptet.modal.config.widthMd,
                onClosed: function () {
                    $(".site-agreement").remove();
                },
                onComplete: function () {
                    $("#cboxOverlay").addClass("siteAgreement"),
                        $("#colorbox").addClass("siteAgreement"),
                        shoptet.modal.shoptetResize(),
                        $("#colorbox img").on("load", function () {
                            shoptet.modal.shoptetResize();
                        });
                },
            })),
            $("html").on("click", ".colorbox-close", function (e) {
                e.preventDefault(), shoptet.modal.close();
            }),
            shoptet.validator.initValidator($("form")),
            $("html").on("click", "a.disabled", function (e) {
                e.preventDefault();
            }),
            $("html").on("click", ".msg", function () {
                hideMsg();
            }),
            $("html").on("click", ".cancel-action", function (e) {
                e.stopPropagation();
            }),
            $("html").on("click", ".hide-content-windows", function (e) {
                e.preventDefault(), shoptet.global.hideContentWindows();
            }),
            $("html").on("touchend click", ".toggle-window, .toggle-window-arr, .toggle-trigger", function (target) {
                ("touchend" !== target.type && $(this).attr("data-redirect")) || target.preventDefault(),
                    $(this).hasClass("hide-content-windows")
                        ? shoptet.global.hideContentWindows()
                        : ((target = $(this).attr("data-target")), ($(this).hasClass("hovered") && "navigation" !== target) || shoptet.global.showPopupWindow(target, !0), $(this).removeClass("hovered"));
            }),
            $("html").on("mouseenter", ".popup-widget, .hovered-nav, .menu-helper", function () {
                clearTimeout(hidePopupWindow);
            }),
            $("html").on("mouseleave", ".popup-widget, .hovered-nav", function () {
                return (
                    ((!$(this).hasClass("login-widget") && !$(this).hasClass("register-widget")) || !$(this).find("input:focus").length) &&
                    ((hidePopupWindow = setTimeout(function () {
                        $("body").removeClass(shoptet.config.bodyClasses);
                    }, shoptet.config.animationDuration)),
                        void $(this).removeClass("hovered"))
                );
            }),
            $("html").on("mouseenter", '.toggle-window[data-hover="true"]', function (show) {
                $(this).addClass("hovered"), show.preventDefault(), clearTimeout(hidePopupWindow);
                var target = $(this).attr("data-target");
                $("body").hasClass(target + "-window-visible") || ((show = !("cart" === target && !$(this).hasClass("full"))), shoptet.global.showPopupWindow(target, show));
            }),
            $("html").on("mouseleave", '.toggle-window[data-hover="true"]', function () {
                detectResolution(shoptet.abilities.config.navigation_breakpoint) &&
                (hidePopupWindow = setTimeout(function () {
                    $("body").removeClass(shoptet.config.bodyClasses);
                }, shoptet.config.animationDuration));
            });
        var escClasses = "";
        (escClasses += ".user-action-visible, "),
            (escClasses += ".top-navigation-menu-visible, "),
            (escClasses += ".user-action-visible input:focus"),
            $("html").on("keyup", ".user-action-visible, .top-navigation-menu-visible, .user-action-visible input:focus", function (e) {
                e.keyCode === shoptet.common.keyCodes.escape && ($("body").removeClass(shoptet.config.bodyClasses), 0 < $(".overlay").length && $(".overlay").detach(), 0 < $(".msg").length && hideMsg());
            }),
            $("html").on("keyup", "input, textarea", function (e) {
                e.stopPropagation();
            }),
            $("#carousel").on("slide.bs.carousel", function () {
                $("#carousel img").each(function () {
                    var $this = $(this);
                    $this.attr("src", $this.attr("data-src"));
                });
            }),
            $("html").on("click", ".js-product-clickable", function (e) {
                e.stopPropagation(), $(e.target).hasClass("js-product-clickable") && (window.location.href = $("a.name", this).attr("href"));
            }),
            $("html").on("click", ".products-top .button-wrapper .toggle-top-products", function (showText) {
                showText.preventDefault();
                var $this = $(this);
                $this.parents().siblings(".inactive").length ? $this.parents().siblings(".inactive").addClass("revealed").removeClass("inactive") : $this.parents().siblings(".revealed").addClass("inactive").removeClass("revealed");
                var text = $this.text(),
                    hideText = text,
                    showText = $this.attr("data-text");
                toggleText($this, text, showText, hideText);
            }),
            $("html").on("click", ".cancel-action", function (e) {
                e.preventDefault(), (id = $(this).attr("data-id")), "" === id ? cancelAction() : cancelAction(id);
            }),
            $("html").on("change, click", "[data-unveil]", function (e) {
                var $this = $(this);
                "a" === $this.context.localName && e.preventDefault(),
                "category-filter-hover" === $this.attr("data-unveil") && $this.parent(".filter-section").hide(),
                    $("#" + $this.attr("data-unveil")).toggleClass("visible"),
                "filters" === $this.attr("data-unveil") && ($("#filters").hasClass("visible") ? $("body").addClass("filters-visible") : $("body").removeClass("filters-visible")),
                $this.parents(".unveil-wrapper").length && $this.parents(".unveil-wrapper").toggleClass("unveiled"),
                $this.attr("data-text") && toggleText($this, $this.text(), $this.text(), $this.attr("data-text")),
                    $("html").trigger("contentResized");
            }),
            $("html").on("click", ".js-window-location", function (e) {
                e.preventDefault(), (window.location.href = $(this).attr("data-url"));
            }),
            initTooltips(),
            initColorbox(),
            $('a[data-toggle="tab"]').on("shown.bs.tab", function ($voteContent) {
                var href = $voteContent.target.getAttribute("href"),
                    parentUl = $voteContent.target.getAttribute("data-external"),
                    forceScroll = $voteContent.target.getAttribute("data-force-scroll"),
                    isTab = !0,
                    accordionLink = $('.shp-accordion-link[href="' + href + '"]'),
                    isAccordion = !!accordionLink.length;
                isAccordion && (isTab = !1);
                var $voteForm = $(href).find(".discussion-form"),
                    $voteContent = $(href).find(".vote-wrap");
                $voteForm.length && !$voteContent.length && $(".add-comment .comment-icon").trigger("click");
                var scrollEl,
                    $voteForm = $(href).find(".vote-form"),
                    $voteContent = $(href).find(".vote-wrap");
                $voteForm.length && !$voteContent.length && $(".add-comment .rating-icon").trigger("click"),
                    $(href + " img").unveil(),
                "#productVideos" === href && shoptet.products.unveilProductVideoTab(href),
                parentUl &&
                (isTab
                    ? ($(".shp-tabs > li").removeClass("active"),
                        $('.shp-tabs > li > a[href="' + href + '"]')
                            .parents("li")
                            .addClass("active"))
                    : isAccordion && (accordionLink.closest(".shp-accordion").addClass("active"), accordionLink.next(".shp-accordion-content").show())),
                isTab && 0 < $(this).parents(".responsive-nav").length && ((parentUl = $(this).parents("ul:first")), $(this).parents(".responsive-nav").find("ul").not(parentUl).find("li").removeClass("active")),
                (!forceScroll && detectResolution(shoptet.config.breakpoints.sm)) || (isTab ? (scrollEl = $(href).closest(".shp-tabs-wrapper")) : isAccordion && (scrollEl = accordionLink), scrollToEl(scrollEl)),
                "function" == typeof shoptet.products.sameHeightOfProducts && shoptet.products.sameHeightOfProducts(),
                    shoptet.products.splitWidgetParameters();
            }),
        $(".tab-pane.active [data-iframe-src]").length && shoptet.products.unveilProductVideoTab();
        var paymentTimeout;
        if (
            ($("html").on("click", "#categories .expandable:not(.external) > a > span,#categories .expandable:not(.external) > .topic > a > span", function (e) {
                e.stopPropagation(), e.preventDefault(), $(this).closest(".expandable").toggleClass("expanded");
            }),
                $("html").on("click", ".link-icon.chat, .link-icon.watchdog", function (e) {
                    e.preventDefault(),
                        shoptet.modal.open({
                            href: $(this).attr("href"),
                            width: shoptet.modal.config.widthSm,
                            className: shoptet.modal.config.classSm,
                            onComplete: function () {
                                shoptet.validator.initValidator($("form"));
                            },
                        });
                }),
                $("html").on("click", "a.colorbox, a.p-main-image.cbox", function (e) {
                    e.preventDefault(), shoptet.modal.open({ href: $(this).attr("href"), maxWidth: shoptet.modal.config.maxWidth, width: shoptet.modal.config.widthLg, className: shoptet.modal.config.classLg });
                }),
                $(".link-icon.print").on("click", function (e) {
                    e.preventDefault(), window.print();
                }),
                $("html").on("click", ".toggle-contacts", function () {
                    toggleContacts($(this)), $("html").trigger("contentResized");
                }),
                $("html").on("click", ".toggle-contacts > a", function (e) {
                    e.preventDefault();
                }),
                $("html").on("click", ".share a", function (e) {
                    e.preventDefault(), window.open($(this).attr("href"), "", "width=600, height=600");
                }),
                $(".html-code textarea").click(function () {
                    $(this).focus().select();
                }),
                $("html").on("click", ".url-generation-box .btn", function () {
                    var $container = $(this).closest(".affiliate-banner"),
                        $newHtmlCodeContainer = $container.find(".url-generation-box .html-code").clone(!0, !0),
                        val = new String($newHtmlCodeContainer.find("textarea").val());
                    $newHtmlCodeContainer.removeClass("no-display").addClass("generated").find("textarea").val(val), $container.find(".generated").remove(), $container.append($newHtmlCodeContainer);
                }),
            $("#onlinePaymentButton").length &&
            ($("#onlinePaymentButton").parents(".suspend-redirect").length ||
            (paymentTimeout = setTimeout(function () {
                (shoptet.events.paymentButtonClicked = !0), (window.location.href = $("#onlinePaymentButton").attr("href"));
            }, 5e3)),
                $("#onlinePaymentButton").click(function () {
                    return !shoptet.events.paymentButtonClicked && ((shoptet.events.paymentButtonClicked = !0), void (paymentTimeout && clearTimeout(paymentTimeout)));
                }),
                (window.onbeforeunload = function () {
                    if (void 0 === shoptet.events.paymentButtonClicked) return "";
                })),
            $(".query-string-param").length &&
            $(".query-string-param a").click(function (params) {
                params.preventDefault();
                params = $(this).attr("href").split("=");
                updateQueryStringParameter(params[0], params[1]);
            }),
                window.location.search.length)
        ) {
            var msgOffset = locationSearchToObject();
            if ((msgOffset.email && $('input[name="email"]').val(msgOffset.email), msgOffset.buyerName && $('input[name="fullName"]').val(msgOffset.buyerName), msgOffset.preselectStars)) {
                var numberOfStars = parseInt(msgOffset.preselectStars);
                $(".star-wrap .star").removeClass("star-on current").addClass("star-off"), $(".rate-list").removeClass("current"), $(".rate-list .star").removeClass("star-on current").addClass("star-off");
                for (var i = 1; i <= numberOfStars; i++) {
                    var rateList,
                        rateListStar = $('.star-wrap [data-score="' + i + '"]');
                    rateListStar.removeClass("star-off").addClass("star-on"),
                    i === numberOfStars &&
                    (rateListStar.addClass("current"),
                        (rateList = $('.rate-list [data-score="' + i + '"]')),
                        (rateListStar = $('.rate-list[data-score="' + i + '"] .star')),
                        rateList.addClass("current"),
                        rateListStar.removeClass("star-off").addClass("star-on"));
                }
                $('input[name="score"]').val(numberOfStars);
            }
        }
        $("html").on("click", ".js-scroll-top", function ($trigger) {
            var $target;
            $trigger.preventDefault();
            $trigger = $(this);
            if (
                (void 0 !== $trigger.attr("data-target")
                    ? ($target = $($trigger.attr("data-target")))
                    : $("#products").length
                        ? ($target = $("#products"))
                        : $("#newsWrapper").length
                            ? ($target = $("#newsWrapper"))
                            : $("#ratingWrapper").length
                                ? ($target = $("#ratingWrapper"))
                                : $(".products").length && ($target = $(".products")),
                0 === $target.length)
            )
                return !1;
            scrollToEl($target);
        }),
            $("html").on("click", ".toggle-coupon-input-button", function (e) {
                $(this).next(".discount-coupon").slideToggle(), $(this).toggleClass("discount-coupon-visible");
            }),
            $(window).load(function () {
                $(".cart-toggle-unselected-options").addClass("js-hidden");
            }),
            $("html").on("click", ".cart-toggle-unselected-options", function (e) {
                $(this).addClass("js-hidden");
                var dataTableId = $(this).data("table");
                $("#" + dataTableId + " .radio-wrapper").removeClass("selected-option unselected-option");
            }),
            initDatepickers(),
        $(".site-msg.information").length && $(".site-msg.cookies").length && ((msgOffset = $(".cookie-ag-wrap").outerHeight() + $(".site-msg.information").offset().left), $(".site-msg.information").css("bottom", msgOffset)),
            $(".show360image").on("click", function () {
                $(".p-thumbnails-inner a.p-thumbnail").removeClass("highlighted"), $(this).addClass("highlighted"), $(this).parents(".p-image-wrapper").find(".p-image").hide(), $(this).parents(".p-image-wrapper").find(".image360").show();
            }),
            document.documentElement.style.setProperty("--scrollbar-width", window.innerWidth - document.documentElement.clientWidth + "px"),
            $("html").on("click", ".js-cookies-settings", function (e) {
                e.preventDefault(), shoptet.consent.openCookiesSettingModal();
            }),
            $("html").on("click", ".js-cookiesConsentSubmit", function (e) {
                e.preventDefault(), shoptet.consent.cookiesConsentSubmit(this.value);
            });
    }),
    (function (shoptet) {
        function hideContentWindows(target) {
            var classesToRemove = shoptet.config.bodyClasses;
            void 0 !== target && (classesToRemove = classesToRemove.replace(target, "")), $("body").removeClass(classesToRemove);
        }
        function showPopupWindow(target, currentTarget) {
            var callback;
            shoptet.global.hideContentWindows(target),
            currentTarget &&
            ("cart" === target &&
            (detectResolution(shoptet.config.breakpoints.md) || $(".cookies").hide(),
            void 0 === shoptet.events.cartLoaded &&
            ((shoptet.events.cartLoaded = !0),
                $("body").addClass("ajax-pending"),
                (callback = function () {
                    void 0 !== shoptet.content.initiateCheckoutData && "undefined" != typeof fbq && (fbq("track", "InitiateCheckout", shoptet.content.initiateCheckoutData), delete shoptet.content.initiateCheckoutData),
                        $("body").removeClass("ajax-pending");
                }),
                setTimeout(function () {
                    shoptet.cart.getCartContent(!1, callback);
                }, 0))),
            "navigation" === target &&
            ($("body").hasClass("navigation-window-visible") ||
                setTimeout(function () {
                    $(document).trigger("menuUnveiled");
                }, shoptet.config.animationDuration)),
                (currentTarget = target + "-window-visible"),
                $("body").hasClass(currentTarget) ? $("body").removeClass("user-action-visible") : $("body").addClass("user-action-visible"),
                $("body").toggleClass(target + "-window-visible"),
                "search" === target && $("body").hasClass("search-window-visible")
                    ? setTimeout(function () {
                        $(".js-search-main .js-search-input:visible").focus();
                    }, shoptet.config.animationDuration)
                    : ($(".js-search-main .js-search-input").blur(), clearSearchFocus()),
            "register" === target &&
            $(".user-action-register .loader").length &&
            shoptet.ajax.makeAjaxRequest(
                shoptet.config.registerUrl,
                shoptet.ajax.requestTypes.get,
                "",
                {
                    success: function (content) {
                        (content = shoptet.common.createDocumentFromString(content.getPayload())), (content = $(content).find("#register-form"));
                        $(".user-action-register .loader").remove(),
                            content.appendTo(".place-registration-here"),
                        $("#additionalInformation").hasClass("visible") || toggleRequiredAttributes($("#additionalInformation"), "remove", !1),
                            shoptet.validator.initValidator($("#register-form")),
                            initDatepickers(),
                            initTooltips(),
                            shoptet.scripts.signalDomLoad("ShoptetDOMRegisterFormLoaded");
                    },
                },
                { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
            ),
                $(".content-window img, .user-action img").unveil(),
                $(".content-window img, .user-action img").trigger("unveil"));
        }
        function updateSelectedRegions(id) {
            if ("billCountryId" === id.attr("id")) (inputPrefix = "bill"), $("#billCountryIdInput").attr("disabled", !0);
            else {
                if ("deliveryCountryId" !== id.attr("id")) return;
                var inputPrefix = "delivery";
                $("#deliveryCountryIdInput").attr("disabled", !0);
            }
            id = id.find("option:selected").val();
            $(".region-select").attr({ disabled: !0, id: "", name: "" }).addClass("hide"),
                $('.region-select[data-country="' + id + '"]')
                    .attr({ disabled: !1, id: inputPrefix + "RegionId", name: inputPrefix + "RegionId" })
                    .removeClass("hide");
        }
        function toggleRegionsWrapper() {
            var $regionsWrapper = $(".regions-wrapper"),
                allRegions = $regionsWrapper.find("select"),
                invisibleRegions = $regionsWrapper.find("select.hide");
            allRegions.length > invisibleRegions.length ? $regionsWrapper.show() : $regionsWrapper.hide();
        }
        function restoreDefaultRegionSelect($el, val) {
            $("#billRegionIdInput").val(val), $(".region-select").addClass("hide"), $el.removeClass("hide"), shoptet.global.toggleRegionsWrapper();
        }
        (shoptet.global = shoptet.global || {}),
            shoptet.scripts.libs.global.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "global");
            });
    })(shoptet),
    (function (shoptet) {
        function toggleMenu() {
            0 === $(".overlay").length ? $('<div class="overlay" />').appendTo("body") : $(".overlay:not(.spinner)").detach();
        }
        function splitMenu() {
            var i,
                $menuHelper = $(".menu-helper"),
                $items = $(".navigation-in .menu-level-1 > li:visible"),
                menuHelperOffset = $menuHelper.length ? $menuHelper.offset() : 0,
                navigElems = [];
            for (
                $("#navigation").removeClass("fitted"),
                    $items.each(function () {
                        var $el = $(this),
                            elemPos = $el.outerWidth() + $el.offset().left;
                        $el.removeClass("splitted"), navigElems.unshift({ $el: $el, elemPos: elemPos });
                    }),
                    i = 0;
                i < navigElems.length && navigElems[i].elemPos > menuHelperOffset.left;
                i++
            )
                navigElems[i].$el.addClass("splitted");
            0 === i && $("#navigation").addClass("fitted"), shoptet.menu.splitHelperMenu($(".navigation-in .menu-level-1 > li").length - i);
        }
        function splitHelperMenu(i) {
            var numberOfAppendedCategories = $(".menu-helper .appended-category").length;
            ($li = $(".menu-helper > ul > li")),
                $li.each(function (index) {
                    ($this = $(this)), index + numberOfAppendedCategories < i ? $this.addClass("splitted") : $this.removeClass("splitted");
                }),
                $li.length - numberOfAppendedCategories === $(".menu-helper > ul > li.splitted").length ? $(".menu-helper").addClass("empty") : $(".menu-helper").removeClass("empty");
        }
        function showSubmenu($el) {
            var $thirdLevelMenu;
            $el.addClass("exp"),
                $("body").addClass("submenu-visible"),
                $(".has-third-level ul").removeClass("has-more-items").find(".more-items-trigger").detach(),
            detectResolution(shoptet.abilities.config.navigation_breakpoint) &&
            (($thirdLevelMenu = $el.find(".has-third-level ul")).length &&
            ($(".has-third-level ul").removeClass("has-more-items"),
                $thirdLevelMenu.each(function () {
                    var $lastLi = $(this).find("li:last-child");
                    getRelativeOffset($lastLi).top + $lastLi.height() > $(this).height() && $(this).addClass("has-more-items").append('<span class="more-items-trigger" />');
                })),
            shoptet.abilities.feature.images_in_menu && $el.find("img").trigger("unveil"));
        }
        function hideSubmenu() {
            $(".menu-level-1 .ext").removeClass("exp"), $("body").removeClass("submenu-visible");
        }
        function updateMenu() {
            clearTimeout(shoptet.runtime.updateMenu), $("html").hasClass("external-fonts-loaded") ? shoptet.menu.splitMenu() : (shoptet.runtime.updateMenu = setTimeout(shoptet.menu.updateMenu, 100));
        }
        function showMenuHelper() {
            $("body").addClass("user-action-visible menu-helper-visible");
        }
        function hideMenuHelper() {
            $("body").removeClass("user-action-visible menu-helper-visible submenu-visible"), $(".menu-helper .ext").removeClass("exp");
        }
        function hideNavigation() {
            $("body").removeClass("user-action-visible submenu-visible navigation-window-visible"), $("#navigation .exp").removeClass("exp");
        }
        $(function () {
            var hoverTimer,
                $html = $("html");
            $html.on("click", ".overlay:not(.spinner)", function () {
                shoptet.menu.toggleMenu(), shoptet.menu.hideNavigation(), $(this).hasClass("visible") && hideMsg();
            }),
                $(".navigation-in .menu-level-1").clone().appendTo(".menu-helper"),
                (shoptet.runtime.menuHelper = !1),
                $html.on("mouseenter", ".menu-helper", function () {
                    clearTimeout(shoptet.runtime.menuHelper),
                        (shoptet.runtime.menuHelper = setTimeout(function () {
                            $("body").hasClass("menu-helper-visible") || shoptet.menu.showMenuHelper();
                        }, shoptet.config.animationDuration));
                }),
                $html.on("mouseleave", ".menu-helper", function () {
                    clearTimeout(shoptet.runtime.menuHelper),
                        (shoptet.runtime.menuHelper = setTimeout(function () {
                            shoptet.menu.hideMenuHelper();
                        }, shoptet.config.animationDuration));
                }),
                $html.on("click", ".menu-helper", function () {
                    clearTimeout(shoptet.runtime.menuHelper), $("body").hasClass("menu-helper-visible") ? shoptet.menu.hideMenuHelper() : shoptet.menu.showMenuHelper();
                }),
            detectResolution(shoptet.abilities.config.navigation_breakpoint) && shoptet.menu.updateMenu(),
                $html.on("touchstart", '#navigation, .navigation-buttons a:not(".js-languagesMenu__list__link")', function (e) {
                    e.stopPropagation();
                }),
                $(".js-languagesMenu__list__link").unbind(),
                $html.on("click touchstart", ".js-languagesMenu__list__link", function () {
                    return (window.location = this.href), !1;
                }),
                $html.on("mouseenter", ".menu-level-1 .ext > a > span", function (e) {
                    e.stopPropagation();
                }),
                $html.on("click", ".menu-level-1 .ext > a > span, .navigationActions .ext > a", function (e) {
                    e.stopPropagation(), e.preventDefault();
                    var $this = $(this),
                        parentSubmenuVisible = $this.parents("li").hasClass("exp");
                    setTimeout(function () {
                        parentSubmenuVisible ? $this.parents("li").removeClass("exp") : shoptet.menu.showSubmenu($this.parents("li"));
                    }, 1),
                        clearTimeout(shoptet.runtime.submenu);
                }),
                (shoptet.runtime.submenu = !1),
                $html.on("mouseover", ".menu-level-1 .ext", function () {
                    var $this;
                    ("1" === shoptet.config.mobileHeaderVersion && !detectResolution(shoptet.abilities.config.navigation_breakpoint)) ||
                    (($this = $(this)),
                        clearTimeout(shoptet.runtime.submenu),
                        (shoptet.runtime.submenu = setTimeout(function () {
                            $this.hasClass("exp") || shoptet.menu.showSubmenu($this);
                        }, shoptet.config.submenuTimeout)));
                }),
                $html.on("mouseleave", ".menu-level-1 .ext", function () {
                    detectResolution(shoptet.abilities.config.navigation_breakpoint) && (clearTimeout(shoptet.runtime.submenu), shoptet.menu.hideSubmenu());
                }),
                $html.on("click", ".menu-level-1 .ext a", function () {
                    $(this).parent().hasClass("ext") && (clearTimeout(shoptet.runtime.submenu), shoptet.menu.hideSubmenu());
                }),
                $html.on("touchstart click", ".navigation-close", function () {
                    shoptet.menu.hideNavigation();
                }),
                $html.on("click", ".more-items-trigger", function () {
                    location.replace($(this).closest("ul").prev("a").attr("href"));
                }),
                $html.on("mouseenter", ".js-navigation-container", function (e) {
                    hoverTimer = setTimeout(function () {
                        $("body").addClass("navigation-hovered");
                    }, 200);
                }),
                $html.on("mouseleave", ".js-navigation-container", function (e) {
                    clearTimeout(hoverTimer), $("body").removeClass("navigation-hovered");
                });
        }),
            (shoptet.menu = shoptet.menu || {}),
            shoptet.scripts.libs.menu.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "menu");
            });
    })(shoptet),
    (function (shoptet) {
        function splitWidgetParameters() {
            for (var wrappers = document.querySelectorAll(".widget-parameter-wrapper"), i = 0; i < wrappers.length; i++) shoptet.products.splitSingleWidgetParameter(wrappers[i]);
        }
        function splitSingleWidgetParameter(wrapper) {
            var list = wrapper.querySelector(".widget-parameter-list"),
                values = wrapper.querySelectorAll(".widget-parameter-value"),
                moreEl = wrapper.querySelector(".widget-parameter-more"),
                valuesToHide = [];
            if ((wrapper.classList.remove("justified"), moreEl.classList.remove("no-display"), moreEl.classList.remove("visible"), shoptet.common.removeClassFromElements(values, "no-display"), shoptet.common.fitsToParentWidth(list)))
                moreEl.classList.add("no-display");
            else {
                for (var moreElWidth = moreEl.offsetWidth, i = 0; i < values.length; i++)
                    if (!shoptet.common.fitsToParentWidth(values[i], moreElWidth)) {
                        valuesToHide = [].slice.call(values, i);
                        break;
                    }
                shoptet.common.addClassToElements(valuesToHide, "no-display"), valuesToHide.length === values.length ? moreEl.classList.add("no-display") : moreEl.classList.add("visible");
            }
            wrapper.classList.add("justified");
        }
        function replaceImage(bigImage) {
            var $mainImage = $(".p-image-wrapper .p-image");
            $(".image360").length && $(".image360").hide(), $mainImage.show();
            var $mainImageLink = $mainImage.find("a"),
                currentImage = bigImage.split("/");
            "object" == typeof currentImage && highlightActiveThumbnail(currentImage[currentImage.length - 1].split("?")[0]),
                $mainImage.find("img").attr("src", bigImage),
                $mainImageLink.attr({ href: bigImage, "data-href": bigImage.replace(/\/big\//, "/orig/") }),
            $(".cloud-zoom").length &&
            (clearTimeout(shoptet.runtime.cloudZoom),
                (shoptet.runtime.cloudZoom = setTimeout(function () {
                    $(".cloud-zoom").data("zoom").destroy(), $(".cloud-zoom").CloudZoom(shoptet.config.cloudZoomOptions);
                }, 201)));
        }
        function highlightActiveThumbnail(imageName) {
            $(".p-thumbnails-inner a.show360image").removeClass("highlighted"),
                $(".p-thumbnails-inner a.p-thumbnail").each(function () {
                    if (-1 !== $(this).attr("href").indexOf(imageName)) return $(".p-thumbnails-inner a.p-thumbnail").removeClass("highlighted"), $(this).addClass("highlighted"), !1;
                });
        }
        function browseProducts($el) {
            if ($el.hasClass("p-all")) return $el.addClass("inactive"), void $el.parents(".browse-p").prev(".p-switchable").addClass("show-all-related").find(".product").find("img").unveil();
            for (
                var firstActive,
                    firstInactive,
                    products = $el.parents(".browse-p").prev(".p-switchable").find(".product"),
                    productsLength = products.length,
                    activeProducts = shoptet.abilities.config.number_of_active_related_products,
                    i = 0;
                i < productsLength &&
                (void 0 === firstActive && $(products[i]).hasClass("active") && (firstActive = i), void 0 === firstInactive && $(products[i]).hasClass("inactive") && (firstInactive = i), void 0 === firstActive || void 0 === firstInactive);
                i++
            );
            $el.hasClass("p-next") &&
            (0 < productsLength - activeProducts - firstActive &&
            ($(products[firstActive]).addClass("inactive").removeClass("active"),
                $(products[firstActive + activeProducts])
                    .addClass("active")
                    .removeClass("inactive")
                    .find("img")
                    .unveil()),
                1 < productsLength - activeProducts - firstActive ? $el.prev(".p-prev").removeClass("inactive") : $el.addClass("inactive"),
            productsLength - activeProducts - firstActive == 1 && $el.prev(".p-prev").removeClass("inactive")),
            $el.hasClass("p-prev") &&
            (firstActive + activeProducts <= productsLength &&
            ($(products[firstActive - 1])
                .addClass("active")
                .removeClass("inactive")
                .find("img")
                .unveil(),
                $(products[firstActive - 1 + activeProducts])
                    .addClass("inactive")
                    .removeClass("active")),
            1 === firstActive && $el.addClass("inactive"),
                $el.next(".p-next").removeClass("inactive"));
        }
        function setThumbnailsDirection() {
            shoptet.abilities.feature.directional_thumbnails && $("#content.wide").length && detectResolution(shoptet.config.breakpoints.sm) ? setThumbnails("vertical") : setThumbnails("horizontal");
        }
        function setThumbnails(direction) {
            (shoptet.config.thumbnailsDirection = direction), $(".p-thumbnails").removeClass("p-thumbnails-horizontal p-thumbnails-vertical"), $(".p-thumbnails").addClass("p-thumbnails-" + direction);
        }
        function checkThumbnailsAction($thumbnailsWrapper, diff, thumbnailsWrapperDimensions, thumbnailsScroll) {
            thumbnailsWrapperDimensions < diff ? $thumbnailsWrapper.addClass("overflow-next") : $thumbnailsWrapper.removeClass("overflow-next"),
                thumbnailsScroll < 0 ? $thumbnailsWrapper.addClass("overflow-prev") : $thumbnailsWrapper.removeClass("overflow-prev");
        }
        function checkThumbnails(direction, action, reset) {
            var thumbnailsWrapperDimensions,
                thumbnailsDimensions,
                thumbnailsScroll,
                $thumbnailsWrapper = $(".p-thumbnails"),
                $thumbnails = $(".p-thumbnails-inner > div"),
                $thumbnailsInner = $(".p-thumbnails-inner");
            thumbnailsScroll =
                "horizontal" == direction
                    ? ((thumbnailsWrapperDimensions = $thumbnailsWrapper.width()), (thumbnailsDimensions = $thumbnails.width()), parseInt($thumbnailsInner.css("left")))
                    : ((thumbnailsWrapperDimensions = $thumbnailsWrapper.height()), (thumbnailsDimensions = $thumbnails.height()), parseInt($thumbnailsInner.css("top")));
            var diff = thumbnailsDimensions + thumbnailsScroll;
            if ("check" == action) return { thumbnailsScroll: thumbnailsScroll, thumbnailsDimensions: thumbnailsDimensions, thumbnailsWrapperDimensions: thumbnailsWrapperDimensions, diff: diff };
            1 == reset
                ? ("horizontal" == direction ? $thumbnailsInner.css("left", 0) : $thumbnailsInner.css("top", 0),
                    setTimeout(function () {
                        checkThumbnailsAction($thumbnailsWrapper, diff, thumbnailsWrapperDimensions, thumbnailsScroll);
                    }, shoptet.config.animationDuration))
                : checkThumbnailsAction($thumbnailsWrapper, diff, thumbnailsWrapperDimensions, thumbnailsScroll);
        }
        function switchThumbnails(direction) {
            var thumbnailsScroll,
                thumbnailsScrollVar,
                sizes = checkThumbnails(shoptet.config.thumbnailsDirection, "check", !1),
                $el = $(".p-thumbnails-inner");
            $(".thumbnail-next, .thumbnail-prev").addClass("clicked"),
                (thumbnailsScroll = "horizontal" == shoptet.config.thumbnailsDirection ? "left" : "top"),
                "prev" == direction
                    ? ((thumbnailsScrollVar =
                        sizes.diff - sizes.thumbnailsWrapperDimensions < sizes.thumbnailsWrapperDimensions
                            ? sizes.thumbnailsDimensions - sizes.thumbnailsWrapperDimensions
                            : -parseInt($el.css(thumbnailsScroll)) + sizes.thumbnailsWrapperDimensions),
                        $el.css(thumbnailsScroll, -thumbnailsScrollVar))
                    : ($(".thumbnail-next").addClass("clicked"),
                        (thumbnailsScrollVar = 0 < sizes.thumbnailsScroll + sizes.thumbnailsWrapperDimensions ? 0 : sizes.thumbnailsWrapperDimensions + sizes.thumbnailsScroll),
                        $el.css(thumbnailsScroll, thumbnailsScrollVar)),
                setTimeout(function () {
                    checkThumbnails(shoptet.config.thumbnailsDirection, "set", !1), $el.find("img").unveil(), $(".thumbnail-next, .thumbnail-prev").removeClass("clicked");
                }, shoptet.config.animationDuration);
        }
        function checkDiscountFlag() {
            var childVisible,
                $flag = $(".p-image-wrapper .flags-extra .flag-discount");
            $flag.length &&
            ((childVisible = !0),
                $flag.find(".empty").each(function () {
                    if (!$(this).hasClass("no-display")) return (childVisible = !1);
                }),
                childVisible ? $flag.removeClass("no-display") : $flag.addClass("no-display"));
        }
        function changeStyle(score) {
            $(".star.current, .rate-list.current").removeClass("current"),
                $('.star-wrap .star[data-score="' + score + '"]').addClass("current"),
                $('.rate-list[data-score="' + score + '"]').addClass("current"),
                $(".rate-list .star.star-on").removeClass("star-on").addClass("star-off"),
                $(".rate-list.current .star").addClass("star-on").removeClass("star-off"),
                $('input[name="score"]').val(score);
        }
        function setStyle($selector) {
            $selector.removeClass("star-off").addClass("star-on").prevAll().removeClass("star-off").addClass("star-on"), $selector.nextAll().removeClass("star-on").addClass("star-off");
        }
        function returnStyle($selector) {
            $(".star-wrap .star.star-on").removeClass("star-on").addClass("star-off"), setStyle($selector);
        }
        function sameHeightOfProductsLoop(target) {
            var maxHeight = 0;
            $(target).each(function () {
                var currentHeight = $(this).outerHeight();
                maxHeight < currentHeight && (maxHeight = currentHeight);
            }),
                $(target).css("height", maxHeight);
        }
        function setHeightOfBigProduct() {
            var siblingWrapperPadding,
                siblingsHeight,
                $el = $(".products-block.big .p.big");
            $el.length &&
            detectResolution(shoptet.config.breakpoints.xl) &&
            ((siblingsHeight = $(".products-block.big .p:not(.big)").first()),
                (siblingWrapperPadding = $(".products-block.big > div:nth-child(2)")),
                (siblingWrapperPadding = parseInt(siblingWrapperPadding.css("padding-bottom"))),
                (siblingsHeight = siblingsHeight[0].getBoundingClientRect().height),
                $el.css("min-height", 2 * siblingsHeight + siblingWrapperPadding));
        }
        function sameHeightOfProducts() {
            var notBigP, bigP, breakpoint;
            shoptet.abilities.config.category.product.same_height_set &&
            ((notBigP = ".products-block:not(.big) .p"),
                (bigP = ".products-block.big .p:not(.big)"),
                $(bigP).removeAttr("style"),
                $(notBigP).removeAttr("style"),
                (breakpoint = shoptet.abilities.config.category.product.same_height_breakpoint),
            detectResolution(shoptet.config.breakpoints[breakpoint]) &&
            (detectResolution(shoptet.config.breakpoints.xl) || $(".products-block.big:not(:first) .p:first:not(.big)").addClass("big"),
            $(notBigP).length && sameHeightOfProductsLoop(notBigP),
            $(bigP).length && sameHeightOfProductsLoop(bigP)),
                setHeightOfBigProduct());
        }
        function unveilProductVideoTab(href) {
            var selector = "[data-iframe-src]";
            href && (selector = href + " " + selector),
                $(selector).each(function () {
                    var self = $(this),
                        src = self.data("iframe-src");
                    self.attr("src") !== src && self.attr("src", src);
                });
        }
        function changeQuantity($this) {
            var $el = $this.parents(".quantity").find(".amount"),
                action = $this.attr("class"),
                callback = !1;
            ($el.parents(".cart-table").length || $el.parents(".cart-widget-product-amount").length || $this.parents(".ao-product").length) &&
            (callback = function () {
                shoptet.cart.updateQuantityInCart($el, shoptet.config.updateQuantityTimeout);
            }),
                shoptet.helpers.updateQuantity($el[0], $el.data("min"), $el.data("max"), $el.data("decimals"), action, callback);
        }
        document.addEventListener("DOMContentLoaded", function () {
            var $html = $("html");
            $html.on("click", "a.shipping-options", function (shippingUrl) {
                shippingUrl.preventDefault(), showSpinner();
                shippingUrl = $(this).attr("href");
                shoptet.ajax.makeAjaxRequest(
                    shippingUrl,
                    shoptet.ajax.requestTypes.get,
                    "",
                    {
                        success: function (content) {
                            content = content.response.payload;
                            !1 !== content &&
                            shoptet.modal.open({
                                html: content,
                                width: shoptet.modal.config.widthMd,
                                maxWidth: shoptet.modal.config.maxWidth,
                                onComplete: function () {
                                    initTooltips();
                                },
                            });
                        },
                    },
                    { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
                );
            }),
                $html.on("click", ".quantity span", function () {
                    changeQuantity($(this));
                }),
                $html.on("keydown", ".quantity span", function (keyName) {
                    var keyNum = keyName.which || keyName.keyCode,
                        keyName = keyName.key;
                    if (13 === keyNum || "Enter" === keyName || 32 === keyNum || " " === keyName) return changeQuantity($(this)), !1;
                }),
            $("#ogImage").length && ($("#ogImage").appendTo("head"), $("#ogImageOriginal").length && $("#ogImageOriginal").remove()),
                setThumbnailsDirection(),
                checkThumbnails(shoptet.config.thumbnailsDirection, "set", !0),
                $html.on("click", ".browse-p a:not(.inactive)", function (e) {
                    e.preventDefault(), browseProducts($(this));
                }),
                $html.on("click", ".thumbnail-next", function (e) {
                    e.preventDefault(), $(this).hasClass("clicked") || switchThumbnails("prev");
                }),
                $html.on("click", ".thumbnail-prev", function (e) {
                    e.preventDefault(), $(this).hasClass("clicked") || switchThumbnails("next");
                }),
                $html.on("click", ".p-thumbnail", function (e) {
                    e.preventDefault(), replaceImage($(this).attr("href"));
                }),
                $html.on("click", ".p-main-image", function (href) {
                    href.preventDefault();
                    href = $(this)
                        .attr("href")
                        .replace(/\/orig\//, "/big/");
                    $('.cbox-gal[href="' + href + '"]').trigger("click");
                }),
                $(".p-intro .quantity").remove(),
                $(".star-wrap .star")
                    .mouseover(function () {
                        returnStyle($(this));
                    })
                    .click(function () {
                        var $a = $(this);
                        changeStyle($a.data("score")), setStyle($a);
                    }),
                $(".star-wrap").mouseleave(function () {
                    var a = $(".star-wrap .current").index();
                    returnStyle($(".star-wrap").children().eq(a));
                }),
            $(".type-product").length && (shoptet.variantsSimple.handler(), shoptet.variantsSplit.handler(), shoptet.variantsCommon.handleBrowserValueRestoration()),
                $("#ratingTab .rate-form-trigger").click(function () {
                    $('.rate-list[data-score="5"]').addClass("current").find(".star").addClass("star-on").removeClass("star-off"),
                        $(".rate-list .star").click(function () {
                            var score = $(this).parents(".rate-list").data("score");
                            changeStyle(score), setStyle($(".star-wrap .star:nth-child(" + score + ")"));
                        });
                }),
                $(".productRatingAction").on("click", function () {
                    var dataString = "productId=" + $(this).data("productid") + "&score=" + $(this).data("score");
                    return (
                        shoptet.ajax.makeAjaxRequest(
                            shoptet.config.rateProduct,
                            shoptet.ajax.requestTypes.post,
                            dataString,
                            {
                                success: function (response) {
                                    $(".stars-wrapper").html(response.getPayload()), initTooltips();
                                },
                            },
                            { "X-Shoptet-XHR": "Shoptet_Coo7ai" }
                        ),
                            !1
                    );
                }),
                $("#productDiscussion .add-comment").click(function () {
                    $("#productDiscussion .add-comment").show(),
                        $(this).hide(),
                        $(".discussion-form").show(),
                        moveElementAfterSelector($(".discussion-form"), $(this)),
                        $('.discussion-form input[name="parentId"]').remove(),
                    $(this).attr("data-id") && $('<input name="parentId" value="' + $(this).data("id") + '" type="hidden">').insertAfter('.discussion-form input[name="productId"]');
                }),
                $html.on("click", ".load-products", function ($el) {
                    shoptet.scripts.signalCustomEvent("ShoptetPageMoreProductsRequested", $el.target);
                    $el = $(".pagination .current");
                    showSpinner(),
                        $.ajax({
                            type: "POST",
                            url: $el.next("a").attr("href"),
                            headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
                            success: function (pagination) {
                                var $productsWrapper = shoptet.common.createDocumentFromString(pagination);
                                shoptet.tracking.trackProductsFromPayload($productsWrapper);
                                var listing = $($productsWrapper).find(".products-page > .product"),
                                    pagination = $($productsWrapper).find(".pagination-wrapper"),
                                    $productsWrapper = $(".products-page");
                                null !== listing &&
                                ($productsWrapper.last().append(listing),
                                    $(".pagination-wrapper").replaceWith(pagination),
                                    sameHeightOfProducts(),
                                    shoptet.products.splitWidgetParameters(),
                                    initTooltips(),
                                    setTimeout(function () {
                                        $(".products-page img").unveil();
                                    }, 1),
                                    history.pushState(null, null, this.url),
                                "scrollRestoration" in history && (history.scrollRestoration = "manual"),
                                    hideSpinner()),
                                    shoptet.scripts.signalDomLoad("ShoptetDOMPageMoreProductsLoaded", $productsWrapper[0]);
                            },
                        });
                }),
                $html.on("click", ".js-share-buttons-trigger", function (e) {
                    e.preventDefault(), $(".social-buttons").toggleClass("no-display");
                }),
            "loading" in HTMLIFrameElement.prototype &&
            $("iframe[data-iframe-src]").each(function () {
                var self = $(this);
                self.attr("src", self.data("iframe-src")), self.removeAttr("data-iframe-src");
            });
        }),
            window.addEventListener("load", function () {
                shoptet.products.splitWidgetParameters();
            }),
            (shoptet.products = shoptet.products || {}),
            shoptet.scripts.libs.products.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "products");
            });
    })(shoptet),
    $(function () {
        var $html = $("html"),
            $body = $("body"),
            $searchInput = $(".search input.query-input");
        $searchInput.length &&
        $searchInput.parents("form").each(function () {
            var $this = $(this),
                whispererClass = shoptet.abilities.feature.extended_search_whisperer ? "searchWhisperer" : "search-whisperer";
            (shoptet.abilities.feature.extended_search_whisperer ? $this : $this.find($searchInput)).after('<div class="' + whispererClass + '"></div>'),
                fulltextSearch($this.find($searchInput), $this.parent().find("." + whispererClass));
        }),
            $html.on("click", ".whisperer-trigger", function (e) {
                e.stopPropagation(), e.preventDefault(), $(this).parents(".search-form").submit();
            }),
            $html.on("focus", '.search-form input[type="search"]', function (e) {
                $body.addClass("search-focused"),
                    shoptet.common.moveCursorToEnd(e.target),
                !shoptet.abilities.feature.focused_search_window || shoptet.config.orderingProcess.active || $body.hasClass("search-window-visible") || shoptet.global.showPopupWindow("search", !0);
            }),
            $html.on("blur", '.search-form input[type="search"]', function () {
                $(".searchWhisperer.active").length || clearSearchFocus();
            }),
            $html.on("click", ".search-input-icon", function () {
                $body.hasClass("search-window-visible") ? (shoptet.global.hideContentWindows(), clearSearchFocus()) : $body.hasClass("search-focused") ? clearSearchFocus() : $(this).closest("form").find(".js-search-input").focus();
            }),
            $html.on("click", ".js-try-search-button", function () {
                detectResolution(shoptet.abilities.config.navigation_breakpoint) ? $(".js-search-input").focus() : shoptet.global.showPopupWindow("search", !0);
            }),
            $html.on("click", "#loadNextSearchResults", function (string) {
                string.preventDefault(), $(this).after('<div class="loader static accented" />'), $(this).remove();
                var offset = $(string.target).data("offset"),
                    string = $(string.target).data("string");
                $.ajax({
                    url: "/action/productSearch/ajaxNextContent?string=" + string + "&offset=" + offset,
                    headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
                    async: !0,
                    timeout: 150800,
                    dataType: "html",
                    success: function (data, textStatus, xOptions) {
                        $(".search-next-wrap").remove(), $("#products-found").append(data).fadeIn("slow"), $("#products-found img").unveil(), initTooltips(), shoptet.scripts.signalDomLoad("ShoptetDOMPageContentLoaded");
                    },
                });
            }),
            $html.on("click", ".display-results-group", function (e) {
                e.preventDefault(), ($list = $(this).siblings(".search-results-group-list")), $list.find(".no-display").removeClass("no-display"), $(this).hide();
            }),
            $html.on("submit", ".search-form", function () {
                if (!checkMinimalLength($(this).find('input[type="search"]'))) return !1;
            }),
        detectRecommended() < 1 && hideRecommended(),
            $html.on("click", ".recommended-products .browse", function (e) {
                e.preventDefault(), $(this).hasClass("prev") ? switchRecommended("prev") : switchRecommended("next");
            });
    });
var priceFilter = function (categoryMinValue, categoryMaxValue) {
    var selectedMaxValue = parseFilterValuesFromContent(),
        selectedMinValue = selectedMaxValue[0],
        selectedMaxValue = selectedMaxValue[1];
    formatFilterValues(selectedMinValue, selectedMaxValue),
        $("#slider").slider({
            range: !0,
            min: categoryMinValue,
            max: categoryMaxValue,
            values: [selectedMinValue, selectedMaxValue],
            slide: function (event, slidedMaxValue) {
                if (categoryMaxValue - categoryMinValue < 2) return !1;
                var slidedMinValue = slidedMaxValue.values[0].toString(),
                    slidedMaxValue = slidedMaxValue.values[1].toString();
                formatFilterValues(slidedMinValue, slidedMaxValue);
            },
            stop: function (event, url) {
                if (categoryMaxValue - categoryMinValue < 2) return !1;
                var rawSlidedMinValue = shoptet.helpers.toFloat(url.values[0]) / currencyExchangeRate,
                    urlValuePriceMax = shoptet.helpers.toFloat(url.values[1]) / currencyExchangeRate,
                    slidedMinValue = Math.round(rawSlidedMinValue),
                    slidedMaxValue = Math.round(urlValuePriceMax);
                $("#price-value-min").attr("value", slidedMinValue), $("#price-value-max").attr("value", slidedMaxValue);
                for (
                    var queryPair, urlValuePriceMin, url = window.location.href.split("?")[0], queryVars = window.location.search.replace("?", "").split("&"), filteredQueryVars = [], url = url.replace(shoptet.content.regexp, ""), idx = 0;
                    idx < queryVars.length;
                    idx++
                )
                    "" !== (queryPair = queryVars[idx].split("="))[0] &&
                    "priceMin" !== queryPair[0] &&
                    "priceMax" !== queryPair[0] &&
                    filteredQueryVars.push({
                        key: queryPair[0],
                        value: queryPair[1],
                        toString: function () {
                            return this.key + "=" + this.value;
                        },
                    });
                0 < filteredQueryVars.length && (url += "?" + filteredQueryVars.join("&")),
                    (urlValuePriceMax =
                        1 === currencyExchangeRate
                            ? ((urlValuePriceMin = slidedMinValue), slidedMaxValue)
                            : ((urlValuePriceMin = (Math.round(100 * rawSlidedMinValue) / 100).toFixed(2)), (Math.round(100 * urlValuePriceMax) / 100).toFixed(2))),
                    (url += url.split("?")[1] ? "&" : "?"),
                    makeFilterAjaxRequest((url += "priceMin=" + urlValuePriceMin + "&priceMax=" + urlValuePriceMax), !0, !1, event.target, "ShoptetPagePriceFilterChange");
            },
        });
};
function makeFilterAjaxRequest(url, pushHistoryState, successCallback, element, event) {
    showSpinner(),
        (pushHistoryState = void 0 === pushHistoryState || pushHistoryState),
        shoptet.scripts.signalCustomEvent(event, element),
        $.ajax({
            url: url,
            type: "GET",
            headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
            dataType: "html",
            timeout: 1e4,
            cache: !0,
            success: function ($payloadContentWrapper) {
                var $categoryMinValue = shoptet.common.createDocumentFromString($payloadContentWrapper);
                shoptet.tracking.trackProductsFromPayload($categoryMinValue);
                var payloadNavContent,
                    payloadContent = $($categoryMinValue).find("#content"),
                    $payloadContentWrapper = $("#content");
                $payloadContentWrapper.html(payloadContent[0].innerHTML),
                $($categoryMinValue).find("#filters").length &&
                ((payloadNavContent = $($categoryMinValue).find("#filters")), $("#filters").length || $("#category-header").after('<div id="filters" />'), $("#filters").html(payloadNavContent[0].innerHTML)),
                $($categoryMinValue).find(".breadcrumbs").length && ((payloadNavContent = $($categoryMinValue).find(".breadcrumbs").clone()), $(".breadcrumbs").html(payloadNavContent[0].innerHTML)),
                $($categoryMinValue).find(".header-title").length && (($categoryMaxValue = $($categoryMinValue).find(".header-title").clone()), $(".header-title").html($categoryMaxValue[0].innerHTML));
                var $selector,
                    current,
                    baseTitle,
                    $categoryMinValue = $("#categoryMinValue"),
                    $categoryMaxValue = $("#categoryMaxValue");
                $categoryMinValue.length && (categoryMinValue = parseInt($categoryMinValue.text())),
                $categoryMaxValue.length && (categoryMaxValue = parseInt($categoryMaxValue.text())),
                    priceFilter(categoryMinValue, categoryMaxValue),
                    $("#content-wrapper img").unveil(),
                    detectFilters(),
                    initTooltips(),
                    hideSpinner(),
                    dismissMessages(),
                    setTimeout(function () {
                        shoptet.products.sameHeightOfProducts();
                    }, 1e3),
                    shoptet.products.splitWidgetParameters();
                try {
                    pushHistoryState
                        ? ($(".breadcrumbs").length
                            ? ((current = ($selector = $(".breadcrumbs > span:last")).find("span").data("title")),
                                (baseTitle = $("#navigation-first").data("basetitle")),
                                (document.title = current + " - " + baseTitle),
                                history.pushState(null, null, $selector.find("meta").attr("content")))
                            : history.pushState(null, null, url),
                        "scrollRestoration" in history && (history.scrollRestoration = "auto"))
                        : (document.title = $('meta[property="og:title"]').attr("content"));
                } catch (err) {}
                "function" == typeof successCallback && successCallback(), shoptet.scripts.signalDomLoad("ShoptetDOMPageContentLoaded", $payloadContentWrapper[0]);
            },
            error: function () {
                hideSpinner(),
                    $("html, body").animate({ scrollTop: 0 }, shoptet.config.animationDuration, function () {
                        showMessage(shoptet.messages.ajaxError, "warning", "", !1, !1);
                    });
            },
        });
}
function moveFilters($el, targetLocation) {
    ("default" != targetLocation ? $("#filters-wrapper") : $("#filters-default-position")).after($el);
}
function detectFilters() {
    var filtersDefaultPosition, $asideFilterSelector;
    $(".filters-wrapper").length &&
    (($el = $(".filters-wrapper")),
    ("left" != (filtersDefaultPosition = $("#filters-default-position").attr("data-filters-default-position")) && "right" != filtersDefaultPosition) ||
    (($asideFilterSelector = $(".sidebar-" + filtersDefaultPosition + " .filters-wrapper")).length && !$asideFilterSelector.is(":visible")
        ? moveFilters($el, "content")
        : $(".sidebar-" + filtersDefaultPosition).is(":visible") && moveFilters($el, "default")));
}
var parseFilterValuesFromContent = function () {
        var values = [];
        return (values[0] = $("#min").text().toString()), (values[1] = $("#max").text().toString()), values;
    },
    formatFilterValues = function (selectedMinValue, selectedMaxValue) {
        for (var reverseNumberMin = "", finalNumberMin = "", reverseNumberMax = "", finalNumberMax = "", i = selectedMinValue.length; 0 <= i; i--) reverseNumberMin += selectedMinValue.charAt(i);
        for (var formatedNumber = reverseNumberMin.replace(/(.{3})/g, "$1" + shoptet.config.thousandSeparator), i = formatedNumber.length; 0 <= i; i--) finalNumberMin += formatedNumber.charAt(i);
        for (i = selectedMaxValue.length; 0 <= i; i--) reverseNumberMax += selectedMaxValue.charAt(i);
        for (var formatedMaxNumber = reverseNumberMax.replace(/(.{3})/g, "$1" + shoptet.config.thousandSeparator), i = formatedMaxNumber.length; 0 <= i; i--) finalNumberMax += formatedMaxNumber.charAt(i);
        $("#min").text(finalNumberMin), $("#max").text(finalNumberMax);
    };
$(function () {
    var $html = $("html");
    $(".filters").length &&
    (window.onpopstate = function () {
        makeFilterAjaxRequest(location.href, !1, !1, document, "ShoptetPageFiltersRecalledFromHistory");
    }),
    $("#slider").length && priceFilter(categoryMinValue, categoryMaxValue),
        $html.on("click", ".filter-section input, .active-filters .input", function (e) {
            makeFilterAjaxRequest(e.target.getAttribute("data-url"), !0, !1, e.target, "ShoptetPageFilterValueChange");
        }),
        $html.on("click", "div.category-header input", function (e) {
            makeFilterAjaxRequest(e.target.getAttribute("data-url"), !0, !1, e.target, "ShoptetPageSortingChanged");
        }),
        $html.on("click", "p#clear-filters a", function (e) {
            e.preventDefault(), makeFilterAjaxRequest(e.target.getAttribute("href"), !0, !1, e.target, "ShoptetPageFiltersCleared");
        }),
        $html.on("click", "div.pagination a", function (e) {
            e.preventDefault();
            var $scrollTarget = !1,
                ajaxCallback = !1;
            $(".products:not(.products-top)").length
                ? ($scrollTarget = $(".products:not(.products-top)"))
                : $("#newsWrapper").length
                    ? ($scrollTarget = $("#newsWrapper"))
                    : $("#ratingWrapper").length && ($scrollTarget = $("#ratingWrapper")),
            $scrollTarget && (ajaxCallback = scrollToEl($scrollTarget)),
                makeFilterAjaxRequest(e.target.getAttribute("href"), !0, ajaxCallback, e.target, "ShoptetPagePaginationUsed");
        }),
    $(".sidebar-right .filters-wrapper").length && $(".sidebar-right").addClass("has-categories"),
        detectFilters();
}),
    $(document)
        .on("mouseenter", ".swap-images", function () {
            var img = $(this).find(".swap-image");
            img.attr("data-next") && img.attr("src", img.attr("data-next"));
        })
        .on("mouseleave", ".swap-images", function () {
            var img = $(this).find(".swap-image");
            img.attr("data-next") && img.attr("src", img.attr("data-src"));
        }),
shoptet.abilities.feature.smart_labels &&
((function ($) {
    $.fn.SmartLabels = function (options) {
        var settings = $.extend({}, { populatedClass: "populated", focusedClass: "focused" }, options),
            validTypes = ["text", "phone", "tel", "password", "number", "email", "select"];
        return this.each(function () {
            var att,
                phonelabel,
                phoneInput,
                element = $(this),
                input = element.find("input, select");
            void 0 !== input[0] &&
            ("tel" == $(input[1]).attr("type") && (input = $(input[1])),
            "SELECT" == input[0].nodeName && (((att = document.createAttribute("type")).value = "select"), input[0].setAttributeNode(att)),
            -1 < validTypes.indexOf(input.attr("type")) &&
            ("" == input.val() ? element.removeClass(settings.populatedClass) : element.addClass(settings.populatedClass),
                input.on("focus", function () {
                    element.addClass(settings.focusedClass);
                }),
                input.on("blur", function () {
                    element.removeClass(settings.focusedClass), input.val() || element.removeClass(settings.populatedClass);
                }),
                input.on("keyup", function () {
                    element.addClass(settings.populatedClass);
                }))),
            this.classList.contains("js-phone-form-group") &&
            ((phonelabel = this.getElementsByTagName("label")[0]),
                (phoneInput = this.querySelectorAll(".js-phone-form-control")),
                phonelabel.style.setProperty("left", phoneInput[0].offsetLeft + "px"),
                document.addEventListener(
                    "ShoptetPhoneCodeChange",
                    function (e) {
                        phonelabel.style.setProperty("left", phoneInput[0].offsetLeft + "px");
                    },
                    !1
                ));
        });
    };
})(jQuery),
    $(document).ready(function () {
        $(".smart-label-wrapper").SmartLabels();
    })),
    (function (shoptet) {
        function toggleAnotherShipping($billRegionIdInput) {
            void 0 === $billRegionIdInput && ($billRegionIdInput = !0);
            var defaultCountryVal,
                $defaultBillRegionId,
                $billCountryIdInput = $("#shipping-address"),
                $billCountryId = $("#billCountryId"),
                $regionSelect = $(".region-select");
            $billCountryIdInput.hasClass("visible")
                ? ($billCountryIdInput.removeClass("visible"),
                    toggleRequiredAttributes($billCountryIdInput, "remove", !1),
                    (defaultCountryVal = $billCountryId.find("option[data-default-option]").val()),
                    ($billRegionId = $regionSelect.find("option[data-default-option]").val()),
                    ($defaultBillRegionId = $(".region-select[data-country=" + defaultCountryVal + "]")),
                    $billCountryId.val(defaultCountryVal),
                    $defaultBillRegionId.val($billRegionId),
                    shoptet.global.restoreDefaultRegionSelect($defaultBillRegionId, $billRegionId),
                    shoptet.validatorZipCode.updateZipValidPattern($billCountryId),
                    shoptet.validatorCompanyId.updateCompanyIdValidPattern())
                : ($billCountryIdInput.addClass("visible"), toggleRequiredAttributes($billCountryIdInput, "add", !1), $billRegionIdInput && scrollToEl($billCountryIdInput));
            var $billRegionId = $("#billRegionId"),
                $billRegionIdInput = $("#billRegionIdInput"),
                $billCountryIdInput = $("#billCountryIdInput");
            $billCountryId.attr("disabled", !$billCountryId.is(":disabled")),
                $regionSelect.attr("disabled", $billRegionIdInput.is(":disabled")),
                $billCountryIdInput.attr({ disabled: !$billCountryIdInput.is(":disabled"), value: $billCountryId.find("option:selected").val() }),
                $billRegionIdInput.attr({ disabled: !$billRegionIdInput.is(":disabled"), value: $billRegionId.find("option:selected").val() }),
                $("#deliveryRegionId").attr({ value: $billRegionId.find("option:selected").val() }),
                setTimeout(function () {
                    $(".smart-label-wrapper").SmartLabels();
                }, 0);
        }
        function compareHeight($elToCompare, $comparedElement) {
            return $elToCompare.height() < $comparedElement.height();
        }
        function fixSidebar() {
            var windowHeight = $(window).height(),
                sidebarHeight = shoptet.checkout.$checkoutSidebar.height(),
                offset = shoptet.checkout.$checkoutContent.offset(),
                scrollTop = $(document).scrollTop(),
                headerHeight = shoptet.abilities.feature.fixed_header ? $("#header").height() : 0;
            windowHeight + scrollTop < document.documentElement.scrollHeight &&
            (offset.top < scrollTop + headerHeight && detectResolution(shoptet.config.breakpoints.md)
                ? sidebarHeight < windowHeight - headerHeight
                    ? shoptet.checkout.$checkoutSidebar.css({ position: "relative", top: scrollTop - offset.top + headerHeight })
                    : offset.top + sidebarHeight < windowHeight + scrollTop
                        ? shoptet.checkout.$checkoutSidebar.css({ position: "relative", top: scrollTop - sidebarHeight + windowHeight - offset.top })
                        : shoptet.checkout.$checkoutSidebar.css({ position: "static" })
                : shoptet.checkout.$checkoutSidebar.removeAttr("style"));
        }
        function handleWithSidebar() {
            compareHeight(shoptet.checkout.$checkoutContent, shoptet.checkout.$checkoutSidebar) ? shoptet.checkout.$checkoutSidebar.removeAttr("style") : fixSidebar();
        }
        (shoptet.checkout = shoptet.checkout || {}),
            shoptet.scripts.libs.checkout.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "checkout");
            }),
            (shoptet.checkout.$checkoutContent = $("#checkoutContent")),
            (shoptet.checkout.$checkoutSidebar = $("#checkoutSidebar")),
            (shoptet.checkout.handleWithSidebar = handleWithSidebar),
            document.addEventListener("DOMContentLoaded", function () {
                detectResolution(shoptet.config.breakpoints.md) &&
                shoptet.checkout.$checkoutSidebar.length &&
                (compareHeight(shoptet.checkout.$checkoutContent, shoptet.checkout.$checkoutSidebar) || fixSidebar(),
                    $(window).bind("scroll", function () {
                        handleWithSidebar();
                    }),
                    $("html").bind("contentResized", function () {
                        compareHeight(shoptet.checkout.$checkoutContent, shoptet.checkout.$checkoutSidebar) ? shoptet.checkout.$checkoutSidebar.removeAttr("style") : fixSidebar();
                    }));
                var lastData,
                    $document = $("#order-form");
                $document.length &&
                ((lastData = $document.serialize()),
                    $("#order-form input").blur(function () {
                        var data = $(this).closest("form").serialize();
                        data != lastData && ($.post("/action/OrderingProcess/step2CustomerAjax/", data), (lastData = data));
                    }));
                $document = $(document);
                $document.on("click", "#orderFormButton", function () {
                    $("#orderFormSubmit").click();
                }),
                    $document.on("click", "#orderFormSubmit", function () {
                        var $label = $('input[name="shippingId"].choose-branch:checked');
                        if ($label.length) {
                            var code = $label.attr("data-external") ? "external-shipping" : $label.attr("data-code"),
                                $label = $label.siblings("label");
                            if (!$label.find(".chosen").length)
                                return !(!$label.find(".zasilkovna-choose").length || $label.find(".zasilkovna-default").length) || (showMessage(shoptet.messages["choose-" + code], "error", "", !1, !1), scrollToEl($label), !1);
                        }
                    }),
                    $("#shippingAddressBox")
                        .on("change", function () {
                            var $fields = $("#shipping-address .form-option-block").find("input");
                            "-1" == this.value
                                ? $fields.each(function () {
                                    $(this).val("");
                                })
                                : shoptet.checkoutShared.setFieldValues($(this).find("option:selected").data("record")),
                                $fields.each(function () {
                                    shoptet.scripts.signalNativeEvent("change", this);
                                });
                        })
                        .change(),
                    $document.on("change", ".ordering-process #deliveryRegionId", function () {
                        var $parentForm = $(this).parents("form");
                        shoptet.cart.ajaxSubmitForm($parentForm.attr("action"), $parentForm[0], "functionsForStep1", !0, !0);
                    }),
                    $document.on("change", "#select-country-payment select", function () {
                        return (
                            !$(this).hasClass("not-ajax") &&
                            void (
                                ($("#deliveryCountryId").val() == deliveryCountryIdValue && $("#payment-currency").val() == currencyCode) ||
                                (($parentForm = $(this).parents("form")), shoptet.cart.ajaxSubmitForm($parentForm.attr("action"), $parentForm[0], "functionsForStep1", !0, !0))
                            )
                        );
                        var $parentForm;
                    });
            });
    })(shoptet),
    (function (shoptet) {
        function setActiveShippingAndPayments() {
            shoptet.abilities.elements.recapitulation_in_checkout && $(".order-summary-item.price").before('<div id="shipping-billing-summary" class="order-recapitulation"></div>'),
                $(".shipping-billing-table").each(function () {
                    ($(this).find('input[type="radio"]:checked').length ? $(this).find('input[type="radio"]:checked') : $(this).find('input[type="radio"]').first()).closest(".radio-wrapper").addClass("active");
                }),
                shoptet.checkoutShared.callShippingBillingRelations();
        }
        function callShippingBillingRelations() {
            var billingIds = $("#order-shipping-methods .radio-wrapper.active").find("input:checked").attr("data-relations");
            shoptet.checkoutShared.changePaymentRelations(billingIds);
        }
        function changePaymentRelations(billingIds) {
            billingIds &&
            ($("#order-billing-methods .radio-wrapper").addClass("inactive-child"),
                $(".billing-name").addClass("inactive"),
                $(".billing-name").removeClass("active"),
                $('input[name="billingId"], input[name="gopayPayInstrument"]').prop("disabled", !0),
                $(".table-payu").css("display", "none"),
                (billingIds = billingIds.split(",")),
                $.each(billingIds, function ($activeBilling) {
                    $activeBilling = $.trim(billingIds[$activeBilling]);
                    $("#billingId-" + $activeBilling).prop("disabled", !1), $(".billingId-" + $activeBilling).prop("disabled", !1);
                    $activeBilling = $(".name-billingId-" + $activeBilling);
                    $activeBilling.removeClass("inactive").addClass("active"), $activeBilling.parents(".radio-wrapper").removeClass("inactive-child");
                }),
                $("#order-billing-methods .radio-wrapper.active").find('input[name="gopayPayInstrument"]').length
                    ? $(".gopay-billing").attr("name", "billingId")
                    : ($(".gopay-billing").removeAttr("name"), $('input[name="gopayPayInstrument"]').prop("checked", !1)),
            $("#payu-template label").hasClass("inactive") || $(".table-payu").css("display", "block"),
            $("#payu-template").hasClass("active") || $("#payu-template input").prop("checked", !1)),
                shoptet.checkoutShared.checkIsSelectedActive();
        }
        function replacingChosenShippingAndBilling() {
            var $shippingAndBillingTables = $(".shipping-billing-table"),
                $shippingAndBillingSummary = $("#shipping-billing-summary");
            $shippingAndBillingSummary.html(""),
                $shippingAndBillingTables.each(function () {
                    var $activeLine = $(this).find(".radio-wrapper.active");
                    $activeLine.length || ($activeLine = $(this).find(".radio-wrapper:first")).find("input").prop("checked", !0),
                        "shipping" === $activeLine.closest(".shipping-billing-table").attr("data-type-code")
                            ? ((singleLine = "ShoptetShippingMethodUpdated"), (shoptet.checkoutShared.activeShipping = $activeLine[0]))
                            : ((singleLine = "ShoptetBillingMethodUpdated"), (shoptet.checkoutShared.activeBilling = $activeLine[0])),
                        shoptet.scripts.signalCustomEvent(singleLine);
                    var singleLine = $activeLine.find(".shipping-billing-name").clone();
                    singleLine.find(".question-tooltip").remove(),
                        (singleLine = singleLine.text()),
                        (singleLine =
                            '<div class="recapitulation-single recapitulation-shipping-billing"><span class="recapitulation-shipping-billing-label">' +
                            $activeLine.closest(".shipping-billing-table").attr("data-type") +
                            ':</span> <strong class="recapitulation-shipping-billing-info"><span data-testid="shippingBillingPrice">' +
                            $activeLine.find(".payment-shipping-price").html() +
                            "</span> " +
                            singleLine +
                            "</strong></div>"),
                        $shippingAndBillingSummary.append(singleLine);
                }),
                $shippingAndBillingSummary.find(".recapitulation-single:last").addClass("last"),
                shoptet.checkoutShared.displaySelectedPriceByShippingBillingMethods();
        }
        function displaySelectedPriceByShippingBillingMethods() {
            var shippingActive, billingActive, $activeShippingEl, $activeBillingEl;
            $("#order-shipping-methods").length &&
            ((billingActive = shippingActive = ""),
                ($activeShippingEl = $("#order-shipping-methods .radio-wrapper.active")),
                ($activeBillingEl = $("#order-billing-methods .radio-wrapper.active")),
            $activeShippingEl.length && (shippingActive = $activeShippingEl.data("id")),
            $activeBillingEl.length && (billingActive = $activeBillingEl.data("id")),
            "" !== shippingActive && (shippingActive = shippingActive.replace("shipping-", "")),
            "" !== billingActive && (billingActive = billingActive.replace("billing-", "")),
                shoptet.checkoutShared.updatePriceSummary(shippingActive, billingActive));
        }
        function checkIsSelectedActive() {
            var checkerLocker;
            $("#order-billing-methods .radio-wrapper.active label").hasClass("inactive") &&
            ($("#order-billing-methods .radio-wrapper.active input").prop("checked", !1),
                $("#order-billing-methods .radio-wrapper.active").removeClass("active"),
                (checkerLocker = 0),
                $("#order-billing-methods .radio-wrapper").each(function () {
                    0 !== checkerLocker || $(this).find("label").hasClass("inactive") || ($(this).find("input").prop("checked", !0), $(this).addClass("active"), (checkerLocker = 1));
                })),
                shoptet.checkoutShared.replacingChosenShippingAndBilling();
        }
        function payu() {
            var payuTable = document.getElementById("payu_"),
                payuTemplate = document.getElementById("payu-template");
            if (payuTable && payuTemplate) {
                payuTemplate.appendChild(payuTable),
                payuTemplate.querySelector('input[name="billingId"]:checked') &&
                (payuTable.querySelector('input[value="' + shoptet.config.payuPayType + '"]')
                    ? (payuTable.querySelector('input[value="' + shoptet.config.payuPayType + '"]').checked = !0)
                    : (payuTable.querySelector("input").checked = !0)),
                    payuTable.addEventListener("mousedown", function (e) {
                        e.stopPropagation();
                    });
                var payuInputs = payuTable.querySelectorAll(".table-payu input");
                if (payuInputs)
                    for (var i = 0; i < payuInputs.length; i++)
                        payuInputs[i].addEventListener("mousedown", function (activeLine) {
                            activeLine.stopPropagation();
                            activeLine = document.querySelector(".payu-billing-info");
                            activeLine.classList.contains("active") ||
                            ((document.querySelector("#order-billing-methods .radio-wrapper.active input").checked = !1),
                                document.querySelector("#order-billing-methods .radio-wrapper.active").classList.remove("active"),
                                activeLine.classList.add("active"),
                                (activeLine.querySelector("input").checked = !0),
                                shoptet.checkoutShared.replacingChosenShippingAndBilling());
                        });
            }
        }
        function getStatedValues() {
            (deliveryCountryIdValue = $("#deliveryCountryId").val()),
                (regionCountryIdValue = $("#deliveryRegionId").val()),
                (currencyCode = $("#payment-currency").val()),
                (shoptet.checkoutShared.deliveryCountryId = deliveryCountryIdValue),
                (shoptet.checkoutShared.regionCountryId = regionCountryIdValue),
                (shoptet.checkoutShared.currencyCode = currencyCode),
                shoptet.scripts.signalCustomEvent("ShoptetBaseShippingInfoObtained");
        }
        function setFieldValues($fields) {
            if ($fields)
                for (key in $fields) {
                    $fields.hasOwnProperty(key) && document.getElementById(key) && $("#" + key).val($fields[key]);
                }
        }
        function displayApplePay() {
            try {
                window.ApplePaySession && window.ApplePaySession.canMakePayments() && $(".apple-pay").show();
            } catch (err) {}
        }
        function updatePrice(e) {
            var priceHolder = e.target.querySelector(".payment-shipping-price");
            priceHolder.classList.contains("shipping-price-not-specified") && !e.detail.invalidate && priceHolder.classList.remove("shipping-price-not-specified"),
                e.detail.invalidate || null === e.detail.price.withVat
                    ? (priceHolder.classList.add("shipping-price-not-specified"), (priceHolder.innerHTML = shoptet.messages.specifyShippingMethod))
                    : (priceHolder.innerHTML = e.detail.price.withVat.ShoptetFormatAsCurrency(void 0, void 0, shoptet.config.decPlacesSystemDefault)),
                priceHolder.setAttribute("data-shipping-price-wv", e.detail.price.withVat),
                priceHolder.setAttribute("data-shipping-price-wov", e.detail.price.withoutVat),
                shoptet.checkoutShared.afterPriceChange();
        }
        function getPriceFromElement(el, attribute) {
            return el && Number(el.getAttribute(attribute));
        }
        function updatePriceSummary(prices_shipping, prices_billing) {
            var calculatedPriceWithoutVat = document.querySelector('[data-shipping-price-id="' + prices_shipping + '"]'),
                calculatedPriceWithVat = document.querySelector('[data-billing-price-id="' + prices_billing + '"]'),
                cartPriceWithVat = document.querySelector("[data-price-total-wv]"),
                cartPriceWithoutVat = document.querySelector("[data-price-total-wov]");
            null === cartPriceWithoutVat && (cartPriceWithoutVat = document.createElement("span")),
                calculatedPriceWithoutVat.classList.contains("shipping-price-not-specified")
                    ? ((cartPriceWithVat.innerHTML = shoptet.messages.specifyShippingMethod), (cartPriceWithoutVat.innerHTML = shoptet.messages.specifyShippingMethod))
                    : ((prices_shipping = {
                        withVat: shoptet.checkoutShared.getPriceFromElement(calculatedPriceWithoutVat, "data-shipping-price-wv"),
                        withoutVat: shoptet.checkoutShared.getPriceFromElement(calculatedPriceWithoutVat, "data-shipping-price-wov"),
                        vat: shoptet.checkoutShared.getPriceFromElement(calculatedPriceWithoutVat, "data-shipping-price-vat"),
                    }),
                        (prices_billing = {
                            withVat: shoptet.checkoutShared.getPriceFromElement(calculatedPriceWithVat, "data-billing-price-wv"),
                            withoutVat: shoptet.checkoutShared.getPriceFromElement(calculatedPriceWithVat, "data-billing-price-wov"),
                            vat: shoptet.checkoutShared.getPriceFromElement(calculatedPriceWithVat, "data-billing-price-vat"),
                        }),
                        (calculatedPriceWithoutVat = {
                            withVat: shoptet.checkoutShared.getPriceFromElement(cartPriceWithVat, "data-price-total-wv"),
                            withoutVat: shoptet.checkoutShared.getPriceFromElement(cartPriceWithoutVat, "data-price-total-wov"),
                            vat: shoptet.checkoutShared.getPriceFromElement(cartPriceWithVat, "data-price-total-vat"),
                        }),
                        (calculatedPriceWithVat = (calculatedPriceWithVat = prices_shipping.withVat + prices_billing.withVat + calculatedPriceWithoutVat.withVat).ShoptetRoundForDocument()),
                        (calculatedPriceWithoutVat = prices_shipping.withoutVat + prices_billing.withoutVat + calculatedPriceWithoutVat.withoutVat),
                        (cartPriceWithVat.innerHTML = calculatedPriceWithVat.ShoptetFormatAsCurrency(void 0, void 0, shoptet.config.decPlacesSystemDefault)),
                        (cartPriceWithoutVat.innerHTML = calculatedPriceWithoutVat.ShoptetFormatAsCurrency(void 0, void 0, shoptet.config.decPlacesSystemDefault)));
        }
        function afterPriceChange() {
            shoptet.checkoutShared.callShippingBillingRelations();
        }
        function getDefaultShippingInfo(code) {
            return (
                shoptet.checkoutShared.externalShippingDetails[code].verificationCode,
                    shoptet.checkoutShared.externalShippingDetails[code].label.selected,
                    shoptet.checkoutShared.externalShippingDetails[code].label.init,
                    shoptet.checkoutShared.externalShippingDetails[code].label.update,
                    1
            );
        }
        function setTimeoutForExpiration(code, el, timeoutTime) {
            var timeout = shoptet.checkoutShared.externalShippingDetails[code].timeout;
            void 0 !== timeout && clearTimeout(timeout),
                (shoptet.checkoutShared.externalShippingDetails[code].timeout = setTimeout(function () {
                    var ev = new CustomEvent("ShoptetExternalShippingExpired", { detail: shoptet.checkoutShared.getDefaultShippingInfo(code) });
                    el.dispatchEvent(ev);
                }, timeoutTime));
        }
        function setExternalShippingMethod(e) {
            var timeoutTime = e.target.querySelector(".specify-shipping-method"),
                shippingLabel = timeoutTime.querySelector(".specified-shipping-method"),
                labelInput = e.target.querySelector(".external-shipping-method-label"),
                priceInputWithVat = e.target.querySelector(".external-shipping-method-price-with-vat"),
                priceInputWithoutVat = e.target.querySelector(".external-shipping-method-price-without-vat"),
                verificationCodeInput = e.target.querySelector(".external-shipping-method-verification-code"),
                shippingPrice = e.target.querySelector(".payment-shipping-price");
            e.detail.invalidate || null === e.detail.label.selected
                ? (timeoutTime.classList.remove("chosen"),
                    (shoptet.checkoutShared.externalShippingDetails[e.detail.code].label.selected = null),
                    labelInput.setAttribute("value", shoptet.checkoutShared.externalShippingDetails[e.detail.code].label.init),
                    (shippingLabel.innerHTML = shoptet.checkoutShared.externalShippingDetails[e.detail.code].label.init))
                : (timeoutTime.classList.add("chosen"),
                e.detail.expires && ((timeoutTime = new Date().getTime()), (timeoutTime = e.detail.expires.getTime() - timeoutTime), shoptet.checkoutShared.setTimeoutForExpiration(e.detail.code, e.target, timeoutTime)),
                    (shoptet.checkoutShared.externalShippingDetails[e.detail.code].label.selected = e.detail.label.selected),
                    (shoptet.checkoutShared.externalShippingDetails[e.detail.code].verificationCode = e.detail.verificationCode),
                    labelInput.setAttribute("value", e.detail.label.selected),
                    (shippingLabel.innerHTML = e.detail.label.selected)),
                shippingPrice.setAttribute("data-shipping-price-wv", e.detail.price.withVat),
                priceInputWithVat.setAttribute("value", e.detail.price.withVat),
                (shoptet.checkoutShared.externalShippingDetails[e.detail.code].price.withVat = e.detail.price.withVat),
                shippingPrice.setAttribute("data-shipping-price-wov", e.detail.price.withoutVat),
                priceInputWithoutVat.setAttribute("value", e.detail.price.withoutVat),
                (shoptet.checkoutShared.externalShippingDetails[e.detail.code].price.withouVat = e.detail.price.withoutVat),
                verificationCodeInput.setAttribute("value", e.detail.verificationCode),
                (shoptet.checkoutShared.externalShippingDetails[e.detail.code].verificationCode = e.detail.verificationCode),
                (shoptet.checkoutShared.externalShippingDetails[e.detail.code].expires = e.detail.expires);
        }
        function setupExternalShipping() {
            var externalShippingWrappers = document.querySelectorAll('[data-external-script="true"]');
            if (externalShippingWrappers)
                for (var i = 0; i < externalShippingWrappers.length; i++)
                    !(function (timeoutTime) {
                        var wrapper = externalShippingWrappers[timeoutTime];
                        wrapper.addEventListener("ShoptetExternalShippingChanged", function (e) {
                            shoptet.checkoutShared.setExternalShippingMethod(e), shoptet.checkoutShared.updatePrice(e);
                        }),
                            wrapper.addEventListener("ShoptetExternalShippingExpired", function (e) {
                                shoptet.checkoutShared.setExternalShippingMethod(e), shoptet.checkoutShared.updatePrice(e);
                            });
                        var expires,
                            ev = wrapper.getAttribute("data-external-script-code");
                        void 0 !== shoptet.checkoutShared.externalShippingDetails[ev] &&
                        ((expires = shoptet.checkoutShared.externalShippingDetails[ev].expires),
                            (timeoutTime = new Date().getTime()) < expires
                                ? ((timeoutTime = expires - timeoutTime), shoptet.checkoutShared.setTimeoutForExpiration(ev, wrapper, timeoutTime))
                                : expires && ((ev = new CustomEvent("ShoptetExternalShippingExpired", { detail: shoptet.checkoutShared.getDefaultShippingInfo(ev) })), wrapper.dispatchEvent(ev)));
                    })(i);
        }
        function handleExternalShippingLinks(wrapper, link, e) {
            if (!link.classList.contains("chosen") || e.target.closest("a")) {
                var externalScriptId = wrapper.getAttribute("data-external-script-code");
                try {
                    var externalScript = shoptet.externalShipping[externalScriptId];
                    shoptet.modal.open({
                        html: externalScript.modalContent,
                        width: externalScript.modalWidth || shoptet.modal.config.widthMd,
                        className: externalScript.modalClass || shoptet.modal.config.classMd,
                        onComplete: function () {
                            externalScript.onComplete(wrapper);
                        },
                        onClosed: function () {
                            externalScript.onClosed(wrapper);
                        },
                    });
                } catch (ex) {
                    console.error(ex);
                }
            } else shoptet.checkoutShared.afterPriceChange();
        }
        function setupDeliveryShipping() {
            var $document = $(document);
            "undefined" != typeof personalCollectionUrl &&
            ($document.on("click", ".personal-collection-choose-branch a", function (e) {
                e.preventDefault(),
                    $(this).closest(".radio-wrapper").find('.personal-collection-choose-branch[name="shippingId"]').prop("checked", !0),
                    shoptet.checkoutShared.chooseABranchModal(personalCollectionUrl, "#personal-collection-wrapper", "#personalCollectionPointId", ".personal-collection-point-id");
            }),
                $document.on("click", "#personal-collection-wrapper a.enabled", function (completePointName) {
                    completePointName.preventDefault();
                    var pointId = $(this).data("point-id"),
                        changePointLink = $(this).data("point-title"),
                        completePointName = shoptet.messages.chosenBranch + ": " + changePointLink + " ",
                        changePointLink = $('<a href="#" class="chosen">' + shoptet.messages.change + "</a>");
                    $(".personal-collection-choose-branch").html(completePointName).append(changePointLink), $(".personal-collection-point-id").val(pointId), shoptet.modal.close();
                }));
            var postDeliveryPoints = [];
            "undefined" != typeof naPostuUrl && postDeliveryPoints.push({ prefix: "na-postu", url: naPostuUrl }),
            "undefined" != typeof doBalikovnyUrl && postDeliveryPoints.push({ prefix: "do-balikovny", url: doBalikovnyUrl }),
            "undefined" != typeof hupostPostaPontUrl && postDeliveryPoints.push({ prefix: "posta-pont", url: hupostPostaPontUrl }),
            "undefined" != typeof skPostUrl && postDeliveryPoints.push({ prefix: "sk-post", url: skPostUrl });
            for (var glsParcelShopId, glsParcelShopName, glsModalOpen, i = 0; i < postDeliveryPoints.length; i++)
                !(function (i) {
                    $document.on("click", "." + postDeliveryPoints[i].prefix + "-choose-post a", function (url) {
                        url.preventDefault(), ($parentsElement = $(this).closest(".radio-wrapper"));
                        url = postDeliveryPoints[i].url;
                        "sk-post" === postDeliveryPoints[i].prefix && (url += "?shipmentId=" + $parentsElement.find("input").val()),
                            (window.clickedElement = $(this)),
                            shoptet.modal.open({
                                maxWidth: shoptet.modal.config.maxWidth,
                                href: url,
                                width: shoptet.modal.config.widthMd,
                                className: shoptet.modal.config.classMd,
                                onComplete: function () {
                                    shoptet.modal.shoptetResize();
                                },
                            });
                    }),
                        $document.on("click", "#" + postDeliveryPoints[i].prefix + "-result ." + postDeliveryPoints[i].prefix + "-choose-button", function () {
                            var zipCode = $(this).closest("tr"),
                                branchId = $.trim(zipCode.find("." + postDeliveryPoints[i].prefix + "-address").html()),
                                newString = shoptet.messages.chosenPost + " " + branchId + " ",
                                branchId = $('<a href="#" class="chosen">' + shoptet.messages.change + "</a>");
                            $parentsElement
                                .find("." + postDeliveryPoints[i].prefix + "-choose-post")
                                .html(newString)
                                .append(branchId)
                                .show(0),
                                "posta-pont" === postDeliveryPoints[i].prefix || "sk-post" === postDeliveryPoints[i].prefix
                                    ? ((branchId = $.trim(zipCode.find("." + postDeliveryPoints[i].prefix + "-branch-id").html())), $("#" + postDeliveryPoints[i].prefix + "-hidden").val(branchId))
                                    : ((zipCode = $.trim(zipCode.find("." + postDeliveryPoints[i].prefix + "-zip-code").html())), $("#" + postDeliveryPoints[i].prefix + "-hidden").val(zipCode)),
                                shoptet.modal.close();
                        });
                })(i);
            function handlePacketaPoint(extendedPoint) {
                if ((shoptet.checkoutShared.packeta.selectedBranch = extendedPoint)) {
                    for (var zasilkovnaBranchId = document.querySelectorAll(".zasilkovna-branch-id"), packetaSelectorBranchName = document.querySelectorAll(".zasilkovna-name"), i = 0; i < zasilkovnaBranchId.length; i++)
                        void 0 !== extendedPoint.carrierId ? (zasilkovnaBranchId[i].value = extendedPoint.carrierId + "-" + extendedPoint.id) : (zasilkovnaBranchId[i].value = extendedPoint.id);
                    for (i = 0; i < packetaSelectorBranchName.length; i++) packetaSelectorBranchName[i].innerHTML = extendedPoint.name;
                }
            }
            "undefined" != typeof ulozenkaUrl &&
            ($document.on("click", ".ulozenka-choose a", function (e) {
                e.preventDefault(),
                    ($parentsElement = $(this).closest(".radio-wrapper")),
                    shoptet.checkoutShared.chooseABranchModal(
                        ulozenkaUrl + "?id=" + $parentsElement.find(".ulozenka-choose-branch").attr("value") + "&deliveryCountryId=" + $("#deliveryCountryId").val(),
                        "#ulozenka-wrapper",
                        "#branchId",
                        ".ulozenka-branch-id"
                    );
            }),
                $document.on("submit", "#ulozenka-form", function (newString) {
                    newString.preventDefault();
                    var $newLink = $("#ulozenka-wrapper .branch-name").text(),
                        newString = shoptet.messages.chosenBranch + ": " + $newLink + " ",
                        $newLink = $('<a href="#" class="chosen">' + shoptet.messages.change + "</a>");
                    $parentsElement.find(".ulozenka-choose").html(newString).append($newLink).show(0), $parentsElement.find(".ulozenka-branch-id").val($("#branchId option:selected").val()), shoptet.checkoutShared.modalMagic();
                }),
                $document.on("change", "#branchId", function () {
                    var id = $("option:selected", this).val();
                    "" != $.trim(id) &&
                    ($("#ulozenka-form .branch-saved").removeClass("branch-saved-visible"),
                        $("#ulozenka-form .js-branch-loader").removeClass("no-display"),
                        $.ajax({
                            url: "/action/Ulozenka/getBranchInformation/?id=" + id,
                            type: "GET",
                            success: function (responseData) {
                                $("#ulozenka-wrapper .detail-information").html(responseData),
                                    $("#ulozenka-form .js-branch-loader").addClass("no-display"),
                                    $("#ulozenka-form .branch-saved").addClass("branch-saved-visible"),
                                    $("#ulozenka-form").submit(),
                                    shoptet.modal.shoptetResize();
                            },
                            error: function () {
                                showMessage(shoptet.messages.ajaxError, "warning", "", !1, !1), $("#ulozenka-form .js-branch-loader").addClass("no-display");
                            },
                        }));
                })),
            "undefined" != typeof zasilkovnaUrl &&
            $document.on("click", ".zasilkovna-choose a", function (e) {
                e.preventDefault(),
                    (shoptet.checkoutShared.packeta = shoptet.checkoutShared.packeta || {}),
                    (shoptet.checkoutShared.packeta.widgetOptions = shoptet.checkoutShared.packeta.widgetOptions || {}),
                shoptet.checkoutShared.packeta.widgetOptions.apiKey && Packeta.Widget.pick(shoptet.checkoutShared.packeta.widgetOptions.apiKey, handlePacketaPoint, shoptet.checkoutShared.packeta.widgetOptions);
            }),
            "undefined" != typeof glsParcelShopUrl &&
            ((glsParcelShopName = glsParcelShopId = ""),
                (glsModalOpen = !1),
                $document.on("click", ".gls-parcel-shop-choose a", function (e) {
                    e.preventDefault(),
                    glsModalOpen ||
                    ((glsModalOpen = !0),
                        ($parentsElement = $(this).closest(".radio-wrapper")),
                        shoptet.modal.open({
                            href: glsParcelShopUrl,
                            width: shoptet.modal.config.widthLg,
                            className: shoptet.modal.config.classLg,
                            onComplete: function () {
                                shoptet.modal.shoptetResize();
                            },
                            onCleanup: function () {
                                var completeBranchName, $newLink;
                                (glsModalOpen = !1),
                                glsParcelShopId &&
                                ((completeBranchName = glsParcelShopName + " "),
                                    ($newLink = $('<a href="#" class="chosen">' + shoptet.messages.change + "</a>")),
                                    $parentsElement.find(".gls-parcel-shop-choose").html(completeBranchName).append($newLink).show(0),
                                    $("input#gls-parcel-shop-hidden").val(glsParcelShopId));
                            },
                        }));
                }),
                $document.on("click", ".gls-parcel-shop-confirm", function () {
                    shoptet.modal.close();
                }),
                (window.glsPSMap_OnSelected_Handler = function (data) {
                    (glsParcelShopId = data.pclshopid),
                        (glsParcelShopName = data.name),
                        $("#psitems-canvas > div:not(#" + glsParcelShopId + ")")
                            .removeClass("psSelected")
                            .removeClass("psOver"),
                    $(".gls-parcel-shop-confirm-wrapper").hasClass("no-display") && ($(".gls-parcel-shop-confirm-wrapper").removeClass("no-display"), shoptet.modal.shoptetResize());
                })),
            "undefined" != typeof dpdParcelShopUrl &&
            ($document.on("click", ".dpd-cz-parcel-shop-choose a", function (e) {
                e.preventDefault(), ($parentsElement = $(this).closest(".radio-wrapper")), shoptet.checkoutShared.chooseABranchModal(dpdParcelShopUrl, "#dpd-cz-parcel-shop-wrapper", "#dpdParcelShopBranchId", "#dpd-cz-branch-id");
            }),
                $document.on("submit", "#dpd-cz-parcel-shop-form", function (completeBranchName) {
                    completeBranchName.preventDefault();
                    var branchName = $("#dpd-cz-parcel-shop-wrapper .branch-name").text(),
                        branchStreet = $("#dpd-cz-parcel-shop-wrapper .branch-street").text(),
                        $newLink = $("#dpd-cz-parcel-shop-wrapper .branch-city").text(),
                        completeBranchName = $("#dpd-cz-parcel-shop-wrapper .branch-zip").text(),
                        completeBranchName = shoptet.messages.chosenBranch + ": " + $newLink + " " + branchName + " (" + branchStreet + ", " + completeBranchName + " " + $newLink + ") ",
                        $newLink = $('<a href="#" class="chosen">' + shoptet.messages.change + "</a>");
                    $parentsElement.find(".dpd-cz-parcel-shop-choose").html(completeBranchName).append($newLink).show(0),
                        $("#dpd-cz-branch-id").val($("#dpdParcelShopBranchId option:selected").val()),
                        shoptet.checkoutShared.modalMagic();
                }),
                $document.on("change", "#dpdParcelShopBranchId", function () {
                    var id = $("option:selected", this).val();
                    "" !== $.trim(id) &&
                    ($("#dpd-cz-parcel-shop-form .branch-saved").removeClass("branch-saved-visible"),
                        $("#dpd-cz-parcel-shop-form .js-branch-loader").removeClass("no-display"),
                        $.ajax({
                            url: "/action/DpdParcelShop/getBranchInformation/?id=" + id,
                            type: "GET",
                            success: function (responseData) {
                                $("#dpd-cz-parcel-shop-wrapper .detail-information").html(responseData),
                                    $("#dpd-cz-parcel-shop-form .js-branch-loader").addClass("no-display"),
                                    shoptet.modal.shoptetResize(),
                                    $("#dpd-cz-parcel-shop-form .branch-saved").addClass("branch-saved-visible"),
                                    $("#dpd-cz-parcel-shop-form").submit();
                            },
                            error: function () {
                                showMessage(shoptet.messages.ajaxError, "warning", "", !1, !1), $("#dpd-cz-parcel-shop-form .js-branch-loader").addClass("no-display");
                            },
                        }));
                })),
            "undefined" != typeof isDpdOnSaturday &&
            ($document.on("click", ".dpd-check-zip a", function (event) {
                event.preventDefault(),
                    $("#dpd-zip-check-modal .dpd-zip-check-result").hide(),
                    $("#dpd-zip-check-text").val(""),
                    $("#dpd-zip-check-modal").show(),
                    shoptet.modal.open({
                        maxWidth: shoptet.modal.config.maxWidth,
                        width: shoptet.modal.config.widthLg,
                        className: shoptet.modal.config.classLg,
                        inline: !0,
                        href: "#dpd-zip-check-modal",
                        onClosed: function () {
                            $("#dpd-zip-check-modal").hide();
                        },
                    });
            }),
                $("#dpd-zip-check-modal form").on("submit", function (zip) {
                    zip.preventDefault(), $("#dpd-zip-check-modal .dpd-zip-check-result").hide();
                    zip = $("#dpd-zip-check-text").val();
                    "" !== zip &&
                    $.ajax({
                        url: "/action/DpdPrivate/checkSaturdayZipCode/?zipCode=" + zip,
                        success: function (response) {
                            ("1" == response ? $("#dpd-zip-check-valid") : $("#dpd-zip-check-invalid")).show(), shoptet.modal.shoptetResize();
                        },
                        error: function () {},
                    });
                })),
            "undefined" != typeof pplPartnerUrl &&
            ($document.on("click", ".ppl-choose a", function (e) {
                e.preventDefault(), ($parentsElement = $(this).closest(".radio-wrapper")), shoptet.checkoutShared.chooseABranchModal(pplPartnerUrl, "#ppl-partner-cz-wrapper", "#pplPartnerBranchId", "#ppl-partner-cz-branch-id");
            }),
                $document.on("submit", "#ppl-partner-cz-form", function (newString) {
                    newString.preventDefault();
                    var $newLink = $("#pplPartnerBranchId option:selected").text(),
                        newString = shoptet.messages.chosenBranch + ": " + $newLink + " ",
                        $newLink = $('<a href="#" class="chosen">' + shoptet.messages.change + "</a>");
                    $parentsElement.find(".ppl-choose").html(newString).append($newLink).show(0), $("#ppl-partner-cz-branch-id").val($("#pplPartnerBranchId option:selected").val()), shoptet.checkoutShared.modalMagic();
                }),
                $document.on("change", "#pplPartnerBranchId", function () {
                    var id = $("option:selected", this).val();
                    "" != $.trim(id) &&
                    ($("#ppl-partner-cz-form .branch-saved").removeClass("branch-saved-visible"),
                        $("#ppl-partner-cz-form .js-branch-loader").removeClass("no-display"),
                        $.ajax({
                            url: "/action/PplPartner/getBranchInformation/?id=" + id,
                            type: "GET",
                            success: function (responseData) {
                                $("#ppl-partner-cz-wrapper .detail-information").html(responseData),
                                    $("#ppl-partner-cz-form .js-branch-loader").addClass("no-display"),
                                    shoptet.modal.shoptetResize(),
                                    $("#ppl-partner-cz-form .branch-saved").addClass("branch-saved-visible"),
                                    $("#ppl-partner-cz-form").submit();
                            },
                            error: function () {
                                showMessage(shoptet.messages.ajaxError, "warning", "", !1, !1), $("#ppl-partner-cz-form .js-branch-loader").addClass("no-display");
                            },
                        }));
                }));
        }
        function chooseABranchModal(href, branchWrap, branchId, branchInput) {
            shoptet.modal.open({
                maxWidth: shoptet.modal.config.maxWidth,
                maxHeight: shoptet.modal.config.maxHeight,
                width: shoptet.modal.config.widthMd,
                className: shoptet.modal.config.ClassMd,
                href: href,
                onComplete: function () {
                    $(branchId + ' option[value="' + $(branchInput).val() + '"]').attr("selected", "selected"), $(branchId).trigger("change"), shoptet.checkoutShared.initBranchSelect();
                },
            });
        }
        function modalMagic() {
            $(".branch-saved:visible").length &&
            $(".branch-saved").click(function () {
                shoptet.modal.close();
            });
        }
        function initBranchSelect() {
            var $select = $(".js-select-basic");
            $select.length &&
            ($select.select2({
                dropdownParent: $("#colorbox"),
                language: {
                    noResults: function () {
                        return $select.attr("data-no-results");
                    },
                },
            }),
                $select.on("select2:opening", function () {
                    $select.find("option:selected").val() || shoptet.modal.resize({ height: "500px" });
                }),
                $select.on("select2:close", function () {
                    $select.find("option:selected").val() || shoptet.modal.shoptetResize();
                }),
                shoptet.modal.shoptetResize(),
            $select.find("option:selected").val() || $select.select2("open"));
        }
        document.addEventListener("DOMContentLoaded", function () {
            shoptet.checkoutShared.getStatedValues(),
                shoptet.checkoutShared.setActiveShippingAndPayments(),
                shoptet.checkoutShared.displayApplePay(),
                shoptet.checkoutShared.setupDeliveryShipping(),
                shoptet.checkoutShared.payu(),
                shoptet.checkoutShared.setupExternalShipping(),
            "function" == typeof changeCountryAndRegions && changeCountryAndRegions();
            for (var elements = document.querySelectorAll(".shipping-billing-table .radio-wrapper"), i = 0; i < elements.length; i++)
                elements[i].addEventListener("mousedown", function (e) {
                    if ((e.stopPropagation(), this.querySelector("label").classList.contains("inactive"))) return !1;
                    var activeWrappers = this.closest(".shipping-billing-table").querySelectorAll(".radio-wrapper.active");
                    if (activeWrappers)
                        for (var i = 0; i < activeWrappers.length; i++) {
                            activeWrappers[i].classList.remove("active"), activeWrappers[i].querySelector("label").classList.remove("active");
                            for (var inputs = activeWrappers[i].querySelectorAll('input[name="billingId"]'), i = 0; i < inputs.length; i++) inputs[i].checked = !1;
                        }
                    this.classList.add("active");
                    var input = this.querySelector('input[name="billingId"]');
                    (input = input || this.querySelector('input[name="shippingId"]')) &&
                    (input.checked || (input.checked = !0),
                    !input.classList.contains("payu") || ((link = document.querySelector(".table-payu")) && !link.querySelector("input:checked") && (link.querySelector('input[name="pay_type"]').checked = !0)));
                    var link = this.querySelector("a");
                    if (this.getAttribute("data-external-script-code")) shoptet.checkoutShared.handleExternalShippingLinks(this, link, e);
                    else if ((shoptet.checkoutShared.callShippingBillingRelations(), link)) {
                        if (link.classList.contains("zasilkovna-name") && !link.querySelector(".zasilkovna-default")) return;
                        (!link.classList.contains("chosen") || e.target instanceof HTMLAnchorElement) && ((toggleableTable = new CustomEvent("click", { bubbles: !0 })), link.dispatchEvent(toggleableTable));
                    }
                    var toggleableTable = this.closest(".cart-hide-unselected-options");
                    if (toggleableTable) {
                        for (var nonactiveWrappers = toggleableTable.querySelectorAll(".radio-wrapper:not(.active)"), i = 0; i < nonactiveWrappers.length; i++)
                            nonactiveWrappers[i].classList.remove("selected-option"), nonactiveWrappers[i].classList.add("unselected-option");
                        this.classList.add("selected-option"), this.classList.remove("unselected-option"), document.querySelector('[data-table="' + toggleableTable.id + '"]').classList.remove("js-hidden");
                    }
                });
        }),
            (shoptet.checkoutShared = shoptet.checkoutShared || {}),
            shoptet.scripts.libs.checkoutShared.forEach(function (fnName) {
                var fn = eval(fnName);
                shoptet.scripts.registerFunction(fn, "checkoutShared");
            }),
            document.addEventListener("DOMContentLoaded", function () {
                var $document = $(document);
                $document.on("click", "#orderFormButton", function () {
                    $(".js-orderFormSubmit").click();
                }),
                    $document.on("click", ".js-orderFormSubmit", function () {
                        var $el = $('input[name="shippingId"].choose-branch:checked');
                        if ($el.length) {
                            var code = $el.attr("data-code"),
                                $label = $el.siblings("label");
                            if (($label.length || ($label = $el.parent("label")), !$label.find(".chosen").length))
                                return !(!$label.find(".zasilkovna-choose").length || $label.find(".zasilkovna-default").length) || (showMessage(shoptet.messages["choose-" + code], "error", "", !1, !1), scrollToEl($label), !1);
                        }
                    });
            });
    })(shoptet),
    (function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var p = "function" == typeof require && require;
                    if (!f && p) return p(i, !0);
                    if (u) return u(i, !0);
                    throw (((p = new Error("Cannot find module '" + i + "'")).code = "MODULE_NOT_FOUND"), p);
                }
                (p = n[i] = { exports: {} }),
                    e[i][0].call(
                        p.exports,
                        function (r) {
                            return o(e[i][1][r] || r);
                        },
                        p,
                        p.exports,
                        r,
                        e,
                        n,
                        t
                    );
            }
            return n[i].exports;
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o;
    })(
        {
            1: [
                function (require, module, exports) {
                    "use strict";
                    (window.yourgames = window.yourgames || {}),
                        (window.yourgames.helpers = require("./modules/helpers.js")),
                        (window.yourgames.global = require("./modules/global.js")),
                        (window.yourgames.deliveryTommorow = require("./modules/deliveryTommorow.js")),
                        (window.yourgames.goodsDiversification = require("./modules/goodsDiversification.js")),
                        (window.yourgames.breadcrumb = require("./modules/breadcrumb.js")),
                        (window.yourgames.menuChange = require("./modules/menuChange.js")),
                        (window.yourgames.additionalContent = require("./modules/additionalContent.js")),
                        (window.yourgames.products = require("./modules/products.js")),
                        (window.yourgames.temporaryCartDeleteFix = require("./modules/temporaryCartDeleteFix.js")),
                        (window.yourgames.faq = require("./modules/faq.js")),
                        (window.yourgames.orderProcess_cart = require("./modules/orderProcess/cart.js")),
                        (window.yourgames.orderProcess_confirmation = require("./modules/orderProcess/confirmation.js")),
                        (window.yourgames.orderProcess_customerDetails = require("./modules/orderProcess/customerDetails.js")),
                        (window.yourgames.orderProcess_billingShipping = require("./modules/orderProcess/billingShipping.js")),
                        (window.yourgames.orderProcess = require("./modules/orderProcess/main.js")),
                        (window.yourgames.marlenka = require("./modules/marlenka.js")),
                        $(function () {
                            Object.values(window.yourgames).forEach(function (fn) {
                                var moduleName;
                                fn.hasOwnProperty("moduleName") && ((moduleName = fn.moduleName), window.yourgames.config.hasOwnProperty(moduleName) && (fn.config = window.yourgames.config[moduleName])),
                                "function" == typeof fn.init && fn.init();
                            });
                        });
                },
                {
                    "./modules/additionalContent.js": 2,
                    "./modules/breadcrumb.js": 3,
                    "./modules/deliveryTommorow.js": 4,
                    "./modules/faq.js": 5,
                    "./modules/global.js": 6,
                    "./modules/goodsDiversification.js": 7,
                    "./modules/helpers.js": 8,
                    "./modules/marlenka.js": 9,
                    "./modules/menuChange.js": 10,
                    "./modules/orderProcess/billingShipping.js": 11,
                    "./modules/orderProcess/cart.js": 12,
                    "./modules/orderProcess/confirmation.js": 13,
                    "./modules/orderProcess/customerDetails.js": 14,
                    "./modules/orderProcess/main.js": 15,
                    "./modules/products.js": 16,
                    "./modules/temporaryCartDeleteFix.js": 17,
                },
            ],
            2: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "additionalContent",
                        config: {},
                        showCurrentCustomerInfo: !1,
                        contentCurrentCustomerInfo: '<i class="yg-ic ic-alert"></i> <strong>ObjednÃ¡vky stÃ­hÃ¡me doruÄovat do VÃ¡noc</strong> - DoporuÄujeme dodÃ¡nÃ­ zÃ¡silkovnou!',
                        infoclassCurrentCustomerInfoSelector: "header#header",
                        targetCurrentCustomerInfoSelector: ".top-navigation-bar .container",
                        addCurrentCustomerInfo: function () {
                            var infoclass_target = $(this.targetCurrentCustomerInfoSelector);
                            this.config.currentCustomerInfo.show &&
                            infoclass_target.length &&
                            (infoclass_target.prepend('<div class="current-customer-info">'.concat(this.config.currentCustomerInfo.content, "</div>")),
                            (infoclass_target = $(this.infoclassCurrentCustomerInfoSelector)).length && infoclass_target.addClass("current-customer-info-present"));
                        },
                        loginResetPswdHTML:
                            '<div class="yg-custom-login-reset-pswd-alert"><p class="title">Nejde se ti pÅ™ihlÃ¡sit pod starÃ½m heslem?</p><p>PÅ™eÅ¡li jsme na novÃ½ systÃ©m - <a href="/klient/zapomenute-heslo/">prosÃ­m, zresetuj si heslo!</a></p></div>',
                        addLoginResetPswdAlert: function () {
                            $("#customerLogin #formLoginIncluded").prepend(this.loginResetPswdHTML), $("body").hasClass("in-login") && $("#formLogin").prepend(this.loginResetPswdHTML);
                        },
                        bgImagesConfig: { show: !0, pageTypes: ["homepage", "category"], positions: { left: { src: "", href: "", title: "" }, right: { src: "", href: "", title: "" } } },
                        createBgImages: function () {},
                        init: function () {
                            this.addCurrentCustomerInfo(), this.addLoginResetPswdAlert();
                        },
                    };
                },
                {},
            ],
            3: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moveBreadcrumb: function () {
                            var target, breadcrumb, html;
                            this.breadcrumbAlreadyMoved()
                                ? $("#content > .breadcrumbs").remove()
                                : ((target = $("#content-wrapper")), (breadcrumb = $(".breadcrumbs")).length && ((html = breadcrumb[0].outerHTML), breadcrumb.remove(), target.prepend(html)), $("body").addClass("yg-breadcrumb-moved"));
                        },
                        breadcrumbAlreadyMoved: function () {
                            return 0 < $("#content-wrapper > .breadcrumbs").length;
                        },
                        startBreadcrumbMovement: function () {
                            var _this = this,
                                move = function () {
                                    return _this.moveBreadcrumb();
                                };
                            move(), document.addEventListener("ShoptetDOMPageContentLoaded", move, !1);
                        },
                        init: function () {
                            this.startBreadcrumbMovement();
                        },
                    };
                },
                {},
            ],
            4: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "deliveryTommorow",
                        config: {},
                        czechHolidays: ["01-01", "04-02", "04-05", "05-01", "05-08", "07-05", "07-06", "09-28", "10-28", "11-17", "12-24", "12-25", "12-26"],
                        debugNow: function () {
                            return new Date();
                        },
                        dateObjectToDateString: function (date) {
                            return String(date.getFullYear()) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                        },
                        dateObjectToTimeString: function (date) {
                            return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
                        },
                        dayIsHoliday: function (month_day) {
                            (month_day = month_day.split("-")), (month_day = month_day[1] + "-" + month_day[2]);
                            return this.czechHolidays.includes(month_day);
                        },
                        getBannerTitle: function () {
                            var title = this.config.bannersTitle,
                                times = this.getDeliveryInfoText();
                            return !(!title || !times) && title.replace("%deadline%", times.deadline).replace("%delivery%", times.delivery);
                        },
                        dayIsNotWeekendOrHoliday: function (date_i_dayInWeek) {
                            var date_i_date_s = this.dateObjectToDateString(date_i_dayInWeek),
                                date_i_dayInWeek = date_i_dayInWeek.getDay();
                            return 0 != date_i_dayInWeek && 6 != date_i_dayInWeek && !this.dayIsHoliday(date_i_date_s);
                        },
                        getNextDeliveryTommorowDeadline: function () {
                            do {
                                var b_dayIsTodayAndIsBeforeDeadline = this.debugNow(),
                                    found = this.dateObjectToDateString(b_dayIsTodayAndIsBeforeDeadline),
                                    b_dayIsTodayAndIsBeforeDeadline = this.dateObjectToTimeString(b_dayIsTodayAndIsBeforeDeadline),
                                    date_i = date_i ? new Date(date_i.setDate(date_i.getDate() + 1)) : this.debugNow(),
                                    date_i_date_s = this.dateObjectToDateString(date_i),
                                    found = found == date_i_date_s,
                                    b_dayIsTodayAndIsBeforeDeadline = b_dayIsTodayAndIsBeforeDeadline <= this.config.deadline,
                                    b_dayIsTodayAndIsBeforeDeadline = found && b_dayIsTodayAndIsBeforeDeadline,
                                    found = (this.dayIsNotWeekendOrHoliday(date_i) && b_dayIsTodayAndIsBeforeDeadline) || (!found && this.dayIsNotWeekendOrHoliday(date_i));
                            } while (!found);
                            return new Date(window.yourgames.helpers.sanitizeDateStringBeforeConverting(date_i_date_s + " " + this.config.deadline));
                        },
                        getDeliveryInfoDate: function () {
                            var deadline = this.getNextDeliveryTommorowDeadline();
                            if ((date_i = new Date(deadline))) {
                                do {
                                    var found,
                                        date_i = new Date(date_i.setDate(date_i.getDate() + 1));
                                } while ((this.dayIsNotWeekendOrHoliday(date_i) && (found = !0), !found));
                                return { deadline: deadline, delivery: date_i };
                            }
                            return !1;
                        },
                        getDeliveryInfoText: function () {
                            var dates = this.getDeliveryInfoDate();
                            if (dates) {
                                var text = {},
                                    czDays = {
                                        0: ["nedÄ›le", "v nedÄ›li"],
                                        1: ["pondÄ›lÃ­", "v pondÄ›lÃ­"],
                                        2: ["ÃºterÃ½", "v ÃºterÃ½"],
                                        3: ["stÅ™edy", "ve stÅ™edu"],
                                        4: ["Ätvrtku", "ve Ätvrtek"],
                                        5: ["pÃ¡tku", "v pÃ¡tek"],
                                        6: ["soboty", "v sobotu"],
                                    },
                                    today = this.debugNow();
                                return (
                                    (text.deadline = dates.deadline.toDateString() === this.debugNow().toDateString() ? "dnes" : czDays[dates.deadline.getDay()][0]),
                                        (text.deadline += ", " + this.config.deadline.slice(0, -3)),
                                        (text.delivery = dates.delivery.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString() ? "zÃ­tra" : czDays[dates.delivery.getDay()][1]),
                                        text
                                );
                            }
                            return !1;
                        },
                    };
                },
                {},
            ],
            5: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        init: function () {
                            $(".yg_dotazy_quest_heading").on("click", function (e) {
                                $(this).parent().toggleClass("opened");
                            });
                        },
                    };
                },
                {},
            ],
            6: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        getConfig: function (module, key) {
                            return window.yourgames.config[module][key];
                        },
                        init: function () {},
                    };
                },
                {},
            ],
            7: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "goodsDiversification",
                        config: {},
                        warning_modal_content:
                            '<div style="padding: 25px;"><center>\n        <h3 style="text-transform: none; font-weight: 500; margin-bottom: 15px;">NenÃ­ moÅ¾nÃ© kombinovat <u>digitÃ¡lnÃ­ klÃ­Äe s fyzickÃ½m zboÅ¾Ã­m</u> v jednom koÅ¡Ã­ku.</h3>\n        <p style="margin-bottom: 10px; font-weight: 500;">ProsÃ­me vÃ¡s o vytvoÅ™enÃ­ <u>2 oddÄ›lenÃ½ch objednÃ¡vek</u> - jednu na digitÃ¡lnÃ­ klÃ­Äe, a druhou na fyzickÃ© zboÅ¾Ã­.</strong></p>\n        <p style="margin-bottom: 0;">OmlouvÃ¡me se za komplikace a dÄ›kujeme za vaÅ¡i pÅ™Ã­zeÅˆ!</p>\n    </div></center>',
                        createGoodsCombinationErrorModal: function () {
                            shoptet.modal.open({ html: this.warning_modal_content, width: "500px", className: "", maxWidth: "94%", onComplete: null });
                        },
                        validateCartItemsBeforeSubmit: function (event) {
                            this.checkIfCartHasValidProductCombination() || (event.preventDefault(), this.createGoodsCombinationErrorModal());
                        },
                        validateAddedGoodsType: function (event) {
                            var product_type,
                                cart_goods_type = this.getAddedProductCode(event);
                            null != cart_goods_type &&
                            null != cart_goods_type &&
                            ((product_type = this.getProductTypeByProductCode(cart_goods_type)),
                            null != (cart_goods_type = this.getCartGoodsType()) && cart_goods_type != product_type && (event.preventDefault(), this.createGoodsCombinationErrorModal()));
                        },
                        checkIfCartHasValidProductCombination: function () {
                            var _this = this,
                                table_rows = document.querySelectorAll('#cart tr[data-micro="cartItem"]'),
                                last_product_type = null,
                                error = !1;
                            return (
                                table_rows.forEach(function (current_product_type) {
                                    (current_product_type = current_product_type.getAttribute("data-micro-sku")), (current_product_type = _this.getProductTypeByProductCode(current_product_type));
                                    null == last_product_type && (last_product_type = current_product_type), last_product_type != current_product_type && (error = !0);
                                }),
                                    !error
                            );
                        },
                        getAddedProductCode: function (product_list_sku_el) {
                            var product_code,
                                product_detail_sku_el = "span" == product_list_sku_el.target.tagName.toLowerCase() ? product_list_sku_el.target.parentElement : product_list_sku_el.target,
                                product_list_sku_el = product_detail_sku_el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('span[data-micro="sku"]'),
                                product_detail_sku_el = product_detail_sku_el.parentElement.parentElement.parentElement.querySelector('meta[itemprop="sku"]');
                            if (null != product_detail_sku_el && null != product_detail_sku_el) product_code = product_detail_sku_el.getAttribute("content");
                            else {
                                if (null == product_list_sku_el || null == product_list_sku_el) return null;
                                product_code = product_list_sku_el.innerText;
                            }
                            return product_code.trim(), product_code;
                        },
                        elementHasSpecificID: function (element, id) {
                            return !(null == element || null == element || !element.hasAttribute("id") || element.getAttribute("id") != id);
                        },
                        getProductTypeByProductCode: function (code) {
                            return 4 <= code.length && "DIG_" == code.substring(0, 4) ? 1 : 2;
                        },
                        getCartGoodsType: function () {
                            var data = getShoptetDataLayer();
                            return data.cart.length && 4 <= data.cart[0].code.length ? this.getProductTypeByProductCode(data.cart[0].code) : null;
                        },
                        hideDateOfDeliveryPlugin: function () {
                            "billingAndShipping" == getShoptetDataLayer().pageType &&
                            1 == this.getCartGoodsType() &&
                            (function waitForEl(selector, callback) {
                                jQuery(selector).length
                                    ? callback()
                                    : setTimeout(function () {
                                        waitForEl(selector, callback);
                                    }, 100);
                            })("#order-form .co-box.fv-datum", function () {
                                $("#order-form .co-box.fv-datum").hide();
                            });
                        },
                        init: function () {
                            var _this2 = this;
                            $(document).on("click", '[data-action="buy"], [data-action="buy"] span, .add-to-cart-button', function (event) {
                                _this2.validateAddedGoodsType(event);
                            }),
                                $(document).on("click", "#cart-wrapper .buttons-order.buttons-order-cart .complete-shopping #continue-order-button", function (event) {
                                    _this2.validateCartItemsBeforeSubmit(event);
                                }),
                                this.hideDateOfDeliveryPlugin();
                        },
                    };
                },
                {},
            ],
            8: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        sanitizeDateStringBeforeConverting: function (date_str) {
                            return date_str.replace(/-/g, "/");
                        },
                    };
                },
                {},
            ],
            9: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "marlenka",
                        config: {},
                        rebuildModal: function () {
                            var $products,
                                cartGoodsType,
                                productsHTML,
                                _this = this;
                            this.config.popupChange &&
                            ($("#colorbox").addClass("marlenka-promo-modal"),
                            ($products = $("#colorbox .products-wrapper")).length && $products.remove(),
                                $("#colorbox .extras-wrap").after('<div class="marlenka-additional-wrap"></div>'),
                            this.config.popupAddedToCartBanner.show &&
                            $("#colorbox .marlenka-additional-wrap").append(
                                '<div class="marlenka-promo-banner"><a href="'.concat(this.config.popupAddedToCartBanner.href, '" target="_blank"><img src="').concat(this.config.popupAddedToCartBanner.imgSrc, '" /></a></div>')
                            ),
                            this.config.popupFeaturedProducts &&
                            this.config.popupFeaturedProducts.length &&
                            ((cartGoodsType = window.yourgames.goodsDiversification.getCartGoodsType()),
                                (productsHTML = ""),
                                (productsHTML += '<div class="marlenka-featured-products">'),
                                (productsHTML += "<h2>OslaÄte si Å¾ivot!</h2>"),
                                (productsHTML += '<div class="row">'),
                                this.config.popupFeaturedProducts.forEach(function (element) {
                                    (productsHTML += '<div class="col-md-3 col-sm-6">'),
                                        (productsHTML += '<a href="'.concat(element.url, '" target="_blank" class="item">')),
                                        (productsHTML += '<div class="img-wrap">'),
                                        (productsHTML += '<img src="'.concat(element.image, '">')),
                                        (productsHTML += "</div>"),
                                        (productsHTML += "<p>".concat(element.title, "</p>")),
                                    2 == cartGoodsType &&
                                    _this.config.popupFeaturedProductsShowBuyBtn &&
                                    element.showBuyBtn &&
                                    (productsHTML += '<button type="button" class="marlenkaPromoProductsAddToCart" data-price-id="'.concat(element.priceId, '">Do koÅ¡Ã­ku</button>')),
                                        (productsHTML += "</a>"),
                                        (productsHTML += "</div>");
                                }),
                                (productsHTML += "</div>"),
                                (productsHTML += "</div>"),
                                $("#colorbox .marlenka-additional-wrap").append(productsHTML)),
                                this.customModalResize());
                        },
                        createProductDetailBadge: function () {
                            var dl = getShoptetDataLayer();
                            "productDetail" == dl.pageType && dl.product.manufacturer && "Marlenka" == dl.product.manufacturer && $("#product-detail-form").before('<div class="marlenka-productdetail-badge"></div>');
                        },
                        customModalResize: function () {
                            var finalModalWidth;
                            (finalModalWidth = $(window).width() < 928 ? $(window).width() - 40 : 888), shoptet.modal.resize({ width: finalModalWidth + "px" });
                        },
                        init: function () {
                            var t1 = this;
                            shoptet.scripts.setCustomCallback("shoptet.modal.open", function (args) {
                                var $modal = $("#cboxContent");
                                $modal.length && $modal.find(".advanced-order").length && "PÅ™idÃ¡no do koÅ¡Ã­ku" == $modal.find(".advanced-order .h1").text().trim() && t1.rebuildModal();
                            }),
                                $(document).on("click", ".marlenkaPromoProductsAddToCart", function (priceId) {
                                    priceId.preventDefault();
                                    priceId = $(priceId.currentTarget).attr("data-price-id");
                                    priceId && shoptet.cartShared.addToCart({ priceId: priceId });
                                }),
                                this.createProductDetailBadge();
                        },
                    };
                },
                {},
            ],
            10: [
                function (require, _module$exports, exports) {
                    "use strict";
                    function _defineProperty(obj, key, value) {
                        return key in obj ? Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }) : (obj[key] = value), obj;
                    }
                    _module$exports.exports =
                        (_defineProperty(
                            (_module$exports = {
                                init: function () {
                                    $("html").on("mouseover", ".menu-level-1 .ext", function () {
                                        $(this).find("img").unveil();
                                    }),
                                    ("1" === shoptet.config.mobileHeaderVersion && !detectResolution(shoptet.abilities.config.navigation_breakpoint)) || (this.changeCategoryPanel(), this.changeCatalogHovers());
                                },
                                showSubmenu: function ($el) {
                                    var $thirdLevelMenu;
                                    $el.addClass("exp"),
                                        $("body").addClass("submenu-visible"),
                                        $(".has-third-level ul").removeClass("has-more-items").find(".more-items-trigger").detach(),
                                    detectResolution(shoptet.abilities.config.navigation_breakpoint) &&
                                    (($thirdLevelMenu = $el.find(".has-third-level ul")).length &&
                                    ($(".has-third-level ul").removeClass("has-more-items"),
                                        $thirdLevelMenu.each(function () {
                                            var $lastLi = $(this).find("li:last-child");
                                            getRelativeOffset($lastLi).top + $lastLi.height() > $(this).height() && $(this).addClass("has-more-items").append('<span class="more-items-trigger" />');
                                        })),
                                    shoptet.abilities.feature.images_in_menu && $el.find("img").trigger("unveil"));
                                },
                                hideSubmenu: function () {
                                    $(".menu-level-1 .ext").removeClass("exp"), $("body").removeClass("submenu-visible");
                                },
                                openSubpageCatalog: function ($el) {
                                    console.log($el), $el.addClass("opened");
                                },
                                hideSubpageCatalog: function ($el) {
                                    $el.removeClass("opened");
                                },
                                showCatalogOverlay: function () {
                                    $("body").addClass("yg-show-catalog-overlay");
                                },
                                hideCatalogOverlay: function () {
                                    $("body").removeClass("yg-show-catalog-overlay");
                                },
                                getCatalogMouseElement: function () {
                                    return $("body").hasClass("in-index") ? $("body.in-index .yg-goods-catalog") : $(".menu-item-catalog:not(.homepage)");
                                },
                                catalogTimerShow: {},
                                catalogTimerHide: {},
                                itemTimerShow: {},
                                itemTimerHide: {},
                                changeCatalogHovers: function () {
                                    var _this = this;
                                    $("html").off("mouseover", ".menu-level-1 .ext"),
                                        $("html").off("mouseleave", ".menu-level-1 .ext"),
                                        $("#header").after('<div class="yg-catalog-overlay"></div>'),
                                        $("html").on("mouseover", "body.in-index .yg-goods-catalog, .menu-item-catalog:not(.homepage)", function (e) {
                                            ("1" === shoptet.config.mobileHeaderVersion && !detectResolution(shoptet.abilities.config.navigation_breakpoint)) ||
                                            (clearTimeout(_this.catalogTimerShow),
                                                (_this.catalogTimerShow = setTimeout(function () {
                                                    clearTimeout(_this.catalogTimerHide), _this.openSubpageCatalog(_this.getCatalogMouseElement()), _this.showCatalogOverlay();
                                                }, 100)));
                                        }),
                                        $("html").on("mouseleave", "body.in-index .yg-goods-catalog, .menu-item-catalog:not(.homepage)", function (e) {
                                            detectResolution(shoptet.abilities.config.navigation_breakpoint) &&
                                            (clearTimeout(_this.catalogTimerShow),
                                                (_this.catalogTimerHide = setTimeout(function () {
                                                    window.yourgames.menuChange.hideSubmenu(), _this.hideSubpageCatalog(_this.getCatalogMouseElement()), _this.hideCatalogOverlay();
                                                }, 500)));
                                        }),
                                        $("html").on("mouseover", ".yg-goods-catalog .menu-level-1 > li", function () {
                                            var _this2 = this;
                                            ("1" === shoptet.config.mobileHeaderVersion && !detectResolution(shoptet.abilities.config.navigation_breakpoint)) ||
                                            (clearTimeout(window.yourgames.menuChange.itemTimerShow),
                                                (window.yourgames.menuChange.itemTimerShow = setTimeout(function () {
                                                    clearTimeout(window.yourgames.menuChange.itemTimerHide),
                                                        $(_this2).hasClass("ext")
                                                            ? $(_this2).hasClass("exp") || (window.yourgames.menuChange.hideSubmenu(), window.yourgames.menuChange.showSubmenu($(_this2)))
                                                            : window.yourgames.menuChange.hideSubmenu();
                                                }, 150)));
                                        });
                                },
                                getCategoryPanelEl: function () {
                                    return $("#categories");
                                },
                                getCategoryPanelSubCategoryEl: function () {
                                    return this.getCategoryPanelEl().find(".categories > ul > li > a");
                                },
                                getHorizontalNavEl: function () {
                                    return $("nav#navigation");
                                },
                                setCategoryHTMLToLS: function (html) {
                                    localStorage.setItem("ygCategoryPanelHTML", html);
                                },
                                getCategoryHTMLFromLS: function () {
                                    var ls_html = localStorage.getItem("ygCategoryPanelHTML");
                                    return ls_html || null;
                                },
                                findCategoryInLeftCategoryPanelByTitleURL: function (title, url) {
                                    var $main_categories = $("#categories .categories > .topic > a"),
                                        found = !1;
                                    return (
                                        $main_categories.each(function (index, cat_t) {
                                            var cat_url = $(cat_t).remove("span"),
                                                cat_t = cat_url.text().trim(),
                                                cat_url = cat_url.attr("href").trim();
                                            if (cat_t == title && cat_url == url) return !(found = !0);
                                        }),
                                            !!found
                                    );
                                },
                                getCategoryPanelHTML: function (p_html, placeholder_el) {
                                    var _this3 = this,
                                        removeFoundTopNavItems = 0 < arguments.length && void 0 !== p_html && p_html,
                                        deleteMode = 1 < arguments.length && void 0 !== placeholder_el ? placeholder_el : 0,
                                        categoryPanelHtml = "categoryPanel_" + String(new Date().getTime()),
                                        p_html = '<div id="'.concat(categoryPanelHtml, '" style="display: none;">') + this.getHorizontalNavEl().html() + "</div>",
                                        placeholder_el = $("#" + categoryPanelHtml);
                                    $("body").append($(p_html)),
                                        (placeholder_el = $("#" + categoryPanelHtml)).find("li.menu-item-catalog").remove(),
                                        placeholder_el.find("ul.menu-level-1 li").removeClass("splitted"),
                                        placeholder_el.find("ul.menu-level-1 > li:not(.menu-item-catalog)").each(function (index, element) {
                                            var cat_t = $(element).children("a").find("b").text().trim(),
                                                classes = $(element).children("a").attr("href").trim();
                                            _this3.findCategoryInLeftCategoryPanelByTitleURL(cat_t, classes)
                                                ? removeFoundTopNavItems &&
                                                (-1 !== (index = (classes = $(element).attr("class").split(/\s+/)).indexOf("splitted")) && classes.splice(index, 1),
                                                    classes.join("."),
                                                classes.length &&
                                                ((classes = "." + classes),
                                                    0 == deleteMode
                                                        ? (_this3
                                                            .getHorizontalNavEl()
                                                            .find("ul.menu-level-1 li" + classes)
                                                            .remove(),
                                                            $(".menu-helper ul.menu-level-1 li" + classes).remove())
                                                        : (_this3
                                                            .getHorizontalNavEl()
                                                            .find("ul.menu-level-1 li" + classes)
                                                            .addClass("yg-menu-topnav-item-delete"),
                                                            $(".menu-helper ul.menu-level-1 li" + classes).addClass("yg-menu-topnav-item-delete"))))
                                                : $(element).remove();
                                        }),
                                        shoptet.menu.splitMenu();
                                    categoryPanelHtml = $("#" + categoryPanelHtml).html() + "</div>";
                                    return placeholder_el.remove(), this.setCategoryHTMLToLS(categoryPanelHtml), categoryPanelHtml;
                                },
                                findCategoryInTopNavByTitleURL: function (title, url) {
                                    var $regular_topnav_items = $("#navigation > .navigation-in.menu > ul.menu-level-1 > li:not(.menu-item-catalog)"),
                                        found_el = !1;
                                    return (
                                        $regular_topnav_items.each(function (index, element) {
                                            var cat_t = $(element).children("a").text().trim(),
                                                cat_url = $(element).children("a").attr("href").trim();
                                            if (cat_t == title && cat_url == url) return (found_el = $(element)), !1;
                                        }),
                                            found_el
                                    );
                                },
                                delTopNavItByLSPan: function () {
                                    var _this4 = this;
                                    $("#navigation .menu-level-1 .menu-item-catalog .menu-level-1 > li").each(function (index, found_el) {
                                        var cat_t = $(found_el).children("a").find("b").text().trim(),
                                            found_el = $(found_el).children("a").attr("href").trim(),
                                            found_el = _this4.findCategoryInTopNavByTitleURL(cat_t, found_el);
                                        found_el && found_el.remove();
                                    }),
                                        shoptet.menu.splitMenu();
                                },
                                changeCategoryPanel: function () {
                                    var targetPanel, ls_category_html;
                                    this.getCategoryPanelEl().length
                                        ? (this.addHorizontalNavCatalogBtn(),
                                            (ls_category_html = this.getCategoryPanelHTML(!0, 1)),
                                            "homepage" == getShoptetDataLayer().pageType
                                                ? ((targetPanel = $(".sidebar.sidebar-left")),
                                                    (ls_category_html = '<div class="yg-goods-catalog side-catalog-wrap">' + ls_category_html + "</div>"),
                                                    $("#navigation .menu-item-catalog").addClass("homepage"))
                                                : (targetPanel = $("#navigation .yg-goods-catalog.nav-catalog-wrap")),
                                            targetPanel.prepend(ls_category_html))
                                        : null !== (ls_category_html = this.getCategoryHTMLFromLS()) &&
                                        (this.addHorizontalNavCatalogBtn(), $("#navigation .yg-goods-catalog.nav-catalog-wrap").prepend(ls_category_html), this.delTopNavItByLSPan());
                                },
                                addHorizontalNavCatalogBtn: function () {
                                    this.getHorizontalNavEl().find("ul.menu-level-1").prepend('<li class="menu-item-catalog"><a>Katalog zboÅ¾Ã­</a><div class="yg-goods-catalog nav-catalog-wrap"></div></li>');
                                },
                            }),
                            "showSubmenu",
                            function ($el) {
                                $el.addClass("exp");
                            }
                        ),
                            _defineProperty(_module$exports, "hideSubmenu", function () {
                                $(".menu-level-1 .ext").removeClass("exp");
                            }),
                            _defineProperty(_module$exports, "darkenOnHover", function () {
                                var $cw = $("#content-wrapper");
                                $cw.length && $cw.prepend('<div class="yg-content-fadebox"></div>');
                            }),
                            _module$exports);
                },
                {},
            ],
            11: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "orderProcess_billingShipping",
                        config: {},
                        init: function () {
                            this.changeBillingShipping();
                        },
                        makeBillingShippingHighlights: function () {
                            var $sI,
                                $pI,
                                createExpandBoxes,
                                _this = this,
                                $sW = $("#order-shipping-methods"),
                                $pW = $("#order-billing-methods");
                            $sW.length &&
                            $pW.length &&
                            (($sI = $sW.find(".radio-wrapper")),
                                ($pI = $pW.find(".radio-wrapper")),
                                (createExpandBoxes = $(".shipping-billing-table .radio-wrapper")),
                            (void 0 === this.config.checkoutRecommendations.shippingTomIDs && void 0 === this.config.checkoutRecommendations.shippingRecIDs) ||
                            ($sI.each(function (index, $sInfo) {
                                var sId = Number($($sInfo).attr("data-id").replace("shipping-", "")),
                                    $sInfo = $($sInfo).find("label .payment-info");
                                _this.config.checkoutRecommendations.shippingRecIDs.hasOwnProperty(sId) &&
                                $sInfo.find("b").after('<i class="yg-highlighted-badge">'.concat(_this.config.checkoutRecommendations.shippingRecIDs[sId], "</i>")),
                                _this.config.checkoutRecommendations.shippingTomIDs.includes(sId) &&
                                $sInfo.find("b").after('<i class="deliveryTommorow-icon show-tooltip" title="'.concat(_this.config.checkoutRecommendations.shippingTomTooltipText, '"></i>'));
                            }),
                                initTooltips()),
                            void 0 !== this.config.checkoutRecommendations.paymentRecIDs &&
                            $pI.each(function (index, $pInfo) {
                                var pId = Number($($pInfo).attr("data-id").replace("billing-", "")),
                                    $pInfo = $($pInfo).find("label .payment-info");
                                _this.config.checkoutRecommendations.paymentRecIDs.hasOwnProperty(pId) &&
                                $pInfo.find("b").after('<i class="yg-highlighted-badge">'.concat(_this.config.checkoutRecommendations.paymentRecIDs[pId], "</i>"));
                            }),
                                createExpandBoxes.each(function (index, $prEl) {
                                    $prEl = $($prEl).find(".payment-shipping-price");
                                    Number(void 0 !== $prEl.attr("data-shipping-price") && !1 !== $prEl.attr("data-shipping-price") ? $prEl.attr("data-shipping-price") : $prEl.attr("data-billing-price")) < 0 &&
                                    $prEl.html('<span class="discount">'.concat($prEl.text(), "</span>"));
                                }),
                                (createExpandBoxes = function ($items, $wrap) {
                                    2 < $items.length &&
                                    ($wrap.find(".radio-wrapper:nth-child(-n+2)").wrapAll('<div class="yg-shipping-payments-intial-options"></div>'),
                                        $wrap.children(".radio-wrapper").wrapAll('<div class="yg-shipping-payments-extra-options"></div>'),
                                        $wrap.append('<a href="#vice-moznosti" class="yg-shipping-payments-toggle"><span class="c">Zobrazit vÃ­ce moÅ¾nostÃ­</span><span class="o">Zobrazit mÃ©nÄ› moÅ¾nostÃ­</span><i></i></a>'));
                                })($sI, $sW),
                                createExpandBoxes($pI, $pW));
                        },
                        changeBillingShipping: function () {
                            var delete_dig,
                                _this2 = this;
                            "billingAndShipping" == getShoptetDataLayer().pageType &&
                            ((delete_dig = !(1 == window.yourgames.goodsDiversification.getCartGoodsType())),
                                _this2.removeShippingMethods(delete_dig),
                            void 0 !== _this2.config.checkoutRecommendations && _this2.makeBillingShippingHighlights(),
                                $(document).on("click", ".yg-shipping-payments-toggle", function (event) {
                                    event.preventDefault(), $(event.currentTarget).parent().toggleClass("yg-shipping-payments-extra-options-opened");
                                }));
                        },
                        manipulateBillingShipping: function () {
                            var delete_dig;
                            "billingAndShipping" == getShoptetDataLayer().pageType && ((delete_dig = !(1 == window.yourgames.goodsDiversification.getCartGoodsType())), this.removeShippingMethods(delete_dig));
                        },
                        removeShippingMethods: function (delete_dig) {
                            var _this3 = this;
                            ((!delete_dig && this.billingMethodsCount() > this.config.digitalDeliveryIDs.length && this.atLeastOneShippingExists(this.config.digitalDeliveryIDs)) || delete_dig) &&
                            ($("#order-shipping-methods > div").each(function (index, shipping_id) {
                                var curr_shipping_is_digital = $(shipping_id);
                                curr_shipping_is_digital.attr("data-id").includes("shipping-") &&
                                ((shipping_id = Number.parseInt(curr_shipping_is_digital.attr("data-id").replace("shipping-", "").trim())),
                                    (curr_shipping_is_digital = _this3.config.digitalDeliveryIDs.includes(shipping_id)),
                                ((delete_dig && curr_shipping_is_digital) || (!delete_dig && !curr_shipping_is_digital)) && _this3.removeSpecificShippingMethod(shipping_id));
                            }),
                                this.setDefaultDeliveryMethod());
                        },
                        billingMethodsCount: function () {
                            return $("#order-shipping-methods > div").length;
                        },
                        atLeastOneShippingExists: function (ids) {
                            Array.isArray(ids) || (ids = [ids]);
                            var found = !1;
                            return (
                                ids.forEach(function (element) {
                                    $("#order-shipping-methods > div[data-id='shipping-" + element + "']").length && (found = !0);
                                }),
                                    found
                            );
                        },
                        removeSpecificShippingMethod: function ($delivery_method) {
                            $delivery_method = this.getShippingMethodEl($delivery_method);
                            null != $delivery_method && $delivery_method.remove();
                        },
                        setDefaultDeliveryMethod: function () {
                            var $el_to_sel = $("#order-shipping-methods > div.active"),
                                $el_to_sel = $el_to_sel.length ? $el_to_sel : $("#order-shipping-methods > div:first-child");
                            $el_to_sel.find('input[name="shippingId"]').prop("checked", !0), $el_to_sel.addClass("active"), shoptet.checkoutShared.setActiveShippingAndPayments();
                        },
                        getShippingMethodEl: function ($delivery_method) {
                            $delivery_method = $('#order-shipping-methods > div[data-id="shipping-'.concat($delivery_method, '"]'));
                            return $delivery_method.length ? $delivery_method : null;
                        },
                        changeShippingPaymentList: function () {
                            var $sW,
                                $pW,
                                $sI,
                                $pI,
                                createExpandBoxes,
                                _this4 = this;
                            "billingAndShipping" == getShoptetDataLayer().pageType &&
                            void 0 !== this.config.checkoutRecommendations &&
                            (($sW = $("#order-shipping-methods")),
                                ($pW = $("#order-billing-methods")),
                            $sW.length &&
                            $pW.length &&
                            (($sI = $sW.find(".radio-wrapper")),
                                ($pI = $pW.find(".radio-wrapper")),
                                (createExpandBoxes = $(".shipping-billing-table .radio-wrapper")),
                            (void 0 === this.config.checkoutRecommendations.shippingTomIDs && void 0 === this.config.checkoutRecommendations.shippingRecIDs) ||
                            ($sI.each(function (index, $sInfo) {
                                var sId = Number($($sInfo).attr("data-id").replace("shipping-", "")),
                                    $sInfo = $($sInfo).find("label .payment-info");
                                _this4.config.checkoutRecommendations.shippingRecIDs.hasOwnProperty(sId) &&
                                $sInfo.find("b").after('<i class="yg-highlighted-badge">'.concat(_this4.config.checkoutRecommendations.shippingRecIDs[sId], "</i>")),
                                _this4.config.checkoutRecommendations.shippingTomIDs.includes(sId) &&
                                $sInfo.find("b").after('<i class="deliveryTommorow-icon show-tooltip" title="'.concat(_this4.config.checkoutRecommendations.shippingTomTooltipText, '"></i>'));
                            }),
                                initTooltips()),
                            void 0 !== this.config.checkoutRecommendations.paymentRecIDs &&
                            $pI.each(function (index, $pInfo) {
                                var pId = Number($($pInfo).attr("data-id").replace("billing-", "")),
                                    $pInfo = $($pInfo).find("label .payment-info");
                                _this4.config.checkoutRecommendations.paymentRecIDs.hasOwnProperty(pId) &&
                                $pInfo.find("b").after('<i class="yg-highlighted-badge">'.concat(_this4.config.checkoutRecommendations.paymentRecIDs[pId], "</i>"));
                            }),
                                createExpandBoxes.each(function (index, $prEl) {
                                    $prEl = $($prEl).find(".payment-shipping-price");
                                    Number(void 0 !== $prEl.attr("data-shipping-price") && !1 !== $prEl.attr("data-shipping-price") ? $prEl.attr("data-shipping-price") : $prEl.attr("data-billing-price")) < 0 &&
                                    $prEl.html('<span class="discount">'.concat($prEl.text(), "</span>"));
                                }),
                                (createExpandBoxes = function ($items, $wrap) {
                                    2 < $items.length &&
                                    ($wrap.find(".radio-wrapper:nth-child(-n+2)").wrapAll('<div class="yg-shipping-payments-intial-options"></div>'),
                                        $wrap.children(".radio-wrapper").wrapAll('<div class="yg-shipping-payments-extra-options"></div>'),
                                        $wrap.append('<a href="#vice-moznosti" class="yg-shipping-payments-toggle"><span class="c">Zobrazit vÃ­ce moÅ¾nostÃ­</span><span class="o">Zobrazit mÃ©nÄ› moÅ¾nostÃ­</span><i></i></a>'));
                                })($sI, $sW),
                                createExpandBoxes($pI, $pW)),
                                $(document).on("click", ".yg-shipping-payments-toggle", function (event) {
                                    event.preventDefault(), $(event.currentTarget).parent().toggleClass("yg-shipping-payments-extra-options-opened");
                                }));
                        },
                    };
                },
                {},
            ],
            12: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "orderProcess_cart",
                        config: {},
                        init: function () {
                            this.cartContinueBackMove(), this.changeVoucherBox(), this.createCartDeliveryTommorowBanner(), this.createCartImmediateDeliveryBanner();
                        },
                        czechHolidays: ["01-01", "04-02", "04-05", "05-01", "05-08", "07-05", "07-06", "09-28", "10-28", "11-17", "12-24", "12-25", "12-26"],
                        getNextDeliveryTommorowDeadline: function () {
                            var date,
                                _this = this;
                            do {
                                var found = function (date) {
                                        return String(date.getFullYear()) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                                    },
                                    now = new Date(),
                                    b_dayIsToday = found(now),
                                    b_TimeIsBeforeDeadline = ("0" + (date = now).getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2),
                                    date_i = date_i ? new Date(date_i.setDate(date_i.getDate() + 1)) : new Date(),
                                    date_i_date_s = found(date_i),
                                    found = date_i.getDay(),
                                    found =
                                        (0 != found || 6 == found) &&
                                        !(function (month_day) {
                                            (month_day = month_day.split("-")), (month_day = month_day[1] + "-" + month_day[2]);
                                            return _this.czechHolidays.includes(month_day);
                                        })(date_i_date_s),
                                    b_dayIsToday = b_dayIsToday == date_i_date_s,
                                    b_TimeIsBeforeDeadline = b_TimeIsBeforeDeadline <= this.config.deliveryTommorow.deadline,
                                    found = (b_dayIsToday && b_TimeIsBeforeDeadline) || (!b_dayIsToday && found);
                            } while (!found);
                            return new Date(date_i_date_s + " " + this.config.deliveryTommorow.deadline);
                        },
                        cartContinueBackMove: function () {
                            var move;
                            "cart" == getShoptetDataLayer().pageType &&
                            ((move = function () {
                                var $w = $("#cart-wrapper .summary .next-step"),
                                    $b = $w.find(".next-step-back"),
                                    newLineHTML = $w.find("#continue-order-button"),
                                    $t = $("#cart-wrapper .summary");
                                $b.length &&
                                newLineHTML.length &&
                                ((newLineHTML = '<div class="custom-continue-row"><div class="b">'.concat($b[0].outerHTML, '</div><div class="n">').concat(newLineHTML[0].outerHTML, "</div></div>")),
                                    $w.remove(),
                                    $t.after(newLineHTML));
                            })(),
                                document.addEventListener("ShoptetDOMCartContentLoaded", move, !1));
                        },
                        changeVoucherBox: function () {
                            var change = function () {
                                var $w = $(".toggle-coupon-input"),
                                    $b = $(".toggle-coupon-input-button");
                                $w.length && $b.length && ($w.prepend('<p class="coupon-code-title">SlevovÃ½ kupon</p>'), $b.remove());
                            };
                            change(), document.addEventListener("ShoptetDOMCartContentLoaded", change, !1);
                        },
                        createCartImmediateDeliveryBanner: function () {
                            var change,
                                _this2 = this;
                            "cart" == getShoptetDataLayer().pageType &&
                            1 == window.yourgames.goodsDiversification.getCartGoodsType() &&
                            this.matchAvailibilityTypeFromCartTable(this.config.immediateDelivery.availabilityTitle) &&
                            ((change = function () {
                                var $w;
                                _this2.config.immediateDelivery &&
                                (!_this2.config.immediateDelivery.visibility.cart ||
                                    (($w = $("#cart-wrapper .cart-inner")).length &&
                                        $w.prepend(
                                            '<div class="yg-banner-cart-immediateDelivery">\n                        <div class="t">\n                            <h2>'
                                                .concat(_this2.config.immediateDelivery.banner.mainTitle, "</h2>\n                            <p>")
                                                .concat(
                                                    _this2.config.immediateDelivery.banner.mainText,
                                                    '</p>\n                            <a class="show-detail-popup" href="#detail-doruceni-ihned">VÃ­ce informacÃ­</a>\n                        </div>\n                        </div>'
                                                )
                                        )));
                            })(),
                                document.addEventListener("ShoptetDOMCartContentLoaded", change, !1),
                                $(document).on("click", ".yg-banner-cart-immediateDelivery .show-detail-popup", function (event) {
                                    shoptet.modal.open({
                                        html: _this2.config.immediateDelivery.popupContent,
                                        className: "yg-custom-popup-design yg-popup-cart-immediateDelivery",
                                        maxWidth: shoptet.modal.config.maxWidth,
                                        width: shoptet.modal.config.widthMd,
                                        onComplete: null,
                                    });
                                }));
                        },
                        createCartDeliveryTommorowBanner: function () {
                            var change,
                                _this3 = this;
                            "cart" == getShoptetDataLayer().pageType &&
                            1 != window.yourgames.goodsDiversification.getCartGoodsType() &&
                            this.matchAvailibilityTypeFromCartTable(this.config.deliveryTommorow.availabilityTitle) &&
                            ((change = function () {
                                var $w, bTitle;
                                _this3.config.deliveryTommorow &&
                                _this3.config.deliveryTommorow.visibility.cart &&
                                (($w = $("#cart-wrapper .cart-inner")),
                                    (bTitle = window.yourgames.deliveryTommorow.getBannerTitle()),
                                $w.length &&
                                bTitle &&
                                ($w.prepend(
                                    '<div class="yg-banner-cart-deliveryTommorow">\n                        <div class="t">\n                            <h2>'
                                        .concat(bTitle, "</h2>\n                            <p>")
                                        .concat(
                                            _this3.config.deliveryTommorow.banner.mainText,
                                            '</p>\n                            <a class="show-detail-popup" href="#detail-doruceni">VÃ­ce informacÃ­</a>\n                        </div>\n                        <div class="c">\n                            <p class="title">'
                                        )
                                        .concat(
                                            _this3.config.deliveryTommorow.banner.countdownText,
                                            '</p>\n                            <div class="segs yg-cart-countdown">\n                                <div class="s yg-countdown-hours"><strong>&nbsp;</strong><span>hodiny</span></div>\n                                <div class="s yg-countdown-minutes"><strong>&nbsp;</strong><span>minut</span></div>\n                                <div class="s yg-countdown-seconds"><strong>&nbsp;</strong><span>sekund</span></div>\n                                <div class="ex">ÄŒas vyprÅ¡el</div>\n                            </div>\n                        </div>\n                        </div>'
                                        )
                                ),
                                    _this3.createDeliveryTommorowCountdown($(".yg-banner-cart-deliveryTommorow"))));
                            })(),
                                document.addEventListener("ShoptetDOMCartContentLoaded", change, !1),
                                $(document).on("click", ".yg-banner-cart-deliveryTommorow .show-detail-popup", function (event) {
                                    shoptet.modal.open({
                                        html: _this3.config.deliveryTommorow.popupContent,
                                        className: "yg-custom-popup-design yg-popup-cart-deliveryTommorow",
                                        maxWidth: shoptet.modal.config.maxWidth,
                                        width: shoptet.modal.config.widthMd,
                                        onComplete: null,
                                    });
                                }));
                        },
                        createDeliveryTommorowCountdown: function ($parent) {
                            var countDownDate,
                                x,
                                $hours = $parent.find(".yg-countdown-hours"),
                                $minutes = $parent.find(".yg-countdown-minutes"),
                                $seconds = $parent.find(".yg-countdown-seconds");
                            $parent.length &&
                            $hours.length &&
                            $minutes.length &&
                            $seconds.length &&
                            ((countDownDate = window.yourgames.deliveryTommorow.getNextDeliveryTommorowDeadline().getTime()),
                                (x = setInterval(function () {
                                    var hours_label = new Date().getTime(),
                                        total = countDownDate - hours_label,
                                        seconds = Math.floor((total / 1e3) % 60),
                                        minutes = Math.floor((total / 1e3 / 60) % 60),
                                        hours = Math.floor(total / 36e5),
                                        seconds_label = 0 == seconds || 5 <= seconds ? "sekund" : 1 == seconds ? "sekunda" : "sekundy",
                                        minutes_label = 0 == minutes || 5 <= minutes ? "minut" : 1 == minutes ? "minuta" : "minuty",
                                        hours_label = 0 == hours || 5 <= hours ? "hodin" : 1 == hours ? "hodina" : "hodiny";
                                    $hours.find("strong").text(hours),
                                        $hours.find("span").text(hours_label),
                                        $minutes.find("strong").text(minutes),
                                        $minutes.find("span").text(minutes_label),
                                        $seconds.find("strong").text(seconds),
                                        $seconds.find("span").text(seconds_label),
                                    total < 0 && (clearInterval(x), $parent.find(".s").hide(), $parent.find(".ex").show());
                                }, 1e3)));
                        },
                        matchAvailibilityTypeFromCartTable: function (availabilityName) {
                            var $rows = $(".cart-table");
                            if ($rows.length) {
                                $rows = $rows.find("tr:not(.cart-table-header):not(.related)");
                                if ($rows.length) {
                                    var found = !0;
                                    return (
                                        $rows.each(function (index, element) {
                                            var r_availability_title = $(this).find(".p-availability strong").text().trim();
                                            availabilityName != r_availability_title && (found = !1);
                                        }),
                                            found
                                    );
                                }
                                return !1;
                            }
                            return !1;
                        },
                    };
                },
                {},
            ],
            13: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "orderProcess_confirmation",
                        config: {},
                        init: function () {
                            var vsFound,
                                paymentType,
                                originalHeadingText = $(".recapitulation-table");
                            originalHeadingText.length &&
                            ((vsFound = !1),
                                originalHeadingText.find("tbody tr").each(function (indexInArray, valueOfElement) {
                                    var lineName = $(this).find("th span.row-header-label").text().trim();
                                    "VariabilnÃ­ symbol" == lineName && (vsFound = !0), "ZvolenÃ¡ platba" == lineName && (paymentType = $(this).find("td").text().trim());
                                }));
                            var $heading = $(".order-summary-heading");
                            $heading.length &&
                            ("VaÅ¡e objednÃ¡vka ÄekÃ¡ na zaplacenÃ­" == (originalHeadingText = $heading.text().trim())
                                ? ($heading.text("Tvoje objednÃ¡vka ÄekÃ¡ na zaplacenÃ­"), $heading.addClass("ygicon-waiting"))
                                : "DÄ›kujeme, VaÅ¡e objednÃ¡vka je zaplacena!" == originalHeadingText
                                    ? ($heading.text("DÄ›kujeme, Tvoje objednÃ¡vka je zaplacena!"), $heading.addClass("ygicon-check"))
                                    : "ObjednÃ¡vka odeslÃ¡na" != originalHeadingText || ("BankovnÃ­ pÅ™evod" != paymentType && "PÅ™evodem" != paymentType)
                                        ? $heading.addClass("ygicon-check")
                                        : ($heading.text("ObjednÃ¡vka byla pÅ™ijata. ProveÄ platbu dle nÃ­Å¾e uvedenÃ½ch detailÅ¯."), $heading.addClass("ygicon-waiting"))),
                            vsFound &&
                            $(".recapitulation-wrapper .co-box.co-payment-method").append(
                                '<div class="row"><div class="col-sm-12">'.concat(
                                    '\n            <div class="yg-alert-red">\n                <p class="title">NezapomeÅˆ uvÃ©st variabilnÃ­ symbol!</p>\n                <p>V pÅ™Ã­padÄ› nevyplnÄ›nÃ­ variabilnÃ­ho symbolu se nÃ¡m platba nepÅ™iÅ™adÃ­ k objednÃ¡vce, nezaÄne se tedy vyÅ™izovat a bude nutnÃ©, abys kontaktoval naÅ¡i zÃ¡kaznÃ­ckou podporu.</p>\n            </div>\n            ',
                                    "</div></div>"
                                )
                            );
                        },
                    };
                },
                {},
            ],
            14: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "orderProcess_customerDetails",
                        config: {},
                        init: function () {
                            this.manipulateContactInformation(), this.createConsentHighlights();
                        },
                        createConsentHighlights: function () {
                            var $zboziW,
                                $heurekaW,
                                consents,
                                $digiAlertAfter,
                                digiAlertHTML,
                                _this = this;
                            "customerDetails" == getShoptetDataLayer().pageType &&
                            (($digiAlertAfter = $(".order-summary")),
                                ($zboziW = $("#consentszboziConsent").parent()),
                                ($heurekaW = $("#consentsheurekaConsent").parent()),
                                (consents = ""),
                            $zboziW.length && ((consents += $zboziW[0].outerHTML), $zboziW.remove()),
                            $heurekaW.length && ((consents += $heurekaW[0].outerHTML), $heurekaW.remove()),
                            consents.length &&
                            ((digiAlertHTML = '\n                <div class="yg-love-consents">\n                    <div class="h">\n                        <p class="title">'
                                .concat(this.config.loveConsents.title, "</p>\n                        <p>")
                                .concat(this.config.loveConsents.description, '</p>\n                    </div>\n                    <div class="c">')
                                .concat(consents, "</div>\n                </div>\n                ")),
                                $digiAlertAfter.after(digiAlertHTML)),
                            1 == window.yourgames.goodsDiversification.getCartGoodsType() &&
                            void 0 !== this.config.digiAlertConsents &&
                            (($digiAlertAfter = $(".yg-love-consents").length ? $(".yg-love-consents") : $(".order-summary")),
                                (digiAlertHTML = '<a href="#detail" class="yg-digi-alert-consent"><p>'.concat(this.config.digiAlertConsents.text, "</p></a>")),
                                $digiAlertAfter.after(digiAlertHTML),
                                $(document).on("click", ".yg-digi-alert-consent", function (event) {
                                    shoptet.modal.open({
                                        html: _this.config.digiAlertConsents.popupContent,
                                        className: "yg-custom-popup-design yg-popup-cart-digi-alert-consent",
                                        maxWidth: shoptet.modal.config.maxWidth,
                                        width: shoptet.modal.config.widthMd,
                                        onComplete: null,
                                    });
                                })));
                        },
                        resetCompanyCredentialsLS: function () {
                            "customerDetails" != getShoptetDataLayer().pageType && localStorage.removeItem("customCheckboxCompanyShopping");
                        },
                        saveCompanyCredentialsToLS: function (t) {
                            t = t ? "1" : "0";
                            localStorage.setItem("customCheckboxCompanyShopping", t);
                        },
                        customCompanyBillingCheckboxEl: function () {
                            return $("#custom-checkbox-company-shopping");
                        },
                        toggleCompanyCredentials: function ($wrap) {
                            var toggle,
                                event = 0 < arguments.length && void 0 !== $wrap ? $wrap : null,
                                $checkbox = this.customCompanyBillingCheckboxEl(),
                                $wrap = $("#checkoutContent .co-box.co-billing-address");
                            (toggle = null == event ? null != (toggle = "1" == localStorage.getItem("customCheckboxCompanyShopping")) && toggle : !!$checkbox.is(":checked")),
                                $checkbox.prop("checked", toggle),
                                toggle ? $wrap.show() : ($wrap.hide(), this.customCompanyBillingRequiredValidationCheckAll()),
                                this.changeRequiredStateBillingInputs(toggle),
                                this.saveCompanyCredentialsToLS(toggle);
                        },
                        changeRequiredStateBillingInputs: function (state) {
                            var $inputs = this.getDigRequiredBillingInputs();
                            state ? $inputs.addClass("yg-custom-field-required-validation") : $inputs.removeClass("yg-custom-field-required-validation"),
                                $inputs.each(function (index, html) {
                                    var $el = $(html).parent().find("label"),
                                        html = $el.text().trim(),
                                        html = state ? '<span class="required-asterisk">'.concat(html, "</span>") : html;
                                    $el.html(html);
                                });
                        },
                        getDigRequiredBillingInputs: function () {
                            return $('#checkoutContent .co-billing-address input[type="text"]:not([name="vatId"])');
                        },
                        getDigAllBillingInputs: function () {
                            return $('#checkoutContent .co-billing-address input[type="text"]');
                        },
                        customRequiredValidation: function (element) {
                            var company_checked = this.customCompanyBillingCheckboxEl().is(":checked");
                            !company_checked || (company_checked && element.val().length) ? shoptet.validator.removeErrorMessage(element[0], "validatorRequired") : shoptet.validator.addErrorMessage(element[0], "validatorRequired");
                        },
                        customCompanyBillingRequiredValidationCheckAll: function () {
                            var _this2 = this;
                            this.getDigRequiredBillingInputs().each(function (index, element) {
                                _this2.customRequiredValidation($(element));
                            });
                        },
                        clearCompanyBillingFields: function () {
                            this.getDigAllBillingInputs().val("");
                        },
                        getFyzRequiredInputs: function () {
                            return $("#phone, #billStreet, #billHouseNumber, #billCity, #billZip");
                        },
                        setFyzRequiredInputs: function () {
                            var $inputs = this.getFyzRequiredInputs();
                            $inputs.addClass("yg-custom-field-required-validation"),
                                $inputs.each(function (index, html) {
                                    var $el = ("phone" == $(html).attr("id") ? $(html).parent() : $(html)).parent().find("label"),
                                        html = $el.text().trim(),
                                        html = '<span class="required-asterisk">'.concat(html, "</span>");
                                    $el.html(html);
                                });
                        },
                        customFyzRequiredValidation: function (element) {
                            element.val().length ? shoptet.validator.removeErrorMessage(element[0], "validatorRequired") : shoptet.validator.addErrorMessage(element[0], "validatorRequired");
                        },
                        customFyzRequiredValidationCheckAll: function () {
                            var _this3 = this;
                            this.getFyzRequiredInputs().each(function (index, element) {
                                _this3.customFyzRequiredValidation($(element));
                            });
                        },
                        manipulateContactInformation: function () {
                            var $parent,
                                _this4 = this;
                            this.resetCompanyCredentialsLS(),
                            "customerDetails" == getShoptetDataLayer().pageType &&
                            (($parent = $("#checkoutContent")),
                                1 == window.yourgames.goodsDiversification.getCartGoodsType()
                                    ? ($parent.find(".phone-form-group").hide(),
                                        $parent.find("#another-shipping").parent().hide(),
                                        $parent.find("#company-shopping").prop("checked", !0),
                                        $parent.find("#company-info").addClass("visible"),
                                        $parent.find("#company-shopping").parent().hide(),
                                        $(
                                            '\n                <div class="form-group custom-checkbox-company-shopping">\n                    <input type="checkbox" name="custom-checkbox-company-shopping" id="custom-checkbox-company-shopping" value="1">\n                    <label for="custom-checkbox-company-shopping" class="whole-width">Nakupuji na firmu</label>\n                </div>\n                '
                                        ).insertAfter("#checkoutContent .phone-form-group"),
                                        this.toggleCompanyCredentials(),
                                        $(document).on("change", "#custom-checkbox-company-shopping", function (event) {
                                            _this4.toggleCompanyCredentials(event);
                                        }),
                                        this.getDigRequiredBillingInputs().on("input", function (event) {
                                            _this4.customRequiredValidation($(event.target));
                                        }),
                                        $(document).on("click", "#submit-order", function (event) {
                                            _this4.customCompanyBillingRequiredValidationCheckAll(),
                                            _this4.customCompanyBillingCheckboxEl().is(":checked") || 0 != $("#checkoutContent .co-box.co-billing-address .js-error-field").length || _this4.clearCompanyBillingFields();
                                        }))
                                    : (this.setFyzRequiredInputs(),
                                        this.getFyzRequiredInputs().on("input", function (event) {
                                            _this4.customFyzRequiredValidation($(event.target));
                                        }),
                                        $(document).on("click", "#submit-order", function (event) {
                                            _this4.customFyzRequiredValidationCheckAll();
                                        })));
                        },
                    };
                },
                {},
            ],
            15: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "orderProcess",
                        config: {},
                        init: function () {
                            this.addRoboticPreparationToSummary();
                        },
                        addRoboticPreparationToSummary: function () {
                            var content,
                                _this = this;
                            1 != window.yourgames.goodsDiversification.getCartGoodsType() &&
                            ((content = '<a href="#detail" class="yg-robotic-delivery-addon">\n                <div class="text"><i></i> '.concat(
                                this.config.roboticPreparationInSummary.title,
                                ' <em class="question-tooltip show-tooltip" title="KliknutÃ­m zobrazÃ­te vÃ­ce informacÃ­"></em></div>\n                <div class="price">ZDARMA</div>\n            </a>'
                            )),
                                $(".order-summary-item.price").before(content),
                                initTooltips(),
                                $(document).on("click", ".yg-robotic-delivery-addon", function (event) {
                                    shoptet.modal.open({
                                        html: _this.config.roboticPreparationInSummary.popupContent,
                                        className: "yg-custom-popup-design yg-popup-cart-robotic-delivery-addon",
                                        maxWidth: shoptet.modal.config.maxWidth,
                                        width: shoptet.modal.config.widthMd,
                                        onComplete: null,
                                    });
                                }));
                        },
                    };
                },
                {},
            ],
            16: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        moduleName: "products",
                        config: {},
                        init: function () {
                            this.createHomepageSliders(),
                                this.createCategoryTopProducts(),
                                this.startProductListManipulation(),
                                this.startProductListFiltersPaginationManipulation(),
                                this.productDetailManipulation(),
                                this.createExtraGallery(),
                                this.mainAdditionalContent(),
                                this.addScrollProductPanel();
                        },
                        mainAdditionalContent: function () {
                            var $params, platform, bTitle, $w2;
                            "productDetail" == getShoptetDataLayer().pageType &&
                            ("DIG_" == (getShoptetDataLayer().product.hasOwnProperty("codes") ? getShoptetDataLayer().product.codes[0] : getShoptetDataLayer().product).code.substring(0, 4)
                                ? (($w2 = $(".p-detail-inner-header .ratings-and-brand")),
                                    ($params = $("#extendedDescription")),
                                    (platform = !1),
                                    $params.find("tbody tr").each(function (index, $val) {
                                        var $th = $($val).find("th .row-header-label"),
                                            $val = $($val).find("td");
                                        if ($th.length && $val.length && "Platforma" == $th.text().replace(":", "").trim()) return (platform = $val.text().trim()), !1;
                                    }),
                                platform &&
                                $w2.length &&
                                $w2.prepend('<div class="digital-platform-wrap"><em></em> '.concat(platform, '<span class="show-tooltip question-tooltip" title="SluÅ¾ba, na kterÃ© aktivujete obdrÅ¾enÃ½ klÃ­Ä">?</span></div>')),
                                $w2.length &&
                                $w2.prepend(
                                    '<div class="digital-product-wrap"><em></em>DigitÃ¡lnÃ­ produkt<span class="show-tooltip question-tooltip" title="ObdrÅ¾Ã­te digitÃ¡lnÃ­ produkt (aktivaÄnÃ­ klÃ­Ä) do vaÅ¡Ã­ e-mailovÃ© schrÃ¡nky">?</span></div>'
                                ),
                                ($w2 = $(".p-to-cart-block")).length &&
                                ((bTitle = '<div class="yg-digi-cart-banners">'),
                                $("button.add-to-cart-button").length && (bTitle += '<a class="delivery"><p class="title">DodÃ¡nÃ­ <strong>ihned na e-mail</strong></p><p>po pÅ™ijetÃ­ platby</p></a>'),
                                    (bTitle += '<a href="/aktivace-her/" class="activation"><p class="title">Jak na aktivacÃ­ klÃ­Äe?</p><p>Platforma '.concat(platform, "</p></a>")),
                                    (bTitle += "</div>"),
                                    $w2.before(bTitle)))
                                : ((bTitle = window.yourgames.deliveryTommorow.getBannerTitle()),
                                $("button.add-to-cart-button").length &&
                                bTitle &&
                                (($w2 = $(".p-to-cart-block")).prepend(
                                    '<div class="yg-banner-product-deliveryTommorow">\n                    <div class="t">\n                        <h2>'
                                        .concat(
                                            bTitle,
                                            '</h2>\n                        <a class="show-detail-popup" href="#detail-doruceni">Detaily a moÅ¾nosti doruÄenÃ­</a>\n                    </div>\n                    <div class="c">\n                        <p class="title">'
                                        )
                                        .concat(
                                            window.yourgames.deliveryTommorow.config.countdownLabel,
                                            '</p>\n                        <div class="segs yg-product-countdown">\n                            <div class="s yg-countdown-hours"><strong>&nbsp;</strong><span>hodiny</span></div>\n                            <div class="s yg-countdown-minutes"><strong>&nbsp;</strong><span>minut</span></div>\n                            <div class="s yg-countdown-seconds"><strong>&nbsp;</strong><span>sekund</span></div>\n                            <div class="ex">ÄŒas vyprÅ¡el</div>\n                        </div>\n                    </div>\n                    </div>'
                                        )
                                ),
                                    window.yourgames.orderProcess_cart.createDeliveryTommorowCountdown($(".yg-banner-product-deliveryTommorow")),
                                    $(document).on("click", ".yg-banner-product-deliveryTommorow .show-detail-popup", function (event) {
                                        shoptet.modal.open({
                                            html: window.yourgames.deliveryTommorow.config.productPopupContent,
                                            className: "yg-custom-popup-design yg-popup-product-deliveryTommorow",
                                            maxWidth: shoptet.modal.config.maxWidth,
                                            width: shoptet.modal.config.widthMd,
                                        });
                                    }))));
                        },
                        addScrollProductPanel: function () {
                            var image,
                                title,
                                $priceStandart,
                                priceStandart,
                                priceFinal,
                                $addToCartBtn,
                                unpackedGoodsFound,
                                tabs,
                                panelHTML,
                                scrollAgent,
                                $variantsSelect,
                                $variantsSelectOptions,
                                _this = this;
                            "productDetail" == getShoptetDataLayer().pageType &&
                            992 < $(window).width() &&
                            ((image = !!(priceFinal = $(".p-image-wrapper .p-image img")).length && priceFinal.attr("src")),
                                (title = !!($addToCartBtn = $(".p-detail-inner-header h1")).length && $addToCartBtn.text().trim()),
                                (priceFinal = $("#product-detail-form .price-standard .choose-variant").length
                                    ? ((priceStandart = !!($priceStandart = $(".p-data-wrapper .p-final-price-wrapper .price-standard")).length && $priceStandart.html()),
                                    !!(panelHTML = $(".p-data-wrapper .p-final-price-wrapper .price-final")).length && panelHTML.html())
                                    : ((priceStandart = !!($priceStandart = $(".p-data-wrapper .p-final-price-wrapper .price-standard span")).length && $priceStandart.text().trim()),
                                    !!(panelHTML = $(".p-data-wrapper .p-final-price-wrapper .price-final span")).length && panelHTML.text().trim())),
                                ($addToCartBtn = $('button[type="submit"].add-to-cart-button')),
                            this.config.unpackedGoods.show &&
                            (($variantsSelect = $("#simple-variants-select")),
                                (tabs = $("#simple-variants")),
                            $variantsSelect.length &&
                            this.config.unpackedGoods.keywords.length &&
                            ($variantsSelectOptions = $variantsSelect.find("option")).length &&
                            ((unpackedGoodsFound = !1),
                                $variantsSelectOptions.each(function (index, element) {
                                    _this.config.unpackedGoods.keywords.some(function (v) {
                                        return $(element).text().includes(v);
                                    }) && (unpackedGoodsFound = !0);
                                }),
                            unpackedGoodsFound &&
                            (tabs.append('<a href="#rozbaleno" class="unpacked-goods-info"><div class="bg">%</div><strong><div class="info"></div>UÅ¡etÅ™ete</strong>na rozbalenÃ©m zboÅ¾Ã­</a>'),
                                $(document).on("click", ".unpacked-goods-info", function (event) {
                                    event.preventDefault(),
                                        shoptet.modal.open({ html: _this.config.unpackedGoods.popupContent, className: "yg-custom-popup-design", maxWidth: shoptet.modal.config.maxWidth, width: shoptet.modal.config.widthMd });
                                })))),
                                (tabs = !!(panelHTML = $("#p-detail-tabs")).length && panelHTML.html()),
                            title &&
                            priceFinal &&
                            ((panelHTML = ""),
                                (panelHTML += '<div class="yg-product-scroll-panel">'),
                                (panelHTML += '<div class="container">'),
                                (panelHTML += '<div class="panel-row">'),
                                (panelHTML += '<div class="l">'),
                            image && (panelHTML += '<div class="img-wrap"><img src="'.concat(image, '" alt="').concat(title, '"></div>')),
                                (panelHTML += '<div class="info-wrap">'),
                                (panelHTML += '<p class="name">'.concat(title, "</p>")),
                                (panelHTML += '<p class="price">'),
                            $priceStandart.length && $addToCartBtn.length && (panelHTML += '<span class="standart">'.concat(priceStandart, "</span>")),
                                (panelHTML += '<span class="final">'.concat(priceFinal, "</span>")),
                                (panelHTML += "</p>"),
                                (panelHTML += "</div>"),
                            $addToCartBtn.length && (panelHTML += '<div class="add-wrap"><button type="button" class="add btn btn-conversion"><i></i>PÅ™idat do koÅ¡Ã­ku</button></div>'),
                                (panelHTML += "</div>"),
                                (panelHTML += '<div class="r">'),
                            tabs && ((panelHTML += '<ul class="tabs-wrap">'), (panelHTML += tabs), (panelHTML += "</ul>")),
                                (panelHTML += '<a href="#" class="back-to-top"></a>'),
                                (panelHTML += "</div>"),
                                (panelHTML += "</div>"),
                                (panelHTML += "</div>"),
                                (panelHTML += "</div>"),
                                $(".overall-wrapper").prepend(panelHTML),
                                $(document).on("change", "#simple-variants-select", function () {
                                    var $priceFinal = $(".p-data-wrapper .p-final-price-wrapper .price-standard"),
                                        priceFinal = !!$priceFinal.length && $priceFinal.html();
                                    $priceFinal.length && $(".yg-product-scroll-panel .price .standart").html(priceFinal);
                                    ($priceFinal = $(".p-data-wrapper .p-final-price-wrapper .price-final")), (priceFinal = !!$priceFinal.length && $priceFinal.html());
                                    $priceFinal.length && $(".yg-product-scroll-panel .price .final").html(priceFinal);
                                }),
                                $(document).on("click", ".yg-product-scroll-panel .back-to-top", function () {
                                    scrollToEl($("body"));
                                }),
                                $(document).on("click", ".yg-product-scroll-panel .tabs-wrap .shp-tab a", function (index) {
                                    index.preventDefault();
                                    index = $(this).parent().index();
                                    $("#p-detail-tabs li:nth-child(".concat(index + 1, ") a")).click(), scrollToEl($(".shp-tabs-wrapper"));
                                }),
                                $(document).on("click", ".yg-product-scroll-panel .add-wrap button.add", function (e) {
                                    e.preventDefault(), $('.add-to-cart .quantity input[name="amount"]').val(1), $(".add-to-cart .add-to-cart-button").click(), scrollToEl($("body"));
                                }),
                                (scrollAgent = function () {
                                    var elmTop = $(".shp-tabs-wrapper")[0].getBoundingClientRect().top + window.scrollY;
                                    $(window).scrollTop() > elmTop ? $(".yg-product-scroll-panel").addClass("visible") : $(".yg-product-scroll-panel").removeClass("visible");
                                }),
                            ($variantsSelect = $("#simple-variants-select")).length &&
                            (($variantsSelectOptions = $variantsSelect.find("option")),
                            "" == $variantsSelect.val() &&
                            $variantsSelectOptions.each(function (index, element) {
                                $(element).text().includes("NovÃ© zboÅ¾Ã­") && $(element).text().includes("Skladem") && $variantsSelect.val($(element).attr("value"));
                            })),
                                scrollAgent(),
                                $(window).scroll(function () {
                                    scrollAgent();
                                })));
                        },
                        createHomepageSliders: function () {
                            $("body.in-index .products-wrapper .product-slider").slick({
                                infinite: !0,
                                slidesToShow: 4,
                                slidesToScroll: 2,
                                responsive: [
                                    { breakpoint: 992, settings: { slidesToShow: 4, slidesToScroll: 2 } },
                                    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
                                    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
                                ],
                            });
                        },
                        productListItemsSelector: '.p[data-micro="product"]:not(.yg-product-elements-moved)',
                        startProductListManipulation: function () {
                            var _this2 = this,
                                manipulate = function () {
                                    return _this2.makeAllProductListManipulation();
                                };
                            manipulate(), document.addEventListener("ShoptetDOMPageContentLoaded", manipulate, !1), document.addEventListener("ShoptetDOMPageMoreProductsLoaded", manipulate, !1);
                        },
                        makeAllProductListManipulation: function () {
                            this.makeStandardPriceListManipulation();
                        },
                        makeProductDescriptionManipulation: function () {},
                        makeStandardPriceListManipulation: function () {
                            $(document)
                                .find(this.productListItemsSelector)
                                .each(function (index, desc_pr_el) {
                                    var el = $(desc_pr_el),
                                        desc_dest_el = el.find(".flag.flag-discount .price-standard"),
                                        desc_pr_el_html = el.find(".prices .price.price-final");
                                    desc_dest_el.length && desc_pr_el_html.length && desc_pr_el_html.prepend(desc_dest_el[0].outerHTML);
                                    desc_pr_el = el.find(".p-bottom .p-desc");
                                    desc_pr_el.length && ((desc_pr_el_html = desc_pr_el[0].outerHTML), (desc_dest_el = el.find(".p-in .p-in-in a.name")), $(desc_pr_el).remove(), desc_dest_el.after(desc_pr_el_html)),
                                        el.addClass("yg-product-elements-moved");
                                });
                        },
                        startProductListFiltersPaginationManipulation: function () {
                            this.manipulateProductListFiltersPagination(), document.addEventListener("ShoptetDOMPageContentLoaded", this.manipulateProductListFiltersPagination, !1);
                        },
                        manipulateProductListFiltersPagination: function () {
                            "category" == getShoptetDataLayer().pageType &&
                            ($("aside.sidebar.sidebar-left").length
                                    ? $("#category-header, #filters-wrapper, #products, #content .pagination-wrapper")
                                    : $("#category-header, #filters-wrapper, #content .filters-wrapper, #filters-default-position, #products, #content .pagination-wrapper")
                            ).wrapAll('<div class="yg-product-list-custom-wrapper"></div>');
                        },
                        createCategoryTopProducts: function () {
                            var createSlider = function () {
                                "category" == getShoptetDataLayer().pageType &&
                                ($("#productsTop").prev().andSelf().wrapAll('<div class="yg-top-products-category-slider-wrap">'),
                                    $("body.type-category .category-top #productsTop").slick({
                                        infinite: !0,
                                        slidesToShow: 4,
                                        slidesToScroll: 2,
                                        responsive: [
                                            { breakpoint: 992, settings: { slidesToShow: 4, slidesToScroll: 2 } },
                                            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
                                            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
                                        ],
                                    }));
                            };
                            createSlider(), document.addEventListener("ShoptetDOMPageContentLoaded", createSlider, !1), document.addEventListener("ShoptetDOMPageMoreProductsLoaded", createSlider, !1);
                        },
                        getGalleryItems: function () {
                            var items = $(".p-thumbnails-wrapper .p-thumbnails-inner > div a.p-thumbnail"),
                                arr = [];
                            return (
                                items.each(function (indexInArray, valueOfElement) {
                                    arr.push($(valueOfElement).attr("href"));
                                }),
                                    arr
                            );
                        },
                        createExtraGallery: function () {
                            if ("productDetail" == getShoptetDataLayer().pageType) {
                                var gallery_items = this.getGalleryItems();
                                if (2 < gallery_items.length) {
                                    for (
                                        var sel_tab_html = '<li class="shp-tab" data-width="140"><a href="#productExtendedGallery" class="shp-tab-link" role="tab" data-toggle="tab">Fotogalerie ('.concat(gallery_items.length, ")</a></li>"),
                                            tab_content_html = '<div id="productExtendedGallery" class="tab-pane fade" role="tabpanel"><div class="yg-product-detail-extra-gallery">',
                                            index = 0;
                                        index < gallery_items.length;
                                        index++
                                    ) {
                                        var this_img = '<img data-src="'.concat(gallery_items[index], '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">');
                                        tab_content_html += '<div class="extra-gallery-item '.concat((index + 3) % 3 == 0 ? "item-big" : "item-small", '">').concat(this_img, "</div>");
                                    }
                                    (tab_content_html += "</div></div>"), $("#p-detail-tabs > li:first-child").after(sel_tab_html), $("#tab-content .tab-pane:first-child").after(tab_content_html), $("#productExtendedGallery img").unveil();
                                }
                            }
                        },
                        productDetailManipulation: function () {
                            var related_p_el, after_el, $originalBuyBtn, $newBuyBtnTarget, originalBuyBtnHTML;
                            "productDetail" == getShoptetDataLayer().pageType &&
                            ((related_p_el = $(".products-related-wrapper")),
                                (after_el = $(".p-detail-inner")),
                            related_p_el.length && (($originalBuyBtn = related_p_el[0].outerHTML), related_p_el.remove(), after_el.after($originalBuyBtn)),
                                $("body.type-product.type-detail .products-related-wrapper .product-slider, body.type-product.type-detail .products-alternative-wrapper .product-slider").slick({
                                    infinite: !0,
                                    slidesToShow: 4,
                                    slidesToScroll: 2,
                                    responsive: [
                                        { breakpoint: 992, settings: { slidesToShow: 4, slidesToScroll: 2 } },
                                        { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
                                        { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
                                    ],
                                }),
                                $(".product-slider img").unveil(),
                                $('.shp-tabs-row .shp-tab a[href="#productDiscussion"]').parent().remove(),
                                $("#productDiscussion").remove(),
                            ($originalBuyBtn = $(".p-detail .p-short-description")).length && $originalBuyBtn.after('<a href="#description" class="full-description-link">Zobrazit celÃ½ popis</a>'),
                                $(document).on("click", "a.full-description-link", function (event) {
                                    event.preventDefault(), $('#p-detail-tabs .shp-tab a[href="#description"]').click(), scrollToEl($(".p-detail-tabs-wrapper"));
                                }),
                                $(".p-detail .p-final-price-wrapper").wrapAll('<div class="yg-custom-price-row">'),
                                ($originalBuyBtn = $(".detail-parameters .choose-variant:first-child .availability-label")).length
                                    ? ((originalBuyBtnHTML = $originalBuyBtn.parent().parent().html()), $originalBuyBtn.parent().parent().parent().remove())
                                    : ((originalBuyBtnHTML = ($newBuyBtnTarget = $(".p-detail .availability-label").parent()).html()), $newBuyBtnTarget.parent().remove()),
                                $(".yg-custom-price-row").append('<div class="yg-custom-availability-panel">'.concat(originalBuyBtnHTML, "</div>")),
                                initTooltips(),
                            $(".p-detail #product-detail-form .detail-parameters tr").length || $(".p-detail #product-detail-form .detail-parameters").remove(),
                                ($originalBuyBtn = $("button.add-to-cart-button")),
                                ($newBuyBtnTarget = $(".p-to-cart-block .add-to-cart")),
                            $originalBuyBtn.length && $newBuyBtnTarget.length && ((originalBuyBtnHTML = $originalBuyBtn[0].outerHTML), $originalBuyBtn.remove(), $newBuyBtnTarget.append(originalBuyBtnHTML)),
                                $(document).on("change", "#simple-variants-select", function () {
                                    $("#product-detail-form .price-standard span.empty").hasClass("no-display")
                                        ? ($("#product-detail-form .price-standard").show(), $("#product-detail-form .price-save").show())
                                        : ($("#product-detail-form .price-standard").hide(), $("#product-detail-form .price-save").hide());
                                }));
                        },
                    };
                },
                {},
            ],
            17: [
                function (require, module, exports) {
                    "use strict";
                    module.exports = {
                        init: function () {
                            var remove = function () {
                                $(".user-action-in .cart-widget-products .cart-widget-product .cart-widget-product-delete .remove-item, .cart-table .remove-item").each(function (indexInArray, valueOfElement) {
                                    $(valueOfElement).removeClass("remove-item");
                                });
                            };
                            remove(), document.addEventListener("ShoptetDOMCartContentLoaded", remove, !1);
                        },
                    };
                },
                {},
            ],
        },
        {},
        [1]
    );
