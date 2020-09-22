import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default function ProductPage({ data, pageContext }) {
  console.log(pageContext)
  const title = data.file.name
  return (
    <Layout>
      <h1>{title}</h1>
      <img src={data.file.publicURL} alt={title} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    file(fields: { slug: { eq: $slug } }) {
      name
      publicURL
    }
  }
`