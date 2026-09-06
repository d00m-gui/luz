import { barY, defineChart, lineY } from '@tanstack/charts'
import { Chart } from '@tanstack/charts/react'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import type { LuzStats } from './stats'

const kb = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export function SizesChart({ sizes }: { sizes: LuzStats['sizes'] }) {
  const definition = defineChart({
    marks: [
      barY(sizes, {
        x: 'section',
        y: (row) => row.bytes / 1024,
        fill: 'var(--primary-500)',
        radius: 4,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand().padding(0.3) },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: 'KB', ticks: { format: (v) => kb.format(v) } },
      },
    },
    tooltip,
  })

  return (
    <Chart
      definition={definition}
      height={260}
      ariaLabel="Tamaño del CSS generado por sección"
    />
  )
}

export function TimingChart({ runs }: { runs: LuzStats['runs'] }) {
  const definition = defineChart({
    marks: [
      lineY(runs, {
        x: 'run',
        y: 'ms',
        stroke: 'var(--secondary-500)',
        points: true,
      }),
    ],
    scales: {
      x: {
        scale: scaleLinear,
        axis: { label: 'run #' },
      },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: 'ms' },
      },
    },
    tooltip,
  })

  return (
    <Chart
      definition={definition}
      height={260}
      ariaLabel="Tiempo de generación de luz() por corrida"
    />
  )
}
