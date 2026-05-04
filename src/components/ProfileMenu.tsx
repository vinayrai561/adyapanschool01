'use client';

import { type ComponentType, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  LogOut,
  Pencil,
  RefreshCw,
  Settings,
  User,
  UserCircle2,
} from 'lucide-react';

type ProfileMenuProps = {
  userName?: string | null;
  onLogout: () => Promise<void> | void;
};

type MenuItem = {
  label: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
  danger?: boolean;
  dividerBefore?: boolean;
  action?: () => void;
};

export default function ProfileMenu({ userName, onLogout }: ProfileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => {
    if (!userName) return 'U';
    const parts = userName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [userName]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const items: MenuItem[] = [
    { label: 'My Profile', href: '/profile', icon: UserCircle2 },
    { label: 'My Courses', href: '/courses', icon: BookOpen },
    { label: 'Edit Profile', href: '/edit-profile', icon: Pencil },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Update Profile', href: '/update-profile', icon: RefreshCw },
    {
      label: 'Logout',
      icon: LogOut,
      danger: true,
      dividerBefore: true,
      action: () => onLogout(),
    },
  ];

  const handleItemClick = async (item: MenuItem) => {
    closeMenu();
    if (item.action) {
      await item.action();
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur transition-all hover:border-orange-200 hover:shadow-md"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 sm:block">
          {userName || 'User'}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        role="menu"
        className={[
          'absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-2xl border border-white/40 bg-white/85 p-2 shadow-2xl backdrop-blur-xl transition-all duration-200',
          isOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0',
        ].join(' ')}
      >
        <div className="mb-2 rounded-xl bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="truncate text-sm font-semibold text-gray-800">{userName || 'User'}</p>
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label}>
              {item.dividerBefore ? <div className="my-2 border-t border-gray-200" /> : null}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleItemClick(item)}
                className={[
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-gray-900',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
