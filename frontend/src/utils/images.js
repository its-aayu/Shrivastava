import { imageBank } from "../data/site";

export function handleImageError(event) {
  if (event.currentTarget.src === imageBank.fallback) return;
  event.currentTarget.src = imageBank.fallback;
}
