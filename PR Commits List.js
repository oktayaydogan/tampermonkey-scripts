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

// #region ==================== MAIN

function main() {
    let hasMultipleFiles = false;
    let diffLayoutEl = document.querySelector("#diff-layout-component");
    hasMultipleFiles = Boolean(diffLayoutEl);

    let asideContainer = document.createElement("div");
    asideContainer.id = "commits-aside-container";
    asideContainer.style.display = "flex";
    asideContainer.style.gap = "1rem";
    asideContainer.style.flexDirection = "row";

    if (hasMultipleFiles) {
        diffLayoutEl.before(asideContainer);
        asideContainer.append(diffLayoutEl);
    } else {
        let commitTitleElXPath = `//*[@id="files_bucket"]/diff-file-filter/diff-layout/div[2]`;
        let commitTitleEl = getElementByXpath(commitTitleElXPath);
        let filesEl = document.querySelector("#files");
        let filesContainer = document.createElement("div");
        filesContainer.id = "files-container";
        commitTitleEl.before(filesContainer);
        filesContainer.append(commitTitleEl);
        filesContainer.append(filesEl);
        filesContainer.before(asideContainer);
        asideContainer.append(filesContainer);
    }

    let detailsMenuXPath = `//*[@id="files_bucket"]/diff-file-filter/diff-layout/div[1]/div/div[2]/div[2]/details[1]/details-menu`;
    let detailsMenuEl = getElementByXpath(detailsMenuXPath);
    let detailsMenuElClone = detailsMenuEl.cloneNode(true);
    detailsMenuElClone.classList.remove("position-absolute", "select-menu-modal");
    detailsMenuElClone.style.zIndex = "0";
    asideContainer.prepend(detailsMenuElClone);

    let style = document.createElement("style");
    style.textContent = `
        #commits-aside-container .select-menu-list {
            max-height: 60vh;
        }
        #commits-aside-container .in-range {
            background-color: hsl(200deg 100% 93%);
            color: black;
        }
        #commits-aside-container .in-range .description {
            color: inherit;
        }
        #commits-aside-container .select-menu-item:hover {
            background-color: var(--bgColor-accent-emphasis, var(--color-accent-emphasis));
            color: white;
        }
        #commits-aside-container .select-menu-item:hover * {
            color: inherit;
        }
        #commits-aside-container .select-menu-item:focus * {
            color: inherit;
        }
        #commits-aside-container details-menu {
            width: 400px;
        }
        #commits-aside-container .select-menu-item {
            padding-left: 1rem;
        }
        #commits-aside-container .select-menu-item-text {
            display: flex;
            flex-direction: column;
            position: relative;
        }
        #commits-aside-container .select-menu-item-text code {
            position: absolute;
            right: 0;
            top: 3px;
        }
        #commits-aside-container .select-menu-item-text div {
            margin-right: 50px;
        }
    `;
    asideContainer.append(style);
}

// #endregion

// #region ==================== UTILS

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// #endregion
