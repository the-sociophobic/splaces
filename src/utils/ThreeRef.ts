import { useEffect } from 'react'


class ThreeRef<T> {
  constructor(initialValue: T, initialListeners?: Function[]) {
    this.current = initialValue
    this.callbacks = initialListeners || []
  }
  current: T
  callbacks: Function[]
}

const createRef = <T>(value?: T | null): ThreeRef<T | null> => {
  if (value === undefined) {
    return new ThreeRef<T | null>(null)
  }
  return new ThreeRef<T | null>(value)
}

const subscribeThreeRef = <T>(ref: ThreeRef<T>, cb: Function) => {
  if (!ref.callbacks.includes(cb))
    ref.callbacks.push(cb)
}

const notifyThreeRef = <T>(ref: ThreeRef<T>, event: any = undefined) => {
  ref.callbacks
    .forEach(callback => callback(event))
}

const unsubscribeThreeRef = <T>(ref: ThreeRef<T>, callback: Function) => {
  ref.callbacks = ref.callbacks
    .filter(fn => fn !== callback)
}

const useSubscribeThreeRef = <T>(ref: ThreeRef<T>, callback: Function) => {
  useEffect(() => {
    subscribeThreeRef(ref, callback)

    return () => {
      unsubscribeThreeRef(ref, callback)
    }
  }, [callback])
}


export {
  ThreeRef,
  createRef,
  subscribeThreeRef,
  notifyThreeRef,
  unsubscribeThreeRef,
  useSubscribeThreeRef,
}
