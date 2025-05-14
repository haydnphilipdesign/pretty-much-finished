/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx,css}"],
    safelist: [
        'bg-brand-blue',
        'text-brand-blue',
        'bg-brand-gold',
        'text-brand-gold',
        'bg-brand-cream',
        'text-brand-cream',
        'hover:bg-brand-cream',
        'hover:text-brand-cream',
        'border-brand-blue',
        'border-brand-gold',
        'border-brand-cream',
        'bg-white',
        'bg-red-50/50',
        'border-red-500',
        'border-yellow-500',
        'border-green-500',
        'border-gray-300',
        'border-transparent',
        'border-[#1e3a8a]',
        'bg-[#1e3a8a]',
        'bg-[#ffd7ba]/10',
        'bg-[#ffd7ba]/20',
        'hover:bg-[#ffd7ba]/20',
        'hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
        'shadow-[0_2px_8px_rgba(0,0,0,0.15)]',
        'text-gray-900',
        'text-gray-500',
        'text-red-500'
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                'brand-blue': '#0066CC',
                'brand-gold': '#FFB81C',
                'brand-cream': '#e9c77b',
                'brand-navy': '#0F1C2E',
                'brand-red': '#EF4444',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                'fadeIn': 'fadeIn 0.2s ease-in-out',
            },
        },
    },
    plugins: [],
};