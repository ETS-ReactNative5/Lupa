import React from 'react';

import {
    View,
    StyleSheet,
    ImageBackground,
    Modal,
    Text,
    TouchableWithoutFeedback
} from 'react-native';

import {
    TextInput, 
    Title,
    Headline,
    Button,
    ProgressBar
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import LupaController from '../../../../controller/lupa/LupaController';

import ChooseUsername from './ChooseUsername';
import BasicInformation from './BasicInformation';
import FitnessInterest from './FitnessInterest';
import WorkoutTimes from './WorkoutTimes';
import TrainerInformation from './TrainerInformation';

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (userObject) => {
          dispatch({
            type: 'UPDATE_CURRENT_USER',
            payload: userObject
          })
        },
        updatePacks: (packsData) => {
          dispatch({
            type: 'UPDATE_CURRENT_USER_PACKS',
            payload: packsData,
          })
        }
      }
}

let progress = 0;

class WelcomeModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currIndex: 0,
            pageChangedForward: false,
            progress: 0
        }
        
        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await _requestPermissionsAsync();
    }

    _setupRedux = async () => {
        let currUserData, currUserPacks, currUserHealthData;
        await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
          currUserData = result;
        })
    
        await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
          currUserPacks = result;
        })
    
        await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
          currUserHealthData = result;
        });
    
        let userPayload = {
          userData: currUserData,
          healthData: currUserHealthData,
        }

        console.log(currUserData)
    
        await this._updatePacksInRedux(currUserPacks);
        await this._updateUserInRedux(userPayload);
      }
    
       _updateUserInRedux = async (userObject) => {
        await this.props.updateUser(userObject);
      }
    
      _updatePacksInRedux = async (packsData) => {
        await this.props.updatePacks(packsData);
      }

    _handleNextViewClick = async () => {
        if (this.state.currIndex == 4)
        {   
            await this._setupRedux();
            this.props.closeModalMethod();
            return;
        }
 
        this.setState({ 
            pageChangedForward: true,
            currIndex: this.state.currIndex + 1,
            progress: this.state.progress + .20
        });
    }

    _handleBackViewClick = () => {
        this.setState({ 
        pageChangedForward: false,
        currIndex: this.state.currIndex - 1,
        progress: this.state.progress - .20
    });
    }    

    presentScreen = (index) => {
            switch(index) {
                case 0:
                    progress += 20;
                    return <ChooseUsername />
                case 1:
                    progress += 20;
                    return <TrainerInformation />
                case 2:
                    progress += 20;
                    return <BasicInformation isForwardPageChange={this.state.isForwardPageChange} />
                case 3:
                    progress += 20;
                    return <FitnessInterest />
                case 4:
                    progress += 20;
                    return <WorkoutTimes />
                default:
            }   
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" animated={true} animationType="slide" visible={this.props.isVisible} style={styles.modalContainer}>
                <SafeAreaView style={{flex: 1}}>
                    <ProgressBar style={{padding: 10}} animating={true} color="#2196F3" progress={this.state.progress}/>
                        <View style={{flex: 4, flexGrow: 5, flexShrink: 2}}>
                        {
                            this.presentScreen(this.state.currIndex)
                        }
                        </View>
                        <View style={styles.buttons}>
                            {
                               this.state.currIndex == 0 ?
                               <Text>

                               </Text>
                               :                              
                               <Button mode="text" color="#2196F3" onPress={() => this._handleBackViewClick()}>
                                                            Back
                                                        </Button>
                                        
                            }
                            
                            {
                                this.state.currIndex == 4 ?
                                <Button mode="contained" color="#2196F3" onPress={() => this._handleNextViewClick()}>
                                Done
                            </Button>
                            :
                            <Button mode="text" color="#2196F3" onPress={() => this._handleNextViewClick()}>
                            Next
                        </Button>
                            }
                            
                        </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "#FAFAFA",
        margin: 0,
    },
    wrapper: {
        height: "95%",
    },
    buttons: {
        flex: 1,
        flexGrow: 1,
        padding: 10,
        flexShrink: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeModal);