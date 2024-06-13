function printReport(pages) {
    console.log("STARTING REPORT");

    const sortedPages = Object.entries(pages).sort((a, b) => b[1] - a[1]); 

    for (const page of sortedPages) {
        console.log(`Found ${page[1]} internal links to ${page[0]}`);
    }

    console.log("ENDING REPORT");
}

export { printReport };
