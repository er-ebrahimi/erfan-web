import {
  Bot,
  Circle,
  CircleCheck,
  ClipboardList,
  Image as ImageIcon,
  MessageCircle,
  Sparkles,
  User,
} from 'lucide-react';
import Image from 'next/image';

import { BentoGrid, BentoGridItem } from '../effects/bento-grid';
import { resolveMedia } from '../media';
import type { LandingShowcaseProps } from '../types';

export function LandingShowcase({
  heading,
  sub_heading,
  chat_card,
  image_card,
  quiz_card,
}: LandingShowcaseProps) {
  const imageMedia = resolveMedia(
    image_card?.image,
    image_card?.prompt ?? 'پیش‌نمایش اتاق'
  );

  if (!heading && !sub_heading && !chat_card && !image_card && !quiz_card) {
    return null;
  }

  return (
    <section className="bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        {heading && (
          <h2 className="text-center text-3xl font-extrabold leading-[1.5] text-foreground sm:text-4xl">
            {heading}
          </h2>
        )}
        {sub_heading && (
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground sm:text-lg">
            {sub_heading}
          </p>
        )}

        <BentoGrid className="mt-12">
          {chat_card?.title && (
            <BentoGridItem
              title={chat_card.title}
              description={chat_card.description}
              icon={
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageCircle className="size-4" />
                </div>
              }
              header={
                <div className="flex h-full w-full flex-col justify-center gap-3 rounded-xl border border-border/70 bg-background/90 p-4 shadow-sm backdrop-blur-sm">
                  {chat_card.user_message && (
                    <div className="ms-auto flex max-w-[90%] items-start gap-2">
                      <div className="rounded-2xl rounded-se-sm bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-sm">
                        {chat_card.user_message}
                      </div>
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <User className="size-3.5" />
                      </div>
                    </div>
                  )}
                  {chat_card.ai_message && (
                    <div className="me-auto flex max-w-[90%] items-start gap-2">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="size-3.5" />
                      </div>
                      <div className="rounded-2xl rounded-ss-sm border border-border/80 bg-muted/60 px-3.5 py-2 text-xs leading-relaxed text-foreground">
                        {chat_card.ai_message}
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          )}

          {image_card?.title && (
            <BentoGridItem
              title={image_card.title}
              description={image_card.description}
              icon={
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ImageIcon className="size-4" />
                </div>
              }
              header={
                <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-background/90 p-3 shadow-sm backdrop-blur-sm">
                  {image_card.prompt && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                      <Sparkles className="size-3 shrink-0 text-primary" />
                      <span className="truncate font-mono">
                        {image_card.prompt}
                      </span>
                    </div>
                  )}
                  <div className="relative mt-2 h-36 w-full overflow-hidden rounded-lg border border-border/60">
                    {imageMedia ? (
                      <>
                        <Image
                          src={imageMedia.src}
                          alt={imageMedia.alt}
                          fill
                          sizes="300px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </>
                    ) : (
                      <div className="size-full bg-muted" />
                    )}
                    {image_card.status && (
                      <div className="absolute bottom-2 start-2 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-md">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span>{image_card.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          )}

          {quiz_card?.title && (
            <BentoGridItem
              title={quiz_card.title}
              description={quiz_card.description}
              icon={
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ClipboardList className="size-4" />
                </div>
              }
              header={
                <div className="flex h-full w-full flex-col justify-center rounded-xl border border-border/70 bg-background/90 p-4 shadow-sm backdrop-blur-sm">
                  {quiz_card.question && (
                    <p className="text-start text-xs font-semibold text-foreground">
                      {quiz_card.question}
                    </p>
                  )}
                  <div className="mt-3 space-y-2">
                    {quiz_card.option_a && (
                      <div className="flex items-center justify-between rounded-xl border border-primary/80 bg-primary/10 px-3.5 py-2.5 text-xs font-semibold text-foreground">
                        <span>{quiz_card.option_a}</span>
                        <CircleCheck className="size-4 text-primary" />
                      </div>
                    )}
                    {quiz_card.option_b && (
                      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground">
                        <span>{quiz_card.option_b}</span>
                        <Circle className="size-4 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          )}
        </BentoGrid>
      </div>
    </section>
  );
}
