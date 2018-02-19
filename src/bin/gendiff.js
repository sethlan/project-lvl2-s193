#!/usr/bin/env node
import program from 'commander';

program
  .version('0.0.4')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .parse(process.argv);
