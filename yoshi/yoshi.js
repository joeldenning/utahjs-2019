import { rerender } from './yoshi-dom'

let stateIndex = 0, effectIndex = 0
let allState = [], allEffects = []

// "React"
const Yoshi = {
  createElement(type, props, ...children) {
    // The "mystical" virtual dom
    return {
      type,
      props,
      children,
    }
  },
  useState(initialValue) {
    const index = stateIndex++
    const rerenderThisComponent = rerender
    if (index >= allState.length) {
      // First render
      allState.push(initialValue)
    }

    const state = allState[index]
    const setState = value => {
      allState[index] = value
      rerenderThisComponent()
    }
    return [state, setState]
  },
  useEffect(fn, conditions) {
    const index = effectIndex++
    if (index >= allEffects.length) {
      // First render
      allEffects.push({fn, oldConditions: null, newConditions: conditions})
    } else {
      allEffects[index] = {fn, oldConditions: allEffects[index].newConditions, newConditions: conditions, cleanupFn: allEffects[index].cleanupFn}
    }
  }
}

export default Yoshi

export function finishedRender() {
  stateIndex = 0
  effectIndex = 0
  allEffects.forEach(effect => {
    if (conditionsChanged(effect)) {
      if (effect.cleanupFn) {
        effect.cleanupFn()
      }
      effect.cleanupFn = effect.fn()
    }
  })
}

function conditionsChanged(effect) {
  if (!effect.oldConditions || !effect.newConditions) {
    return true
  } else if (effect.oldConditions.length !== effect.newConditions.length) {
    return true
  } else {
    return effect.oldConditions.some((oldCondition, i) => {
      if (oldCondition !== effect.newConditions[i]) {
        return true
      } else {
        return false
      }
    })
  }
}