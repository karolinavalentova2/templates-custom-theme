import {doStyleOnAllOrderingPages} from "../../blocks/allOrderingProcess";
import {HelperFunctions} from "../../config/helperFunctions";
import {doInjectCustomBehaviorInShoptetNamespace} from "../../config/shoptetFunctionsAdjusted";

export class CartThirdStep {
    static EventListeners = {
        'change': CartThirdStep.doLoadOnChange,
        "ShoptetBaseShippingInfoObtained": CartThirdStep.doLoadOnChange,
    }
    static async doInit() {
        doStyleOnAllOrderingPages();
        CartThirdStep.doStyleMisc();
        HelperFunctions.doFetchProductImagesFromStepOne();
        doInjectCustomBehaviorInShoptetNamespace("checkoutShared", "displaySelectedPriceByShippingBillingMethods", CartThirdStep.doLoadOnChange, [])
        return true;
    }
    static doStyleMisc() {
        $('#checkoutContent .back-shopping-link').insertAfter('#checkoutSidebar');
    }
}
