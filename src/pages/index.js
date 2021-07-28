import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from 'gatsby-plugin-image'

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { PossibleTypeExtensionsRule } from "graphql"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>
          No classes found. Add markdown posts to "content/classes" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          return (
            <li key={post.fields.slug}>
              <Link to={post.fields.slug} itemProp="url">
                <GatsbyImage className='class-thumb' image={post.frontmatter.thumbnail.childImageSharp.gatsbyImageData} />
                <h2>
                  <span itemProp="headline">{title}</span>
                </h2>
              </Link>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/(classes)/"  }}) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          thumbnail {
            childImageSharp {
                gatsbyImageData(layout: CONSTRAINED)
            }
          }
          alt
        }
      }
    }
  }
`
