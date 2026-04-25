import { pgTable, serial, text, numeric, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const components = pgTable('components', {
  id: serial('id').primaryKey(),
  category: text('category').notNull(),
  model: text('model').notNull(),
  brand: text('brand'),
  line: text('line'),
  link: text('link'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
});

export const componentsRelations = relations(components, ({ many }) => ({
  buildComponents: many(buildComponents),
}));

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  brand: text('brand').notNull(),
  line: text('line').notNull(),
  configuration: text('configuration').notNull(),
  frontShifter: text('front_shifter'),
  rearShifter: text('rear_shifter'),
  frontDerailleur: text('front_derailleur'),
  rearDerailleur: text('rear_derailleur'),
  cassette: text('cassette'),
  bottomBracket: text('bottom_bracket'),
  chain: text('chain'),
  crankset: text('crankset'),
  axleType: text('axle_type'),
});

export const builds = pgTable('builds', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull().default('0'),
});

export const buildsRelations = relations(builds, ({ many }) => ({
  buildComponents: many(buildComponents),
}));

export const buildComponents = pgTable('build_components', {
  id: serial('id').primaryKey(),
  buildId: integer('build_id').references(() => builds.id),
  componentId: integer('component_id').references(() => components.id),
});

export const buildComponentsRelations = relations(buildComponents, ({ one }) => ({
  build: one(builds, {
    fields: [buildComponents.buildId],
    references: [builds.id],
  }),
  component: one(components, {
    fields: [buildComponents.componentId],
    references: [components.id],
  }),
}));

