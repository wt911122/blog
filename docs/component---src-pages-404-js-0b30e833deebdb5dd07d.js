(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{146:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(155),o=a(156);t.default=function(){return r.a.createElement(i.a,{noSideBar:!0,headercontent:"Oops!",headerdate:"The page is not found!"},r.a.createElement(o.a,{title:"404: Not found"}),r.a.createElement("h1",null,"NOT FOUND"),r.a.createElement("p",null,"You just hit a route that doesn't exist... the sadness."))}},150:function(e,t,a){"use strict";a.d(t,"b",function(){return d});var n=a(0),r=a.n(n),i=a(4),o=a.n(i),s=a(32),c=a.n(s);a.d(t,"a",function(){return c.a});a(151);var l=r.a.createContext({}),d=function(e){return r.a.createElement(l.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};d.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},151:function(e,t,a){var n;e.exports=(n=a(153))&&n.default||n},152:function(e){e.exports={data:{site:{siteMetadata:{title:"Words and Thoughts",description:"Everyday its a getting closer. Going faster then a Rollercoster.",author:"@wangtaon+1?",github:"https://github.com/wt911122",comp:"Netease"}}}}},153:function(e,t,a){"use strict";a.r(t);a(33);var n=a(0),r=a.n(n),i=a(4),o=a.n(i),s=a(54),c=a(2),l=function(e){var t=e.location,a=c.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(s.a,Object.assign({location:t,pageResources:a},a.json))};l.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=l},154:function(e,t,a){e.exports=a.p+"static/bg-3ed1e20ae9f21b4acf72837089256d37.png"},155:function(e,t,a){"use strict";var n=a(152),r=a(0),i=a.n(r),o=a(4),s=a.n(o),c=a(150),l=(a(73),a(142),function(e){var t=e.content,a=e.fontStyle;return t.split(" ").map(function(e,t){return i.a.createElement(i.a.Fragment,null,e.split("").map(function(e){return i.a.createElement("div",{className:"letter delay-"+(2*t+1),style:a},e)}),i.a.createElement("br",null))})}),d=a(154),u=function(e){var t=e.siteTitle,a=e.siteDescription;return i.a.createElement("header",{style:{background:"url("+d+") 50% 30%/100% auto",marginBottom:"1.45rem"}},i.a.createElement("div",{style:{padding:"1.45rem 1.0875rem"},className:"container"},i.a.createElement("div",null,i.a.createElement("h1",{style:{margin:0}},i.a.createElement(c.a,{to:"/",style:{fontFamily:"Andale Mono, monospace",color:"#000",textDecoration:"none",textShadow:"#FFF 1px 1px 10px, #FFF -1px -1px 10px"}},i.a.createElement(l,{content:t,fontStyle:{fontSize:36,fontFamily:"Andale Mono, monospace"}}))),i.a.createElement("p",{style:{fontFamily:"Andale Mono, monospace",marginBottom:0,marginTop:10,textShadow:"#FFF 1px 0 10px"}},a))))};u.propTypes={siteTitle:s.a.string},u.defaultProps={siteTitle:""};var m=u,p=(a(143),a(144),function(e){var t=e.children,a=e.noSideBar,r=e.headercontent,o=e.headerdate;return i.a.createElement(c.b,{query:"2189836974",render:function(e){return i.a.createElement(i.a.Fragment,null,i.a.createElement(m,{siteTitle:r||e.site.siteMetadata.title,siteDescription:o||e.site.siteMetadata.description}),i.a.createElement("div",{className:"container",style:{}},!a&&i.a.createElement("aside",{className:"sideblock"},i.a.createElement("div",{className:"brick"},i.a.createElement("img",{className:"responsive-image",src:"https://avatars1.githubusercontent.com/u/7549134?s=460&v=4"}),i.a.createElement("div",{className:"author-meta"},e.site.siteMetadata.author),i.a.createElement("dl",null,i.a.createElement("li",{className:"side-menu github-side"},i.a.createElement("a",{href:e.site.siteMetadata.github},e.site.siteMetadata.github)),i.a.createElement("li",{className:"side-menu comp-side"},e.site.siteMetadata.comp)))),i.a.createElement("div",{className:"maincontent"},t)))},data:n})});p.propTypes={children:s.a.node.isRequired};t.a=p},156:function(e,t,a){"use strict";var n=a(157),r=a(0),i=a.n(r),o=a(4),s=a.n(o),c=a(159),l=a.n(c);function d(e){var t=e.description,a=e.lang,r=e.meta,o=e.keywords,s=e.title,c=n.data.site,d=t||c.siteMetadata.description;return i.a.createElement(l.a,{htmlAttributes:{lang:a},title:s,titleTemplate:"%s | "+c.siteMetadata.title,meta:[{name:"description",content:d},{property:"og:title",content:s},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:c.siteMetadata.author},{name:"twitter:title",content:s},{name:"twitter:description",content:d}].concat(o.length>0?{name:"keywords",content:o.join(", ")}:[]).concat(r)})}d.defaultProps={lang:"en",meta:[],keywords:[]},d.propTypes={description:s.a.string,lang:s.a.string,meta:s.a.array,keywords:s.a.arrayOf(s.a.string),title:s.a.string.isRequired},t.a=d},157:function(e){e.exports={data:{site:{siteMetadata:{title:"Words and Thoughts",description:"Everyday its a getting closer. Going faster then a Rollercoster.",author:"@wangtaon+1?"}}}}}}]);
//# sourceMappingURL=component---src-pages-404-js-0b30e833deebdb5dd07d.js.map