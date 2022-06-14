import {doStyleOnAllOrderingPages} from "../../blocks/allOrderingProcess";
import {HelperFunctions} from "../../config/helperFunctions";

export class CartSecondStep {
    static EventListeners = {
    }

    static async doInit() {
        doStyleOnAllOrderingPages();
        CartSecondStep.doStyleMisc();
        HelperFunctions.doFetchProductImagesFromStepOne();
    }

    static doStyleMisc() {
        $('#checkoutSidebar .cart-content .next-step .next-step-forward').text('Pokračovat na osobní údaje');

        $('#checkoutContent .back-shopping-link').insertAfter('#checkoutSidebar');
    }
}
