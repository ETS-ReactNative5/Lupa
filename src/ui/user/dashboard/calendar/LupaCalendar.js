import React from 'react';

import {
  View,
  StyleSheet,
  Text
} from 'react-native';

import {
  Surface,
  IconButton
} from 'react-native-paper';

const months = ["January", "February", "March", "April",
  "May", "June", "July", "August", "September", "October",
  "November", "December"];

const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default class LupaCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: new Date(),
    }
  }

  generateMatrix = () => {
    var matrix = [];

    matrix[0] = days;

    var year = this.state.activeDate.getFullYear();
    var month = this.state.activeDate.getMonth();

    var firstDay = new Date(year, month, 1).getDay();

    var maxDays = numDays[month];
    if (month == 1) { // February
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }

    var counter = 1;
    for (var row = 1; row < 7; row++) {
      matrix[row] = [];
      for (var col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  }

  changeMonth = (n) => {
    this.setState(() => {
      this.state.activeDate.setMonth(
        this.state.activeDate.getMonth() + n
      )
      return this.state;
    });
}

  _onPress = (item) => {
    this.setState(() => {
      if (!item.match && item != -1) {
        this.state.activeDate.setDate(item);
        return this.state;
      }
    });
  };

  

  render() {
    var matrix = this.generateMatrix();

    var rows = [];
    rows = matrix.map((row, rowIndex) => {
      var rowItems = row.map((item, colIndex) => {
        return (
          <Text
            style={{
              flex: 1,
              height: 18,
              textAlign: 'center',
              // Highlight header
              backgroundColor: rowIndex == 0 ? '#ddd' : '#fff',
              // Highlight Sundays
              color: colIndex == 0 ? '#2196F3' : '#000',
              // Highlight current date
              fontWeight: item == this.state.activeDate.getDate()
                ? 'bold' : ''
            }}
            onPress={() => this._onPress(item)}>
            {item != -1 ? item : ''}
          </Text>
        );
      });
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {rowItems}
        </View>
      );
    });
    return (
      <Surface style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", height: "auto" }}>
          <IconButton icon="chevron-left" size={18} onPress={() => this.changeMonth(-1)}/>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 18,
            textAlign: 'center',
            color: "#2196F3",
          }}>
            {months[this.state.activeDate.getMonth()]} &nbsp;
            {this.state.activeDate.getFullYear()}
          </Text>
          <IconButton icon="chevron-right" size={18} onPress={() => this.changeMonth(+1)}/>
        </View>
        {rows}
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    elevation: 10,
    borderRadius: 25,
    margin: 10,
  }
})