//TODO: Profile Screen
//* List of user data
//* List Item key value
//* Loader

import {Height, width} from '../Constants/size';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';

import CustomHeader from '../Common/CustomHeader';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TextField from '../Components/common/TextField';
import TopNav from '../Components/common/TopNavResources';
import Touchable from '../Components/common/Touchable';
import bg from '../../assets/images/bg.png';
import profileStore from '../Services/profileStore';
import theme from '../Constants/theme';
import {useGlobalState} from '../State/GlobalState';
import useMainState from '../State/MainState';

// import KeyValue from '../Components/common/KeyValue';

type props = {
  data: any;
  style?: any;
  edit?: boolean;
  title?: string;
};
const KeyValue: FunctionComponent<props> = ({data, style}) => {
  return (
    <View style={[styles.second_child, style]}>
      <Text style={styles.key}>{`${data.key} -`}</Text>
      <Text style={styles.value}>{data.value}</Text>
    </View>
  );
};

const KeyValueTextField: FunctionComponent<props> = ({
  data,
  style,
  edit,
  title,
}) => {
  const [val, setVal] = useState('');
  return (
    <View style={[styles.second_child, styles.second_child_last, style]}>
      <Text style={styles.key}>{title}</Text>
      <TextInput
        style={styles.textInputStyle}
        value={edit ? val : data && data.value}
        placeholder={`Enter ${data && data.key}`}
        onChange={(text: any) => setVal(text)}
      />
    </View>
  );
};
const profileTemplate = {
  first_name: {key: 'Name', value: 'Loading...'},
  last_name: {key: 'Name', value: 'Loading...'},
  dob: {key: 'Date of Birth', value: 'Loading...'},
  university: {key: 'University', value: 'Loading...'},
  college: {key: 'College', value: 'Loading...'},
  program: {key: 'Program', value: 'Loading...'},
  semester: {key: 'Semester', value: 'Loading...'},
  email: {key: 'Email', value: 'Loading...'},
  contact: {key: 'Phone', value: 'Add Contact...'},
};

const Profile = ({navigation, route}: {navigation: any; route: any}) => {
  const [oldPass, setOldPass] = useState();
  const [newPass, setNewPass] = useState();
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({...profileTemplate});
  const [password, setPassword] = useState({
    password: {text: '', active: false, error_message: '', show: false},
    password_new: {text: '', active: false, error_message: '', show: false},
  });

  const globalState: any = useGlobalState();

  useEffect(() => {
    console.log('user', globalState.user);
    if (!globalState.user) return;
    let y: any = {...globalState.user};
    let x: any = {...data};
    for (var key in y) {
      if (x.hasOwnProperty(key)) {
        if (key === 'university' || key === 'program') {
          x[key].value = `${y[key].name}`;
        } else if (key === 'dob') {
          x[key].value = `${y[key].split('T')[0]}`;
        } else {
          x[key].value = `${y[key]}`;
        }
      }
    }
    setData(x);
  }, [globalState.user]);

  const [register, setRegister] = useState(
    JSON.parse(JSON.stringify(password)),
  );
  const handlePassword = (
    key: string, // coming from registration template
    key1: string,
    value: any,
  ) => {
    let x: any = {...password};
    x[key][key1] = value;
    if (key === 'password_new' && key1 === 'text') {
      if (x[key].text !== x.password.text)
        x[key]['error_message'] = 'Password does not match';
    }
    setRegister(x);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.COLORS.WHITE}}>
      <ImageBackground
        source={bg}
        style={styles.parent}
        resizeMode="cover"
        imageStyle={{opacity: 0.03}}>
        <CustomHeader
          navigation={navigation}
          scene={route}
          title={'Profile'}
          nav
          logo
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: theme.SIZES.large * 2}}>
          <View style={styles.first_child}>
            <Text style={styles.heading}>Personal Information</Text>
            <KeyValue
              data={{
                key: `Name`,
                value: `${data.first_name.value} ${data.last_name.value}`,
              }}
            />
            <KeyValue data={data.dob} style={styles.second_child_last} />
          </View>
          <View style={styles.first_child}>
            <Text style={styles.heading}>Education Information</Text>
            <KeyValue data={data.university} />
            <KeyValue data={data.college} />
            <KeyValue data={data.program} />
            <KeyValue data={data.semester} style={styles.second_child_last} />
          </View>
          <View style={styles.first_child}>
            <View style={styles.headWithIcon}>
              <Text style={styles.heading}>Contact Information</Text>
              <TouchableOpacity style={styles.iconStyle}>
                <Icon name={'edit'} size={25} />
              </TouchableOpacity>
            </View>
            <KeyValueTextField data={data.email} title={'Email'} />
            <KeyValueTextField
              title={'Phone Number'}
              data={data.contact}
              style={{marginTop: theme.SIZES.small}}
            />
            <Touchable
              title={'Update'}
              size={'SMALL'}
              style={styles.buttonStyle}
              filled
              loading={false}
              touchableProps={{onPress: () => {}, disabled: false}}
            />
          </View>
          <View style={styles.first_child}>
            <View style={styles.headWithIcon}>
              <Text style={styles.heading}>Password</Text>
              <TouchableOpacity
                style={styles.iconStyle}
                onPress={() => {
                  setEdit(true);
                }}>
                <Icon name={'edit'} size={25} />
              </TouchableOpacity>
            </View>
            <TextField
              inputProps={{
                placeholder: 'Password',
                value: password.password.text,
                onChangeText: (text) => {
                  handlePassword('password', 'text', text);
                },
                onBlur: () => handlePassword('password', 'active', false),
                onFocus: () => handlePassword('password', 'active', true),
              }}
              secureText={{
                onToggle: () =>
                  handlePassword('password', 'show', !password.password.show),
                hidden: password.password.show,
              }}
              error={password.password.error_message}
            />

            <TextField
              inputProps={{
                placeholder: 'Re-enter Password',
                value: password.password_new.text,
                onChangeText: (text) => {
                  handlePassword('password_again', 'text', text);
                },
                onBlur: () => handlePassword('password_new', 'active', false),
                onFocus: () => handlePassword('password_new', 'active', true),
              }}
              secureText={{
                onToggle: () =>
                  handlePassword(
                    'password_new',
                    'show',
                    !password.password_new.show,
                  ),
                hidden: password.password_new.show,
              }}
              error={password.password_new.error_message}
            />

            <Touchable
              title={'Update'}
              size={'SMALL'}
              style={styles.buttonStyle}
              filled
              loading={false}
              touchableProps={{
                onPress: () => {
                  setEdit(false);
                },
                disabled: false,
              }}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingHorizontal: theme.SIZES.small / 2,
    backgroundColor: theme.COLORS.DEFAULT,
  },
  first_child: {
    marginTop: theme.SIZES.small,
    borderColor: theme.COLORS.PLACEHOLDER,
    borderWidth: 2,
    borderRadius: theme.SIZES.small,
    paddingHorizontal: theme.SIZES.normal,
    paddingVertical: theme.SIZES.small,
  },
  second_child: {
    marginTop: theme.SIZES.small / 2,
    borderBottomColor: theme.COLORS.PLACEHOLDER,
    borderBottomWidth: 2,
    paddingHorizontal: theme.SIZES.small,
    paddingBottom: theme.SIZES.small,
  },
  second_child_last: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  heading: {
    fontSize: theme.SIZES.large * 0.9,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: theme.COLORS.BLACK + '90',
  },
  key: {
    fontSize: theme.SIZES.normal * 0.85,
    fontWeight: 'bold',
  },
  value: {
    marginTop: theme.SIZES.small * 0.3,
    fontSize: theme.SIZES.normal * 0.8,
  },
  textInputStyle: {
    marginTop: theme.SIZES.small / 2,
    paddingHorizontal: theme.SIZES.small * 0.8,
    paddingVertical: theme.SIZES.small / 2,
    backgroundColor: '#F0F0F0',
    color: theme.COLORS.BLACK,
    borderRadius: theme.SIZES.small,
    fontSize: theme.SIZES.normal * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  headWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconStyle: {},
  buttonStyle: {
    width: width * 0.3,
    alignSelf: 'center',
    borderRadius: theme.SIZES.large,
    marginBottom: 0,
  },
});
