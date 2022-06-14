import {doStyleOnAllOrderingPages} from "../../blocks/allOrderingProcess";

export class CartThankYouPage {
    static async doInit() {
        doStyleOnAllOrderingPages();
        CartThankYouPage.doStyleMisc();
        CartThankYouPage.doAddProductsOverview();
        CartThankYouPage.doAddGiftsToOverview();
        CartThankYouPage.doStyleGeneralBankTransferOverview();
        CartThankYouPage.doAddCouponToOverview();
        return true;
    }

    static doStyleMisc() {
        // $(".order-summary-heading").text("Děkujeme vám za objednávku");
        // $(".order-summary-item.total")
        //     .text(
        //         "Její rekapitulaci jsme vám právě poslali na email a o dalším vyřízení Vás budeme informovat."
        //     )
        //     .insertAfter(".order-summary-heading");
        // $(".recapitulation-wrapper .co-payment-method h4").text(
        //     "Souhrn objednávky"
        // );
        // $(".recapitulation-wrapper .co-payment-method").parent().addClass("main");
        //
        // const $utc = new Date().toLocaleDateString();
        // const $orderNumber = $(
        //     ".recapitulation-wrapper .reca-number strong"
        // ).text();
        // $(`
        //         <tr class="strong"><td>Datum objednání</td><td>${$utc}</td></tr>
        //         <tr class="strong order-num"><td>Číslo objednávky</td><td>${$orderNumber}</td></tr>
        //     `).prependTo(".recapitulation-wrapper .co-payment-method tbody");


        // // Add contact info
        // if ($(".co-contact").length === 0) {
        //     $(`
        //         <div class="co-contact">
        //             <h4>Potřebujete poradit?</h4>
        //             <div>
        //                 <span><strong>tel.:</strong> +420 770 118 595</span>
        //                 <p>(Po-Pá 8:00 - 16:00 h)</p>
        //             </div>
        //             <div>
        //                 <span><strong>email.:</strong> info@venira.cz</span>
        //             </div>
        //         </div>
        //         `).appendTo(".recapitulation-wrapper.main");
        // }

        // $(
        //     '.recapitulation-wrapper .co-payment-method .recapitulation-table th:contains("Částka k úhradě")'
        // )
        //     .parent()
        //     .addClass("final-price");
        // $(
        //     ".recapitulation-wrapper .co-payment-method .recapitulation-table .final-price"
        // )
        //     .prepend("<td><strong>Součet</strong></td>")
        //     .appendTo(
        //         ".recapitulation-wrapper .co-payment-method .recapitulation-table tbody"
        //     );
    }
    static doAddProductsOverview() {
        // let deliveryPrice;
        // let paymentPrice;
        // const $billingInfo = HelperFunctions.getCartBillingInfo();
        // if ($billingInfo) {
        //     deliveryPrice = $billingInfo
        //         .find(".recapitulation-single:first-child .text strong span")
        //         .text();
        //     paymentPrice = $billingInfo
        //         .find(".recapitulation-single:last-child .text strong span")
        //         .text();
        // }
        //
        // $('.ordering-process.in-dekujeme .recapitulation-wrapper .co-payment-method tbody th:contains("Zvolená doprava")').parent().addClass('delivery');
        // $('.ordering-process.in-dekujeme .recapitulation-wrapper .co-payment-method tbody th:contains("Zvolená platba")').parent().addClass('payment');
        // $('.ordering-process.in-dekujeme .recapitulation-wrapper .co-payment-method tbody th:contains("Částka k úhradě")').parent().addClass('total');
        // const deliveryElem = $('.ordering-process.in-dekujeme .recapitulation-wrapper .co-payment-method tbody .delivery td');
        // const paymentElem = $('.ordering-process.in-dekujeme .recapitulation-wrapper .co-payment-method tbody .payment td');
        // $(`<td><strong>${deliveryPrice}</strong></td>`).insertAfter(deliveryElem);
        // $(`<td><strong>${paymentPrice}</strong></td>`).insertAfter(paymentElem);
        //
        // $(`
        //     <tr class="products">
        //         <th>Produkty</th>
        //     </tr>
        //     `).insertAfter(
        //     ".recapitulation-wrapper .recapitulation-table > tbody .order-num"
        // );
        // $(`
        //     <tr class="products">
        //         <th>Produkty</th>
        //     </tr>
        //     `).insertAfter('.ordering-process.in-dekujeme .recapitulation-wrapper .recapitulation-table > tbody .payment');

    }
    static doAddGiftsToOverview() {
        // $(".recapitulation-wrapper .co-order .cart-table tr").each(function (
        //     index,
        //     element
        // ) {
        //     if ($(element).find(".for-free").length > 0) {
        //         const $giftName = $(element)
        //             .find(".p-name")
        //             .clone()
        //             .children()
        //             .remove()
        //             .end()
        //             .text();
        //         const $giftQuantity = $(element).find(".free-gift-amount").text();
        //
        //         $(`
        //             <tr class="gift-${index} gift product">
        //                 <td>+ ${$giftQuantity ? $giftQuantity : ""} Dárek, ${$giftName}</td>
        //                 <td><strong>Zdarma</strong></td>
        //             </tr>
        //             `).insertBefore(
        //             ".recapitulation-wrapper .recapitulation-table > tbody .delivery"
        //         );
        //     } else {
        //         const $productName = $(element).find(".p-name").text();
        //         const $productQuantity = $(element)
        //             .find(".p-quantity")
        //             .clone()
        //             .children()
        //             .remove()
        //             .end()
        //             .text();
        //         const $productPrice = $(element).find(".p-price").text();
        //         // console.log($(element).find('.p-quantity'))
        //
        //         $(`
        //             <tr class="product-${index} product">
        //                 <td>${$productQuantity + " " + $productName}</td>
        //                 <td><strong>${$productPrice}</strong></td>
        //             </tr>
        //         `).insertAfter(
        //             ".recapitulation-wrapper .recapitulation-table > tbody .products"
        //         );
        //     }
        // });
    }
    static doAddCouponToOverview() {
        // const $billingInfo = HelperFunctions.getCartBillingInfo();
        // if ($billingInfo.find('.product.coupon').length > 0) {
        //     const couponName = $billingInfo.find('.product.coupon .name')                .children()
        //         .remove()
        //         .end()
        //         .text();
        //     const couponPrice = $billingInfo.find('.product.coupon .price').text();
        //
        //     $(`
        //             <tr class="coupon">
        //                 <th>Slevový kód</th>
        //                 <td>${couponName}</td>
        //                 <td><strong>${couponPrice}</strong></td>
        //             </tr>
        //         `).insertBefore(
        //         ".recapitulation-wrapper .recapitulation-table > tbody .delivery"
        //     );
        // }
    }

    static doStyleGeneralBankTransferOverview() {
        // if($('.recapitulation-table img.qrcode').length > 0) {
        //     $('body').addClass('bank-transfer');
        //     $('.recapitulation-table:first-child .delivery, .recapitulation-table:first-child .payment').clone().insertBefore($('.recapitulation-table:nth-child(2) th:contains("Bankovní účet")').closest('tr'));
        // }
    }
}
