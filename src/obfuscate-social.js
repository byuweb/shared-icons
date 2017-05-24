"use strict";

const fsp = require('fs-extra-p');
const path = require('path');

if (process.argv.length < 3) {
    console.error('Usage is obfuscate-social.js [source dir] [dest dir]');
    process.exit(1);
}

let source = process.argv[2];
let dest = process.argv[3];

let srcPath = path.resolve(source);
let destPath = path.resolve(dest);


fsp.ensureDir(destPath)
    .then(() => {
        fsp.readdir(srcPath)
            .then(l => l.filter(f => f.endsWith('.svg')))
            .then(l => {
                let mapping = {};
                let promises = l.map(f => {
                    let parts = path.parse(f);

                    let newName = parts.name.substr(0, 2) + parts.ext;

                    mapping[f] = newName;

                    return fsp.copy(
                        path.join(srcPath, f),
                        path.join(destPath, newName));
                });

                return Promise.all(promises).then(() => mapping);
            }).then(map => fsp.writeJson(path.join(destPath, '_obfuscations.json'), map, {spaces: 2}));
    });
