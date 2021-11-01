const fetch = require('node-fetch');
const { createRemoteFileNode } = require('gatsby-source-filesystem');
const authors = require('./src/data/authors.json');
const books = require('./src/data/books.json');
const { default: slugify } = require('slugify');

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  createPage({
    path: "/custom",
    component: require.resolve("./src/templates/custom.js"),
    context: {
      title: "A Custom Page!",
      meta: {
        description: "A custom page with context.",
      },
    },
  });

  const result = await graphql(`
     query GetBooks {
       allBook {
         nodes {
          id
          series
           name
        }
      }
    }
  `);
  const books = result.data.allBook.nodes;
  books.forEach((book) => {
    const bookSlug = slugify(book.name, { lower: true });
    if (book.series === null) {
      createPage({
        path: `/book/${bookSlug}`,
        component: require.resolve(`./src/templates/book.js`),
        context: {
          id: book.id,
        },
      });
    } else {
      const seriesSlug = slugify(book.series, { lower: true });

      createPage({
        path: `/book/${seriesSlug}/${bookSlug}`,
        component: require.resolve(`./src/templates/book.js`),
        context: {
          id: book.id,
        },
      });
    }
  });

};
exports.sourceNodes = ({ actions: { createNode }, createNodeId, createContentDigest }) => {
  authors.forEach((author) => {
    createNode({
      ...author,
      id: createNodeId(`author-${author.slug}`),
      parent: null,
      children: [],
      internal: {
        type: 'Author',
        content: JSON.stringify(author),
        contentDigest: createContentDigest(author)
      }
    })
  })
  books.forEach((book) => {
    createNode({
      ...book,
      id: createNodeId(`book-${book.isbn}`),
      parent: null,
      children: [],
      internal: {
        type: 'Book',
        content: JSON.stringify(book),
        contentDigest: createContentDigest(book),
      },
    });
  });
  console.log("创建了Aturhonode")
}
exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  //理解@link含义，Author中的from：slug是指authro自身的slug，by:指的是关联的类型Book身上的
  createTypes(`
     type Author implements Node {
       books: [Book!]! @link(from: "slug" by: "author.slug")
     }
     type Book implements Node {
       author: Author! @link(from: "author" by: "slug")
     }
   `);
}
exports.createResolvers = async ({
  actions: { createNode },
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter, }) => {


  const response = await fetch('https://hui-dev-1gyna55lf740be4f-1257325628.ap-shanghai.service.tcloudbase.com/rest/v1.0/images')
  if (!response.ok) {
    reporter.warn(`
            加载${source.name}时，接收到以下错误:错误码：${response.status} 错误信息${response.statusText}
            `)
    return null;
  }
  const { data: bookCoverData } = await response.json()
  const resolvers = {
    Book: {
      buyLink: {
        type: "String",
        //source这个参数拿到的是当前节点的对象
        //{
        // isbn: 9781476738024,
        // name: 'A Man Called Ove',
        // author: 'fredrik-backman',
        // series: null,
        // seriesOrder: null,
        // id: '04d8d419-fe24-5d46-a421-850720508430',
        // parent: null,
        // children: [],
        // internal: {
        //   type: 'Book',
        //   content: '{"isbn":9781476738024,"name":"A Man Called Ove","author":"fredrik-backman","series":null,"seriesOrder":null}',
        //   contentDigest: '2463b3a2215270c22ce12a95c00dcd50',
        //   owner: 'default-site-plugin',
        //   counter: 29
        // }
        resolve: (source,) => {
          //实际上参数可以有这几个
          //source, args, context, info

          return `https://www.powells.com/searchresults?keyword=${source.isbn}`
        }
      },
      cover: {
        type: "File",
        resolve: async (source) => {

          const url = bookCoverData.filter(imageObj => Number(imageObj.name) === source.isbn)[0].image
          if (url.length) {
            return createRemoteFileNode({
              url: url[0],
              store,
              cache,
              createNode, createNodeId,
              reporter
            })
          } else {
            return null;
          }
        }
      }
    }
  }
  createResolvers(resolvers);
}
