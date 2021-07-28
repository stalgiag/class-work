import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from 'gatsby-plugin-image'

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ProjectPageTemplate = ({ data, location }) => {
  const project = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  console.log(project);
  return (
    <Layout location={location} title={siteTitle}>
          <GatsbyImage alt={project.frontmatter.alt} image={project.frontmatter.thumbnail.childImageSharp.gatsbyImageData} />
          <h1 itemProp="headline">{project.frontmatter.title} by {project.frontmatter.author}</h1>
          <p>{project.frontmatter.description}</p>
          <a href={project.frontmatter.link} >Try it</a>
        <hr />
        <footer>
          <Bio />
        </footer>
    </Layout>
  )
}

export default ProjectPageTemplate

export const pageQuery = graphql`
  query ProjectBySlug(
    $id: String!
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        class
          title
          link
          description
          alt
          thumbnail {
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED)
            }
          }
      }
    }
  }
`
