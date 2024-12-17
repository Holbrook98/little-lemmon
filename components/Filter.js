import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { commonColors } from '../assets/CommonStyles';

const Filter = ({ onChange, selections, sections }) => {
  const renderFilterButton = (section, index) => {
    const isSelected = selections[index];
    const buttonStyle = [
      styles.filterButton,
      { backgroundColor: isSelected ? commonColors.littleLemonGreen : commonColors.lightGrey },
    ];
    const textStyle = {
      ...styles.filterText,
      color: isSelected ? commonColors.lightGrey : commonColors.littleLemonGreen,
    };

    return (
      <TouchableOpacity
        key={section}
        onPress={() => onChange(index)}
        style={buttonStyle}
      >
        <Text style={textStyle}>{section}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => renderFilterButton(section, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderColor: commonColors.lightGrey,
    borderBottomWidth: 1.5,
  },
  filterButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  filterText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Filter;

