import {Height, width} from '../Constants/size';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FunctionComponent, useEffect, useState} from 'react';

import CustomHeader from '../Common/CustomHeader';
import ExpandableView from '../Components/common/SyllabusView';
import ResourceHeader from '../Common/ResourceHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import Subscription from '../Components/modals/Subscription';
import resourcesStore from '../State/resourcesStore';
import theme from '../Constants/theme';
import {useGlobalState} from '../State/GlobalState';

type props = {
  navigation?: any;
  scene?: any;
};
const SyllabusScreen: FunctionComponent<props> = ({navigation, scene}) => {
  const iconOnPress = () => navigation.toggleDrawer();
  const [showSubscription, setShowSubscription] = useState(false);
  const {course} = resourcesStore();
  const globalState: any = useGlobalState();
  const subjects = globalState.subject;
  const onPress = (item: any, index: number) => {
    if (globalState.subscription.type === 'TRIAL') {
      if (index >= 2) {
        setShowSubscription(true);
      } else {
        navigation.navigate('SubjectOverview', {
          subjectData: item,
        });
      }
    } else {
      navigation.navigate('SubjectOverview', {
        subjectData: item,
      });
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.COLORS.WHITE}}>
      <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={styles.parent}
        resizeMode="cover"
        imageStyle={{opacity: 0.03}}>
        <CustomHeader
          navigation={navigation}
          scene={scene}
          title={'Resources'}
          nav
          logo
        />
        <Subscription
          show={showSubscription}
          type={'ABOUTTIME'}
          navigation={navigation}
          message={'Please Update Subscription to Access Content'}
          hide={() => setShowSubscription(false)}
        />
        <View style={{paddingHorizontal: theme.SIZES.small / 2}}>
          <ResourceHeader title={'Syllabus'} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: Height * 0.5}}>
            <View style={{marginTop: theme.SIZES.small}}>
              {subjects.map((item: any, index: number) => (
                <ExpandableView
                  key={index}
                  semData={item}
                  onPress={() => onPress(item, index)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    paddingHorizontal: theme.SIZES.small / 2,
  },
  textInput: {
    width: '90%',
    paddingHorizontal: theme.SIZES.small,
  },
});
export default SyllabusScreen;
