'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export interface NavItem {
  title?: string;
  links: { href: string; text: string; emoji?: string }[];
}

interface Props {
  href: string;
  label: string;
  items: NavItem[];
  wide?: boolean;
}

export function NavDropdown({ href, label, items, wide }: Props) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const enter = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  const leave = () => { closeTimer.current = setTimeout(() => setOpen(false), 180); };

  return (
    <div className={`nav-item ${open ? 'open' : ''}`} onMouseEnter={enter} onMouseLeave={leave}>
      <Link href={href}>{label}</Link>
      <div className={`nav-drop ${wide ? 'wide' : ''}`}>
        <div className={`nav-drop-grid ${items.length === 2 ? 'cols-2' : ''}`}>
          {items.map((col, i) => (
            <div className="nav-drop-col" key={i}>
              {col.title && <div className="nav-drop-head">{col.title}</div>}
              {col.links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.emoji && <span className="nav-emoji">{l.emoji}</span>}
                  {l.text}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}