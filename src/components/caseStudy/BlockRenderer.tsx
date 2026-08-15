/**
 * BlockRenderer — dispatches Block[] to individual block components.
 * Closed union: every type in types.ts must be handled here.
 */
import type { Block } from '../../content/types'
import { Text } from './blocks/Text'
import { StatRow } from './blocks/StatRow'
import { ImageBlock } from './blocks/ImageBlock'
import { Compare } from './blocks/Compare'
import { Rejected } from './blocks/Rejected'
import { Flow } from './blocks/Flow'
import { PrototypeEmbed } from './blocks/PrototypeEmbed'
import { Quote } from './blocks/Quote'
import { Matrix } from './blocks/Matrix'
import { Board } from './blocks/Board'
import { HeroStats } from './blocks/HeroStats'
import { ChallengeSolution } from './blocks/ChallengeSolution'
import { PhaseCards } from './blocks/PhaseCards'
import { WordList } from './blocks/WordList'
import { TimelineBlock } from './blocks/TimelineBlock'
import { ScreensGrid } from './blocks/ScreensGrid'

interface BlockRendererProps {
  blocks: Block[]
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return <Text key={i} body={block.body} />
          case 'statRow':
            return <StatRow key={i} stats={block.stats} />
          case 'image':
            return (
              <ImageBlock
                key={i}
                frame={block.frame}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
                slug={block.slug}
                placeholder={block.placeholder}
              />
            )
          case 'compare':
            return <Compare key={i} before={block.before} after={block.after} />
          case 'rejected':
            return <Rejected key={i} items={block.items} />
          case 'flow':
            return <Flow key={i} steps={block.steps} />
          case 'prototype':
            return (
              <PrototypeEmbed
                key={i}
                slug={block.slug}
                poster={block.poster}
                title={block.title}
                note={block.note}
              />
            )
          case 'board':
            return (
              <Board
                key={i}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
                tone={block.tone}
                placeholder={block.placeholder}
              />
            )
          case 'heroStats':
            return <HeroStats key={i} items={block.items} />
          case 'challengeSolution':
            return (
              <ChallengeSolution key={i} challenge={block.challenge} solution={block.solution} />
            )
          case 'phaseCards':
            return <PhaseCards key={i} items={block.items} />
          case 'wordList':
            return (
              <WordList key={i} title={block.title} items={block.items} highlight={block.highlight} />
            )
          case 'timeline':
            return <TimelineBlock key={i} items={block.items} />
          case 'screensGrid':
            return <ScreensGrid key={i} cols={block.cols} items={block.items} />
          case 'quote':
            return <Quote key={i} text={block.text} attribution={block.attribution} />
          case 'matrix':
            return (
              <Matrix
                key={i}
                title={block.title}
                columns={block.columns}
                rows={block.rows}
                totalNote={block.totalNote}
              />
            )
          default: {
            // TypeScript exhaustiveness check
            const _exhaustive: never = block
            void _exhaustive
            return null
          }
        }
      })}
    </div>
  )
}
