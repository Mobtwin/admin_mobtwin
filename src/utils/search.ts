import { Model, Document } from 'mongoose';

export interface SearchParams {
  [key: string]: string | undefined;
}

export const searchInModel = async <T extends Document>(
  model: Model<T>,
  searchParams: SearchParams
): Promise<T[]> => {
  const query: Record<string, any> = {};

  // Build the query object with regex for each search parameter
  for (const key in searchParams) {
    if (searchParams[key]) {
      query[key] = { $regex: searchParams[key], $options: 'i' };
    }
  }

  try {
    const results = await model.find(query).exec();
    return results;
  } catch (error:any) {
    throw new Error(`Error searching in model: ${error.message}`);
  }
};
