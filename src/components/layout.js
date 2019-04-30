/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"
import "./responsive.css"

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            author
            github
            comp
          }
        }
      }
    `}
    render={data => (
      <>
        <Header siteTitle={ data.site.siteMetadata.title } siteDescription={data.site.siteMetadata.description}/>
        <div className="container" style={{

        }}>
          <aside className="sideblock">
            {/* profile */}
            <div className="brick">
              <img className="responsive-image" src="https://avatars1.githubusercontent.com/u/7549134?s=460&v=4"/>
              <div className="author-meta">{data.site.siteMetadata.author}</div>
              <dl>
                <li className="side-menu github-side">
                  <a href={data.site.siteMetadata.github}>{data.site.siteMetadata.github}</a>
                </li>
                <li className="side-menu comp-side">{data.site.siteMetadata.comp}</li>
              </dl>
            </div>
          </aside>
          <div className="maincontent">
            {children}
          </div>
        </div>

      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
