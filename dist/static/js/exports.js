let foo = {x: 1};
setTimeout(() => {
  foo.x = 2;
}, 500);
console.log('exports')
module.exports = {
  foo: foo,
};