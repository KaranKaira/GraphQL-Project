const graphql = require('graphql');
const _ = require('lodash');
//? define schema - describe data type , object , realtion b/w objects;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID, //? inbuilt ID
  GraphQLInt,
} = graphql;

//?  dummy data

const books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3' },
];

const authors = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' },
];

//? object type

const BookType = new GraphQLObjectType({
  name: 'Book', //? this object is called 'Book'
  //? and Book have some fields
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

//? root queries - > entry point in graph

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    //? name of entry points

    //? handling book endpoint
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } }, // ? id will tell which book to return , it will come with query

      resolve(parent, args) {
        //? code to get data from DB
        //? handle query on this point

        return books.find((book) => book.id === args.id);
      },
    },

    //? handling author endpoint
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return authors.find((author) => author.id === args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery, //? whch query users are allowed to make from frontend
});
