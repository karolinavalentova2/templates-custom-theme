import {HelperFunctions} from "../../config/helperFunctions";
import {doStyleOnAllOrderingPages} from "../../blocks/allOrderingProcess";
import {doStyleProductsListing} from "../../blocks/productsListing";
import {TranslationsManager} from "../../utils/localisationManager";

export class CartFirstStep {
    static EventListeners = {
        'ShoptetDOMContentLoaded': CartFirstStep.doLoadOnShoptetDOMPageContentLoaded,
    }

    static doLoadOnShoptetDOMPageContentLoaded() {
        HelperFunctions.onBasketEmpty();

        doStyleOnAllOrderingPages();
        CartFirstStep.doStyleCartMisc();
        CartFirstStep.doToggleVisibilityCouponField();
        CartFirstStep.doAppendRelatedProducts();
        CartFirstStep.doAddGiftsToTable();
        CartFirstStep.doHandleAppliedCoupon();
    }
    static async doInit() {
        doStyleOnAllOrderingPages();
        CartFirstStep.doToggleVisibilityCouponField();
        CartFirstStep.doFetchFooterFromIndex();
        CartFirstStep.doStyleCartMisc();
        CartFirstStep.doAppendRelatedProducts();
        CartFirstStep.doAddGiftsToTable();
        CartFirstStep.doHandleAppliedCoupon();
        doStyleProductsListing();
        return true;
    }

    static doStyleCartMisc() {
        $(`
            <thead><tr>
                <th>Prodcut</th>
                <th></th>
                <th>Dostupnost</th>
                <th>Množství</th>
                <th>Cena za kus</th>
                <th>Cena + upgrade celkem</th>
            </tr></thead>
        `).prependTo('.cart-content table.cart-table');
        $('.cart-content table.cart-table').wrap('<div class="cart-table-wrapper"></div>');
        $('.cart-content .delivery-time, .cart-content .cart-summary').wrapAll('<div class="bottom-wrapper"></div>');
        $('.cart-content.summary-wrapper').appendTo('.cart-content .bottom-wrapper');
        $('.cart-content .summary-wrapper .next-step .next-step-forward').text('Pokračovat na dopravu a platbu');
        $('.cart-summary .extras-wrapper .extras-col .discount-coupon .applied-coupon form .btn').val('Odebrat');
    }
    static doToggleVisibilityCouponField() {
        if($('.cart-inner .discount-coupon').length) {
            const $toggleElem = $(`
                <input type="checkbox" name="coupon" class="coupon-trigger">
                <label for="coupon" id="coupon">${TranslationsManager.doGetStringByLang('APPLY_COUPON')}</label>
            `);
            const $couponMsg = $(`<p class="hidden">${TranslationsManager.doGetStringByLang('APPLY_COUPON_MSG')}</p>`);
            const $appliedCoupon = $('.discount-coupon .applied-coupon');
            $couponMsg.prependTo('.cart-inner .discount-coupon');
            $toggleElem.prependTo('.cart-inner .discount-coupon');

            if($appliedCoupon.length > 0) {
                $toggleElem.addClass('hidden');
                $couponMsg.addClass('hidden');
            }

            const $checkbox = $('.cart-inner .discount-coupon > input[type=checkbox]');
            const $form = $('.cart-inner .discount-coupon > form');

            $toggleElem[0].checked = false;
            $form.addClass('hidden');

            $toggleElem.on('click', ()=> {

                if($toggleElem[0].checked === false) {
                    $checkbox[0].checked = true;
                    $form.removeClass('hidden');
                    $couponMsg.removeClass('hidden');
                } else {
                    $checkbox[0].checked = false;
                    $form.addClass('hidden');
                    $couponMsg.addClass('hidden');

                }
            })
        }
    }
    static doAddGiftsToTable() {
        // ad gift in the table
        // let $gift = $(".free-product-gifts > li");
        // if ($($gift).length) {
        //     $($gift).each(function (index, element) {
        //         let $giftImgUrl = $(element)
        //             .find(".free-gifts-img-hover > img");
        //         let giftName = $(element)
        //             .find(".free-gift-name")
        //             .clone()
        //             .children()
        //             .remove()
        //             .end()
        //             .text();
        //         let giftAmount = $(element).find(".free-gift-amount").text();
        //
        //         HelperFunctions.doReplaceImageSourceAttributes($giftImgUrl, "/detail/", "/orig/");
        //
        //         $(`
        //             <tr class="removeable gift">
        //                 <td class="cart-p-image">
        //                     <a>
        //                         <img src="${$giftImgUrl.attr('src')}" alt="gift image">
        //                     </a>
        //                 </td>
        //                 <td class="p-name">
        //                     <a class="main-link">${giftName}</a>
        //                 </td>
        //                 <td class="p-quantity p-cell">
        //                     <form class="quantity-form">
        //                         <span class="quantity gift">
        //                             <input type="text" value="${
        //             Number.parseInt(giftAmount) || 1
        //         }" disabled>
        //                         </span>
        //                     </form>
        //                 </td>
        //                 <td class="p-price p-cell"></td>
        //                 <td class="p-total">
        //                     <strong class="price-final" title="Součet">ZDARMA</strong>
        //                     <button type="submit" class="remove-item gift"></button>
        //                 </td>
        //             </tr>
        //             `).appendTo(".cart-inner .cart-table > tbody");
        //     });
        // }
    }
    static doHandleAppliedCoupon() {
        // if ($(".applied-coupon").length > 0) {
        //     let $couponName = dataLayer[0].shoptet.cartInfo.discountCoupon.code;
        //     let discount = $(".applied-coupon > strong").text();
        //     discount = discount.substring(
        //         discount.lastIndexOf("Sleva ") + 6,
        //         discount.includes("Kč")
        //             ? discount.lastIndexOf("Kč") + 2
        //             : discount.lastIndexOf("%") + 1
        //     );
        //     $(`
        //         <tr class="removeable coupon">
        //             <td class="cart-p-image">
        //                 <a href="#"><div class="coupon-img"></div></a>
        //             </td>
        //             <td class="p-name">
        //                 <div class="slim">Slevový kód</div>
        //                 <div>${$couponName}</div>
        //             </td>
        //             <td class="p-quantity">
        //                 <div></div>
        //             </td>
        //             <td class="p-price p-cell"></td>
        //             <td class="p-total">
        //                 <div>Uplatněná sleva - ${discount}</div>
        //             </td>
        //         </tr>
        //         `).appendTo(".cart-inner .cart-table > tbody");
        //     $(".applied-coupon form").appendTo(".removeable.coupon .p-total");
        //     $(`<button type="submit" class="remove-item"></button>`).appendTo(
        //         ".removeable.coupon .p-total form fieldset"
        //     );
        // }
    }
    static doFetchFooterFromIndex() {
        $.get( "/registrace", function( data ) {
            $( ".result" ).html( data );
            $(data).find('#footer').appendTo('body > .overall-wrapper')
        });
    }
    static doAppendRelatedProducts() {
        //TODO: Make sure we don't call this if the basked is not empty + find a better place for the call
        if($('.cart-inner').hasClass('cart-empty')) {
            HelperFunctions.onBasketEmpty();
        }

        if (!$(".ordering-process-related")[0]) {
            $(`
                    <div class="ordering-process-related">
                        <h2>Mohlo by se vám hodit</h2>
                        <div class="related-items"></div>
                    </div>
                `).insertAfter(".content-inner");
        }

        if($(".ordering-process-related .related-items").hasClass('related-products-added')) {
            console.log(`[CART] Related products already added`);
            return;
        }

        const $cartRelated = $(".cart-related-product");
        if($cartRelated.length) {
            console.log(`[CART] Showing related products from product`);
            HelperFunctions.doAppendCartRelatedProducts($cartRelated, false);

            const slider = '.ordering-process-related .related-items';
            if ($(slider).length) {
                $(slider).wrap("<div class='glider-contain'/>");
                $(slider).parent().append(`
                    <div data-glide-el="controls">
                        <button aria-label="Previous" class="glider-prev"></button>
                        <button aria-label="Next" class="glider-next"></button>
                    </div>
                    <div role="tablist" class="dots"></div>
                `);

                new Glider(document.querySelector('.related-items'), {
                    draggable: true,
                    slidesToShow: 2,
                    dragVelocity: 1,
                    dots: `.dots`,
                    arrows: {
                        prev: `.glider-prev`,
                        next: `.glider-next`,
                    },
                    responsive: [
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 4.5,
                                slidesToScroll: 4,
                            },
                        },
                    ],
                });
            }
        } else {
            HelperFunctions.doFetchProductsFromHomePage().then((products) => {
                console.log(`[CART] Fetching related products from homepage`);
                HelperFunctions.doAppendCartRelatedProducts(products, true);
            });
        }
    }
}
