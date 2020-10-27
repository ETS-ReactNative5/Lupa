import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    RefreshControl,
    ActionSheetIOS
} from 'react-native';

import {
    Button,
    Divider,
    Appbar,
    Surface,
    DataTable,
    Caption, 
} from 'react-native-paper';

import { Avatar } from 'react-native-elements';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux'
import { LineChart } from 'react-native-chart-kit'
import { useNavigation } from '@react-navigation/native';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { MenuIcon } from '../../../icons';
import LupaController from '../../../../controller/lupa/LupaController';
import LOG, { LOG_ERROR } from '../../../../common/Logger';
import LUPA_DB from '../../../../controller/firebase/firebase';
import getBookingStructure from '../../../../model/data_structures/user/booking';
import moment from 'moment';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BOOKING_STATUS } from '../../../../model/data_structures/user/types';
import { initStripe, PAY_TRAINER_ENDPOINT, CURRENCY } from '../../../../modules/payments/stripe/index'
import { getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import { getLupaStoreState } from '../../../../controller/redux/index'
import axios from 'axios';

function UserDashboard(props) {

    useEffect(() => {

        const currUserObserver = LUPA_DB.collection('bookings').where('requester_uuid', '==', currUserData.user_uuid).where('status', '==', 2).onSnapshot(documentSnapshot => {
            let bookingData = []
            let booking = {}
            documentSnapshot.forEach(doc => {
            booking = doc.data();
            if (typeof(booking.uid) == 'undefined' 
            || booking.uid === 0 
            || booking.status == BOOKING_STATUS.BOOKING_COMPLETED) {
                
            } else {
                if (moment(booking.date).isAfter(moment(new Date())) && moment(new Date().getTime()).isAfter(moment(booking.end_time))) {
                    LUPA_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);
                } else {
                    bookingData.push(doc.data());
                }
            }
           });

            setUserBookings(bookingData);
        });

        LOG('UserDashboard.js', 'Running useEffect')
        return () => currUserObserver();
    }, []);

    const navigation = useNavigation();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const [lastUpdated, setLastUpdated] = useState(new Date().getTime());
    const [loading, setLoading] = useState(false);
    const [programsModalIsOpen, setProgramModalIsOpen] = useState(false);
    const [trainersModalIsOpen, setTrainersModalIsOpen] = useState(false);
    const [userBookings, setUserBookings] = useState([]);
    const [refreshing, setRefreshing] = useState(false)

    const handleOnRefresh =  React.useCallback(() => {
     
    }, []);

    const renderBookings = () => {
        if (userBookings.length === 0) {
            return (
                <Caption>
                You don't have any scheduled bookings.
            </Caption>
            )
        }

        return userBookings.map((booking, index, arr) => {
            return (
                <>
            <View key={booking.uid} style={{backgroundColor: 'white', alignSelf: 'center', width: Dimensions.get('window').width, padding: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
                <Avatar size={70} rounded={false} containerStyle={{backgroundColor: 'black'}} />
                <View style={{paddingHorizontal: 10}}>
                    <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', paddingVertical: 10}}>
                        Elijah Hampton
                    </Text>
                    <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
                        {moment(booking.date).format('LL').toString()}
                    </Text>
                    <Text style={{fontSize: 15, fontFamily: 'Avenir-Medium', color: 'rgb(210, 210, 210)'}}>
                       { booking.start_time}
                    </Text>
                </View>
                </View>

            </View>
            <Divider style={{width: Dimensions.get('window').width}} />
            </>
            )
        });
    }

    const renderComponent = () => {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing}  onRefresh={handleOnRefresh} />} contentContainerStyle={{backgroundColor: '#FFFFFF'}}>


            <View style={{marginVertical: 15, padding: 10}}>
<Text style={{fontSize: 13, paddingVertical: 10, fontWeight: '600'}}>
               Active Bookings
            </Text>
            <ScrollView contentContainerStyle={{ alignItems: 'center'}}>
            {renderBookings()}
            </ScrollView>
          
</View>

</ScrollView>
        )
    }
    
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF'
        }}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0, borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)',}}>
            <MenuIcon onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Dashboard"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
                <Appbar.Action onPress={() => navigation.push('Messages')} icon={() => <Feather1s thin={true} name="mail" size={20} />}/>
              <Appbar.Action onPress={() => navigation.push('Notifications')} icon={() => <Feather1s thin={true} name="bell" size={20} />}/>
</Appbar.Header> 
            {renderComponent()}
        </View>
    )
}

export default UserDashboard;