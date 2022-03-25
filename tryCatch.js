const babel = require('@babel/core')

const code = `
async function Async1() {
  await fetch();
}
async function Async2() {
  const { data } = await fetch();
  return data;
}

const Async3 = async function () {
  const { code } = await fetch();
  return code;
}
`

console.log(babel.transform(code).code);

// 不添加 "presets": ["@babel/preset-env"]; 添加 自定义插件 ["./auto-try-catch-plugin"] 打印结果如下：

// async function Async1() {
//   try {
//     await fetch();
//   } catch (err) {
//     console.err(err);
//   }
// }
//
// async function Async2() {
//   try {
//     const {
//       data
//     } = await fetch();
//     return data;
//   } catch (err) {
//     console.err(err);
//   }
// }
//
// const _uid3 = async function () {
//   try {
//     const {
//       code
//     } = await fetch();
//     return code;
//   } catch (err) {
//     console.err(err);
//   }
// };
