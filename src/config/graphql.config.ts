// src/services/graphqlService.ts

import axios from 'axios';
import { CreateCollection, UpdateCollectionById } from '../validators/collection.validator';

// Define your GraphQL API endpoint
const GRAPHQL_API_URL = 'https://api.mobtwintest.com/graphql';

// Helper function to send a GraphQL mutation request
const sendGraphQLRequest = async (query: string, variables: any,token:string) => {
  try {
    const response = await axios.post(GRAPHQL_API_URL, {
      query,
      variables,
    },{
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer YOUR_API_TOKEN_HERE', // Replace with your actual API token
        }
    });
    return response.data;
  } catch (error:any) {
    throw new Error(`GraphQL request failed: ${error.message}`);
  }
};

// Mutation for createCollection
export const createCollection = async (collection: CreateCollection,platform:"as"|"gp",token:string) => {
  const query = `
    mutation CreateCollection($platform: String!, $collection: JSON!) {
      createCollection(platform: $platform, collection: $collection) {
        id
        platform
        collection
        success
      }
    }
  `;
  const variables = {
    platform: platform,
    collection: collection,
  };
  
  return await sendGraphQLRequest(query, variables,token);
};

// Mutation for updateCollection
export const updateCollection = async (collection: UpdateCollectionById,platform:"as"|"gp",id:string,token:string) => {
  const query = `
    mutation UpdateCollection($id: String!, $platform: String!, $collection: JSON!) {
      updateCollection(id: $id, platform: $platform, collection: $collection) {
        id
        platform
        collection
        success
      }
    }
  `;
  const variables = {
    id: id,
    platform: platform,
    collection: collection,
  };

  return await sendGraphQLRequest(query, variables,token);
};

// // Mutation for deleteCollection
// export const deleteCollection = async (input: DeleteCollectionInput, user: any) => {
//   const query = `
//     mutation DeleteCollection($id: String!, $platform: String!) {
//       deleteCollection(id: $id, platform: $platform) {
//         id
//         platform
//         success
//       }
//     }
//   `;
//   const variables = {
//     id: input.id,
//     platform: input.platform,
//   };

//   return await sendGraphQLRequest(query, variables);
// };
