import fs from 'fs';
import gendiff from '../src';

const pathJson1 = '__tests__/__fixtures__/before.json';
const pathJson2 = '__tests__/__fixtures__/after.json';
const pathYaml1 = '__tests__/__fixtures__/before.yml';
const pathYaml2 = '__tests__/__fixtures__/after.yml';
const pathIni1 = '__tests__/__fixtures__/before.ini';
const pathIni2 = '__tests__/__fixtures__/after.ini';
const resultJson = fs.readFileSync('__tests__/__fixtures__/result').toString('utf-8');
const resultYml = fs.readFileSync('__tests__/__fixtures__/result2').toString('utf-8');
const resultIni = fs.readFileSync('__tests__/__fixtures__/result3').toString('utf-8');
test('gendiff for JSON', () => {
  expect(`${gendiff(pathJson1, pathJson2)}\n`)
    .toBe(resultJson);
});
test('gendiff for YAML', () => {
  expect(`${gendiff(pathYaml1, pathYaml2)}\n`)
    .toBe(resultYml);
});
test('gendiff for INI', () => {
  expect(`${gendiff(pathIni1, pathIni2)}\n`)
    .toBe(resultIni);
});
