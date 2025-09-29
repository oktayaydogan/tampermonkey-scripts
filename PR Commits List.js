// ==UserScript==
// @name         PR Commits List
// @namespace    http://tampermonkey.net/
// @version      2025-09-29
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/*/pull/*/commits/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    let loaded = false;
    window.addEventListener("load", function () {
        if (loaded) return;
        loaded = true;
        main();
    });
    setTimeout(() => {
        if (loaded) return;
        loaded = true;
        main();
    }, 5000);
})();

function main() {
    let hasMultipleFiles = false;

    let diffLayoutEl = document.querySelector("#diff-layout-component");

    hasMultipleFiles = Boolean(diffLayoutEl);

    let container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.flexDirection = "row";

    if (hasMultipleFiles) {
        diffLayoutEl.before(container);
        container.append(diffLayoutEl);
    } else {
        let commitTitleElXPath = `//*[@id="files_bucket"]/diff-file-filter/diff-layout/div[2]`;
        let commitTitleEl = getElementByXpath(commitTitleElXPath);
        let filesEl = document.querySelector("#files");
        let container2 = document.createElement("div");
        commitTitleEl.before(container2);
        container2.append(commitTitleEl);
        container2.append(filesEl);
        container2.before(container);
        container.append(container2);
    }

    let detailsMenuXPath = `//*[@id="files_bucket"]/diff-file-filter/diff-layout/div[1]/div/div[2]/div[2]/details[1]/details-menu`;
    let detailsMenuEl = getElementByXpath(detailsMenuXPath);
    let detailsMenuElClone = detailsMenuEl.cloneNode(true);
    detailsMenuElClone.classList.remove("position-absolute", "select-menu-modal");
    detailsMenuElClone.style.zIndex = "0";
    container.prepend(detailsMenuElClone);
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
