/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Login View
 */
import React, { Component } from "react";

import { connect } from 'react-redux';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from "react-native";

import {
  Snackbar
} from 'react-native-paper';

import {
  Input, 
  Button as ElementsButton 
} from "react-native-elements";

import LupaController from '../../../controller/lupa/LupaController';

import { withNavigation } from 'react-navigation';

const {
  loginUser,
} = require('../../../controller/lupa/auth/auth');

/**
 * 
 */
mapStateToProps = (state, action) => {
  return {
    lupa_data: state
  }
}

/**
 * 
 */
mapDispatchToProps = dispatch => {
  return {
    updateUser: (currUserData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER',
        payload: currUserData
      })
    },
    updatePacks: (currUserPacksData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER_PACKS',
        payload: currUserPacksData,
      })
    },
    updateUserPrograms: (currUserProgramsData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER_PROGRAMS',
        payload: currUserProgramsData,
      })
    },
    updateUserServices: (currUserServicesData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER_SERVICES',
        payload: currUserServicesData,
      })
    },
    updateLupaWorkouts: (lupaWorkoutsData) => {
      dispatch({
        type: 'UPDATE_LUPA_WORKOUTS',
        payload: lupaWorkoutsData,
      })
    },
    updateLupaAssessments: (lupaAssessmentData) => {
      dispatch({
        type: 'UPDATE_LUPA_ASSESSMENTS',
        payload: lupaAssessmentData
      })
    }
  }
}

/**
 * 
 */
class LoginView extends Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    this.state = {
      username: 'newaccount12@gmail.com',
      password: 'Q9X638hs2Y78',
      secureTextEntry: true,
      showSnack: false,
      loginRejectReason: "",

    }

  }

  /**
   * 
   */
  _updateUserInRedux = (userObject) => {
    this.props.updateUser(userObject);
  }

  /**
   * 
   */
  _updatePacksInRedux = (packsData) => {
    this.props.updatePacks(packsData);
  }

  /**
   * 
   */
  _updateUserHealthDataInRedux = (healthData) => {
    this.props.updateHealthData(healthData);
  }

  /**
   * 
   */
  _updateUserProgramsDataInRedux = (programsData) => {
    this.props.updateUserPrograms(programsData);
  }

  /**
   * 
   */
  _updateUserServicesInRedux = (servicesData) => {
    this.props.updateUserServices(servicesData);
  }

  /**
   * 
   */
  _updateLupaWorkoutsDataInRedux = (lupaWorkoutsData) => {
    this.props.updateLupaWorkouts(lupaWorkoutsData);
  }

  /**
   * 
   */
  _updateLupaAssessmentDataInRedux = (lupaAssessmentData) => {
    this.props.updateLupaAssessments(lupaAssessmentData);
  }

  /**
   * 
   */
  _handleShowPassword = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry
    })
  }

  /**
   * 
   */
  onLogin = async (e) => {
    e.preventDefault();

    const attemptedUsername = this.state.username;
    const attemptedPassword = this.state.password;

    let successfulLogin;
    await loginUser(attemptedUsername, attemptedPassword).then(result => {
      successfulLogin = result;
    })

    if (successfulLogin) {
      this._introduceApp();
    } else {
      this.setState({
        loginRejectReason: 'Invalid Username or Password.  Try again.',
        showSnack: true
      })
    }
  }

  _onToggleSnackBar = () => this.setState(state => ({ showSnack: !state.showSnack }));

  _onDismissSnackBar = () => {
    this.setState({ showSnack: false });
  }

  /**
   * Introduce the application
   */
  _introduceApp = async () => {
    /*await this.props.navigation.navigate('App', {
      _setupRedux: this._setupRedux.bind(this)
    });*/
    await this._setupRedux();
    await this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
   // await authStateOnline();
    this.props.navigation.navigate('App');

  }

  /**
   * 
   */
  _setupRedux = async () => {
    let currUserData, currUserPacks, currUserHealthData, currUserPrograms, currUserServices, lupaWorkouts;
    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
      currUserHealthData = result;
    });

    await this.LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.loadCurrentUserServices().then(result => {
      currUserServices = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.loadWorkouts().then(result => {
      lupaWorkouts = result;
    });

    await this.LUPA_CONTROLLER_INSTANCE.loadAssessments().then(result => {
      lupaAssessments = result;
    })

    let userPayload = {
      userData: currUserData,
      healthData: currUserHealthData,
    }


    await this._updatePacksInRedux(currUserPacks);
    await this._updateUserInRedux(userPayload);
    await this._updateUserProgramsDataInRedux(currUserPrograms);
    await this._updateUserServicesInRedux(currUserServices);
    await this._updateLupaWorkoutsDataInRedux(lupaWorkouts);
    await this._updateLupaAssessmentDataInRedux(lupaAssessments);
  }

  render() {
    return (
      <SafeAreaView style={{ padding: 15, flex: 1, backgroundColor: 'rgb(244, 247, 252)', justifyContent: 'space-between' }}>
        <View style={styles.headerText}>
          <Text style={styles.welcomeBackText}>
            Welcome back,
                        </Text>
          <Text style={styles.signInText}>
            sign in to continue
                        </Text>
          <View style={styles.noAccountTextContainer}>
            <Text style={{ fontSize: 17, fontWeight: '500', color: "black" }}>
              Don't have an account?
        </Text>
            <Text>
              {" "}
            </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={{ fontSize: 17, fontWeight: '500', color: '#2196F3' }}>
                Sign up
          </Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ flex: 1, justifyContent: 'space-evenly', }}>
          <View style={{ width: '100%', margin: 5 }}>
            <Text style={styles.textLabel}>
              Email
                            </Text>
              <Input 
              placeholder="Enter an email address" 
              inputStyle={styles.inputStyle} 
              inputContainerStyle={{ borderBottomColor: '#545454', borderTopColor: "transparent", borderRightColor: "transparent", borderLeftColor: "transparent", borderBottomWidth: 2, padding: 0 }} 
              containerStyle={{ width: Dimensions.get('screen').width, borderRadius: 5, backgroundColor: 'transparent' }} 
              value={this.state.username} 
              editable={true}
              onChangeText={text => this.setState({username: text})}
              returnKeyType="default"
              keyboardType="default"
              />
          </View>

          <View style={{ width: '100%', margin: 5 }}>
            <Text style={styles.textLabel}>
              Password
                            </Text>

             <Input 
             placeholder="Enter a password" 
             inputStyle={styles.inputStyle} 
             inputContainerStyle={{ borderBottomColor: '#545454', borderTopColor: "transparent", borderRightColor: "transparent", borderLeftColor: "transparent", borderBottomWidth: 2, padding: 0 }} 
             containerStyle={{ width: '100%', borderRadius: 5, backgroundColor: 'transparent'  }} 
             containerStyle={{ width: Dimensions.get('screen').width, borderRadius: 5}} 
             value={this.state.password} 
             editable={true}
             onChangeText={text => this.setState({password: text})}
             returnKeyType="default"
             keyboardType="default"
              />
          </View>
          </View>





          <View style={{ alignSelf: 'center', width: '90%', flex: 1, justifyContent: 'center' }}>
          <ElementsButton
  title="Login"
  type="solid"
  raised
  style={{backgroundColor: "#2196F3", padding: 10, borderRadius: 12}}
  buttonStyle={{backgroundColor: 'transparent'}}
  onPress={this.onLogin}
  containerStyle={{borderRadius: 12}}
/>

<Snackbar
          style={{backgroundColor: '#212121'}}
          theme={{ colors: { accent: '#2196F3' }}}
          visible={this.state.showSnack}
          onDismiss={this._onDismissSnackBar}
          action={{
            label: 'Okay',
            onPress: () => this.setState({ showSnack: false }),
          }}
        >
          {this.state.loginRejectReason}
        </Snackbar>
          </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
          root: {
          flex: 1,
  },
  textLabel: {
          fontSize: 15,
    fontWeight: "600",
    color: '#424242',
    margin: 5
  },
  headerText: {
          marginTop: 15,
    padding: 10,
    flex: 1,
  },
  welcomeBackText: {
    fontSize: 35, fontWeight: '700', color: 'black', fontFamily: 'ARSMaquettePro-Regular'
  },
  signInText: {
    fontSize: 35, fontWeight: '700', color: '#2196F3', fontFamily: 'ARSMaquettePro-Regular'
  },
  noAccountTextContainer: {
    flexDirection: 'row', marginTop: 5
  },
  inputStyle: {
    fontWeight: '500', fontSize: 15
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(LoginView));
