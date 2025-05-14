// Shared styles for Transaction Form components

export const formStyles = {
  // Section containers
  sectionContainer: "space-y-6",
  sectionHeader: "space-y-2",
  sectionTitle: "text-2xl font-semibold text-white",
  sectionDescription: "text-white/70",

  // Cards
  card: "p-6 backdrop-blur-lg bg-white/80 border-white/30 text-slate-800",
  cardTransparent: "p-6 backdrop-blur-lg bg-transparent border-white/30",

  // Form elements
  formGroup: "space-y-4",
  label: "text-white font-medium",
  requiredField: "text-red-500",
  input: "bg-white/90 border-white/30 text-slate-800 placeholder:text-slate-400",
  select: "bg-white/90 border-white/30 text-slate-800",
  switch: "data-[state=checked]:bg-brand-gold",

  // Buttons
  primaryButton: "bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-6 py-2 h-10 rounded-md transition-all shadow-sm",
  secondaryButton: "bg-white/10 hover:bg-white/20 text-white border-white/20 px-6 py-2 h-10 rounded-md transition-all shadow-sm",
  iconButton: "inline-flex items-center gap-2",

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