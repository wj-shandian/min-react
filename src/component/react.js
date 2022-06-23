import { ELEMENT_TEXT } from "./constants";

/**
 *
 * 创建元素的方法 （创建虚拟dom的方法）
 * @param {*} type 元素类型 div span p
 * @param {*} config 配置对象 属性key ref
 * @param {*} children 所有的儿子 这是会做成一个数组
 */
function createElement(type, config, ...children) {
  delete config.__self;
  delete config.__source; // 表示这个元素是在哪行那列哪个文件生成的 一般用不到

  return {
    type,
    props: {
      ...config,
      children: children.map((child) => {
        // 如果是React元素的话 直接返回，如果是文本类型，如果是一个字符串 返回一个组装的元素对象
        return typeof child === "object"
          ? child
          : {
              type: ELEMENT_TEXT,
              props: { text: child, children: [] },
            };
      }),
    },
  };
}

const React = {
  createElement,
};

export default React;
