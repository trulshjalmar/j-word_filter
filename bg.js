// Lytter etter beskjeder fra nettsiden om hvor mange ord som er sensurert
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateBadge" && sender.tab) {
        // Viser antall ord på ikonet (kun på den spesifikke fanen)
        chrome.action.setBadgeText({
            text: request.count > 0 ? request.count.toString() : "",
            tabId: sender.tab.id
        });
        
        // Setter fargen på den lille boblen til "varsel-rød"
        chrome.action.setBadgeBackgroundColor({
            color: "#ff4757",
            tabId: sender.tab.id
        });
    }
});