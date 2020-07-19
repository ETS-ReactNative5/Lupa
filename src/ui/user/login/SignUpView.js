import React, { useState, useReducer, useCallback} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    KeyboardAvoidingView,
} from 'react-native';

import {
    Surface,
    Snackbar,
    ActivityIndicator,
    Divider,
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import { 
    CheckBox,
    Button as ElementsButton,
 } from 'react-native-elements';

 import { Constants } from 'react-native-unimodules';

 import * as authActions from '../../../controller/lupa/auth/auth'
 import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

 import FeatherIcon from 'react-native-vector-icons/Feather';
 import ThinFeatherIcon from "react-native-feather1s";

import { UserAuthenticationHandler } from '../../../controller/firebase/firebase'

import LupaController from '../../../controller/lupa/LupaController';

import { getLupaAssessmentStructure, getLupaUserStructure, getLupaPackEventStructure, getLupaPackStructure } from '../../../controller/firebase/collection_structures'
import { connect, useDispatch } from 'react-redux';

import Input from '../../common/Input/Input'
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const SignUp = props => {

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      username: '',
    },
    inputValidies: {
      email: false,
      password: false,
      username: '',
    },
    formIsValid: false,
  })

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

   /**
   * Sets up redux by loading the current user's data, packs, and programs
   * as well as Lupa application data (assessments, workouts);
   */
  const _setupRedux = async () => {
    let currUserData = getLupaUserStructure(), currUserPacks = getLupaPackStructure(), currUserPrograms = getLupaProgramInformationStructure(), lupaAssessments = [], lupaWorkouts = [];
    
    await LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })


    await LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })


    lupaWorkouts = await LUPA_CONTROLLER_INSTANCE.loadWorkouts();

    lupaAssessments = await LUPA_CONTROLLER_INSTANCE.loadAssessments();

    let userPayload = {
      userData: currUserData,
      healthData: {}
    }

    await dispatch({ type: 'UPDATE_CURRENT_USER', payload: userPayload})
    await dispatch({ type: 'UPDATE_CURRENT_USER_PACKS', payload: currUserPacks})
    await dispatch({ type: 'UPDATE_CURRENT_USER_PROGRAMS', payload: currUserPrograms})
    await dispatch({ type: 'UPDATE_LUPA_WORKOUTS', payload: lupaWorkouts})
    await dispatch({ type: 'UPDATE_LUPA_ASSESSMENTS', payload: lupaAssessments})
    console.log(userPayload)
  }

  const signupHandler = async () => {
    await dispatch(authActions.signup(formState.inputValues.username.trim(), formState.inputValues.email.trim(), formState.inputValues.password.trim()));
    navigation.navigate('Onboarding')
    await _setupRedux()
  }

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: inputValue,
      isValid: inputValidity,
      input: inputIdentifier
    })
  },
  [dispatchFormState]
  );

  const { navigation } = props

  return (
    <View style={{flex: 1, backgroundColor: 'white', }}>
    <KeyboardAvoidingView 
    behavior="padding"
    keyboardVerticalOffset={50}
    style={styles.keyboardAvoidingView}>
      <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{justifyContent: 'space-between', flexGrow: 2}}>
          <View style={{marginTop: Constants.statusBarHeight, width: "100%"}}>
          <View style={styles.headerText}>
                    <Text style={{fontSize: 28, fontWeight: '700', color: 'black',   }}>
            Create an account
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={{fontSize: 13, fontWeight: '500', color: 'rgb(142, 142, 147)'}}>
          Already have an account?
        </Text>
        <Text>
          {" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{fontSize: 13, fontWeight: '500', color: '#1565C0'}}>
            Sign In
          </Text>
        </TouchableOpacity>
        </View>
        </View>
        </View>

            <Input 
              id="email" 
              label="E-Mail" 
              keyboardType="email-address" 
              required 
              email 
              autoCapitalize={false} 
              errorMessage="Please enter a valid email address" 
              onInputChange={inputChangeHandler}
              initialValue=''
            
               />
            <Input 
              id="username" 
              label="Username" 
              keyboardType="default" 
              required 
              minLength={5} 
              autoCapitalize={false} 
              errorMessage="Please enter a valid username" 
              onInputChange={inputChangeHandler}
              initialValue='' />

            <Input 
              id="password" 
              label="Password" 
              keyboardType="default" 
              secureTextEntry 
              required 
              minLength={5} 
              autoCapitalize={false} 
              errorMessage="Please enter a valid password." 
              onInputChange={inputChangeHandler}
              initialValue='' />
            
            <Input id="confirm-password" 
              label="Confirm Password" 
              keyboardType="default" 
              secureTextEntry 
              required 
              minLength={5} 
              autoCapitalize={false} 
              errorMessage="The passwords do not match!" 
              onInputChange={inputChangeHandler}
              initialValue='' />


<View style={{margin: 10}}>
                        <CheckBox
                                center
                                title='I agree to the Terms of Service and Privacy Policy.'
                                iconRight
                                iconType='material'
                                checkedIcon='done'
                                uncheckedIcon='check-box-outline-blank'
                                checkedColor='check-box'
                                containerStyle={{backgroundColor: 'transparent', padding: 15, borderColor: 'transparent'}}
                                checked={agreedToTerms}
                                onPress={() => setAgreedToTerms(!agreedToTerms)}
                            />
  
                        </View>  
          
            <View style={{marginTop: 15, justifyContent: 'flex-end', width: '100%', alignSelf: 'center'}}>
                        <ElementsButton
  title="Create Account"
  type="solid"
  raised
  style={{width: Dimensions.get('window').width, backgroundColor: "#1565C0", padding: 10, borderRadius: 0}}
  buttonStyle={{backgroundColor: 'transparent'}}
  containerStyle={{borderRadius: 0}}
  onPress={signupHandler}
  disabled={false}
/>
                        </View>
          </ScrollView>
          <Divider />
      </View>
    </KeyboardAvoidingView>  
    <SafeAreaView style={{backgroundColor: '#1565C0', height: Constants.statusBarHeight}} /> 
    </View>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  headerText: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center'
},
})

export default SignUp;