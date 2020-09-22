import React from "react"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby"

export default function BrandCollectionPage({ data }) {
  // console.log(data)
  // data.allDirectory.edges.forEach(({ node }) => { console.log(node.name) })
  return (
    <Layout>
      <h1>Our Brands</h1>
      {data.allDirectory.edges.map(({ node }) => {
        const regex = /-/g;
        // remove hyphens
        const hyphenlessBrand = node.name.replace(regex, ' ')
        // capitalize brand names
        const formattedBrand = hyphenlessBrand.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        return <div key={node.id}>
          <Link to={node.name}>{formattedBrand}</Link>
          {" "}
        </div>
      })}
    </Layout>
  )
}

export const brands = graphql`
  query {
    allDirectory(filter: {relativeDirectory: {eq: ""}}) {
      edges {
        node {
          name
          id
        }
      }
    }
  }
`