import { useState } from 'react'
import SensorComponent from './Components/sensorCompoonent/sensorComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SensorComponent/>
      <SensorComponent/>
    </>
  )
}

export default App
