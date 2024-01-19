import { create } from 'zustand'


export type StateType = {
  modelLoaded: boolean
  permissionGranted: boolean
  setModelLoaded: (modelLoaded: boolean) => void
  setPermissionGranted: (permissionGranted: boolean) => void
}


const useStore = create<StateType>(set => ({
  modelLoaded: false,
  permissionGranted: false,
  setModelLoaded: (modelLoaded: boolean) => set({ modelLoaded }),
  setPermissionGranted: (permissionGranted: boolean) => set({ permissionGranted }),
}))


export default useStore
