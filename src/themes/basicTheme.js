import { createMuiTheme } from '@material-ui/core/styles';
import { ruRU } from '@material-ui/core/locale';

const montserrat = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontDisplay: "swap",
    fontWeight: 400,
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
  };
  
  const basicTheme = createMuiTheme({
    palette: {
      primary: {
        light: '#838EA2',
        main: '#838EA2',
        dark: '#838EA2',
        contrastText: "#fff",
      },
      text: {
        primary: "#00000",
        default: '#00000'
    },
    textColor: '#00000',
        primary: {
          main: '#838EA2',
    },
    },
    typography: {
      fontFamily: "Montserrat",
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "@font-face": [montserrat],
        },
      },
    },
}, ruRU);

export default basicTheme;