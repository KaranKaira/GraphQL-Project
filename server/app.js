const express = require('express');
const app = express();
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')
//? whenver someone goes to /graphql , then graphqlHTTP is used.
//? this is the endpoint of graphql

//? this graphqlHTTP requirs schema bcoz it need to know the structure and realation the graph
app.use('/graphql' , graphqlHTTP({
    // schema : schema 
    schema,
    graphiql:true //? this fires up graphiql tool to test graphql sever without having any frontend
}));

app.listen(4000 , ()=>{
    console.log('server listening at 4000');
})