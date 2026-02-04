import React from 'react'
import "./HumiGraph.css"

import { useTheme } from "../../../providers/ThemeProvider/ThemeProvider"

function HumiGraph() {
  const { theme } = useTheme()
  return (
    <div className= {`temp-graph-main ${theme}`}>
      <div className="temp-grap-text">
        서비스 준비 중입니다.
      </div>
    </div>
  )
}

export default HumiGraph
