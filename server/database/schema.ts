import { pgTable, serial, text, numeric, integer } from 'drizzle-orm/pg-core';

export const components = pgTable('components', {
  id: serial('id').primaryKey(),
  category: text('category').notNull(),
  model: text('model').notNull(),
  link: text('link'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
});

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

export const buildComponents = pgTable('build_components', {
  id: serial('id').primaryKey(),
  buildId: integer('build_id').references(() => builds.id),
  componentId: integer('component_id').references(() => components.id),
});

