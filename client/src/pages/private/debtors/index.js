import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MaterialTable from "material-table";
import { useSnackbar } from "notistack";

import clsx from "clsx";
import useStyles from "./useStyles";
import { mainListItems } from "../../../components/list-items";
import { doLogout } from "../../../services/utils";
import api from "../../../services/api";

export default function Debtors({ history }) {
  const classes = useStyles();
  const [openListItens, setOpenListItens] = React.useState(false);
  const [debtors, setDebtors] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  async function snack(msg, v = "error") {
    let snack = {
      variant: v,
      persist: false,
      preventDuplicate: true,
    };
    if (msg) {
      enqueueSnackbar(msg, snack);
    }
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

  async function loadDebtors() {
    let token = localStorage.getItem("token");
    await api
      .get("/debtors", { headers: { token: token } })
      .then((response) => {
        if (response.status === 200) {
          let evts = response.data;
          setDebtors(evts);
        }
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 400) {
            snack(error.response.data.message);
          }
        }
      });
  }

  useEffect(() => {
    loadDebtors();
  }, []);

  const [tabela] = useState({
    columns: [
      { title: "Nome", field: "debtor.name" },
      { title: "Total em Dívidas", field: "sumOfDebts" },
    ],
  });

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
            Devedores
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
          {localStorage.getItem("user") && (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {localStorage.getItem("user").username}
            </Typography>
          )}
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
        <React.Fragment>
          <CssBaseline />
          <main>
            <MaterialTable
              title="Devedores"
              columns={tabela.columns}
              data={debtors}
              actions={[
                {
                  icon: "add",
                  tooltip: "Adicionar Dívida",
                  isFreeAction: true,
                  iconProps: { color: "primary" },
                  onClick: (ev, rowData) => {
                    history.push(`/divida`);
                  },
                },
                (rowData) => {
                  return {
                    icon: "search",
                    tooltip: "Consultar Dívidas",
                    iconProps: { color: "primary" },
                    onClick: (ev, rowData) => {
                      history.push(`/devedor/${rowData.debtor.id}`);
                    },
                  };
                },
              ]}
              localization={{
                body: {
                  emptyDataSourceMessage:
                    "Nenhum devedor encontrado no sistema",
                },
                toolbar: {
                  searchPlaceholder: "Pesquisar",
                  searchTooltip: "Pesquisar",
                  exportName: "exportar para CSV",
                  exportAriaLabel: "Exportar",
                  exportTitle: "Exportar",
                },
                header: {
                  actions: "Ações",
                },
                pagination: {
                  labelRowsSelect: "Linhas",
                  labelDisplayedRows: "{count} devedores / {from}-{to} ",
                  firstTooltip: "Primeiro",
                  previousTooltip: "Anterior",
                  nextTooltip: "Próximo",
                  lastTooltip: "Último",
                },
              }}
              options={{
                filtering: true,
                exportButton: true,
              }}
            />
          </main>
        </React.Fragment>
      </main>
    </div>
  );
}
