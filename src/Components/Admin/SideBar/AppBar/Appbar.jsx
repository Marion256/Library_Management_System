import React, {useState} from 'react'
import {
    AppBar,
    Box,
    Container,
    IconButton,
    Typography,
    createTheme,
    useMediaQuery,
  } from "@mui/material";

  import {
    DarkMode,
    LightMode,
  } from "@mui/icons-material";

  // Create custom theme
const getTheme = (mode) =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: "#16a34a", // green-600
          light: "#22c55e", // green-500
          dark: "#15803d", // green-700
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#f59e0b", // amber-500
          light: "#fbbf24", // amber-400
          dark: "#d97706", // amber-600
          contrastText: "#ffffff",
        },
        background: {
          default: mode === "light" ? "#f8fafc" : "#0f172a", // slate-50 or slate-900
          paper: mode === "light" ? "#ffffff" : "#1e293b", // white or slate-800
        },
        text: {
          primary: mode === "light" ? "#334155" : "#e2e8f0", // slate-700 or slate-200
          secondary: mode === "light" ? "#64748b" : "#94a3b8", // slate-500 or slate-400
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 700,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
        },
        h6: {
          fontWeight: 600,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: "none",
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow:
                mode === "light"
                  ? "0px 2px 4px rgba(0, 0, 0, 0.05)"
                  : "0px 2px 4px rgba(0, 0, 0, 0.2)",
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": {
                boxShadow:
                  mode === "light"
                    ? "0px 4px 8px rgba(0, 0, 0, 0.1)"
                    : "0px 4px 8px rgba(0, 0, 0, 0.3)",
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
            },
          },
        },
      },
    });

function Appbar() {
    const [mode, setMode] = useState("light");
    const theme = React.useMemo(() => getTheme(mode), [mode]);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

     // Custom styles
  const styles = {
    heroSection: {
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(to right, #166534, #16a34a)",
      padding: theme.spacing(8, 2),
      color: "#ffffff",
    },
    heroContent: {
      position: "relative",
      zIndex: 10,
      maxWidth: 700,
    },
    heroBackground: {
      position: "absolute",
      right: -80,
      bottom: 0,
      opacity: 0.1,
    },
    filterSection: {
      marginBottom: theme.spacing(4),
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
    },
    metricBox: {
      backgroundColor:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, 0.03)"
          : "rgba(255, 255, 255, 0.05)",
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
    },
    ctaSection: {
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(to right, #166534, #16a34a)",
      padding: theme.spacing(4),
      borderRadius: theme.shape.borderRadius,
      color: "#ffffff",
      marginBottom: theme.spacing(4),
    },
    ctaContent: {
      position: "relative",
      zIndex: 10,
      maxWidth: 700,
    },
    ctaBackground: {
      position: "absolute",
      right: -80,
      bottom: 0,
      opacity: 0.1,
    },
    footer: {
      borderTop: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(4, 0),
      backgroundColor:
        theme.palette.mode === "light"
          ? "rgba(0, 0, 0, 0.02)"
          : "rgba(255, 255, 255, 0.02)",
    },
  };

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      };
  return (
   <>
       <AppBar position="sticky" color="default" elevation={1}>
          <Container>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* <Spa sx={{ color: theme.palette.primary.main }} /> */}
                <Typography variant="h6" fontWeight="bold">
                  Admin Dashboard
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={toggleColorMode} color="inherit">
                  {theme.palette.mode === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Box>
            </Box>
          </Container>
        </AppBar>
   </>
  )
}

export default Appbar
