import React from 'react';
import {View} from 'react-native';
import {FlatList, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Avatar, SearchBar} from 'react-native-elements';
import filter from 'lodash.filter';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refesh: true,
      querry: '',
      search: [],
    };
  }
  componentDidMount() {
    this.fetchHuman();
  }
  fetchHuman = () => {
    this.setState({refesh: true});
    fetch('https://randomuser.me/api/?&results=20')
      .then(res => res.json())
      .then(resJson => {
        this.setState({data: resJson.results});
        this.setState({search: resJson.results});
        this.setState({refesh: false});
      })
      .catch(e => console.log(e));
  };
  handlerefes = () => {
    this.setState({refesh: false}, () => {
      this.fetchHuman();
    });
  };
  renderItemHuman = data => (
    <View style={styles.constainer}>
      <Avatar rounded source={{uri: data.item.picture.thumbnail}} />
      <View style={styles.name}>
        <Text style={({fontWeight: 'bold'}, {fontSize: 20})}>
          {data.item.name.first} {data.item.name.last}
        </Text>
        <Text>{data.item.email}</Text>
      </View>
    </View>
  );
  Itemspace = () => {
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      />
    );
  };
  renderFoot = () => {
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}></View>
    );
  };
  search = search => {
    if (search) {
      const searchData = this.state.data.filter((item) => {
        const name=`${item.name.first} ${item.name.last}`
        const itemData = name ? name.toUpperCase(): ''.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({querry: {search}, refesh: false});
      this.setState({search: searchData});
    } else {
      this.setState({querry: {search}, refesh: false});
      this.setState({search: this.state.data});
    }
  };
  renderHeader = () => {
    const search = this.state.querry;
    return (
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        value={search}
        onChangeText={this.search}
      />
    );
  };
  render() {
    console.log(this.state.querry);
    return (
      <SafeAreaView>
        <FlatList
          data={this.state.search}
          // data={this.state.data}
          renderItem={item => this.renderItemHuman(item)}
          ItemSeparatorComponent={this.Itemspace}
          ListFooterComponent={this.renderFoot}
          ListHeaderComponent={this.renderHeader}
          refreshing={this.state.refesh}
          onRefresh={this.handlerefes}
          keyExtractor={item => item.email.toString()}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 20,
  },
  name: {
    flex: 0.7,
    justifyContent: 'center',
    marginLeft: 20,
  },
});
