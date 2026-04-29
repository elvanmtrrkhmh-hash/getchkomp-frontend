import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  showText?: boolean;
  textSize?: string;
}

/**
 * StarRating Component
 * Displays stars with support for half stars based on decimal rating
 * 
 * Example:
 * - 4.8 → ████.░░
 * - 4.5 → ████◐░
 * - 3.2 → ███◐░░
 */
export const StarRating = ({
  rating = 0,
  size = 16,
  showText = true,
  textSize = "text-sm",
}: StarRatingProps) => {
  // Normalize rating to 0-5
  const normalizedRating = Math.max(0, Math.min(5, rating));

  // Calculate stars
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      {/* Stars Container */}
      <div className="flex items-center gap-0.5">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="fill-primary text-primary"
            style={{ width: size, height: size }}
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div
            className="relative shrink-0"
            style={{ width: size, height: size }}
          >
            {/* Empty background */}
            <Star
              className="absolute inset-0 text-muted-foreground/30"
              style={{ width: size, height: size }}
            />
            {/* Half filled */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: size / 2 }}>
              <Star
                className="fill-primary text-primary"
                style={{ width: size, height: size }}
              />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="text-muted-foreground/30"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Rating Text */}
      {showText && (
        <span className={`font-medium text-muted-foreground ${textSize}`}>
          {Number(normalizedRating).toFixed(1)} / 5.0
        </span>
      )}
    </div>
  );
};

export default StarRating;
