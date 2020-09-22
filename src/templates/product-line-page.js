import React from "react"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby"

export default function ProductLinePage({ data, pageContext }) {
  console.log(data)
  // console.log(pageContext)
  const title = pageContext.line.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  data.allFile.edges.forEach(({ node }) => { console.log(node) })
  return (
    <Layout>
      <h1>{title} Line Products</h1>
      <div className="flex flex-wrap -mb-4 -mx-1">
        {data.allFile.edges.map(({ node }, index) => {
          const color = index % 2 === 0 ? 400 : 500
          return <Link to={node.fields.slug} key={node.id} className={`w-1/3 bg-gray-${color} h-auto px-2 py-2`}>
            <div>
              <img src={node.publicURL} alt={node.name} />
              <h2>{node.name}</h2>
            </div>
          </Link>
        })}
      </div>
    </Layout>
  )
}

export const lineProducts = graphql`
  query ($brandLineDir: String!) {
    allFile(filter: {relativeDirectory: {eq: $brandLineDir}, internal: {mediaType: {glob: "image/*"}}}) {
      edges {
        node {
          name
          publicURL
          id
          fields {
            slug
          }
        }
      }
    }
  }
`