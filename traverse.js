const babel = require('@babel/core')

const code = `
  import React from 'react';
  function add(a, b) {
    const decrease = () => {
      return c;
    }
    return a + b;
  }
  let str = 'hello';
`

const ast = babel.parse(code, {
  sourceType: 'module'
})

// console.log('ast=>', ast.program.body, CONSOLE_AST)

// 想在函数返回语句之前加⼊⼀⾏语句 console.log('函数执⾏完成！！！') ，最朴素的做法是方法一这样的：
// 终极简化版——模板 API
const CONSOLE_AST = babel.template.ast(`console.log('函数执行完成！！！')`)

/**
 * 方法一
 * 虽然⼿动操作 AST 满⾜了当前的需求，但是诸如箭头函数，类或对象的⽅法、没有 return 语句或省略 return 关键字的函数、
 * 表达式声明的函数、IIFE、语句内又嵌套的函数……上述⽅法都是没有考虑的，所以不推荐⼿动实现。
 */
function insertConsoleBeforeReturn(body) {
  body.forEach(node => {
    if (node.type === 'FunctionDeclaration') { // 函数关键字声明形式
      const blockStatementBody = node.body.body;
      if (blockStatementBody && blockStatementBody.length) {
        const index = blockStatementBody.findIndex(n => n.type === 'ReturnStatement');
        if (~index) {
          // 函数体存在语句且最后⼀条语句是 return (假设 return 就是最后的语句)
          blockStatementBody.splice(index, 0, CONSOLE_AST); // 直接修改 ast, 前插⼀个节 点
        }
      }
    }
  });
}
insertConsoleBeforeReturn(ast.program.body);

/**
 * 方法二
 * 处理 AST 的过程就是对不同节点类型遍历和操作的过程，为简化操作，babel 提供了专⻔ 的接⼝，我们只需要提供相应类型的处理⽅法（visitor）即可。
 * （好⼀点的是所有的 return 语句都会处理，即使是嵌套的函数）
 * traverse ⽅法帮我们处理了 ast 的遍历过程，对于不同节点的处理只需要维护⼀份 types 对应的⽅法即可。
 * 进 ⼀步的，构造 CONSOLE_AST 节点也有⼏种⽅式。先使⽤在线⼯具将 console.log('函数执⾏完成');
 */
// babel.traverse(ast, {
//   // 仅作示意，对省略 return 的箭头函数、没有显式 return 的函数没有处理，请知悉
//   ReturnStatement(path) {
//     path.insertBefore(CONSOLE_AST)
//     // console.log('path=>', path)
//   }
// })

console.log('last code=>', babel.transformFromAstSync(ast).code)

/**
 * 基础⽅式——使⽤ @babel/types 来构造语句
 * 第一步：确定 ExpressionStatement 的参数 https://babeljs.io/docs/en/babel-types#expressionstatement
 * 第二步：t.expressionStatement(expression);  构建函数调用表达式作为 expression; t.expressionStatement(t.callExpression(callee, arguments);)
 * 第三步：查找对应的 callExpression https://babeljs.io/docs/en/babel-types#callexpression MemberExpression, Literal
 */

const t = require('@babel/types')
const generate = require('@babel/generator').default
const consoleAst = t.expressionStatement(
  t.callExpression(
    t.memberExpression(
      t.identifier('console'),
      t.identifier('log')
    ),
    [t.stringLiteral('函数执⾏完成!!!')]
  )
)
console.log(JSON.stringify(consoleAst), '\n\n', generate(consoleAst).code);
