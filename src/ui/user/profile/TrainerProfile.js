import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import {
    Surface, Appbar, Caption, Button, FAB
} from 'react-native-paper';

import {
    Avatar
} from 'react-native-elements';

import {
    Tab,
    Tabs
} from 'native-base'

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
    const [postType, setPostType] = useState("VLOG");
    const [postModalIsVisible, setPostModalIsVisible] = useState(false);
    const [currPage, setCurrPage] = useState(0)

    const currUserPrograms = useSelector(state => {
        return state.Programs.currUserProgramsData;
    })

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
        return <Text key={userData.certification} style={[styles.userAttributeText, {color: '#1089ff'}]}>NASM</Text>
    }

    const renderLocation = () => {
        return <Text style={[styles.userAttributeText, {color: '#1089ff'}]}>{userData.location.city}, {userData.location.state}</Text>
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

    const renderPrograms = () => {
       return userPrograms.map((program, index, arr) => {
            return (
                <ProfileProgramCard programData={program} />
            )
        })
    }

    const renderFAB = () => {
        if (currPage == 1) {
            return  <FAB label="Add Blog" icon="rss" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 12}} />
        }

        return null;
    }

    /**
     * Navigates to the follower view.
     */
    const navigateToFollowers = () => {
        this.props.navigation.navigate('FollowerView');
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await LUPA_CONTROLLER_INSTANCE.getAllUserPrograms(userData.user_uuid).then(data => {
                    setUserPrograms(data);
                    setProfileImage(data.photo_url)
                })
            } catch(error) {
                alert(error);
                setUserPrograms([])
            }
        }


        if (isCurrentUser) {
            setUserPrograms(currUserPrograms)
        } else {
            fetchData();
        }

        LOG('TrainerProfile.js', 'Running useEffect.')
    }, [userPrograms.length])

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

            <Tabs onChangeTab={tabInfo => console.log(tabInfo.i)} locked={true} tabContainerStyle={{backgroundColor: '#FFFFFF'}} tabBarBackgroundColor='#FFFFFF'>
             <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Programs/Services">
                    <View style={{flex: 1, backgroundColor: 'rgb(248, 248, 248)'}}>
                        {renderPrograms()}
                    </View>
             </Tab>
              <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading}  heading="Vlogs">
       <View style={{flex: 1, backgroundColor: 'rgb(248, 248, 248)'}}>
                        <Button onPress={() => setPostModalIsVisible(true)} mode="text" color="#1089ff" uppercase={false} style={{alignSelf: 'flex-end'}} icon={() =>  <FeatherIcon name="rss" color="#1089ff" size={12} />}>
                            <Text style={{fontFamily: 'Avenir-Light', fontWeight: '300', fontSize: 12}}>
                                Add Vlog
                            </Text>
                        </Button>
                    </View>

                   
              </Tab>
              <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Scheduler">
                    <LupaCalendar />
              </Tab>
            </Tabs>
            </ScrollView>

            <CreateNewPost postType={postType} isVisible={postModalIsVisible} closeModal={() => setPostModalIsVisible(false)} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(248, 248, 248)'
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
        fontFamily: 'Avenir-Light',
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
        fontSize: 12,
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