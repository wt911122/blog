import React ,{ useState } from 'react';
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import SectionPage from '../components/section';

import 'gitment/style/default.css'
import Gitment from 'gitment';

class IndexPage extends React.Component{
  componentDidMount() {
    const gitment = new Gitment({
      // id: 'Your page ID', // optional
      owner: 'wt911122',
      repo: 'blog',
      oauth: {
        client_id: '452663934@qq.com',
        client_secret: 'zbj650519',
      },
      // ...
      // For more available options, check out the documentation below
    });
    gitment.render('comments')
  }
  render(){
    const edges = this.props.data.allMarkdownRemark.edges;

    return (
      <Layout>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        {edges.map(edge => {
          return(
            <SectionPage key={edge.node.id} edge={edge}/>
            )
        })}
      </Layout>
    )
  }
}
// const IndexPage = ({ data }) => {
//     const edges = data.allMarkdownRemark.edges;

//     return (
//       <Layout>
//         <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
//         {edges.map(edge => {
//           return(
//             <SectionPage key={edge.node.id} edge={edge}/>
//             )
//         })}
//       </Layout>
//     )
//   }

export default IndexPage

export const pageQuery = graphql`
  query{
    allMarkdownRemark(
      sort: {
        fields: [frontmatter___date]
        order: DESC
      }
    ){
      totalCount
      pageInfo{
        hasNextPage
      }
      edges{
        node{
          id
          frontmatter{
            title
            date
            author
            path
          }
          excerpt
        }

      }
    }
  }
`