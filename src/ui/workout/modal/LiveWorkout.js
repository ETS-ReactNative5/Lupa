import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    Image,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Divider,
    Button,
    Menu,
    Paragraph,
    Caption,
    Surface,
    TextInput,
    Portal,
    Title,
    Avatar,
    Appbar,
    Dialog,
} from 'react-native-paper';

import { Picker } from '@react-native-community/picker';

import ShareProgramModal from '../program/modal/ShareProgramModal'

import { ListItem, Input } from 'react-native-elements'
import { Video } from 'expo-av'
import FeatherIcon from "react-native-vector-icons/Feather"
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import LUPA_DB, { Fire, LUPA_DB_FIREBASE } from '../../../controller/firebase/firebase';
import LupaController from '../../../controller/lupa/LupaController';
import ThinFeatherIcon from "react-native-feather1s";
import { Constants } from 'react-native-unimodules';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import RBSheet from "react-native-raw-bottom-sheet";
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import CircularUserCard from '../../user/component/CircularUserCard';
import RestTimer from './RestTimer';
import { useNavigation } from '@react-navigation/native';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import moment from 'moment'
import { getLupaExerciseStructure } from '../../../model/data_structures/workout/exercise_collections';
import LiveWorkoutService, { LIVE_SESSION_REF } from '../../../common/service/LiveWorkoutService';
import StepIndicator from 'react-native-step-indicator';
import { InputAccessoryView } from 'react-native';
import { getDayOfTheWeekStringFromDate } from '../../../common/service/DateTimeService';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const restTimesArr = [
    '10',
    '30',
    '90',
    '120'
]

function WorkoutFinishedModal({ isVisible, closeModal }) {
    const navigation = useNavigation();

    return (
        <Modal visible={isVisible} animated={true} animationType="fade">
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <View style={{ flex: 2, justifyContent: 'space-evenly', backgroundColor: '#1089ff' }}>
                    <View style={{ padding: 20, }}>
                        <Title style={{ color: 'white', fontWeight: '800' }}>
                            Congratulations
                </Title>
                        <Paragraph style={{ color: 'white', fontWeight: '600' }}>
                            It looks like you've completed a workout for today.
                </Paragraph>
                    </View>

                    <Button onPress={() => navigation.navigate('LupaHome')} color="white" mode="outlined" style={{ width: Dimensions.get('window').width - 20, alignSelf: 'center', borderColor: 'white' }}>
                        Exit Workout and Go Home
          </Button>


                </View>

            </View>


            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'space-evenly' }}>

                <View style={{ width: Dimensions.get('window').width - 50, alignSelf: 'center', borderRadius: 20, backgroundColor: 'rgb(245, 246, 247)', padding: 20, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800' }}>
                            Your statistics have been updated in your dashboard!
                          </Text>

                    </View>

                    <Button onPress={() => navigation.navigate('Dashboard')} color="#1089ff" theme={{ roundness: 5 }} mode="contained" style={{ alignSelf: 'center', height: 45, alignItems: 'center', justifyContent: 'center', width: '90%' }}>
                        View Statistics
                      </Button>
                </View>

            </View>


            <SafeAreaView />
        </Modal>
    )
}

function NoExercisesDialogVisible({ isVisible }) {
    const navigation = useNavigation();

    return (
        <Dialog visible={isVisible}>
            <Dialog.Title>
                You don't have any exercises scheduled for today.
            </Dialog.Title>
            <Dialog.Content>
                <Paragraph>
                    Check back tomorrow to see if there are any exercises scheduled for you.
                </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button color="#23374d" onPress={() => navigation.pop()}>
                    Okay
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

class LiveWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.interactionsRBSheet = React.createRef();
        this.interactionRBSheet = React.createRef();
        this.shareProgramRBSheet = React.createRef()
        this.interactionInput = React.createRef();
        this.restTimesRBSheet = React.createRef();

        this.state = {
            workoutStructure: ['Workout Name', 'Workout Name', 'Workout Name'],
            currentWorkout: getLupaExerciseStructure(),
            currentWorkoutOriginalReps: 0,
            currentWorkoutStructure: [],
            currentWeek: 0,
            workoutDays: [],
            currentWorkoutDay: "",
            currentDayIndex: 0,
            currentWorkoutIndex: 0,
            playVideo: false,
            contentShowing: false,
            ready: false,
            programData: getLupaProgramInformationStructure(),
            programOwnerData: getLupaUserStructure(),
            dayMenuVisible: false,
            currentDisplayedMediaURI: "",
            contentTypeDisplayed: "",
            componentDidErr: false,
            liveWorkoutOptionsVisible: false,
            showFinishedDayDialog: false,
            restTimerStarted: false,
            restTimerVisible: false,
            descriptionDialogVisible: false,
            restTime: 3,
            previousWorkout: getLupaExerciseStructure("", "", "", ""),
            nextWorkout: getLupaExerciseStructure("", "", "", ""),
            participants: [],
            timelineData: [],
            labelData: [],
            hasWorkouts: true,
            noWorkoutsDialogVisible: false,
            completed_exercise_weight_used: 0,
            completed_exercise_one_rep_max: 0,
            isEditingOneRepMax: false,
            isEditingWeightUsed: false,
        }
    }

    async componentDidMount() {

        const { sessionID } = this.props.route.params;
        await this.setupLiveWorkout();
        this.workoutService = new LiveWorkoutService(sessionID, this.state.programOwnerData, [], this.state.programData);
        await this.workoutService.initLiveWorkoutSession();
        const sessionIDNumber = await this.workoutService.getCurrentSessionIDNumber()
        const refString = LIVE_SESSION_REF.toString() + sessionIDNumber.toString();
        await LUPA_DB_FIREBASE.ref(refString.toString()).on('value', (snapshot) => {
            const data = snapshot.val();

            var newState = Object.assign({}, data);
            this.setState({ ...newState }, () => {
                if (this.state.hasWorkouts == false) {
                    this.setState({ noWorkoutsDialogVisible: true })
                }
            })
        })

        await LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).onSnapshot(documentSnapshot => {
            const data = documentSnapshot.data();
            const completedExercises = data.completed_exercises;

            for (let i = 0; i < completedExercises.length; i++) {
                if (completedExercises[i].index == this.state.currentWorkout.index) {
                    if (completedExercises[i].one_rep_max == 0) {
                        this.setState({ isEditingOneRepMax: true })
                    } else {
                        this.setState({ isEditingOneRepMax: false })
                    }

                    if (completedExercises[i].exercise_weight == 0) {
                        this.setState({ isEditingWeightUsed: true })
                    } else {
                        this.setState({ isEditingWeightUsed: false })
                    }
                    
                    this.setState({ completed_exercise_weight_used: completedExercises[i].exercise_weight, completed_exercise_one_rep_max: completedExercises[i].one_rep_max })
                }
            }
        })

        this.workoutService.addParticipant(this.props.lupa_data.Users.currUserData);

        await this.setState({ ready: true });
    }


    componentWillUnmount() {
        //  Fire.shared.off();
    }

    setupLiveWorkout = async () => {
        if (this.props.route.params.programData) {
            await this.setState({ programData: this.props.route.params.programData });

            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.props.route.params.programData.program_owner).then(data => {
                this.setState({ programOwnerData: data })
            });
        } else if (this.props.route.params.uuid) {
            try {
                let programData = getLupaProgramInformationStructure();
                switch (this.props.route.params.workoutType) {
                    case 'PROGRAM':
                        await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.props.route.params.uuid).then(data => {
                            programData = data;
                            this.setState({ programData: data })
                        })

                        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(programData.program_owner).then(data => {
                            this.setState({ programOwnerData: data })
                        });
                        break;
                    case 'WORKOUT':
                        await this.LUPA_CONTROLLER_INSTANCE.getWorkoutInformationFromUUID(this.props.route.params.uuid).then(data => {
                            programData = data;
                            this.setState({ programData: data })
                        })

                        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(programData.program_owner).then(data => {
                            this.setState({ programOwnerData: data })
                        });
                        break;
                    default:
                        this.setState({ ready: false, componentDidErr: true })
                }

            } catch (err) {
                await this.setState({ ready: false, componentDidErr: true })
            }
        }
    }

    showLiveWorkoutOptionsModal = () => {
        this.setState({ liveWorkoutOptionsVisible: true })
    }

    closeLiveWorkoutOptionsModal = () => {
        this.setState({ liveWorkoutOptionsVisible: false })
    }

    showWarningDialog = () => {
        this.setState({ warningDialogShowing: true })
    }

    hideWarningDialog = () => {
        this.setState({ warningDialogShowing: false })
    }

    handleCloseWarningDialog = () => {
        this.hideWarningDialog();
        this.props.navigation.pop();
    }

    renderParticipants = () => {
        return this.state.participants.map(user => {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar.Image style={{ marginHorizontal: 10 }} size={25} source={{ uri: user.photo_url }} />
                    <Text>
                        {user.display_name}
                    </Text>
                </View>
            )
        })
    }

    renderFinishWorkoutWarningDialog = () => {
        return (
            <Portal>
                <Dialog visible={this.state.warningDialogShowing} style={{ padding: 20, backgroundColor: 'white', width: '80%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FeatherIcon size={18} style={{ paddingHorizontal: 10 }} name="alert-triangle" />

                        <Title>
                            Warning
            </Title>

                    </View>

                    <Paragraph>
                        You are about to leave your workout before completing it.  Your workout data and progress will not be saved.
            </Paragraph>
                    <Dialog.Actions>
                        <Button color="#1089ff" onPress={this.hideWarningDialog}>
                            Resume
                </Button>
                        <Button color="#e53935" onPress={this.handleCloseWarningDialog}>
                            Exit
                </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>


        )
    }

    renderExercisePreviewContainer = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, justifyContent: 'space-evenly' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Surface style={{ borderRadius: 12, width: 50, height: 50 }}>
                        {this.renderImageSource(this.state.previousWorkout)}
                    </Surface>
                    <Caption style={{ paddingTop: 5 }}>
                        {this.renderPreviousExerciseName(this.state.previousWorkout)}
                    </Caption>
                    <Caption>
                        Current Workout
            </Caption>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Surface style={{ borderRadius: 12, width: 50, height: 50 }}>
                        {this.renderImageSource(this.state.currentWorkout)}
                    </Surface>
                    <Caption style={{ paddingTop: 5 }}>
                        {this.renderPreviousExerciseName(this.state.currentWorkout)}
                    </Caption>
                    <Caption>
                        Current Workout
            </Caption>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Surface style={{ borderRadius: 12, width: 50, height: 50 }}>
                        {this.renderImageSource(this.state.nextWorkout)}
                    </Surface>
                    <Caption style={{ paddingTop: 5 }}>
                        {this.renderNextExerciseName(this.state.nextWorkout)}
                    </Caption>
                    <Caption>
                        Current Workout
            </Caption>
                </View>
            </View>
        )
    }

    renderContent = () => {
        if (!this.state.ready) {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                </View>
            )
        }

        if (this.state.currentWorkout.workout_media.media_type == null || typeof (this.state.currentWorkout.workout_media.media_type) == 'undefined') {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                </View>
            )
        }

        const workoutMediaType = this.state.currentWorkout.workout_media.media_type
        switch (workoutMediaType) {
            case 'IMAGE':
                return this.getWorkoutImageMedia(this.state.currentWorkout.workout_media.uri);
            case 'VIDEO':
                return this.getWorkoutVideoMedia(this.state.currentWorkout.workout_media.uri);
            default:
                return (
                    //In this case render information about the workout
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                    </View>
                )
        }
    }

    getWorkoutImageMedia = (uri) => {
        try {
            return (
                <Image
                    source={{ uri: uri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMethod="scale"
                    resizeMode="cover" />
            )
        } catch (error) {

            return (
                <View style={styles.errorImageContainer}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }
    }

    getWorkoutVideoMedia = (uri) => {
        try {
            return (
                <>
                    <Video
                        source={{ uri: uri }}
                        rate={1.0}
                        volume={0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay={this.state.playVideo}
                        isLooping={true}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {renderVideoIcon()}
                    </Video>



                </>
            )
        } catch (err) {
            return (

                <View style={{ flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }

    }

    renderVideoIcon = () => {
        return this.state.playVideo == true ?
            <ThinFeatherIcon
                thin={true}
                name="pause-circle"
                size={30}
                color="#FFFFFF"
                onPress={() => this.setState({ playVideo: false })}
                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }} />
            :
            <ThinFeatherIcon
                thin={true}
                name="play-circle"
                size={30}
                color="#FFFFFF"
                onPress={() => this.setState({ playVideo: true })}
                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }}
            />
    }

    handleShowInteractionRBSheet = async () => {
        this.setState({ liveWorkoutOptionsVisible: false })
        if (this.state.playVideo === true) {
            this.setState({ playVideo: false })
        }

        this.interactionRBSheet.current.open()
    }

    handleShareProgram = async () => {
        this.setState({ liveWorkoutOptionsVisible: false })
        if (this.state.playVideo === true) {
            this.setState({ playVideo: false })
        }

        this.props.navigation.push('ShareProgramModal', {
            programData: this.state.programData
        })
    }

    handleCloseLiveWorkout = () => {
        this.closeLiveWorkoutOptionsModal()
        this.props.navigation.pop()
    }

    openRestTimesRBSheet = () => {
        this.restTimesRBSheet.current.open();
    }

    closeRestTimesRBSheet = () => {
        this.restTimesRBSheet.current.close();
    }

    advanceExercise = () => {
        this.workoutService.advanceWorkout();
    }

    renderWorkoutReps = () => {
        if (typeof (this.state.currentWorkout.workout_name) == 'undefined' || this.state.currentWorkout.workout_name == '') {
            return "-"
        }

        return this.state.currentWorkout.workout_reps
    }

    renderWorkoutSets = () => {
        if (typeof (this.state.currentWorkout.workout_name) == 'undefined' || this.state.currentWorkout.workout_name == '') {
            return "-"
        }

        return this.state.currentWorkout.workout_sets
    }

    renderWorkoutTempo = () => {
        return this.state.currentWorkout.workout_tempo
    }

    renderWorkoutRestTime = () => {
        return this.state.currentWorkout.workout_rest_time
    }


    showDialog = () => this.setState({ showFinishedDayDialog: true })

    hideDialog = () => this.setState({ showFinishedDayDialog: false })

    renderPreviousExerciseName = (exercise) => {
        try {
            return exercise.workout_name;
        } catch (error) {
            return ''
        }
    }

    renderCurrentExerciseName = (exercise) => {
        try {
            return exercise.workout_name;
        } catch (error) {
            return ''
        }
    }

    renderNextExerciseName = (exercise) => {
        try {
            return exercise.workout_name;
        } catch (error) {
            return ''
        }
    }

    renderImageSource = (workout) => {
        try {

            switch (workout.default_media_uri) {
                case '':
                    return <Image source={''} />
                case 'Traps':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Traps.png')} />
                case 'Chest':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Chest.png')} />
                case 'Bicep':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Bicep.png')} />
                case 'Calves':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Calves.png')} />
                case 'Core':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Core.png')} />
                case 'Glutes':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Glutes.png')} />
                case 'Supr':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Supr.png')} />
                case 'Triceps':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Triceps.png')} />
                case 'Hip':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Hip.png')} />
                default:
                    return <Image source={''} />
            }
        } catch (error) {
            return <Image source={''} />
        }
    }

    renderStepIndicator = () => {
        try {

            if (this.state.hasWorkouts == false) {
                return;
            }

            if (this.state.ready == true && this.state.hasWorkouts == true) {
                return (
                    <StepIndicator
                        labels={this.state.labelData}
                        currentPosition={this.state.currentWorkoutIndex}
                        steps={this.state.timelineData}
                        stepCount={this.state.timelineData.length}
                        customStyles={{
                            stepIndicatorSize: 25,
                            currentStepIndicatorSize: 30,
                            separatorStrokeWidth: 2,
                            currentStepStrokeWidth: 3,
                            stepStrokeCurrentColor: '#1089ff', //outline
                            stepStrokeWidth: 3,
                            stepStrokeFinishedColor: '#1089ff',
                            stepStrokeUnFinishedColor: '#1089ff', //unfinished outline
                            separatorFinishedColor: '#1089ff',
                            separatorUnFinishedColor: '#1089ff',
                            stepIndicatorFinishedColor: '#1089ff',
                            stepIndicatorUnFinishedColor: '#1089ff',
                            stepIndicatorCurrentColor: '#ffffff',
                            stepIndicatorLabelFontSize: 13,
                            currentStepIndicatorLabelFontSize: 13,
                            stepIndicatorLabelCurrentColor: '#1089ff',
                            stepIndicatorLabelFinishedColor: '#ffffff',
                            stepIndicatorLabelUnFinishedColor: '#FFFFFF',
                            labelColor: '#1089ff',
                            labelSize: 10,
                            currentStepLabelColor: '#1089ff'
                        }}
                    />
                )
            }
        } catch (error) {
            return null;
        }
    }

    renderOneRepMax = () => {
        try {
            if (this.state.completed_exercise_one_rep_max == '' || typeof (this.state.completed_exercise_one_rep_max) == 'undefined') {
                // this.setState({ isEditingOneRepMax: true })
                return '0'
            }

            return this.state.completed_exercise_one_rep_max.toString();
        } catch (error) {
            return '-'
        }
    }

    renderWeightUsed = () => {
        try {
            if (this.state.completed_exercise_weight_used == '' || typeof (this.state.completed_exercise_weight_used) == 'undefined') {
                // this.setState({ isEditingWeightUsed: true })
                return '0'
            }

            return this.state.completed_exercise_weight_used.toString();
        } catch (error) {
            return '-'
        }
    }

    updateWeightUsed = () => {
        const weightUsed = this.state.completed_exercise_weight_used;

        let completedExercises = []
        LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).get().then(documentSnapshot => {
            completedExercises = documentSnapshot.data().completed_exercises;

            for (let i = 0; i < completedExercises.length; i++) {
                if (completedExercises[i].index == this.state.currentWorkout.index) {
                    this.setState({ completed_exercise_weight_used: weightUsed })
                    completedExercises[i].exercise_weight = weightUsed
                }
            }

            LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).update({
                completed_exercises: completedExercises
            })
        }, (error) => {

        })

        this.setState({ isEditingWeightUsed: false })
    }

    updateOneRepMax = () => {
        const repMax = this.state.completed_exercise_one_rep_max;

        let completedExercises = []
        LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).get().then(documentSnapshot => {
            completedExercises = documentSnapshot.data().completed_exercises;

            for (let i = 0; i < completedExercises.length; i++) {
                if (completedExercises[i].index == this.state.currentWorkout.index) {
                    this.setState({ completed_exercise_one_rep_max: repMax })
                    completedExercises[i].one_rep_max = repMax
                }
            }

            LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).update({
                completed_exercises: completedExercises
            })
        }, (error) => {

        })

        this.setState({ isEditingOneRepMax: false })
    }

    renderWeightUsedDisplay = () => {
        if (this.state.isEditingWeightUsed == false) {
            return (
                <View style={{ width: 160, height: 30, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                        {this.renderWeightUsed()}
                    </Text>
                </View>
            )
        } else {
            return (
                <View style={{alignSelf: 'center'}}>
                    <View style={{alignSelf: 'center', height: 30, width: 160, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: '#1089ff', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Input
                            onChangeText={text => this.setState({ completed_exercise_weight_used: text })}
                            value={this.renderWeightUsed()}
                            onEndEditing={this.updateWeightUsed}
                            onSubmitEditing={this.updateWeightUsed}
                            clearTextOnFocus={true}
                            containerStyle={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            inputContainerStyle={{ width: '100%', height: '100%', borderBottomWidth: 0, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
                            inputStyle={{ alignSelf: 'center' }}
                            returnKeyLabel="submit"
                            returnKeyType="done"
                            keyboardType="numeric"
                        />
                    </View>
                    <Caption style={{ padding: 5 }}>
                        What was the weight used for this exercise?
            </Caption>

                </View>
            )
        }
    }

    renderOneRepMaxDisplay = () => {
        if (this.state.isEditingOneRepMax == false) {
            return (
                <View style={{ width: 160, height: 30, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                        {this.renderOneRepMax()}
                    </Text>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{ height: 30, width: 160, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: '#1089ff', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Input
                            onChangeText={text => this.setState({ completed_exercise_one_rep_max: text })}
                            value={this.renderOneRepMax()}
                            onEndEditing={this.updateOneRepMax}
                            onSubmitEditing={() => this.setState({ isEditingOneRepMax: false })}
                            clearTextOnFocus={true}
                            containerStyle={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            inputContainerStyle={{ width: '100%', height: '100%', borderBottomWidth: 0, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
                            inputStyle={{ alignSelf: 'center' }}
                            returnKeyLabel="submit"
                            returnKeyType="done"
                            keyboardType="numeric"
                        />
                    </View>
                    <Caption style={{ paddingVertical: 5 }}>
                        What was your one rep max?
            </Caption>
                </View>
            )
        }
    }

    renderComponentDisplay = () => {
        if (this.state.ready === true && this.state.componentDidErr === false && typeof (this.state.programData) != 'undefined') {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <View style={{ flexDirection: 'row', flex: 2.5, alignItems: 'center', justifyContent: 'space-evenly' }}>

                        <View style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Caption style={{ fontSize: 20 }}>
                                {this.renderCurrentExerciseName(this.state.currentWorkout)}
                            </Caption>

                            <View style={{alignSelf: 'center'}}>
                                <Caption>
                                    One Rep Max
                            </Caption>
                                {this.renderOneRepMaxDisplay()}
                            </View>


                            <View style={{alignSelf: 'center'}}>
                                <Caption style={{paddingHorizontal: 10}}>
                                    Weight used
                            </Caption>
                                {this.renderWeightUsedDisplay()}
                            </View>


                        </View>

                        <View style={{ elevation: 0, backgroundColor: '#FFFFFF', flex: 1 }}>
                            {this.renderImageSource(this.state.currentWorkout)}
                        </View>
                    </View>

                    <Divider style={{ width: '100%' }} />
                    <View style={{ flex: 2.5, flexDirection: 'row', }}>



                        <View style={{ flex: 1, justifyContent: 'space-between' }}>


                            <View style={{ alignItems: 'flex-start', justifyContent: 'space-evenly', paddingHorizontal: 20 }}>
                                <Caption>
                                    Sets
                                </Caption>
                                <View style={{ width: 160, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                                        {this.renderWorkoutSets()}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                <Caption>
                                    Reps
                                </Caption>
                                <View style={{ width: 160, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                                        {this.renderWorkoutReps()}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                <Caption>
                                    Tempo
                                </Caption>
                                <View style={{ width: 160, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 50, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ flexWrap: 'nowrap', fontFamily: 'Avenir-Light' }}>
                                        {this.renderWorkoutTempo()}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                <Caption>
                                    Rest Time
                                </Caption>
                                <View style={{ width: 160, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 50, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                                        {this.state.restTime}
                                    </Text>
                                </View>
                            </View>

                        </View>


                        <View style={{ flex: 1 }}>
                            <Text style={{ alignSelf: 'center', fontSize: 18, padding: 10, fontFamily: 'Avenir-Heavy' }}>
                                Participants
</Text>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
                                {this.renderParticipants()}
                            </View>

                            <View style={{ flex: 0.3, backgroundColor: '#1089ff', justifyContent: 'flex-end', width: '80%', alignSelf: 'center', borderRadius: 3 }}>
                                <TouchableOpacity disabled={this.state.hasWorkouts == false} style={{ flex: 1, backgroundColor: this.state.hasWorkouts == true ? '#1089ff' : '#E5E5E5', borderRadius: 3, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.advanceExercise()}>
                                    <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#FFFFFF', fontFamily: 'Avenir-Heavy' }}>
                                            Advance Workout
                           </Text>

                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                    <View style={{ flex: 0.8, justifyContent: 'center' }}>
                        {this.renderStepIndicator()}
                    </View>






                </SafeAreaView>
            )
        } else if (this.state.componentDidErr) {
            return (
                <View style={{ flex: 1, paddingVertical: 100, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue' }}>
                        It looks like something wrong.  Try again later.
                        </Text>
                    <Button onPress={() => this.props.navigation.pop()} uppercase={false} mode="text" color="#1089ff" icon={() => <FeatherIcon name="arrow-left" color="#1089ff" />}>
                        Try again later
                        </Button>

                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                        Loading your program...
                    </Text>
                </View>
            )
        }
    }


    renderLiveWorkoutOptions = () => {
        return (
            <Modal visible={this.state.liveWorkoutOptionsVisible} presentationStyle="overFullScreen" transparent animated={true} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
                    <View style={{ paddingHorizontal: 20, height: 'auto', justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Avatar.Image style={{ marginRight: 10 }} size={25} source={{ uri: this.state.programOwnerData.photo_url }} />
                            <View style={{ alignItems: 'flex-start' }}>
                                <Text style={[styles.RBSheetText, { fontSize: 15, fontFamily: 'Avenir-Heavy' }]}>
                                    {this.state.programOwnerData.display_name}
                                </Text>
                                <Text style={{ color: 'white' }}>
                                    {this.state.programOwnerData.certification}
                                </Text>
                                <Text style={[styles.RBSheetText]} numberOfLines={4} ellipsizeMode="tail">
                                    {this.state.programData.program_description}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginVertical: 20 }}>
                        <ListItem
                            title='Share'
                            titleStyle={[styles.RBSheetText, styles.interactionsTitleText]}
                            subtitle='Share this program with a friend.'
                            subtitleStyle={styles.interactionsSubtitleText}
                            rightIcon={() => <FeatherIcon name="share" color="#FFFFFF" size={20} />}
                            containerStyle={{ backgroundColor: 'transparent' }}
                            bottomDivider
                            onPress={this.handleShareProgram}
                        />
                    </View>
                </SafeAreaView>

                <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(58, 58, 60, 0.5)', borderRadius: 80, width: 50, height: 50, borderWidth: 1, borderColor: '#FFFFFF', bottom: Constants.statusBarHeight, alignSelf: 'center', }}>
                    <FeatherIcon onPress={() => this.closeLiveWorkoutOptionsModal()} name="x" color="white" size={20} style={{ alignSelf: 'center' }} />
                </View>
            </Modal>
        )
    }

    showFeedbackDialog = () => {
        this.closeLiveWorkoutOptionsModal()
        this.setState({ feedbackDialogIsVisible: true })
    }

    closeFeedbackDialog = () => {
        this.setState({ feedbackDialogIsVisible: false })
    }

    handleSaveFeedback = () => {
        // this.LUPA_CONTROLLER_INSTANCE.saveFeedback(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData.program_owner, this.state.feedback)
        this.closeFeedbackDialog()
    }

    handleFeedbackTextInputOnChangeText = (text) => {
        this.setState({ feedback: text })
    }

    handleCompleteWorkout = () => {
        const lastCompletedWorkoutData = {
            dateCompleted: new Date(),
            workoutUUID: this.state.programData.program_structure_uuid
        }

        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('last_completed_workout', lastCompletedWorkoutData)
        this.hideDialog();
    }

    /*calculateNextWorkoutDate = () => {
        const programWorkoutStructure = this.state.programData.program_workout_structure;
        const currentWeek = this.state.currentWeek;
        const programWorkoutDays = this.state.programData.program_workout_days;

        //first we check to see if we are done with this week
        const currentDay = this.state.currentWorkoutDay;

        let workoutDaysLength = programWorkoutDays.length;
        
        //if we are done for this week we should go to the next week and get the next day
        if (programWorkoutDays.indexOf(currentDay) == workoutDaysLength) {
            let nextDay = programWorkoutDays[0];
            let nextWeek = currentWeek + 1;
            
            //if we are passed the program duration we should alert the end of the program
            if (nextWeek > this.state.programData.program_duration) {
                return -1;
            } else {
                let startDate = this.state.programData.program_start_date;
                let dateOfWeek = moment(startDate).add(this.state.programData.program_duration, 'weeks');

            }
        } else if () {

        }
    }*/

    renderRestTimerRBSheetPicker = () => {
        restTimesArr.push(this.state.currentWorkout.workout_rest_time);

        return (
            <RBSheet
                ref={this.restTimesRBSheet}
                height={250}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {

                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: 'rgb(220, 220, 220)',
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%' }}>
                        <Button color="#1089ff" style={{ alignSelf: 'flex-end' }} mode="text" onPress={this.closeRestTimesRBSheet}>
                            <Text>
                                Done
                        </Text>
                        </Button>
                    </View>

                    <Picker
                        selectedValue={this.state.restTime}
                        style={{ height: '100%', width: '100%' }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ restTime: itemValue })
                        }>
                        {
                            restTimesArr.map(time => {
                                return <Picker.Item label={time.toString()} value={time} />
                            })
                        }
                    </Picker>
                </View>
            </RBSheet>
        )
    }

    render() {
        return (
            <>
                <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0 }}>
                    <Appbar.BackAction onPress={this.showWarningDialog} />

                    <Appbar.Content title={`Week ${this.state.currentWeek + 1}, ${this.state.currentWorkoutDay}`} titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 16 }} />
                    <TouchableWithoutFeedback style={{ marginRight: 20 }} onPress={() => this.setState({ liveWorkoutOptionsVisible: true })}>
                        <Surface style={{ marginVertical: 5, elevation: 3, width: 35, height: 35, borderRadius: 65 }}>
                            {this.props.lupa_data.Users.currUserData.photo_url == '' ?
                                null
                                :
                                <Avatar.Image onPress={() => this.setState({ liveWorkoutOptionsVisible: true })} style={{ flex: 1 }} size={35} source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} />
                            }
                        </Surface>
                    </TouchableWithoutFeedback>
                </Appbar.Header>

                {this.renderComponentDisplay()}
                {this.renderFinishWorkoutWarningDialog()}
                {this.renderLiveWorkoutOptions()}
                {this.renderRestTimerRBSheetPicker()}

                <RestTimer
                    isVisible={this.state.restTimerVisible}
                    restTime={this.state.restTime}
                    currentExercise={this.state.currentWorkout}
                    closeModal={() => this.setState({ restTimerVisible: false })}
                />
                <WorkoutFinishedModal isVisible={this.state.showFinishedDayDialog} closeModal={this.hideDialog} />
                <NoExercisesDialogVisible isVisible={this.state.noWorkoutsDialogVisible} />

            </>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        backgroundColor: "#FFFFFF",
        flex: 1
    },
    container: {

    },
    RBSheetText: {
        color: 'white'
    },
    interactionsTitleText: {
        fontSize: 15,
        color: 'white',
    },
    interactionsSubtitleText: {
        fontSize: 12,
        color: 'white',
    },
    errorImageContainer: {
        flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center'
    }
})

export default connect(mapStateToProps)(LiveWorkout);
