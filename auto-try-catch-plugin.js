module.exports = function ({ types: t, template }) {
  return {
    name: 'auto-try-catch-plugin',
    visitor: {
      AwaitExpression(path) {
        const shouldSkip = path.findParent(p => p.isTryStatement())
        if (!shouldSkip) {
          const blockStatement = path.findParent(p => p.isBlockStatement())
          if (blockStatement) {
            // 方法一
            // blockStatement.replaceWith(
            //   t.blockStatement([
            //     t.tryStatement(
            //       blockStatement.node,
            //       t.catchClause(
            //         t.identifier('err'),
            //         t.blockStatement([
            //           t.expressionStatement(
            //             t.callExpression(
            //               t.memberExpression(
            //                 t.identifier('console'),
            //                 t.identifier('err')
            //               ),
            //               [t.identifier('err')]
            //             )
            //           )
            //         ])
            //       )
            //     )
            //   ])
            // )

            // 方法二 用ast模板
            blockStatement.replaceWith(
              t.blockStatement([
                template.ast(`
                  try ${blockStatement.toString()}
                  catch (err) {
                    console.error(err);
                  }
                `)
              ])
            )
          }
        }
      }
    }
  }
}
