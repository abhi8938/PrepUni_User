import {Alert, Keyboard, Vibration} from 'react-native';
import {useDispatcher, useGlobalState} from './GlobalState';
import {useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import Snackbar from 'react-native-snackbar';
import {firebase} from '@react-native-firebase/messaging';
import services from '../Services/services';
import theme from '../Constants/theme';

const service = new services();

const ErrorTitles = ['Input Error', 'Server Error'];

let basicObj = {
  text: '',
  active: false,
  error_message: '',
};

let basicPass = {text: '', active: false, error_message: '', show: false};

const RegisterTemplate = {
  first_name: {text: '', active: false, error_message: ''},
  last_name: {text: '', active: false, error_message: ''},
  user_name: {text: '', active: false, error_message: ''},
  gender: {text: '', active: false, error_message: ''},
  dob: {text: '', active: false, error_message: ''},
  email: {text: '', active: false, error_message: '', verified: false},
  contact: {text: '', active: false, error_message: '', verified: false},
  program: {text: '', active: false, error_message: ''},
  semester: {text: '', active: false, error_message: ''},
  college: {text: '', active: false, error_message: ''},
  university: {text: '', active: false, error_message: ''},
  password: {text: '', active: false, error_message: '', show: false},
  password_again: {text: '', active: false, error_message: '', show: false},
};

const LoginTemplate = {
  id: {text: '', active: false, error_message: ''},
  password: {text: '', active: false, error_message: '', show: false},
};
const alertTemplate = {
  type: '', // 'ERROR | SUCCESS
  title: '',
  message: '',
  show: false,
};

const FVUtemplate = {
  email: {...basicObj},
  contact: {...basicObj},
  code: {...basicObj, type: 'EMAIL-RESET'},
  newPassword: {...basicPass},
  rePassword: {...basicPass},
};

const InputValidation = (key: string, value: string) => {
  let error = '';
  switch (key) {
    case 'first_name':
      if (value.length < 2) error = `First Name is required`;
      break;
    case 'last_name':
      if (value.length < 2) error = `Last Name is required`;
      break;
    case 'user_name':
      if (value.length < 8) error = `Must be more than 8 characters`;
      if (/\s/g.test(value)) error = `No space allowed`;
      break;
    case 'email':
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) {
        error = `Invalid Email`;
      }
      break;
    case 'contact':
      if (value.length === 0) break;
      if (!/^\d{10}$/.test(value)) error = `Invalid contact number`;
      break;
    case 'college':
      if (value.length < 4) error = `College Name Too short`;
      break;
    case 'university':
      if (value === 'Select University') error = `Please Select University`;
      break;
    case 'program':
      if (value === 'Select Program') error = `Please Select your Program`;
      break;
    case 'specialization':
      if (value === 'Select Specialization')
        error = `Please Select your Specialization`;
      break;
    case 'semester':
      if (value === 'Select Current Semester')
        error = `Please Select your current semester`;
      break;
    case 'password':
      if (value.length < 8) error = `Must be 8 character long`;
      break;
    case 'password_again':
      if (value.length < 8) error = `Must be 8 character long`;
      break;
    case 'newPassword':
      if (value.length < 8) error = `Must be 8 character long`;
      break;
    case 'rePassword':
      if (value.length < 8) error = `Must be 8 character long`;
      break;
    case 'code':
      if (value.length < 6) error = `Invalid Code`;
    default:
      break;
  }
  return error;
};
const useAuthState = () => {
  //* STATE
  const [login, setLogin] = useState({...LoginTemplate});

  const [register, setRegister] = useState(
    JSON.parse(JSON.stringify(RegisterTemplate)),
  );
  const {user}: any = useGlobalState();
  const [alert, setAlert] = useState({...alertTemplate});

  const [controls, setControls] = useState({
    page: 1,
    FVU: 'NONE', // 'EMAIL' | 'OTP' | 'UPDATE'
    agreement: 'NONE', // 'POLICY' | 'TERMS'
    tnc: false,
    otp: '',
  });
  const [FVU, setFVU] = useState(JSON.parse(JSON.stringify(FVUtemplate)));

  const [load, setLoad] = useState(false);
  const [logoModal, setLogoModal] = useState(false);

  const [packages, setPackages] = useState([{}, {}]);

  const dispatcher = useDispatcher();
  const [policies, setPolicies] = useState([
    {
      name: 'Cancellation and Refund policy',
      link: 'https://digitalluxe.in/documents/refund_policy.pdf',
      active: false,
    },
    {
      name: 'Copyright Policy',
      link: 'https://digitalluxe.in/documents/copyright_policy.pdf',
      active: false,
    },
    {
      name: 'Disclaimer',
      link: 'https://digitalluxe.in/documents/disclaimer.pdf',
      active: false,
    },
    {
      name: 'Privacy Policy',
      link: 'https://digitalluxe.in/documents/privacy_policy.pdf',
      active: false,
    },
    {
      name: 'Terms and Conditions',
      link: 'https://digitalluxe.in/documents/terms_conditions.pdf',
      active: false,
    },
  ]);

  useEffect(() => {
    let data = [...policies];
    data.forEach((item: any) => (item.active = controls.tnc));
    setPolicies(data);
  }, [controls.tnc]);

  const selectPolicy = (index: number, newValue: boolean) => {
    let x: any = [...policies];
    x[index].active = newValue;
    setPolicies(x);
  };
  const [lists, setLists] = useState({
    universities: [],
    programs: [],
    semesters: [],
  });

  const [referral, setReferral] = useState('');
  //* STATE HANDLERS

  const resetModal = () => {
    handleControls('FVU', 'NONE');
    setFVU(JSON.parse(JSON.stringify(FVUtemplate)));
  };
  const resetRegister = () => {
    setRegister(JSON.parse(JSON.stringify(RegisterTemplate)));
    handleControls('page', 1);
  };
  const handleLogin = (
    key: 'id' | 'password',
    key1: 'text' | 'active' | 'error_message' | 'show',
    value: any,
  ) => {
    let x: any = {...login};
    x[key][key1] = value;
    if (key1 === 'active' && x[key][key1] === false) {
      x[key]['error_message'] = InputValidation(key, x[key]['text']);
    }
    if (key1 === 'active' && x[key][key1] === true) {
      x[key]['error_message'] = '';
    }
    setLogin(x);
  };

  const getUser = async () => {
    const response = await service.get_user();
    if (response.status === 200) {
      console.log('user', response.data);
      dispatcher({type: 'SET-USER', payload: response.data});
    } else {
      console.log('Error', `${response.data}`);
    }
  };

  const setReferralCode = (value: string) => {
    setReferral(value);
  };
  const handleRegister = (
    key: string, // coming from registration template
    key1: string,
    value: any,
  ) => {
    let x: any = {...register};
    x[key][key1] = value;
    //check input validation
    if (key1 !== 'error_message') {
      x[key]['error_message'] = InputValidation(key, x[key]['text']);
    }
    //disbale error on select
    if (key === 'gender' && key1 === 'text') {
      x[key]['error_message'] = '';
    }
    if (key === 'gender' && key1 === 'error_message') {
      handleAlert(
        'ERROR',
        ErrorTitles[1],
        `Please fill required details`,
        true,
      );
    }
    if (key === 'dob' && key1 === 'error_message') {
      handleAlert('ERROR', ErrorTitles[1], x[key]['error_message'], true);
    }

    if (key === 'password_again' && key1 === 'text') {
      if (x[key].text !== x.password.text)
        x[key]['error_message'] = 'Password does not match';
    }
    setRegister(x);
  };

  const handleControls = (
    key: 'page' | 'FVU' | 'agreement' | 'tnc' | 'otp',
    value: any,
  ) => {
    let x: any = {...controls};
    if (key === 'otp') {
      x['FVU'] = 'OTP';
    }
    x[key] = value;
    setControls(x);
  };

  const handleFVU = (
    key: 'email' | 'code' | 'newPassword' | 'rePassword' | 'contact',
    key1: 'text' | 'active' | 'show' | 'error_message' | 'type',
    value: any,
  ) => {
    let x: any = {...FVU};
    x[key][key1] = value;

    if (key1 !== 'error_message') {
      x[key]['error_message'] = InputValidation(key, x[key]['text']);
    }
    if (key === 'rePassword' && key1 === 'text') {
      if (x[key].text !== x.newPassword.text)
        x[key]['error_message'] = 'Password does not match';
    }
    if (key1 === 'active' && x[key][key1] === true) {
      x[key]['error_message'] = '';
    }
    setFVU(x);
  };

  const handleAlert = (
    type: string,
    title: string,
    message: string,
    show: boolean,
  ) => {
    let x: any = {...alert};
    x['title'] = title;
    x['message'] = message;
    x['type'] = type;
    x['show'] = show;
    dispatcher({
      type: 'SET-ALERT',
      payload: {type, message, show: true},
    });
    setAlert(x);
  };

  const handleLists = (
    key: 'universities' | 'programs' | 'semesters',
    value: any,
  ) => {
    let x: any = {...lists};
    x[key] = value;
    setLists(x);
  };

  //* TRIGGER SERVICES
  const SignIn = async (navigation: any) => {
    if (login.id.text.length === 0 || login.password.text.length === 0)
      return handleAlert(
        'ERROR',
        ErrorTitles[0],
        `${login.id.text.length === 0 ? 'Id' : 'password'} is empty`,
        true,
      );
    setAlert({...alertTemplate});
    Keyboard.dismiss();
    setLoad(true);
    const response = await service.authenticate({
      id: login.id.text.toLowerCase(),
      password: login.password.text,
    });
    if (response.status === 200) {
      try {
        const token = await firebase.messaging().getToken(); //? Not working on IOS
        await AsyncStorage.setItem('TOKEN', response.data);
        await service.update_student({device_token: token});
        await getUser();
      } catch (error) {
        handleAlert(
          'ERROR',
          ErrorTitles[0],
          error.message ? error.message : error,
          true,
        );
        setLogin(JSON.parse(JSON.stringify(LoginTemplate)));
        setLoad(false);
        return;
      }
      setLogin(JSON.parse(JSON.stringify(LoginTemplate)));
      setLoad(false);
      setLogoModal(true);
      setTimeout(() => {
        navigation.replace('Main');
      }, 1000);
      return;
    }
    handleAlert('ERROR', ErrorTitles[1], `${response.data}`, true);
    setLoad(false);
    return;
  };

  const saveOtp = async (type: string) => {
    const current_code = Math.floor(100000 + Math.random() * 900000);
    if (type === 'EMAIL-VERIFY' || type === 'CONTACT-VERIFY') {
      const prevOtp: any = await AsyncStorage.getItem('VERIFY');

      if (prevOtp) {
        return JSON.parse(prevOtp).code;
      }
      let x = {code: current_code, created_at: new Date()};
      await AsyncStorage.setItem('VERIFY', JSON.stringify(x));
      return current_code;
    } else if (type === 'EMAIL-RESET' || type === 'CONTACT-RESET') {
      const prevOtp: any = await AsyncStorage.getItem('RESET');
      if (prevOtp) {
        return JSON.parse(prevOtp).code;
      }
      let x = {code: current_code, created_at: new Date()};
      await AsyncStorage.setItem('RESET', JSON.stringify(x));
      return current_code;
    }
  };

  const sendCodeMail = async (email: string) => {
    Keyboard.dismiss();

    setLoad(true);
    const current_code = await saveOtp(FVU.code.type);
    const response = await service.sendCode(
      current_code,
      email,
      FVU.code.type === 'EMAIL-VERIFY' ? 'VERIFY' : 'RESET',
      'MAIL',
    );
    console.log('otp email', response);

    if (response.status === 200) {
      handleControls('FVU', 'OTP');
      handleControls('otp', `${current_code}`);
      Snackbar.show({
        text: response.data.message,
        duration: Snackbar.LENGTH_SHORT,
      });
      setAlert({...alertTemplate});
    }
    if (response.status !== 200)
      handleAlert('ERROR', ErrorTitles[1], JSON.stringify(response.data), true);

    setLoad(false);
  };

  const sendCodePhone = async (contact: string) => {
    Keyboard.dismiss();

    setLoad(true);
    const current_code = await saveOtp(FVU.code.type);
    const response = await service.sendCode(
      current_code,
      contact,
      FVU.code.type === 'CONTACT-VERIFY' ? 'VERIFY' : 'RESET',
      'CONTACT',
    );
    if (response.status === 200) {
      handleControls('FVU', 'OTP');
      handleControls('otp', `${current_code}`);
      Snackbar.show({
        text: response.data.message,
        duration: Snackbar.LENGTH_SHORT,
      });
      setAlert({...alertTemplate});
    }
    if (response.status !== 200) {
      console.log('error', response.data);
      handleAlert('ERROR', ErrorTitles[1], JSON.stringify(response.data), true);
    }
    setLoad(true);
  };

  const VerifyCode = () => {
    console.log('code', FVU.code.text, controls.otp);
    if (FVU.code.text === controls.otp) {
      setAlert({...alertTemplate});
      if (
        FVU.code.type === 'EMAIL-VERIFY' ||
        FVU.code.type === 'CONTACT-VERIFY'
      ) {
        handleRegister(
          FVU.code.type === 'EMAIL-VERIFY' ? 'email' : 'contact',
          'verified',
          true,
        );
        handleFVU('code', 'text', '');
        handleControls('otp', '');
      }
      return FVU.code.type === 'EMAIL-VERIFY' ||
        FVU.code.type === 'CONTACT-VERIFY'
        ? handleControls('FVU', 'NONE')
        : handleControls('FVU', 'UPDATE');
    }
    return handleFVU('code', 'error_message', 'Wrong Code');
  };

  const UdpatePassword = async (password: string) => {
    Keyboard.dismiss();
    setLoad(true);
    const response = await service.reset_password(password, FVU.email.text);
    console.log(response);
    if (response.status === 200) {
      setAlert(alertTemplate);
      handleControls('FVU', 'NONE');
      setLoad(false);
      return Snackbar.show({
        text: 'Password Updated',
        duration: Snackbar.LENGTH_LONG,
      });
    }
    setLoad(false);
    return handleAlert('ERROR', ErrorTitles[0], `${response.data}`, true);
  };

  const handlePageChange = (Key: 'NEXT' | 'PREVIOUS') => {
    if (Key === 'NEXT') {
      if (controls.page >= 4) return;
      let error = false;
      let x: any = {...register};

      if (controls.page === 1) {
        ['first_name', 'last_name', 'user_name', 'gender'].map(
          (item: string) => {
            //check if text.length !== 0
            let itemName = '';
            item.split('_').map((item) => (itemName += ' ' + item));
            if (x[item].text.length === 0) {
              error = true;
              handleRegister(item, 'error_message', `${itemName} is required`);
            }

            //check if error
            if (x[item].error_message.length > 0) {
              error = true;
            }
          },
        );
      } else if (controls.page === 2) {
        ['email', 'contact', 'dob'].map((item: string) => {
          //check if text.length !== 0
          let itemName = '';
          item.split('_').map((item) => (itemName += ' ' + item));
          if (item === 'email') return;
          if (item === 'contact' && x[item].error_message) {
            error = true;
          }
          if (
            (item === 'dob' && x[item].text.length === 0) ||
            x['dob'].error_message.length > 0
          ) {
            error = true;
            handleRegister(item, 'error_message', 'Invalid Date Of Birth');
          }
        });
        if (x['email'].verified === false && x['contact'].verified === false) {
          error = true;
          handleAlert(
            'ERROR',
            ErrorTitles[0],
            'Please verify atleast one contact.',
            true,
          );
          return;
        }
      } else if (controls.page === 3) {
        ['college', 'university', 'program', 'semester'].map((item: string) => {
          //check if text.length !== 0
          let itemName = '';
          item.split('_').map((item) => (itemName += ' ' + item));
          if (x[item].text.length === 0) {
            error = true;
            handleRegister(item, 'error_message', `${itemName} is required`);
          }
          if (x[item].error_message.length > 0) {
            error = true;
          }
        });
      }
      if (error) {
        Vibration.vibrate();
        return;
      }
      handleControls('page', controls.page + 1);
    } else if (Key === 'PREVIOUS') {
      if (controls.page <= 1) return;
      handleControls('page', controls.page - 1);
    }
  };

  const SignUp = async (navigation: any) => {
    Keyboard.dismiss();
    setLoad(true);
    if (controls.tnc === false) {
      setLoad(false);
      return handleAlert(
        'ERROR',
        ErrorTitles[0],
        `Please Read and Accept all the condition and Policies`,
        true,
      );
    }
    // Validate formData for invalid and empty input fields before creating user
    const final_raw_data: any = register;
    let error = false;
    let final_data: any = {};
    for (let key in final_raw_data) {
      if (final_raw_data.hasOwnProperty(key)) {
        const y = final_raw_data[key];
        if (key === 'contact' && y.text.length === 0) continue;

        if (y.text.length === 0) {
          error = true;
          handleRegister(key, 'error_message', `${key} is required`);
        }
        if (y.error_message.length > 0) {
          error = true;
        }
        if (key !== 'password_again') {
          final_data[key] = y.text;
        }
      }
    }
    if (error) {
      setLoad(false);
      return Vibration.vibrate();
    }
    final_data['type'] = 'STU';

    if (referral !== '') {
      final_data['referal'] = referral;
    }
    console.log(final_data);
    final_data['email'] = `${final_data['email']}`.toLowerCase();
    if (final_data.contact === null) {
      delete final_data.contact;
    }
    console.log('final_data', final_data);
    const response = await service.create_user(final_data);
    if (response.status === 200) {
      try {
        const token = await firebase.messaging().getToken();
        await AsyncStorage.setItem('TOKEN', response.headers['x-auth-token']);
        dispatcher({type: 'SET-USER', payload: response.data});
        await service.update_student({device_token: token});
      } catch (error) {
        handleAlert('ERROR', ErrorTitles[1], `${error}`, true);
        setLoad(false);
        return;
      }

      setRegister(JSON.parse(JSON.stringify(RegisterTemplate)));
      handleControls('tnc', false);
      setLoad(false);
      Snackbar.show({
        text: 'Registration Successfull',
        duration: Snackbar.LENGTH_SHORT,
      });
      return navigation.replace('Packages');
    } else if (response.status !== 200) {
      console.log('signup_error_2 - ', response.data);
      setLoad(false);
      return handleAlert('ERROR', ErrorTitles[0], `${response.data}`, true);
    }
  };

  //* FETCH DATA SERVICES

  const getUniversities = async () => {
    setLoad(true);
    const response = await service.get_universities();
    if (response.status == 200) {
      console.log('getUnivers', response.data);
      handleLists('universities', response.data);
    } else {
      handleAlert('ERROR', ErrorTitles[0], response.data, true);
    }
    setLoad(false);
  };

  const getPrograms = async () => {
    setLoad(true);
    const response = await service.get_programs(register.university.text);
    if (response.status == 200) {
      console.log('getPrograms', response.data);
      handleLists('programs', response.data);
    } else {
      handleAlert('ERROR', ErrorTitles[0], response.data, true);
    }
    setLoad(false);
  };

  const getSems = () => {
    const course = lists.programs.filter(
      (x: any) => x._id == register.program.text,
    );
    let sems: any = [];
    //@ts-ignore
    let numbers: [] = course[0].semester;
    numbers.map((x: number) => sems.push({_id: x, name: x}));
    handleLists('semesters', sems);
  };

  const getPackages = async () => {
    setLoad(true);
    const response = await service.get_packages();
    if (response.status == 200) {
      setPackages(response.data);
    } else {
      handleAlert('ERROR', ErrorTitles[0], response.data, true);
    }
    setLoad(false);
  };

  const createSubscription = async (
    id: string,
    pa_id?: string,
    finalAmount?: string,
  ) => {
    const response = await service.create_subscription(id, pa_id, finalAmount);
    if (response.status === 200) {
      console.log('subscription', response.data);
      setLogoModal(true);
      return response.data;
    } else {
      handleAlert('ERROR', ErrorTitles[0], response.data, true);
      console.log('Error', response.data);
      return '';
    }
  };

  const renewSubscription = async (
    status: 'ACTIVE' | 'INACTIVE',
    transId: string,
    finalAmount: string,
  ) => {
    const response = await service.renew_subscription(
      //@ts-ignore
      subscription._id,
      status,
      transId,
      finalAmount,
    );
    if (response.status == 200) {
      console.log('renew subscription', response.data);
      return response.data;
    } else {
      handleAlert('ERROR', ErrorTitles[0], response.data, true);
      console.log('renew Error', response.data);
      return '';
    }
  };

  const getSubscription = async () => {
    const response = await service.get_subscription();
    if (response.status == 200) {
      console.log('subscription', response.data);
      dispatcher({type: 'SET-SUBSCRIPTION', payload: response.data});
      return response.data;
    } else {
      handleAlert(
        'ERROR-SUBSCRIPTION-FETCH',
        ErrorTitles[0],
        response.data,
        true,
      );
      return {};
    }
  };

  const Buy = async (navigation: any, pack: any, renew: boolean = false) => {
    const finalAmount = pack.price - pack.discount;
    setLoad(true);
    const data = {
      STID: user._id,
      amount: String(finalAmount),
    };
    try {
      const order = await service.create_order(data);
      if (order.status != 200) {
        setLoad(false);
        return handleAlert(
          'ERROR-CREATE-ORDER',
          ErrorTitles[0],
          order.data,
          true,
        );
      }
      var options = {
        description: 'PrepUni Subscription',
        image: 'https://digitalluxe.in/documents/prepuni_logo.jpg',
        currency: 'INR',
        key: 'rzp_test_JrmprfPdb6LHFI',
        amount: String(finalAmount * 10),
        name: 'PrepUni',
        order_id: order.data.order_id, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
        prefill: {
          email: user.email,
          name: user.first_name + ' ' + user.last_name,
        },
        theme: {color: theme.COLORS.ACTIVE},
      };
      setLoad(false);
      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // handle success
          const paymentData = {
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            razorpay_order_id: data.razorpay_order_id,
          };
          const paymentResp = await service.update_payment(
            paymentData,
            order.data._id,
          );
          if (paymentResp.status === 200) {
            setLoad(true);
            const message =
              renew == false
                ? await createSubscription(
                    pack._id,
                    paymentResp.data._id,
                    String(finalAmount),
                  )
                : await renewSubscription(
                    'ACTIVE',
                    paymentResp.data._id,
                    String(finalAmount),
                  );
            setLoad(false);
            if (message.length !== 0) {
              Alert.alert('Congratulations!', message, [
                {
                  text: 'OK',
                  onPress: () => navigation.replace('Main'),
                },
              ]);
            }
            return true;
          } else {
            setLoad(false);
            handleAlert(
              'ERROR-PAYMENT-UPDATE',
              ErrorTitles[0],
              'Payment Failed, please Retry.',
              true,
            );

            return false;
          }
        })
        .catch((error: any) => {
          // handle failure
          setLoad(false);
          handleAlert(
            'ERROR-PAYMENT-RAZORPAY',
            ErrorTitles[0],
            `Error: ${error.code} | ${error.description}`,
            true,
          );
        });
    } catch (e) {
      setLoad(false);
      handleAlert('ERROR-BUY', ErrorTitles[0], JSON.stringify(e), true);
      return false;
    }
  };

  const trial = async (id: string, navigation: any) => {
    setLoad(true);
    const message = await createSubscription(id);
    setLoad(false);
    if (message.length !== 0) {
      Alert.alert('Congratulations!', message, [
        {
          text: 'OK',
          onPress: () => navigation.replace('Main'),
        },
      ]);
    }
  };
  const getSubjects = async (id: string) => {
    const response = await service.get_subjects(id);
    if (response.status === 200) {
      dispatcher({type: 'SET-SUBJECT', payload: response.data});
    } else {
      console.log('ERROR-SUBJECTS', `${response.data}`);
    }
  };
  const getResources = async () => {
    const response = await service.get_resources();
    if (response.status === 200) {
      dispatcher({type: 'SET-RESOURCES', payload: response.data});
    } else {
      console.log('ERROR-RESOURCES', `${response.data}`);
    }
  };

  const getFaq = async (setdata: (data: any) => void) => {
    const response = await service.get_faq();
    if (response.status === 200) {
      setdata(response.data);
    } else {
      console.log('Error', `${response.data}`);
    }
  };

  return {
    getSubscription,
    createSubscription,
    getPackages,
    logoModal,
    login,
    register,
    alert,
    FVU,
    controls,
    load,
    handleLogin,
    handleRegister,
    handleControls,
    handleFVU,
    SignIn,
    sendCodeMail,
    sendCodePhone,
    VerifyCode,
    UdpatePassword,
    handlePageChange,
    SignUp,
    handleAlert,
    packages,
    setPackages,
    getPrograms,
    getUniversities,
    getSems,
    lists,
    getUser,
    resetModal,
    resetRegister,
    trial,
    Buy,
    policies,
    selectPolicy,
    handleLists,
    getSubjects,
    getResources,
    setReferralCode,
    getFaq,
  };
};

export default useAuthState;
