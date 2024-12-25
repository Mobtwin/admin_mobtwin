import { Model, Document, FilterQuery } from 'mongoose';

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


export function constructSearchFilter<T>(searchParams: SearchParams): FilterQuery<T> {
  const orConditions: FilterQuery<T>[] = [];

  // Loop through each search param and create an $or condition for each key
  Object.keys(searchParams)
    .filter(key => searchParams[key]) // Only include keys with a value
    .forEach(key => {
      const value = searchParams[key] as string; // Cast the value to string

      // Push the condition into the orConditions array, ensuring the structure is correct
      orConditions.push({
        [key]: { $regex: value, $options: 'i' },
      } as FilterQuery<T>);
    });

  // Return the $or condition, or an empty object if there are no conditions
  return orConditions.length > 0 ? { $or: orConditions } : {};
}