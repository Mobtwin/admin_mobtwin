// define joi schema for pagination query

import Joi from "joi";

export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export const paginationQuerySchema = Joi.object<PaginationQuery>({
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
});

