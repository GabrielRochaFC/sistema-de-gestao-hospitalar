import z from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().min(1, "Página deve ser maior que 0").default(1),
  limit: z.coerce
    .number()
    .min(1, "Limite deve ser maior que 0")
    .max(100, "Limite máximo é 100")
    .default(10),
});

export type PaginationData = z.infer<typeof paginationSchema>;

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
