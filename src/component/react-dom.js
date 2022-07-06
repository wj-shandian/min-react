import { TAG_ROOT } from "./constants";
import { scheduleRoot } from "./schedule";
/**
 *
 * render是要把一个元素渲染到一个容器内部
 * @param {*} element 渲染元素
 * @param {*} container // 容器节点
 */
function render(element, container) {
  let rootFiber = {
    tag: TAG_ROOT, // 每个fiber都会有一个tag标识此元素的类型
    stateNode: container, // 一般情况下 如果这个元素是一个原生节点的话，stateNode指向真实的DOM元素
    props: {
      children: [element],
      // props.children 是一个数组 里面放的是React元素 虚拟DOM 后面会根据每个React元素创建 对应的fiber元素
      //
    },
  };
  scheduleRoot(rootFiber);
}

const ReactDOM = {
  render,
};

export default ReactDOM;
