import {doStyleProductsListing} from "../blocks/productsListing";

export class ProductPage {
    static EventListeners = {
    }

    static async doInit() {
        ProductPage.doStyleMisc()
        ProductPage.doStyleDetailProductInfo()
        doStyleProductsListing();
        ProductPage.doStyleRelatedProducts();
        ProductPage.doStyleSimilarProducts();
        return true;
    }

    static doStyleMisc() {
        // move thumbnails to new row
        // $('<div class="row"></div>').appendTo('.p-detail .p-image-wrapper');
        // $('.p-detail .p-image-wrapper .p-thumbnails-wrapper').appendTo('.p-detail .p-image-wrapper > .row');

        // move name od product and rating widget
        $('.p-detail-inner-header').prependTo('.p-detail .p-info-wrapper')
        $('.p-detail-info').parent().removeClass('col-xs-12').addClass('ratings-wrapper').insertAfter('.p-detail-inner-header');

        // move price in add to cart
        $('.p-final-price-wrapper').insertAfter('.add-to-cart .quantity');

        $('.p-info-wrapper .availability-value').wrap('<div class="availability-wrapper"></div>');
        $('.detail-parameters .shipping-options').appendTo('.p-info-wrapper .availability-wrapper').wrap('<div class="delivery-wrapper"></div>');
        $('.detail-parameters .delivery-time-label, .detail-parameters .delivery-time')
            .prependTo('.p-info-wrapper .delivery-wrapper')
            .wrapAll('<div class="delivery-time-wrapper"></div>');

        if($('.delivery-time-wrapper').length) {
            $('.availability-wrapper').addClass('wrap')
        }

        $('.social-buttons-wrapper .watchdog span').text('Hlídat cenu');
        // $('.social-buttons-wrapper').appendTo('.add-to-cart');

        // open description tabs
        // $('#tab-content #ratingTab').removeClass('fade').addClass('in active');
        // $('#tab-content #productsAlternative').insertAfter('#tab-content #ratingTab');

        // move parameters description
        // add extended description / parameters as a new shp tab
        // const $extendedDescription = $('#description .extended-description');
        // if($extendedDescription.length) {
        //     $extendedDescription.attr('id', 'parameter').addClass('tab-pane fade').insertAfter('#tab-content #description');
        //     $(`
        //         <li class="shp-tab">
        //             <a href="#parameter" class="shp-tab-link" role="tab" data-toggle="tab">Parametry</a>
        //         </li>`).insertAfter('.shp-tabs-wrapper .shp-tabs-holder .shp-tab:nth-child(1)');
        // }

        // move tag under product name
        // $('.p-detail-info > .flags-default').insertAfter('.p-detail-inner-header > h1');
        // $('.p-image > .flags.flags-extra').prependTo('.p-detail-info');
    }
    static doStyleDetailProductInfo() {
        const $wrapper = $(`<div class="detail-info-wrapper"></div>`)
        $('.description-inner .row-header-label').each(function (index, element) {
            let header = $(element).contents().filter(function(){
                return this.nodeType == 3;
            })[0].nodeValue
            console.log(header)
            header = header.trim()

            if(
                header === 'Typ produktu'
                || header === 'Záruka'
            ) {
                const value = $(element).closest('tr').find('td').text();
                const link = $(element).closest('tr').find('td a').attr('href');
                let $item;
                if($(element).closest('tr').find('td a').length) {
                    $item = $(`<div class=""><span>${header}: </span><span><a href="${link}">${value}</a></span></div>`);
                } else {
                    $item = $(`<div class=""><span>${header}: </span><span>${value}</span></div>`);
                }
                $item.appendTo($wrapper)
            }
        })

        if($('.p-info-wrapper .p-detail-inner-header .p-code span').length) {
            const code = $('.p-info-wrapper .p-detail-inner-header .p-code span:last-of-type').text().trim();
            $(`<div class=""><span>Kód produktu: </span><span>${code}</span></div>`).appendTo($wrapper);
        }

        $wrapper.appendTo('.p-info-wrapper');
    }
    static doStyleRelatedProducts() {
        if($('.products-related').length) {
            const $wrapper = $(`
                <div class="glider-contain related">
                    <div class="glider product-block-glider"></div>
                    <div role="tablist" class="dots"></div>
                    <div data-glide-el="controls">
                        <button aria-label="Previous" class="glider-prev"></button>
                        <button aria-label="Next" class="glider-next"></button>
                    </div>
                </div>
            `)

            $('.products-related-header').text('Doporučené zboží').prependTo($wrapper);
            $('.products-related .product').each((index, element) => {
                $(element).appendTo($($wrapper).find('.glider'));
            })

            $wrapper.insertBefore('.products-related.products-additional');

            new Glider(document.querySelector('.glider-contain.related .glider'), {
                draggable: true,
                slidesToShow: 1,
                // dragVelocity: 1,
                dots: `.related .dots`,
                arrows: {
                    prev: `.related .glider-prev`,
                    next: `.related .glider-next`,
                },
                responsive: [
                    {
                        breakpoint: 350,
                        settings: {
                            slidesToShow: 2.25,
                            slidesToScroll: 1,
                        },
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 4.25,
                            slidesToScroll: 1,
                        },
                    },
                ],
            });
        }
    }
    static doStyleSimilarProducts() {
        if($('#productsAlternative').length) {
            const $wrapper = $(`
                <div class="glider-contain similar">
                <h2 class="products-alternative-header">Podobné produkty</h2>
                    <div class="glider product-block-glider"></div>
                    <div role="tablist" class="dots"></div>
                    <div data-glide-el="controls">
                        <button aria-label="Previous" class="glider-prev"></button>
                        <button aria-label="Next" class="glider-next"></button>
                    </div>
                </div>
            `)

            $('#productsAlternative .product').each((index, element) => {
                $(element).appendTo($($wrapper).find('.glider'));
            })

            $wrapper.appendTo('.p-detail');

            new Glider(document.querySelector('.glider-contain.similar .glider'), {
                draggable: true,
                slidesToShow: 1,
                dots: `.similar .dots`,
                arrows: {
                    prev: `.similar .glider-prev`,
                    next: `.similar .glider-next`,
                },
                responsive: [
                    {
                        breakpoint: 350,
                        settings: {
                            slidesToShow: 2.25,
                            slidesToScroll: 1,
                        },
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 4.25,
                            slidesToScroll: 1,
                        },
                    },
                ],
            });
        }
    }
}
