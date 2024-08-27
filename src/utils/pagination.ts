import { Model, FilterQuery } from "mongoose";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Generic function to fetch paginated data
async function fetchPaginatedData<T>(
  model: Model<T>,
  skip: number,
  limit: number,
  filter: FilterQuery<T> = {},
  populateOption?: string
): Promise<{ data: T[]; pagination: Pagination }> {
  try {
    // Create the base query with filter and pagination
    let query = model.find(filter).skip(skip).limit(limit);

    // Apply population if populateOption is provided
    if (populateOption) {
      query = query.populate(populateOption);
    }

    // Execute the query to get data
    const data = await query.exec();
    // Get total count for pagination calculation
    const total = await model.countDocuments(filter).exec();

    // Calculate pagination details
    const pagination = {
      page: Math.floor(skip / limit) + 1,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    };

    return { data, pagination };
  } catch (error: any) {
    throw error;
  }
}

export default fetchPaginatedData;
