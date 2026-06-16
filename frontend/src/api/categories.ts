import { api, extractData } from "./axios";

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string | null;
  _count: { gigs: number };
}

export const categoriesApi = {
  list: () =>
    api
      .get<{ success: boolean; data: Category[] }>("/categories")
      .then(extractData<Category[]>),

  getBySlug: (slug: string) =>
    api
      .get<{ success: boolean; data: Category }>(`/categories/${slug}`)
      .then(extractData<Category>),
};
