import { useEffect, useState } from 'react';
import { theme } from '../theme/theme';

type Breakpoint = keyof typeof theme.breakpoints;

export const breakpointValues = Object.entries(theme.breakpoints).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: parseInt(value),
  }),
  {} as Record<Breakpoint, number>
);

export const useBreakpoint = (breakpoint: Breakpoint) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${theme.breakpoints[breakpoint]})`);
    setMatches(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
};

export const useIsMobile = () => {
  return !useBreakpoint('md');
};

export const useIsTablet = () => {
  const isTablet = useBreakpoint('md');
  const isDesktop = useBreakpoint('lg');
  return isTablet && !isDesktop;
};

export const useIsDesktop = () => {
  return useBreakpoint('lg');
};

// Layout utilities
export const getResponsiveValue = <T>(
  value: T | Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint
): T | undefined => {
  if (typeof value === 'object' && value !== null) {
    const breakpoints = Object.keys(breakpointValues) as Breakpoint[];
    const breakpointIndex = breakpoints.indexOf(currentBreakpoint);

    // Find the closest defined breakpoint value
    for (let i = breakpointIndex; i >= 0; i--) {
      const breakpoint = breakpoints[i];
      if (value[breakpoint] !== undefined) {
        return value[breakpoint];
      }
    }
  }
  return value as T;
};
