import { Scene } from './units/Scene'
import RequireSensorPermisson from './components/RequireSensorPermisson'

import './assets/sass/index.sass'


function App() {

  return (
    <div className='App'>
      <RequireSensorPermisson />
      <Scene />
    </div>
  )
}


export default App
