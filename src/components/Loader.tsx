import { FC } from 'react'

import useStore from '../hooks/useStore'


const Loader: FC = () => {
  const modelLoaded = useStore(state => state.modelLoaded)

  return (
    <div className={`Loader ${modelLoaded && 'Loader--hidden'}`}>
      <div className='Loader__progress'>
        <div className='Loader__text'>
          Loading...
        </div>
        <div className='Loader__progress__bar' />
      </div>
    </div>
  )
}


export default Loader
