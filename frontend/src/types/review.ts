import type { Gig } from "./gig";
import type { PublicUser } from "./user";

export interface Review {
  id: string;
  gig: Pick<Gig, "id" | "title" | "category">;
  reviewer: PublicUser;
  rating: number;
  comment: string;
  createdAt: string;
}
