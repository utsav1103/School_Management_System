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
    background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)", // dark gradient
    boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
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
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page, i) => (
                <MenuItem key={i} onClick={()=>{handleCloseNavMenu(page.link)}} 
                 sx={{
    color: "#ddd",
    "&:hover": {
      background: "rgba(255,255,255,0.08)",
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