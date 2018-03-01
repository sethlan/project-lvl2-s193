const plainRender = (ast, level = '') => {
  const result = ast.map((element) => {
    const complex = value => (value instanceof Object ? 'complex value' : value);
    const name = `${level === '' ? '' : `${level}.`}${element.name}`;
    switch (element.type) {
      case 'nested': return `${plainRender(element.children, name)}`;
      case 'not changed': return '';
      case 'changed': return `Property ${name} was updated. From ${complex(element.oldValue)} to ${complex(element.newValue)}`;
      case 'deleted': return `Property ${name} was removed`;
      case 'inserted': return `Property ${name} was added with value: ${complex(element.value)}`;
      default: return '';
    }
  });
  return result.join('\n');
};
export default plainRender;
