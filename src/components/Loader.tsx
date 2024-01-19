import { FC } from 'react'

import useStore from '../hooks/useStore'


const Loader: FC = () => {
  const modelLoaded = useStore(state => state.modelLoaded)

  return (
    <div className={`Loader ${modelLoaded && 'Loader--hidden'}`}>
      Загрузка...
    </div>
  )
}


export default Loader
