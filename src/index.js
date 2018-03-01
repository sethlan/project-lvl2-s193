import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import { defaultRender, plainRender, jsonRender } from './getRenderer';

const renders = {
  default: defaultRender,
  plain: plainRender,
  json: jsonRender,
};
const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};
const keyTypes = [{
  type: 'nested',
  check: (first, second, key) => (first[key] instanceof Object && second[key] instanceof Object)
  && !(first[key] instanceof Array && second[key] instanceof Array),
  process: (first, second, fun) => ({ children: fun(first, second) }),
},
{
  type: 'not changed',
  check: (first, second, key) => (_.has(first, key) && _.has(second, key)
  && (first[key] === second[key])),
  process: first => ({ value: _.identity(first) }),
},
{
  type: 'changed',
  check: (first, second, key) => (_.has(first, key) && _.has(second, key)
    && (first[key] !== second[key])),
  process: (first, second) => ({ oldValue: first, newValue: second }),
},
{
  type: 'deleted',
  check: (first, second, key) => (_.has(first, key) && !_.has(second, key)),
  process: first => ({ value: _.identity(first) }),
},
{
  type: 'inserted',
  check: (first, second, key) => (!_.has(first, key) && _.has(second, key)),
  process: (first, second) => ({ value: _.identity(second) }),
},
];
const gendiff = (path1, path2, format = 'default') => {
  const ext = path.extname(path1);
  const fileContent1 = fs.readFileSync(path1, 'utf-8');
  const fileContent2 = fs.readFileSync(path2, 'utf-8');
  const obj1 = parsers[ext](fileContent1);
  const obj2 = parsers[ext](fileContent2);
  const getAst = (firstConfig = {}, secondConfig = {}) => {
    const configsKeys = _.union(Object.keys(firstConfig), Object.keys(secondConfig));
    return configsKeys.map((key) => {
      const { type, process } = _.find(
        keyTypes,
        item => item.check(firstConfig, secondConfig, key),
      );
      const value = process(firstConfig[key], secondConfig[key], getAst);
      return { name: key, type, ...value };
    });
  };
  const diffAst = getAst(obj1, obj2);
  return renders[format](diffAst);
};
export default gendiff;
