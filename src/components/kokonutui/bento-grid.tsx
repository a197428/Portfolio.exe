/** Adapted from Kokonut UI Bento Grid, MIT. */
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { PortfolioProject } from '@/content/schema';

export default function BentoGrid({ projects }: { projects: PortfolioProject[] }) {
  return (
    <div className="portfolio-bento">
      {projects.map((project, index) => (
        <motion.article
          className="bento-project glass-panel"
          data-size={index === 0 ? 'wide' : 'regular'}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.2) }}
          key={project.slug}
        >
          <span className="project-index">{String(index + 2).padStart(3, '0')}</span>
          <div>
            <p className="card-eyebrow">{project.eyebrow}</p>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
          </div>
          <div className="card-footer">
            <div className="tag-row">
              {project.stack.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <Link to={`/projects/${project.slug}`} aria-label={project.title}>
              <ArrowUpRight />
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
