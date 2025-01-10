// src/services/graphqlService.ts

import axios from 'axios';
import { CreateCollection, UpdateCollectionById } from '../validators/collection.validator';
import { environment } from '../utils/loadEnvironment';

// Define your GraphQL API endpoint
const GRAPHQL_API_URL = environment.GRAPHQL_API_URL;

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
            'Authorization': `Bearer ${token}`, // Replace with your actual API token
        }
    });
    return response.data;
  } catch (error:any) {
    console.log(error)
    throw new Error(`GraphQL request failed: ${error.message}`);
  }
};
// Query for getCollections
export const getCollections = async (token: string) => {
  const query = `
    query GetCollections {
      getCollections
    }
  `;
  return await sendGraphQLRequest(query, {}, token);
};
// Mutation for createCollection
export const createCollection = async (collection: CreateCollection,platform:"as"|"gp",token:string) => {
  console.log({
    collection,
    platform,
    token,
  })
  const query = `
    mutation Mutation($platform: String!, $collection: Collection!) {
      createCollection(platform: $platform, collection: $collection)
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

// Mutation for deleteCollection
export const deleteCollection = async (platform:"as"|"gp",id:string, token: string) => {
  const query = `
    mutation DeleteCollection($id: String!, $platform: String!) {
      deleteCollection(id: $id, platform: $platform) {
        id
        platform
        success
      }
    }
  `;
  const variables = {
    id: id,
    platform: platform,
  };

  return await sendGraphQLRequest(query, variables,token);
};
