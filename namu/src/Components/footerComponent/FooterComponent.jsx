import React from 'react'
import "./Footer.css"


function FooterComoponent() {
  return (
   <div className='footer2-maincontainer'>
      <div className="footer2-leftside">
        {/* <span className='footer2-righttext'>충청남도 홍성군 홍북읍 첨단산단3길 122  ·  041-633-0340  ·   info@dytw.kr  ·  fax 041-633-0350  · www.adas.kr</span> */}
        <span className="footer2-address">충청남도 홍성군 홍북읍 첨단산단3 길122 &nbsp;·&nbsp; 041-633-0340 &nbsp; ·&nbsp;</span>
        <span className="footer2-contact"> info@dytw.kr &nbsp;· &nbsp;fax 041-633-0350  &nbsp;· &nbsp;<a href="http://adas.kr/" target="_blank" rel="noopener noreferrer">www.adas.kr</a></span>
        

      </div>

      <div className="footer2-rightside">
        <span className='footer2-lefttext'>&copy;ADAS ALL RIGHTS RESERVED</span>
      </div>
    </div>
  )
}

export default FooterComoponent