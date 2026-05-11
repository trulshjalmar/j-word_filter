/**
 * Core censoring logic and observer
 */
const rootWords = [
    "job", "work", "employ", "career", "boss", "manage", "grind", "hustle", "office", "interview", "resume", "linkedin", "network",
    "jobb", "arbeid", "ansatt", "karriere", "stilling", "intervju", "kontor",
    "arbejd", "ansat", "chef", "arbet", "anställ", "tjänst",
    "työ", "ammat", "pomo", "ura", "toimist", "haastattel",
    "arbeit", "beruf", "büro", "bewerbung",
    "travail", "emploi", "patron", "bureau", "carrièr", "entretien",
    "werk", "baan", "baas", "beroep", "kantoor", "sollicitati",
    "trabaj", "emple", "jefe", "carrer", "oficina", "entrevist",
    "lavor", "impieg", "capo", "uffici", "colloqui",
    "trabalh", "empreg", "carreir", "escritóri",
    "iş", "meslek", "kariyer", "ofis", "mülakat",
    "prac", "szef", "karier", "biur", "wywiad",
    "šéf", "kancelář", "pohovor",
    "δουλει", "εργασι", "αφεντικ", "καριερ", "γραφει",
    "работ", "труд", "начальник", "шеф", "карьер", "офис", "интервью"
];
const strictWords = ["cv", "hr"];

const regexPattern = "\\b(" + rootWords.join("|") + ")\\w*|\\b(" + strictWords.join("|") + ")\\b";
const regex = new RegExp(regexPattern, "gi");

let censoredOnThisPage = 0;
let wordCounts = {};

// On?
chrome.storage.local.get(['isEnabled'], function(result) {
    if (result.isEnabled !== false) { 
        runCensor();
    }
});

function runCensor() {
    function censorCapitalism(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(regex, function(match) {
                if (!match) return ""; 
                censoredOnThisPage++;
                let lowerMatch = match.toLowerCase();
                wordCounts[lowerMatch] = (wordCounts[lowerMatch] || 0) + 1;
                if (lowerMatch === "cv" || lowerMatch === "hr") return match.charAt(0) + "*";
                return match.replace(/[aeiouyæøåäöüáéíóúàèìòùâêîôûãõëïÿαεηιουωаеёиоуыэюя]/i, '*');
            });
        } else {
            for (let child of node.childNodes) {
                if (child.nodeName.toLowerCase() !== 'script' && child.nodeName.toLowerCase() !== 'style') {
                    censorCapitalism(child);
                }
            }
        }
    }

    censorCapitalism(document.body);

    if (censoredOnThisPage > 0) {
        // stats
        chrome.runtime.sendMessage({action: "updateBadge", count: censoredOnThisPage});

        chrome.storage.local.get(['totalCensored', 'wordStats'], function(result) {
            let currentTotal = result.totalCensored || 0;
            let stats = result.wordStats || {};
            for (let word in wordCounts) {
                stats[word] = (stats[word] || 0) + wordCounts[word];
            }
            chrome.storage.local.set({
                'totalCensored': currentTotal + censoredOnThisPage,
                'wordStats': stats
            });
        });
    }
}