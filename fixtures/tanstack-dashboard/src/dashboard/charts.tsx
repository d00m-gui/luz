import { areaY, barY, boxY, defineChart, dot, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import type { LuzStats } from "./stats";

const kb = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function SizesChart({ sizes }: { sizes: LuzStats["sizes"] }) {
  const definition = defineChart({
    marks: [
      barY(sizes, {
        x: "section",
        y: (row) => row.bytes / 1024,
        fill: "var(--primary-500)",
        radius: 4,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand().padding(0.3) },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "KB", ticks: { format: (v) => kb.format(v) } },
      },
    },
    tooltip,
  });

  return (
    <Chart
      definition={definition}
      height={260}
      ariaLabel="Tamaño del CSS generado por sección"
    />
  );
}

export function TokensChart({
  colorTokens,
  sizeTokens,
}: {
  colorTokens: number;
  sizeTokens: number;
}) {
  const rows = [
    { category: "color", count: colorTokens },
    { category: "tamaño", count: sizeTokens },
  ];
  const definition = defineChart({
    marks: [
      barY(rows, {
        x: "category",
        y: "count",
        fill: (row) =>
          row.category === "color"
            ? "var(--primary-500)"
            : "var(--secondary-500)",
        radius: 4,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand().padding(0.4) },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "tokens" },
      },
    },
    tooltip,
  });

  return (
    <Chart
      definition={definition}
      height={220}
      ariaLabel="Composición de tokens: color vs tamaño"
    />
  );
}

export function RunsDistributionChart({ runs }: { runs: LuzStats["runs"] }) {
  const rows = runs.map((run) => ({ group: "luz()", value: run.ms }));
  const definition = defineChart({
    marks: [
      boxY(rows, {
        x: "group",
        y: "value",
        fill: "oklch(from var(--secondary-500) l c h / 30%)",
        stroke: "var(--secondary-500)",
      }),
    ],
    scales: {
      x: { scale: () => scaleBand().padding(0.5) },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "ms" },
      },
    },
    tooltip,
  });

  return (
    <Chart
      definition={definition}
      height={220}
      ariaLabel="Distribución de tiempos de luz() (cuartiles)"
    />
  );
}

export function CompressionChart({
  cssBytes,
  gzipBytes,
}: {
  cssBytes: number;
  gzipBytes: number;
}) {
  const rows = [
    { kind: "raw", kb: cssBytes / 1024 },
    { kind: "gzip", kb: gzipBytes / 1024 },
  ];
  const definition = defineChart({
    marks: [
      barY(rows, {
        x: "kind",
        y: "kb",
        fill: (row) =>
          row.kind === "raw" ? "var(--primary-500)" : "var(--tertiary-500)",
        radius: 4,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand().padding(0.4) },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "KB", ticks: { format: (v) => kb.format(v) } },
      },
    },
    tooltip,
  });

  return (
    <Chart definition={definition} height={220} ariaLabel="CSS crudo vs gzip" />
  );
}

export function RunsScatterChart({
  runs,
  avgMs,
}: {
  runs: LuzStats["runs"];
  avgMs: number;
}) {
  const definition = defineChart({
    marks: [
      dot(runs, {
        x: "run",
        y: "ms",
        r: 4,
        color: (row: LuzStats["runs"][number]) =>
          row.ms <= avgMs ? "ok" : "over",
      }),
    ],
    scales: {
      x: { scale: scaleLinear, axis: { label: "run #" } },
      y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "ms" } },
    },
    color: {
      domain: ["ok", "over"],
      range: ["var(--scheme-success)", "var(--scheme-danger)"],
    },
    tooltip,
  });

  return (
    <Chart
      definition={definition}
      height={220}
      ariaLabel="Corridas sobre y bajo el promedio"
    />
  );
}

export function CumulativeAreaChart({ runs }: { runs: LuzStats["runs"] }) {
  const definition = defineChart({
    marks: [
      areaY(runs, {
        x: "run",
        y: "ms",
        fill: "oklch(from var(--primary-500) l c h / 30%)",
        stroke: "var(--primary-500)",
      }),
    ],
    scales: {
      x: { scale: scaleLinear, axis: { label: "run #" } },
      y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "ms" } },
    },
    tooltip,
  });

  return (
    <Chart
      definition={definition}
      height={220}
      ariaLabel="Área de tiempos por corrida"
    />
  );
}

export function TimingChart({ runs }: { runs: LuzStats["runs"] }) {
  const definition = defineChart({
    marks: [
      lineY(runs, {
        x: "run",
        y: "ms",
        stroke: "var(--secondary-500)",
        points: true,
      }),
    ],
    scales: {
      x: {
        scale: scaleLinear,
        axis: { label: "run #" },
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "ms" },
      },
    },
    tooltip,
  });

  return (
    <Chart
      definition={definition}
      height={260}
      ariaLabel="Tiempo de generación de luz() por corrida"
    />
  );
}
