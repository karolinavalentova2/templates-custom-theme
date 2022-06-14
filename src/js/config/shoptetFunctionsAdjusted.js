import {HelperFunctions} from "./helperFunctions";


export function doInjectCustomBehaviorInShoptetNamespace(namespaceName, namespacePropName, newBehaviour, newBehaviorArgs = [], delayOriginalExecution = undefined) {
    if (shoptet[namespaceName] && shoptet[namespaceName][namespacePropName]) {
        const origPropNamespaceFunc = shoptet[namespaceName][namespacePropName].bind();

        console.log(`[DEP-INJECTOR] Injected behaviour within shoptet.${namespaceName}.${namespacePropName}`)
        shoptet[namespaceName][namespacePropName] = (...args) => {
            newBehaviour(...newBehaviorArgs);
            if(delayOriginalExecution) {
                setTimeout(() => {
                    origPropNamespaceFunc(...args);
                }, delayOriginalExecution)
            } else {
                origPropNamespaceFunc(...args);
            }
        };
    }
}
/*
* @desc Override will hijack a method allowing to extend the functionality of it and then execute it
*/
export function doOverrideShoptetFunctions() {
    // if (shoptet.checkoutShared && shoptet.checkoutShared.updatePriceSummary) {
    //     const origUpdatePriceSummary = shoptet.checkoutShared.updatePriceSummary;
    //     shoptet.checkoutShared.updatePriceSummary = (...args) => {
    //         HelperFunctions.showSelectedShippingCart();
    //         origUpdatePriceSummary(...args);
    //     };
    // }

    // eslint-disable-next-line no-undef
    // const respHandler = AjaxResponse.prototype.processResult.bind(AjaxResponse);
}
/*
* @desc Overwrite will replace a method allowing to extend the functionality of it and then execute it
*/
export function doOverwriteShoptetFunctions() {
    // eslint-disable-next-line no-undef
    AjaxResponse.prototype.processResult = function() {
        var callback;
        if (this.isFailed()) {
            callback = this.settings.failed
        } else if (this.isRedirected()) {
            if(localStorage.getItem('ajaxPreventRedirect')) {
                localStorage.removeItem('ajaxPreventRedirect')
            } else {
                this.redirect();
                callback = this.settings.redirect
            }
        } else {
            callback = this.settings.success
        }
        if (typeof callback === "function") {
            callback(this.getCode(), this.getMessage(), this.getPayload())
        }
        if (typeof this.settings.complete === "function") {
            this.settings.complete(this.getCode(), this.getMessage(), this.getPayload())
        }
    };
}

