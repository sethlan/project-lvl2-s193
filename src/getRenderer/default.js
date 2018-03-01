const defaultRender = (ast, level = 1) => {
  const result = ast.map((element) => {
    const complex = value => (value instanceof Object ? JSON.stringify(value) : value);
    switch (element.type) {
      case 'nested': return `${'\t'.repeat(level)}  ${element.name}: ${defaultRender(element.children, level + 1)}`;
      case 'not changed': return `${'\t'.repeat(level)}  ${element.name}: ${complex(element.value)}`;
      case 'changed': return `${'\t'.repeat(level)}- ${element.name}: ${complex(element.oldValue)}\n${'\t'.repeat(level)}+ ${element.name}: ${complex(element.newValue)}`;
      case 'deleted': return `${'\t'.repeat(level)}- ${element.name}: ${complex(element.value)}`;
      case 'inserted': return `${'\t'.repeat(level)}+ ${element.name}: ${complex(element.value)}`;
      default: return '';
    }
  });
  return `{\n${result.join('\n')}\n${'\t'.repeat(level - 1)}}`;
};
export default defaultRender;
