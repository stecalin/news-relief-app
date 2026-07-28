// shared design tokens
// every color and font in the app should come from here - if we ever want
// to retheme the app, this is the only file that should need to change

export const colors = {
  // backgrounds
  background: '#F6F5FB',
  surface: '#FFFFFF',

  // text
  textPrimary: '#1C1B29',
  textSecondary: '#6F6E7D',
  textMuted: '#A4A3AF',

  // accent - used for search, active tabs, primary actions
  accent: '#5B54E8',
  accentLight: '#ECEBFB',

  // status - used for the "breaking" tag specifically
  breaking: '#E8543E',
  breakingLight: '#FCEAE7',

  // status - reserved for the "how you can help" section later
  help: '#0F6E56',
  helpLight: '#E1F3EC',

  border: '#EBEAF2',
};

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  bold: 'PlusJakartaSans_700Bold',
};