import { Button, createStyles, Grid, Theme, Typography, WithStyles, withStyles, withWidth } from '@material-ui/core';
import { WithWidthProps } from '@material-ui/core/withWidth';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import * as RegistryActions from '../actions/registry';
import * as ClaimActions from '../actions/claim';
import * as CuratorActions from '../actions/curator';
import RegistryTable from '../components/registry/RegistryTable';
import CuratorTable from '../components/curator/CuratorTable';
import ClaimTable from '../components/claim/ClaimTable';
import RegistryAddDialog from '../components/registry/RegistryAdd';
import { Registry, Curator, ClaimList } from '../model/model';
import { RootState } from '../reducers';
import { isSmartphone } from '../responsive';

export namespace RegistryPage {
  export interface Props extends RouteComponentProps<void>, WithStyles<typeof styles>, WithWidthProps {
    registries: Registry[];
    registryActions: typeof RegistryActions;
    claimActions: typeof ClaimActions;
    curatorActions: typeof CuratorActions;
  }

  export interface State {
    open: boolean;
    showRegistries: boolean;
    showCurators: boolean;
    showClaims: boolean;
    selectedRegistryName: string;
    curators: Curator[];
    claimList: ClaimList;
  }
}


class RegistryPage extends React.Component<RegistryPage.Props, RegistryPage.State> {
  state = {
    open: false,
    showRegistries: true,
    showCurators: false,
    showClaims: false,
    selectedRegistryName: '',
    curators: [],
    claimList: { claimRaces: [] , claimSets : [] } 
  };


  handleChange = (eventName: string, registryName: string) => {
    switch(eventName){
      case "back": {
        this.setState({
          open: false,
          showRegistries: true,
          showCurators: false,
          showClaims: false,
          selectedRegistryName: ''
      });
      }
      case "showCurators": {


        this.setState({
          open: false,
          showRegistries: false,
          showCurators: true,
          showClaims: false,
          selectedRegistryName: registryName
      });
      }
      case "showClaims": {
        this.setState({
          open: false,
          showRegistries: false,
          showCurators: false,
          showClaims: true,
          selectedRegistryName: registryName
      });
      }
    }
  };

  render() {                       
    const { classes, registryActions, claimActions, curatorActions, registries, width } = this.props;

    let tableView;

    if(this.state.showRegistries){
      tableView = <RegistryTable registries={registries} actions={registryActions} openList={this.handleChange} />;
    }
    else if(this.state.showCurators){
      tableView = <CuratorTable curators={this.state.curators} actions={curatorActions} back={this.handleChange} registryName={this.state.selectedRegistryName} />;
    }
    else if(this.state.showClaims){
      tableView = <ClaimTable claimList={this.state.claimList} actions={claimActions} back={this.handleChange} registryName={this.state.selectedRegistryName} />;
    }

    return (

      <Grid
        container
        className={isSmartphone(width) ? classes.mobileRoot : classes.root}
        alignItems={'flex-start'}
        justify={'flex-start'}
      >
        <RegistryAddDialog
          actions={registryActions}
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        />
        <Grid item xs={12}>
          <Typography variant="display1" gutterBottom>
            Registries
        </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button className={classes.button} variant="raised" color="secondary" onClick={this.handleAddRegistry}>
            Add Registry
        </Button>
        </Grid>
        <Grid item xs={12}>
         {tableView}
        </Grid>
      </Grid>
    );
  }

  handleAddRegistry = () => this.setState({ open: true,
    showRegistries: true,
    showCurators: false,
    showClaims: false,
    selectedRegistryName: ''
  });

}

const styles = (theme: Theme) => createStyles({
  root: {
    padding: theme.spacing.unit * 10,
  },

  mobileRoot: {
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
  },

  button: {
    marginBottom: 15,
  },
});

function mapStateToProps(state: RootState) {
  return {
    registries: state.registries
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    registryActions: bindActionCreators(RegistryActions as any, dispatch),
    claimActions: bindActionCreators(ClaimActions as any, dispatch),
    curatorActions: bindActionCreators(CuratorActions as any, dispatch),
  };
}

export default (withStyles(styles)<{}>(connect(mapStateToProps, mapDispatchToProps)(withWidth()(RegistryPage))));
