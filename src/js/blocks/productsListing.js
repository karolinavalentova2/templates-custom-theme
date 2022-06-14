
export function doStyleProductsListing() {
    $('.product').each(function (index, element) {

        const $wrapper = $('<div class="cart-wrapper"></div>');
        $(element).find('.prices, .availability, .p-bottom .p-tools').appendTo($wrapper);

        // $(element).find('.prices').appendTo($(element).find('.p-in-in'));
        $(element).find('.flag-discount').children().wrapAll('<div class="price-discount"></div>');
        $(element).find('.price-discount').appendTo($wrapper.find('.prices'));
        $wrapper.appendTo($(element).find('.p-in'));

        $(element).find('.p-tools button span').text('Přidat do košíku')
    })
}
