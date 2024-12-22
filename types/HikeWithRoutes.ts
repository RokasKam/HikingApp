import { Hike } from "./Hike";
import { Route } from "./Route";

export type HikeWithRoutes = Hike & {
  routes: Route[];
};
  