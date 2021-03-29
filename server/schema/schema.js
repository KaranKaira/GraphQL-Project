const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');

//? define schema - describe data type , object , realtion b/w objects;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID, //? inbuilt ID
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull //? for not allowing null values 
} = graphql;




//? object type

const BookType = new GraphQLObjectType({
  name: 'Book', //? this object is called 'Book'
  //? and Book have some fields
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },   
    author:{
        type : AuthorType ,

        resolve(parent,args){
            return Author.findById(parent.authorId);
        }
    }
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',

  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books :{
      type : GraphQLList(BookType),

      resolve(parent,args){
        return Book.find({authorId : parent.id});
      }
    }
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
      //? args tell graphql 'You will get these agruments with query'
      args: { id: { type: GraphQLID }}, // ? id will tell which book to return , it will come with query

      resolve(parent, args) {
        //? code to get data from DB
        //? handle query on this point

        return Book.findById( args.id);
      }
    },

    //? handling author endpoint
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },

    //? handling books (for all books in DB) endpoint
    books : {
      type : new GraphQLList(BookType) ,
      args : {} ,
      resolve(parent,args){
        return Book.find({});
      }
    },

    //? handling authors (all authors) endpoint

    authors :{
      type : new GraphQLList(AuthorType),
      args : {},
      resolve(parent,args){
          return Author.find({});
      }
    }
  },
});

//? mutations - changing/creating of data
//? args - data sent with mutation
const Mutation =new GraphQLObjectType({
  name : 'Mutations',

  fields : {
    //? author add
    addAuthor : {
      type : AuthorType , 
      args : {
        name : {type : new GraphQLNonNull(GraphQLString)} , //? NonNull used to make this field required
        age : {type : new GraphQLNonNull(GraphQLInt)}  //? NonNull used to make this field required
      },
      resolve(parent,args){
        let author = new Author({
          name : args.name,
          age : args.age
        });
      
       return author.save();
      }
    },
    addBook : {
      type : BookType , 
      
      args : {
        name : {type : new GraphQLNonNull(GraphQLString)},  //? NonNull used to make this field required
        genre : {type : new GraphQLNonNull(GraphQLString)}, //? NonNull used to make this field required
        authorId : {type : new GraphQLNonNull(GraphQLID)} //? NonNull used to make this field required
      },
      resolve(parent,args){
        let book = new Book({
          name : args.name,
          genre : args.genre,
          authorId : args.authorId
        });
        return book.save();
      }

    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery, //? whch query users are allowed to make from frontend
  mutation : Mutation
});
