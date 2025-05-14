// Shared styles for Transaction Form components

export const formStyles = {
  // Container styles
  container: "min-h-screen bg-gradient-to-br from-brand-navy to-brand-navy/90 text-white",
  // Section containers
  sectionContainer: "space-y-6",
  sectionHeader: "space-y-2",
  sectionTitle: "text-2xl font-semibold text-white",
  sectionDescription: "text-white/70",

  // Cards
  card: "p-6 backdrop-blur-lg bg-white/90 rounded-lg border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300 text-slate-800",
  cardTransparent: "p-6 backdrop-blur-lg bg-white/10 rounded-lg border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300",

  // Form elements
  formGroup: "space-y-4 relative",
  label: "text-white font-medium tracking-wide",
  requiredField: "text-red-400 ml-1",
  input: "w-full bg-white/90 border-white/30 text-slate-800 placeholder:text-slate-400 rounded-md focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all duration-200",
  select: "w-full bg-white/90 border-white/30 text-slate-800 rounded-md focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all duration-200",
  switch: "data-[state=checked]:bg-brand-gold transition-colors duration-200",

  // Buttons
  primaryButton: "bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-6 py-2 h-10 rounded-md transition-all shadow-lg hover:shadow-xl font-medium",
  secondaryButton: "bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2 h-10 rounded-md transition-all shadow-md hover:shadow-lg",
  iconButton: "inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200",

  // Navigation
  navigation: "flex items-center justify-between mt-8",
  stepIndicator: "flex items-center gap-2 text-white/70",

  // Utilities
  flexRow: "flex items-center gap-2",
  flexCol: "flex flex-col gap-2",
  grid: "grid gap-4",
  transition: "transition-all duration-300"
};

// Brand colors
export const colors = {
  navy: "#23374f",
  gold: "#e9c476",
  white: "#ffffff",
  slate: {
    800: "#1e293b",
    400: "#94a3b8"
  }
};

// Typography
export const typography = {
  heading: "font-semibold text-white",
  body: "text-white/70",
  label: "font-medium text-white"
};