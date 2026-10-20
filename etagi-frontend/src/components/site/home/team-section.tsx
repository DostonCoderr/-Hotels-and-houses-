'use client';

import { useTranslation } from '@/lib/i18n';
import type { TeamMember } from '@/lib/types';

export function TeamSection({ members = [] }: { members?: TeamMember[] }) {
  const { t } = useTranslation();

  // ✅ Bo'sh bo'lsa — sektsiyani ko'rsatmaslik (ixtiyoriy)
  if (members.length === 0) return null;

  return (
    <section className="sc" id="team">
      <div className="w">
        <div className="hd2">
          <div>
            <div className="mu" style={{ marginBottom: 6 }}>{t('team_sub')}</div>
            <h2>
              {t('team_title')}{' '}
              <span style={{ color: 'var(--g2)' }}>{t('team_title_highlight')}</span>
            </h2>
          </div>
        </div>

        <div className="team-grid">
          {members.map((member) => (
            <div className="member" key={member.id}>
              <div className="av2">
                <img src={member.img} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <div className="social">
                <a href={member.linkedin || '#'} target="_blank" rel="noopener noreferrer">in</a>
                <a href={member.telegram || '#'} target="_blank" rel="noopener noreferrer">tg</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}