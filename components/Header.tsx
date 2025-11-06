'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <p className="text-3xl font-black tracking-tighter text-text-light dark:text-text-dark cursor-pointer">
                Anji Codes
              </p>
            </Link>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link
                href="/"
                className={`text-sm font-medium leading-normal transition-all duration-300 transform hover:scale-110 ${
                  isActive('/')
                    ? 'text-vibrant-accent'
                    : 'hover:text-vibrant-accent dark:hover:text-vibrant-accent'
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium leading-normal transition-all duration-300 transform hover:scale-110 ${
                  isActive('/about')
                    ? 'text-vibrant-accent'
                    : 'hover:text-vibrant-accent dark:hover:text-vibrant-accent'
                }`}
              >
                About
              </Link>
              <Link
                href="/projects"
                className={`text-sm font-medium leading-normal transition-all duration-300 transform hover:scale-110 ${
                  isActive('/projects')
                    ? 'text-vibrant-accent'
                    : 'hover:text-vibrant-accent dark:hover:text-vibrant-accent'
                }`}
              >
                Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
