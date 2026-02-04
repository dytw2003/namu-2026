import React from 'react'
import "./TempGraph.css"

import { useTheme } from "../../../providers/ThemeProvider/ThemeProvider"

function TempGraph() {
  const { theme } = useTheme()
  return (
    <div className= {`temp-graph-main ${theme}`}>
      <div className="temp-grap-text">
        서비스 준비 중입니다.
      </div>
    </div>
  )
}

export default TempGraph
