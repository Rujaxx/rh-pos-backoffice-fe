import { Restaurant } from "@/types/user.type";

export const mockRestaurants: Restaurant[] = [
  {
    _id: "r1",
    name: {
      en: "Downtown Branch",
      ar: "فرع وسط المدينة",
    },
    location: "Downtown",
  },
  {
    _id: "r2",
    name: {
      en: "Mall Branch",
      ar: "فرع المركز التجاري",
    },
    location: "Shopping Mall",
  },
  {
    _id: "r3",
    name: {
      en: "Airport Branch",
      ar: "فرع المطار",
    },
    location: "Airport Terminal",
  },
];
