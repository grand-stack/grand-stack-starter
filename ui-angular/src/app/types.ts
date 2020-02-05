export type User = {
  id: string;
  name: string;
  avgStars: number;
  numReviews: number;
  recommendations?: Business[];
}

export type Business = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  avgStars: number;
  reviews?: Review[];
}

export type Review = {
  id: string;
  stars: number;
  text: string;
  date: Neo4jDate;
  business?: Business;
  user?: User;
}

export type Neo4jDate = {
  year: number;
  month: number;
  day: number;
  formatted: string;
}

export type Query = {
  User?: User[];
  Business?: Business[];
  Review?: Review[];
  usersBySubstring?: User[];
}
