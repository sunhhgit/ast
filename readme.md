## AST 简介 

#### 抽象语法树（abstract syntax trees），就是将代码转换成的⼀种抽象的树形结构，通常是 json 描述。
#### AST 并不是哪个编程语⾔特有的概念，在前端领域，⽐较常⽤的 AST ⼯具如 [esprima](https://esprima.org/index.html) , [babel](https://babeljs.io/docs/en/) ([babylon](https://www.npmjs.com/package/babylon)) 的解析模块，其他如 vue ⾃⼰实现的模板解析器。
#### 本⽂主要以 babel 为例对 AST 的原理进⾏浅 析，通过实践掌握如何利⽤ AST 掌握代码转换的能⼒。
* 推荐⼯具： AST 在线学习和 tokens 在线分析。
* 插件集合（注意，前端 AST 并不仅针对 JavaScript，CSS、HTML ⼀样具有相应的解析⼯具，JavaScript 重点 关注）

## 代码的编译流程

#### 我们把上述过程分为三部分：解析（parse），转换（transform），⽣成（generate），其中 scanner 部分叫 做词法（syntax）分析，parser 部分叫做语法（grammar）分析。
#### 显然，词法分析的结果是 tokens，语法分析得到 的就是 AST。

```js
const esprima = require('esprima');
const code = 'const number = 10';
const token = esprima.tokenize(code);
console.log(token);
 // 打印结果： 
 // [ 
 //   { type: 'Keyword', value: 'const' },
 //   { type: 'Identifier', value: 'number' },
 //   { type: 'Punctuator', value: '=' },
 //   { type: 'Numeric', value: '10' }
 // ]
```

### 可⻅词法分析，旨在将源代码按照⼀定的分隔符（空格/tab/换⾏等）、注释进⾏分割，并将各个 部分进⾏分类构造出⼀段 token 流。

```js
 const esprima = require('esprima');
 const code = 'const number = 10'; 4 const token = esprima.tokenize(code);
 const ast = esprima.parse(code);
 console.log(JSON.stringify(ast, null, ' '));
 // 打印 AST：
 // {
 //   "type": "Program",
 //   "body": [{
 //     "type": "VariableDeclaration",
 //     "declarations": [{
 //       "type": "VariableDeclarator",
 //       "id": {
 //         "type": "Identifier",
 //         "name": "number",
//        },
 //       "init": {
 //         "type": "Literal",
 //         "value": 10,
 //         "raw": "10",
 //       },
 //     }],
 //    "kind": "const"
 //   }],
 //   "sourceType": "script"
 // }
```

### ⽽语法分析，则基于 tokens 将源码语义化、结构化为⼀段 json 描述（AST）。反之，如果给出 ⼀段代码的描述信息，我们也是可以还原源码的。
### 理论上，描述信息发⽣变化，⽣成的源码的对应信 息也会发⽣变化。所以我们可以通过操作 AST 达到修改源码信息的⽬的，辅以⽂件的创建接⼝，这也 是 babel 打包⽣成代码的基本原理。
### 了解到这⼀层，便能想象 ES6 => ES5、ts => js、uglifyJS、样式预处理器、eslint、代码提示等⼯具的⼯作⽅式了。

## AST 的节点类型

### 在操作 AST 过程中，源码部分集中在 Program 对象的 body 属性下，每个节点有着统⼀固定的格 式：
* @babel/core 依赖了 parser、traverse、generator 模块，所以安装 @babel/core 即可。下⽂均以 babel 作为⽰例⼯具，其他⼯具类似，不再赘述。
