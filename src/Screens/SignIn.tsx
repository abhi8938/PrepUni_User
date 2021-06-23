//TODO:
// Make the slider paginated view (done)
// Align the Slider and rest of view perfectly (done)
// give margins between views (done)
// attach listeners on signup and forgot password

import {
  Alert,
  BackHandler,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Height, width} from '../Constants/size';
import React, {FunctionComponent, useEffect, useState} from 'react';

import AlertModal from '../Components/modals/AlertModal';
import AuthHeader from '../Components/common/AuthHeader';
import ErrorScreen from '../Components/common/ErrorScreen';
import FVU from '../Components/modals/FVU';
import FVUModal from '../Components/modals/FVU';
import LogoModal from '../Components/modals/LogoModal';
import NetInfo from '@react-native-community/netinfo';
import {SafeAreaView} from 'react-native-safe-area-context';
import Slider from '../Components/Slider';
import Snackbar from 'react-native-snackbar';
import TextField from '../Components/common/TextField';
import Touchable from '../Components/common/Touchable';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {log} from 'react-native-reanimated';
import theme from '../Constants/theme';
import useAuthState from '../State/AuthState';

type props = {
  navigation: any;
  scene: any;
  page: string;
};

// Custom Slider Content ( Images and label)
const Slider_content = [
  {
    image: require('../Assets/images/study_session_report.png'),
    label: 'Smart Search',
  },
  {
    image: require('../../assets/images/annotations.png'),
    label: 'Bookmarks',
  },
  {
    image: require('../../assets/images/reminder.png'),
    label: 'Dictionary',
  },
  {
    image: require('../../assets/images/result.png'),
    label: 'Syllabus',
  },
  {
    image: require('../Assets/images/datesheet.png'),
    label: 'Datesheet',
  },
];

const SignIn: FunctionComponent<props> = ({navigation, scene, page}) => {
  const {
    logoModal,
    load,
    FVU,
    controls,
    login,
    SignIn,
    handleLogin,
    handleFVU,
    handleControls,
    VerifyCode,
    sendCodeMail,
    sendCodePhone,
    UdpatePassword,
    resetModal,
  } = useAuthState();
  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };
  const [netFail, setNetFail] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetFail(!state.isConnected);
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink((link) => {
      if (link) {
        console.log('referal', link.url.split('/')[3]);
      }
      setTimeout(() => {
        Snackbar.show({
          text: 'Referal Applied!',
          duration: Snackbar.LENGTH_SHORT,
        });
      }, 10);
      navigation.navigate('Signup', {referal: link.url.split('/')[3]});
    });
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          console.log('referal', link.url.split('/')[3]);
          setTimeout(() => {
            Snackbar.show({
              text: 'Referal Applied!',
              duration: Snackbar.LENGTH_SHORT,
            });
          }, 10);
          navigation.navigate('Signup', {referal: link.url.split('/')[3]});
        }
      });
    return () => unsubscribe();
  }, []);
  return (
    <ImageBackground
      source={require('../Assets/images/bg.png')}
      style={{
        flex: 1,
        paddingBottom: theme.SIZES.normal,
        backgroundColor: `${theme.COLORS.DEFAULT}`,
      }}
      resizeMode="cover"
      imageStyle={{opacity: 0.05}}>
      <SafeAreaView style={styles.parent}>
        <LogoModal show={logoModal} />
        <ErrorScreen show={netFail} navigation={navigation} scene={scene} />
        <View style={styles.parent}>
          <StatusBar
            backgroundColor={theme.COLORS.DEFAULT}
            barStyle={'dark-content'}
          />
          <AuthHeader pageTitle={'Sign In'} back={false} />

          <KeyboardAvoidingView
            enabled={true}
            behavior={Platform.OS === 'ios' ? 'position' : 'position'}
            style={{flex: 1}}
            contentContainerStyle={
              {
                // backgroundColor: theme.COLORS.DEFAULT,
              }
            }
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 19}>
            <Slider list={Slider_content} />
            <View style={styles.groupView}>
              <TextField
                inputProps={{
                  placeholder: 'Email / Contact / User Name',
                  value: login.id.text,
                  onChangeText: (text) => {
                    handleLogin('id', 'text', text);
                  },
                  onBlur: () => handleLogin('id', 'active', false),
                  onFocus: () => handleLogin('id', 'active', true),
                }}
                error={login.id.error_message}
              />
              <TextField
                inputProps={{
                  placeholder: 'Password',
                  value: login.password.text,
                  onChangeText: (text) => {
                    handleLogin('password', 'text', text);
                  },
                  onBlur: () => handleLogin('password', 'active', false),
                  onFocus: () => handleLogin('password', 'active', true),
                }}
                secureText={{
                  onToggle: () =>
                    handleLogin('password', 'show', !login.password.show),
                  hidden: login.password.show,
                }}
                error={login.password.error_message}
              />
            </View>
            <TouchableOpacity
              disabled={load}
              style={styles.forgotContainer}
              onPress={() => {
                handleControls('FVU', 'EMAIL');
              }}>
              <Text style={[styles.link, styles.text]}>Forgot password ?</Text>
            </TouchableOpacity>
            <View style={[styles.groupView, {alignItems: 'center'}]}>
              <Touchable
                loading={load}
                size={'LARGE'}
                filled={true}
                title={'Sign in'}
                touchableProps={{
                  onPress: () => SignIn(navigation),
                  disabled: load,
                }}
              />
            </View>
            <View
              style={[
                styles.rowContainer,
                styles.groupView,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 5,
                  justifyContent: 'center',
                },
              ]}>
              <Text style={styles.text}>Don't have an account ? </Text>
              <TouchableOpacity
                disabled={load}
                onPress={() => navigation.navigate('Signup')}>
                <Text
                  style={[
                    styles.link,
                    {
                      fontSize: theme.SIZES.normal + 5,
                      marginLeft: theme.SIZES.small / 2,
                    },
                  ]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <FVUModal
            load={load}
            show={controls.FVU == 'NONE' ? false : true}
            onRequest={() => resetModal()}
            type={controls.FVU}
            otp={{
              type: FVU.code.type,
              text: FVU.code.text,
              onChangeText: (otp) => handleFVU('code', 'text', otp),
              verifyOTP: () => VerifyCode(),
              onBlur: () => handleFVU('code', 'active', false),
              onFocus: () => handleFVU('code', 'active', true),
              resendOTP: () => {},
              error: FVU.code.error_message,
            }}
            email={{
              text: FVU.email.text,
              onChangeText: (email) => handleFVU('email', 'text', email),
              onBlur: () => handleFVU('email', 'active', false),
              sendOTP: (type) => {
                if (type === 'EMAIL') {
                  if (FVU.email.text.length === 0) {
                    return handleFVU(
                      'email',
                      'error_message',
                      'email is required',
                    );
                  }
                  if (FVU.email.error_message.length !== 0) {
                    return;
                  }
                  handleFVU('code', 'type', 'EMAIL-RESET');
                  sendCodeMail(FVU.email.text);
                } else if (type === 'PHONE') {
                  if (FVU.contact.text.length === 0) {
                    return handleFVU(
                      'contact',
                      'error_message',
                      'mobile number is required to send otp',
                    );
                  }
                  if (FVU.contact.error_message.length !== 0) {
                    return;
                  }
                  handleFVU('code', 'type', 'CONTACT-RESET');
                  sendCodePhone(FVU.contact.text);
                }
              },
              onFocus: () => handleFVU('email', 'active', true),
              error: FVU.email.error_message,
            }}
            contact={{
              text: FVU.contact.text,
              onChangeText: (email) => handleFVU('contact', 'text', email),
              onBlur: () => handleFVU('contact', 'active', false),
              onFocus: () => handleFVU('contact', 'active', true),
              error: FVU.contact.error_message,
            }}
            passwords={{
              password: {
                text: FVU.newPassword.text,
                onChangeText: (password) =>
                  handleFVU('newPassword', 'text', password),
                onBlur: () => handleFVU('newPassword', 'active', false),
                onFocus: () => handleFVU('newPassword', 'active', true),
                error: FVU.newPassword.error_message,
              },
              passwordAgain: {
                text: FVU.rePassword.text,
                onChangeText: (password) =>
                  handleFVU('rePassword', 'text', password),
                onBlur: () => handleFVU('rePassword', 'active', false),
                onFocus: () => handleFVU('rePassword', 'active', true),
                error: FVU.rePassword.error_message,
              },
              updatePassword: () => UdpatePassword(FVU.newPassword.text),
            }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  rowContainer: {
    width: '95%',
    alignItems: 'flex-end',
  },
  forgotContainer: {
    marginTop: theme.SIZES.small,
    alignSelf: 'flex-end',
    paddingHorizontal: theme.SIZES.small,
  },
  groupView: {
    paddingVertical: theme.SIZES.small,
    paddingHorizontal: theme.SIZES.small,
  },
  link: {
    fontSize: theme.SIZES.normal - 2,
    fontFamily: 'Signika-Medium',
    color: theme.COLORS.Links,
  },
  text: {
    fontSize: theme.SIZES.normal + 2,
    fontFamily: 'Signika-Regular',
  },
  SecondChild: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    width: '100%',
    // height: Height / 2.4,
  },
});
