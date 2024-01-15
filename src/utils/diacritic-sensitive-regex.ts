function diacriticSensitiveRegex(string = '') {
  return string
    .toString()
    .toLowerCase()
    .replace(/[aA]/g, '[a,á,à,ä]')
    .replace(/[eE]/g, '[e,é,ë]')
    .replace(/[iI]/g, '[i,í,ï]')
    .replace(/[oO]/g, '[o,ó,ö,ò]')
    .replace(/[uU]/g, '[u,ü,ú,ù]');
}

export default diacriticSensitiveRegex;
