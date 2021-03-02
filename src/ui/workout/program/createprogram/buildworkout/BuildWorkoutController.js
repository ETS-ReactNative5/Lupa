import React, { createRef } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    SectionList,
    TouchableWithoutFeedback
} from 'react-native';

import {
    Surface,
    Caption,
    Snackbar,
    Appbar,
    Button,
    Divider,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';

import RBSheet from 'react-native-raw-bottom-sheet';

import SingleWorkout from '../../../component/SingleWorkout';
import LupaController from '../../../../../controller/lupa/LupaController';

import { connect } from 'react-redux'
import CreateCustomWorkoutModal from './modal/CreateCustomWorkoutModal';
import { Video } from 'expo-av';
import AddSets from './component/AddSets';

import { Picker } from '@react-native-community/picker';
import { getProgramWorkoutStructureEntry } from '../../../../../model/data_structures/programs/program_structures';
import { getLupaExerciseStructure } from '../../../../../model/data_structures/workout/exercise_collections';
import { LOG_ERROR } from '../../../../../common/Logger';
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';
import WorkoutDisplay from './component/WorkoutDisplay';
import { Constants } from 'react-native-unimodules';
import { weekdays } from 'moment';
import CreateCustomExercise from '../../../modal/CreateCustomExercise';
import Feather1s from 'react-native-feather1s/src/Feather1s';

const PLACEMENT_TYPES = {
    SUPERSET: 'superset',
    EXERCISE: 'exercise',
}

const CATEGORIES = [
    'Bodyweight',
    'Barbell',
    'Dumbbell',
    'Kettlebell',
    'Machine Assisted',
    'Medicine Ball',
    'Plyometric',
    'Personal Library'
]

const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',

]

//Redux::mapStateToProps
const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

function Exercise(workoutObject, workoutWeek) {
    this.workout_name = workoutObject.workout_name
    this.workout_description = workoutObject.workout_description
    this.workout_media = {
        media_type: workoutObject.workout_media_type,
        uri: workoutObject.workout_media_uri,
    }
    this.workout_how_to_media = {
        media_type: workoutObject.workout_how_to_media_type,
        uri: workoutObject.workout_how_to_media_uri,
    }
    this.workout_reps = 0
    this.workout_sets = 0
    this.workout_uid = Math.random().toString()
    this.workout_tempo = '0-0-0'
    this.workout_rest_time = 0
    this.intensity = 0;
   // this.workout_day = workoutDay
    this.superset = []
    this.default_media_type = workoutObject.default_media_type;
    this.default_media_uri = workoutObject.default_media_uri;
    this.index = workoutObject.index;
    this.equipment = []
}

/**
 * @author Elijah Hampton
 * BuildWorkoutController
 */
class BuildWorkoutController extends React.Component {
    constructor(props) {
        super(props);

        this.trackedWorkouts = []

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.addedWorkoutOptionsRef = createRef();
        this.weekDayRBSheetRef = createRef();
        this.dayOfTheWeekRBSheetRef = createRef();
        this.addExerciseRBSheetRef = createRef();
        this.addExerciseNestedRBSheetRef = createRef()

        this.trackedExercises = []

        this.state = {
            addedWorkoutsScrollViewWidth: 0,
            currPressedPopulatedWorkout: getLupaExerciseStructure(),
            weeks: [],
            searchValue: '',
            bottomViewIndex: 0,
            folderIsSelected: false,
            folderSelected: '',
            snackBarVisible: false,
            snackBarReason: '',
            workoutDays: [],
            numWorkoutsAdded: 0,
            currDayIndex: 0,
            currWeekIndex: 0,
            ready: false,
            currPlacementType: PLACEMENT_TYPES.EXERCISE,
            customWorkoutModalVisible: false,
            addWorkoutTags: false,
            equipmentList: [],
            libraryData: [
                {
                    title: "Bodyweight",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.bodyweight,
                },
                {
                    title: "Barbell",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.barbell
                },
                {
                    title: "Dumbbell",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.dumbell
                },
                {
                    title: "Kettlebell",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.kettlebell
                },
                {
                    title: "Machine Assisted",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.machine_assisted
                },
                {
                    title: "Medicine Ball",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.medicine_ball
                },
                {
                    title: "Plyometric",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.plyometric
                },
            ],
            currView: 0,
        }
    }

    /**
     * Lifecycle method componentDidMount
     */
    async componentDidMount() {
        let weeks = [], workoutDays = [];
        const programDuration = this.props.programData.program_duration;

        if (this.props.isEditing == true) {
            for (let i = 0; i < programDuration; i++) {
                await weeks.push(i);
            }
           workoutDays = this.props.programData.program_workout_structure
        } else {
          // workoutDays = new Array(programDuration);
           workoutDays = {}

            for (let i = 0; i < programDuration; i++) {
                await weeks.push(i);
                workoutDays.i = []
            }
    }


        await this.setState({ ready: true, weeks: weeks, workoutDays: workoutDays })
    }

    /**
     * Changes the currView state variables causing the view to render the correct view.
     * @param {*} index 
     */
    goToIndex = (index) => {
        this.setState({ currView: index })
    }

    /**
     * Saves the program workout data to the appropriate document.
     * @param {*} workoutDays 
     */
    handleSaveProgramData = (workoutDays) => {
        for (let i = 0; i < workoutDays.length; i++) {
<<<<<<< HEAD
            if (workoutDays[i].length == 0) {
                this.setState({
                    snackBarVisible: true,
                    snackBarReason: 'You must add atleast one exercise for this week.'
                })
                return;
=======
            let days = workoutDays[i];
            for (let j = 0; j < weekDays.length; j++) {
                if (days[weekDays[j]].length == 0 && this.props.program_workout_days.includes(weekDays[j])) {
                    this.setState({
                        snackBarVisible: true,
                        snackBarReason: 'You must add atleast one exercise to week ' + (i + 1) + ' for ' + weekDays[j]
                    })
                    return;
                }
>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736
            }
        }

        this.props.saveProgramWorkoutData(workoutDays, this.state.numWorkoutsAdded, this.state.equipmentList)
    }

    /**
     * Returns the current day inside of program_workout_days 
     * based on the currDayIndex;
     */
    getCurrentDay = () => {
        const currIndex = this.state.currDayIndex
        try {
            return this.props.programData.program_workout_days[currIndex]
        } catch (error) {
            return this.props.program_workout_days[currIndex];
        }
    }

    /**
     * Removes a workout from the workoutDays structure.
     */
    deleteWorkout = async () => {
        await this.addedWorkoutOptionsRef.current.close();
        const workoutToDelete = this.state.currPressedPopulatedWorkout;
        const currWeek = this.getCurrentWeek()

        let newState = this.state.workoutDays;

        for (let i = 0; i < this.state.workoutDays[currWeek].length; i++) {
            if (this.state.workoutDays[currWeek][i].workout_uid == workoutToDelete.workout_uid) {
                newState[currWeek].splice(i, 1);
            }
        }

        this.setState({ workoutDays: newState })
    }

    /**
     * Adds a workout to the workoutDays structure.
     * @param {*} workoutObject 
     * @param {*} placementType 
     */
    captureWorkout = (workoutObject, placementType) => {
<<<<<<< HEAD
            const currWeek = this.getCurrentWeek();
            
            let updatedWorkout = new Exercise(workoutObject, currWeek)
=======
            const workoutDay = this.getCurrentDay()
            const currWeek = this.getCurrentWeek();
            
            let updatedWorkout = new Exercise(workoutObject, workoutDay)
>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736

            if (typeof (workoutObject) == 'undefined') {
                return;
            }

            let newWorkoutData = this.state.workoutDays;
            let workoutToUpdate = undefined;

            switch (this.state.currPlacementType) {
                case PLACEMENT_TYPES.SUPERSET:
                    workoutToUpdate = this.state.currPressedPopulatedWorkout;
                    workoutToUpdate.superset.push(updatedWorkout);

<<<<<<< HEAD
                    for (let i = 0; i < this.state.workoutDays[currWeek].length; i++) {
                        if (this.state.workoutDays[currWeek][i].workout_uid == workoutToUpdate.workout_uid) {
                            newWorkoutData[currWeek][i] = workoutToUpdate;
=======
                    for (let i = 0; i < this.state.workoutDays[currWeek][workoutDay].length; i++) {
                        if (this.state.workoutDays[currWeek][workoutDay].workout_uid == workoutToUpdate.workout_uid) {
                            newWorkoutData[currWeek][workoutDay][i] = workoutToUpdate;
>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736
                        }
                    }

                    break;
                case PLACEMENT_TYPES.EXERCISE:
<<<<<<< HEAD
                    newWorkoutData[currWeek].push(updatedWorkout);
=======
                    newWorkoutData[currWeek][workoutDay].push(updatedWorkout);
>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736
                    break;
                default:
            }

            const num = this.state.numWorkoutsAdded + 1;
            this.updateEquipmentList(updatedWorkout)

            this.setState({
                workoutDays: Array.from(newWorkoutData),
                numWorkoutsAdded: num,
            })
    }

    updateEquipmentList = (exercise) => {
        let updatedEquipmentList = this.state.equipmentList;
        for (let i = 0; i < exercise.required_equipment; i++) {
            if (updatedEquipmentList.includes(exercise.required_equipment[i]) == false) {
                updatedEquipmentList.push(exercise.required_equipment[i])
            }
        }

        this.setState({
            equipmentList: updatedEquipmentList
        })
    }

    /**
     * Returns the workouts for the current day and week.
     */
    getCurrentDayContent = () => {
        const currWeek = this.getCurrentWeek();
        const workoutDays = this.state.workoutDays;

        if (!this.state.ready) {
            return null;
        }

        try {
            if (typeof (workoutDays[currWeek]) == 'undefined') {
                return null;
            }

            const currWorkoutDaysState = workoutDays[currWeek];
            const content = currWorkoutDaysState.map((exercise, index, arr) => {
                return (
                    <TouchableWithoutFeedback key={index} style={[styles.populatedExerciseTouchableContainer, { width: this.state.addedWorkoutsScrollViewWidth - 10, }]}>
                        <WorkoutDisplay sessionID={""} programType={this.props.programType} currProgramUUID={this.props.programData.program_structure_uuid} workout={exercise} programDuration={0} handleSuperSetOnPress={() => this.handleAddSuperSet(exercise)} />
                    </TouchableWithoutFeedback>

                )
            })

            if (currWorkoutDaysState.length == 0) {
                return (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly', width: '100%', height: '100%' }}>
                        <Image style={{ width: 110, height: 110 }} source={require('../../../../images/timetable_icon/timetable.png')} />

                        <Text style={{ paddingHorizontal: 10, fontFamily: 'Avenir-Black', fontSize: 18 }}>
<<<<<<< HEAD
                            Add your first exercise for this week.
=======
                            Add your first exercise to {this.getCurrentDay()} for this week.
>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736
                </Text>
                    </View>
                )
            } else {
                return (
                    <ScrollView contentContainerStyle={{ paddingVertical: 5, width: '100%', alignItems: 'flex-start' }}>
                        {content}
                    </ScrollView>
                )
            }
        } catch (error) {
            LOG_ERROR('BuildWorkoutController.js', 'Caught unhandled exception in getCurrentDayContent', error);
        }
    }

    /**
     * Opens the custom workout modal.
     */
    handleAddCustomWorkout = async () => {
        await this.addExerciseRBSheetRef.current.close();
        this.setState({ customWorkoutModalVisible: true, placementType: PLACEMENT_TYPES.EXERCISE,  })
       
    }

    /**
     * Opens a bottom sheet with options for the current pressed added workout.
     * @param {} workout 
     */
    handleOpenAddedWorkoutOptionsSheet = (workout) => {
        this.setState({ currPressedPopulatedWorkout: workout }, () => {
            this.addedWorkoutOptionsRef.current.open();
        })
    }

    /**
     * Handles adding an exercise as a superset.
     */
    handleAddSuperSet = (exercise) => {
        this.setState({ currPlacementType: PLACEMENT_TYPES.SUPERSET, currPressedPopulatedWorkout: exercise }, () => {
            console.log('handle add superset call back!')
            this.openRenderAddExerciseRBSheet()
        });
    }

    /**
     * Renders the workout options bottom sheet.
     */
    renderWorkoutOptionsSheet = () => {
        return (
            <RBSheet
                ref={this.addedWorkoutOptionsRef}
                height={300}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {},
                    container: {
                        borderRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: '#000000'
                    }
                }}
                dragFromTopOnly={true}
            >
                <View style={{ alignItems: 'flex-start', flex: 1, padding: 20, backgroundColor: '#FFFFFF' }}>
                    <TouchableWithoutFeedback onPress={this.handleAddSuperSet} style={{ marginVertical: 10, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FeatherIcon name="plus" size={20} style={{ paddingHorizontal: 10 }} />
                            <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 15 }}>
                                Add Superset
                    </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback style={{ marginVertical: 10 }} onPress={() => this.deleteWorkout()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FeatherIcon color="#e53935" name="trash" size={20} style={{ paddingHorizontal: 10 }} />
                            <Text style={{ color: '#e53935', fontFamily: 'Avenir-Medium', fontSize: 15 }}>
                                Remove Workout
                    </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <SafeAreaView />
                {this.renderNestedAddExerciseRBSheet()}
            </RBSheet>
        )
    }

<<<<<<< HEAD
=======
    /**
     * Renders the bottom sheet for week days.
     */
    renderDropdownPicker = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer === true && this.state.ready) {
            return (
                <RBSheet
                    ref={this.weekDayRBSheetRef}
                    height={300}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {},
                        container: {
                            borderRadius: 20
                        },
                        draggableIcon: {
                            backgroundColor: '#000000'
                        }
                    }}
                    dragFromTopOnly={true}
                >
                    <View style={{ flex: 1 }}>
                        <Picker
                            selectedValue={this.getCurrentDay()}
                            style={{ width: '100%' }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ currDayIndex: itemIndex })
                            }>
                            {
                                this.props.programData.program_workout_days.map(day => {
                                    return <Picker.Item label={day} value={day} />
                                })
                            }
                        </Picker>
                        <Button
                            color="#1089ff"
                            theme={{ roundness: 12 }}
                            style={{ elevation: 0, alignSelf: 'center', marginVertical: 10 }}
                            contentStyle={{ width: Dimensions.get('window').width - 20, height: 45 }}
                            mode="contained"
                            uppercase={false}
                            onPress={this.closeWeekDayPicker}
                        >
                            <Text style={{ fontFamily: 'Avenir' }}>
                                Done
                        </Text>
                        </Button>

                    </View>
                </RBSheet>
            )
        } else {
            //we don't need to do anything here because the currDayIndex is already 0
        }
    }

>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736
    handleOnPressAddExercise = () => {
        this.setState({ currPlacementType: PLACEMENT_TYPES.EXERCISE }, () => {

            this.openRenderAddExerciseRBSheet()
        })
    }

    renderTrainerButtons = () => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: Dimensions.get('window').width, backgroundColor: '#23374d', padding: 10, paddingVertical: Constants.statusBarHeight }}>

<<<<<<< HEAD
=======
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
                    <TouchableOpacity onPress={this.openWeekDayPicker}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'rgb(247, 247, 247)', borderColor: 'rgb(231, 231, 236)', borderWidth: 0.5, padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                            <FeatherIcon name="chevron-down" />
                            <Text style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
                                {this.getCurrentDay()}
                            </Text>
                        </View>
                    </TouchableOpacity>
>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736

                    <TouchableOpacity onPress={this.openWeekPicker}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'rgb(247, 247, 247)', borderColor: 'rgb(231, 231, 236)', borderWidth: 0.5, padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                            <FeatherIcon name="chevron-down" />
                            <Text style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
                                Week {this.getCurrentWeek() + 1}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.handleOnPressAddExercise}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'rgb(247, 247, 247)', borderColor: 'rgb(231, 231, 236)', borderWidth: 0.5, padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
                                Add Exercise
                    </Text>
                        </View>
                    </TouchableOpacity>
                </View>
        )
    }

    /**
     * Returns the current week index.
     */
    getCurrentWeek = () => {
        return this.state.currWeekIndex
    }

    /**
     * Renders the day of the week bottom sheet.
     */
    renderDayOfTheWeekDropdownPicker = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer === true && this.state.ready) {
            return (
                <RBSheet
                    ref={this.dayOfTheWeekRBSheetRef}
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
                    <View style={{ flex: 1 }}>
                        <Picker
                            selectedValue={this.getCurrentWeek()}
                            style={{ width: '100%' }}
                            onValueChange={(itemValue, itemIndex) => this.setState({ currWeekIndex: itemIndex })}>
                            {
                                this.state.weeks.map((week, index, arr) => {
                                    return <Picker.Item label={(week + 1).toString()} value={index} />
                                })
                            }
                        </Picker>
                        <View style={{ width: '100%' }}>
                            <Button
                                color="#1089ff"
                                theme={{ roundness: 12 }}
                                style={{ elevation: 0, alignSelf: 'center', marginVertical: 10 }}
                                contentStyle={{ width: Dimensions.get('window').width - 20, height: 45 }}
                                mode="contained"
                                uppercase={false}
                                onPress={this.closeWeekPicker}

                            >
                                <Text>
                                    Done
                        </Text>
                            </Button>
                        </View>
                    </View>
                    <SafeAreaView />
                </RBSheet>

            )
        } else {
            return null;
        }
        return null;
    }

    checkShowSelectedStyle = (exerciseObject) => {
        const currWeek = this.getCurrentWeek();

<<<<<<< HEAD
        for (let i = 0; i < this.state.workoutDays[currWeek].length; i++) {
            if (this.state.workoutDays[currWeek][i].workout_name == exerciseObject.workout_name) {
=======
        for (let i = 0; i < this.state.workoutDays[currWeek][workoutDay].length; i++) {
            if (this.state.workoutDays[currWeek][workoutDay][i].workout_name == exerciseObject.workout_name) {
>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736
                exerciseObject.showSelectStyle = true;
            }
        }
    }

    openRenderAddExerciseRBSheet = () => this.addExerciseRBSheetRef.current.open();

    closeRenderAddExerciseRBSheet = () => this.addExerciseRBSheetRef.current.close();


    openRenderNestedAddExerciseRBSheet = () => this.addExerciseNestedRBSheetRef.current.open();

    closeRenderNestedAddExerciseRBSheet = () => this.addExerciseRBSheetRef.current.close();

    handleFolderIsOpen = (folderString) => {
            this.setState({ folderIsSelected: true, folderSelected: folderString }, () => {
                this.openRenderAddExerciseRBSheet();
            })
    }

    handlerLeaveFolder = () => {
        this.setState({ folderSelected: '', folderIsSelected: false }, () => {
            this.openRenderAddExerciseRBSheet()
        })
    }

    renderFolderContent = () => {
        switch (this.state.folderSelected) {
            case 'Bodyweight':
                return (
                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.lupa_data.Application_Workouts.applicationWorkouts.bodyweight.map((item, index, value) => {
                                    if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                        return;
                                    }
                                    this.checkShowSelectedStyle(item)
                                    return (
                                        <SingleWorkout
                                            onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                            key={item.workout_name}
                                            showSelectStyle={item.showSelectStyle}
                                            workout={item}
                                        />
                                    )
                                })
                            }
                        </ScrollView>

                    </View>
                )
            case 'Dumbbell':
                return (
                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.lupa_data.Application_Workouts.applicationWorkouts.dumbell.map((item, index, value) => {
                                    if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                        return;
                                    }
                                    this.checkShowSelectedStyle(item)
                                    return (
                                        <SingleWorkout
                                            onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                            key={item.workout_name}
                                            showSelectStyle={item.showSelectStyle}
                                            workout={item}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
            case 'Plyometric':
                return (
                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.lupa_data.Application_Workouts.applicationWorkouts.plyometric.map((item, index, value) => {
                                    if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                        return;
                                    }
                                    this.checkShowSelectedStyle(item)
                                    return (
                                        <SingleWorkout
                                            onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                            key={item.workout_name}
                                            showSelectStyle={item.showSelectStyle}
                                            workout={item}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
            case 'Kettlebell':
                return (
                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.lupa_data.Application_Workouts.applicationWorkouts.plyometric.map((item, index, value) => {
                                    if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                        return;
                                    }
                                    this.checkShowSelectedStyle(item)
                                    return (
                                        <SingleWorkout
                                            onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                            key={item.workout_name}
                                            showSelectStyle={item.showSelectStyle}
                                            workout={item}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
            case 'Medicine Ball':
                return (
                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.lupa_data.Application_Workouts.applicationWorkouts.medicine_ball.map((item, index, value) => {
                                    if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                        return;
                                    }
                                    this.checkShowSelectedStyle(item)
                                    return (
                                        <SingleWorkout
                                            onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                            key={item.workout_name}
                                            showSelectStyle={item.showSelectStyle}
                                            workout={item}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
            case 'Barbell':
                return (
                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.lupa_data.Application_Workouts.applicationWorkouts.barbell.map((item, index, value) => {
                                    if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                        return;
                                    }
                                    this.checkShowSelectedStyle(item)
                                    return (
                                        <SingleWorkout
                                            onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                            key={item.workout_name}
                                            showSelectStyle={item.showSelectStyle}
                                            workout={item}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
            case 'Machine Assisted':
                return (
                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView showsHorizontalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.lupa_data.Application_Workouts.applicationWorkouts.machine_assisted.map((item, index, value) => {
                                    if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                        return;
                                    }
                                    this.checkShowSelectedStyle(item)
                                    return (
                                        <SingleWorkout
                                            onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                            key={item.workout_name}
                                            showSelectStyle={item.showSelectStyle}
                                            workout={item}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                )
        }
    }

    handleOnPickCustomExercise = async () => {
        if (this.addExerciseRBSheetRef.current) {
            await this.addExerciseRBSheetRef.current.close();
        }
        this.setState({ customWorkoutModalVisible: true, currPlacementType: PLACEMENT_TYPES.EXERCISE })
    }

    renderAddExerciseContent = () => {
        if (this.state.folderIsSelected === false) {
            return (
                <ScrollView horizontal>
                    <TouchableOpacity onPress={this.handleOnPickCustomExercise} style={{ margin: 20, alignItems: 'center' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ width: 90, height: 80, alignItems: 'center', justifyContent: 'center' }}>
                                <Feather1s size={60} name="plus-circle" />
                            </View>

                            <Text style={{ fontFamily: 'Avenir-Heavy', marginVertical: 10 }}>
                                Custom
                        </Text>
                        </View>
                    </TouchableOpacity>

                    {

                        CATEGORIES.map(categoryString => {
                            return (<TouchableOpacity onPress={() => this.handleFolderIsOpen(categoryString)} style={{ margin: 20, alignItems: 'center' }}>
                                <Image source={require('../../../../images/buildworkout/ExerciseFolder.png')} style={{ width: 90, height: 80 }} />
                                <Text style={{ fontFamily: 'Avenir-Heavy', marginVertical: 10 }}>
                                    {categoryString}
                                </Text>
                            </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            )
        } else {
            return (
                <View style={{ flex: 1, width: Dimensions.get('window').width }}>
                    <Button
                        icon={() => <FeatherIcon name="arrow-left" color="white" />}
                        color="#1089ff"
                        onPress={this.handlerLeaveFolder}
                        mode="contained"
                        theme={{ roundness: 12 }}
                        contentStyle={{ height: 40, width: Dimensions.get('window').width - 50 }}
                        style={{ elevation: 0, marginVertical: 10, alignSelf: 'center' }}
                        uppercase={false}
                    >
                        <Text style={{ fontFamily: 'Avenir' }}>
                            Categories
                        </Text>
                    </Button>
                    {this.renderFolderContent()}
                </View>
            )
        }
    }

    handleOnCloseAddExerciseRBSheet = () => {

        this.setState({ folderIsSelected: false, folderSelected: '' })

    }

    renderAddExerciseRBSheet = () => {
        return (
            <RBSheet
                ref={this.addExerciseRBSheetRef}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                onClose={this.handleOnCloseAddExerciseRBSheet}
                height={this.state.folderIsSelected === true ? 550 : 180}
                customStyles={{
                    wrapper: {
                        flex: 1,
                    },
                    container: {
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                    },
                    draggableIcon: {
                        backgroundColor: this.state.folderIsSelected == true ? 'white' : 'grey',
                    }
                }}
            >
                <ScrollView horizontal>
                    {
                        this.renderAddExerciseContent()
                    }
                </ScrollView>
                {/* DO NOT REMOVE!! Causing state to reset workout days for some reason?? */}
                <CreateCustomExercise captureExercise={(customExercise, placementType) => this.captureWorkout(customExercise, placementType)} workoutDay={weekDays[this.state.currDayIndex]} isVisible={this.state.customWorkoutModalVisible} closeModal={() => this.setState({ customWorkoutModalVisible: false })} programUUID={this.props.programUUID} />
            </RBSheet>
        )
    }

    renderNestedAddExerciseRBSheet = () => {
        return (
            <RBSheet
                ref={this.addExerciseNestedRBSheetRef}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                onClose={this.handleOnCloseAddExerciseRBSheet}
                height={this.state.folderIsSelected === true ? 550 : 160}
                customStyles={{
                    wrapper: {
                        flex: 1,
                    },
                    container: {
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                    },
                    draggableIcon: {
                        backgroundColor: 'grey',
                    }
                }}
            >
                {
                    this.renderAddExerciseContent()
                }
            </RBSheet>
        )
    }

    renderAppropriateNextButton = () => {
        const { isEditing } = this.props;

        if (isEditing == true) {
            return (
                <Button color="white" uppercase={false} onPress={() => this.handleSaveProgramData(this.state.workoutDays)}>
                    Save
                </Button>
            )
        } else {
            return (
                <Button color="white" uppercase={false} onPress={() => this.handleSaveProgramData(this.state.workoutDays)}>
                    Next
                </Button>
            )
        }
    }

    /**
     * Renders the component display basd on currView
     */
    renderComponentDisplay = () => {
        if (!this.state.ready) {
            return null;
        }

        return (
            <View style={styles.container}>
                <Appbar.Header style={{ elevation: 0, alignItems: 'center', backgroundColor: '#23374d', }}>
                    <Button color="white" uppercase={false} onPress={() => this.props.goToIndex(0)}>
                        Back
                            </Button>
                    <Appbar.Content title="Add Exercises" titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25 }} />
                    {this.renderAppropriateNextButton()}
                </Appbar.Header>
                <View style={styles.content}>
                    {this.getCurrentDayContent()}
                </View>
                <View style={{ position: 'absolute', bottom: 0 }} /* style={styles.toolbar} */>
                    {this.renderTrainerButtons()}
                </View>
<<<<<<< HEAD
=======
                {this.renderDropdownPicker()}
>>>>>>> 291f2abb462f2b768703f29f40ba61ad0f3e9736
                {this.renderDayOfTheWeekDropdownPicker()}
                {this.renderAddExerciseRBSheet()}
                {this.renderWorkoutOptionsSheet()}
                <Snackbar
                    visible={this.state.snackBarVisible}
                    onDismiss={() => this.setState({ snackBarVisible: false })}
                    action={{
                        label: 'Okay',
                        onPress: () => {
                            this.setState({ snackBarVisible: false })
                        },
                    }}>
                    {this.state.snackBarReason}
                </Snackbar>
               
            </View>
        );
    }

    /**
     * Opens the week day picker
     */
    openWeekDayPicker = () => this.weekDayRBSheetRef.current.open();

    /**
     * Closes the week day picker
     */
    closeWeekDayPicker = () => this.weekDayRBSheetRef.current.close();

    /**
     * Opens the week picker
     */
    openWeekPicker = () => this.dayOfTheWeekRBSheetRef.current.open();

    /**
     * Closes the week picker
     */
    closeWeekPicker = () => this.dayOfTheWeekRBSheetRef.current.close();

    /**
     * Renders the component.
     */
    render() {
        return (
            <>
                { this.renderComponentDisplay()}
                 <CreateCustomExercise captureExercise={(customExercise, placementType) => this.captureWorkout(customExercise, placementType)} workoutDay={weekDays[this.state.currDayIndex]} isVisible={this.state.customWorkoutModalVisible} closeModal={() => this.setState({ customWorkoutModalVisible: false })} programUUID={this.props.programUUID} />
            </>
        )
    }
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#1089ff',
        elevation: 0,
        flexDirection: 'column',
    },
    container: {
        flex: 1,

    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mainContent: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEEEEE'
    },
    alignAndJustifyCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    exerciseOptionHeaderText: {
        fontSize: 15,
        fontFamily: 'Avenir-Medium',
        color: '#23374d',
    },
    exerciseOptionIcon: {
        marginHorizontal: 10,
        color: '#23374d',
    },
    sectionHeader: {
        fontFamily: 'Avenir-Heavy',
        backgroundColor: '#FFFFFF',
        fontSize: 15,
        padding: 10
    },
    pressedWorkoutStyle: {
        borderColor: '#1089ff',
        borderWidth: 0.5,
        padding: 10,
        flex: 1,
    }, //---- verified
    populatedExerciseTouchableContainer: {
        height: 100,
        marginTop: 5,
        marginBottom: 10
    },
    populatedExerciseText: {
        paddingVertical: 5,
        alignSelf: 'center',
        fontSize: 10,
        width: '100%'
    },
    flexOne: {
        flex: 1,
    },
    whiteText: {
        color: 'white'
    },
    populatedSupersetExercise: {
        width: 100,
        height: 100,
        marginHorizontal: 10
    },
    specializedAppbar: {
        height: 'auto',
        paddingVertical: 10
    },
    appbarActions: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    addExerciseText: {
        color: 'white',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontFamily: 'Avenir-Heavy',
        fontSize: 20
    },
    containerPadding: {
        padding: 10,
    },
    buildOptionsSafeAreaView: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    buildOptionsButton: {
        elevation: 8,
        marginVertical: 10
    },
    midSectionDivider: {
        height: '100%',
        width: 1.5,
        backgroundColor: '#EEEEEE'
    }
})

export default connect(mapStateToProps)(BuildWorkoutController);