#!/usr/bin/env node
import program from 'commander';
// import fs from 'fs';
import { version } from '../../package.json';
import gendiff from '..';

let path1;
let path2;
program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    path1 = firstConfig || undefined;
    path2 = secondConfig || undefined;
  })
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
if (!(path1 === undefined || path2 === undefined)) {
  // const diff = gendiff(fs.readFileSync(path1), fs.readFileSync(path2));
  const diff = gendiff(path1, path2, program.format);
  console.log(diff);
}
