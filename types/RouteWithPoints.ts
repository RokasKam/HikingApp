import { Point } from "./Point";
import { Route } from "./Route";

export type RouteWithPoints = Route & {
    points: Point[];
  };