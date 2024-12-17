import { View, Image, Pressable } from 'react-native';
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome6';
import commonStyles, { commonColors } from '../assets/CommonStyles';
import { ProfileImage } from './ProfileImage';

const Header = ({ hideBack, goToHome, goToProfile, imagePath, imageText }) => {
  const renderBackButton = () => {
    if (hideBack) return <View />;
    return (
      <Pressable onPressIn={goToHome}>
        <FontAwesomeIcon
          name="arrow-left"
          size={30}
          color={commonColors.littleLemonGreen}
        />
      </Pressable>
    );
  };

  return (
    <View style={commonStyles.header}>
      {renderBackButton()}
      <Image
        style={commonStyles.nameLogo}
        source={require('../assets/nameLogo.png')}
        resizeMode="contain"
      />
      <Pressable onPressIn={goToProfile}>
        <ProfileImage path={imagePath} text={imageText} />
      </Pressable>
    </View>
  );
};

export default Header;