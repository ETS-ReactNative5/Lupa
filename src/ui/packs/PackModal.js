import React, { useState, useEffect } from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ActionSheetIOS,
    TouchableOpacity
} from 'react-native';

import {
    IconButton,
    Surface,
    Caption,
    Button,
    Modal as PaperModal,
    Portal,
    Provider,
    Avatar as PaperAvatar,
    Paragraph,
    Headline,
    Title,
    Avatar,
    FAB,
    Divider
} from 'react-native-paper';

import {
    Svg,
    Ellipse
} from 'react-native-svg';

import { Feather as FeatherIcon } from '@expo/vector-icons';
import SafeAreaView from 'react-native-safe-area-view';
import { ScrollView } from 'react-native-gesture-handler';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import LupaController from '../../controller/lupa/LupaController';
import CreateEvent from './modal/CreateEvent';
import { withNavigation } from 'react-navigation';
import UserDisplayCard from './component/UserDisplayCard';

import { Badge } from 'react-native-elements';

import PackInformationModal from './modal/PackInformationModal';

import PackEventModal from './modal/PackEventModal';

import PackRequestsModal from './modal/PackRequestsModal';

import { connect } from 'react-redux';
import { refreshStoreState } from '../../controller/redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = dispatchEvent => {
    return {
        leavePack: (pack_uuid) => {
            dispatchEvent({
                type: "REMOVE_CURRENT_USER_PACK",
                payload: pack_uuid
            })
        }
    }
}

const PackMembersModal = (props) => {
    return (

                <Modal presentationStyle="overFullScreen" visible={props.isOpen} dismissable={false}>
                    <SafeAreaView style={styles.membersModal}>
                        <View style={{width: '100%', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <IconButton icon="arrow-back" onPress={props.closeModalMethod}/>
                            <Headline>
                                Members
                            </Headline>
                        </View>
                        <View style={{flex: 3}}>
                            <ScrollView centerContent contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }} shouldRasterizeIOS={true} showsVerticalScrollIndicator={false}>
                            {
                                props.displayMembersMethod()
                            }

                            </ScrollView>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Paragraph>
                                This pack currently has {props.packMembersLength} active members and {props.packRequestsLength} active invites.
                            </Paragraph>
                        </View>
                        </SafeAreaView>
                </Modal>
    )
}

class PackEventCard extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packEventModalIsOpen: false,
            packEventObject: this.props.packEventObjectIn,
            attendees: [],
            packEventImage: "",
            attendeeProfileImages: []
        }
    }

    componentDidMount = async () => {
        await this.setupPackEventCard();
        await this.getPackEventImage();
        await this.generateEventAttendeePhotos();
    }

    setupPackEventCard = async () => {
        await this.setState({
            packEventObject: this.props.packEventObjectIn,
            attendees: this.props.packEventObjectIn.attendees,
        })
    }

    handlePackEventModalOpen = () => {
        this.setState({
            packEventModalIsOpen: true
        })
    }

    handlePackEventModalClose = async () => {
        await this.props.refreshData();
        this.setState({
            packEventModalIsOpen: false
        })
    }

    getPackEventImage = async () => {
        let packEventImageIn;

        await this.LUPA_CONTROLLER_INSTANCE.getPackEventImageFromUUID(this.state.packEventObject.pack_event_uuid).then(imageURL => {
            packEventImageIn = imageURL;
        });

        await this.setState({
            packEventImage: packEventImageIn
        })
    }

    getPackEventCardImage = () => {
        if (this.state.packEventImage == "" || this.state.packEventImage == undefined)
        {
            return (
                <View style={{width: "100%", height: "100%", borderRadius:20, backgroundColor: "white" }}>

                </View>
            )
        }

        try {
            return (
                <Image style={{ width: "100%", height: "100%", borderRadius: 20 }} source={{ uri: this.state.packEventImage }} resizeMethod="auto" resizeMode={ImageResizeMode.cover} />
            )
        }
        catch(err)
        {
            return (
                <View style={{width: "100%", height: "100%", borderRadius:20, backgroundColor: "white" }}>

                </View>
            )
        }
    }

    renderDate = (lupaDateString) => {
        const dateStrings = lupaDateString.split("-");

        let month = dateStrings[0];
        const day = dateStrings[1];
        const year = dateStrings[2];

        const date = month + " " + day + ", " + year;

        return date;
    } 

    handleAttendEvent = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.setUserAsAttendeeForEvent(this.state.packEventObject.pack_event_uuid, "", this.props.currUserUUID);
        let updatedAttendees = this.state.attendees;
        updatedAttendees.push(this.props.currUserUUID);
        await this.setState({
            attendees: updatedAttendees,
        })
    }

    generateEventAttendeePhotos = async () => {
        let attendeePhotoArr = [], photoIn;

        if (this.state.attendees && this.state.attendees.length > 0)
        {
            for (let i = 0; i < this.state.attendees.length; i++)
            {
                await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.state.attendees[i]).then(res => {
                    photoIn = res.photo_url
                })

                await attendeePhotoArr.push(photoIn);
            }
        }

        await this.setState({
            attendeeProfileImages: attendeePhotoArr,
        })
    }

    mapAttendees = () => {
        return this.state.attendeeProfileImages.map(image => {
            return <Avatar.Image size={30} style={{margin: 3}} source={{uri: image}} />
        })
    }

    render() {
        return (
           // <TouchableOpacity onPress={() => this.handlePackEventModalOpen()}>
           <Surface style={{padding: 15, borderRadius: 30, margin: 10, width: Dimensions.get('window').width - 40, height: 'auto', backgroundColor: "#f2f2f2"}}>
                       <View>
                       <Title >
                            {this.state.packEventObject.pack_event_title}
                        </Title>
                        <Text style={{fontFamily: 'avenir-book', fontSize: 15}}>
                            {this.renderDate(this.state.packEventObject.pack_event_date)}
                        </Text>
                        <Text style={{fontFamily: 'avenir-book', fontSize: 15}}>
                            {this.state.packEventObject.pack_event_time}
                        </Text>
                           </View>
                           <View style={{flex: 1, alignItems: "flex-start", justifyContent: "center"}}>
                           <Paragraph>
                            {this.state.packEventObject.pack_event_description}
                        </Paragraph>
                           </View>

                           <View style={{padding: 5, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                                {this.mapAttendees()}
                           </View>

                           <Divider />

                           <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
                               <Button color="#2196F3" disabled={this.state.packEventObject.attendees.includes(this.props.currUserUUID)} onPress={this.handleAttendEvent}>
                               <Text style={{fontFamily: "avenir-book", fontSize: 15}}>
                                  I'm Attending
                                   </Text>
                               </Button>

                               <Button color="#2196F3" onPress={this.handlePackEventModalOpen}>
                                   <Text style={{fontFamily: "avenir-book", fontSize: 15}}>
                                   View Event
                                   </Text>
                               </Button>
                           </View>
                           <PackEventModal isOpen={this.state.packEventModalIsOpen} closeModalMethod={this.handlePackEventModalClose} packEventTime={this.state.packEventObject.pack_event_time} packEventTitle={this.state.packEventObject.pack_event_title} packEventDescription={this.state.packEventObject.pack_event_description} packEventAttendees={this.state.packEventObject.attendees} packEventDate={this.state.packEventObject.pack_event_date} packEventUUID={this.state.packEventObject.pack_event_uuid} packEventAttendees={this.state.packEventObject.attendees}/>
</Surface>
/*
            <Surface style={{ margin: 5, elevation: 5, width: Dimensions.get('screen').width - 20, height: 160, borderRadius: 20 }}>
            {this.getPackEventCardImage()}
    </Surface>
    
    <View style={{width: "auto", height: "auto", backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
    <Title style={{ color: 'black' }}>
        {this.state.packEventObject.pack_event_title}
    </Title>
    <Paragraph style={{ textAlign: 'center', color: 'black', fontSize: 20}}>
        {this.state.packEventObject.pack_event_description}
    </Paragraph>
    </View>
    <PackEventModal isOpen={this.state.packEventModalIsOpen} closeModalMethod={this.handlePackEventModalClose} packEventTime={this.state.packEventObject.pack_event_time} packEventTitle={this.state.packEventObject.pack_event_title} packEventDescription={this.state.packEventObject.pack_event_description} packEventAttendees={this.state.packEventObject.attendees} packEventDate={this.state.packEventObject.pack_event_date} packEventUUID={this.state.packEventObject.pack_event_uuid} packEventAttendees={this.state.packEventObject.attendees}/>
    //</TouchableOpacity>*/
        )        
    }

}

class PackModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.navigation.state.params.packUUID,
            packInformation: {},
            packEvents: [],
            currPackEventImage: "",
            currPackEventAttendees: [],
            currentUserIsPackLeader: false,
            createEventModalIsOpen: false,
            packInformationModalIsOpen: false,
            packMembersModalIsOpen: false,
            currDisplayedPackEvent: 0,
            currCarouselIndex: 0,
            isAttendingCurrEvent: false,
            currPackData: {},
            packRequestsModalIsVisible: false,
            packRequestsLength: 0,
            membersLength: 0,
            packRequests: [],
            packProfileImage: '',
        }
    }

    componentDidMount = async () => {
       await this.setupPackModal();
    }

    _navigateToPackChat = () => {
       const UUID = this.props.navigation.state.params.packUUID;
        this.props.navigation.navigate('PackChat', {
            packUUID: UUID
        })
    }

    setupPackModal = async () => {
       // await this.setState({ packUUID: this.props.navigation.state.params.packUUID}) //PROBLEM
        let packInformationIn, packEventsIn, isAttendingCurrEventIn

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(result => {
            packInformationIn = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.packUUID).then(packEvents => {
            if (packEvents == undefined || packEvents.length == 0)
            {
                packEventsIn = [];
            }
            else
            {
                packEventsIn = packEvents;
            }
        });

        if (packEventsIn.length > 0)
        {
            for (let i = 0; i < packEventsIn.length; i++)
            {
                await this.LUPA_CONTROLLER_INSTANCE.getPackEventImageFromUUID(packEventsIn[i].pack_event_uuid).then(result => {
                    packEventsIn[i].pack_event_photo_url = result;
                });
            }
        }  


        if (packEventsIn.length > 0)
        {
            await this.LUPA_CONTROLLER_INSTANCE.userIsAttendingPackEvent(packEventsIn[0].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid).then(result => {
                isAttendingCurrEventIn = result;
            })
        }

        await this.setState({ 
            packInformation: packInformationIn, 
            packEvents: packEventsIn, 
            currDisplayedPackEvent: packEventsIn[0], 
            packRequestsLength: packInformationIn.pack_requests.length, 
            membersLength: packInformationIn.pack_members.length,
            packRequests: packInformationIn.pack_requests,
            isAttendingCurrEvent: isAttendingCurrEventIn,
            packProfileImage: packProfileImageIn,
        })

       this.currentUserUUID = this.props.lupa_data.Users.currUserData.user_uuid;
       if (this.currentUserUUID == this.state.packInformation.pack_leader) { await this.setState({ currentUserIsPackLeader: true }) }
    }

    refreshPackModal = async () => {
        await this.setupPackModal();
    }

    refreshPackEvent = async () => {
        let packEventsIn;
        await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.packUUID).then(packEvents => {
            if (packEvents == undefined || packEvents.length == 0)
            {
                packEventsIn = [];
            }
            else
            {
                packEventsIn = packEvents;
            }

        });

        await this.setState({
            packEvents: packEventsIn
        })
    }

    checkUserEventAttendance = async (packEventUUID, packEventTitle, userUUID) => {
        let isAttendingCurrEventIn;

        await this.LUPA_CONTROLLER_INSTANCE.userIsAttendingPackEvent(packEventUUID, packEventTitle, userUUID).then(isAttendingCurrEvent => {
                 isAttendingCurrEventIn = isAttendingCurrEvent;
             });

        await this.setState({ isAttendingCurrEvent: isAttendingCurrEventIn });
        }

        handleAttendEventOption = async () => {
            let index = this.state.currCarouselIndex;
             await this.LUPA_CONTROLLER_INSTANCE.setUserAsAttendeeForEvent(this.state.packEvents[index].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid);
             await this.checkUserEventAttendance(this.state.packEvents[index].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid);
            }

        handleUnattendEventOption = async () => {
            let index = this.state.currCarouselIndex;
            await this.LUPA_CONTROLLER_INSTANCE.removeUserAsAttendeeForEvent(this.state.packEvents[index].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid)
            await this.checkUserEventAttendance(this.state.packEvents[index].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid); 
        }

    mapMembers = () => {
        /* This is an existing problem where you cannot access the pack_members field from packInformation..
        not sure why yet */

        return this.state.packInformation.pack_members && this.state.packInformation.pack_members.map(member => {
             return (
                <View style={{margin: 5}}>
                    <UserDisplayCard userUUID={member} />
                </View>
             )
        })
    }

    _renderPackEventCards = () => {
        return this.state.packEvents.map(eventObject => {
            return (
                    <PackEventCard currUserUUID={this.props.lupa_data.Users.currUserData.user_uuid} packEventObjectIn={eventObject} refreshData={this.refreshPackModal} />
                  );
        })
    }

    handleCreateEventModalClose = async () => {
        //this.refreshData()
       this.setState({ createEventModalIsOpen: false })
    }

    handleLeavePack = async () => {
        await this.props.leavePack(this.state.packUUID);
        await this.LUPA_CONTROLLER_INSTANCE.removeUserFromPackByUUID(this.state.packUUID, this.props.lupa_data.Users.currUserData.user_uuid);
        await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser("packs", [this.state.packUUID], "remove");
        await this.LUPA_CONTROLLER_INSTANCE.updatePack(this.state.packUUID, "pack_members", this.props.lupa_data.Users.currUserData.user_uuid, ["remove"]);
        this.props.navigation.goBack(null);
    }

    handlePackInformationModalClose = () => {
       this.setState({ packInformationModalIsOpen: false })
    }

    handlePackMembersModalClose = () => {
      this.setState({ packMembersModalIsOpen: false })
    }

    handlePackRequestModalClose = () => {
        this.setState({ packRequestsModalIsVisible: false  })
    }

    _renderMoreVert = () => {
        return this.state.currentUserIsPackLeader ?
        <View style={{flexDirection: 'row'}}>
            <IconButton icon="more-vert" color="#2196F3" size={20} onPress={() => this._showActionSheet()} />
            <View>
                
            <IconButton icon="notifications" color="#2196F3" size={20} onPress={() => this.setState({ packRequestsModalIsVisible: true })} />
            <Badge
    status="error"
    containerStyle={{ position: 'absolute', top: -4, right: -4 }}
    value={this.state.packRequestsLength}
  />
            </View>
        </View>

        : 
        null
    }

    renderPackEventsContent = () => {
        return this.state.packEvents.length == 0 ? <Text style={{fontSize: 20, fontWeight: 'bold', padding: 8}}> Your pack leader has not setup any events yet!  When they do events will appear here. </Text> :                         
                            <View style={{flexDirection: 'column', justifyContent: 'space-evenly'}}>
                                                            <Carousel shouldRasterizeIOS={true}
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.packEvents}
                            renderItem={this._renderItem}
                            sliderHeight={Dimensions.get('window').height / 4}
                            itemHeight={Dimensions.get('window').height / 2} 
                          onBeforeSnapToItem={itemIndex => this.handleOnSnapToItem(itemIndex)}
                          onSnapToItem={itemIndex => this.handleOnSnapToItem(itemIndex)}
                            vertical={true}
                            />
                            <Pagination vertical={true} dotsLength={this.state.packEvents.length} dotColor="#2196F3" activeDotIndex={this.state.currCarouselIndex} inactiveDotColor="black" />
                            </View>
}

getButtonColor = () => {
    if (this.state.packEvents.length == 0) { return 'grey' }
    return this.state.packEvents[this.state.currCarouselIndex].attendees.includes(this.props.lupa_data.Users.currUserData.user_uuid) ? "grey" : "#2196F3";
}

    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Create an Event', 'Delete Pack', 'Cancel'],
                cancelButtonIndex: 2,
            }, (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.setState({ createEventModalIsOpen: true });
                        break;
                    case 1:
                        //delete pack
                        break;
                    case 2:
                        break;
                    default:
                }
            });
    }

    render() {
        const buttonColors = this.getButtonColor();
        return (
                <SafeAreaView forceInset={{
                    bottom: 'never'
                }} style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 5}}>
                    <ScrollView>
                    <Headline style={{alignSelf: "center"}}>
                        {this.state.packInformation.pack_title}
                    </Headline>
                            

                    <View style={{ flex: 1, flexDirection: "column", }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={styles.header}>
                                Members
                </Text>
                            <Button mode="text" color="black" onPress={() => this.setState({ packMembersModalIsOpen: true })} disabled={false}>
                                View all
                </Button>
                        </View>
                        <View>
                        <ScrollView horizontal={true} shouldRasterizeIOS={true} overScrollMode="always" contentContainerStyle={{ alignItems: "flex-start", flexGrow: 2, justifyContent: 'flex-start', flexDirection: "row" }}>
                            {
                            this.mapMembers()
                        }
                        </ScrollView>
                        </View>
                    </View>
                    
                    <View style={{flex: 4, flexGrow: 5}}>
                    <Text style={styles.header}>
                               Upcoming Events
                    </Text>
                    <View style={{alignItems: "center"}}>
                    {
                        this._renderPackEventCards()
                    }
                    </View>
                    </View>
                    </ScrollView>
                    

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", width: '100%' }}>
                    {
                                    this._renderMoreVert()
                                }
                            <IconButton icon="info" onPress={() => this.setState({ packInformationModalIsOpen: true })}  color="#2196F3"/>
                            <IconButton icon="chat-bubble-outline"  color="#2196F3" onPress={this._navigateToPackChat}/>
                            <IconButton icon="arrow-back" onPress={() => this.props.navigation.goBack()} color="#2196F3" />
                            <IconButton icon="exit-to-app" color="black" onPress={this.handleLeavePack} color="black" disabled={this.state.packInformation.pack_isDefault} />
                        </View>

                        <CreateEvent refreshData={this.refreshPackModal} packUUID={this.state.packUUID} isOpen={this.state.createEventModalIsOpen} closeModalMethod={this.handleCreateEventModalClose} />
                    <PackInformationModal packUUID={this.state.packUUID} isOpen={this.state.packInformationModalIsOpen} closeModalMethod={this.handlePackInformationModalClose} />
                    <PackMembersModal isOpen={this.state.packMembersModalIsOpen} closeModalMethod={this.handlePackMembersModalClose} displayMembersMethod={this.mapMembers} packRequestsLength={this.state.packRequestsLength} packMembersLength={this.state.membersLength}/>
                    <PackRequestsModal refreshData={this.refreshPackModal} isOpen={this.state.packRequestsModalIsVisible} closeModalMethod={this.handlePackRequestModalClose} requestsUUIDs={this.state.packRequests} />
                    {/*
                    <Svg height={Dimensions.get('screen').height / 2} width={Dimensions.get('screen').width} style={{position: 'absolute', }}>
  <Ellipse
    cx={"55"}
    cy="100"
    rx={Dimensions.get('screen').width}
    ry={Dimensions.get('screen').height / 3}
    fill="#4b87b6"
  />
</Svg>
                    <View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <IconButton icon="clear" color="black" onPress={() => this.props.navigation.goBack()} />
                            <Text style={{
                                fontSize: 22,
                                fontWeight: "500",
                            }}>
                                {this.state.packInformation.pack_title}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {
                                    this._renderMoreVert()
                                }
                                <IconButton icon="chat-bubble-outline" color="black" onPress={() => this._navigateToPackChat(this.state.packUUID)} />
                            </View>
                        </View>
                    </View>


                    <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
                        {
                            this.renderPackEventsContent()
                        }
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", width: '100%' }}>
                            <TouchableOpacity disabled={this.state.isAttendingCurrEvent} onPress={() => this.handleAttendEventOption()}>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="map-pin" size={25} color={buttonColors} />
                            </Surface>
                    </TouchableOpacity>

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", width: '100%' }}>
                            <Button mode="outlined" color="#2196F3" onPress={() => this.setState({ packInformationModalIsOpen: true })}>
                                View Pack Information
                    </Button>

                            <Button mode="contained" color="#2196F3" onPress={this.handleLeavePack} disabled={this.state.packInformation.pack_isDefault}>
                                Leave Pack
                    </Button>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: "column", padding: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={styles.header}>
                                Members
                </Text>
                            <Button mode="text" color="black" onPress={() => this.setState({ packMembersModalIsOpen: true })} disabled={false}>
                                View all
                </Button>
                        </View>

                        <ScrollView horizontal={true} shouldRasterizeIOS={true} overScrollMode="always" contentContainerStyle={{ alignItems: "flex-start", flexGrow: 2, justifyContent: 'space-around', flexDirection: "row" }}>
                            {
                            this.mapMembers()
                        }
                        </ScrollView>



                    </View>

                    <CreateEvent refreshData={this.refreshPackModal} packUUID={this.state.packUUID} isOpen={this.state.createEventModalIsOpen} closeModalMethod={this.handleCreateEventModalClose} />
                    <PackInformationModal packUUID={this.state.packUUID} isOpen={this.state.packInformationModalIsOpen} closeModalMethod={this.handlePackInformationModalClose} />
                    <PackMembersModal isOpen={this.state.packMembersModalIsOpen} closeModalMethod={this.handlePackMembersModalClose} displayMembersMethod={this.mapMembers} packRequestsLength={this.state.packRequestsLength} packMembersLength={this.state.membersLength}/>
                    <PackRequestsModal refreshData={this.refreshPackModal} isOpen={this.state.packRequestsModalIsVisible} closeModalMethod={this.handlePackRequestModalClose} requestsUUIDs={this.state.packRequests} />
                    */}

                
                    </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        margin: 0,
        backgroundColor: "#FAFAFA",
    },
    membersModal: {
        flex: 1,
        margin: 0,
        padding: 10,
        alignItems: 'center'
    },
    flatUserCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    userInfo: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        flex: 1,
    },
    header: {
        fontSize: 20,
        fontFamily: "avenir-next-bold",
        padding: 10
    },
    event: {
        width: 100,
        height: 115,
        borderRadius: 10,
        elevation: 6,
        margin: 5,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "500",
        padding: 10,
    },
    online: {
        display: "flex",
        flex: 3,
    },
    members: {
        flex: 1,
    },
    events: {
        flex: 2,
    },
    iconStyle: {
        borderColor: "#2196F3",
        color: "#2196F3",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(PackModal));