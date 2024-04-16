import { create } from 'zustand'

export type modelType = 'karelia' | 'shipovnik' | 'tree'
export type StateType = {
  model: modelType
  modelLoaded: boolean
  permissionGranted: boolean
  setModelLoaded: (modelLoaded: boolean) => void
  setPermissionGranted: (permissionGranted: boolean) => void
}

const modelOptions: modelType[] = ['karelia', 'shipovnik', 'tree']

const useStore = create<StateType>(set => ({
  model: modelOptions[Math.ceil(Math.random() * modelOptions.length) - 1],
  // model: 'tree',
  modelLoaded: false,
  permissionGranted: false,
  setModelLoaded: (modelLoaded: boolean) => set({ modelLoaded }),
  setPermissionGranted: (permissionGranted: boolean) => set({ permissionGranted }),
}))


export default useStore
