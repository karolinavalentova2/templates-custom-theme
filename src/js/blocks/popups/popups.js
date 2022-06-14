import {HelperFunctions} from "../../config/helperFunctions";

export function doStyleLoginPopup() {
    // login registration
    if($('.registrace-box').length === 0){
        $(`<div class="registrace-box">
            <h4>Ještě nemáte účet?</h4>
            <p>Registrací získáte například:</p>
            <ul>
                <li><span><strong>Věrnostní program</strong> se slevami</span></li>
                <li><span>Přehled o stavu objednávek</span></li>
                <li><span><strong>Novinky</strong> se dozvíte jako první</span></li>
            </ul>
            <a href="/registrace/" class="" id="registr">Chci se registrovat</a>
        </div>`).appendTo('.user-action-login.popup-widget.login-widget .popup-widget-inner')
    }
}

export function doStyleSearch() {
    HelperFunctions.waitForElement('.search-whisperer-documents:first-of-type').then(()=> {
        $('.search-whisperer-documents:first-of-type .search-whisperer-document.search-whisperer-category').wrapAll('<div class="category" />');
        $('.search-whisperer-documents:first-of-type .search-whisperer-document:not(.search-whisperer-category)').wrapAll('<div class="articles" />');
    })
}

export function doStyleCurrencyPopup() {
    // if($('.dropdown-menu-flag').length) {
    //     const $sk = $('.dropdown-menu > li > a[href="/action/Currency/changeCurrency/?currencyCode=EUR"]');
    //     const $cz = $('.dropdown-menu > li > a[href="/action/Currency/changeCurrency/?currencyCode=CZK"]');
    //     $sk.text('EUR');
    //     $cz.text('Kč');
    //
    //     let $flags = {
    //         czk: $cz,
    //         sk: $sk,
    //         flagsBtn: $('#topNavigationDropdown'),
    //     }
    //     $flags.czk.parent().prepend('<span class="dropdown-menu-flag czk"></span>');
    //     $flags.sk.parent().prepend('<span class="dropdown-menu-flag sk"></span>');
    //
    //     let $activeCurrency = dataLayer[0].shoptet.currency;
    //     if ($activeCurrency === 'CZK') {
    //         document.querySelector(".top-navigation-tools .dropdown > button").childNodes[0].nodeValue = 'Kč';
    //     } else if ($activeCurrency === 'EUR') {
    //         document.querySelector(".top-navigation-tools .dropdown > button").childNodes[0].nodeValue = 'EUR';
    //     }
    // }
    //
    // $('.top-navigation-bar .dropdown').clone().insertAfter('.navigation-in .menu-level-1');
}

export function doStyleAdvancedOrder() {
    $(document).on('cbox_complete', function() {
        const $advancedOrder = $('.advanced-order');
        if($advancedOrder.length){
            $advancedOrder.closest("#colorbox").addClass("advanced-order-cb");
            $advancedOrder.find('.extra.discount').appendTo($advancedOrder).wrap('<div class="bottom-discount" />');

            const $return = $(`
            <div class="extra-back">
                <div>Zpět do obchodu</div>
            </div>
            `);
            if(! $('.advanced-order .extras-wrap .extra-back').length) {
                $return.prependTo('.advanced-order .extras-wrap');
            }
        }

        $('.advanced-order .extra-back > div').on('click', function () {
            $('#cboxClose').click()
        })
    });
}

