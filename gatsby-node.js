/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  // create slugs for all image files
  const { createNodeField } = actions
  const regexp = /\//
  // const regexp = /happy-floors/
  // const regexp = /([^\/]+\/?)+[^\/]+\/?/
  if (regexp.test(node.relativeDirectory) && node.internal.mediaType.startsWith('image')) {
    const slug = createFilePath({
      node,
      getNode,
      basePath: `pages/products/`
    })
    createNodeField({
      node,
      name: `slug`,
      value: `/products${slug}`
    })
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => { // create brand and line pages
  const { createPage } = actions
  // get brands
  const brands = await graphql(`
  query {
    allDirectory(filter: {relativeDirectory: {eq: ""}}) {
      edges {
        node {
          name
        }
      }
    }
  }
  `)
  if (brands.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  brands.data.allDirectory.edges.forEach(async ({ node }) => { // create brand pages
    // console.log("creating brand page")
    console.log('brand name: ', node.name)
    const brand = node.name
    createPage({
      path: `/products/${node.name}/`,
      component: path.resolve(`./src/templates/brand-page.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        name: node.name
      }
    })
    const lines = await graphql(`
    {
      allDirectory(filter: {relativeDirectory: {eq: "${brand}"}}, sort: {fields: name, order: ASC}) {
        edges {
          node {
            name
          }
        }
      }
    }
    `)
    if (lines.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`)
      console.log("Error occurred during build of brand: ", brand)
      return
    }
    console.log("creating product line pages for ", brand);
    lines.data.allDirectory.edges.forEach(({ node }) => { // create product line pages
      console.log("building ", brand, node.name);
      createPage({
        path: `/products/${brand}/${node.name}/`,
        component: path.resolve(`./src/templates/product-line-page.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          brandLineDir: `${brand}/${node.name}`,
          line: node.name
        },
      })
    })
  })
  const result = await graphql(`
  query {
    allFile(filter: {relativePath: {regex: "/\//"}, internal: {mediaType: {glob: "image/*"}}}) {
      edges {
        node {
          name
          fields {
            slug
          }
        }
      }
    }
  }`)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  result.data.allFile.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/product-page.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
}