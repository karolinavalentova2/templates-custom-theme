
import {PageHandlers} from "../config/pageHandlers";
import {doInitEventListeners} from "./eventListeners";
import {AllPages} from "../pages/allPages";

export function doInitPageHandlers(triggerOnClassName) {
    try {
        const pagesClasses = Object.keys(PageHandlers);

        doInitEventListeners(AllPages.EventListeners || []);
        AllPages.doInit()
            .then(() => {
                pagesClasses.forEach((handlerClass) => {
                    if(handlerClass === 'load-by-url') {
                        const urls = Object.keys(PageHandlers['load-by-url']);

                        urls.forEach(pageUrl => {
                            if(window.location.pathname === pageUrl) {
                                const PageTemplate = PageHandlers['load-by-url'][pageUrl];
                                console.log(`[PAGE-LOADER] Loading page by url ${pageUrl}`);
                                doInstantiatePage(PageTemplate);
                            }
                        });
                    } else if ($(document.body).is(handlerClass)|| handlerClass === triggerOnClassName) {
                        console.log(`[PAGE-LOADER] Loading page ${handlerClass}`);

                        const PageTemplate = PageHandlers[handlerClass];
                        doInstantiatePage(PageTemplate);
                    }
                });
            })
            .catch(e => {
                console.log({ e });
            })
            .finally(() => {
                doHidePreloader();
            });
    } catch (e) {
        console.error({ e });
    }
}

function doInstantiatePage(PageTemplate) {
    doInitEventListeners(PageTemplate.EventListeners || []);

    PageTemplate.doInit().then(() => {
        doHidePreloader();
    }).catch(e => {
        console.log({ e });
        doHidePreloader();
    });
}

export function doHidePreloader() {
    setTimeout(function () {
        // $("body").addClass("loaded");
        $('#header #navigation').addClass('loaded');
    }, 5);
}
