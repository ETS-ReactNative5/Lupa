import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Profile from '../user/profile/ProfileView';
import BuildAWorkout from '../workout/program/createprogram/BuildWorkout';
import MessagesView from '../user/chat/MessagesView';
import Programs from '../workout/program/Programs';

import TrainerInformation from '../user/modal/WelcomeModal/TrainerInformation';
import NotificationsView from '../user/notifications/NotificationsView';
import CreateProgram from '../workout/program/createprogram/CreateProgram';
import LiveWorkout from '../workout/modal/LiveWorkout';
import LupaHome from '../LupaHome';

const LupaHomeNavigator =  createStackNavigator(
    {
    LupaHome: {
        screen: (props) => <LupaHome setScreen={screen => props.screenProps.setCurrentScreen(screen)} goToIndex={index => props.screenProps.goToIndex(index)} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
        navigationOptions: ({navigation}) => ({
            title: "SearchView",
            header: null,
            gesturesEnabled: false,
        })
    },
    NotificationsView: {
      screen: (props) => <NotificationsView disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
        navigationOptions: ({navigation}) => ({
            title: "NotificationsView",
            header: null,
            gesturesEnabled: false,
        })
    },
    Profile: {
        screen: Profile,
        navigationOptions: ({navigation}) => ({
            title: "Profile",
            header: null,
            gesturesEnabled: false,
        })
    },
    BuildAWorkout: {
      screen: (props) => <BuildAWorkout {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
      navigationOptions:   ({navigation}) => ({
          title: "Build a Workout",
          header: null,
          gesturesEnabled: false,
      })
    },
    LiveWorkout: {
      screen: (props) => <LiveWorkout {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
      navigationOptions:   ({navigation}) => ({
          title: "LiveWorkout",
          header: null,
          gesturesEnabled: false,
      })
    },
    CreateProgram: {
      screen: (props) => <CreateProgram {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
      navigationOptions: ({navigation}) => ({
        title: "CreateProgram",
        header: null,
        gesturesEnabled: false,
      })
    },
    MessagesView: {
        screen: MessagesView,
        navigationOptions:   ({navigation}) => ({
            title: "MessagesView",
            header: null,
            gesturesEnabled: false,
        })
      },
      Programs: {
        screen: (props) => <Programs {...props} enableSwipe={props.screenProps.enableSwipe} disableSwipe={props.screenProps.disableSwipe} />,
        navigationOptions:   ({navigation}) => ({
            title: "Programs",
            header: null,
            gesturesEnabled: false,
        })
      },
      TrainerInformation: {
        screen: TrainerInformation,
        navigationOptions:   ({navigation}) => ({
          title: "Register as a Trainer",
          gesturesEnabled: false,
          headerBackTitle: "Cancel"
      })
      },
},
{
    initialRouteName: 'LupaHome'
})

export default createAppContainer(LupaHomeNavigator);