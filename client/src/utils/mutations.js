import { gql } from '@apollo/client';

export const ADD_PARKED_CAR = gql`
mutation Mutation($lat: Float!, $lng: Float!) {
  addParkedCar(lat: $lat, lng: $lng) {
    _id
    lat
    lng
    createdTs
  }
}
`;

export const DELETE_PARKED_CAR = gql`
mutation Mutation($id: ID!) {
  deleteParkedCar(id: $id) {
    _id
    lat
    lng
    createdTs
  }
}
`;
