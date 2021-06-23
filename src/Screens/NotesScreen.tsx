import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Height, width} from '../Constants/size';
import React, {FunctionComponent, useEffect, useState} from 'react';

import CustomHeader from '../Common/CustomHeader';
import IonicIcons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {URL} from '../Constants/urls';
import baseStyles from '../Components/common/styles';
import bg from '../../assets/images/bg.png';
import theme from '../Constants/theme';
import {useGlobalState} from '../State/GlobalState';

type props = {
  navigation?: any;
  scene?: any;
};
const NotesScreen: FunctionComponent<props> = ({navigation, scene}) => {
  const subject = useGlobalState().subject;
  const [showModal, setShowModal] = useState({
    show: false,
    data: null,
    index: 0,
  });
  const iconOnPress = () => {};
  const back = () => {
    setShowModal({show: false, data: null, index: 0});
  };
  const Bookview = ({item, index}: {item: any; index: number}) => {
    return (
      <TouchableOpacity
        style={styles.itemParent}
        onPress={() =>
          navigation.navigate('PaperList', {id: index, edit: false})
        }>
        <View style={styles.bookContainer}>
          <Image
            source={{
              uri: `${URL}/paper/files/${item.cover}`,
            }}
            style={styles.bookImage}
          />
        </View>
        <View
          style={{
            marginLeft: theme.SIZES.normal,
            marginTop: theme.SIZES.small / 2,
          }}>
          <Text style={[baseStyles.text, {fontSize: theme.SIZES.normal + 5}]}>
            {item.name}
          </Text>
          <Text
            style={
              (baseStyles.text,
              {
                color: theme.COLORS.PRICE_COLOR,
                fontSize: theme.SIZES.normal,
              })
            }>
            {item.code}
          </Text>
        </View>
        <IonicIcons
          size={35}
          color={'#00000090'}
          name={'chevron-forward-outline'}
          style={{marginLeft: 'auto', marginRight: theme.SIZES.small}}
        />
      </TouchableOpacity>
    );
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
          scene={scene}
          title={'My Notes'}
          nav
          logo
        />
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={subject}
          renderItem={Bookview}
          style={{width: '100%'}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listView}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    paddingHorizontal: theme.SIZES.small / 2,
  },
  listView: {
    paddingHorizontal: theme.SIZES.normal,
  },
  bookContainer: {
    height: '100%',
    width: '12%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    borderRadius: 5,
  },
  bookImage: {
    height: '100%',
    aspectRatio: 0.61,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  itemParent: {
    height: Height * 0.13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.SIZES.normal,
    borderBottomColor: theme.COLORS.LIGHT_GREY,
    borderBottomWidth: 2,
    backgroundColor: theme.COLORS.DEFAULT,
  },
});
