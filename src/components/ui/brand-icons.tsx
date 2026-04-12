/**
 * brand-icons.tsx
 * Custom SVG brand icons not available in lucide-react v1+,
 * which removed all third-party brand logos from its icon set.
 * Each component accepts standard SVG/className props so it is a
 * drop-in replacement for the removed lucide-react exports.
 */
import type { SVGProps } from 'react';

export const LinkedinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M20.447 20.452H17.01v-5.569c0-1.327-.024-3.037-1.851-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667H9.587V9h3.308v1.561h.047c.46-.872 1.583-1.791 3.257-1.791 3.484 0 4.128 2.293 4.128 5.274v6.409zM5.337 7.433a1.92 1.92 0 1 1 0-3.84 1.92 1.92 0 0 1 0 3.84zM6.956 20.452H3.717V9h3.239v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.228.792 24 1.771 24h20.451C23.2 24 24 23.228 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
