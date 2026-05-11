/**
 * UI Controller
 */
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleBtn');

    // Get Stats, on/off 
    chrome.storage.local.get(['totalCensored', 'wordStats', 'isEnabled'], function(result) {
        document.getElementById('countDisplay').innerText = result.totalCensored || 0;

        let stats = result.wordStats || {};
        let topWord = "None";
        let topCount = 0;

        for (let word in stats) {
            if (stats[word] > topCount) {
                topCount = stats[word];
                topWord = word;
            }
        }

        if (topCount > 0) {
            if (topWord.toLowerCase() === "cv" || topWord.toLowerCase() === "hr") {
                topWord = topWord.charAt(0) + "*";
            } else {
                topWord = topWord.replace(/[aeiouyæøåäöüáéíóúàèìòùâêîôûãõëïÿαεηιουωаеёиоуыэюя]/i, '*');
            }
            document.getElementById('topWord').innerText = topWord;
            document.getElementById('topCount').innerText = topCount;
        }

        // Sett farge og tekst på knappen basert på om den er PÅ eller AV
        let isEnabled = result.isEnabled !== false;
        updateBtn(isEnabled);

        // Button event listener for å toggle censoring
        toggleBtn.addEventListener('click', () => {
            isEnabled = !isEnabled;
            chrome.storage.local.set({'isEnabled': isEnabled}, () => {
                updateBtn(isEnabled);
                
                // Reload tab
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.reload(tabs[0].id);
                });
            });
        });
    });

    function updateBtn(enabled) {
        if (enabled) {
            toggleBtn.innerText = "🛑 CENSORING IS ON";
            toggleBtn.style.backgroundColor = "#ff4757";
            toggleBtn.style.color = "white";
        } else {
            toggleBtn.innerText = "👀 CENSORING IS OFF";
            toggleBtn.style.backgroundColor = "#5f6368";
            toggleBtn.style.color = "#e8eaed";
        }
    }
});