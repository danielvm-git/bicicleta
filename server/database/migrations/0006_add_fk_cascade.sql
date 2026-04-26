-- CASCADE on component_prices -> components
DO $$ BEGIN
  ALTER TABLE "component_prices" DROP CONSTRAINT "component_prices_component_id_components_id_fk";
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;
--> statement-breakpoint
ALTER TABLE "component_prices" ADD CONSTRAINT "component_prices_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
--> statement-breakpoint

-- build_components (legacy) -> builds + components
DO $$ BEGIN
  IF to_regclass('public.build_components') IS NOT NULL AND to_regclass('public.builds') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "build_components" DROP CONSTRAINT "build_components_build_id_builds_id_fk";
    EXCEPTION
      WHEN undefined_object THEN NULL;
    END;
    BEGIN
      ALTER TABLE "build_components" ADD CONSTRAINT "build_components_build_id_builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."builds"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
    BEGIN
      ALTER TABLE "build_components" DROP CONSTRAINT "build_components_component_id_components_id_fk";
    EXCEPTION
      WHEN undefined_object THEN NULL;
    END;
    BEGIN
      ALTER TABLE "build_components" ADD CONSTRAINT "build_components_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;
--> statement-breakpoint

-- bike_components -> bikes + components
DO $$ BEGIN
  IF to_regclass('public.bike_components') IS NOT NULL AND to_regclass('public.bikes') IS NOT NULL THEN
    BEGIN
      ALTER TABLE "bike_components" DROP CONSTRAINT "bike_components_bike_id_bikes_id_fk";
    EXCEPTION
      WHEN undefined_object THEN NULL;
    END;
    BEGIN
      ALTER TABLE "bike_components" ADD CONSTRAINT "bike_components_bike_id_bikes_id_fk" FOREIGN KEY ("bike_id") REFERENCES "public"."bikes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
    BEGIN
      ALTER TABLE "bike_components" DROP CONSTRAINT "bike_components_component_id_components_id_fk";
    EXCEPTION
      WHEN undefined_object THEN NULL;
    END;
    BEGIN
      ALTER TABLE "bike_components" ADD CONSTRAINT "bike_components_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;
