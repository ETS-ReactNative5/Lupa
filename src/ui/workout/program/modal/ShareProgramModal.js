
import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    ScrollView,
} from 'react-native';

import {
    Appbar,
    FAB,
    Divider,
} from 'react-native-paper';

import { useSelector } from 'react-redux'

import LupaController from '../../../../controller/lupa/LupaController'

import UserSearchResult from '../../../user/profile/component/UserSearchResult'
import ProfileProgramCard from '../components/ProfileProgramCard';

import ThinFeatherIcon from 'react-native-feather1s'

function ShareProgramModal({ navigation, route }) {
    const [followingUserObjects, setFollowingUserObjects] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    useEffect(() => {
        LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(currUserData.following).then(objs => {
            setFollowingUserObjects(objs)
        })
    }, [])

    const handleAddToFollowList = (userObject) => {
        const updatedList = selectedUsers;
        var found = false;
        for(let i = 0; i < selectedUsers.length; i++)
        {
            if (selectedUsers[i] == userObject.user_uuid)
            {

              updatedList.splice(i, 1);
              found = true;
              break;
            }
        }

        if (found == false)
        {
            
            updatedList.push(userObject.user_uuid);
        }

        setSelectedUsers(updatedList)
    }

    const waitListIncludesUser = (userObject) => {
        for(let i = 0; i < selectedUsers.length; i++)
        {
            if (selectedUsers[i] == userObject.user_uuid)
            {
                return true;
            }
        }

        return false;
    }

    const mapFollowing = () => {
        return followingUserObjects.map(user => {
            return (
                <View key={user.user_uuid} style={{backgroundColor: waitListIncludesUser(user) ? '#E0E0E0' : 'transparent'}}>
                    <UserSearchResult 
                        avatarSrc={user.photo_url} 
                        displayName={user.display_name} 
                        username={user.username} 
                        isTrainer={user.isTrainer}
                        hasButton={true}
                        buttonTitle="Invite"
                        buttonOnPress={() => handleAddToFollowList(user)}
                        />
                </View>
            );
        })
    }

    const handleApply = () => {
        try {
            LUPA_CONTROLLER_INSTANCE.handleSendUserProgram(currUserData, selectedUsers, route.params.programData);
            navigation.pop()
        } catch(err) {
            alert(err)
            navigation.pop()
        }
    }

    return (
        <View style={styles.container}>
                    <Appbar.Header style={styles.appbar} theme={{
                    colors: {
                        primary: '#FFFFFF'
                    }
                }}>
                    <Appbar.Action onPress={() => navigation.pop()} icon={() => <ThinFeatherIcon name="arrow-left" size={20} />}/>
                    <Appbar.Content title="Share Program" titleStyle={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15, fontWeight: '600'}} />
                </Appbar.Header>

                <View style={styles.contentContainer}>
                <ProfileProgramCard programData={route.params.programData} />
                              <Divider />
                    <ScrollView shouldRasterizeIOS={true}>
                    {
                        mapFollowing()
                    }
                </ScrollView>
                    </View>

                    <FAB  color="#FFFFFF" style={styles.fab} icon="check" onPress={handleApply} />
                    <SafeAreaView />
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    appbar: {
        elevation: 3
    },
    fab: {
        position: 'absolute', bottom: 0, right: 0, margin: 16, backgroundColor: '#2196F3'
    },
    contentContainer: {
        flex: 1
    }
})


export default ShareProgramModal;