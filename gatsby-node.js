const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for class
  const classTemplate = path.resolve(`./src/templates/class.js`)
  const projectTemplate = path.resolve(`./src/templates/project.js`)

  // Get all markdown blog posts sorted by date
  const classResults = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {fileAbsolutePath: {regex: "/(classes)/"  }}
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  )
  
  const projectResults = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {fileAbsolutePath: {regex: "/(projects)/"  }}
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  )

  if (classResults.errors) {
    reporter.panicOnBuild(
      `There was an error loading your classes`,
      classResults.errors
    )
    return
  }
  
  if (projectResults.errors) {
    reporter.panicOnBuild(
      `There was an error loading your projects.`,
      projectResults.errors
    )
    return
  }

  const classes = classResults.data.allMarkdownRemark.nodes

  // Create class pages
  // But only if there's at least one markdown file found at "content/classes" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL
  if (classes.length > 0) {
    classes.forEach((c, index) => {
      createPage({
        path: c.fields.slug,
        component: classTemplate,
        context: {
          id: c.id,
        },
      })
    })
  }
  
  const projects = projectResults.data.allMarkdownRemark.nodes
  
  if (projects.length > 0) {
    projects.forEach((p, index) => {
      createPage({
        path: p.fields.slug,
        component: projectTemplate,
        context: {
          id: p.id,
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/classes" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
