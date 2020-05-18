import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button,
    SafeAreaView,
    ScrollView
} from 'react-native';

import {
    Appbar, Divider, Avatar
} from 'react-native-paper';

import MessagePreview from './MessagePreview';


import { Input } from 'react-native-elements';

import { GiftedChat } from 'react-native-gifted-chat';

import { Fire } from '../../../controller/firebase/firebase';

import LupaController from '../../../controller/lupa/LupaController';

const ProfilePicture = require('../../images/profile_picture1.jpeg')

import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';

const mapStateToProps = state => {
    return {
        lupa_data: state,
    }
}


class MessagesView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: [],
            userMessageData: [],
            currMessagesIndex: undefined,
            inboxEmpty: true,
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this.setupUserMessageData();
      }

      setupUserMessageData = async () => {
          let currUserChats, userMessageDataIn = [];
        await this.LUPA_CONTROLLER_INSTANCE.getAllCurrentUserChats().then(chats => {
            currUserChats = chats;
        });

        if (currUserChats.length >= 1)
        {
            for (let i = 0; i < currUserChats.length; ++i)
            {
                await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(currUserChats[i].user).then(userData => {
                    userMessageDataIn.push(userData);
                });
            }
        }

        if (userMessageDataIn.length >= 1)
        {
            await this.setState({ userMessageData: userMessageDataIn, inboxEmpty: false })
        }
      }

      setupFire = async () => {
        //clear messages
        await this.setState({
            messages: [],
        })
        let privateChatUUID;
        try {
                    //check for shared chat uuid between users
        await this.LUPA_CONTROLLER_INSTANCE.getPrivateChatUUID(this.props.lupa_data.Users.currUserData.user_uuid, this.state.userMessageData[this.state.currMessagesIndex].user_uuid).then(result => {
            privateChatUUID = result;
        });
        }
        catch(err)
        {
            await this.setState({
                viewReady: false,
            })
        }

         //init Fire
        await Fire.shared.init(privateChatUUID);

        await Fire.shared.on(message =>
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
            viewReady: true,
          }))
        );
      }

      componentWillUnmount() {
        Fire.shared.off();
      }

      renderTextInput = () => {
          return (
              <Input editable={this.state.viewReady} />
          )
      }

      handleAvatarOnPress = async (avatarIndex) => {
        await this.setState({currMessagesIndex: avatarIndex })
        await this.setupFire();
      }

      renderAvatarList = () => {
          if (this.state.userMessageData)
          {
              if (this.state.userMessageData.length == 0)
              {
                return;
              }
              else
              {
               return this.state.userMessageData.map((userData, index, arr) => {
                    return (
                        <TouchableOpacity onPress={() => this.handleAvatarOnPress(index)}>
                          <Avatar.Image source={{uri: userData.photo_url}} key={index} size={32} style={{ elevation: 10, margin: 5 }}  />
                        </TouchableOpacity>
                    )
                })
              }
          }
        
      }


    render() {
        return (
            <View style={styles.root}>
                <Appbar.Header style={{elevation: 0, alignItems: "center"}} theme={{
                    colors: {
                        primary: 'white'
                    }
                }}>
                    <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
                    <Appbar.Content title="Messages" titleStyle={{fontFamily: "Avenir-Roman"}} />
                    <Appbar.Action onPress={() => alert('ap')} icon="delete" disabled={!this.state.viewReady && this.state.currMessagesIndex == undefined} color={!this.state.viewReady ? "black" : "grey"} />
                    <Appbar.Action onPress={() => alert('message')} icon="send" disabled={this.state.viewReady} color={this.state.viewReady ? "black" : "grey"} />

                </Appbar.Header>
                <View style={{backgroundColor: 'white', height: "auto", width: "100%", padding: 5}}>

<ScrollView horizontal contentContainerStyle={{alignItems: "center", justifyContent: 'flex-end'}} shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                {this.renderAvatarList()}
</ScrollView>
<View style={{width: "100%", flexDirection: "row", alignItems: "center",justifyContent: "space-between", padding: 5}}>
<Text style={{alignSelf: "flex-start", margin: 5, fontFamily: "avenir-roman"}}>
    
</Text>

<Text style={{fontFamily: "avenir-roman"}}>
    0 Unread
</Text>
</View>
</View>
<Divider />
{
    this.state.viewReady ? 
    <GiftedChat 
    messages={this.state.messages} 
    onSend={Fire.shared.send} 
    user={Fire.shared.getUser()} 
    showAvatarForEveryMessage={true} 
    placeholder="Begin typing here" 
    isTyping={true} 
    renderUsernameOnMessage={true}
    showUserAvatar={true}
    alwaysShowSend={true}

    />
    :
    <View style={{flex: 1, alignItems: "center", justifyContent: "center", padding: 20}}>
        <Text style={{fontSize: 25, fontFamily: "avenir-roman"}}>
            Your inbox is empty.  Compose a new message.
        </Text>
        </View>

}
                    <SafeAreaView />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    }
})

export default connect(mapStateToProps)(MessagesView);