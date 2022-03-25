const esprima = require('esprima')

const code = 'const a = 10'
const token = esprima.tokenize(code)
console.log('token=>', token)

const ast = esprima.parse(code)
console.log('parse=>', ast, ast.body[0].declarations)

