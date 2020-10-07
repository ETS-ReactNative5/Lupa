import React, { createRef, useEffect, useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TextInput
} from 'react-native'

import {
    Surface,
    Caption,
    Button,
} from 'react-native-paper';

import {
    Divider
} from 'react-native-elements'

import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Video } from 'expo-av';
import Slider from "react-native-slider";
import { Pagination } from 'react-native-snap-carousel'

import {Picker} from '@react-native-community/picker';
import RBSheet from 'react-native-raw-bottom-sheet'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather1s from 'react-native-feather1s/src/Feather1s';
let weeks = []

const restTimes = [
    'Edit',
    '15',
    '30',
    '90',
    '120',
    '180',
    '300',
]

const exerciseTempos = [
    'Edit',
    '2-1-2',
    '4-0-2',
]
function WorkoutDisplay({ workout, handleSuperSetOnPress, programDuration }) {
    const [updateState, forceUpdateState] = useState(false);

    const [currProgramWeek, setCurrProgramWeek] = useState(0)

    const programWeekPicker = createRef();
    const restTimePickerRef = createRef();
    const tempoPickerRef = createRef();

    const [pickedExerciseTempo, setPickedExerciseTempo] = useState(exerciseTempos[0]);
    const [pickedRestTime, setPickedRestTime] = useState(restTimes[0])

    const [editTempoIsVisible, setEditTempo] = useState(false);
    const [editRestTimeIsVisible, setEditRestTime] = useState(false);

    const [inputRestTimeOneText, setRestTimeInputOneText] = useState("")
    const [inputRestTimeTwoText, setRestTimeInputTwoText] = useState("")
    const [inputRestTimeSupersetText, setRestTimeSupersetText] = useState("")

    const [inputTempoOneText, setTempoInputOneText] = useState("");
    const [inputTempoTwoText, setTempoInputTwoText] = useState("");
    const [inputTempoSupersetText, setTempoSupersetText] = useState("");

    const handleChangeRepsSliderValue = (workoutRef, value) => {
        workoutRef.workout_reps = value;
        forceUpdateState(!updateState)
    }

    const handleChangeSetsSliderValue  = (workoutRef, value) => {
        workoutRef.workout_sets = value;
        forceUpdateState(!updateState)
    }

    const handleIncrementExcerciseSets = (workoutRef) => {
        workoutRef.workout_sets++;
        forceUpdateState(!updateState)
    }

    const handleDecrementExerciseSets = (workoutRef) => {
        workoutRef.workout_sets--;
        forceUpdateState(!updateState)
    }

    const handleIncrementExcerciseReps = (workoutRef) => {
        workoutRef.workout_reps++;
        forceUpdateState(!updateState)
    }

    const handleDecrementExerciseReps = (workoutRef) => {
        workoutRef.workout_reps--;
        forceUpdateState(!updateState)
    }

    const changeExerciseRestTime = (workoutRef, restTime) => {
        if (restTime == 'Edit') {
            setEditRestTime(true);
            return;
        }
        workoutRef.workout_rest_time = restTime;
        setPickedRestTime(restTime)
    }

    const handleOnChangeRestTimeOneInputText  = (text, workoutRef) => {
        setRestTimeInputOneText(text);
        workoutRef.workout_rest_time = inputRestTimeOneText;
    }

    const handleOnChangeRestTimeTwoInputText = (text, workoutRef) => {
        setRestTimeInputTwoText(text);
        workoutRef.workout_rest_time = inputRestTimeTwoText;
    }

    const handleOnChangeRestTimeSupersetInputText = (text, workoutRef) => {
        setRestTimeSupersetText(text);
        workoutre.workout_rest_time = inputRestTimeSupersetText;
    }

    const handleOnChangeTempoInputOneText  = (text, workoutRef) => {
       setTempoInputOneText(text)
        workoutRef.workout_tempo = inputTempoOneText;
    }

    const handleOnChangeTempoInputTwoText = (text, workoutRef) => {
        setTempoInputTwoText(text)
        workoutRef.workout_tempo = inputTempoTwoText;
    }

    const handleOnChangeTempoSupersetText = (text, workoutRef) => {
        setTempoSupersetText(text)
        workoutre.workout_tempo = inputRestTimeSupersetText;
    }

    const changeExerciseTempo = (workoutRef, tempo) => {
        if (tempo == 'Edit') {
            setEditTempo(true);
            return;
        }

        workoutRef.workout_tempo = tempo;
        setPickedExerciseTempo(tempo);
    }

    const openProgramWeekPicker = () => programWeekPicker.current.open();
    const closeProgramWeekPicker = () => programWeekPicker.current.close();

    const openRestTimePicker = () => restTimePickerRef.current.open();
    const closeRestTimePicker = () => restTimePickerRef.current.close();

    const openTempoPicker = () => tempoPickerRef.current.open();
    const closeTempoPicker = () => tempoPickerRef.current.close();

    const renderTempoPicker = () => {
        return (
            <RBSheet
            ref={tempoPickerRef}
            height={300}
            closeOnPressMask={true}
            customStyles={{
                wrapper: {

                },
                container: {
                    borderRadius: 20
                },
                draggableIcon: {
                    backgroundColor: '#000000'
                }
            }}
            dragFromTopOnly={true}

        >
            <View style={{flex: 1}}>
            <View style={{width: '100%'}}>
                <Button color="#1089ff" style={{alignSelf: 'flex-end'}} mode="text" onPress={closeTempoPicker}>
                    <Text>
                        Done
                    </Text>
                </Button>
                </View>
              
            <Picker
selectedValue={pickedExerciseTempo}
style={{height: '100%', width: '100%'}}
onValueChange={(itemValue, itemIndex) => changeExerciseTempo(workout, itemValue)}>
  {
      exerciseTempos.map((tempo, index, arr) => {
          return <Picker.Item key={index} label={tempo} value={tempo} />
      })
  }
</Picker>
</View>
<SafeAreaView />
        </RBSheet>
        )
    }

    const renderRestTimePicker = () => {
        return (
            <RBSheet
            ref={restTimePickerRef}
            height={300}
            closeOnPressMask={true}
            customStyles={{
                wrapper: {

                },
                container: {
                    borderRadius: 20
                },
                draggableIcon: {
                    backgroundColor: '#000000'
                }
            }}
            dragFromTopOnly={true}

        >
            <View style={{flex: 1}}>
            <View style={{width: '100%'}}>
                <Button color="#1089ff" style={{alignSelf: 'flex-end'}} mode="text" onPress={closeRestTimePicker}>
                    <Text>
                        Done
                    </Text>
                </Button>
                </View>
              
            <Picker
selectedValue={pickedRestTime}
style={{height: '100%', width: '100%'}}
onValueChange={(itemValue, itemIndex) => changeExerciseRestTime(workout, itemValue)}>
  {
      restTimes.map((restTime, index, arr) => {
          return <Picker.Item key={index} label={restTime} value={restTime} />
      })
  }
</Picker>
</View>
<SafeAreaView />
        </RBSheet>
        )
    }

    const renderComponentDisplay = () => {
        switch(workout.superset.length == 0)
        {
            case true:
                return (
                    <>
                    <View style={{flex: 1, height: 420, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                     <View style={{flex: 1,}}>

                                        <View style={{paddingVertical: 5, paddingHorizontal: 10, alignItems: 'flex-start'}}>
                                        <Text adjustsFontSizeToFit={true} style={{fontFamily: 'Avenir-Medium', color: '#23374d', fontSize: 15, padding: 10}}>
                                          {workout.workout_name}
                                        </Text>


                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
 {/* Rest Time */}
 <View style={{alignItems: 'flex-start'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}} >
                Rest Time
            </Text>
            {
            editRestTimeIsVisible === true ?
            null
            :
            <FeatherIcon name="chevron-up" />
        }

            </View>
            {
                editRestTimeIsVisible === true ?
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                 <TextInput key={workout.workout_uid} value={inputRestTimeOneText} onChangeText={text => handleOnChangeRestTimeOneInputText(text, workout)} placehold="0-0-0" style={{alignItems: 'center', justifyContent: 'center', width: 70, borderWidth: 0.5, borderColor: 'black', padding: 3}} />
                 <FeatherIcon onPress={() => setEditRestTime(false)} size={18} name="refresh-cw"  style={{paddingHorizontal: 10}}/>
            
                </View>

               
                :

                <TouchableWithoutFeedback style={{marginHorizontal: 15}} onPress={openRestTimePicker}>

                <Text style={{fontSize: 20}}>
                                    {workout.workout_rest_time}
                                </Text>
                
                                </TouchableWithoutFeedback>
            }
          
        </View>

          {/* Tempo */}
          <View style={{alignItems: 'flex-start'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}} >
                Tempo
            </Text>
            {
            editTempoIsVisible === true ?
                null
                :
                <FeatherIcon name="chevron-up" />
            }
            </View>
            {
                editTempoIsVisible === true ?
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <TextInput key={workout.workout_uid} value={inputTempoOneText} onChangeText={text => handleOnChangeTempoInputOneText(text, workout)} placehold="0-0-0" style={{alignItems: 'center', justifyContent: 'center', width: 70, borderWidth: 0.5, borderColor: 'black', padding: 3}} />
                <FeatherIcon onPress={() => setEditTempo(false)} size={18} name="refresh-cw"  style={{paddingHorizontal: 10}}/>
           
               </View>

                :
                <TouchableWithoutFeedback style={{marginHorizontal: 15}} onPress={openTempoPicker}>
                <Text style={{fontSize: 20}}>
                {workout.workout_tempo}
                                </Text>
                                </TouchableWithoutFeedback>
            }
       
        </View>
                                        </View>

                                    
                                        </View>

                                        <Surface style={{width: '100%', height: '60%', alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
                                                <Video shouldPlay={true} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
                                            </Surface>
        
                                 
                                            <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
        
        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Sets
            </Text>
            <View style={{height: 30, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseSets(workout)} />
        </View>
        <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20}}>
                {workout.workout_sets}
            </Text>
        </View>
        <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseSets(workout)}/>
    </View>
        </View>

        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Reps
            </Text>
            <View style={{height: 30, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseReps(workout)} />
        </View>
        <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20}}>
                {workout.workout_reps}
            </Text>
        </View>
        <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseReps(workout)}/>
    </View>
        </View>
        
    
    </View>
    </View>     

                                            </View>

                                        
                                                        

                                    </Surface>
                                    </View>
                                    <Divider style={{height: 10, backgroundColor: '#EEEEEE'}} />
                                    </>
                )
            case false:

                return (
                    <View style={{flex: 1}}>
                        <ScrollView 
                                showsHorizontalScrollIndicator={false} 
                                pagingEnabled={true} 
                                decelerationRate={0} 
                                snapToAlignment='center' 
                                snapToInterval={Dimensions.get('window').width} 
                                horizontal={true} 
                                centerContent 
                                scrollEventThrottle={3}
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                        >
                        <View style={{flex: 1, height: 420, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                     <View style={{flex: 1,}}>

                                        <View style={{paddingVertical: 5, paddingHorizontal: 10, alignItems: 'flex-start'}}>
                                        <Text adjustsFontSizeToFit={true} style={{fontFamily: 'Avenir-Medium', color: '#23374d', fontSize: 15, padding: 10}}>
                                          {workout.workout_name}
                                        </Text>


                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
 {/* Rest Time */}
 <View style={{alignItems: 'flex-start'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}} >
                Rest Time
            </Text>
            {
            editRestTimeIsVisible === true ?
            null
            :
            <FeatherIcon name="chevron-up" />
        }

            </View>
            {
                editRestTimeIsVisible === true ?
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                 <TextInput key={workout.workout_uid} value={inputRestTimeTwoText} onChangeText={text => handleOnChangeRestTimeTwoInputText(text, workout)} placehold="0-0-0" style={{alignItems: 'center', justifyContent: 'center', width: 70, borderWidth: 0.5, borderColor: 'black', padding: 3}} />
                 <FeatherIcon onPress={() => setEditRestTime(false)} size={18} name="refresh-cw"  style={{paddingHorizontal: 10}}/>
            
                </View>

               
                :

                <TouchableWithoutFeedback style={{marginHorizontal: 15}} onPress={openRestTimePicker}>

                <Text style={{fontSize: 20}}>
                                    {workout.workout_rest_time}
                                </Text>
                
                                </TouchableWithoutFeedback>
            }
          
        </View>

          {/* Tempo */}
          <View style={{alignItems: 'flex-start'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}} >
                Tempo
            </Text>
            {
            editTempoIsVisible === true ?
                null
                :
                <FeatherIcon name="chevron-up" />
            }
            </View>
            {
                editTempoIsVisible === true ?
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <TextInput key={workout.workout_uid} value={inputTempoTwoText} onChangeText={text => handleOnChangeTempoInputTwoText(text, workout)} placehold="0-0-0" style={{alignItems: 'center', justifyContent: 'center', width: 70, borderWidth: 0.5, borderColor: 'black', padding: 3}} />
                <FeatherIcon onPress={() => setEditTempo(false)} size={18} name="refresh-cw"  style={{paddingHorizontal: 10}}/>
           
               </View>

                :
                <TouchableWithoutFeedback style={{marginHorizontal: 15}} onPress={openTempoPicker}>
                <Text style={{fontSize: 20}}>
                {workout.workout_tempo}
                                </Text>
                                </TouchableWithoutFeedback>
            }
       
        </View>
                                        </View>

                                    
                                        </View>

                                        <Surface style={{width: '100%', height: '60%', alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
                                                <Video shouldPlay={true} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
                                            </Surface>
        
                                 
                                            <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
        
        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Sets
            </Text>
            <View style={{height: 30, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseSets(workout)} />
        </View>
        <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20}}>
                {workout.workout_sets}
            </Text>
        </View>
        <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseSets(workout)}/>
    </View>
        </View>

        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Reps
            </Text>
            <View style={{height: 30, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseReps(workout)} />
        </View>
        <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20}}>
                {workout.workout_reps}
            </Text>
        </View>
        <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseReps(workout)}/>
    </View>
        </View>
        
    
    </View>
    </View>     

                                            </View>

                                        
                                                        

                                    </Surface>
                                    </View>
                                    {
                                        workout.superset.map((superset, index, arr) => {
                                            return (
                                                <View style={{flex: 1, height: 420, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                                <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                                 <View style={{flex: 1,}}>
            
                                                    <View style={{paddingVertical: 5, paddingHorizontal: 10, alignItems: 'flex-start'}}>
                                                    <Text adjustsFontSizeToFit={true} style={{fontFamily: 'Avenir-Medium', color: '#23374d', fontSize: 15, padding: 10}}>
                                          {superset.workout_name}
                                        </Text>
            
            
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
             {/* Rest Time */}
             <View style={{alignItems: 'flex-start'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}} >
                Rest Time
            </Text>
            {
            editRestTimeIsVisible === true ?
            null
            :
            <FeatherIcon name="chevron-up" />
        }

            </View>
            {
                editRestTimeIsVisible === true ?
                <View key='superSetRestTimeView' style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                 <TextInput key={superset.workout_uid} value={inputRestTimeSupersetText} onChangeText={text => handleOnChangeRestTimeSupersetInputText(text, superset)} placehold="0-0-0" style={{alignItems: 'center', justifyContent: 'center', width: 70, borderWidth: 0.5, borderColor: 'black', padding: 3}} />
                 <FeatherIcon onPress={() => setEditRestTime(false)} size={18} name="refresh-cw"  style={{paddingHorizontal: 10}}/>
            
                </View>

               
                :

                <TouchableWithoutFeedback style={{marginHorizontal: 15}} onPress={openRestTimePicker}>

                <Text style={{fontSize: 20}}>
                                    {superset.workout_rest_time}
                                </Text>
                
                                </TouchableWithoutFeedback>
            }
          
        </View>
            
                      {/* Tempo */}
                      <View style={{alignItems: 'flex-start'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}} >
                Tempo
            </Text>
            {
            editTempoIsVisible === true ?
                null
                :
                <FeatherIcon name="chevron-up" />
            }
            </View>
            {
                editTempoIsVisible === true ?
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <TextInput key={workout.workout_uid} value={inputTempoSupersetText} onChangeText={text => handleOnChangeTempoSupersetText(text, superset)} placehold="0-0-0" style={{alignItems: 'center', justifyContent: 'center', width: 70, borderWidth: 0.5, borderColor: 'black', padding: 3}} />
                <FeatherIcon onPress={() => setEditTempo(false)} size={18} name="refresh-cw"  style={{paddingHorizontal: 10}}/>
           
               </View>

                :
                <TouchableWithoutFeedback style={{marginHorizontal: 15}} onPress={openTempoPicker}>
                <Text style={{fontSize: 20}}>
                {workout.workout_tempo}
                                </Text>
                                </TouchableWithoutFeedback>
            }
       
        </View>
                                                    </View>
            
                                                
                                                    </View>
            
                                                    <Surface style={{width: '100%', height: '60%', alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
                                                            <Video shouldPlay={true} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
                                                        </Surface>
                    
                                             
                                                        <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
                    
                    <View style={{marginHorizontal: 5}}>
                        <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                            Sets
                        </Text>
                        <View style={{height: 30, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseSets(superset)} />
                    </View>
                    <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
                    <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>
                            {superset.workout_sets}
                        </Text>
                    </View>
                    <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
                    <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseSets(superset)}/>
                </View>
                    </View>
            
                    <View style={{marginHorizontal: 5}}>
                        <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                            Reps
                        </Text>
                        <View style={{height: 30, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseReps(superset)} />
                    </View>
                    <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
                    <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 20}}>
                            {superset.workout_reps}
                        </Text>
                    </View>
                    <View style={{height: 30, backgroundColor: '#212121', width: 1}} />
                    <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseReps(superset)}/>
                </View>
                    </View>
                    
                
                </View>
                </View>     
            
                                                        </View>
            
                                                    
                                                                    
            
                                                </Surface>
                                                </View>
                                            )
                                        })
                                    }
                        </ScrollView>
                        <Pagination  dotsLength={5} />
                        <Divider style={{height: 10, backgroundColor: '#EEEEEE'}} />
                    </View>
                )
                default:
                    return <Text>
                        Huuh
                    </Text>
        }
    }

    renderProgramWeekPicker = () => {
        weeks = new Array(programDuration).fill(0)
        for (let i = 0; i < programDuration; i++) {
            weeks[i] = i
        }

        return (
            <RBSheet
                ref={programWeekPicker}
                height={250}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {

                    },
                    container: {
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    },
                    draggableIcon: {
                        backgroundColor: 'rgb(220, 220, 220)',
                    }
                }}
            >
                <View style={{flex: 1}}>
                    <View style={{width: '100%'}}>
                    <Button color="#1089ff" style={{alignSelf: 'flex-end'}} mode="text" onPress={closeProgramWeekPicker}>
                        <Text>
                            Done
                        </Text>
                    </Button>
                    </View>
                  
                    <Picker
        selectedValue={currProgramWeek}
        style={{height: '100%', width: '100%'}}
        onValueChange={(itemValue, itemIndex) => setCurrProgramWeek(itemValue)}>
            {
                weeks.map(weekNum => {
                    return <Picker.Item label={(weekNum + 1).toString()} value={weekNum} key={weekNum} />
                })
            }
      </Picker>
                </View>
            </RBSheet>
        )
    }

    return (
        <>
        {renderComponentDisplay()}
        {renderRestTimePicker()}
        {renderTempoPicker()}
      </>
    )
}

const styles = StyleSheet.create({
    captionNotifier: {
        color: '#e53935',
        fontSize: 12
    },
    container: {
        height: 30,
        width: '80%',
      },
      track: {
        height: 4,
        backgroundColor: '#303030',
        width: '100%',
      },
      thumb: {
        width: 10,
        height: 10,
        backgroundColor: '#31a4db',
        borderRadius: 10 / 2,
        shadowColor: '#31a4db',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 2,
        shadowOpacity: 1,
      }
})

export default WorkoutDisplay;