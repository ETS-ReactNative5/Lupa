import React from 'react';

import {
    View,
    StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

import ProgramInformation from './component/ProgramInformation'
import BuildAWorkout from './BuildWorkout';
import ProgramPreview from './component/ProgramPreview';
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
import { fromString } from 'uuidv4';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addProgram: (programPayload) => {
            dispatch({
                type: "ADD_CURRENT_USER_PROGRAM",
                payload: programPayload,
            })
        },
        deleteProgram: (programUUID) => {
            dispatch({
                type: "DELETE_CURRENT_USER_PROGRAM",
                payload: programUUID
            })
        },
    }
}

class CreateProgram extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currIndex: 0,
            currProgramUUID: "",
            programData: getLupaProgramInformationStructure(),
            programImage: "",
            programComplete: false,
        }

        this.nextIndex = this.nextIndex.bind(this);
    }

    async componentDidMount() {
        const UUID = fromString((Math.random() + this.props.lupa_data.Programs.currUserProgramsData.length).toString())
        const programPayload = getLupaProgramInformationStructure(UUID, "", "" ,0, new Date(), new Date(), "", 0, 0, 0, {}, false, "", [], this.props.lupa_data.Users.currUserData.user_uuid, [this.props.lupa_data.Users.currUserData.user_uuid], "")
        await this.setState({ currProgramUUID: UUID })
        await this.setState({ programData: programPayload })
        this.LUPA_CONTROLLER_INSTANCE.createNewProgram(UUID);
    }

    async componentWillUnmount() {
        if (this.state.programComplete == false) {
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID)

            if (typeof (this.state.currProgramUUID) != 'undefined' || this.state.currProgramUUID != '' || this.state.currProgramUUID == null) {
                //delete from redux
                this.props.deleteProgram(this.state.currProgramUUID)
            }
        }
    }

    captureProgramImage = (img) => {
        this.setState({
            programImage: img
        })
    }

    saveProgramInformation = async (programName, programDescription, numProgramSpots, programStartDate,
        programEndDate, programDuration, programTime, programPrice, programLocationData, programType,
        allowWaitlist, programImage, programTags, programAutomatedMessage, programDays) => {
        let updatedProgramData = this.state.programData;

        updatedProgramData.program_structure_uuid = this.state.currProgramUUID;
        updatedProgramData.program_name = programName;
        updatedProgramData.program_description = programDescription;
        updatedProgramData.program_slots = numProgramSpots;
        updatedProgramData.program_start_date = programStartDate;
        updatedProgramData.program_end_date = programEndDate;
        updatedProgramData.program_workout_days = programDays;
        updatedProgramData.program_duration = programDuration;
        updatedProgramData.program_time = programTime;
        updatedProgramData.program_price = programPrice;
        updatedProgramData.program_location = programLocationData;
        updatedProgramData.program_type = programType;
        updatedProgramData.program_allow_waitlist = allowWaitlist;
        updatedProgramData.program_image = this.state.programImage
        updatedProgramData.program_tags = programTags;
        updatedProgramData.program_participants = [this.props.lupa_data.Users.currUserData.user_uuid]
        updatedProgramData.program_owner = this.props.lupa_data.Users.currUserData.user_uuid;
        updatedProgramData.program_automated_message = programAutomatedMessage

        await this.LUPA_CONTROLLER_INSTANCE.updateProgramData(this.state.currProgramUUID, updatedProgramData);

        this.goToIndex(1)
    }

    saveProgramWorkoutData = async (workoutData) => {
        await this.LUPA_CONTROLLER_INSTANCE.updateProgramWorkoutData(this.state.currProgramUUID, workoutData)

        this.setState({ programComplete: true }, () => {
            this.exit()
        })
    }

    saveProgram = async () => {
        await this.setState({
            programComplete: true
        })

        try {
            const programPayload = await this.LUPA_CONTROLLER_INSTANCE.saveProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData);
            this.props.addProgram(programPayload);
        } catch (err) {
            await this.setState({
                programComplete: false
            })
        }
    }

    prevIndex = () => {
        this.setState({
            currIndex: this.state.currIndex - 1
        })
    }

    nextIndex = () => {
        this.setState({
            currIndex: this.state.currIndex + 1
        })
    }

    goToIndex = (index) => {
        this.setState({
            currIndex: index
        })
    }

    exit = () => {
        if (this.state.programComplete == false) {
            alert(this.state.programComplete)
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID)

            if (typeof (this.state.currProgramUUID) != 'undefined' || this.state.currProgramUUID != '' || this.state.currProgramUUID == null) {
                //delete from redux
                this.props.deleteProgram(this.state.currProgramUUID)
            }
        }

        this.props.navigation.navigate('Train');
    }

    getViewDisplay = () => {
        switch (this.state.currIndex) {
            case 0:
                return (
                    <ProgramInformation captureImage={img => this.captureProgramImage(img)} handleCancelOnPress={this.exit} goToIndex={this.nextIndex} saveProgramInformation={(
                        programName,
                        programDescription,
                        numProgramSpots,
                        programStartDate,
                        programEndDate,
                        programDuration,
                        programTime,
                        programPrice,
                        programLocationData,
                        programType,
                        allowWaitlist,
                        programImage,
                        programTags,
                        programAutomatedMessage,
                        programWorkoutDays) => this.saveProgramInformation(programName,
                            programDescription,
                            numProgramSpots,
                            programStartDate,
                            programEndDate,
                            programDuration,
                            programTime,
                            programPrice,
                            programLocationData,
                            programType,
                            allowWaitlist,
                            programImage,
                            programTags,
                            programAutomatedMessage,
                            programWorkoutDays
                        )} />
                )
            case 1:
                return <BuildAWorkout programData={this.state.programData} goToIndex={this.goToIndex} goBackToEditInformation={() => this.setState({ currIndex: this.state.currIndex - 1 })} saveProgramWorkoutData={workoutData => this.saveProgramWorkoutData(workoutData)} />
            default:
        }
    }


    render() {
        return (
            <View style={styles.root}>
                {
                    this.getViewDisplay()
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProgram);