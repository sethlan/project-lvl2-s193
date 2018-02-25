import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

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
  // console.log(JSON.stringify(obj1), JSON.stringify(obj2));
  /* {
    "plugins":["jest"],
    "env":{"node":true},
    "parser":"babel-eslint",
    "extends":["airbnb-base",
    "plugin:jest/recommended"],
    "rules":{"no-console":0}} {"plugins":["jest","flowtype"],
    "env":{"jest":true},
    "parser":"babel-eslint",
    "extends":["airbnb-base","plugin:jest/recommended","plugin:flowtype/recommended"],
    "rules":{"no-console":0,"react/jsx-no-bind":0}
  } */
  const makeDiffAst = (before, after) => {
    const keys = _.union(_.keys(before), _.keys(after));
    const ast = keys.map((key) => {
      if ((before[key] instanceof Array) || (after[key] instanceof Array)) {
        return {
          name: key, difference: '', value: '', children: before[key],
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
    if (!astree) { return ''; }
    const result = astree.map((e) => {
      if (e.children !== '') {
        return `  ${e.name}: ${render(e.children)}`;
      }
      return `${e.difference} ${e.name}: ${e.value}`;
    });
    return `{\n${result.join('\n')}}`;
  };
  return render(ast);
};
export default gendiff;
