import { env } from "../../env";

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
  },
};
