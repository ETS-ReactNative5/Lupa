
import React, {Component, createRef} from "react";
import {Animated,ScrollView,  Image, Dimensions, Platform, Text, View, RefreshControl} from 'react-native';
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Right, Tabs, Title, Left} from "native-base";
import { Banner, FAB, Appbar, Divider , Surface, Menu} from 'react-native-paper';
import MyPrograms from "./MyPrograms";
import Featured from "./Featured";
import GuestView from './GuestView';
import { MenuIcon } from "./icons";
import CreateWorkout from "./workout/createworkout/CreateWorkout";
import Feather1s from "react-native-feather1s/src/Feather1s";
import FeatherIcon from 'react-native-vector-icons/Feather'
import WorkoutLog from "./WorkoutLog";
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MyClients from './user/trainer/MyClients'
import { getLupaStoreState } from "../controller/redux";
import LupaController from "../controller/lupa/LupaController";
import CreatePackDialog from "./packs/dialogs/CreatePackDialog";
const NAVBAR_HEIGHT = 50;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "#FFFFFF";
const TAB_PROPS = {
  tabStyle: {backgroundColor: COLOR},
  activeTabStyle: {backgroundColor: COLOR},
  textStyle: {color: "rgba(35, 55, 77, 0.75)", fontFamily: 'Avenir-Heavy'},
  activeTextStyle: {color: "#1089ff", fontFamily: 'Avenir-Heavy', fontWeight: 'bold'}
};

const mapStateToProps = (state, action) => {
  return {
    lupa_data: state,
  }
}

export class LupaHome extends Component {

  constructor(props) {
    super(props);

    this.createPackSheetRef = createRef();

    this.state = {
      refreshing: false,
      showTrainerContent: false,
      currTab: 0,
    }

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
  }

  async componentDidMount() {
    await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.props.lupa_data.Users.currUserData.user_uuid, 'isTrainer').then(attribute => {
      this.setState({ showTrainerContent: attribute })
    }).catch(error => {
      this.setState({ showTrainerContent: false })
    })
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true })
    this.setState({ refreshing: false })
  }

  handleOpenCreatePack = () => {
    this.createPackSheetRef.current.open();
  }

  handleOnCloseCreatePack = () => {
    this.createPackSheetRef.current.close();
  }

  renderAppropriateFirstTab = (navigation) => {
    return <GuestView navigation={this.props.navigation} />
  }

  renderAppropriateSecondaryTab = () => {
    const updatedUserState = getLupaStoreState().Users.currUserData;
    if (updatedUserState.isTrainer == true) {
      return (
        <Tab heading="My Programs" {...TAB_PROPS}>
          <MyPrograms />
      </Tab>
      )
    } else {
      return (
       /* <Tab heading="Workout log" {...TAB_PROPS}>
        <WorkoutLog navigation={this.props.navigation} />
      </Tab>*/
      null
      )
    }
  }

  renderFAB = () => {
    if (this.props.lupa_data.Auth.isAuthenticated == true) {
      if (this.props.lupa_data.Users.currUserData.isTrainer == true && this.state.currTab == 3) {
        return (
          <FAB small onPress={() => this.props.navigation.push('CreatePost')} icon="video" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16, color: 'white', alignItems: 'center', justifyContent: 'center',}} color="white" />
        )
      } else if (this.props.lupa_data.Users.currUserData.isTrainer == false && this.state.currTab == 2) {
        return (
          <FAB small onPress={() => this.props.navigation.push('CreatePost')} icon="video" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16, color: 'white', alignItems: 'center', justifyContent: 'center',}} color="white" />
        )
      }
    }
 
  }

  handleOnChooseCreatePack = () => {
    this.setState({ createIsVisble: false }, this.handleOpenCreatePack);
  }

  render() {
    return (
        <View style={{flex: 1}}>
          <Header style={{backgroundColor: COLOR}} noShadow={false} hasTabs>
            <Left style={{flexDirection: 'row', alignItems: 'center'}}>
              <MenuIcon onPress={() => this.props.navigation.openDrawer()}/>
            </Left>

            <Body>
              <Image source={require('./icons/logo.jpg')} style={{marginTop: 5, width: 35, height: 35}} />
            </Body>

            <Right>
            <Menu onDismiss={() => this.setState({ createIsVisble: false })} visible={this.state.createIsVisble} anchor={
                <Appbar.Action key='globe' onPress={() => this.setState({ createIsVisble: true })} icon={() => <FeatherIcon name="globe" size={20} style={{padding: 0, margin: 0}} />}/>
                }>
                    <Menu.Item 
                    onPress={this.handleOnChooseCreatePack} 
                    theme={{roundness:20}} 
                    contentStyle={{borderRadius: 20, width: 'auto'}} 
                    style={{ height: 30}} 
                    icon={() => <FeatherIcon name="globe" color="rgb(34, 74, 115)" size={15} />} 
                    titleStyle={{fontSize: 13, fontFamily: 'Avenir-Heavy'}} 
                    title="Create a Pack" />
                  {
                    this.props.lupa_data.Users.currUserData.user_uuid == '3kwSiuirFdTAg4463DCBrYfNFfR2' ?
                    <Menu.Item 
                    onPress={() => this.props.navigation.push('Community')} 
                    theme={{roundness:20}} 
                    contentStyle={{borderRadius: 20, width: 'auto'}} 
                    style={{ height: 30}} 
                    icon={() => <FeatherIcon name="globe" color="rgb(34, 74, 115)" size={15} />} 
                    titleStyle={{fontSize: 13, fontFamily: 'Avenir'}} 
                  title="Create a Community" /> 
                  :
                  null
                  }
           
                </Menu>
           
            </Right>
          </Header>
          <Tabs 
          onChangeTab={tabInfo => this.setState({ currTab: tabInfo.i })} 
          style={{backgroundColor: '#FFFFFF'}}
          tabBarUnderlineStyle={{backgroundColor: '#FFFFFF', height: 1}}
          tabContainerStyle={{borderBottomWidth: 0, height: 0}}xw
          renderTabBar={(props) =>
            <ScrollableTab {...props} style={{borderBottomWidth: 0, borderColor: 'rgb(174, 174, 178)',  height: 40, shadowRadius: 1, justifyContent: 'flex-start', elevation: 0, backgroundColor: COLOR}} tabsContainerStyle={{justifyContent: 'flex-start', backgroundColor: COLOR, elevation: 0}} underlineStyle={{backgroundColor: "#1089ff", height: 1, elevation: 0, borderRadius: 8}}/>}>
            
            <Tab heading='Explore' {...TAB_PROPS} >
                {this.renderAppropriateFirstTab(this.props.navigation)}
            </Tab>
           {this.renderAppropriateSecondaryTab()}
           <Tab heading="Community" {...TAB_PROPS}>
           <Featured navigation={this.props.navigation} />
           </Tab>
          </Tabs>

          {this.renderFAB()}
          <CreatePackDialog ref={this.createPackSheetRef} />
      </View>
    );
  }
}

export default connect(mapStateToProps)(LupaHome);