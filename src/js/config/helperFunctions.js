import {STATES} from "./states";

export const HelperFunctions = {
    outerHTML: (htmlNode) => {
        return (
            htmlNode.outerHTML || new XMLSerializer().serializeToString(htmlNode)
        );
    },
    waitForElement: (selector) => {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    },
    doCloseAllModalOverlays: () => {
        $('body').removeClass(`
        user-action-visible
        basket-sidePopup
        cart-window-visible
        search-window-visible
        login-window-visible
        filters-visible
        fv-filter-modal
        `)
    },
    doFetchProductImagesFromStepOne: () => {
        $.ajax("/kosik/").done(function (html) {
            console.log($(html).find(".cart-table"));
            $(html)
                .find(".cart-table tr.removeable")
                .each(function (index, element) {
                    const basketItemImageSrc = $(element).find(".cart-p-image img").data("src");
                    const basketItemImageAlt = $(element).find(".cart-p-image img").attr("alt");
                    const basketItemName = $(element).find(".p-name > .main-link").clone().children().remove().end().text();

                    $('#checkoutSidebar .cart-item').each(function (index, element) {
                        const summaryItemName = $(element).find('.cart-item-name .main-link').clone().children().remove().end().text();

                        if (summaryItemName === basketItemName) {
                            $(`<div class="cart-item-image"><img src="${basketItemImageSrc}" alt="${basketItemImageAlt}"></div>`).prependTo(element);
                        }
                    })
                });
        });
    },
    doAppendCartRelatedProducts: (products, isCartEmpty) => {
        console.log(`[PRODUCTS] Processing ${products.length} products`);
        $(products).each(function (index, element) {
            let $cartRelatedImg,
                $cartRelatedPrice,
                $cartRelatedAvailability,
                $cartRelatedName,
                $cartRelatedButton;
            if (isCartEmpty) {
                if (index >= 4) {
                    return;
                }

                $cartRelatedImg = $(element)
                    .find(".image");
                $cartRelatedPrice = $(element).find(".prices").children();
                $cartRelatedAvailability = $(element).find(".availability").children();
                $cartRelatedName = $(element).find(".name");
                $cartRelatedButton = $(element).find("form");
            } else {
                if (index >= 16) {
                    return;
                }

                $cartRelatedImg = $(element).find(".cart-related-img");
                $cartRelatedPrice = $(element).find(".price-final");
                $cartRelatedAvailability = $(element).find(
                    ".cart-related-availability"
                );
                $cartRelatedName = $(element).find(".cart-related-name");
                $cartRelatedButton = $(element).find(".pr-action");
            }

            var $tmpNewProd = $(`
                            <div class="related-item item-${index} default">
                                <div class="image"></div>
                                <div class="text">
                                    <p class="name"></p>
                                    <p class="availability"></p>
                                    <p class="price"></p>
                                </div>
                                <div class="form"></div>
                            </div>
                            `);

            $tmpNewProd.find(".image").append($cartRelatedImg);
            $tmpNewProd.find(".price").append($cartRelatedPrice);
            $tmpNewProd.find(".availability").append($cartRelatedAvailability);
            $tmpNewProd.find(".name").append($cartRelatedName);
            $tmpNewProd.find(".form").append($cartRelatedButton);


            $tmpNewProd.appendTo(".ordering-process-related .related-items");

            var $imgRelated = $tmpNewProd.find("img");
            if($imgRelated.attr('data-src')) {
                $($imgRelated).attr("data-src", $($imgRelated).attr("data-src").replace("/related/", "/detail/"));
                $($imgRelated).attr('src', $($imgRelated).attr('data-src'));
            } else {
                $($imgRelated).attr("src", $($imgRelated).attr("src").replace("/related/", "/detail/"));
            }
            $(".ordering-process-related .related-item button").text('Přidat do košíku');
        });
        $(".ordering-process-related .related-items").addClass('related-products-added')
    },
    doFetchProductsFromHomePage: async () => {
        try {
            const res = await fetch(`${window.location.origin}`);
            if (res.status === 200) {
                const resText = await res.text();
                STATES.isRelatedProductsFetched = true;
                return $(resText).find(".products-block .product");
            }
        } catch (e) {
            console.error(e);
        }
    },
    onBasketEmpty: () => {
        // in kosik/ basket when there are no products
        let cartEmptyHeading = $(".cart-inner.cart-empty");
        if (cartEmptyHeading[0] && !cartEmptyHeading.find(".secondText")[0]) {
            STATES.isBasketEmpty = true;
            $(cartEmptyHeading).find(".h1").text("Váš nákupní košík je prázdný!");
        }
    },
    makeRequest: (u, e, i, n, a) => {
        // showSpinner();

        (e = void 0 === e || e),
            shoptet.scripts.signalCustomEvent(a, n);

        $.ajax({
            url: u,
            type: "GET",
            headers: { "X-Shoptet-XHR": "Shoptet_Coo7ai" },
            dataType: "html",
            timeout: 1e4,
            cache: true,
            success: function (n) {
                var a = shoptet.common.createDocumentFromString(n);
                shoptet.tracking.trackProductsFromPayload(a);
                var s = $(a).find("#content"),
                    o = $("#content");

                if ((o.html(s[0].innerHTML), $(a).find("#filters").length)) {
                    var r = $(a).find("#filters");
                    $("#filters").length || $("#category-header").after('<div id="filters" />'), $("#filters").html(r[0].innerHTML);
                }
                if ($(a).find(".breadcrumbs").length) {
                    var l = $(a).find(".breadcrumbs").clone();
                    $(".breadcrumbs").html(l[0].innerHTML);
                }
                if ($(a).find(".header-title").length) {
                    var c = $(a).find(".header-title").clone();
                    $(".header-title").html(c[0].innerHTML);
                }

                var u = $("#categoryMinValue"),
                    d = $("#categoryMaxValue");
                u.length && (categoryMinValue = parseInt(u.text())),
                d.length && (categoryMaxValue = parseInt(d.text())),
                    priceFilter(categoryMinValue, categoryMaxValue);
                $("#content-wrapper img").unveil(),
                    detectFilters(),
                    initTooltips(),
                    hideSpinner(),
                    dismissMessages();

                try {
                    if ($(".breadcrumbs").length) {
                        var h = $(".breadcrumbs > span:last"),
                            p = h.find("span").data("title"),
                            m = $("#navigation-first").data("basetitle");

                        document.title = p + " - " + m;
                        history.pushState(null, null, h.find("meta").attr("content"))
                        ;
                    } else {
                        history.pushState(null, null, u);
                    }
                    "scrollRestoration" in history && (history.scrollRestoration = "auto");

                } catch (t) {}

                "function" == typeof i && i();
                shoptet.scripts.signalDomLoad("ShoptetDOMPageContentLoaded", o[0]);
            },
            error: function () {
                /*$("html, body").animate({ scrollTop: 0 }, shoptet.config.animationDuration, function () {
                    showMessage(shoptet.messages.ajaxError, "warning", "", false, false);
                });*/
            },
        });

    },
    doScroll: () => {
        let didScroll;
        let lastScrollTop = 0;
        let delta = 5;
        const navbarHeight = $('#header').outerHeight();

        $(window).scroll(function(event){
            didScroll = true;
        });

        setInterval(function() {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 250);

        function hasScrolled() {
            // console.log('has scrolled')
            const st = $(window).scrollTop();

            // Make sure they scroll more than delta
            if(Math.abs(lastScrollTop - st) <= delta) {
                return;
            }

            // If they scrolled down and are past the navbar, add class .nav-up.
            // This is necessary so you never see what is "behind" the navbar.
            if (st > lastScrollTop && st > navbarHeight){
                // Scroll Down
                $('body').removeClass('nav-down').addClass('nav-up');
            } else {
                // Scroll Up
                if(st + $(window).height() < $(document).height()) {
                    $('body').removeClass('nav-up').addClass('nav-down');
                }
            }

            lastScrollTop = st;
        }
    },
}
