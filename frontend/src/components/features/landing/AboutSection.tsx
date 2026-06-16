import type { CmsAbout } from "@/lib/prismic";
import { SectionLabel } from "./SectionLabel";

export function AboutSection({ content }: { content: CmsAbout }) {
  return (
    <section className="bg-white px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 md:gap-8">
        <SectionLabel>{content.title}</SectionLabel>
        <p className="text-center text-base leading-relaxed text-foreground md:text-lg">
          {content.content}
        </p>
      </div>
    </section>
  );
}
