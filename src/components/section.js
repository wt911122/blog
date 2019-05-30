import React, {useState} from "react"
import { Link } from "gatsby";

export default ({ edge }) => {
    return (
        <section className='brick' style={{padding: '10px 20px'}} onClick={() => {  }}>
            <div style={{
                fontSize: '.8em',
                fontFamily: 'Arial, sans-serif',
                color: '#7a7a8c',
                textAlign: 'left'
            }}>{new Intl.DateTimeFormat('zh-cn', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(edge.node.frontmatter.date))}</div>
            <h1 style={{
                margin: '.4em 0 1em',
                fontFamily: 'Rubik,Lato,"Lucida Grande","Lucida Sans Unicode",Tahoma,Sans-Serif'
            }}><Link to={edge.node.frontmatter.path}>{edge.node.frontmatter.title}</Link></h1>
            <p style={{
                fontFamily: 'Microsoft Yahei,Tahoma,Helvetica,Arial,sans-serif'
            }}>{edge.node.excerpt}</p>
        </section>
    )
}