import type { Gig } from "./gig";
import type { PublicUser } from "./user";

export type AppStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";

export interface Application {
  id: string;
  gig: Gig;
  worker: PublicUser;
  coverNote: string;
  status: AppStatus;
  appliedAt: string;
}
