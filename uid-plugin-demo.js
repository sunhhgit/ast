module.exports = function (babel) {
  return {
    visitor: {
      VariableDeclaration(path, state) {
        path.node.declarations.forEach(declaration => {
          path.scope.rename(
            declaration.id.name,
            path.scope.generateUidIdentifier("uid").name
          )
        })
      }
    }
  }
}
