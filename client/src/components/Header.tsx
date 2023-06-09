import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { getUser, removeUser } from "../utils/localStorage";
import { useHistory } from "react-router";
import getAccessToken from "../utils/getAccessToken";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Cart } from "../types/cart";
import { Dispatch, SetStateAction } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import { primary, secondary, tertiary } from "../utils/color";
import LogoutIcon from "@mui/icons-material/Logout";
import SellIcon from "@mui/icons-material/Sell";
import { User } from "../types/user";
import { Role } from "../enum";

interface HeaderProps {
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
  cart: Array<Cart>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOpenOrder: Dispatch<SetStateAction<boolean>>;
}

export default function Header(props: HeaderProps) {
  const { sections, title, cart, setOpen, setOpenOrder } = props;
  const history = useHistory();
  const user: User | null = getUser();
  const handleSignOut = async () => {
    try {
      const access_token: string = await getAccessToken();
      await axios.get(
        `${process.env.REACT_APP_BASE_SERVER_URL_DEV}/api/v1/auth/logout`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      removeUser();
      history.push("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Toolbar
        sx={{
          backgroundColor: primary,
        }}
      >
        <Typography variant="h6" color={secondary}>
          Buy & Sell
        </Typography>

        <Typography
          component="h2"
          variant="h5"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          <RouterLink
            style={{ textDecoration: "none", color: secondary }}
            to="/home"
          >
            {title}
          </RouterLink>
        </Typography>
        {user?.role === Role.SELLER ? (
          <IconButton
            sx={{ mr: "1.5rem", color: secondary }}
            onClick={() => {
              history.push("/admin");
            }}
          >
            <SellIcon />
          </IconButton>
        ) : (
          <></>
        )}

        <IconButton
          onClick={() => {
            setOpenOrder(true);
          }}
          sx={{ mr: "1.5rem", color: secondary }}
        >
          <InventoryIcon />
        </IconButton>

        <IconButton
          onClick={() => {
            setOpen(true);
          }}
          sx={{ mr: "1.5rem", color: secondary }}
        >
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleSignOut} sx={{ color: secondary }}>
          <LogoutIcon />
        </IconButton>
        <div></div>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{
          justifyContent: "space-between",
          overflowX: "auto",
          backgroundColor: secondary,
        }}
      >
        {sections.map((section) => (
          <Link
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{
              color: primary,
              textDecoration: "none",
              p: 1,
              flexShrink: 0,
              fontSize: "1rem",
            }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </>
  );
}
