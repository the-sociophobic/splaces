import { Scene } from './units/Scene'
import RequireSensorPermisson from './components/RequireSensorPermisson'

import './assets/sass/index.sass'
import Loader from './components/Loader'


function App() {

  return (
    <div className='App'>
      <Loader />
      <RequireSensorPermisson />
      <Scene />
    </div>
  )
}


export default App
