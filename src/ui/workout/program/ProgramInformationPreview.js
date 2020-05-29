import React, { PureComponent } from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    Modal,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Title,
    Button,
    Headline,
    Paragraph,
    Caption,
    Avatar,
    IconButton,
    Appbar
} from 'react-native-paper';

import ThinFeatherIcon from "react-native-feather1s";
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Constants } from 'react-native-unimodules';
import LupaCalendar from '../../user/dashboard/calendar/LupaCalendar';
import LupaController from '../../../controller/lupa/LupaController';
import LiveWorkoutPreview from './LiveWorkoutPreview';
import ModalLiveWorkoutPreview from './modal/ModalLiveWorkoutPreview';
import ModalProfileView from '../../user/profile/ModalProfileView';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { initStripe, stripe, CURRENCY, STRIPE_ENDPOINT, LUPA_ERR_TOKEN_UNDEFINED } from '../../../modules/payments/stripe/index'
const { fromString, uuid } = require('uuidv4')
import { withNavigation } from 'react-navigation'

import { connect } from 'react-redux';
import axios from 'axios';

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
    }
}

class ProgramInformationPreview extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            programOwnerData: this.props.programOwnerData,
            ready: false,
            showProfileModal: false,
            showPreviewModal: false,
            loading: false,
            token: null,
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    }

    /**
     * Lifecycle Method - Handles operations when the component mounts
     */
    componentDidMount = async () => {
        await this.setState({
            programOwnerData: this.props.programOwnerData,
            ready: true,
        })
    }

    /**
     * Returns the program owners display name
     * @return String progam owner's display name
     */
    getOwnerDisplayName = () => {
        if (this.state.ready) {
            try {
            return this.state.programOwnerData.display_name
            } catch(error) {
                return ''
            }
        }

        return ''
    }

      /**
     * Returns the program name
     * @return URI Returns a string for the name, otherwise ''
     */
    getProgramName = () => {
        if (this.state.ready)
        {
            try {
                return this.props.programData.program_name;
            } catch(err) {
                return ''
            }
        }

        return ''
    }

     /**
     * Returns the program description
     * @return URI Returns a string for the description, otherwise ''
     */
    getProgramDescription = () => {
        if(this.state.ready)
        {
            try {
                return this.props.programData.program_description;
            } catch(err) {
                return ''
            }
        }

        return ''
    }

    /**
     * Returns the program image
     * @return URI Returns a uri for the program image, otherwise ''
     */
    getProgramImage = () => {
        if (this.state.ready)
        {
            try {
                return this.props.programData.program_image;
            } catch(err) {
                return ''
            }
        }
        
        return "";
    }

    /**
     * Returns the program price
     * @return String representing the program price, otherwise, ''
     */
    getProgramPrice = () => {
        if (this.state.ready)
        {
            try {
                return this.props.programData.program_price;
            } catch(error) {
                return 0;
            }
        }
    }

    /**
     * Handles program purchase process
     */
    handlePurchaseProgram = async (amount) => {
        /*
         //handle stripe
         await initStripe();
 
         //collect payment information and generate payment token
         try {
             this.setState({ loading: true, token: null })
             const token = await stripe.paymentRequestWithCardForm({
                 requiredBillingAddressFields: 'zip'
             });
 
             if (token == undefined) {
                 throw LUPA_ERR_TOKEN_UNDEFINED;
             }
 
             await this.setState({ loading: false, token: token })
 
         } catch (error) {
             await this.setState({
                 loading: false,
                 paymentComplete: true,
                 paymentSuccessful: false,
             })
             return;
         }
 
         //get the token from the state
         const generatedToken = await this.state.token;
 
         //Send request to make payment
         try {
             await this.makePayment(generatedToken, amount)
         } catch (error) {
             this.setState({
                 paymentComplete: true,
                 paymentSuccessful: true,
             })
 
             return;
         }
         */

        /****  REMOVE THIS IF PAYMENTS ARE LIVE ******/
        await this.setState({
            paymentSuccessful: true,
            paymentComplete: true
        })

        //If the payment is complete and successful then update database
        if (this.state.paymentComplete == true && this.state.paymentSuccessful == true) {

            //handle program in backend
            try {
                const updatedProgramData = await this.LUPA_CONTROLLER_INSTANCE.purchaseProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.props.programData);
                await this.props.addProgram(updatedProgramData);
            } catch (err) {
                //need to handle the case where there is an error when we add the program
                this.props.closeModalMethod()
            }
        }

        //close modal
        this.props.closeModalMethod()
    }

    /**
     * Sends request to server to complete payment
     */
    makePayment = async (token, amount) => {
        const idempotencyKey = await fromString(token.toString() + Math.random().toString())

        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: STRIPE_ENDPOINT,
            data: JSON.stringify({
                amount: 0.50,
                currency: CURRENCY,
                token: token,
                idempotencyKey: idempotencyKey,
            })
        }).then(response => {
            this.setState({ loading: false })
        }).catch(err => {
            this.setState({
                paymentSuccessful: false,
                paymentComplete: true,
            })
        })
    }

    getProgramTags() {
        try {
            return program.program_tags.map((tag, index, arr) => {
                if (index == arr.length - 1) {
                    return (
                        <Caption>
                            {tag}
                        </Caption>
                    )
                }
                return (
                    <Caption>
                        {tag},
                    </Caption>

                )
            })
        } catch (err) {

        }
    }

    render() {
        const program = this.props.programData;
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isVisible} style={{ flex: 1 }} animated={true} animationType="slide">
                <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 1.5, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>

                    <Surface style={{ width: '80%', height: '60%', borderRadius: 50, elevation: 30 }}>
                        <Image source={{ uri: this.getProgramImage() }} style={{ borderRadius: 50, width: '100%', height: '100%' }} />
                    </Surface>

                </View>

                <View style={{
                    position: 'absolute',
                    top: Constants.statusBarHeight,
                    width: Dimensions.get('window').width,
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                    <IconButton icon="navigate-before" color="#FFFFFF" size={30} onPress={() => this.props.closeModalMethod()} />
                    <IconButton icon="fullscreen" color="#FFFFFF" />
                </View>


                <Surface style={{
                    backgroundColor: '#2E2F33',
                    justifyContent: 'space-around',
                    padding: 15,
                    elevation: 15,
                    borderTopLeftRadius: 35,
                    borderTopRightRadius: 35,
                    position: 'absolute',
                    bottom: 0,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height / 2.5
                }}>
                    <View style={{ justifyContent: 'space-evenly', flex: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ fontFamily: 'ARSMaquettePro-Black', fontSize: 30, color: '#FFFFFF' }}>
                                    Program Title
                </Text>
                                <Text style={{ fontSize: 15, paddingTop: 5, fontFamily: 'ARSMaquettePro-Medium', color: '#FFFFFF' }}>
                                    In Person, One on One Program
                </Text>
                            </View>
                            <IconButton icon="favorite" color="#ff8080" />
                        </View>

                        <Paragraph style={{ width: '95%', alignSelf: 'center', color: '#FFFFFF' }}>
                            But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings
                    </Paragraph>

                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <Avatar.Text label="EH" size={15} style={{ margin: 3 }} />
                            <Caption style={{ color: '#FFFFFF' }}>
                                See more programs by {this.getOwnerDisplayName()}
                            </Caption>
                        </View>

                    </View>



                    <View style={{ paddingHorizontal: 20, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'ARSMaquettePro-Black', fontSize: 30, color: '#FFFFFF' }}>
                            ${this.getProgramPrice()}
                        </Text>

                        <Button mode="outlined"
                            style={{
                                borderColor: '#FFFFFF',
                                marginHorizontal: 10,
                                elevation: 0,
                                width: 200,
                                height: 55,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}
                            theme={{
                                roundness: 25,
                                colors: {
                                    primary: '#FFFFFF',
                                }
                            }} onPress={() => this.handlePurchaseProgram(program.program_price)}>
                            <Text style={{ fontFamily: 'ARSMaquettePro-Medium', fontSize: 20 }}>
                                Purchase
                    </Text>
                            <MaterialIcon name="keyboard-arrow-right" size={25} />
                        </Button>


                        {/*
                <Button mode="outlined" style={{marginHorizontal: 10, elevation: 0, flex: 1,  height: 55, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}} theme={{
                    roundness: 10,
                    colors: {
                        primary: '#2196F3'
                    }
                }} onPress={() => this.setState({ showPreviewModal: true })}>
                    <ThinFeatherIcon
name="eye"
size={35}
color="#2196F3"
thin={true}
onPress={() => this.setState({ showPreviewModal: true })}
/>

                </Button>
            */}
                    </View>

                </Surface>
                {
                    this.state.ready == true ?
                        <ModalLiveWorkoutPreview programOwnerData={this.state.programOwnerData} programData={this.props.programData} isVisible={this.state.showPreviewModal} closeModalMethod={() => this.setState({ showPreviewModal: false })} />
                        :
                        null
                }

                <ModalProfileView uuid={this.props.programOwnerData.user_uuid} isVisible={this.state.showProfileModal} closeModalMethod={() => this.setState({ showPreviewModal: false })} />
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ProgramInformationPreview));