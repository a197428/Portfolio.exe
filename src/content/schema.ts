import { z } from 'zod';

export const localeSchema = z.enum(['ru', 'en']);
export const roleSchema = z.enum(['ai', 'frontend']);

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  kind: z.enum(['demo', 'source']).default('source'),
});

const sourceSchema = z.object({
  repository: z.string().url(),
  commit: z.string().regex(/^[a-f0-9]{40}$/),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  visibility: z.enum(['public', 'private']).default('private'),
});

const chapterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(['production-integration', 'production-ui']),
  video: z.string().min(1),
  poster: z.string().min(1),
  task: z.string().min(1),
  capabilities: z.array(z.string().min(1)).min(1),
  architecture: z.array(z.string().min(1)).min(1),
  contribution: z.array(z.string().min(1)).min(1),
  decisions: z.array(z.string().min(1)).min(1),
  verification: z.array(z.string().min(1)).min(1),
  roleFocus: z.object({ ai: z.string().min(1), frontend: z.string().min(1) }),
  source: sourceSchema,
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  locale: localeSchema,
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  status: z.enum(['production', 'mvp', 'active', 'concept']),
  roles: z.array(roleSchema).min(1),
  featured: z.boolean().default(false),
  priority: z.object({ ai: z.number().int(), frontend: z.number().int() }).default({
    ai: 0,
    frontend: 0,
  }),
  summary: z.string().min(1),
  task: z.string().min(1),
  contribution: z.array(z.string().min(1)).min(1),
  decisions: z.array(z.string().min(1)).min(1),
  capabilities: z.array(z.string().min(1)).min(1).optional(),
  architecture: z.array(z.string().min(1)).min(1).optional(),
  verification: z.array(z.string().min(1)).min(1).optional(),
  stack: z.array(z.string().min(1)).min(1),
  outcome: z.string().min(1),
  roleFocus: z.object({ ai: z.string().min(1), frontend: z.string().min(1) }),
  links: z.array(linkSchema).default([]),
  source: sourceSchema.optional(),
  media: z
    .object({ poster: z.string().min(1), video: z.string().min(1).optional() })
    .optional(),
  cardPreview: z.string().min(1).optional(),
  chapters: z.array(chapterSchema).default([]),
  body: z.string().default(''),
});

export const profileSchema = z.object({
  locale: localeSchema,
  name: z.string().min(1),
  location: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  roleProfiles: z.object({
    ai: z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      skills: z.array(z.string().min(1)).min(1),
    }),
    frontend: z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      skills: z.array(z.string().min(1)).min(1),
    }),
  }),
  experience: z.array(z.string().min(1)).min(1),
  credentials: z
    .array(z.object({ title: z.string().min(1), text: z.string().min(1) }))
    .length(3),
  contacts: z.object({
    email: z.string().email(),
    telegram: z.string().url(),
    github: z.string().url(),
  }),
  avatar: z.string().min(1).optional(),
  body: z.string().default(''),
});

export const contentSchema = z.object({
  profiles: z.array(profileSchema).length(2),
  projects: z.array(projectSchema).min(2),
});

export type PortfolioProject = z.infer<typeof projectSchema>;
export type PortfolioProfile = z.infer<typeof profileSchema>;
