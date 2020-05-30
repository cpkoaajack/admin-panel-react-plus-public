import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
//Drawer
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//AppBar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
//import InputBase from '@material-ui/core/InputBase';
//import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
//Drawer Icon
import DashboardIcon from '@material-ui/icons/Dashboard';
import StorefrontIcon from '@material-ui/icons/Storefront';
import MapIcon from '@material-ui/icons/Map';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import BugReportIcon from '@material-ui/icons/BugReport';
//AppBar Icon
import MenuIcon from '@material-ui/icons/Menu';
//import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MoreIcon from '@material-ui/icons/MoreVert';

import { Redirect, Link } from 'react-router-dom';
import { BASE_URL } from '../constants.js';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    /* 
    Don't need styling depends on screen width

    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    }, 
    
    */
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  list: {
    width: 250,
  },
}));

const NavigationBar = (props) => {
  const classes = useStyles();
  const [isLogout, setIslogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [title, setTitle] = useState('Dashboard');
  const [userName, setUserName] = useState('Loading...');

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const menuId = 'primary-search-account-menu';

  const style = {
    link: { color: '#676767', textDecoration: 'none' },
    userName: { padding: '20px 15px 0 0' },
    appBarUserName: { paddingTop: '15px' },
  };

  /* 
  passing an empty array as second argument triggers the callback in useEffect
  only after the initial render thus replicating `componentDidMount` lifecycle behaviour
  */
  useEffect(() => {
    const fetchUserName = async () => {
      let response;
      try {
        response = await fetch(
          `${BASE_URL}/user?token=${localStorage.adminAccessToken}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        response = await response.json();

        if (response.success && response.data.role === 'admin') {
          setUserName(response.data.name);
        } else {
          setUserName(response.message);
        }
      } catch (error) {
        console.error(error);

        setUserName('No response from server');
      }
    };

    fetchUserName();
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken');
    setIslogout(true);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* Handle Logout Here */}
      <MenuItem onClick={handleLogout}>
        <IconButton
          aria-label='logout from current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <ExitToAppIcon />
        </IconButton>
        <p style={style.userName}>Logout</p>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p style={style.userName}>{userName}</p>
      </MenuItem>
    </Menu>
  );

  //Drawer
  const [state, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState(open);
  };

  const list = () => (
    <div
      className={clsx(classes.list)}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <Link style={style.link} to='/dashboard'>
          <ListItem
            button
            key='Dashboard'
            onClick={() => setTitle('Dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItem>
        </Link>
        <Link style={style.link} to='/dashboard/shops?page=1'>
          <ListItem button key='Shops' onClick={() => setTitle('Shops')}>
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText primary='Shops' />
          </ListItem>
        </Link>
        <Link style={style.link} to='/dashboard/activities?page=1'>
          <ListItem
            button
            key='Activities'
            onClick={() => setTitle('Activities')}
          >
            <ListItemIcon>
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary='Activities' />
          </ListItem>
        </Link>
        <Link style={style.link} to='/dashboard/tags?page=1'>
          <ListItem button key='Tags' onClick={() => setTitle('Tags')}>
            <ListItemIcon>
              <LocalOfferIcon />
            </ListItemIcon>
            <ListItemText primary='Tags' />
          </ListItem>
        </Link>
        <Link style={style.link} to='/dashboard/news?page=1'>
          <ListItem button key='News' onClick={() => setTitle('News')}>
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary='News' />
          </ListItem>
        </Link>
        <Link style={style.link} to='/dashboard/shopTypes?page=1'>
          <ListItem
            button
            key='Shop Types'
            onClick={() => setTitle('Shop Types')}
          >
            <ListItemIcon>
              <LocalMallIcon />
            </ListItemIcon>
            <ListItemText primary='Shop Types' />
          </ListItem>
        </Link>
        <Link style={style.link} to='/dashboard/reports?page=1'>
          <ListItem button key='Reports' onClick={() => setTitle('Reports')}>
            <ListItemIcon>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText primary='Reports' />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <ListItem key={userName}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={userName} />
        </ListItem>
      </List>
    </div>
  );

  //Handle logout
  if (isLogout) {
    return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
  }

  return (
    <div className={classes.grow}>
      <AppBar position='static'>
        <Toolbar>
          {/* Menu drawer opening place */}
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant='h6' noWrap>
            {title}
          </Typography>
          {/* No need search box here
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
           */}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Typography className={classes.title} variant='h6' noWrap>
              <p style={style.appBarUserName}>{`${userName}`}</p>
            </Typography>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}

      <SwipeableDrawer
        anchor={'left'}
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </div>
  );
};

export default NavigationBar;
