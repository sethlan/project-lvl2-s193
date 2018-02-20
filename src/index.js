// import _ from 'lodash';

const gendiff = (json1, json2) => {
  const obj1 = JSON.parse(json1);
  const obj2 = JSON.parse(json2);
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  // const result = _.differenceBy(obj1, obj2, keys);
  const result = `${keys2.reduce(
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
  }}`;
  return result;
};
export default gendiff;
