import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { useCallback, useMemo, useState, useEffect } from 'react';
import Header from '../components/Header';
import { calculateImageText, getSectionListData, useUpdateEffect } from '../utils/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createMenuTable,
  getFilteredItems,
  getMenuItems,
  saveMenuItems,
} from '../components/MenuDatabase';
import debounce from 'lodash.debounce';
import { Searchbar } from 'react-native-paper';
import { commonColors } from '../assets/CommonStyles';
import Filter from '../components/Filter';

const sections = ['Starters', 'Mains', 'Desserts', 'Drinks'];

const Separator = () => <View style={menuStyles.separator}></View>;

const Item = ({ name, price, description, image }) => (
  <View style={menuStyles.itemContainer}>
    <View style={{ flex: 0.9 }}>
      <Text style={menuStyles.itemTitle}>{name}</Text>
      <Text style={menuStyles.itemDescription} numberOfLines={3}>
        {description}
      </Text>
      <Text style={menuStyles.priceText}>${price}</Text>
    </View>
    <Image
      source={{ uri: image }}
      resizeMode="contain"
      accessible={true}
      style={menuStyles.cardImage}
    />
  </View>
);

const Home = ({ navigation }) => {
  const [imageText, setImageText] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [filterSelections, setFilterSelections] = useState(sections.map(() => false));
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');

  const goToProfile = () => {
    navigation.push('Profile');
  };

  const goToHome = () => {};

  const renderItem = ({ item }) => (
    <Item name={item.name} price={item.price} description={item.description} image={item.imageFileName} />
  );

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
      );
      const json = await response.json();
      let id = 1;
      return json.menu.map((item) => {
        item.imageFileName =
          'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/' + item.image + '?raw=true';
        item.id = id++;
        return item;
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  useEffect(() => {
    (async () => {
      try {
        let storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData != null) {
          storedUserData = JSON.parse(storedUserData);
          if (storedUserData.imagePath) setImagePath(storedUserData.imagePath);
          setImageText(calculateImageText(storedUserData.lastName, storedUserData.firstName));
        }

        await createMenuTable();
        let dbMenuItems = await getMenuItems();
        if (!dbMenuItems.length) {
          dbMenuItems = await fetchData();
          await saveMenuItems(dbMenuItems);
          console.log('From URL');
        } else {
          console.log('From DB');
        }
        setMenuItems(dbMenuItems);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const dbMenuItems = await getFilteredItems(query, activeCategories);
        setMenuItems(getSectionListData(dbMenuItems));
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [filterSelections, query]);

  return (
    <View style={homeStyles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <Header imagePath={imagePath} imageText={imageText} goToProfile={goToProfile} goToHome={goToHome} hideBack={true} />
      </View>

      <View style={homeStyles.heroSection}>
        <Text style={homeStyles.heroTitle}>Little Lemon</Text>
        <Text style={homeStyles.subTitle}>Chicago</Text>
        <View style={homeStyles.heroDescription}>
          <Text style={homeStyles.lead}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
          <Image
            source={require('../assets/Hero.png')}
            accessible={true}
            accessibilityLabel={'Chef cooking in little lemon'}
            style={homeStyles.heroImage}
          />
        </View>

        <Searchbar
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={homeStyles.searchBar}
          iconColor={commonColors.darkGrey}
          inputStyle={{ color: commonColors.darkGrey }}
          placeholder="Search"
          placeholderTextColor={commonColors.darkGrey}
        />
      </View>

      <View style={homeStyles.heroSubtitle}>
        <Text style={homeStyles.sectionTitle}>ORDER FOR DELIVERY! </Text>
      </View>

      <Filter selections={filterSelections} onChange={handleFiltersChange} sections={sections} />

      <FlatList
        keyExtractor={(item) => item.name}
        data={menuItems}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        style={menuStyles.container}
      />
    </View>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    backgroundColor: 'white',
  },
  heroSection: {
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: commonColors.littleLemonGreen,
  },
  heroTitle: {
    fontWeight: 'bold',
    fontSize: 45,
    color: commonColors.littleLemonYellow,
  },
  heroDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  heroSubtitle: {
    padding: 10,
    marginTop: 20,
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  searchBar: {
    marginVertical: 5,
    backgroundColor: 'white',
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  subTitle: {
    fontSize: 32,
    color: 'white',
  },
  lead: {
    fontSize: 18,
    color: 'white',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const menuStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    color: commonColors.littleLemonGreen,
    fontSize: 16,
    marginBottom: 8,
  },
  priceText: {
    color: commonColors.littleLemonGreen,
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: commonColors.lightGrey,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
});

export default Home;