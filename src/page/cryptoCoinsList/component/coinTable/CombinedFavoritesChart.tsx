import React from "react";
import { useFavoriteCoinsStore } from "../../../../util/store/useFavoriteCoinsStore";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../../util/api/QueryKeys";
import { fetchCoinDetails } from "../../../../util/api/fetchCoinDetails";
import { Line, LineChart, Tooltip, YAxis, XAxis, ResponsiveContainer, Legend } from "recharts";
import { getFavoriteColor } from "/src/util/style/favoriteColors";
import Box from "@mui/material/Box";

export const CombinedFavoritesChart: React.FC = () => {
  const { favoriteCoins } = useFavoriteCoinsStore();

  const coinIds = favoriteCoins.map((c) => c.id).sort().join(",");
  const { data: details } = useQuery({
    queryKey: [QueryKeys.GET_CRYPTO_DETAILS, "favorites", coinIds],
    queryFn: () => fetchCoinDetails(favoriteCoins),
    enabled: favoriteCoins.length > 0,
    refetchInterval: 30000,
  });

  if (!details || details.length === 0) return null;

  // Build 24h combined data points
  const points = Array.from({ length: 24 }, (_, i) => {
    const idx = details[0].sparkline_in_7d.price.length - 24 + i;
    const entry: Record<string, number | string> = { t: i };
    details.forEach((d) => {
      entry[d.id] = d.sparkline_in_7d.price[idx];
    });
    return entry;
  });

  return (
    <Box sx={{ backgroundColor: "#212246", padding: 2, borderRadius: 1, marginTop: 2 }}>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={points}>
          <XAxis dataKey="t" hide />
          <YAxis hide />
          <Tooltip contentStyle={{ backgroundColor: "#161730", border: "none" }} />
          <Legend />
          {favoriteCoins.map((coin) => (
            <Line
              key={coin.id}
              type="monotone"
              dataKey={coin.id}
              stroke={getFavoriteColor(coin.id, favoriteCoins)}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};