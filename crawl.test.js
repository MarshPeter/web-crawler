import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHtml} from "./crawl";

test('https://blog.boot.dev/path/ becomes blog.boot.dev/path', () => {
    expect(normalizeURL("https://blog.boot.dev/path/")).toBe('blog.boot.dev/path')
});

test('https://blog.boot.dev/path becomes blog.boot.dev/path', () => {
    expect(normalizeURL("https://blog.boot.dev/path")).toBe('blog.boot.dev/path')
})

test('http://blog.boot.dev/path/ becomes blog.boot.dev/path', () => {
    expect(normalizeURL("http://blog.boot.dev/path/")).toBe('blog.boot.dev/path')
})

test('http://blog.boot.dev/path becomes blog.boot.dev/path', () => {
    expect(normalizeURL("http://blog.boot.dev/path")).toBe('blog.boot.dev/path')
})

test('Simple page with single anchor tag returns single url', () => {
    expect(getURLsFromHtml(
        `<body>
            <main>
                <a href="https://blog.boot.dev/path/">Click Here!</a>
            </main>
        </body>`, "https://blog.boot.dev"
    )).toStrictEqual(["https://blog.boot.dev/path/"])
})

test('Simple page with multiple anchor tags returns multiple url', () => {
    expect(getURLsFromHtml(
        `<body>
            <main>
                <a href="https://blog.boot.dev/path/">Click Here!</a>
                <a href="https://blog.boot.dev/path/">Click Here!</a>
                <a href="https://blog.boot.dev/path/">Click Here!</a>
            </main>
        </body>`, "https://blog.boot.dev"
    )).toStrictEqual(["https://blog.boot.dev/path/", "https://blog.boot.dev/path/", "https://blog.boot.dev/path/"])
})

test('Simple page with single relative anchor tag returns single url', () => {
    expect(getURLsFromHtml(
        `<body>
            <main>
                <a href="/path/">Click Here!</a>
            </main>
        </body>`, "https://blog.boot.dev"
    )).toStrictEqual(["https://blog.boot.dev/path/"])
})

test('Simple page with multiple anchor and some relative anchor tags returns multiple url', () => {
    expect(getURLsFromHtml(
        `<body>
            <main>
                <a href="https://blog.boot.dev/path/">Click Here!</a>
                <a href="https://blog.boot.dev/path/">Click Here!</a>
                <a href="/path/">Click Here!</a>
                <a href="https://blog.boot.dev/path/">Click Here!</a>
                <a href="/path/">Click Here!</a>
            </main>
        </body>`, "https://blog.boot.dev"
    )).toStrictEqual(["https://blog.boot.dev/path/", "https://blog.boot.dev/path/", "https://blog.boot.dev/path/", "https://blog.boot.dev/path/", "https://blog.boot.dev/path/"])
})

test('Simple page with empty anchor tag returns empty string', () => {
    expect(getURLsFromHtml(
        `<body>
            <main>
                <a href="/path/">Click Here!</a>
            </main>
        </body>`, "https://blog.boot.dev"
    )).toStrictEqual(["https://blog.boot.dev/path/"])
})