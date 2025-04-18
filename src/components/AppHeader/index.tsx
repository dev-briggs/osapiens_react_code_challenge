import {
  Grow,
  Box,
  Theme,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
import AvatarMenu from "../AvatarMenu";
import { observer } from "mobx-react";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1,
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  height: theme.tokens.header.height,
}));

const AppHeader = React.forwardRef<HTMLDivElement, AppHeaderProps>(
  (props, ref) => {
    const { user, pageTitle } = props;
    const { t, i18n } = useTranslation("app");
    const theme = useTheme();

    const [count, setCount] = useState(0);
    const [countdownInterval, setCountdownInterval] = useState<
      NodeJS.Timeout | undefined
    >(undefined);
    const [language, setLanguage] = useState(i18n.language);

    const hours = 1;
    const minutes = hours * 60;
    const seconds = minutes * 60;
    const countdown = seconds - count;
    const countdownMinutes = `${~~(countdown / 60)}`.padStart(2, "0");
    const countdownSeconds = (countdown % 60).toFixed(0).padStart(2, "0");

    useEffect(() => {
      setCountdownInterval(
        setInterval(() => {
          setCount((c) => c + 1);
        }, 1000)
      );

      return () => clearInterval(countdownInterval);
    }, []);

    useEffect(() => {
      if (countdown <= 0) {
        clearInterval(countdownInterval);
      }
    }, [countdown, countdownInterval]);

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
      const selectedLanguage = event.target.value as string;
      setLanguage(selectedLanguage);
      i18n.changeLanguage(selectedLanguage);
    };

    return (
      <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
        <Toolbar sx={{ background: "#08140C 0% 0% no-repeat padding-box" }}>
          <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
            <Box>
              <Typography variant="h6" component="div" color="primary">
                {countdownMinutes}:{countdownSeconds}
              </Typography>
            </Box>
            <Box sx={{ width: 20, height: 20, flex: 1 }} />
            <Box sx={{ flex: 2 }}>
              <Typography
                sx={{
                  ...typoStyle,
                  color: theme.palette.primary.main,
                  mb: theme.spacing(0.5),
                }}
                variant="h6"
                component="div"
              >
                {t("appTitle").toLocaleUpperCase()}
              </Typography>
              <Typography
                sx={{ ...typoStyle }}
                variant="overline"
                component="div"
                noWrap
              >
                {pageTitle.toLocaleUpperCase()}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                justifyContent: "flex-end",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Select
                value={language}
                onChange={handleLanguageChange}
                sx={{ color: "white", borderColor: "white", marginRight: 2 }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
              </Select>
              {user && user.eMail && (
                <Grow in={Boolean(user && user.eMail)}>
                  <div>
                    <AvatarMenu user={user} />
                  </div>
                </Grow>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
);

export default observer(AppHeader);
