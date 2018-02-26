import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};
const gendiff = (path1, path2, format = 'default') => {
  const ext = path.extname(path1);
  const fileContent1 = fs.readFileSync(path1, 'utf-8');
  const fileContent2 = fs.readFileSync(path2, 'utf-8');
  const obj1 = parsers[ext](fileContent1);
  const obj2 = parsers[ext](fileContent2);
  const keyTypes = [{
    type: 'nested',
    check: (first, second, key) => (first[key] instanceof Object && second[key] instanceof Object)
    && !(first[key] instanceof Array && second[key] instanceof Array),
    process: (first, second, fun) => fun(first, second),
  },
  {
    type: 'not changed',
    check: (first, second, key) => (_.has(first, key) && _.has(second, key)
    && (first[key] === second[key])),
    process: first => _.identity(first),
  },
  {
    type: 'changed',
    check: (first, second, key) => (_.has(first, key) && _.has(second, key)
      && (first[key] !== second[key])),
    process: (first, second) => ({ old: first, new: second }),
  },
  {
    type: 'deleted',
    check: (first, second, key) => (_.has(first, key) && !_.has(second, key)),
    process: first => _.identity(first),
  },
  {
    type: 'inserted',
    check: (first, second, key) => (!_.has(first, key) && _.has(second, key)),
    process: (first, second) => _.identity(second),
  },
  ];
  const getAst = (firstConfig = {}, secondConfig = {}) => {
    const configsKeys = _.union(Object.keys(firstConfig), Object.keys(secondConfig));
    return configsKeys.map((key) => {
      const { type, process } = _.find(
        keyTypes,
        item => item.check(firstConfig, secondConfig, key),
      );
      const value = type !== 'nested' ? process(firstConfig[key], secondConfig[key], getAst) : '';
      const children = type === 'nested' ? process(firstConfig[key], secondConfig[key], getAst) : '';
      return {
        name: key, type, value, children,
      };
    });
  };
  const diffAst = getAst(obj1, obj2);
  const defaultRender = (ast, level = 1) => {
    const result = ast.map((element) => {
      const complex = value => (value instanceof Object ? JSON.stringify(value) : value);
      switch (element.type) {
        case 'nested': return `${'\t'.repeat(level)}  ${element.name}: ${defaultRender(element.children, level + 1)}`;
        case 'not changed': return `${'\t'.repeat(level)}  ${element.name}: ${complex(element.value)}`;
        case 'changed': return `${'\t'.repeat(level)}- ${element.name}: ${complex(element.value.old)}\n${'\t'.repeat(level)}+ ${element.name}: ${complex(element.value.new)}`;
        case 'deleted': return `${'\t'.repeat(level)}- ${element.name}: ${complex(element.value)}`;
        case 'inserted': return `${'\t'.repeat(level)}+ ${element.name}: ${complex(element.value)}`;
        default: return '';
      }
    });
    return `{\n${result.join('\n')}\n${'\t'.repeat(level - 1)}}`;
  };
  const plainRender = (ast, level = '') => {
    const result = ast.map((element) => {
      const complex = value => (value instanceof Object ? 'complex value' : value);
      const name = `${level === '' ? '' : `${level}.`}${element.name}`;
      switch (element.type) {
        case 'nested': return `${plainRender(element.children, name)}`;
        case 'not changed': return '';
        case 'changed': return `Property ${name} was updated. From ${complex(element.value.old)} to ${complex(element.value.new)}`;
        case 'deleted': return `Property ${name} was removed`;
        case 'inserted': return `Property ${name} was added with value: ${complex(element.value)}`;
        default: return '';
      }
    });
    return result.join('\n');
  };
  const formatTypes = {
    default: defaultRender,
    plain: plainRender,
    json: JSON.stringify,
  };
  return formatTypes[format](diffAst);
};
export default gendiff;
