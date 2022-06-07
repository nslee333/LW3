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
    // If we don't do this, then the server will crash.
// GH Repo for this is here: https://github.com/WebDevSimplified/Learn-GraphQL.



// Arrays that will act as our database.
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

// This is defining a Book Type object. 
// Fields are our properties of an instance of a book object.
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

// Defining an author type object.

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



// This is the function that helps us make our queries.



const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({ // We define it with a function to ensure that the functions inside these queries are defined before they're called.
        book: { // A query for a single book. 
            type: BookType, // the type.
            description: 'A Single Book', 
            args: { // Arguments that we'll give the query.
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id) // Resolution - parent isn't used, it takes the args, then uses the (type).find GraphQL function,
            // then it returns the book id that matches the arg id.
        },
        books: { // This is for all the books in the array. It returns a list instead of a single booktype object.
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        authors: { // Returns a list of authors. 
            type: new GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => authors
        },
        author: { // Returns a single author.
            type: AuthorType,
            description: 'A single author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id) // Return the author object that matches the args id. 
        },
    }) // Whenever you wrap the parentheses with squiggly brackets, it automatically returns it so we don't have to write a return statement.
})

const RootMutationType = new GraphQLObjectType({ // This is used for modifying data in a database.
    name: 'Mutation', // mutation is a keyword used for modifying data in a database.
    description: 'Root Mutation',
    fields: () => ({
        addBook: { // This function is used to add a book to the database.
            type: BookType,
            description: "Add a book",
            args: { // Arguments used to create the new book.
                name: { type: GraphQLNonNull(GraphQLString) }, 
                authorId: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args ) => { 
                const book =  { id: books.length + 1, name: args.name, authorId: args.authorId } // Assigning 'book' to this object, it adds 1 to the length of books, inputs in
                // the args name as the name, and the Args authorId as the author.
                books.push(book) // Push that newly created book object to the array (or database).
                return book // Return book.
            },
        },
        addAuthor: { // Adding an author.
            type: AuthorType,
            description: "Add an Author",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) } // Args for the name of the author.
            },
            resolve: (parent, args ) => { // Same as the structure above.
                const author =  { id: authors.length + 1, name: args.name, authorId: args.authorId }
                authors.push(author)
                return author
            }
        }
    })
})  



const schema = new GraphQLSchema({ // This schema is used to tell GraphIQL what is what so that it works GraphQL.
    query: RootQueryType, // Telling GraphQL how to treat our RootQueryType, which is our Query function.
    mutation: RootMutationType // Telling GraphQL how to treat our RootMutationType, which is our Mutation function. Mutation is used to modify content in the database.
})


app.use('/graphql', graphqlHTTP({ // This is the config on how to set up the GraphQL / GraphIQL.
    schema: schema,
    graphiql: true
}))


app.listen(5000., () => console.log("Server running")) // This is just something to make sure that the server is running.



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
