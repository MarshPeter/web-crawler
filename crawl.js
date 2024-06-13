import { URL } from "node:url";
import { JSDOM } from "jsdom";

function normalizeURL(url_string) {
    const structuredURL = new URL(url_string);
    let mostly_normalized = structuredURL.hostname + structuredURL.pathname;
    if (mostly_normalized[mostly_normalized.length - 1] === "/") {
        return mostly_normalized.slice(0, -1);
    }

    return mostly_normalized;
}

function getURLsFromHtml(htmlBody, baseUrl) {
    const dom = new JSDOM(htmlBody);
    const document = dom.window.document;

    let results = document.querySelectorAll('a');
    let hrefs = []

    for (let i = 0; i < results.length; i++) {
        hrefs.push(results[i].href);
    }

    for (let i = 0; i < hrefs.length; i++) {
        // console.log("BEFORE: ", hrefs[i], baseUrl);
        if (!hrefs[i].includes(baseUrl) && !hrefs[i].includes("http")) {
            hrefs[i] = baseUrl + hrefs[i];
            // console.log("AFTER: ", hrefs[i], baseUrl);
        }
    }

    return hrefs;
}

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = {}) {
    if (!currentUrl.includes(baseUrl)) {
        return pages;
    }

    const normalizedUrl = normalizeURL(currentUrl);

    if (normalizedUrl in pages) {
        pages[normalizedUrl] += 1;
        return pages;
    }
        
    pages[normalizedUrl] = 1;

    let html = await getPageHtml(currentUrl);

    if (html === null) {
        return pages;
    }

    const urls = getURLsFromHtml(html, baseUrl);

    for (const url of urls) {
        pages = await crawlPage(baseUrl, url, pages);
    }

    return pages;
}

async function getPageHtml(url) {
    try {
        const response = await fetch(url);
        const status = response.status;

        if (status >= 400) {
            throw new Error(`ERROR: ${status} ${url}`)
        }

        const contentType = response.headers.get("content-type");

        if (!contentType.includes('text/html')) {
            throw new Error(`Content type received was not of type: 'text/html'`);
        }

        const html = response.text();
        
        return html;
    } catch (error) {
        return null;
    }
}

export {normalizeURL, getURLsFromHtml, crawlPage};