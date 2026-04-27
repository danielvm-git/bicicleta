<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";

const props = defineProps<{
  brandName: string;
  matrix: any;
}>();

const { fitView, onNodeClick } = useVueFlow();

const nodes = ref<any[]>([]);
const edges = ref<any[]>([]);
const expandedNodes = ref<Set<string>>(new Set(["root"]));

const areas = [
  "Transmissão",
  "Freios",
  "Rodas",
  "Cockpit",
  "Estrutura",
  "Conforto",
];
const levels = ["Pro", "Mid", "Entry"];

const buildGraph = () => {
  const newNodes: any[] = [];
  const newEdges: any[] = [];

  // 1. Root Node
  const rootId = "root";
  newNodes.push({
    id: rootId,
    label: props.brandName,
    position: { x: 400, y: 0 },
    type: "input",
    class: "root-node cursor-pointer",
    data: { expanded: expandedNodes.value.has(rootId) },
  });

  if (!expandedNodes.value.has(rootId)) {
    nodes.value = newNodes;
    edges.value = [];
    return;
  }

  let areaX = 0;
  const areaSpacing = 280;
  const verticalSpacing = 160;

  areas.forEach((area, areaIdx) => {
    const areaId = `area-${areaIdx}`;
    const hasComponents = levels.some(
      (lvl) => props.matrix[area][lvl]?.length > 0
    );

    if (!hasComponents) return;

    // 2. Area Nodes
    const isAreaExpanded = expandedNodes.value.has(areaId);
    newNodes.push({
      id: areaId,
      label: area,
      position: { x: areaX, y: verticalSpacing },
      class: `area-node cursor-pointer ${isAreaExpanded ? "expanded" : ""}`,
      data: { expanded: isAreaExpanded },
    });

    newEdges.push({
      id: `e-root-${areaId}`,
      source: rootId,
      target: areaId,
      animated: isAreaExpanded,
    });

    if (isAreaExpanded) {
      // 3. Level Nodes
      levels.forEach((level, lvlIdx) => {
        const levelId = `${areaId}-${level}`;
        const components = props.matrix[area][level] || [];

        if (components.length === 0) return;

        const isLevelExpanded = expandedNodes.value.has(levelId);
        newNodes.push({
          id: levelId,
          label: `${level} Performance`,
          position: { x: areaX, y: verticalSpacing * 2 + lvlIdx * 120 },
          class: `level-node level-${level.toLowerCase()} cursor-pointer ${isLevelExpanded ? "expanded" : ""}`,
          data: { expanded: isLevelExpanded },
        });

        newEdges.push({
          id: `e-${areaId}-${levelId}`,
          source: areaId,
          target: levelId,
        });

        if (isLevelExpanded) {
          // 4. Component Nodes
          const compId = `${levelId}-comps`;
          const compLabels = components.map((c: any) => c.model).join("\n");

          newNodes.push({
            id: compId,
            label: compLabels,
            position: { x: areaX, y: verticalSpacing * 2 + lvlIdx * 120 + 80 },
            class: "component-node",
            style: {
              whiteSpace: "pre-wrap",
              textAlign: "left",
              fontSize: "10px",
            },
          });

          newEdges.push({
            id: `e-${levelId}-${compId}`,
            source: levelId,
            target: compId,
            style: { strokeDasharray: "5,5" },
          });
        }
      });
    }

    areaX += areaSpacing;
  });

  nodes.value = newNodes;
  edges.value = newEdges;
};

onNodeClick(({ node }) => {
  if (
    node.id.startsWith("root") ||
    node.id.startsWith("area-") ||
    node.id.includes("Performance")
  ) {
    if (expandedNodes.value.has(node.id)) {
      expandedNodes.value.delete(node.id);
    } else {
      expandedNodes.value.add(node.id);
    }
    buildGraph();
    setTimeout(() => fitView({ padding: 0.2 }), 50);
  }
});

watch(
  () => props.matrix,
  () => {
    expandedNodes.value = new Set(["root"]);
    // Auto-expand areas if not too many
    areas.forEach((_, i) => expandedNodes.value.add(`area-${i}`));
    buildGraph();
  },
  { immediate: true }
);

onMounted(() => {
  setTimeout(() => fitView({ padding: 0.2 }), 200);
});
</script>

<template>
  <div
    class="h-[750px] w-full border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-[#fdfcfb] dark:bg-gray-950 shadow-2xl relative"
  >
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="true"
      :default-viewport="{ zoom: 0.5 }"
      class="brand-flow"
    >
      <Background pattern-color="#e5e7eb" :gap="24" :size="1" />
      <Controls position="bottom-right" />

      <div
        class="absolute top-4 left-4 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <p
          class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1"
        >
          Dica
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-300">
          Clique nos nós para expandir ou colapsar os detalhes.
        </p>
      </div>
    </VueFlow>
  </div>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
@import "@vue-flow/controls/dist/style.css";

.brand-flow .vue-flow__node {
  @apply rounded-xl border-2 bg-white dark:bg-gray-900 p-4 font-display text-gray-800 dark:text-gray-100 shadow-md transition-all duration-300;
}

.brand-flow .vue-flow__node:hover {
  @apply shadow-xl;
}

@media (prefers-reduced-motion: no-preference) {
  .brand-flow .vue-flow__node:hover {
    @apply scale-105;
  }
}

.brand-flow .vue-flow__node.root-node {
  @apply bg-primary text-white border-primary text-2xl font-black px-10 py-6;
}

.brand-flow .vue-flow__node.area-node {
  @apply border-primary/30 bg-primary/5 text-lg font-bold min-w-[180px] text-center;
}

.brand-flow .vue-flow__node.area-node.expanded {
  @apply border-primary bg-primary/10;
}

.brand-flow .vue-flow__node.level-node {
  @apply border-gray-200 dark:border-gray-700 text-sm font-medium min-w-[150px] text-center;
}

.brand-flow .vue-flow__node.level-pro {
  @apply border-primary/50 text-primary;
}
.brand-flow .vue-flow__node.level-mid {
  @apply border-orange-400/50 text-orange-600;
}
.brand-flow .vue-flow__node.level-entry {
  @apply border-gray-400/50 text-gray-500;
}

.brand-flow .vue-flow__node.component-node {
  @apply border-0 bg-transparent p-0 shadow-none pointer-events-none text-gray-500 dark:text-gray-400;
}

.brand-flow .vue-flow__edge-path {
  @apply stroke-primary/20 stroke-2 transition-all duration-500;
}

.brand-flow .vue-flow__edge.animated .vue-flow__edge-path {
  @apply stroke-primary/40;
  stroke-dasharray: 8;
  animation: flow-dash 1s linear infinite;
}

@keyframes flow-dash {
  from {
    stroke-dashoffset: 16;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
