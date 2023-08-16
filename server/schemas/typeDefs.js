const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type ParkedCar {
    _id: ID
    lat: Float
    lng: Float
    createdTs: String
  }

  type Query {
    parkedCars: [ParkedCar]
  }

  type Mutation {
    addParkedCar(
      lat: Float!, 
      lng: Float!): ParkedCar 

    deleteParkedCar(
      id: ID! ): ParkedCar 
  }
`;

module.exports = typeDefs;

