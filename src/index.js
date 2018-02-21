import _ from 'lodash';

const gendiff = (file1, file2) => {
  const obj1 = JSON.parse(file1);
  const obj2 = JSON.parse(file2);
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  const result = keys.map((e) => {
    if (obj1[e] === obj2[e]) {
      return `  ${e}: ${obj1[e]}`;
    } else if (obj1[e] && obj2[e]) {
      return `- ${e}: ${obj1[e]}\n+ ${e}: ${obj2[e]}`;
    } else if (obj1[e]) {
      return `- ${e}: ${obj1[e]}`;
    } else if (obj2[e]) {
      return `+ ${e}: ${obj2[e]}`;
    }
    return { e };
  }).join('\n');
  /* const result = `${keys2.reduce(
    (acc, e) => (!(obj1[e]) ? `${acc}\t+ ${e}: ${obj2[e]}\n` : acc)
    , keys1.reduce((acc, e) => {
      if (obj1[e] === obj2[e]) {
        return `${acc}\t  ${e}: ${obj1[e]}\n`;
      } else if (obj2[e]) {
        return `${acc}\t- ${e}: ${obj1[e]}\n\t+ ${e}: ${obj2[e]}\n`;
      }
      return `${acc}\t- ${e}: ${obj1[e]}\n`;
    }, '{\n'),
  )
}}`; */
  return `{\n${result}\n}`;
};
export default gendiff;
