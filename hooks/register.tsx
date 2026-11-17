import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import type { ElfMode } from '../types'
import { makeColors } from './make-colors.js'
import { MASCOT, pick } from './mascot'
import { STANDING } from './standing'

// 黒髪・紫インナーカラーのエルフ。ダークはジャケットの黒、ライトは白シャツ。
const { theme, problems } = makeColors({
  label: 'Elf Violet',
  roles: { accent: '#7b5cc4', danger: '#8e2238', success: '#4f8a6a', warning: '#b5852a', pro: '#a98be0' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#ebe8f0',
        'surface-1': '#f3f1f6',
        'surface-2': '#fbfafc',
        'text-primary': '#1c1a21',
        'text-secondary': '#45404f',
        'text-muted': '#5d5767',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#141317',
        'surface-1': '#1b1a1f',
        'surface-2': '#222027',
        'surface-3': '#29262f',
        'text-primary': '#efeaf6',
        'text-secondary': '#cbc3d8',
        'text-muted': '#a69eb3',
      },
    },
  },
})

// ジャケットの紫ライン、ネクタイのワインレッド、ゆっくり漂う紫の光。
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<style>
.bg { fill: #ebe8f0; }
.line { stroke: #7b5cc4; }
.soft { stroke: #c9b3ec; }
.tie { stroke: #7a2236; }
.mote { fill: #7b5cc4; }
@media (prefers-color-scheme: dark) {
  .bg { fill: #141317; }
  .soft { stroke: #4a3d6b; }
  .mote { fill: #c9b3ec; }
}
.glow { animation: breathe 9s ease-in-out infinite; }
.m1 { animation: drift 22s ease-in-out infinite; }
.m2 { animation: drift 28s ease-in-out infinite reverse; }
.m3 { animation: drift 34s ease-in-out infinite; }
@keyframes breathe { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.9; } }
@keyframes drift { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(18px, -26px); } }
</style>
<rect class="bg" x="0" y="0" width="100%" height="100%"/>
<svg x="0" y="0" width="100%" height="100%" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<!-- upper left trim -->
<g class="glow" fill="none" stroke-linecap="round">
<path class="soft" d="M -40 250 L 300 -40" stroke-width="14" opacity="0.5"/>
<path class="line" d="M -40 300 L 360 -40" stroke-width="3"/>
<path class="line" d="M -40 330 L 390 -40" stroke-width="1.5" opacity="0.6"/>
</g>
<!-- lower right trim and tie -->
<g class="glow" fill="none" stroke-linecap="round">
<path class="soft" d="M 1250 1040 L 1640 700" stroke-width="14" opacity="0.5"/>
<path class="line" d="M 1200 1040 L 1640 660" stroke-width="3"/>
<path class="line" d="M 1170 1040 L 1640 630" stroke-width="1.5" opacity="0.6"/>
<path class="tie" d="M 1320 1040 L 1640 760" stroke-width="5" opacity="0.7"/>
</g>
<!-- motes -->
<g opacity="0.35">
<circle class="mote m1" cx="180" cy="420" r="3"/>
<circle class="mote m2" cx="1420" cy="260" r="2.5"/>
<circle class="mote m3" cx="1480" cy="520" r="2"/>
<circle class="mote m2" cx="110" cy="760" r="2"/>
<circle class="mote m1" cx="1340" cy="140" r="3"/>
</g>
</svg>
${STANDING}
</svg>`

const mode = atom({ plugin: 'elf-violet', key: 'mode' } as const, null as ElfMode)

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'elf-violet' } }

export const register: Register = on => {
  let isDrawn = false

  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    isDrawn = (await $.theme.set(LOOK)).isDrawn

    return next(e)
  })

  // デスクトップが後からつながったときに、テーマを掛け直す。
  on('session.attach', async ($, e, next) => {
    isDrawn = (await $.theme.set(LOOK)).isDrawn

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="右下に立つエルフの先輩と、紫のジャケットライン、漂う紫の光" isInteractive />
  })

  // 作業中の行に、キャラの顔とひとこと。
  on('ui.render', { component: 'Spinner' }, ($, e, next) => {
    if (e.surface !== 'desktop') {
      return next(e)
    }
    const { Box, Svg, Text } = $.ui.resolve(e)
    const line = e.props.message ?? pick(e.props.mode, e.props.word)

    return (
      <Box flexDirection="row" alignItems="center" gap={1}>
        <Svg source={MASCOT} alt="エルフの先輩" width={30} height={24} isInteractive />
        <Text color="accent">{line}</Text>
      </Box>
    )
  })

  // 作業中は入力欄の上に、大きめのキャラとひとこと。
  on('turn.start', async ($, e, next) => {
    if (!isDrawn) {
      isDrawn = (await $.theme.set(LOOK)).isDrawn
    }
    if (e.agentId === undefined) {
      await update($, mode, () => 'thinking')
    }

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    if (e.agentId === undefined) {
      await update($, mode, () => 'tool-use')
    }

    return next(e)
  }).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      await update($, mode, () => null)
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const now = await read($, mode)

    if (e.surface !== 'desktop' || e.props.hasSurvey || now === null) {
      return next(e)
    }
    const { Box, Svg, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="row" alignItems="center" gap={2}>
        <Svg source={MASCOT} alt="エルフの先輩" width={90} height={72} isInteractive />
        <Text color="accent">{pick(now, now)}</Text>
      </Box>
    )
  })
}
