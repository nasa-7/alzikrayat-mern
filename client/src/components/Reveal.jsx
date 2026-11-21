import { useEffect, useRef } from 'react';

/** Wrapper that fades its content in when scrolled into view (the original .reveal motion). */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
