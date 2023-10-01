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
import { Collapse, Link } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Menu = () => {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

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
                        <AccountCircleIcon sx={{ fontSize: 50 }} />
                    </ListItemIcon>
                    <ListItemText primary={"Username"} secondary={"Admin"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                {['Usuarios'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                <ListItemButton onClick={() => {
                    handleClick();
                }}>
                    <ListItemIcon>
                        <EmojiEventsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Torneos" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <DriveFileRenameOutlineIcon />
                            </ListItemIcon>
                            <Link href={'/tournaments'} underline="none" color={"inherit"}>
                                <ListItemText primary="Administrar Toreneos" />
                            </Link>
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <ChecklistIcon />
                            </ListItemIcon>
                            <ListItemText primary="Torneos Activos" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>

        </Box >
    );

    return (
        <div>
            <React.Fragment>
                <MenuIcon onClick={toggleDrawer("left", true)} fontSize="large" />
                <Drawer
                    anchor={"left"}
                    open={state["left"]}
                    onClose={toggleDrawer("left", false)}
                >
                    {list("left")}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export { Menu };
