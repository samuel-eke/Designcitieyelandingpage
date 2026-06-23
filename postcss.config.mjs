/**
 * PostCSS Configuration for Next.js + Tailwind CSS v4
 *
 * Next.js uses PostCSS for CSS processing, so we use @tailwindcss/postcss
 * instead of the Vite-specific @tailwindcss/vite plugin.
 */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
