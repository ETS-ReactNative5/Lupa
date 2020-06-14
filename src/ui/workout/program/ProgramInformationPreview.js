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
    Button,
    Paragraph,
    Caption,
    Avatar,
    IconButton,
} from 'react-native-paper';

import { Constants } from 'react-native-unimodules';
import LupaController from '../../../controller/lupa/LupaController';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { initStripe, stripe, CURRENCY, STRIPE_ENDPOINT, LUPA_ERR_TOKEN_UNDEFINED } from '../../../modules/payments/stripe/index'
const { fromString } = require('uuidv4')
import { withNavigation } from 'react-navigation'

import { connect } from 'react-redux';
import axios from 'axios';
import { LOG_ERROR } from '../../../common/Logger';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';

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
        updateCurrentUserAttribute: (payload) => {
            dispatch({
                type: "UPDATE_CURRENT_USER_ATTRIBUTE",
              payload: payload
            })
        }
    }
}

class ProgramInformationPreview extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            showProfileModal: false,
            showPreviewModal: false,
            loading: false,
            token: null,
            programData: getLupaProgramInformationStructure()
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.handleToggleBookmark = this.handleToggleBookmark.bind(this);

    }

    async componentDidMount() {
        //TEMPORARY FIX - Undefined error for object keys of programData props
       await this.setState({
            programData: this.props.programData
        })
    }

    /**
     * Returns the program owners display name
     * @return String progam owner's display name
     */
    getOwnerDisplayName = () => {
        if (typeof(this.props.programData) == 'undefined')
        {
            return ''
        }

            try {
            return this.props.programData.program_owner.displayName
            } catch(error) {
                LOG_ERROR('ProgramInformationPreview.js', 'Unhandled exception in getOwnerDisplayName()', error)
                return ''
            }

        return ''
    }

      /**
     * Returns the program name
     * @return URI Returns a string for the name, otherwise ''
     */
    getProgramName = () => {
            try {
                return (
                    <Text style={{ fontFamily: 'ARSMaquettePro-Black', fontSize: 20, color: '#FFFFFF' }}>
                               {this.props.programData.program_name}
                    </Text>
                )
            } catch(err) {
                return (
                    <Text style={{ fontFamily: 'ARSMaquettePro-Black', fontSize: 20, color: '#FFFFFF' }}>
                                    Unable to load program name
                                    </Text>
                )
            }
    }

     /**
     * Returns the program description
     * @return URI Returns a string for the description, otherwise ''
     */
    getProgramDescription = () => {
        if (typeof(this.props.programData) == 'undefined')
        {
            return ''
        }

            try {
                return this.props.programData.program_description;
            } catch(err) {
                return ''
            }
    }

    /**
     * Returns the program image
     * @return URI Returns a uri for the program image, otherwise ''
     */
    getProgramImage = () => {
        if (typeof(this.props.programData) == 'undefined')
        {
            return ''
        }

            try {
                return this.props.programData.program_image;
            } catch(err) {
                return ''
            }
    }

    /**
     * Returns the program price
     * @return String representing the program price, otherwise, ''
     */
    getProgramPrice = () => {
        if (typeof(this.props.programData) == 'undefined')
        {
            return 0
        }

            try {
                return this.props.programData.program_price;
            } catch(error) {
                return 0;
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
    
    handleToggleBookmark = () => {
       const payload = getUpdateCurrentUserAttributeActionPayload('bookmarked_programs', this.state.programData.program_structure_uuid, '');
       this.LUPA_CONTROLLER_INSTANCE.toggleProgramBookmark(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData.program_structure_uuid)
       this.props.updateCurrentUserAttribute(payload)
    }

    render() {
        const program = this.props.programData;
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isVisible} style={{ flex: 1 }} animated={true} animationType="slide">
                <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 1.5, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>

                    <Surface style={{ width: '80%', height: '60%', borderRadius: 50, elevation: 30 }}>
                        <Image source={{ uri: this.getProgramImage() }} style={{ borderRadius: 50, width: '100%', height: '100%' }} />
                    </Surface>

                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <Avatar.Text label="EH" size={15} style={{ margin: 3 }} />
                            <Caption style={{ color: '#FFFFFF' }}>
                                See more programs by {this.getOwnerDisplayName()}
                            </Caption>
                        </View>

                </View>

                <View style={{
                    position: 'absolute',
                    top: Constants.statusBarHeight,
                    width: Dimensions.get('window').width,
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                    <IconButton icon="close" color="#FFFFFF" size={30} onPress={() => this.props.closeModalMethod()} />
                   {/* <IconButton icon="fullscreen" color="#FFFFFF" /> */}
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
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <View style={{width: '100%', justifyContent: 'center'}}>
                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                {
                                    this.getProgramName()
                                }
                                    <IconButton icon={this.props.lupa_data.Users.currUserData.bookmarked_programs.includes(this.state.programData.program_structure_uuid) ? 'bookmark' : "bookmark-border"} color="#FFFFFF" size={30} onPress={this.handleToggleBookmark.bind(this)} />
                                </View>
                                <Text style={{ fontSize: 12, paddingTop: 5, fontFamily: 'ARSMaquettePro-Medium', color: '#FFFFFF' }}>
                                    In Person, One on One Program
                </Text>
                            </View>
                        </View>

                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Paragraph style={{textAlign: 'left', fontSize: RFPercentage(2), width: '95%', alignSelf: 'flex-start', color: '#FFFFFF' }} numberOfLines={4} >
                            {this.getProgramDescription()}
                    </Paragraph>
                    <Caption style={{alignSelf: 'flex-start'}}>
                        Swipe right to read more
                    </Caption>
                        </View>

                    </View>



                    <View style={{ paddingHorizontal: 5, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'ARSMaquettePro-Black', fontSize: 20, color: '#FFFFFF' }}>
                            ${this.getProgramPrice()}
                        </Text>

                        <Button mode="outlined"
                            style={{
                                borderColor: '#FFFFFF',
                                
                                elevation: 0,
                                height: 45,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
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
                        </Button>
                    </View>

                </Surface>
            </Modal>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ProgramInformationPreview));