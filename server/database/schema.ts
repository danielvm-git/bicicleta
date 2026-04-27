import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const brands = pgTable("brands", {
  id: text("id").primaryKey(), // Normalized brand name (e.g., "shimano", "sram")
  name: text("name").notNull().unique(), // Display name (e.g., "Shimano", "SRAM")
  url: text("url").notNull(),
  logoFilename: text("logo_filename"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  model: text("model").notNull(),
  brand: text("brand"),
  line: text("line"),
  functionalGroup: text("functional_group"),
  link: text("link"),
  imageUrl: text("image_url"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  weight: numeric("weight", { precision: 10, scale: 3 }), // in kg, 3 decimals for grams
  speeds: text("speeds"),
  steeringType: text("steering_type"),
  axleType: text("axle_type"),
  suspensionTravel: text("suspension_travel"),
  performanceLevel: text("performance_level"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const componentPrices = pgTable("component_prices", {
  id: serial("id").primaryKey(),
  componentId: integer("component_id").references(() => components.id, {
    onDelete: "cascade",
  }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const componentPricesRelations = relations(
  componentPrices,
  ({ one }) => ({
    component: one(components, {
      fields: [componentPrices.componentId],
      references: [components.id],
    }),
  })
);

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  line: text("line").notNull(),
  configuration: text("configuration").notNull(),
  frontShifter: text("front_shifter"),
  rearShifter: text("rear_shifter"),
  frontDerailleur: text("front_derailleur"),
  rearDerailleur: text("rear_derailleur"),
  cassette: text("cassette"),
  bottomBracket: text("bottom_bracket"),
  chain: text("chain"),
  crankset: text("crankset"),
  axleType: text("axle_type"),
});

export const bikes = pgTable("bikes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  slug: text("slug").unique(),
  isPublic: boolean("is_public").default(false),
  userId: text("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bikesRelations = relations(bikes, ({ many }) => ({
  bikeComponents: many(bikeComponents),
}));

export const bikeComponents = pgTable("bike_components", {
  id: serial("id").primaryKey(),
  bikeId: integer("bike_id").references(() => bikes.id, {
    onDelete: "cascade",
  }),
  componentId: integer("component_id").references(() => components.id, {
    onDelete: "cascade",
  }),
});

export const componentsRelations = relations(components, ({ many, one }) => ({
  bikeComponents: many(bikeComponents),
  prices: many(componentPrices),
  brandRelation: one(brands, {
    fields: [components.brand],
    references: [brands.id],
  }),
}));

export const bikeComponentsRelations = relations(bikeComponents, ({ one }) => ({
  bike: one(bikes, {
    fields: [bikeComponents.bikeId],
    references: [bikes.id],
  }),
  component: one(components, {
    fields: [bikeComponents.componentId],
    references: [components.id],
  }),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  components: many(components),
  groups: many(groups),
}));
