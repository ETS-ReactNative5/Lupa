import React from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';

import {
    IconButton,
    Surface,
    Caption,
    Button,
    TextInput
} from 'react-native-paper';

import { Feather as FeatherIcon } from '@expo/vector-icons';
import SafeAreaView from 'react-native-safe-area-view';

import { Input } from 'react-native-elements';

import { GiftedChat } from 'react-native-gifted-chat';

import { LUPA_DB_FIREBASE, Fire } from '../../../controller/firebase/firebase';

import LupaController from '../../../controller/lupa/LupaController';


export default class PackChatModal extends React.Component{
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        const thisUserUUID = this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;

        this.state = {
            packUUID: this.props.packUUID,
            userUUID: thisUserUUID,
            messages: [],
            userAvatar: '',
            userDisplayName: '',
        }
    }

    
    componentDidMount() {
        this.setupFire();
      }

      setupFire = async () => {
        await Fire.shared.init(this.state.packUUID);

        await Fire.shared.on(message =>
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
          }))
        );
      }

      componentWillUnmount() {
        Fire.shared.off();
      }

      renderTextInput = () => {
          return (
              <Input />
          )
      }


    render() {
        let pageIndex = this.state.currentIndex;
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isOpen} style={styles.modalContainer}>
                    <GiftedChat 
                    messages={this.state.messages} 
                    onSend={Fire.shared.send} 
                    user={Fire.shared.getUser()} 
                    showAvatarForEveryMessage={true} 
                    placeholder="Send a message to your pack!" 
                    isTyping={true} 
                    renderUsernameOnMessage={true} 
                    />
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "#FAFAFA",
        flex: 1,
    },
});