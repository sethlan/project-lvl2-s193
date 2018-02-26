import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const tab = (times) => {
  let result = '';
  for (let i = 0; i < times; i += 1) {
    result += '\t';
  }
  return result;
};
const gendiff = (path1, path2) => {
  const adapter = {
    '.json': JSON.parse,
    '.yml': yaml.safeLoad,
    '.ini': ini.parse,
  };
  const ext = path.extname(path1);
  const fileContent1 = fs.readFileSync(path1, 'utf-8');
  const fileContent2 = fs.readFileSync(path2, 'utf-8');
  const obj1 = adapter[ext](fileContent1);
  const obj2 = adapter[ext](fileContent2);
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
      const value = process(firstConfig[key], secondConfig[key], getAst);
      return { name: key, type, value };
    });
  };
  const diffAst = getAst(obj1, obj2);
  // console.log(JSON.stringify(diffAst));
  // const renderTypes = [{
  //   type: 'nested',
  //   toString: (ast, fun) => fun(ast),
  // },
  // {
  //   type: 'not changed',
  //   toString: ast => (ast),
  // },
  // {
  //   type: 'changed',
  //   check: (first, second, key) => (_.has(first, key) && _.has(second, key)
  //     && (first[key] !== second[key])),
  //   process: (first, second) => ({ old: first, new: second }),
  // },
  // {
  //   type: 'deleted',
  //   check: (first, second, key) => (_.has(first, key) && !_.has(second, key)),
  //   process: first => _.identity(first),
  // },
  // {
  //   type: 'inserted',
  //   check: (first, second, key) => (!_.has(first, key) && _.has(second, key)),
  //   process: (first, second) => _.identity(second),
  // },
  // ];
  const render = (ast, level = 1) => {
    const result = ast.map((element) => {
      if (element.type === 'nested') { return `${tab(level)}  ${element.name}: ${render(element.value, level + 1)}`; }
      if (element.type === 'not changed') { return `${tab(level)}  ${element.name}: ${element.value}`; }
      if (element.type === 'changed') { return `${tab(level)}- ${element.name}: ${element.value.old}\n\t+ ${element.name}: ${element.value.new}`; }
      if (element.type === 'deleted') { return `${tab(level)}- ${element.name}: ${element.value}`; }
      if (element.type === 'inserted') { return `${tab(level)}+ ${element.name}: ${element.value}`; }
      return '';
    });
    return `{\n${result.join('\n')}\n${tab(level - 1)}}`;
  };
  return render(diffAst);
  /*
  const makeDiffAst = (before, after) => {
    const keys = _.union(_.keys(before), _.keys(after));
    const ast = keys.map((key) => {
      if ((before[key] instanceof Array) && (after[key] instanceof Array)) {
        const result = [];
        for (let count = 0; count < Math.max(before[key].length, after[key].length); count += 1) {
          if (after[key].includes(before[key][count])) {
            result.push({
              name: '', difference: '', value: before[key][count], children: '',
            });
          } else if (before[key][count]) {
            result.push({
              name: '', difference: '-', value: before[key][count], children: '',
            });
          } else if (after[key][count]) {
            result.push({
              name: '', difference: '+', value: after[key][count], children: '',
            });
          }
        }
        return {
          name: key, difference: '', value: '', children: result,
        };
      }
      if ((before[key] instanceof Object) && (after[key] instanceof Object)) {
        return {
          name: key, difference: '', value: '', children: makeDiffAst(before[key], after[key]),
        };
      } else if (before[key] instanceof Object) {
        return {
          name: key, difference: '', value: '', children: before[key],
        };
      } else if (after[key] instanceof Object) {
        return {
          name: key, difference: '', value: '', children: after[key],
        };
      }
      if (before[key] === after[key]) {
        return {
          name: key, difference: '', value: before[key], children: '',
        };
      } else if (before[key] && after[key]) {
        return [{
          name: key, difference: '-', value: before[key], children: '',
        }, {
          name: key, difference: '+', value: after[key], children: '',
        },
        ];
      } else if (before[key]) {
        return {
          name: key, difference: '-', value: before[key], children: '',
        };
      }
      return {
        name: key, difference: '+', value: after[key], children: '',
      };
    });
    return ast;
  };
  const ast = makeDiffAst(obj1, obj2);
  console.log(JSON.stringify(ast));
  const render = (astree) => {
    if (astree === undefined) { return ''; }
    console.log(astree);
    const result = astree.map((e) => {
      if (e instanceof Array) { return `\t  ${e.name}: ${render(e)}`; }
      if (e.children !== '') {
        return `  ${e.name}: ${render(e.children)}`;
      }
      if (e.name === '') { return `\t${e.difference} ${e.value}`; }
      return `${e.difference} ${e.name}: ${e.value}`;
    });
    return `{\n${result.join('\n')}}`;
  };
  return render(ast); */
};
export default gendiff;
