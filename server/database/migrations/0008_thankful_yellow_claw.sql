ALTER TABLE "components" ADD COLUMN "performance_level" text;--> statement-breakpoint
UPDATE components SET performance_level = CASE
    WHEN "line" IN ('XT', 'XTR', 'Eagle', 'GX', 'SLX', 'PRIME', 'Prime') OR "brand" IN ('RockShox', 'Vittoria') THEN 'Pro'
    WHEN "line" IN ('Deore', 'Cues') THEN 'Mid'
    WHEN "line" IN ('Altus', 'Alivio', 'Acera', 'Tourney', 'SX', 'NERO', 'Nero', 'BRUT', 'Brut', 'Mia', 'Explorer', 'React') OR "brand" IN ('Logan', 'Promax', 'Colli') THEN 'Entry'
    ELSE 'Mid'
END;