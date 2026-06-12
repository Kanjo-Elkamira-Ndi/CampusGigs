import type { Review } from "@/types";
import { Avatar } from "@/components/shared/Avatar";
import { StarRating } from "./StarRating";
import { format } from "date-fns";

export function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar id={review.reviewer.id} name={review.reviewer.fullName} size={36} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-medium text-sm">{review.reviewer.fullName}</div>
              <div className="text-xs text-muted-foreground">on “{review.gig.title}” · {format(new Date(review.createdAt), "d MMM yyyy")}</div>
            </div>
            <StarRating value={review.rating} readOnly size={14} />
          </div>
          <p className="text-sm mt-2 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
