import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

export const theme = createTheme({
  palette: {
    primary:   { main: tokens.colors.brand.red,     dark: tokens.colors.brand.redDark },
    secondary: { main: tokens.colors.brand.midnight },
    error:     { main: tokens.colors.semantic.danger },
    warning:   { main: tokens.colors.semantic.warning },
    success:   { main: tokens.colors.semantic.success },
    info:      { main: tokens.colors.semantic.info },
    background: { default: tokens.colors.brand.lightGray, paper: '#FFFFFF' },
    text: {
      primary:   tokens.colors.brand.midnight,
      secondary: tokens.colors.brand.darkGray,
    },
  },
  typography: {
    fontFamily: '"Inter", Arial, Helvetica, sans-serif',
    h1: { fontSize: 28, fontWeight: 700, color: tokens.colors.brand.midnight },
    h2: { fontSize: 22, fontWeight: 600, color: tokens.colors.brand.midnight },
    h3: { fontSize: 16, fontWeight: 600, color: tokens.colors.brand.midnight },
    body1: { fontSize: 14, color: tokens.colors.brand.darkGray },
    body2: { fontSize: 12, color: tokens.colors.brand.darkGray },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
      },
      variants: [
      {
        props: { variant: 'contained', color: 'primary' },
        style: {
          backgroundColor: tokens.colors.brand.red,
          '&:hover': {
            backgroundColor: tokens.colors.brand.redDark,
          },
        },
      },
    ],

    },
    MuiTextField: {
      defaultProps: { size: "small", variant: "outlined" },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 8, boxShadow: '0 1px 3px 0 rgb(0 0 0/0.08)' } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500, borderRadius: 99 } },
    },
    MuiTableHead: {
      styleOverrides: { root: { backgroundColor: tokens.colors.brand.lightGray } },
    },
    MuiTableCell: {
      styleOverrides: { head: { fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' } },
    },
  },
});