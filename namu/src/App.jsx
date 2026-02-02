import { useState } from 'react'
import SensorComponent from './Components/sensorCompoonent/sensorComponent'
import SensorPage from './pages/SensorPage/SensorPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout/AppLayout'

import GraphComponent from './Components/graphComponent/GraphComponent'

function App() {
 

  return (
   <BrowserRouter>
      <Routes>
        {/* Layout route */}
        <Route element={<AppLayout />}>
          {/* Child routes render inside <Outlet /> */}
          <Route path="/" element={<SensorPage />} />
          <Route path="/graph" element={<GraphComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
