const babel = require('@babel/core')

const code = `
   const square = x => x ** 2;
   const sum = x => x + 2;
   const value = 5 |> square |> sum;
`

// const ast = babel.parse(code, {
//   sourceType: 'module'
// })
//
// console.log('ast=>', ast)
// 运⾏上⾯的代码会直接报错，源码（第 5 ⾏）使⽤的管道操作符处于提案中
// SyntaxError: unknown: Support for the experimental syntax 'pipelineOperator' isn't currently enabled (4:20):

/**
 * 需要借助插件来解析：@babel/parser 模块 + 内联配置（记得安装 @babel/plugin-proposal-pipeline-operator）解析
 * 引入@babel/core 模块 + ⽂件 babel.config.json 解析（babel 会自动到项目目录查找最近的babel 配置⽂件 ）
 * const value = 5 |> square |> sum; 应写成 const value = 5 |> square(^^) |> sum(^^) 其中 ^^ 是占位用
 * 1、先执⾏完所有 plugins，再执⾏ presets。
 *    描述：@babel/preset-env 是一个智能预设，允许您使用最新的 JavaScript，而无需微观管理目标环境需要哪些语法转换（以及可选的浏览器 polyfill）
 * 2、多个 plugins，按照声明次序顺序执⾏。
 * 3、多个 presets，按照声明次序逆序执⾏。
 */

const code1 = `
   const square = x => x ** 2;
   const sum = x => x + 2;
   const value = 5 |> square(^^) |> sum(^^);
`

console.log('ast1 code=>', babel.transform(code1).code)

// 不添加 "presets": ["@babel/preset-env"] 的打印结果如下：
// const square = x => x ** 2;
// const sum = x => x + 2;
// const value = sum(square(5));

// 添加 "presets": ["@babel/preset-env"] 的打印结果如下：
// "use strict";
// var square = function square(x) {
//   return Math.pow(x, 2);
// };
// var sum = function sum(x) {
//   return x + 2;
// };
// var value = sum(square(5));

// 添加 自定义插件 ["./uid-plugin-demo"] 打印结果如下：
// "use strict";
// var _uid = function _uid(x) {
//   return Math.pow(x, 2);
// };
// var _uid2 = function _uid2(x) {
//   return x + 2;
// };
// var _uid3 = _uid2(_uid(5));



// const ast1 = babel.parse(code1, {
//   sourceType: 'module',
//   plugins: [
//     // @babel/core 模块 + ⽂件 babel.config.json 解析（babel 会⾃动到项⽬⽬录查找最近的babel 配置⽂件 ）
//     // 直接写 pipelineOperator 会报错 Cannot find module 'babel-plugin-pipelineOperator' 所以写全 @babel/plugin-proposal-pipeline-operator
//     // const value = 5 |> square |> sum; 应写成 const value = 5 |> square(^^) |> sum(^^) 其中 ^^ 是占位用
//     ["@babel/plugin-proposal-pipeline-operator", {
//       "proposal": "hack",
//       "topicToken": "^^"
//     }]
//   ]
// })

// console.log('ast1=>', ast1.program.body, JSON.stringify(ast1.program.body))
// console.log('ast1 code=>', babel.transformFromAstSync(ast1).code)


