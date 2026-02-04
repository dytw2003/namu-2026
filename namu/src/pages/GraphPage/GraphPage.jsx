import React from 'react'

import SensorSelectionComponent from '../../Components/sensorSelectionComponent/SensorSelectionComponent'
import EcGraph from '../../Components/graphComponent/EcGraph/EcGraph'

function GraphPage() {
  return (
    <div className="graphpage-main-div">
      <div className="graphpage-sensor-selection">
        <SensorSelectionComponent />
      </div>

      <EcGraph />

    </div>
  )
}

export default GraphPage
