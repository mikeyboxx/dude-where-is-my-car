import { gql } from '@apollo/client';

export const QUERY_PARKED_CARS = gql`
query Query {
  parkedCars {
    _id
    lat
    lng
    createdTs
  }
}
`;

