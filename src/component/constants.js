// 定义一些常量的文件

// 表示这是一个文本元素
export const ELEMENT_TEXT = Symbol.for("ELEMENT_TEXT");

// React 应用需要一个根 Fiber
export const TAG_ROOT = Symbol.for("TAG_ROOT");
// 原生的节点 span  div  p  为了区分 函数组件 类节点
export const TAG_HOST = Symbol.for("TAG_HOST");
// 这是文本节点
export const TAG_TEXT = Symbol.for("TAG_TEXT");
// 插入节点
export const PLACEMENT = Symbol.for("PLACEMENT");
// 更新节点
export const UPDATE = Symbol.for("UPDATE");
// 删除节点
export const DELETION = Symbol.for("DELETION");
