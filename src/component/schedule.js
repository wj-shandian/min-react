/**
 * 从根结点开始渲染和调度
 * 两个阶段
 * diff阶段 对比新旧的虚拟DOM 进行增量 更新或者创建 （render阶段）
 * diff阶段比较花费时间，我们可以对任务进行拆分，拆分的维度就是一个虚拟dom  此阶段可以暂停
 * render阶段的成果是 effect list 知道了哪些节点更新了 哪些节点增加了 哪些节点删除了
 * render阶段不是把虚拟dom渲染成真实dom  render阶段有两个任务 1根据虚拟DOM生成fiber树 2 收集effectList
 * commit 阶段 进行DOM更新创建阶段 此阶段不能暂停 需要一次完成
 */

import {
  TAG_ROOT,
  PLACEMENT,
  ELEMENT_TEXT,
  TAG_HOST,
  TAG_TEXT,
} from "./constants";
import { setProps } from "./utils";

let nextUnitOfWork = null; // 下一个工作单元
let workLoopInProgressRoot = null; // RootFiber 应用的根  用来指向fiberroot
export function scheduleRoot(rootFiber) {
  workLoopInProgressRoot = rootFiber;
  nextUnitOfWork = rootFiber;
}

function performUnitOfWork(currentFiber) {
  beginWork(currentFiber); // 开始工作

  if (currentFiber.child) {
    return currentFiber.child;
  }

  while (currentFiber) {
    completeUnitOfWork(currentFiber); // 没有儿子让自己完成
    if (currentFiber.sibling) {
      // 看看有没有兄弟
      return currentFiber.sibling; // 有兄弟返回兄弟
    }
    currentFiber = currentFiber.return; // 找父亲 让父亲完成
  }
}

//  在完成的时候要收集有副作用是fiber 然后组成effect list
// 每个fiber有两个属性 firstEffect 指向第一个有副作用的子fiber lastEffect 指儿子的最后一个
// 中间的用nextEffect 做成一个单链表 firstEffect = 大儿子
function completeUnitOfWork(currentFiber) {
  let returnFiber = currentFiber.return;
  if (returnFiber) {
    // 把自己儿子的effect 链挂载到父亲身上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = currentFiber.firstEffect;
    }
    if (currentFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      }
      returnFiber.lastEffect = currentFiber.lastEffect;
    }
    // 把自己挂到父亲身上
    const effectTag = currentFiber.effectTag;
    if (effectTag) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber;
      } else {
        returnFiber.firstEffect = currentFiber;
      }
      returnFiber.lastEffect = currentFiber;
    }
  }
}

/**
 *
 * 1 创建真实dom
 * 2 创建子fiber
 */
function beginWork(currentFiber) {
  if (currentFiber.tag === TAG_ROOT) {
    updateHostRoot(currentFiber);
  } else if (currentFiber.tag === TAG_TEXT) {
    updateHostText(currentFiber);
  } else if (currentFiber.tag === TAG_HOST) {
    updateHost(currentFiber);
  }
}

function updateHost(currentFiber) {
  if (!currentFiber.stateNode) {
    // 如果此fiber没有创建don节点 那么就去创建dom节点
    currentFiber.stateNode = createDOM(currentFiber);
  }
  const newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber, newChildren);
}

function updateHostText(currentFiber) {
  if (!currentFiber.stateNode) {
    // 如果此fiber没有创建don节点 那么就去创建dom节点
    currentFiber.stateNode = createDOM(currentFiber);
  }
}

function createDOM(currentFiber) {
  if (currentFiber.tag === TAG_TEXT) {
    return document.createTextNode(currentFiber.props.text);
  } else if (currentFiber.tag === TAG_HOST) {
    // span  div  p
    let stateNode = document.createElement(currentFiber.type);
    // 处理属性
    updateDOM(stateNode, {}, currentFiber.props);
    return stateNode;
  }
}

function updateDOM(stateNode, oldProps, newProps) {
  setProps(stateNode, oldProps, newProps);
}

function updateHostRoot(currentFiber) {
  // 先处理自己 如果是一个原生节点 创建真实 DOM 2 创建子fiber
  let newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber, newChildren);
}
// 协调子结点  newChildren就是虚拟dom  reconcileChildren就是把虚拟dom转成fiber
function reconcileChildren(currentFiber, newChildren) {
  let newChildIndex = 0; // 新子结点的索引
  let prevSibling; // 上一个新的子fiber

  // 遍历我们的子虚拟dom元素数组，为每个虚拟dom元素创建子fiber
  while (newChildIndex < newChildren.length) {
    let newChild = newChildren[newChildIndex]; // 取出虚拟DOM节点
    let tag;
    if (newChild.type === ELEMENT_TEXT) {
      tag = TAG_TEXT; // 这是一个文本节点
    } else if (typeof newChild.type === "string") {
      tag = TAG_HOST;
    }

    let newFiber = {
      tag, //TAG_HOST
      type: newChild.type, // div
      props: newChild.props,
      stateNode: null, // div还没有创建DOM元素
      return: currentFiber, //父Fiber return fiber
      effectTag: PLACEMENT, //副作用标识 render我们要会收集副作用 增加 删除 更新
      nextEffect: null, // effect list 也是一个单链表
    };

    if (newFiber) {
      if (newChildIndex === 0) {
        currentFiber.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
    }

    newChildIndex++;
  }
}

// 循环执行工作 nextUnitWork
function workLoop(deadline) {
  let shouldYield = false; // 是否要让出时间片 或者说是控制权
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); // 执行完一个任务
    shouldYield = deadline.timeRemaining() < 1; // 没有时间就要让出控制权
  }
  if (!nextUnitOfWork && workLoopInProgressRoot) {
    console.log("render阶段结束");
    commitRoot();
  }
  // 如果时间片到期后还有任务没有完成，就需要请求浏览器再次调度  没一帧都要执行一次 workLoop
  requestIdleCallback(workLoop, { timeout: 500 });
}

// react 告诉浏览器 我现在有任务 在空闲的时候处理 什么是空闲的时候  就是一帧先处理重要的事情 如果16.6ms还有剩余 那么执行这个函数
// react有一个优先的概念 expirationTime  暂时不涉及 后面再加
requestIdleCallback(workLoop, { timeout: 500 }); // 如果超时了 不论是否有时间都执行

function commitRoot() {
  let currentFiber = workLoopInProgressRoot.firstEffect;
  while (currentFiber) {
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }
  workLoopInProgressRoot = null;
}

function commitWork(currentFiber) {
  if (!currentFiber) return;
  let returnFiber = currentFiber.return;
  let returnDOM = returnFiber.stateNode;
  console.log(currentFiber.stateNode, "currentFiber.stateNode");
  if (currentFiber.effectTag === PLACEMENT) {
    returnDOM.appendChild(currentFiber.stateNode);
  }
  // currentFiber.effectTag = null;
}
