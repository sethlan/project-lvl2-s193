import fs from 'fs';
import gendiff from '../src';

test('gendiff for JSON', () => {
  expect(`${gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')}\n`)
    .toBe(fs.readFileSync('__tests__/__fixtures__/result', 'utf-8'));
});
test('gendiff for YAML', () => {
  expect(`${gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml')}\n`)
    .toBe(fs.readFileSync('__tests__/__fixtures__/result2', 'utf-8'));
});
test('gendiff for INI', () => {
  expect(`${gendiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini')}\n`)
    .toBe(fs.readFileSync('__tests__/__fixtures__/result3', 'utf-8'));
});
test('gendiff for recursive JSON', () => {
  expect(`${gendiff('__tests__/__fixtures__/beforeComp.json', '__tests__/__fixtures__/afterComp.json')}\n`)
    .toBe(fs.readFileSync('__tests__/__fixtures__/result4', 'utf-8'));
});
test('gendiff for recursive YAML', () => {
  expect(`${gendiff('__tests__/__fixtures__/beforeComp.yml', '__tests__/__fixtures__/afterComp.yml')}\n`)
    .toBe(fs.readFileSync('__tests__/__fixtures__/result5', 'utf-8'));
});
test('gendiff for recursive INI', () => {
  expect(`${gendiff('__tests__/__fixtures__/beforeComp.ini', '__tests__/__fixtures__/afterComp.ini')}\n`)
    .toBe(fs.readFileSync('__tests__/__fixtures__/result6', 'utf-8'));
});
test('gendiff for recursive JSON new format', () => {
  expect(`${gendiff('__tests__/__fixtures__/beforeComp.json', '__tests__/__fixtures__/afterComp.json', 'plain')}\n`)
    .toBe(fs.readFileSync('__tests__/__fixtures__/result7', 'utf-8'));
});
