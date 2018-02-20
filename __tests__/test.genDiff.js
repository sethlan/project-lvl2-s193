import fs from 'fs';
import gendiff from '../src';

test('gendiff', () => {
  expect(gendiff(
    fs.readFileSync('__tests__/__fixtures__/before.json'),
    fs.readFileSync('__tests__/__fixtures__/after.json'),
  ))
    .toBe('{\n\t  host: hexlet.io\n\t- timeout: 50\n\t+ timeout: 20\n\t- proxy: 123.234.53.22\n\t+ verbose: true\n}');
});
