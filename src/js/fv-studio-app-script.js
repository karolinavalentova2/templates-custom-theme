import {doInitPageHandlers} from "./utils/pageHandlerLoader";
import {doOverrideShoptetFunctions, doOverwriteShoptetFunctions} from "./config/shoptetFunctionsAdjusted";
import {doExtendJquery} from "./config/extendJquery";
// shoptet.dev.enableEventsMonitoring()
$(document).ready(function() {
    doExtendJquery();
    doOverrideShoptetFunctions();
    doOverwriteShoptetFunctions();
    doInitPageHandlers();
});


