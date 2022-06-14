import {doStyleFooter} from "../blocks/footer";
import {doStyleNavigation} from "../blocks/navigation";
import {doStyleAdvancedOrder, doStyleCurrencyPopup, doStyleLoginPopup, doStyleSearch} from "../blocks/popups/popups";
import {doStyleProductsListing} from "../blocks/productsListing";
import {HelperFunctions} from "../config/helperFunctions";

export class AllPages {
    static EventListeners = {
        'ShoptetCartUpdated': AllPages.doLoadOnShoptetCartUpdated,
    }

    static doLoadOnShoptetCartUpdated() {
        if (!document.body.classList.contains("ordering-process")) {
            //TODO: This breaks badly
            //TODO: Create a custom method to preload the minicart view based upon this method. (AJAX)
            /*
            * @desc This method reloads the entire HTML of the #cart-wrapper clearing all the previous changes done to it
            * */
            shoptet.cart.getCartContent(false);
        }
    }

    static async doInit() {
        HelperFunctions.doScroll();
        doStyleLoginPopup();
        doStyleCurrencyPopup();
        doStyleAdvancedOrder();
        doStyleSearch();
        AllPages.doStyleSharedBlocksWithOmissions();
        AllPages.doStyleAllMisc();
        return true;
    }

    static doStyleSharedBlocksWithOmissions() {
        if(!document.body.classList.contains('ordering-process.id--16') || !document.body.classList.contains('ordering-process.id--17')) {
            HelperFunctions.waitForElement('#footer').then(()=> {
                doStyleFooter();
                doStyleNavigation();
            })
        } else {
            doStyleNavigation();
            doStyleFooter();
        }
    }
    static doStyleAllMisc() {
        $(document).on('cbox_complete', function(){
            doStyleProductsListing();
        });

        const $breadcrumb = $('.breadcrumbs-wrapper');
        if($breadcrumb.length) {
            $breadcrumb.removeClass('container');
            $breadcrumb.find('.breadcrumbs').addClass('container');
        }
    }
}
