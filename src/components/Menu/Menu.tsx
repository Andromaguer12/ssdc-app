"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { Collapse, IconButton, Link } from '@mui/material';
import { ExpandLess, ExpandMore, Logout } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { userLogoutFunction } from '@/redux/reducers/user/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import { makeStyles } from '@mui/styles'

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const useStyles = makeStyles({
    paper: {
        background: '#0000007a',
        backdropFilter: 'blur(5px)',
    },
});

const Menu = () => {
    const dispatch = useAppDispatch()
    const fContext = useFetchingContext()
    const classes = useStyles()
    

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const [open, setOpen] = React.useState(true);

      const { name } = useAppSelector(({ user }) => user)

    const handleClick = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        dispatch(userLogoutFunction({ context: fContext }))
    }

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, true)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem>
                    <ListItemIcon>
                        <AccountCircleIcon color="secondary" sx={{ fontSize: 50 }} />
                    </ListItemIcon>
                    <div>
                        <ListItemText sx={{ color: "#fff "}} primary={name} />
                        <ListItemText sx={{ color: "#7a7a7a", fontSize: "13px !important" }} primary={"Admin"} />
                    </div>
                </ListItem>
            </List>
            <Divider />
            <List>
                {['Usuarios'].map((text, index) => (
                    <Link href={'/admin/dashboard'} underline="none" color={"inherit"}>
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PeopleAltIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText sx={{ color: "#fff "}} primary={text} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <List
                sx={{ width: '100%', maxWidth: 360 }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                <ListItemButton onClick={() => {
                    handleClick();
                }}>
                    <ListItemIcon>
                        <EmojiEventsIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: "#fff "}} primary="Torneos" />
                    {open ? <ExpandLess color="secondary" /> : <ExpandMore color="secondary" />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <DriveFileRenameOutlineIcon color="secondary" />
                            </ListItemIcon>
                            <Link href={'/admin/tournaments'} underline="none" color={"inherit"}>
                                <ListItemText sx={{ color: "#fff "}} primary="Administrar Torneos" />
                            </Link>
                        </ListItemButton>
                    </List>
                    {/* <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <ChecklistIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText sx={{ color: "#fff "}} primary="Torneos Activos" />
                        </ListItemButton>
                    </List> */}
                </Collapse>
            </List>
            <List
                sx={{ width: '100%', maxWidth: 360, position: 'absolute', bottom: 0 }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                <ListItemButton onClick={handleLogout} sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <Logout color='secondary' />
                    </ListItemIcon>
                    <ListItemText sx={{ color: "#fff "}} primary="Cerrar Sesion" />
                </ListItemButton>
            </List>
        </Box >
    );

    return (
        <div>
            <React.Fragment>
                <IconButton onClick={toggleDrawer("left", true)}>
                    <MenuIcon style={{ color: '#ffffff' }} />
                </IconButton>
                <Drawer
                    anchor={"left"}
                    open={state["left"]}
                    classes={{
                        paper: classes.paper
                    }}
                    onClose={toggleDrawer("left", false)}
                >
                    {list("left")}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export { Menu };
