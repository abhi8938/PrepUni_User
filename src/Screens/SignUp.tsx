import {
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FunctionComponent, useEffect} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import AgreementModal from '../Components/modals/AgreementModal';
import AlertModal from '../Components/modals/AlertModal';
import AuthHeader from '../Components/common/AuthHeader';
import {CheckBox} from 'react-native-elements';
import DateInput from '../Components/DateInput';
import FVUModal from '../Components/modals/FVU';
import {Height} from '../Constants/size';
import Icon from '../Components/common/Icon';
import LogoModal from '../Components/modals/LogoModal';
import SignupDropdown from '../Components/SignupDropdown';
import TextField from '../Components/common/TextField';
import Touchable from '../Components/common/Touchable';
import VerificationInput from '../Components/common/VerificationInput';
import baseStyles from '../Components/common/styles';
import theme from '../Constants/theme';
import useAuthState from '../State/AuthState';

type props = {
  navigation: any;
  route: any;
};
const gender = [
  {
    label: 'male',
    value: 'Male',
  },
  {
    label: 'female',
    value: 'Female',
  },
  {
    label: 'others',
    value: 'Others',
  },
  {
    label: 'rathernotsay',
    value: 'Rather Not Say',
  },
];
const FirstPage = ({register, handleRegister}: any) => {
  const renderGender = () => (
    <View style={styles.genderContainer}>
      <Text
        style={[
          baseStyles.text,
          {fontSize: theme.SIZES.normal + 7, marginLeft: theme.SIZES.small / 2},
        ]}>
        Select Gender
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          paddingVertical: theme.SIZES.small / 2,
        }}>
        {gender.map((item, index) => (
          <Pressable
            key={`${item}-${index + 1}`}
            onPress={() =>
              handleRegister('gender', 'text', item.value.toUpperCase())
            }
            style={[
              styles.togglePress,
              register.gender.text === item.value.toUpperCase() &&
                styles.toggleActive,
            ]}>
            <Text
              style={[
                styles.toggleText,
                register.gender.text === item.value.toUpperCase() &&
                  styles.toggleActive,
              ]}>
              {item.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
  return (
    <View style={styles.viewContainer}>
      <View>
        <TextField
          inputProps={{
            placeholder: 'First Name',
            value: register.first_name.text,
            onChangeText: (text) => handleRegister('first_name', 'text', text),
            onBlur: () => handleRegister('first_name', 'active', false),
            onFocus: () => handleRegister('first_name', 'active', true),
          }}
          error={register.first_name.error_message}
        />
        <TextField
          inputProps={{
            placeholder: 'Last Name',
            value: register.last_name.text,
            onChangeText: (text) => handleRegister('last_name', 'text', text),
            onBlur: () => handleRegister('last_name', 'active', false),
            onFocus: () => handleRegister('last_name', 'active', true),
          }}
          error={register.last_name.error_message}
        />
        <TextField
          inputProps={{
            placeholder: 'User Name',
            value: register.user_name.text,
            onChangeText: (text) => handleRegister('user_name', 'text', text),
            onBlur: () => handleRegister('user_name', 'active', false),
            onFocus: () => handleRegister('user_name', 'active', true),
          }}
          error={register.user_name.error_message}
        />
      </View>
      <View style={{marginTop: theme.SIZES.large}}>{renderGender()}</View>
    </View>
  );
};
const SecondPage = ({
  register,
  handleRegister,
  handleFVU,
  sendCodeMail,
  sendCodePhone,
  load,
}: any) => {
  return (
    <SafeAreaView style={styles.viewContainer}>
      <DateInput
        setdob={(dob) => {
          if (dob > new Date() || dob.getFullYear() < 1989)
            return handleRegister(
              'dob',
              'error_message',
              'Invalid Date of birth',
            );
          handleRegister('dob', 'text', dob);
        }}
      />
      <View style={{}}>
        <TextField
          inputProps={{
            placeholder: 'Email',
            value: register.email.text,
            onChangeText: (text) => {
              handleRegister('email', 'text', text);
            },
            onBlur: () => handleRegister('email', 'active', false),
            onFocus: () => handleRegister('email', 'active', true),
            editable: !register.email.verified,
          }}
          error={register.email.error_message}
        />
        <TextField
          inputProps={{
            placeholder: 'Mobile Number',
            value: register.contact.text,
            onChangeText: (text) => {
              handleRegister('contact', 'text', text);
            },
            onBlur: () => handleRegister('contact', 'active', false),
            onFocus: () => handleRegister('contact', 'active', true),
            editable: !register.contact.verified,
            maxLength: 10,
          }}
          error={register.contact.error_message}
        />

        <VerificationInput
          load={load}
          verified={
            register.email.verified === true ||
            register.contact.verified === true
          }
          onVerify={(type) => {
            if (type === 'EMAIL') {
              if (register.email.text.length === 0) {
                return handleRegister(
                  'email',
                  'error_message',
                  'email is required',
                );
              }
              if (register.email.error_message.length !== 0) {
                return;
              }
              handleFVU('code', 'type', 'EMAIL-VERIFY');
              sendCodeMail(register.email.text);
            } else if (type === 'PHONE') {
              if (register.contact.text.length === 0) {
                return handleRegister(
                  'contact',
                  'error_message',
                  'mobile number is required to send otp',
                );
              }
              if (register.contact.error_message.length !== 0) {
                return;
              }
              handleFVU('code', 'type', 'CONTACT-VERIFY');
              sendCodePhone(register.contact.text);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};
const ThirdPage = ({
  register,
  handleRegister,
  getUniversities,
  lists,
  getPrograms,
  getSems,
  handleLists,
}: any) => {
  //TODO: fetch university, college, course, semester - store in state
  //TODO: handleThirdPage Selections depending on previous select
  //TODO: NEXT PAGE
  const getName = (type: string, id: string) => {
    let data = lists[type];
    data = data.filter((item: any) => item._id == id);
    if (data.length !== 0) {
      return data[0].name;
    } else {
      return '';
    }
  };
  useEffect(() => {
    getUniversities();
  }, []);
  return (
    <ScrollView
      style={{
        maxHeight: Height * 0.7,
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: theme.SIZES.small,
        borderColor: theme.COLORS.PRICE_COLOR,
        paddingVertical: theme.SIZES.small / 3,
      }}
      contentContainerStyle={{}}>
      <Text
        style={[
          baseStyles.text,
          {
            alignSelf: 'center',
            fontSize: theme.SIZES.small + 3,
            width: '85%',
            textAlign: 'center',
            color: theme.COLORS.BLACK,
            marginVertical: theme.SIZES.large,
          },
        ]}>
        This information is required to provide you study material according to
        your program.
      </Text>
      <SignupDropdown
        disabled={!(lists.universities && lists.universities.length != 0)}
        onToggle={() => handleRegister('university', 'error_message', '')}
        error={register.university.error_message}
        selected={getName('universities', register.university.text)}
        list={lists.universities}
        label={'University'}
        icon={'UNIVERSITY'}
        onSelected={(selected) => {
          handleLists('semesters', []);
          handleRegister('university', 'text', selected);
          handleRegister('program', 'text', '');
          handleRegister('semester', 'text', '');
          getPrograms(selected);
        }}
      />
      <View style={[styles.collegeContainer]}>
        <Icon
          type={'COLLEGE'}
          size={1.6}
          style={{
            width: '12%',
            marginHorizontal: theme.SIZES.small / 1.5,
          }}
        />
        <View>
          <TextField
            style={{width: '94%'}}
            inputProps={{
              placeholder: 'College',
              value: register.college.text,
              onChangeText: (text) => handleRegister('college', 'text', text),
              onBlur: () => handleRegister('college', 'active', false),
              onFocus: () => handleRegister('college', 'active', true),
            }}
            error={register.college.error_message}
          />
        </View>
      </View>
      <SignupDropdown
        onToggle={() => handleRegister('program', 'error_message', '')}
        disabled={register.university.text.length == 0}
        error={register.program.error_message}
        label={'program'}
        selected={getName('programs', register.program.text)}
        list={lists.programs}
        icon={'COURSE'}
        onSelected={(selected) => {
          handleRegister('program', 'text', selected);
          handleRegister('semester', 'text', '');
          getSems(selected);
        }}
      />
      <SignupDropdown
        onToggle={() => handleRegister('semester', 'error_message', '')}
        error={register.semester.error_message}
        disabled={register.program.text.length == 0}
        label={
          getName('universities', register.university.text) ===
          'Rajasthan University'
            ? 'Year'
            : 'Semester'
        }
        selected={getName('semesters', register.semester.text)}
        list={lists.semesters}
        icon={'SEMESTER'}
        onSelected={(selected) =>
          handleRegister('semester', 'text', selected.toString())
        }
      />
    </ScrollView>
  );
};
const FourthPage = ({
  register,
  handleRegister,
  controls,
  handleControls,
  policies,
  selectPolicy,
}: any) => {
  const openLink = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Open url error');
      }
    });
  };

  return (
    <View
      style={[
        styles.viewContainer,
        {justifyContent: 'space-between', marginVertical: theme.SIZES.large},
      ]}>
      <View style={{}}>
        <TextField
          inputProps={{
            placeholder: 'Password',
            value: register.password.text,
            onChangeText: (text) => {
              handleRegister('password', 'text', text);
            },
            onBlur: () => handleRegister('password', 'active', false),
            onFocus: () => handleRegister('password', 'active', true),
          }}
          secureText={{
            onToggle: () =>
              handleRegister('password', 'show', !register.password.show),
            hidden: register.password.show,
          }}
          error={register.password.error_message}
        />
        <TextField
          inputProps={{
            placeholder: 'Re-enter Password',
            value: register.password_again.text,
            onChangeText: (text) => {
              handleRegister('password_again', 'text', text);
            },
            onBlur: () => handleRegister('password_again', 'active', false),
            onFocus: () => handleRegister('password_again', 'active', true),
          }}
          secureText={{
            onToggle: () =>
              handleRegister(
                'password_again',
                'show',
                !register.password_again.show,
              ),
            hidden: register.password_again.show,
          }}
          error={register.password_again.error_message}
        />
      </View>
      <View style={styles.checkBoxes}>
        <View style={styles.NameContainer}>
          <CheckBox
            checkedColor={theme.COLORS.ACTIVE}
            containerStyle={styles.headCheckBox}
            disabled={false}
            checked={controls.tnc}
            onPress={() => handleControls('tnc', !controls.tnc)}
          />
          <Text style={styles.head_text}>
            <Text style={{color: theme.COLORS.HEADER}}>I hereby, </Text>Read and
            Accept All Conditions and Policies{' '}
            <Text style={{color: theme.COLORS.HEADER}}>
              presented by PrepUni
            </Text>
          </Text>
        </View>
        <View style={styles.linkContainer}>
          <View
            style={{
              marginTop: -64,
              backgroundColor: theme.COLORS.HEADER,
              height: 200,
              width: 1.5,
            }}
          />
          <View>
            {policies.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  marginStart: -0.5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 30,
                }}>
                <View
                  style={{
                    backgroundColor: theme.COLORS.HEADER,
                    height: 1.5,
                    width: 12,
                  }}
                />
                <Text style={styles.link} onPress={() => openLink(item.link)}>
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
const SignUp: FunctionComponent<props> = ({navigation, route}) => {
  const {
    load,
    handlePageChange,
    controls,
    handleRegister,
    handleControls,
    FVU,
    handleFVU,
    VerifyCode,
    sendCodeMail,
    sendCodePhone,
    SignUp,
    alert,
    handleAlert,
    lists,
    getPrograms,
    getUniversities,
    getSems,
    logoModal,
    resetModal,
    resetRegister,
    register,
    policies,
    selectPolicy,
    handleLists,
    setReferralCode,
  } = useAuthState();
  // const test = useAuthState();
  // let data = test.register;
  // const [register, setRegister] = useState(returnRegister());
  // useEffect(() => {
  //   console.log(register);
  //   setRegister(returnRegister());
  // }, [data]);
  useEffect(() => {
    if (route.params?.referal) {
      console.log('params', route.params.referal);
      setReferralCode(route.params.referal);
    }
  }, [route.params]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.COLORS.WHITE,
      }}>
      <ImageBackground
        source={require('../Assets/images/bg.png')}
        style={{
          flex: 1,

          paddingBottom: theme.SIZES.normal,
        }}
        resizeMode="cover"
        imageStyle={{opacity: 0.03}}>
        <StatusBar
          backgroundColor={theme.COLORS.DEFAULT}
          barStyle={'dark-content'}
        />
        <AuthHeader
          back={controls.page === 1 ? true : false}
          pageTitle={'Sign In'}
          navigation={navigation}
        />

        <KeyboardAvoidingView
          enabled={controls.page === 4 ? false : true}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 0.95}}
          contentContainerStyle={{
            backgroundColor: theme.COLORS.DEFAULT,
          }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0}>
          {controls.page === 1 ? (
            <FirstPage register={register} handleRegister={handleRegister} />
          ) : null}
          {controls.page === 2 ? (
            <SecondPage
              register={register}
              handleRegister={handleRegister}
              handleFVU={handleFVU}
              sendCodeMail={sendCodeMail}
              sendCodePhone={sendCodePhone}
              load={load}
            />
          ) : null}
          {controls.page === 3 ? (
            <ThirdPage
              register={register}
              handleRegister={handleRegister}
              getUniversities={getUniversities}
              getPrograms={getPrograms}
              getSems={getSems}
              lists={lists}
              handleLists={handleLists}
            />
          ) : null}
          {controls.page === 4 ? (
            <FourthPage
              register={register}
              handleRegister={handleRegister}
              controls={controls}
              handleControls={handleControls}
              policies={policies}
              selectPolicy={selectPolicy}
            />
          ) : null}
        </KeyboardAvoidingView>

        <View style={styles.buttonContainer}>
          <Touchable
            touchableProps={{
              onPress: () => handlePageChange('PREVIOUS'),
              disabled: load,
            }}
            loading={false}
            filled={true}
            title={'Previous'}
            size={'LARGE'}
            style={{width: '30%'}}
          />

          <TouchableOpacity
            onPress={() => resetRegister()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: theme.SIZES.small / 1.1,
              paddingVertical: theme.SIZES.small / 1.1,
              marginVertical: theme.SIZES.small,
              marginHorizontal: theme.SIZES.small,
              borderRadius: 50,
              elevation: 3,
              backgroundColor: theme.COLORS.PRIMARY,
            }}>
            <Icon type={'RESET'} size={0.9} />
          </TouchableOpacity>

          {controls.page !== 4 ? (
            <Touchable
              touchableProps={{
                onPress: () => handlePageChange('NEXT'),
                disabled: load,
              }}
              filled={true}
              loading={false}
              title={'Next'}
              size={'LARGE'}
              style={{width: '30%'}}
            />
          ) : (
            <Touchable
              touchableProps={{
                onPress: () => SignUp(navigation),
                disabled: load,
              }}
              filled={true}
              loading={load}
              title={'Sign up'}
              size={'LARGE'}
              style={{width: '30%'}}
            />
          )}
        </View>
        <FVUModal
          show={controls.FVU == 'NONE' ? false : true}
          onRequest={() => resetModal()}
          type={controls.FVU}
          load={load}
          otp={{
            resendOTP: () => {
              if (FVU.code.type === 'EMAIL-VERIFY') {
                if (register.email.text.length === 0) {
                  return handleRegister(
                    'email',
                    'error_message',
                    'email is required',
                  );
                }
                if (register.email.error_message.length !== 0) {
                  return;
                }
                sendCodeMail(register.email.text);
              } else if (FVU.code.type === 'CONTACT-VERIFY') {
                if (register.contact.text.length === 0) {
                  return handleRegister(
                    'contact',
                    'error_message',
                    'mobile number is required to send otp',
                  );
                }
                if (register.contact.error_message.length !== 0) {
                  return;
                }
                sendCodePhone(register.contact.text);
              }
            },
            type: FVU.code.type,
            text: FVU.code.text,
            onChangeText: (otp: string) => handleFVU('code', 'text', otp),
            verifyOTP: VerifyCode,
            onBlur: () => handleFVU('code', 'active', false),
            onFocus: () => handleFVU('code', 'active', true),
            error: FVU.code.error_message,
          }}
        />
        <LogoModal show={logoModal} />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  collegeContainer: {
    width: '96.5%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: theme.SIZES.large,
  },
  genderContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    borderWidth: 0.5,
    paddingHorizontal: theme.SIZES.small,
    paddingTop: theme.SIZES.small / 2,
    marginTop: theme.SIZES.large,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
  },
  // parent: {
  //   flex: 1,
  //   backgroundColor: theme.COLORS.DEFAULT,
  // },
  viewContainer: {
    flex: 0.95,
    justifyContent: 'space-evenly',
    paddingVertical: theme.SIZES.normal,
    paddingHorizontal: theme.SIZES.small,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonContainer: {
    bottom: theme.SIZES.large,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: theme.SIZES.large,
  },
  togglePress: {
    backgroundColor: theme.COLORS.DEFAULT,
    flexBasis: '40%',
    borderWidth: 0.5,
    borderColor: theme.COLORS.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.small,
    paddingVertical: theme.SIZES.small / 1.6,
    marginVertical: theme.SIZES.small,
    marginHorizontal: theme.SIZES.small,
    borderRadius: 9,
    elevation: 3,
    textAlign: 'center',
  },
  toggleActive: {
    borderColor: theme.COLORS.ACTIVE,
    color: theme.COLORS.DEFAULT,
    backgroundColor: theme.COLORS.PRIMARY,
  },
  toggleText: {
    color: theme.COLORS.BLACK,
    fontFamily: baseStyles.text.fontFamily,
    fontSize: theme.SIZES.small + 3,
  },
  checkBoxes: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  link: {
    marginStart: theme.SIZES.small * 0.6,
    color: theme.COLORS.Links,
    fontSize: theme.SIZES.normal * 0.85,
    fontFamily: 'Signika-SemiBold',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  NameChild: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.SIZES.small - 9,
  },
  NameContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 90,
  },
  headCheckBox: {
    padding: 0,
    marginLeft: 6,
  },
  head_text: {
    fontSize: theme.SIZES.normal * 1.1,
    fontFamily: 'Signika-SemiBold',
    width: '80%',
    letterSpacing: 1,
    color: theme.COLORS.ACTIVE,
  },
});
