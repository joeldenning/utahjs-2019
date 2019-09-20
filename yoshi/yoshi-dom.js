import { finishedRender } from "./yoshi";

// "ReactDOM"
const YoshiDOM = {
  render(reactElement, container) {
    reconcile(reactElement, container, 0)
  }
}

export let rerender

function reconcile(reactElement, container, index) {
  if (typeof reactElement === 'boolean' || reactElement === null || reactElement === undefined) {
    if (container.childNodes[index]) {
      container.removeChild(container.childNodes[index])
    }
    return
  }

  rerender = () => reconcile(reactElement, container, index)

  const props = reactElement.props || []
  const children = reactElement.children || []

  if (isComponent(reactElement)) {
    // A React component
    const Component = reactElement.type
    reconcile(Component(props), container, 0)
    finishedRender()
  } else if (isText(reactElement)) {
    // A string, number, etc
    const existingTextNode = container.childNodes[index] && container.childNodes[index].nodeName === '#text'
    if (existingTextNode) {
      container.childNodes[index].textContent = reactElement
    } else {
      insertNode(container, document.createTextNode(reactElement), index)
    }
  } else {
    // A div, button, etc
    const isUpdate = isSameType(reactElement, container, index)

    const domElement = isUpdate ? container.childNodes[index] : document.createElement(reactElement.type)
    Object.assign(domElement, props)

    children.forEach((child, i) => {
      reconcile(child, domElement, i)
    })

    if (!isUpdate) {
      insertNode(container, domElement, index)
    }

    removeNodes(domElement, children.length)
  }
}

function removeNodes(container, index) {
  for (let i = index; i < container.childNodes.length; i++) {
    container.removeChild(container.childNodes[i])
  }
}

function insertNode(container, node, index) {
  if (index < container.childNodes.length) {
    container.replaceChild(node, container.childNodes[index])
  } else {
    container.appendChild(node)
  }
}

function isText(reactElement) {
  return typeof reactElement !== 'function' && typeof reactElement !== 'object'
}

function isComponent(reactElement) {
  return typeof reactElement.type === 'function'
}

function isSameType(reactElement, container, index) {
  return index < container.childNodes.length && container.childNodes[index].nodeName.toLowerCase() === reactElement.type
}

export default YoshiDOM