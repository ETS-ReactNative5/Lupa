import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import {
    Surface, Appbar, Caption, Button, FAB, Menu, Card, Avatar as PaperAvatar
} from 'react-native-paper';


import {
    Tab,
    Tabs
} from 'native-base'
import { Avatar } from 'react-native-elements';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LupaColor from '../../common/LupaColor'
import ImagePicker from 'react-native-image-picker';
import ThinFeatherIcon from 'react-native-feather1s'
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import LupaCalendar from './component/LupaCalendar';
import SchedulerModal from './component/SchedulerModal';
import CreateNewPost from './modal/CreateNewPost'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useSelector } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';
import ProfileProgramCard from '../../workout/program/components/ProfileProgramCard';
import LOG from '../../../common/Logger';

function TrainerProfile({ userData, isCurrentUser }) {
    const navigation = useNavigation();
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [profileImage, setProfileImage] = useState(userData.photo_url)
    const [userPrograms, setUserPrograms] = useState([])
    const [userVlogs, setUserVlogs] = useState([])
    const [postType, setPostType] = useState("VLOG");
    const [optionsMenuVisible, setOptionsMenuVisible] = useState(false)
    const [postModalIsVisible, setPostModalIsVisible] = useState(false);
    const [editHoursModalVisible, setEditHoursModalVisible] = useState(false);
    const [currPage, setCurrPage] = useState(0)
    const [markedDates, setMarkedDates] = useState([])
    const [ready, setReady] = useState(false)
    const [agendaContainerHeight, setAgendaContainerHeight] = useState(0)
    const [cardContentHeight, setCardContentHeight] = useState(0)
    
    const currUserPrograms = useSelector(state => {
        return state.Programs.currUserProgramsData;
    })

    const captureMarkedDate = (dateObject) => {
        setMarkedDates(prevState => prevState.concat(dateObject));
    }

    /**
     * Allows the current user to choose an image from their camera roll and updates the profile picture in FB and redux.
     */
    const _chooseProfilePictureFromCameraRoll = async () => {
        
        ImagePicker.showImagePicker({}, async (response) => {
            if (!response.didCancel)
            {   
                setProfileImage(response.uri);

                let imageURL;
                //update in FB storage
                 LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(response.uri).then(result => {
                    imageURL = result;
                });
        
                //update in Firestore
                LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', imageURL, "");
        
            }
        });
        //TODO
        //update in redux
        //await this.props.updateCurrentUsers()
    }

    const renderAvatar = () => {
        if (isCurrentUser) {
            return (
                <Surface style={{marginVertical: 5, elevation: 8, width: 65, height: 65, borderRadius: 65}}>
                     <Avatar key={userData.photo_url} raised={true} rounded size={65} source={{ uri: profileImage }} showEditButton={true} onPress={_chooseProfilePictureFromCameraRoll} />
                </Surface>
            )
        }

        return <Avatar key={userData.photo_url} rounded size={65} source={{ uri: profileImage }} />
    }

    const renderFollowers = () => {
        return (
            <View style={{marginVertical: 10, flex: 1, width: '100%',  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <TouchableOpacity onPress={navigateToFollowers}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text>
                {userData.followers.length}
            </Text>
            <Text style={styles.userAttributeText}>
                Followers
        </Text>
        </View>

    </TouchableOpacity>
    <TouchableOpacity onPress={navigateToFollowers}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text>
                {userData.following.length}
            </Text>
            <Text style={styles.userAttributeText}>
                Following
        </Text>
        </View>
    </TouchableOpacity>
            </View>
        )
    }

    const renderCertification = () => {
        return (<View style={{paddingVertical: 2, flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="file-text" style={{paddingRight: 5}} />
                    <Text key={userData.certification} style={[styles.userAttributeText, {color: '#23374d'}]}>NASM</Text>
                </View>)
    }

    const renderLocation = () => {
               return ( <View style={{paddingVertical: 2, flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="map-pin" style={{paddingRight: 5}} />
                    <Text style={[styles.userAttributeText, {color: '#23374d'}]}>{userData.location.city}, {userData.location.state}</Text>
                </View>)
    }

    const renderDisplayName = () => {
        return <Text key={userData.display_name} style={styles.displayNameText}>{userData.display_name}</Text>
    }

    const renderBio = () => {
        return (
            <Text style={styles.bioText}>
                {userData.bio}
            </Text>
        )
    }

    const openOptionsMenu = () => setOptionsMenuVisible(true)
    const closeOptionsMenu = () => setOptionsMenuVisible(false);

    const renderVlogs = () => {
        return userVlogs.map(vlog => {
            return (
              /*  <View style={{paddingHorizontal: 20, paddingVertical: 10, width: '100%', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar containerStyle={{marginRight: 10}} key={userData.photo_url} source={{uri: userData.photo_url}} raised={true} rounded size={50} />
                    <View>
                        <Text style={{fontSize: 12, fontFamily: 'Avenir-Heavy'}}>
                            Elijah Hampton
                        </Text>
                        <Text style={{fontSize: 12, fontFamily: 'Avenir-Roman'}}>
                    {vlog.vlog_text}
                </Text>
                    </View>
                    
                    </View>

                    <Menu
          visible={optionsMenuVisible}
          onDismiss={closeOptionsMenu}
          anchor={ <ThinFeatherIcon onPress={openOptionsMenu} thin={true} name="more-horizontal" size={20} />}>
          <Menu.Item onPress={() => {}} title="Delete" />
        </Menu>
                   
                    </View>
                    
                </View>*/

                <Card style={{margin: 10, elevation: 0}}>
                    <Card.Cover style={{elevation: 0,height: 340}} source={{uri: 'https://picsum.photos/200'}} />
                    <PaperAvatar.Image source={{uri: profileImage}} size={30} style={{position: 'absolute', bottom: cardContentHeight + 30, right: 0, marginRight: 15}} />
                    <FeatherIcon name="maximize" size={20} style={{position: 'absolute', top: 0, right: 0, margin: 12}} color="white" />
                    <Card.Content style={{backgroundColor: 'transparent'}} onLayout={event => setCardContentHeight(event.nativeEvent.layout.height)}>
                            <Text style={{fontSize: 15, paddingVertical: 5, fontFamily: 'Avenir-Heavy'}}>
                                How to do high intensity workouts
                            </Text>
                        
                            <Text numberOfLines={2} style={{fontSize: 12, fontFamily: 'Avenir-Roman'}}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            </Text>
                    </Card.Content>
                </Card>
            )
        })
    }

    const renderPrograms = () => {
       return userPrograms.map((program, index, arr) => {
            return (
                <ProfileProgramCard programData={program} />
            )
        })
    }

    const renderFAB = () => {
        if (!isCurrentUser) {
            return;
        }
        
        switch(currPage) {
            case 0:
                return  <FAB onPress={() => navigation.push('CreateProgram')} icon="plus" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 20}} />
            case 1:
                return  <FAB onPress={() => navigation.push('CreatePost')} icon="rss" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 20}} />
            case 2:
                return  <FAB onPress={() => setEditHoursModalVisible(true)} icon="calendar" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 20}} />
            
        }

        return null;
    }

    /**
     * Navigates to the follower view.
     */
    const navigateToFollowers = () => {
        navigation.navigate('FollowerView');
    }

    const fetchVlogs = async (uuid) => {
        await LUPA_CONTROLLER_INSTANCE.getAllUserVlogs(uuid).then(vlogs => {
            setUserVlogs(vlogs);
        })
    }

    const fetchPrograms = async (uuid) => {
        await LUPA_CONTROLLER_INSTANCE.getAllUserPrograms(uuid).then(data => {
            setUserPrograms(data);
        })
    }

    useEffect(() => {
        async function loadProfileData() {
            try {
                setProfileImage(userData.photo_url)
                await fetchVlogs(userData.user_uuid);
        if (isCurrentUser) {
            setUserPrograms(currUserPrograms)
        } else {
            fetchPrograms(userData.user_uuid);
        }
                setReady(true)
            } catch(error) {
                setReady(false)
                alert(error);
                setUserVlogs([])
                setUserPrograms([])
            }
        }
        
        loadProfileData()
        LOG('TrainerProfile.js', 'Running useEffect.')
    }, [ready])

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <ThinFeatherIcon name="arrow-left" size={20} onPress={() => navigation.goBack()}/>
                <Appbar.Content title={userData.username} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <ScrollView>
            <View style={styles.userInformationContainer}>
                <View style={styles.infoContainer}>
                    {renderDisplayName()}
                    {renderBio()}
                    <View style={{paddingVertical: 10}}>
                    {renderLocation()}
                    {renderCertification()}
                    </View>
                </View>

                <View style={styles.avatarContainer}>
                    {renderAvatar()}
                    {renderFollowers()}
                </View>
            </View>

            <Tabs tabBarUnderlineStyle={{height: 2, backgroundColor: '#1089ff'}} onChangeTab={tabInfo => setCurrPage(tabInfo.i)} locked={true} tabContainerStyle={{backgroundColor: '#FFFFFF'}} tabBarBackgroundColor='#FFFFFF'>
             <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Programs/Services">
                    <View style={{flex: 1, backgroundColor: 'rgb(248, 248, 248)'}}>
                        {renderPrograms()}
                    </View>
             </Tab>
              <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading}  heading="Vlogs">
       <View style={{flex: 1, backgroundColor: 'white' /*'rgb(248, 248, 248)'*/}}>
                        {renderVlogs()}
                    </View>

                   
              </Tab>
              <Tab containerStyle={{flex: 1}} activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Scheduler">
                    <View  style={{backgroundColor: 'white'  /*'rgb(248, 248, 248)'*/, height: Dimensions.get('window').height}}>
                    <LupaCalendar captureMarkedDates={captureMarkedDate} />
                    </View>
              </Tab>
            </Tabs>
            </ScrollView>

           {renderFAB()}

           <SchedulerModal isVisible={editHoursModalVisible} closeModal={() => setEditHoursModalVisible(false)} selectedDates={markedDates} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
       // backgroundColor: 'rgb(248, 248, 248)'
    },
    userInformationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    infoContainer: {
        flex: 3,
        paddingHorizontal: 10,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    avatarContainer: {
        flex: 2,
        paddingVertical: 10,
        alignItems: 'center'
    },
    bioText: {
        fontFamily: 'Avenir-Roman',
        fontSize: 11,
        
    },
    certificationText: {
        fontFamily: 'Avenir-Light',
    },
    appbar: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
    appbarTitle: {
        fontSize: 15,
        fontFamily: 'Avenir-Roman'
    },
    displayNameText: {
        paddingVertical: 5,
        fontSize: 15,
        fontFamily: 'Avenir-Black'
    },
    inactiveTabHeading: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        color: 'rgb(102, 111, 120)',
    },
    activeTabHeading: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
    },
    userAttributeText: {
        fontSize: 10,
        fontFamily: 'Avenir-Light',
   
    }
})

export default TrainerProfile;