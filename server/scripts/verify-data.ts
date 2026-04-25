import { db } from '../database/db';
import { components, groups, builds, buildComponents } from '../database/schema';
import { count, eq } from 'drizzle-orm';

async function verify() {
  console.log('--- Verificação S01 ---');
  
  const [compCount] = await db.select({ value: count() }).from(components);
  const [groupCount] = await db.select({ value: count() }).from(groups);
  const [buildCount] = await db.select({ value: count() }).from(builds);
  const [buildCompCount] = await db.select({ value: count() }).from(buildComponents);

  console.log(`Components: ${compCount.value}`);
  console.log(`Groups: ${groupCount.value}`);
  console.log(`Builds: ${buildCount.value}`);
  console.log(`BuildComponents: ${buildCompCount.value}`);

  // Sample check: get a build and its components using joins
  const sampleBuilds = await db.select({
    buildName: builds.name,
    compCategory: components.category,
    compModel: components.model,
  })
  .from(builds)
  .leftJoin(buildComponents, eq(builds.id, buildComponents.buildId))
  .leftJoin(components, eq(buildComponents.componentId, components.id))
  .limit(10);

  if (sampleBuilds.length > 0) {
    console.log(`Sample Build: ${sampleBuilds[0].buildName}`);
    for (const row of sampleBuilds) {
       console.log(` - [${row.compCategory}] ${row.compModel}`);
    }
  }

  if (compCount.value > 0 && groupCount.value === 11 && buildCount.value >= 38) {
    console.log('✅ Ingestão validada com sucesso!');
    process.exit(0);
  } else {
    console.log('❌ Ingestão incompleta ou com erros.');
    process.exit(1);
  }
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
