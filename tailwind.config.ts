import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand/main": "#FAFF7D",
        "cal1/light": "#FBEBDA",
        "cal1/dark": "#E78823",
        "cal15/dark": "#0ABEFF",
        "cal2/light": "#E9ECE9",
        "cal2/dark": "#7C8E7B",
        "cal3/light": "#E7E7EE",
        "cal3/dark": "#6D709C",
        dark: "#2F1847",
        "error-50": "#FEF3F2",
        "error-100": "#F4DBCE",
        "error-200": "#FECDCA",
        "error-300": "#C84C09",
        "error-400": "#DA885B",
        "error-500": "#A73F07",
        "error-600": "#642604",
        "error-700": "#B42318",
        "main-100": "#FEFFE5",
        "main-200": "#FDFFD4",
        "main-400": "#FAFF7D",
        "main-600": "#7D803E",
        "secondary-100": "#D8DAD6",
        "secondary-200": "#BEC1BA",
        "secondary-300": "#7E8475",
        "secondary-400-main": "#3D4630",
        "secondary-600": "#1E2318",
        "grey-50": "#F9FAFB",
        "grey-100": "#FCFCFD",
        "grey-200": "#F2F4F7",
        "grey-300": "#D0D5DD",
        "grey/350": "#979FAF",
        "grey/400": "#667085",
        "grey/500": "#344054",
        "success-50": "#ECFDF3",
        "success-100": "#D5E2DB",
        "success-200": "#ABEFC6",
        "success-300": "#729E86",
        "success-400": "#2C6E49",
        "success-700": "#067647",
        "warning/50": "#FFFAEB",
        "warning/100": "#FFF5D6",
        "warning/200": "#FEDF89",
        "warning/400": "#FFCE31",
        "warning/700": "#B54708",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        onboard: 'url("/Gradient.svg")',
      },
      backgroundColor: {
        "brand/main": "#FAFF7D",
        "call-15/light": "#D6F4FF",
        "main-400": "#FAFF7D",
        "secondary-200": "#BEC1BA",
        "secondary-300": "#7E8475",
        "secondary-400": "#3D4630",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      lineHeight: {
        "160": "1.6",
      },
      border: {
        "secondary-300": "#7E8475",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
