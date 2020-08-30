import React, { useState, useEffect } from 'react';

import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';

import {
  Surface,
  IconButton,
  Button,
  Caption,
  Divider,
  Paragraph
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import CreateCustomWorkoutModal from '../../../workout/program/createprogram/buildworkout/modal/CreateCustomWorkoutModal';
import SchedulerModal from './SchedulerModal';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import LUPA_DB from '../../../../controller/firebase/firebase';


function LupaCalendar({ captureMarkedDates }) {
  const [markedDates, setMarkedDates] = useState({})
  const [items, setItems] = useState({})

  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  })

  const addMarkedDate = (day) => {
    const dateString = day.dateString;
    let dateObject = markedDates;
    dateObject[day.dateString] = { startingDay: markedDates.length === 0 ?  true : false, color: '#1089ff', selected: true, marked: true }
    setMarkedDates(dateObject);
    captureMarkedDates(day.dateString);
  }

  useEffect(() => {
      const currUserSubscription = LUPA_DB.collection('users').doc(currUserData.user_uuid).onSnapshot(documentSnapshot => {
        let userData = documentSnapshot.data()
        setItems(userData.scheduler_times);
    })

  return () => currUserSubscription()
  }, []);

  return (
    <View style={styles.container}>
          <Agenda
    markingType="multi-period"
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  items={items}
  // Callback that gets called when items for a certain month should be loaded (month became visible)
  loadItemsForMonth={(month) => {console.log('trigger items loading')}}
  // Callback that fires when the calendar is opened or closed
  onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
  // Callback that gets called on day press
  onDayPress={(day)=> addMarkedDate(day)}
  // Callback that gets called when day changes while scrolling agenda list
  onDayChange={(day)=>{console.log('day changed')}}
  // Initially selected day
  selected={Date()}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={Date()}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2020-31-12'}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // Specify how each item should be rendered in agenda
  renderItem={(item, firstItemInDay) => {
    if (typeof(item) == 'undefined' || item == null) {
      console.log('null item')
      return;
    }

    console.log('YYY: ' + item[0].times)
  }}
  // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
  renderDay={(day, item) => {
    if (typeof(day) == 'undefined' || day == null) {
      return;
    }

    return (
    <View style={{width: '100%'}}>
      <Text>
        August {day.day}, {day.year}
      </Text>
    </View>
    );
  }}
  // Specify how empty date content with no items should be rendered
  //renderEmptyDate={() => {return (<View />);}}
  // Specify how agenda knob should look like
  //renderKnob={() => {return (<View />);}}
  // Specify what should be rendered instead of ActivityIndicator
  //renderEmptyData = {() => {return (<View />);}}
  // Specify your item comparison function for increased performance
  rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
  // Hide knob button. Default = false
  hideKnob={false}
  // By default, agenda dates are marked if they have at least one item, but you can override this if needed
  markedDates={markedDates}
  // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
  disabledByDefault={true}
  // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
  onRefresh={() => console.log('refreshing...')}
  // Set this true while waiting for new data from a refresh
  refreshing={false}
  // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
  refreshControl={null}
  // Agenda theme
  theme={{
    agendaDayTextColor: 'yellow',
    agendaDayNumColor: 'green',
    agendaTodayColor: 'red',
    agendaKnobColor: 'blue',
    backgroundColor: 'white'
  }}
  // Agenda container style
  style={{height: 800}}
/>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
})

export default LupaCalendar;