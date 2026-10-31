import { STYLE_INFO } from '@/lib/studio/types';
import { TEMPLATES, type StudioTemplate } from '@/lib/studio/templates';

import { Section, SectionHeading, MutedText } from '../shared/Section';
import StudioSwatch from '../StudioSwatch';
import * as S from './styles';

export default function StudioEmptyState() {
  const renderTemplate = (template: StudioTemplate) => (
    <li key={template.id}>
      <S.TemplateLink href={`/studio/new?template=${template.id}`}>
        <S.Swatch>
          <StudioSwatch colors={template.spec.colors} style={template.spec.style} speed={template.spec.speed} brightness={template.spec.brightness} />
        </S.Swatch>
        <S.TemplateText>
          <S.TemplateName>{template.spec.name}</S.TemplateName>
          <S.TemplateTagline>{template.tagline} · {STYLE_INFO[template.spec.style].label}</S.TemplateTagline>
        </S.TemplateText>
      </S.TemplateLink>
    </li>
  );

  return (
    <S.Wrap>
      <S.Hero>
        <S.HeroTitle>Make your first routine</S.HeroTitle>
        <MutedText>
          Pick colors, choose how they move, and try it on the lights. Start from scratch, or tap a starter below and make it yours.
        </MutedText>
      </S.Hero>
      <Section>
        <SectionHeading>Starters</SectionHeading>
        <S.Grid>{TEMPLATES.map(renderTemplate)}</S.Grid>
      </Section>
    </S.Wrap>
  );
}
