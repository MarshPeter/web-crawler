import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

async function main() {
    process.argv.forEach((val, idx) => {
        console.log(val);
    })

    if (process.argv.length < 3 || process.argv.length > 3) {
        console.log("YOU MUST USE THIS PROGRAM IN THE FORM: npm run start <BASE_URL>");
        process.exit(1);
    }

    const url = process.argv[2];

    const results = await crawlPage(url);

    printReport(results);
}

main();