export function doStyleOnAllOrderingPages() {
    $('ol.cart-header').prependTo('main .content-inner .cart-inner > .row, main .content-inner .cart-inner > form > .row');

    // contact box in header
    if($('.header-help').length || $('.ordering-process.id--15').length || $('.ordering-process.id--9').length) {return;}
    $(`<div class="header-help">
        <div class="title">
            <h4>Potřebujete pomoct s objednávkou?</h4>
        </div>
    </div>`).insertAfter('#header .header-top > div:first-of-type');
    $('.contact-box ul').appendTo('#header .header-help');

    $('.header-help .instagram').parent().addClass('hidden');
    $('.header-help .facebook').parent().addClass('hidden');

    // append login icon to navig buttons
    console.log($('.navigation-buttons').length)
    $('.top-navigation-bar .top-nav-button-login').attr('data-hover', 'true').appendTo('.navigation-buttons');
    $('.top-navigation-bar .top-nav-button-account').attr('data-hover', 'true').appendTo('.navigation-buttons');
}
