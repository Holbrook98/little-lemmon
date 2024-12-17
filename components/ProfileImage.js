import { View, Image, Text } from 'react-native';
import commonStyles from '../assets/CommonStyles';

export const ProfileImage = ({ path, text }) => {
  return (
    <View style={commonStyles.profileImage}>
      {path ? (
        <Image source={{ uri: path }} style={commonStyles.profileImage} />
      ) : (
        <Text>{text}</Text>
      )}
    </View>
  );
};

export default ProfileImage;

