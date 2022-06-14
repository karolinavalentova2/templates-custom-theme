export function doInitEventListeners(EVENT_LISTENERS) {
    Object.keys(EVENT_LISTENERS).forEach(key => {
        const eventHandler = EVENT_LISTENERS[key];
        document.addEventListener(key, eventHandler);
        console.log('[EVENTS] Loaded handler for ' + key);
    })
}
