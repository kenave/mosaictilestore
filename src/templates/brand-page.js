import React from "react"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby"

export default function BrandPage({ data, pageContext }) {
  let regex = /-/g;
  const hyphenlessBrand = pageContext.name.replace(regex, ' ')
  const formattedBrand = hyphenlessBrand.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  // console.log(data)
  // data.allDirectory.edges.forEach(({ node }) => { console.log(node.name) })
  return (
    <Layout>
      <h1>{formattedBrand}</h1>
      <Link to="/products">Back to Brands</Link>
      <div className="mt-2">
        {data.allDirectory.edges.map(({ node }) => {
          return <div key={node.id}>
            <Link to={node.name}>{node.name}</Link>
            {" "}
          </div>
        })}
      </div>
    </Layout>
  )
}

export const brand = graphql`
  query($name: String!) {
    allDirectory(filter: {relativeDirectory: {eq: $name}}, sort: {fields: name, order: ASC}) {
      edges {
        node {
          name
          id
        }
      }
    }
  }
`