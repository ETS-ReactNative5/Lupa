import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Profile from '../DrawerViews/Profile/ProfileView';
import SessionsView from '../Modals/Session/CreateSessionModal';
import SearchView from '../MainViews/search/SearchView';
import PackModal from '../Modals/PackModal/PackModal';
import { PackChatModal as PackChat } from '../Modals/PackChatModal';

const UserViewNavigator =  createStackNavigator(
    {
        /* Added the search view here because navigation didn't work to 
        the user profile view without it.. need to reconsider the design of this in the future */
    SearchView: {
        screen: () => <SearchView />,
        navigationOptions: ({navigation}) => ({
            title: "SearchView",
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
    SessionsView: {
        screen: SessionsView,
        navigationOptions: ({navigation}) => ({
            title: "SessionsView",
            header: null,
            gesturesEnabled: false,
        })
    },
},
{
    initialRouteName: 'SearchView'
})

export default createAppContainer(UserViewNavigator);