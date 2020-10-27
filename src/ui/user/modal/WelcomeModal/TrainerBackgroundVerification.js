import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    Image,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,

} from 'react-native';
import {
    Appbar,
    Checkbox,
    Surface,
    Caption,
    RadioButton,
    Button,
    Divider,
    Paragraph,
    TextInput,
} from 'react-native-paper';
import { check, RESULTS, PERMISSIONS } from 'react-native-permissions';
import { useSelector, useDispatch } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController'
import LupaMapView from '../LupaMapView';

import getLocationFromCoordinates from '../../../../modules/location/mapquest/mapquest'
import Geolocation from '@react-native-community/geolocation';
import { SearchBar } from 'react-native-elements';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import DropDownPicker from 'react-native-dropdown-picker';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';

Geolocation.setRNConfiguration({
    authorizationLevel: 'whenInUse',
    skipPermissionRequests: false,
  });


const SPORTS_GENRE = [
    'Football',
    'Soccer',
    'Lacross',
    'Basketball',
    'Basketball'
]

const COACHING_INTEREST = [
    'In Home',
    'In Studio',
    'Virtual',
    'Outdoor',
]

const EQUIPMENT_LIST = [
    'Training Bench',
    'Dumbbel Set',
    'Resistance Bands',
    'Barbell',
    'Kettlebell Set',
]

const certificationItems = [
    {label: 'National Association of Sports Medicine', value: 'NASM' },
    {label: 'American Council on Exercise', value: 'ACE'},
    {label: 'American College of Sports and Medicine', value: 'ACSM'},
    {label: 'National Council on Strength and Fitness', value: 'NCSF'},
]

function TrainerCeritifcationModal({ isVisible, closeModal }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [certificationNumber, setCertificationNumber] = useState("")
    const [verificationSubmitted, setVerificationSubmitted] = useState(false);
    const [certification, setCertification] = useState("");

    const dispatch = useDispatch();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnSubmit = () => {
        if (certificationNumber.length === 0 || certificationNumber.length < 5) {
            alert('You must enter a valid certification number!')
            return;
        }
        
        try {
            LUPA_CONTROLLER_INSTANCE.submitCertificationNumber(currUserData.user_uuid, certificationNumber);
        } catch(error) {
            LOG_ERROR('WelcomeLupaIntroduction.js', 'Caught unhandled exception in handleOnSubmit()', error);
            handleOnClose();
        }

        const payload = getUpdateCurrentUserAttributeActionPayload('isTrainer', true, []);
        const certificationUpdatePayload = getUpdateCurrentUserAttributeActionPayload('certification', certification, []);

        dispatch({type: "UPDATE_CURRENT_USER_ATTRIBUTE", payload: certificationUpdatePayload});
        dispatch({ type: "UPDATE_CURRENT_USER_ATTRIBUTE", payload: payload });

        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('certification', certification);
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('isTrainer', true);

        //send email about certification

        handleOnClose();
    }

    const handleOnClose = () => {
        closeModal();
    }
    
    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="slide">
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAvoidingView style={{flex: 1, justifyContent: 'space-between',}}>
                   
                 <View style={{padding: 20}}>
                 <Image style={{width: 150, height: 150, alignSelf: 'center'}} source={require('../../../images/certificate.jpeg')} />

<View style={{alignItems: 'center'}}>
    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center',}}>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        Verify your certificate
    </Text>
    <Paragraph style={{color: 'rgb(137, 137, 138)', textAlign: 'center', fontWeight: '600'}}>
        After entering in your certification number it will take up 24 hours to verify your account.
    </Paragraph>
    </View>
                 </View>

   
 
    <TextInput
    value={certificationNumber} 
    onChangeText={text => setCertificationNumber(text)}
    keyboardAppearance="light"
    keyboardType="default"
    returnKeyLabel="done"
    returnKeyType="done"
    theme={{
        colors: {
            primary: '#1089ff'
        }
    }} style={{marginVertical: 10, fontSize: 12}} mode="flat" label="Certification Number" placeholder="Enter your certification number." />
<DropDownPicker
    items={certificationItems}
    defaultValue={certification}
    containerStyle={{height: 40}}
    style={{backgroundColor: '#fafafa'}}
    itemStyle={{
        justifyContent: 'flex-start'
    }}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => setCertification(item.value)}
/>
                    </View>

       {/* <View style={{width: Dimensions.get('window').width - 50, alignSelf: 'center', borderRadius: 20, backgroundColor: 'rgb(245, 246, 247)', padding: 20, justifyContent: 'center', alignItems: 'flex-start'}}>
        <View style={{marginVertical: 20}}>
                        <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
                            Why should I verify certification?
                        </Text>
                        <Text style={{color: 'rgb(187, 194, 202)', fontFamily: 'Avenir-Medium'}}>
                            Lupa only allows certified trainers to host sessions with users.
                        </Text>
                    </View>

                    <Button onPress={handleOnSubmit} color="#1089ff" theme={{roundness: 5}} mode="contained" style={{alignSelf: 'center', height: 45, alignItems: 'center', justifyContent: 'center', width: '90%'}}>
                        Submit Verification
                    </Button>
        </View>
*/}

<Button onPress={handleOnSubmit} color="#1089ff" theme={{roundness: 5}} mode="contained" style={{alignSelf: 'center', height: 45, alignItems: 'center', justifyContent: 'center', width: '90%'}}>
                        Submit Verification
                    </Button>
                    <Feather1s style={{position: 'absolute', top: 0, left: 0, marginLeft: 22}} name="x" size={24} onPress={handleOnClose} />
        </KeyboardAvoidingView>
            </SafeAreaView> 
        </Modal>

    )
}

function TrainerBackgroundVerification(props) {
    const LUPA_STATE = useSelector(state => {
        return state;
    });

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [userHasSelfExerciseSpace, setUserHasSelfExerciseSpace] = useState("unchecked");
    const [userBelongsToTrainerGym, setUserBelongsToTrainerGym] = useState("unchecked");
    const [hostInHomeSessions, setUserHostInHomeSessions] = useState('unchecked');
    const [userHasExperienceInSmallGroupSettings, setUserHasExperienceInSmallGroupSettings] = useState('unchecked');

    const [userLocation, setUserLocation] = useState({});
    const [userLocationIsSet, setUserLocationIsSet] = useState(false)

    const [forceStateUpdate, setForceStateUpdate] = useState(false);

    const [locationPermissionStatus, setLocationPermissionStatus] = useState('');

    const [interestList, setInterestList] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);

    const [smallGroupExperience, setSmallGroupExperience] = useState(0);

    const [hour, setHourlyPaymentRate] = useState(0);

    const [homeGymLocation, setHomeGymLocation] = useState('Launch Map');
    const [homeGymLocationData, setHomeGymLocationData] = useState('');

    const [mapViewVisible, setMapViewVisible] = useState(false);

    const [verificationModalVisible, setVerificationModalVisible] = useState(false);

    const showVerificationModal = () => setVerificationModalVisible(true);
    const hideVerificationModal = () => setVerificationModalVisible(false);

    useEffect(() => {
        showVerificationModal();

        async function checkLocationPermissionsAndRequest() {
            await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            .then(async (result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        //tell user it is not available on this device
                        setLocationPermissionStatus('unavailable')
                        break;
                    case RESULTS.DENIED:
                         // alert the user to change it from settings
                        //  alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
                        setLocationPermissionStatus('denied');
                        break;
                    case RESULTS.GRANTED:
                        console.log('granted')
                        await setLocationPermissionStatus('granted')
                        await fetchUserLocation();
                        break;
                    case RESULTS.BLOCKED:
                        setLocationPermissionStatus('blocked')
                        // alert the user to change it from settings
                        //  alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
                        break;
                }
            })
            .catch((error) => {
                alert(error)
                setLocationPermissionStatus('denied')
                 // alert the user to change it from settings
                        //  alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
            });
        }

        checkLocationPermissionsAndRequest()

    }, [])

    const handleInterestOnPress = (interestName) => {
        let updatedInterestList = interestList;

        if (interestList.includes(interestName)) {
            updatedInterestList.splice(interestList.indexOf(interestName), 1);
            setInterestList(updatedInterestList);
            setForceStateUpdate(!forceStateUpdate);
        } else {
            updatedInterestList.push(interestName);
            setInterestList(updatedInterestList);
            setForceStateUpdate(!forceStateUpdate);
        }

        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('trainer_interest', updatedInterestList, "");

    }

    const handleEqipmentOnPress = (equipment) => {
        let updatedEquipmentList = equipmentList;

        if (updatedEquipmentList.includes(equipment)) {
            setForceStateUpdate(!forceStateUpdate);
            updatedEquipmentList.splice(updatedEquipmentList.indexOf(equipment), 1);
            setEquipmentList(updatedEquipmentList);
        } else {
            setForceStateUpdate(!forceStateUpdate);
            updatedEquipmentList.push(equipment);
            setEquipmentList(updatedEquipmentList);
        }

        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('personal_equipment_list', updatedEquipmentList, "");
    }

    const openMapView = async () => {
        if (locationPermissionStatus != 'granted') {
            return;
        }

        if (typeof(userLocation.latitude) == 'undefined' || typeof(userLocation.longitude) == 'undefined') {
            return;
        }

        setMapViewVisible(true)
    }

    const closeMapView = () => setMapViewVisible(false)

    const handleOpenHomeGymMapView = async () => {
        if (typeof(userLocation.latitude) == 'undefined' || typeof(userLocation.longitude) == 'undefined') {
            await fetchUserLocation()
        }

            openMapView();

            console.log('finish handled open gym')
    }

    const fetchUserLocation = async () => {
            console.log('fetchingLocation')
           // LOG('Lupa.js', 'Retrieving the current users position');
            await Geolocation.getCurrentPosition(
                handleOnFetchUserLocationSuccess, 
                handleOnFetchUserLocationError,
              { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
           );

  
    }

    handleOnFetchUserLocationSuccess = async (position) => {
        const locationData = await getLocationFromCoordinates(position.coords.longitude, position.coords.latitude);
        const initialPosition = JSON.stringify(position);
        await setUserLocation(locationData);
        await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);
    }

    handleOnFetchUserLocationError = (error) => {
        alert(error.message)
    }

    const onMapViewClose = (locationInformation) => {
        if (locationInformation == undefined) return;

        setHomeGymLocation(locationInformation.name);
        setHomeGymLocationData(locationInformation);

        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('exercise_space', locationInformation);
        closeMapView()
    }

    const renderLocationPickingOptions = () => {
        if (userHasSelfExerciseSpace === 'unchecked' && userBelongsToTrainerGym === 'unchecked') {
            return;
        } else if (userHasSelfExerciseSpace == 'checked') {
            return (
                <>
                <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                        Where is your exercise space?
                    </Text>

                    <Caption style={{ fontSize: 12 }}>
                        Note: This gym will be used as your home gym.
                </Caption>

                    <Button style={{marginVertical: 10}} mode="contained" uppercase={false} color="#1089ff" onPress={handleOpenHomeGymMapView}>
                        Set Gym Location
                </Button>
                </Surface>
                <Divider style={{height: 2}} />
                </>
            )
        } else {
            return (
                <>
                <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                        Which gym do you train at?
                </Text>

                    <Caption style={{ fontSize: 12 }}>
                        Note: This gym will be used as your home gym.
                </Caption>

                    <Button style={{marginVertical: 10}} mode="contained" uppercase={false} color="#1089ff" onPress={handleOpenHomeGymMapView}>
                        Set Gym Location
                </Button>
                </Surface>
                <Divider style={{height: 2}} />
                </>
            )
        }
    }

    const handleHasOwnExerciseSpaceOnPress = () => {
        setUserHasSelfExerciseSpace('checked');
        setUserBelongsToTrainerGym('unchecked');
        LUPA_CONTROLLER_INSTANCE.setTrainerHasOwnExerciseSpace();
    }

    const handleUserBelongsToTrainerGymOnPress = () => {
        setUserBelongsToTrainerGym('checked')
        setUserHasSelfExerciseSpace('unchecked');
        LUPA_CONTROLLER_INSTANCE.setTrainerBelongsToGym();
    }

    getCheckBoxStatus = (item) => {
        if (interestList.includes(item) || equipmentList.includes(item)) {
            return "checked";
        }

        return "unchecked";
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
            <Appbar.Header style={{ backgroundColor: 'white', elevation: 0, borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)', }}>
                <Appbar.Content title="Trainer Background" titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20 }} />
            </Appbar.Header>
            <ScrollView contentContainerStyle={{ padding: 0, alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                        Do you belong to a trainer gym or do you have your own exercise studio space?
                        </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            I have my own exercise space.
                            </Text>
                        <RadioButton.Android color="#1089ff" onPress={handleHasOwnExerciseSpaceOnPress} status={userHasSelfExerciseSpace} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            I belong to a trainer gym.
                            </Text>
                        <RadioButton.Android color="#1089ff" onPress={handleUserBelongsToTrainerGymOnPress} status={userBelongsToTrainerGym} />
                    </View>
                </Surface>

                <Divider style={{height: 2}} />

                {renderLocationPickingOptions()}


                <Surface style={styles.surface}>
                    <View>
                    <Text style={styles.surfaceTitle}>
                        I have transportation and feel comfortable training clients at their home.  <Caption>
                            (This will make your profile show up for users who are looking for in home trainers.)
                        </Caption>
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            Enable In Home Training
                     </Text>
                    

                        <RadioButton.Android color="#1089ff" onPress={hostInHomeSessions === 'checked' ? () => {
                            setUserHostInHomeSessions('unchecked')
                            LUPA_CONTROLLER_INSTANCE.setTrainerIsInHomeTrainer()
                        } 
                        : 
                        () => {
                            LUPA_CONTROLLER_INSTANCE.setTrainerIsInHomeTrainer()
                            setUserHostInHomeSessions('checked')
                        }
                        } 
                        status={hostInHomeSessions} />
                    </View>
                </Surface>

                <Divider style={{height: 2}} />

                <Surface style={[styles.surface, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                    <Text style={styles.surfaceTitle}>
                        I have experience in small group settings.
                        </Text>
                    <RadioButton.Android 
                    color="#1089ff" 
                    onPress={userHasExperienceInSmallGroupSettings === 
                        'checked' ? 
                        () => {
                            setUserHasExperienceInSmallGroupSettings('unchecked') 
                            LUPA_CONTROLLER_INSTANCE.setTrainerHasExperienceInSmallGroup()
                        }
                        : 
                        () => {
                            setUserHasExperienceInSmallGroupSettings('checked')
                            LUPA_CONTROLLER_INSTANCE.setTrainerHasExperienceInSmallGroup()
                        }} 
                    status={userHasExperienceInSmallGroupSettings} />
                </Surface>

                <Divider style={{height: 2}} />

                {
                    userHasExperienceInSmallGroupSettings === 'checked' ?
                    <>
                    <Surface style={styles.surface}>
                          <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            Enter your years of experience
                            </Text>
                            <TextInput value={smallGroupExperience} onChangeText={(text) => setSmallGroupExperience(text)} onEndEditing={() => LUPA_CONTROLLER_INSTANCE.setTrainerSmallGroupExperience(smallGroupExperience)} color="#1089ff" style={{marginVertical: 10}} />
                    </Surface>
                    <Divider style={{height: 2}} />
                    </>
                    :
                    null
                }

                    
               {/* <Surface style={[styles.surface]}>
                    <Text style={styles.surfaceTitle}>
                        Have you professionally played or coached for any specific sports?
                        </Text>
                        <SearchBar platform="ios" placeholder="Find more options" containerStyle={{backgroundColor: 'transparent'}} inputStyle={{fontSize: 12}} searchIcon={() => <Feather1s size={15} name="search" color="#1089ff" />} />

                    {
                        SPORTS_GENRE.map((genre, index, arr) => {
                            if (index  >= 5) {
                                return;
                            }

                            if (index === 0) {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text>
                                            {genre}
                                        </Text>

                                        <Checkbox.Android color="#1089ff" key={index} status={interestList.includes(genre) ?  'checked' : 'unchecked'} onPress={() => handleInterestOnPress(genre)} />
                                    </View>

                                )
                            }

                            return (
                                <>
                                    <Divider style={{ marginVertical: 5 }} />

                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text>
                                            {genre}
                                        </Text>

                                        <Checkbox.Android color="#1089ff" key={index} status={interestList.includes(genre) ?  'checked' : 'unchecked'} onPress={() => handleInterestOnPress(genre)} />
                                    </View>

                                </>
                            )
                        })
                    }
                </Surface>*/}

                <Divider style={{height: 2}} />

                <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                        Do you have any specific coaching styles?
                        </Text>

                      {/* <SearchBar platform="ios" placeholder="Find more options" containerStyle={{backgroundColor: 'transparent'}} inputStyle={{fontSize: 12}} searchIcon={() => <Feather1s size={15} name="search" color="#1089ff" />} /> */}

                    {
                        COACHING_INTEREST.map((interest, index, arr) => {
                            if (index  >= 5) {
                                return;
                            }

                            if (index === 0) {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text>
                                            {interest}
                                        </Text>

                                        <Checkbox.Android color="#1089ff" status={getCheckBoxStatus(interest)} onPress={() => handleInterestOnPress(interest)} />
                                    </View>

                                )
                            }

                            return (
                                <>
                                    <Divider style={{ marginVertical: 5 }} />

                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text>
                                            {interest}
                                        </Text>

                                        <Checkbox.Android color="#1089ff" status={getCheckBoxStatus(interest)} onPress={() => handleInterestOnPress(interest)} />
                                    </View>

                                </>
                            )
                        })
                    }
                </Surface>

                <Divider style={{height: 2}} />


                <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                        Personal Equipment
                        </Text>
                     {/*   <SearchBar platform="ios" placeholder="Find more options" containerStyle={{backgroundColor: 'transparent'}} inputStyle={{fontSize: 12}} searchIcon={() => <Feather1s size={15} name="search" color="#1089ff" />} /> */}

                    {
                        EQUIPMENT_LIST.map((equipmentName, index, arr) => {

                            if (index >= 5) {
                                return;
                            }
                            
                            if (index === 0) {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text>
                                            {equipmentName}
                                        </Text>

                                        <Checkbox.Android color="#1089ff" status={getCheckBoxStatus(equipmentName)} onPress={() => handleEqipmentOnPress(equipmentName)} />
                                    </View>

                                )
                            }

                            return (
                                <>
                                    <Divider style={{ marginVertical: 5 }} />

                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text>
                                            {equipmentName}
                                        </Text>

                                        <Checkbox.Android color="#1089ff" status={getCheckBoxStatus(equipmentName)} onPress={() => handleEqipmentOnPress(equipmentName)} />
                                    </View>

                                </>
                            )
                        })
                    }
                </Surface>

                <Divider style={{height: 2}} />

                <Surface style={styles.surface}>
                          <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            How much do you charge per hour?
                            </Text>
                            <Caption>
                                This will be the hourly payment rate users see on your profile.
                            </Caption>
                            <TextInput value={hour} onChangeText={(text) => setHourlyPaymentRate(text)} onEndEditing={() => LUPA_CONTROLLER_INSTANCE.updateCurrentUser('hourly_payment_rate', hour)} color="#1089ff" style={{marginVertical: 10}} />
                    </Surface>
           

            </ScrollView>


            <LupaMapView
                initialRegionLatitude={userLocation.latitude}
                initialRegionLongitude={userLocation.longitude}
                closeMapViewMethod={gymData => onMapViewClose(gymData)}
                isVisible={mapViewVisible}
            />
    
    <TrainerCeritifcationModal isVisible={verificationModalVisible} closeModal={hideVerificationModal} />
        </View>
    )
}

const styles = StyleSheet.create({
    surface: {
        width: '100%',
        padding: 10,
        elevation: 1
    },
    surfaceTitle: {
        fontSize: 13,
        fontFamily: 'Avenir-Heavy'
    },
})

export default TrainerBackgroundVerification;