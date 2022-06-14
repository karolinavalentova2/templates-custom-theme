import {doInjectCustomBehaviorInShoptetNamespace} from "../config/shoptetFunctionsAdjusted";

export function doStyleNavigation() {
    // $('body').addClass('submenu-visible');
    // $('#navigation .menu-level-1 > li:first-child').addClass('exp');

    // $('#navigation').insertAfter('.header-top > div:first-child');

    // info message
    // $('.site-msg.information .text').appendTo('.top-navigation-menu');

    // add basket icon if location is basket
    if ($('body.ordering-process.id--9').length || $('body.ordering-process.id--15').length) {
        $(`
            <a href="/kosik/" class="btn btn-icon cart-count" data-target="cart" data-hover="false" data-redirect="false" rel="nofollow"></a>
        `).appendTo('.navigation-buttons');
    }

    // append login icon to navig buttons
    $('.top-navigation-bar .top-nav-button-login').attr('data-hover', 'true').insertBefore('.navigation-buttons .cart-count');
    $('.top-navigation-bar .top-nav-button-account').attr('data-hover', 'true').insertBefore('.navigation-buttons .cart-count');
    $('.navigation-buttons .search form button').text('');

    // append currency dropdown to navig buttons
    // $('.top-navigation-bar .dropdown').insertAfter('.navigation-buttons .search')

    // style top bar
    // const fbLink = $('.contact-box .facebook > a').attr('href');
    // $('.top-navigation-contacts').prepend(`<a href="${fbLink}" target="_blank" class="facebook"></a>`);

    // style navigation custom category dropdown
    // if(window.matchMedia( "(min-width: 768px)").matches) {
    //     console.log('run category dropdown')
    //     $('#footer .custom-footer .banner .menu-top').prependTo('.navigation-in');
    //     $('.navigation-in > .menu-level-1').appendTo('.navigation-in > .menu-top .category');
    //     const $category = $('.navigation-in .category');
    //
    //     $category.on('mouseenter', function (ev) {
    //         ev.preventDefault()
    //         $('body').addClass('category-open');
    //     })
    //     $category.on('mouseleave', function (ev) {
    //         ev.preventDefault()
    //         $('body').removeClass('category-open');
    //     })
    // }
    // $('.appended-category').addClass('splitted');

    if (window.matchMedia('(max-width: 767px)').matches) {
        // reverse mobile redirect on navigation 1st level links, dropdown should work on text and redirect on arrow
        // let previousOpenedParent;

        // $('#navigation .navigation-close').prependTo('#navigation .menu-level-1');
        $('.top-navigation-bar-menu').clone().appendTo('#navigation .navigation-in');
        $('.top-navigation-contacts').clone().appendTo('#navigation .navigation-in');

        $('#navigation .menu-level-2 > li').each(function (index, element) {
            $(element).addClass('second-level');
            if($(element).hasClass('has-third-level')) {
                $(element).find('> div > a').append('<span class="submenu-arrow"></span>');
            }
        })

        // reverse mobile redirect on navigation 1st level links, dropdown should work on text and redirect on arrow
        let previousOpenedParent;
        $('#navigation .navigation-in .menu-level-1 > li a').on('click', function (ev) {
            const link = $(ev.currentTarget).attr('href');
            // console.log(ev.currentTarget)
            ev.preventDefault();
            ev.stopImmediatePropagation();
            if(
                // ev.target.matches('.submenu-arrow') ||
                // $(ev.currentTarget).closest('.menu-level-2').length
                ev.currentTarget.matches('.menu-level-1 > li:not(.ext):not(.exp) > a')
                || ev.currentTarget.matches('.menu-level-1 > li.no-cat > a')
                || (ev.currentTarget.matches('.menu-level-1 > li.ext.exp > a')
                    && !ev.target.matches('.menu-level-1 > li.ext.exp > a > span.submenu-arrow'))
                || ev.currentTarget.matches('.menu-level-3 > li > a')
            ){
                window.location.href = link;
            } else if(
                ev.currentTarget.matches('.menu-level-1 > li > a')
                || ev.currentTarget.matches('.menu-level-1 > li > a > b')
                || ev.currentTarget.matches('.menu-level-1 > li > a > span:not(.submenu-arrow)')
                || ev.target.matches('.menu-level-2 > li > a > span.submenu-arrow')
                || ev.currentTarget.matches('.has-third-level > div > a')
            ) {
                const parentLevel = $(ev.currentTarget).closest('.ext');

                if($(ev.currentTarget).closest('.has-third-level').length) {
                    $(ev.currentTarget).closest('.has-third-level').toggleClass('open');
                    previousOpenedParent = null;
                } else if (parentLevel.hasClass('exp')) {
                    console.log('same element clicked')
                    parentLevel.removeClass("exp");
                    $('.has-third-level').removeClass('open');
                    $(document.body).removeClass('submenu-visible');
                    previousOpenedParent = null;
                    return;
                }

                console.log('clicked element will get exp')

                parentLevel.addClass('exp');
                $(document.body).addClass('submenu-visible');
                // on window resize move navigation under header
                // HelperFunctions.doMoveUserActionsBasedTopBar();

                if(previousOpenedParent) {
                    console.log('close previously opened')
                    previousOpenedParent.removeClass("exp");
                }

                previousOpenedParent = parentLevel
            }
        })

        // $('#navigation .navigation-in li a').on('click', function (ev) {
        //     console.log($(ev.currentTarget))
        //     const link = $(ev.currentTarget).attr('href');
        //     ev.preventDefault();
        //     ev.stopImmediatePropagation();
        //     if(
        //         // ev.target.matches('.submenu-arrow')
        //         // || (!$(ev.currentTarget).closest('li').hasClass('ext'))
        //         $(ev.currentTarget).closest('.menu-level-3').length
        //         || $(ev.currentTarget).closest('.second-level:not(.has-third-level)').length
        //         // || (!ev.target.matches('span.submenu-arrow'))
        //     )
        //     {
        //         window.location.href = link;
        //         // console.log($(ev.currentTarget))
        //     } else if(ev.currentTarget.matches('a')
        //         || ev.currentTarget.matches('b')
        //         || ev.currentTarget.matches('span:not(.submenu-arrow)')) {
        //         const parentLevel = $(ev.currentTarget).closest('.ext');
        //
        //         if(parentLevel.hasClass('exp')) {
        //             if($(ev.currentTarget).closest('.has-third-level').length) {
        //                 $(ev.currentTarget).closest('.has-third-level').toggleClass('open');
        //             } else {
        //                 // console.log('same element clicked')
        //                 parentLevel.removeClass("exp");
        //                 $(document.body).removeClass('submenu-visible');
        //                 // previousOpenedParent = null;
        //                 return;
        //             }
        //             previousOpenedParent = null;
        //         }
        //
        //         // console.log('clicked element will get exp')
        //
        //         parentLevel.addClass('exp');
        //         $(document.body).addClass('submenu-visible');
        //         // on window resize move navigation under header
        //         // HelperFunctions.doMoveUserActionsBasedTopBar();
        //
        //         if(previousOpenedParent) {
        //             // console.log('close previously opened')
        //             previousOpenedParent.removeClass("exp");
        //         }
        //
        //         previousOpenedParent = parentLevel
        //     }
        // })

        $('#navigation .navigation-in li, #navigation .navigation-in li > a').on('mouseover', function (ev) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
        })

        const origHideContentWindows = shoptet.global.showPopupWindow.bind();

        shoptet.global.showPopupWindow = (...argv) => {
            if(argv[0] === "navigation") {
                $('#navigation .navigation-in li.ext.exp').removeClass('exp');
                previousOpenedParent = null;
            }
            origHideContentWindows(...argv);
        }
    }
}
