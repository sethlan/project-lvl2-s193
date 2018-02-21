import fs from 'fs';
import gendiff from '../src';

test('gendiff', () => {
  expect(`${gendiff(
    fs.readFileSync('__tests__/__fixtures__/before.json'),
    fs.readFileSync('__tests__/__fixtures__/after.json'),
  )}\n`)
    .toBe(fs.readFileSync('__tests__/__fixtures__/result').toString('utf-8'));
});
