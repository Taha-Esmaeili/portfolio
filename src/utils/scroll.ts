export function smoothScrollTo(elementId: string, offset = 80): void {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;
  
  if (prefersReducedMotion) {
    window.scrollTo(0, offsetPosition);
    return;
  }
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

export function setupScrollSpy(
  sectionIds: string[],
  onChange: (activeId: string) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null;
  }
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
    ...options,
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onChange(entry.target.id);
      }
    });
  }, defaultOptions);
  
  sectionIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      observer.observe(element);
    }
  });
  
  return observer;
}

export function getActiveSection(sectionIds: string[]): string | null {
  const scrollPosition = window.scrollY + window.innerHeight / 3;
  
  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const id = sectionIds[i];
    if (!id) continue;
    const element = document.getElementById(id);
    if (element && element.offsetTop <= scrollPosition) {
      return id;
    }
  }

  return sectionIds[0] ?? null;
}