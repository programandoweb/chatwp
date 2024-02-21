import { createTheme } from '@mui/material/styles';
import { grey, green } from '@mui/material/colors';

export const theme2 = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: green[600],
    },
    secondary: {
      main: grey[500],
    },
    error: {
      main: green[500],
    },
    
    black: {
      main: "black",
    },
    blue: {
      main: "#052b4f",
    },
    tabulator: {
      main: green[500],
    },
    indicatorColor: {
      main: green[500], // Asigna el color deseado para el indicador
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiInput: { // Estilo para los inputs
      styleOverrides: {
        root: {
          background: 'white', // Cambia el fondo a blanco
          // Agrega otros estilos personalizados para los inputs si es necesario
        },
      },
    },
    MuiTextareaAutosize: { // Estilo para los textareas
      styleOverrides: {
        root: {
          background: 'white', // Cambia el fondo a blanco
          // Agrega otros estilos personalizados para los textareas si es necesario
        },
      },
    },
    MuiAppBar: {
      variants:[
        {
          props:{
            variant:'home'
          },
          style: {
            background: 'transparent',
          },
        }
      ]
    },
    MuiGrid: {
      variants: [
        {
          cursor: "pointer",
          props: { variant: 'link' },
          style: {
            color: green[300],
          },
        },
      ],
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'h3' },
          style: {
            fontSize:40,
          },
        },
      ],
    },
    MuiSelect: {
      variants: [
        {
          props: { variant: 'standard' },
          style: {
            fontFamily: 'Bruno Ace',
            fontSize:14,
            border:"solid 1px #333",
            borderRadius: '40px',
            padding:12,
          },
        },
      ],
    },
    MuiCard: {
      variants: [
        {
          props: { variant: 'cardHome' },
          style: {
            border: '2px solid rgba(0,0,0,0.1)', // Borde tenue
            borderRadius: '4px', // Bordes redondeados (opcional)
          },
        },
      ],
    },
    MuiToolbar: {
      variants: [
        {
          props: { variant: 'main' },
          style: {
            minHeight: 40
          },
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform:'capitalize',
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            color: 'white',
            fontWeight:"bold"
          },
        },

        {
          props: { variant: 'outline' },
          style: {
            fontWeight:"bold",
            border:"solid 3px #333",
            width:"200px",
            fontSize: '20px',
              '@media (min-width:600px)': {
                  fontSize: '80px',
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)', // Cambia el color de fondo al hacer hover
            },
          },
        },
      ],
      
    },
  },
});
