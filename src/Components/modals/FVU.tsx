import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Height, width} from '../../Constants/size';
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import TextField from '../../Components/common/TextField';
import Touchable from '../common/Touchable';
import baseStyles from '../common/styles';
import image from '../../Assets/images/fvu_image.png';
import theme from '../../Constants/theme';

//@ts-ignore

type props = {
  show: boolean;
  onRequest: () => void;
  type: 'EMAIL' | 'OTP' | 'PASSWORD' | 'NONE' | string;
  email?: {
    text: string;
    onChangeText: (text: string) => void;
    sendOTP: (type: string) => void;
    onBlur: () => void;
    onFocus: () => void;
    error: string;
  };
  contact?: {
    text: string;
    onChangeText: (text: string) => void;
    onBlur: () => void;
    onFocus: () => void;
    error: string;
  };
  otp: {
    text: string;
    onChangeText: (text: string) => void;
    verifyOTP: () => void;
    resendOTP: () => void;
    type: 'EMAIL-VERIFY' | 'CONTACT-VERIFY' | string;
    onBlur: () => void;
    onFocus: () => void;
    error: string;
  };
  passwords?: {
    password: {
      text: string;
      onChangeText: (text: string) => void;
      onBlur: () => void;
      onFocus: () => void;
      error: string;
    };
    passwordAgain: {
      text: string;
      onChangeText: (text: string) => void;
      onBlur: () => void;
      onFocus: () => void;
      error: string;
    };
    updatePassword: () => void;
  };
  load: boolean;
};

const FVU: FunctionComponent<props> = ({
  show,
  onRequest,
  type,
  email,
  contact,
  otp,
  passwords,
  load,
}) => {
  const renderEmail = () => {
    return (
      email && (
        <View style={styles.parent}>
          <Icon
            name={'close'}
            size={37}
            style={{position: 'absolute', top: 8, right: 14}}
            onPress={() => {
              onRequest();
            }}
          />
          <Image
            style={styles.image}
            resizeMode="contain"
            resizeMethod="auto"
            source={image}
          />
          <TextField
            style={styles.inputBox}
            inputProps={{
              placeholder: 'Email',
              onChangeText: email.onChangeText,
              value: email.text,
              onBlur: email.onBlur,
              onFocus: email.onFocus,
            }}
            error={email.error}
          />
          {contact && (
            <TextField
              style={styles.inputBox}
              inputProps={{
                placeholder: 'Mobile Number',
                value: contact.text,
                onChangeText: contact.onChangeText,
                onBlur: contact.onBlur,
                onFocus: contact.onFocus,
              }}
              error={contact.error}
            />
          )}

          <View style={styles.rowContainer}>
            <Pressable
              onPress={() => email.sendOTP('EMAIL')}
              style={styles.button}
              disabled={false}>
              <Text
                style={[
                  baseStyles.text,
                  {fontSize: theme.SIZES.small + 3, color: theme.COLORS.WHITE},
                ]}>
                email
              </Text>
            </Pressable>

            <Text
              style={[
                baseStyles.text,
                {marginHorizontal: theme.SIZES.small / 2, marginTop: 5},
              ]}>
              OR
            </Text>
            <Pressable
              onPress={() => email.sendOTP('PHONE')}
              style={styles.button}
              disabled={false}>
              <Text
                style={[
                  baseStyles.text,
                  {fontSize: theme.SIZES.small + 3, color: theme.COLORS.WHITE},
                ]}>
                sms
              </Text>
            </Pressable>
          </View>
        </View>
      )
    );
  };

  const renderOTP = () => {
    const otpRef = useRef(null);
    const [timer, setTimer] = useState(60);
    const [resend, setResend] = useState(false);
    const countDown = () => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setResend(true);
      }
    };
    useEffect(() => {
      setTimeout(countDown, 1000);
    }, [timer]);

    useEffect(() => {
      if (load === false) {
        setResend(false);
        setTimer(60);
      }
    }, [load]);

    useEffect(() => {
      otpRef.current?.focus();
    }, []);

    return (
      <View style={styles.parent}>
        <Icon
          name={'close'}
          size={37}
          style={{position: 'absolute', top: 8, right: 14}}
          onPress={() => {
            onRequest();
          }}
        />
        <Image
          style={styles.image}
          resizeMode="contain"
          resizeMethod="auto"
          source={image}
        />
        <TextField
          style={styles.inputBox}
          inputProps={{
            ref: otpRef,
            placeholder: 'OTP',
            onChangeText: otp.onChangeText,
            value: otp.text,
            onBlur: otp.onBlur,
            onFocus: otp.onFocus,
            keyboardType: 'numeric',
            maxLength: 6,
          }}
          error={otp.error}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: theme.SIZES.normal * 1.5,
          }}>
          <Touchable
            style={styles.button}
            loading={false}
            filled
            title={'Verify'}
            size={'MEDIUM'}
            touchableProps={{onPress: otp.verifyOTP, disabled: false}}
          />
          {!resend && (
            <Text style={{marginLeft: 20, fontSize: 15}}>
              {timer > 9 ? `0:${timer}` : `0:0${timer}`}
            </Text>
          )}
          {resend &&
            (load === true ? (
              <ActivityIndicator
                style={{
                  marginVertical: theme.SIZES.small / 1.5,
                  marginLeft: theme.SIZES.normal,
                }}
                size={Platform.OS === 'ios' ? 40 : 30}
                color={theme.COLORS.PRIMARY}
              />
            ) : (
              <Touchable
                style={styles.button}
                loading={false}
                filled
                title={'Resend'}
                size={'MEDIUM'}
                touchableProps={{onPress: otp.resendOTP, disabled: load}}
              />
            ))}
        </View>
      </View>
    );
  };

  const renderPassword = () => {
    return (
      passwords && (
        <View style={[styles.parent, baseStyles.shadow]}>
          <Icon
            name={'close'}
            size={37}
            style={{position: 'absolute', top: 8, right: 14}}
            onPress={() => {
              onRequest();
            }}
          />
          <Image
            style={styles.image}
            resizeMode="contain"
            resizeMethod="auto"
            source={image}
          />

          <TextField
            style={styles.inputBox}
            inputProps={{
              placeholder: 'Password',
              onChangeText: passwords.password.onChangeText,
              value: passwords.password.text,
              onBlur: passwords.password.onBlur,
              onFocus: passwords.password.onFocus,
            }}
            error={passwords.password.error}
          />
          <TextField
            style={styles.inputBox}
            inputProps={{
              placeholder: 'confirm Password',
              onChangeText: passwords.passwordAgain.onChangeText,
              value: passwords.passwordAgain.text,
              onBlur: passwords.passwordAgain.onBlur,
              onFocus: passwords.passwordAgain.onFocus,
            }}
            error={passwords.passwordAgain.error}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: theme.SIZES.normal,
            }}>
            <Touchable
              style={styles.button}
              filled
              loading={false}
              touchableProps={{
                onPress: passwords.updatePassword,
                disabled: false,
              }}
              title="Update"
              size={'MEDIUM'}
            />
          </View>
        </View>
      )
    );
  };

  return (
    <Modal
      testID={'modal'}
      backdropOpacity={0.8}
      backdropColor={theme.COLORS.WHITE}
      isVisible={type === 'NONE' ? false : true}
      animationInTiming={400}
      backdropTransitionInTiming={400}
      backdropTransitionOutTiming={400}
      onBackdropPress={() => onRequest()}
      animationOutTiming={500}>
      <KeyboardAvoidingView enabled behavior={'position'}>
        {type === 'EMAIL' ? renderEmail() : null}
        {type === 'OTP' ? renderOTP() : null}
        {type === 'UPDATE' ? renderPassword() : null}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default FVU;

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: theme.SIZES.normal,
    paddingVertical: theme.SIZES.small,
    backgroundColor: theme.COLORS.LIGHT_GREY,
    width: width * 0.9,
    maxWidth: 500,
    borderRadius: theme.SIZES.small,
  },
  inputBox: {
    width: '100%',
    marginTop: theme.SIZES.normal * 1.5,
  },
  text: {
    fontSize: 17,
  },
  // button: {
  //   marginTop: theme.SIZES.normal,
  //   // borderRadius:50
  // },
  image: {
    width: width * 0.4,
    height: width * 0.5,
    aspectRatio: 1,
    marginTop: theme.SIZES.large * 2,
    alignSelf: 'center',
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.SIZES.normal,
    paddingHorizontal: theme.SIZES.small,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.small / 1.2,
    paddingVertical: theme.SIZES.small / 2,
    marginTop: theme.SIZES.small / 2,
    marginHorizontal: theme.SIZES.small,
    borderRadius: 9,
    elevation: 3,
    backgroundColor: theme.COLORS.ACTIVE,
    textAlign: 'center',
  },
  check: {
    zIndex: 1,
    elevation: 2,
    marginHorizontal: theme.SIZES.small,
  },
});
