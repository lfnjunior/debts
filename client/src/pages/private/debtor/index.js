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
import moment from "moment";

import clsx from "clsx";
import useStyles from "./useStyles";
import { mainListItems } from "../../../components/list-items";
import { doLogout } from "../../../services/utils";
import api from "../../../services/api";

export default function Debtor({ history, match }) {
  const classes = useStyles();
  const [openListItens, setOpenListItens] = React.useState(false);
  const [idDebtor] = useState(match.params.id);
  const [debts, setDebts] = useState([]);
  const [debtor, setDebtor] = useState({});
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

  async function loadDebtor() {
    let token = localStorage.getItem("token");
    api
      .get(`/client/${idDebtor}`, { headers: { token: token } })
      .then((response) => {
        if (response.status === 200) {
          setDebtor(response.data);
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

  async function loadDebts() {
    let token = localStorage.getItem("token");
    api
      .get(`/debtor/${idDebtor}`, { headers: { token: token } })
      .then((response) => {
        if (response.status === 200) {
          let dbts = response.data;
          dbts = dbts.map((d) => {
            return {
              ...d,
              date: moment(d.date).format("DD/MM/YYYY"),
            };
          });
          setDebts(dbts);
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

  useEffect(() => {
    loadDebts();
    loadDebtor();
  }, []);

  const [tabela] = useState({
    columns: [
      { title: "Motivo", field: "reason" },
      { title: "Total em Dívidas", field: "value" },
      { title: "Data", field: "date" },
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
            Dívidas: {debtor.name}
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
              title="Dívidas"
              columns={tabela.columns}
              data={debts}
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
                    icon: "edit",
                    tooltip: "Editar",
                    iconProps: { color: "primary" },
                    onClick: (ev, rowData) => {
                      history.push(`/divida/${rowData.id}`);
                    },
                  };
                },
                (rowData) => {
                  return {
                    icon: "cancel",
                    iconProps: { color: "error" },
                    tooltip: "Excluir",
                    onClick: (ev, rowData) => {
                      let config = {
                        headers: { token: localStorage.getItem("token") },
                      };
                      api
                        .delete(`/debt/${rowData.id}`, config)
                        .then((response) => {
                          if (response.status === 200) {
                            window.location.reload();
                          }
                        })
                        .catch(function (error) {
                          if (error.response.status === 400) {
                            snack(error.response.data.message);
                          }
                        });
                    },
                  };
                },
              ]}
              localization={{
                body: {
                  emptyDataSourceMessage: `Nenhum dívida encontrada para ${debtor.name}`,
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
                  labelDisplayedRows: "{count} dívidas / {from}-{to} ",
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
