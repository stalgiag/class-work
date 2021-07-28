import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from 'gatsby-plugin-image'

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ClassPageTemplate = ({ data, location }) => {
  const classMarkdown = data.allMarkdownRemark.nodes.find(o => {
    return o.fields.slug === location.pathname;
  })
  const classTitle = classMarkdown.frontmatter.title
  const projectsMarkdown = data.allMarkdownRemark.nodes.filter(p => {
    return p.frontmatter.class === classTitle;
  });
  const siteTitle = data.site.siteMetadata?.title || `Title`
  console.log(projectsMarkdown);
  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{classTitle}</h1>
          {/* <p>{post.frontmatter.date}</p> */}
        </header>
        {/* <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        /> */}
        <hr />
        <ol style={{ listStyle: `none` }}>
        {projectsMarkdown.map(project => {
          const title = project.frontmatter.title || project.fields.slug;
          const author = project.frontmatter.author;
          return (
            <li key={project.fields.slug}>
              <Link to={project.fields.slug} itemProp="url">
                <GatsbyImage className='class-thumb' image={project.frontmatter.thumbnail.childImageSharp.gatsbyImageData} />
                <h3>
                  <span itemProp="headline">{title} by {author}</span>
                </h3>
              </Link>
            </li>
          )
        })}
      </ol>
        <footer>
          <Bio />
        </footer>
      </article>
    </Layout>
  )
}

export default ClassPageTemplate

export const pageQuery = graphql`
  query ClassBySlug {
     site {
       siteMetadata {
         title
       }
     }
     allMarkdownRemark {
      nodes {
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
        fields {
          slug
        }
      }
    }
   }
 `

//  query ClassBySlug {

// }



// #   ClassBySlug(
// #     $id: String!
// #   ) {
// #     site {
// #       siteMetadata {
// #         title
// #       }
// #     }
// #     markdownRemark(id: { eq: $id }) {
// #       id
// #       excerpt(pruneLength: 160)
// #       html
// #       frontmatter {
// #         title
// #       }
// #     }
// #   }
// # `
