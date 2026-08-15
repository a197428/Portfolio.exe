import generated from '@/generated/content.json';
import { contentSchema, type PortfolioProject } from '@/content/schema';
import type { Locale, Role } from '@/features/preferences/store';

const content = contentSchema.parse(generated);

export function getProfile(locale: Locale) {
  return content.profiles.find((profile) => profile.locale === locale)!;
}

export function getProjects(locale: Locale, role: Role) {
  return content.projects
    .filter((project) => project.locale === locale && project.roles.includes(role))
    .sort(
      (left, right) =>
        right.priority[role] - left.priority[role] ||
        Number(right.featured) - Number(left.featured),
    );
}

export function getProject(slug: string, locale: Locale): PortfolioProject | undefined {
  return content.projects.find(
    (project) => project.slug === slug && project.locale === locale,
  );
}

export { content };
