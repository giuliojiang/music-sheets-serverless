const fs = require('fs');
const path = require('path');

const dirContents = fs.readdirSync('./sheets');
const result = [];

function exploreDir(dirName) {
    const files = fs.readdirSync(path.resolve('./sheets', dirName));
    const images = [];
    for (const fileName of files) {
        if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
            images.push(fileName);
        }
    }
    images.sort();
    if (images.length > 0) {
        result.push({
            name: dirName,
            files: images
        });
    }
}

for (const dirName of dirContents) {
    exploreDir(dirName);
}

fs.writeFileSync('./list.json', JSON.stringify(result, null, 2));