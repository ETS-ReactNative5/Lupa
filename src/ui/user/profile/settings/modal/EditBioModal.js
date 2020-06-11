

import React, { useState, useEffect } from 'react';

import {
    Modal,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Dimensions
} from 'react-native';

import {
    Header,
    Container,
    Left,
    Body,
    Right,
} from 'native-base';

import {
    Button,
    IconButton,
    Title,
    TextInput,
    Caption,
    Divider,
    List,
    Switch,
    Appbar,
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import { useDispatch, useSelector} from 'react-redux';


import { withNavigation, NavigationActions, StackActions } from 'react-navigation';

import LupaController from '../../../../../controller/lupa/LupaController'

function EditBioModal(props) {
    //lupa controller instance
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    //redux dispatch hook
    const dispatch = useDispatch();

    //user bio from useSelector redux hook
    const currUserBio = useSelector(state => {
        return state.Users.currUserData.bio
    })

    //bio and setbio function from useState
    const [bioText, setBioText] = useState('');

    //use effect hook
    useEffect(() => {
        setBioText(currUserBio)
    }, [])

    /**
     * 
     */
    handleCloseModal = async () => {
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('bio', bioText, "");

        const PAYLOAD = getUpdateCurrentUserAttributeActionPayload('bio', bioText)

        await dispatch({ type: 'UPDATE_CURRENT_USER_ATTRIBUTE', payload: PAYLOAD });

        props.closeModalMethod();
    }


    return (
    <Modal presentationStyle="fullScreen" visible={props.isVisible} style={{backgroundColor: 'white'}}>
       <SafeAreaView style={{flex: 1}}>
        <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 0, alignItems: 'center'}}>
            <Appbar.BackAction onPress={() => props.closeModalMethod()}/>
            <Appbar.Content title="Biography" titleStyle={{fontFamily: 'ARSMaquettePro-Black', color: '#212121', fontSize: 20, fontWeight: '600', alignSelf: 'center'}}/>
            <Button theme={{colors: {
                primary: 'rgb(33,150,243)'
            }}}
            onPress={() => handleCloseModal()}>
                <Text>
                    Save
                </Text>
            </Button>
        </Appbar.Header>
       <View style={{padding: 10}}>
       <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 17}}>
            Write a biography
        </Text>
        <Caption>
           Tell users something about yourself.  Why did you join Lupa?  What are you hoping to accomplish on your fitness journey?  What are your fitness interest? Goals?
        </Caption>
       </View>

       <Divider style={{marginVertical: 10}} />

        <View style={{flex: 1}}>
        <TextInput maxLength={180} value={bioText} onChangeText={text => setBioText(text)} multiline placeholder="Edit your biography" style={{width: Dimensions.get('window').width - 20, height: '30%', alignSelf: 'center'}} mode="outlined" theme={{
            colors: {
                primary: 'rgb(33,150,243)'
            }
        }}>

</TextInput>
        </View>
        </SafeAreaView>
    </Modal>
    )
}

export default EditBioModal;