import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Blinkfont from './blinkfont';
const bg = require('../images/bg.png');


const Header = ({ siteTitle, siteDescription }) => (
  <header
    style={{
      background: `url(${bg}) 50% 30%/100% auto`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        padding: `1.45rem 1.0875rem`,
      }}
      className="container"
    >
      <div>
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              fontFamily: `Andale Mono, monospace`,
              color: `#000`,
              textDecoration: `none`,
              textShadow: '#FFF 1px 1px 10px, #FFF -1px -1px 10px'
            }}
          >

            <Blinkfont content={siteTitle} fontStyle={{fontSize: 36, fontFamily: `Andale Mono, monospace`}}></Blinkfont>
          </Link>
        </h1>
        <p style={{
          fontFamily: `Andale Mono, monospace`,
          marginBottom: 0,
          marginTop: 10,
          textShadow: '#FFF 1px 0 10px'
        }}>{siteDescription}</p>
        </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
