import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"


const IndexPage = ({ data }) => {
    const edges = data.allMarkdownRemark.edges;
    return (
      <Layout>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        {edges.map(edge => {
          return(
            <section className="brick" style={{padding: '10px 20px'}}>
              <div style={{
                fontSize: '.8em',
                fontFamily: 'Arial, sans-serif',
                color: '#7a7a8c',
                textAlign: 'left'
              }}>{new Intl.DateTimeFormat('zh-cn', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(edge.node.frontmatter.date))}</div>
              <h1 style={{
                margin: '.4em 0 1em',
                fontFamily: 'Rubik,Lato,"Lucida Grande","Lucida Sans Unicode",Tahoma,Sans-Serif'
              }}>{edge.node.frontmatter.title}</h1>
              <p style={{
                fontFamily: 'Microsoft Yahei,Tahoma,Helvetica,Arial,sans-serif'
              }}>{edge.node.excerpt}</p>
            </section>)
        })}
      </Layout>
    )
  }

export default IndexPage

export const pageQuery = graphql`
  query{
    allMarkdownRemark{
      totalCount
      edges{
        node{
          frontmatter{
            title
            date
            author
          }
          excerpt
        }

      }
    }
  }
`