(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{150:function(e,t,a){"use strict";a.r(t);var n=a(7),r=a.n(n),i=a(0),o=a.n(i),c=a(151),s=a(156),l=(a(169),a(170),a(157)),d=function(e){var t=e.edge;return o.a.createElement("section",{className:"brick",style:{padding:"10px 20px"},onClick:function(){}},o.a.createElement("div",{style:{fontSize:".8em",fontFamily:"Arial, sans-serif",color:"#7a7a8c",textAlign:"left"}},new Intl.DateTimeFormat("zh-cn",{weekday:"long",year:"numeric",month:"long",day:"numeric"}).format(new Date(t.node.frontmatter.date))),o.a.createElement("h1",{style:{margin:".4em 0 1em",fontFamily:'Rubik,Lato,"Lucida Grande","Lucida Sans Unicode",Tahoma,Sans-Serif'}},o.a.createElement(c.a,{to:t.node.frontmatter.path},t.node.frontmatter.title)),o.a.createElement("p",{style:{fontFamily:"Microsoft Yahei,Tahoma,Helvetica,Arial,sans-serif"}},t.node.excerpt))},u=(a(148),a(171)),m=a.n(u);a.d(t,"pageQuery",function(){return f});var p=function(e){function t(){return e.apply(this,arguments)||this}r()(t,e);var a=t.prototype;return a.componentDidMount=function(){new m.a({owner:"wt911122",repo:"blog",oauth:{client_id:"452663934@qq.com",client_secret:"zbj650519"}}).render("comments")},a.render=function(){var e=this.props.data.allMarkdownRemark.edges;return o.a.createElement(s.a,null,o.a.createElement(l.a,{title:"Home",keywords:["gatsby","application","react"]}),e.map(function(e){return o.a.createElement(d,{key:e.node.id,edge:e})}))},t}(o.a.Component),f=(t.default=p,"1859266387")},151:function(e,t,a){"use strict";a.d(t,"b",function(){return d});var n=a(0),r=a.n(n),i=a(4),o=a.n(i),c=a(33),s=a.n(c);a.d(t,"a",function(){return s.a});a(152);var l=r.a.createContext({}),d=function(e){return r.a.createElement(l.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};d.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},152:function(e,t,a){var n;e.exports=(n=a(154))&&n.default||n},153:function(e){e.exports={data:{site:{siteMetadata:{title:"Words and Thoughts",description:"Everyday its a getting closer. Going faster then a Rollercoster.",author:"@wangtaon+1?",github:"https://github.com/wt911122",comp:"Netease"}}}}},154:function(e,t,a){"use strict";a.r(t);a(34);var n=a(0),r=a.n(n),i=a(4),o=a.n(i),c=a(55),s=a(2),l=function(e){var t=e.location,a=s.default.getResourcesForPathnameSync(t.pathname);return a?r.a.createElement(c.a,Object.assign({location:t,pageResources:a},a.json)):null};l.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=l},155:function(e,t,a){e.exports=a.p+"static/bg-3ed1e20ae9f21b4acf72837089256d37.png"},156:function(e,t,a){"use strict";var n=a(153),r=a(0),i=a.n(r),o=a(4),c=a.n(o),s=a(151),l=(a(74),a(143),function(e){var t=e.content,a=e.fontStyle;return t.split(" ").map(function(e,t){return i.a.createElement(i.a.Fragment,null,e.split("").map(function(e){return i.a.createElement("div",{className:"letter delay-"+(2*t+1),style:a},e)}),i.a.createElement("br",null))})}),d=a(155),u=function(e){var t=e.siteTitle,a=e.siteDescription;return i.a.createElement("header",{style:{background:"url("+d+") 50% 30%/100% auto",marginBottom:"1.45rem"}},i.a.createElement("div",{style:{padding:"1.45rem 1.0875rem"},className:"container"},i.a.createElement("div",null,i.a.createElement("h1",{style:{margin:0}},i.a.createElement(s.a,{to:"/",style:{fontFamily:"Andale Mono, monospace",color:"#000",textDecoration:"none",textShadow:"#FFF 1px 1px 10px, #FFF -1px -1px 10px"}},i.a.createElement(l,{content:t,fontStyle:{fontSize:36,fontFamily:"Andale Mono, monospace"}}))),i.a.createElement("p",{style:{fontFamily:"Andale Mono, monospace",marginBottom:0,marginTop:10,textShadow:"#FFF 1px 0 10px"}},a))))};u.propTypes={siteTitle:c.a.string},u.defaultProps={siteTitle:""};var m=u,p=(a(144),a(145),function(e){var t=e.children,a=e.noSideBar,r=e.headercontent,o=e.headerdate;return i.a.createElement(s.b,{query:"2189836974",render:function(e){return i.a.createElement(i.a.Fragment,null,i.a.createElement(m,{siteTitle:r||e.site.siteMetadata.title,siteDescription:o||e.site.siteMetadata.description}),i.a.createElement("div",{className:"container",style:{}},!a&&i.a.createElement("aside",{className:"sideblock"},i.a.createElement("div",{className:"brick"},i.a.createElement("img",{className:"responsive-image",src:"https://avatars1.githubusercontent.com/u/7549134?s=460&v=4"}),i.a.createElement("div",{className:"author-meta"},e.site.siteMetadata.author),i.a.createElement("dl",null,i.a.createElement("li",{className:"side-menu github-side"},i.a.createElement("a",{href:e.site.siteMetadata.github},e.site.siteMetadata.github)),i.a.createElement("li",{className:"side-menu comp-side"},e.site.siteMetadata.comp)))),i.a.createElement("div",{className:"maincontent"},t)))},data:n})});p.propTypes={children:c.a.node.isRequired};t.a=p},157:function(e,t,a){"use strict";var n=a(158),r=a(0),i=a.n(r),o=a(4),c=a.n(o),s=a(160),l=a.n(s);function d(e){var t=e.description,a=e.lang,r=e.meta,o=e.keywords,c=e.title,s=n.data.site,d=t||s.siteMetadata.description;return i.a.createElement(l.a,{htmlAttributes:{lang:a},title:c,titleTemplate:"%s | "+s.siteMetadata.title,meta:[{name:"description",content:d},{property:"og:title",content:c},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:s.siteMetadata.author},{name:"twitter:title",content:c},{name:"twitter:description",content:d}].concat(o.length>0?{name:"keywords",content:o.join(", ")}:[]).concat(r)})}d.defaultProps={lang:"en",meta:[],keywords:[]},d.propTypes={description:c.a.string,lang:c.a.string,meta:c.a.array,keywords:c.a.arrayOf(c.a.string),title:c.a.string.isRequired},t.a=d},158:function(e){e.exports={data:{site:{siteMetadata:{title:"Words and Thoughts",description:"Everyday its a getting closer. Going faster then a Rollercoster.",author:"@wangtaon+1?"}}}}},169:function(e){e.exports={data:{placeholderImage:{childImageSharp:{fluid:{base64:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAAAsSAAALEgHS3X78AAACYklEQVQ4y42Uy28SQRjA+dM8efDmwYN6qF6qiSY+Y/WgQRMibY00TaWNBSRSCraYQtHl/bR0KyxQWCgWWAqU8izl/Sq7rLNsRHlVJpvJtzPfb77nDIOcZHSoqZSrp4+KtXIziubaLRysMCZiCYqOoVnhjNEi8RcztdxxeTzc6VBfT+5O2Vhpb+vw4wMdZ0ppWvP9xzLeJoDNThf2W+Nz1+XzNxQubSToSKKW+BDc+WOnkshhSVgeCiGpViZMEg1oxc26Knt+ae3bEtJTZwzE1kXLccG0+sOOlrcvZXvsczPkITfsa20vwIKnhsh+BnjUarT74Gb13CY7KBVJMv3z4N1NszQYsMWM62HNrCis/GxXn0iYls23uz5LPBcv0bH8hUH2XRoM85ySXv7JBtO87jMIvWq+H5GoYIHCLA1ZxD6Qap3Ak8IKfW7TJ50lK6uP9E6RgndHaODtCJ6Z5RyHfnE7j6gRbcKlCYNSt+rtETHTpUGgEP8FYmdNqd/Mo7aiVWTfuH2L9xASvfxxlqr01EYkrJszvNkgW9bH0OuFr+99m+y9IOeyU6zIp/Hubp/yMEztlzFPwOhdvq+nIoS1JNn4t2sugCmVsDvPe2KKolnZLCxhOcAKQRDDXTQaVi46lqYhIBwHTrl3oWqhMRDtaJge37lOBMKo4tfbqhVX0J7snTsWps8uZWuoOQY6CcjpSIF55UvmqNgr5wUwtV1IVdnXtnSfPEB2qjDNqnvczRl0m+j6Jn5lXb6nAQJqinmN0ZEBj03YLzghY8PnTRz80o/GRJZpOLCb0PM9BN7pvUEjx28V00WUg9jIVwAAAABJRU5ErkJggg==",aspectRatio:1,src:"/blog/static/6d91c86c0fde632ba4cd01062fd9ccfa/fbe2f/gatsby-astronaut.png",srcSet:"/blog/static/6d91c86c0fde632ba4cd01062fd9ccfa/e1fed/gatsby-astronaut.png 75w,\n/blog/static/6d91c86c0fde632ba4cd01062fd9ccfa/08283/gatsby-astronaut.png 150w,\n/blog/static/6d91c86c0fde632ba4cd01062fd9ccfa/fbe2f/gatsby-astronaut.png 300w,\n/blog/static/6d91c86c0fde632ba4cd01062fd9ccfa/59257/gatsby-astronaut.png 450w,\n/blog/static/6d91c86c0fde632ba4cd01062fd9ccfa/26d9e/gatsby-astronaut.png 600w,\n/blog/static/6d91c86c0fde632ba4cd01062fd9ccfa/a3fa0/gatsby-astronaut.png 800w",sizes:"(max-width: 300px) 100vw, 300px"}}}}}}}]);
//# sourceMappingURL=component---src-pages-index-js-4529886a484bffe29322.js.map