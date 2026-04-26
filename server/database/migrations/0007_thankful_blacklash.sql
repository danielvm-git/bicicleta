ALTER TABLE "build_components" RENAME TO "bike_components";--> statement-breakpoint
ALTER TABLE "builds" RENAME TO "bikes";--> statement-breakpoint
ALTER TABLE "bike_components" RENAME COLUMN "build_id" TO "bike_id";--> statement-breakpoint
ALTER TABLE "bikes" DROP CONSTRAINT "builds_slug_unique";--> statement-breakpoint
ALTER TABLE "bike_components" DROP CONSTRAINT "build_components_build_id_builds_id_fk";
--> statement-breakpoint
ALTER TABLE "bike_components" DROP CONSTRAINT "build_components_component_id_components_id_fk";
--> statement-breakpoint
ALTER TABLE "component_prices" DROP CONSTRAINT "component_prices_component_id_components_id_fk";
--> statement-breakpoint
ALTER TABLE "components" ADD COLUMN "functional_group" text;--> statement-breakpoint
UPDATE components SET functional_group = CASE
    WHEN "category" IN ('Cassete', 'Corrente', 'Câmbio Dianteiro', 'Câmbio Traseiro', 'Pedivela', 'Trocador', 'Movimento Central', 'Alavanca de Câmbio', 'Alavanca', 'Transmissão', 'Movimento', 'Pedal', 'Trocador Traseiro') THEN 'Transmissão'
    WHEN "category" IN ('Guidão', 'Mesa', 'Canote', 'Selim', 'Manopla', 'Caixa de Direção', 'Suporte de Guidão', 'Canote de Selim', 'Cockpit') THEN 'Cockpit'
    WHEN "category" IN ('Aro', 'Cubo', 'Raio', 'Par de Cubos', 'Rodas') THEN 'Rodas'
    WHEN "category" IN ('Pneu', 'Câmara', 'Tubeless', 'Pneus', 'Câmara/tubeless') THEN 'Pneus'
    WHEN "category" IN ('Freio', 'Manete de Freio', 'Disco de Freio', 'Discos', 'Freios', 'Pinça') THEN 'Freios'
    WHEN "category" = 'Quadro' THEN 'Quadro'
    WHEN "category" IN ('Suspensão', 'Garfo') THEN 'Suspensão'
    WHEN "category" IN ('Componente', 'Preço Pix', 'Build', 'Nero', 'Wild', 'Prime') THEN 'Sistema'
    ELSE 'Outros'
END;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bike_components" ADD CONSTRAINT "bike_components_bike_id_bikes_id_fk" FOREIGN KEY ("bike_id") REFERENCES "public"."bikes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bike_components" ADD CONSTRAINT "bike_components_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "component_prices" ADD CONSTRAINT "component_prices_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "bikes" ADD CONSTRAINT "bikes_slug_unique" UNIQUE("slug");