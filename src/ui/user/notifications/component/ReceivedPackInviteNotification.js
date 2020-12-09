import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Avatar,
    Button,
    Appbar,
    Caption,
    Divider,
} from 'react-native-paper';
import LiveWorkout from '../../../workout/modal/LiveWorkout';

import ProgramInformationPreview from '../../../workout/program/ProgramInformationPreview';
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';
import LupaController from '../../../../controller/lupa/LupaController';
import { useNavigation } from '@react-navigation/native';
import ProgramOptionsModal from '../../../workout/program/modal/ProgramOptionsModal';
import LUPA_DB, { LUPA_AUTH } from '../../../../controller/firebase/firebase';
import getBookingStructure from '../../../../model/data_structures/user/booking';
import { BOOKING_STATUS, SESSION_TYPE } from '../../../../model/data_structures/user/types';
import moment from 'moment';
import { LOG_ERROR } from '../../../../common/Logger';

const {windowWidth} = Dimensions.get('window').width


function ReceivedPackInviteNotification({ notificationData }) {
    const [senderUserData, setSenderUserData] = useState(getLupaUserStructure())
    const [packData, setPackData] = useState(notificationData.data);
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const renderNotificationMessage = () => {
        try {
            return (
                <Text>
                               <Text style={{fontWeight: '500'}}>
       {senderUserData.display_name}{" "}
       </Text>
       <Text>
       has invited you to join their pack {packData.name}.
       </Text>
        </Text>
            )
       
    } catch(error) {
        alert(error)
    }
    }

    const handleOnAcceptPackInvite = () => {
        const packUID = notificationData.data.uid;
        LUPA_CONTROLLER_INSTANCE.handleOnAcceptPackInvite(packUID, currUserData.user_uuid)
    }

    const handleOnDeclinePackInvite = () => {
        const packUID = notificationData.data.uid;

        LUPA_CONTROLLER_INSTANCE.handleOnDeclinePackInvite(packUID, currUserData.user_uuid)
    }

    const renderActionButtons = () => {
        if (packData.invited_members.includes(currUserData.user_uuid)) {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}>
                <Button uppercase={false} color="#1089ff" onPress={handleOnAcceptPackInvite}>
                    Accept
                </Button>
        
                <Button uppercase={false} color="#1089ff" onPress={handleOnDeclinePackInvite}>
                    Decline
                </Button>
            </View>
            )
        } else {
            return null;
        }
    }

    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(notificationData.from).then(data => {
                setSenderUserData(data)
            })
        }

        const PACK_OBSERVER = LUPA_DB.collection('packs').where('uid', '==', notificationData.data.uid).onSnapshot(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
                const data = doc.data();
                setPackData(data);
            })
        })

        fetchData()

        return () => PACK_OBSERVER();
    }, []);

    return (
        <>
                   <View style={{width: '100%', marginVertical: 15}}>
                       <View style={{width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                           <Avatar.Image source={{uri: senderUserData.photo_url}} size={35} style={{marginHorizontal: 10}} />
                           <View>
                               {renderNotificationMessage()}
                           </View>
                       </View>
                       {renderActionButtons()}
                   </View>
                    
                   <Divider />
                   </>
    )
}

export default ReceivedPackInviteNotification;