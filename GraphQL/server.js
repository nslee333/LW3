const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');


// In our fields we have to return a function [ () => ... ] because alot of these queries are using functions inside them, so this makes sure that the 
    // functions inside them are defined before use.
    // If we don't do this, then we 


const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]


const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) }, // Since id is already in the books array it fills in the field automatically.
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: { type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId )
            }
        }
    })
})


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book.',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) }, // Since id is already in the books (array?) it fills in the field automatically.
        name: { type: GraphQLNonNull(GraphQLString) },
        books: { type: new GraphQLList(BookType),
        resolve: (author) => {
            return books.filter(book => book.authorId === author.id)
        }} 
    })
})






const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A single author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === author.id)
        },
    }) // Whenever you wrap the parentheses with squiggly brackets, it automatically returns it so we don't have to write a return statement.
})





const schema = new GraphQLSchema({
    query: RootQueryType,
})


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))


app.listen(5000., () => console.log("Server running"))



// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: "Hello World",
//         fields: () => ({
//             message: { type: GraphQLString,
//             resolve: () => 'Hello World'
//             }
//         })
//     })
// })
