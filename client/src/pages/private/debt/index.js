import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import MenuIcon from "@material-ui/icons/Menu";
import Container from "@material-ui/core/Container";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import ptLocale from "date-fns/locale/pt-BR";
import FormControl from "@material-ui/core/FormControl";
import NumberFormat from "react-number-format";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import clsx from "clsx";
import useStyles from "./useStyles";
import { mainListItems } from "../../../components/list-items";
import { doLogout } from "../../../services/utils";
import api from "../../../services/api";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      decimalScale={2}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      decimalSeparator="."
      thousandSeparator
      prefix="R$"
    />
  );
}

export default function Debt({ history, match }) {
  const [openListItens, setOpenListItens] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [select, setSelect] = useState(false);

  const [idDebt] = useState(match.params.id);
  const [clients, setClients] = useState([]);
  const [debt, setDebt] = useState({
    clientId: -1,
    reason: "",
    date: null,
    value: null,
  });

  const classes = useStyles();

  async function snack(msg, v = "error") {
    let snack = {
      variant: v,
      persist: false,
      preventDuplicate: true,
    };
    enqueueSnackbar(msg, snack);
  }

  const handleDrawerOpen = () => {
    setOpenListItens(true);
  };

  const handleDrawerClose = () => {
    setOpenListItens(false);
  };

  const handleExitApp = () => {
    doLogout();
    history.push("/");
  };

  const selectClose = () => {
    setSelect(false);
  };

  const selectOpen = () => {
    setSelect(true);
  };

  async function loadClients() {
    let token = localStorage.getItem("token");
    await api
      .get(`/clients`, { headers: { token: token } })
      .then((response) => {
        if (response.status === 200) {
          setClients(response.data);
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 400) {
            this.snack(error.response.data.message);
          }
        }
      });
  }

  async function loadDebt() {
    if (idDebt) {
      let token = localStorage.getItem("token");
      await api
        .get(`/debt/${idDebt}`, { headers: { token: token } })
        .then((response) => {
          if (response.status === 200) {
            setDebt(response.data);
          }
        })
        .catch(function (error) {
          if (error.response) {
            if (error.response.status === 400) {
              this.snack(error.response.data.message);
            }
          }
        });
    }
  }

  useEffect(() => {
    loadClients();
    loadDebt();
  }, []);

  async function handleSubmit(ev) {
    ev.preventDefault();
    setLoading((prevLoading) => !prevLoading);
    if (!debt.clientId) snack("Cliente é obrigatório");
    else if (debt.reason === "") snack("Motivo é obrigatório");
    else if (debt.date === null) snack("Data é obrigatória");
    else if (debt.value === null) snack("Valor é obrigatório");
    else if (isNaN(debt.value)) snack("Valor é inválido");
    else {
      let body = {
        clientId: debt.clientId,
        date: moment(debt.date).format("YYYY-MM-DDTHH:mm:ss.sssZ"),
        reason: debt.reason,
        value: Number(debt.value),
      };
      let config = { headers: { Token: localStorage.getItem("token") } };
      if (idDebt) {
        await api
          .put(`/debt/${idDebt}`, body, config)
          .then((response) => {
            if (response.status === 200) {
              history.push(`/devedor/${debt.clientId}`);
            }
          })
          .catch(function (error) {
            if (error.response.status === 400) {
              snack(error.response.data.message);
            }
          })
          .finally(() => {
            setLoading((prevLoading) => !prevLoading);
          });
      } else {
        await api
          .post("/debt", body, config)
          .then((response) => {
            if (response.status === 200) {
              history.push("/devedores");
            }
          })
          .catch(function (error) {
            if (error.response.status === 400) {
              snack(error.response.data.message);
            }
          })
          .finally(() => {
            setLoading((prevLoading) => !prevLoading);
          });
      }
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, openListItens && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            variant="persistent"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              openListItens && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dívida
          </Typography>
          <IconButton color="inherit" onClick={handleExitApp}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !openListItens && classes.drawerPaperClose
          ),
        }}
        open={openListItens}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container component="main" className={classes.containerForm}>
          <CssBaseline />
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <div className={classes.date}>
                  <FormControl className={classes.larguraCampo}>
                    <InputLabel id="client">Cliente</InputLabel>
                    <Select
                      id="client"
                      open={select}
                      onClose={selectClose}
                      onOpen={selectOpen}
                      value={debt.clientId}
                      onChange={(event) =>
                        setDebt({
                          ...debt,
                          clientId: event.target.value,
                        })
                      }
                      className={classes.larguraCampo}
                    >
                      {clients.map((cl) => (
                        <MenuItem key={cl.id} value={cl.id}>
                          {cl.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="reason"
                  variant="outlined"
                  fullWidth
                  value={debt.reason}
                  onChange={(event) =>
                    setDebt({
                      ...debt,
                      reason: event.target.value,
                    })
                  }
                  id="reason"
                  label="Motivo da Dívida"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Valor"
                  fullWidth
                  variant="outlined"
                  value={debt.value}
                  onChange={(event) =>
                    setDebt({
                      ...debt,
                      value: event.target.value,
                    })
                  }
                  name="value"
                  id="value"
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                  <KeyboardDatePicker
                    autoOk
                    fullWidth
                    variant="inline"
                    inputVariant="outlined"
                    label="Data de nascimento"
                    format="dd/MM/yyyy"
                    value={debt.date}
                    onChange={(date) =>
                      setDebt({
                        ...debt,
                        date: date,
                      })
                    }
                    InputAdornmentProps={{ position: "start" }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Grid container justify="flex-end">
              <Grid container>
                <Grid item xs />
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    startIcon={<SaveIcon />}
                    type="submit"
                  >
                    {loading ? (
                      <CircularProgress size="1.55rem" color="inherit" />
                    ) : (
                      <>Gravar</>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Container>
      </main>
    </div>
  );
}
