import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';

import Button from '@mui/material/Button';
import { AuthContext } from "../../../context/AuthContext";

import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
 

function Navbar() {
  const { user, authenticated } = React.useContext(AuthContext)
  const [pages,setPages]=React.useState([
    {link:"/", component:"Home"},
    {link:"/login", component:"Login"},
    {link:"/register", component:"Register"},

])
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  

  const navigate = useNavigate();
  const handleCloseNavMenu = (link) => {
    setAnchorElNav(null);
    navigate(link)
  };

  React.useEffect(()=>{
    if(authenticated){
      setPages([
    {link:"/", component:"Home"},
    {link:"/logout", component:"Log Out"},
    {link:`${user.role.toLowerCase()}`, component:"Dashboard"},

])
    }
  },[])

  

  return (
    <AppBar position="static" 
     
  sx={{
    background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 40%, #262626 100%)", // deep dark gradient
    backgroundImage: "url(/images/dark-wood.jpg)", // reuse wooden texture
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    color: "white",
    boxShadow: "0 4px 25px rgba(0,0,0,0.8)", // heavy shadow for depth
    borderBottom: "1px solid rgba(255, 255, 255, 0.15)", // subtle metallic edge
    backdropFilter: "blur(6px)", // glassy feel
  }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SCHOOL MANAGEMENT SYSTEM
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
                size="large"
  aria-label="account of current user"
  aria-controls="menu-appbar"
  aria-haspopup="true"
  onClick={handleOpenNavMenu}
  color="inherit"
  sx={{
    color:"#ffffff", // default gold
    border: "2px solid rgba(255,215,0,0.5)",
    borderRadius: "8px",
    transition: "all 0.4s ease",
    "&:hover": {
      background: "rgba(255,215,0,0.1)",
      boxShadow: "0 0 15px rgba(255, 215, 0, 0.8)",
    },
    "& svg": {
      transition: "all 0.4s ease",
    },
    "&:hover svg": {
      background: "linear-gradient(45deg, #FFD700, #FFFFFF)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent", // makes the gradient visible
    },
  }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
    display: { xs: 'block', md: 'none' },
    "& .MuiPaper-root": {
      backgroundColor: "rgba(20,20,20,0.95)", // dark semi-transparent
      color: "#fff", // white text
      boxShadow: "0 4px 20px rgba(0,0,0,0.8)",
      borderRadius: "12px",
    },
  }}
            >
              {pages.map((page, i) => (
                <MenuItem key={i} onClick={()=>{handleCloseNavMenu(page.link)}} 
                 sx={{
    color: "#fff",
    "&:hover": {
      background: "rgba(255,255,255,0.01)",
      color: "#FFD700",
    },
  }}
  >
                  <Typography sx={{ textAlign: 'center' }}>{page.component}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SCHOOL MANAGEMENT SYSTEM
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page,i) => (
              <Button
                key={i}
                onClick={()=>{handleCloseNavMenu(page.link)}}
                sx={{
    my: 2,
    color: "#FFD700", // gold text
    display: "block",
    fontWeight: "bold",
    textTransform: "uppercase",
    "&:hover": {
      color: "#fff",
      background: "rgba(255, 215, 0, 0.2)", // gold hover
      borderRadius: "8px",
    },
  }}
              >
                {page.component}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;