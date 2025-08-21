const PALETTE = [
  "#18A0FB", // blue
  "#F97316", // orange
  "#10B981", // emerald
  "#A855F7", // purple
  "#EF4444", // red
  "#14B8A6", // teal
  "#F59E0B", // amber
  "#6366F1", // indigo
];

export const getFavoriteColor = (
  coinId: string,
  favorites: { id: string }[]
): string => {
  const idx = Math.max(0, favorites.findIndex((c) => c.id === coinId));
  return PALETTE[idx % PALETTE.length];
};

export const favoritePalette = PALETTE;