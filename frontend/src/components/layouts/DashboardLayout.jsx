// import * as React from "react";
// import { styled, useTheme } from "@mui/material/styles";
// import {
//   Box,
//   CssBaseline,
//   AppBar as MuiAppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Drawer as MuiDrawer,
//   Divider,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { Outlet, useNavigate } from "react-router-dom";

// // === Drawer width ===
// const drawerWidth = 240;

// // === Custom styled components for AppBar and Drawer ===
// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// const Drawer = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   ...(open && {
//     "& .MuiDrawer-paper": {
//       width: drawerWidth,
//     },
//   }),
//   ...(!open && {
//     "& .MuiDrawer-paper": {
//       width: theme.spacing(7) + 1,
//     },
//   }),
// }));

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// // === DashboardLayout ===
// export default function DashboardLayout({ title, navItems }) {
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);
//   const navigate = useNavigate();

//   const handleDrawerOpen = () => setOpen(true);
//   const handleDrawerClose = () => setOpen(false);
//   const handleNavigation = (link) => navigate(link);

//   return (
//     <Box sx={{ display: "flex" }}>
//       <CssBaseline />
//       {/* Top AppBar */}
//       <AppBar position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
//             edge="start"
//             sx={[{ marginRight: 5 }, open && { display: "none" }]}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div">
//             {title}
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar Drawer */}
//       <Drawer variant="permanent" open={open}>
//         <DrawerHeader>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//           </IconButton>
//         </DrawerHeader>
//         <Divider />
//         <List>
//           {navItems.map((navItem, index) => (
//             <ListItem key={index} disablePadding sx={{ display: "block" }}>
//               <ListItemButton
//                 sx={[
//                   { minHeight: 48, px: 2.5 },
//                   open ? { justifyContent: "initial" } : { justifyContent: "center" },
//                 ]}
//                 onClick={() => handleNavigation(navItem.link)}
//               >
//                 <ListItemIcon
//                   sx={[
//                     { minWidth: 0, justifyContent: "center" },
//                     open ? { mr: 3 } : { mr: "auto" },
//                   ]}
//                 >
//                   <navItem.icon />
//                 </ListItemIcon>
//                 <ListItemText
//                   primary={navItem.component}
//                   sx={[open ? { opacity: 1 } : { opacity: 0 }]}
//                 />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//         <Divider />
//       </Drawer>

//       {/* Main Content */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <DrawerHeader />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }
