import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {ScrollView, TextInput} from 'react-native-gesture-handler';

import CustomHeader from '../Common/CustomHeader';
import Header from '../Common/CustomHeader';
import {Height} from '../Constants/size';
/**
 * TODO: Create FAQ Screen
 * * Animate list when expanding and contracting
 * * Tutorials to transfer paper to desktop via whatsapp/ email
 *  Create expandable list of faq
 */
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import SupportExpandView from '../Components/common/SupportExpandView';
import TopNavBar from '../Components/common/TopNavbar';
import Touchable from '../Components/common/Touchable';
import {sample_FAQs} from '../Constants/sample';
import supportStore from '../Services/supportStore';
import theme from '../Constants/theme';
import useAuthState from '../State/AuthState';

type props = {
  navigation?: any;
  route: any;
};
const Support: FunctionComponent<props> = ({navigation, route}) => {
  const [show, setShow] = useState(false);
  const {getFaq} = useAuthState();
  const [supportData, setSupportData] = useState<any[]>([]);
  useEffect(() => {
    getFaq((data: any) => setSupportData(data));
  }, []);
  return (
    <SafeAreaView style={styles.parent}>
      <ScrollView
        style={styles.parent}
        contentContainerStyle={{paddingBottom: theme.SIZES.large}}>
        <ImageBackground
          source={require('../../assets/images/bg.png')}
          style={styles.parent}
          resizeMode="cover"
          imageStyle={{opacity: 0.03}}>
          <CustomHeader
            navigation={navigation}
            scene={route}
            title={'Support'}
            nav
            logo
          />
          <Text style={styles.head}>FAQ?</Text>
          <View style={{paddingHorizontal: theme.SIZES.small}}>
            {supportData.map((item, index) => (
              <SupportExpandView item={item} key={index} />
            ))}
          </View>
          <View style={{paddingHorizontal: theme.SIZES.small}}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShow(!show)}
              style={styles.queryStyle}>
              <Text style={styles.queryText}>Any Other Query?</Text>
              <Icon
                name={show ? 'caret-up-outline' : 'caret-down-outline'}
                size={25}
              />
            </TouchableOpacity>
            {show && (
              <View style={{alignItems: 'center'}}>
                <TextInput
                  multiline={true}
                  textAlignVertical={'top'}
                  placeholder={'Type Your Query Here.....'}
                  style={styles.querInput}
                />
                <Touchable
                  style={{width: '30%', borderRadius: theme.SIZES.large}}
                  filled
                  title={'Submit'}
                  loading={false}
                  size={'SMALL'}
                  touchableProps={{onPress: () => {}, disabled: false}}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Support;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: theme.COLORS.DEFAULT,
  },
  subjects_list: {
    marginVertical: theme.SIZES.small * 0.3,
  },
  head: {
    textAlign: 'center',
    fontFamily: 'Signika-Medium',
    marginTop: theme.SIZES.small,
    fontSize: theme.SIZES.large * 1.2,
    color: theme.COLORS.HEADER,
  },
  queryStyle: {
    width: '100%',
    marginTop: theme.SIZES.large * 3,
    justifyContent: 'space-between',
    paddingVertical: theme.SIZES.small * 0.5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: theme.SIZES.small / 2,
    borderBottomWidth: 2,
    borderBottomColor: theme.COLORS.GREEN,
  },
  queryText: {
    width: '92%',
    fontSize: theme.SIZES.small * 1.15,
    color: theme.COLORS.HEADER,
    lineHeight: 24,
  },
  querInput: {
    width: '100%',
    marginTop: theme.SIZES.small,
    paddingHorizontal: theme.SIZES.small,
    height: Height * 0.15,
    borderColor: theme.COLORS.GREEN,
    borderWidth: 1.5,
    borderRadius: theme.SIZES.small,
  },
});
