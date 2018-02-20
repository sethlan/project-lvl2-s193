#!/usr/bin/env node
import program from 'commander';
import fs from 'fs';
import { version } from '../../package.json';
import gendiff from '..';

let json1;
let json2;
program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    json1 = firstConfig;
    json2 = secondConfig;
  })
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
const diff = gendiff(fs.readFileSync(json1), fs.readFileSync(json2));
console.log(diff);
