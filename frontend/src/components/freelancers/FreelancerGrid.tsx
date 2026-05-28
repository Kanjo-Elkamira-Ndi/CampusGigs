import type { PublicUser } from "@/types";
import { FreelancerCard } from "./FreelancerCard";

export function FreelancerGrid({ users }: { users: PublicUser[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((u) => <FreelancerCard key={u.id} user={u} />)}
    </div>
  );
}
