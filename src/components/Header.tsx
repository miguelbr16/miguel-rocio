"use client";

import Link from "next/link";
import { NAV_ITEMS, type SectionId } from "@/lib/constants";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface HeaderProps {
  active: SectionId;
  menuOpen: boolean;
  onNavigate: (id: SectionId) => void;
  onMenuToggle: () => void;
}

export function Header({ active, menuOpen, onMenuToggle, onNavigate }: HeaderProps) {
  const { initials } = useSiteConfig();

  function select(id: SectionId) {
    onNavigate(id);
    if (menuOpen) onMenuToggle();
  }

  return (
    <>
      {menuOpen ? (
        <div className="mobile-scrim md:hidden" onClick={onMenuToggle} role="presentation" />
      ) : null}

      <header className="site-header">
        <div className="site-header-bar">
          <div className="site-header-inner">
            <button
              type="button"
              className="menu-btn"
              onClick={onMenuToggle}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <span className={`menu-line ${menuOpen ? "menu-line-open-a" : ""}`} />
              <span className={`menu-line ${menuOpen ? "menu-line-open-b" : ""}`} />
              <span className={`menu-line ${menuOpen ? "menu-line-open-c" : ""}`} />
            </button>

            <button type="button" onClick={() => onNavigate("inicio")} className="site-brand">
              {initials}
            </button>

            <nav className="site-nav-desktop" aria-label="Navegación principal">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  id={`tab-${item.id}`}
                  role="tab"
                  aria-selected={active === item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`site-nav-link ${active === item.id ? "site-nav-link-active" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="hidden w-10 md:block" aria-hidden />
          </div>
        </div>
      </header>

      <nav
        className={`mobile-drawer md:hidden ${menuOpen ? "mobile-drawer-open" : ""}`}
        aria-label="Menú móvil"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer-head">
          <span className="site-brand">{initials}</span>
          <button
            type="button"
            className="menu-btn"
            onClick={onMenuToggle}
            aria-label="Cerrar menú"
          >
            <span className="menu-line menu-line-open-a" />
            <span className="menu-line menu-line-open-b" />
            <span className="menu-line menu-line-open-c" />
          </button>
        </div>

        <p className="mobile-drawer-label">Explorar</p>
        <ul className="mobile-drawer-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => select(item.id)}
                className={`mobile-drawer-item ${active === item.id ? "mobile-drawer-item-active" : ""}`}
              >
                <span className="mobile-drawer-icon">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <Link href="/configurador" className="mobile-drawer-admin" onClick={onMenuToggle}>
          Configurador privado
        </Link>
      </nav>
    </>
  );
}
