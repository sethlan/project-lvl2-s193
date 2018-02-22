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
  const file1 = fs.readFileSync(path1, 'utf-8');
  const file2 = fs.readFileSync(path2, 'utf-8');
  const obj1 = adapter[ext](file1);
  const obj2 = adapter[ext](file2);
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  const result = keys.map((e) => {
    if (obj1[e] === obj2[e]) {
      return `  ${e}: ${obj1[e]}`;
    } else if (obj1[e] && obj2[e]) {
      return [`- ${e}: ${obj1[e]}`, `+ ${e}: ${obj2[e]}`];
    } else if (obj1[e]) {
      return `- ${e}: ${obj1[e]}`;
    } else if (obj2[e]) {
      return `+ ${e}: ${obj2[e]}`;
    }
    return { e };
  });
  return `{\n${_.flatten(result).join('\n')}\n}`;
};
export default gendiff;
