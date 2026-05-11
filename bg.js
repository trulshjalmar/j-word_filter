/**
 * Background service for badge management
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateBadge" && sender.tab) {
        
        chrome.action.setBadgeText({
            text: request.count > 0 ? request.count.toString() : "",
            tabId: sender.tab.id
        });
        
        
        chrome.action.setBadgeBackgroundColor({
            color: "#ff4757",
            tabId: sender.tab.id
        });
    }
});