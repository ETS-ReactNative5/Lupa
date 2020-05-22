import React from 'react';

import {
    Text,
    StyleSheet,
    SafeAreaView,
    Modal,
    Dimensions,
    View,
    ScrollView,
} from 'react-native';

import {
    Appbar,
    Surface,
    DataTable
} from 'react-native-paper';

import { LineChart } from 'react-native-chart-kit';

import FeatherIcon from 'react-native-vector-icons/Feather';

function TrainerInsights(props) {
    return (
        <Modal presentation="fullScreen" visible={props.isVisible} animationType="slide" animated={true}>
                    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                        <Appbar.Header style={{elevation: 0}} theme={{colors: {
                            primary: '#FFFFFF'
                        }}}>
                        <Appbar.BackAction onPress={() => props.closeModalMethod()}/>
                            <Appbar.Content title="Programs Dashboard" />
                          
                        </Appbar.Header>
                        <ScrollView contentContainerStyle={{flexGrow: 2, justifyContent: 'space-between'}}>

                    <View style={{padding: 10, alignItems: 'center', justifyContent: 'center', flex: 2, alignSelf: 'center',}}>
                            <Text style={{padding: 10, alignSelf: 'flex-start', fontFamily: 'ARSMaquettePro-Medium', fontSize: 20}}>
                                Activity
                            </Text>

                            <LineChart
                bezier
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jul", "Aug", "Sep"],
                  datasets: [
                    {
                      data: [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                      ]
                    }
                  ]
                }}
                width={Dimensions.get('window').width} // from react-native
                height={200}
                yAxisLabel="N"
                withHorizontalLabels={false}
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    strokeWidth: 0.5, 
                  backgroundColor: "#FFFFFF",
                  backgroundGradientFrom: "#FFFFFF",
                  backgroundGradientTo: "#FFFFFF",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 0) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 0) => `rgba(33, 150, 243, ${opacity})`,
                  style: {
                    borderRadius: 0
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  },
                  propsForBackgroundLines: {
                      backgroundColor: 'transparent',
                      color: 'transparent',
                      stroke: 'transparent',
                  }
                }}
                style={{
                  borderRadius: 0
                }}
              />
                        </View>

                        <View style={{flex: 2}}>
                            <View style={{padding: 10}}>
                            <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 20}}>
                            Overview
                        </Text>
                    <View style={{paddingTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Text>
                        <Text style={{fontSize: 15}}>
                            Gross:
                        </Text>
                        <Text style={{fontSize: 15}}>
                            $156.00
                        </Text>
                        </Text>

                        <Text>
                        <Text style={{fontSize: 15}}>
                            Net:
                        </Text>
                        <Text style={{fontSize: 15}}>
                            $156.00
                        </Text>
                        </Text>
                    </View>
  
                            </View>

                        <View style={{flex: 1}}>
                            <ScrollView horizontal contentContainerStyle={{alignItems: 'center'}}>
                                <Surface style={{margin: 5, elevation: 0, width: 135, height: 160, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="shopping-cart" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Sales
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                            10
                                        </Text>
                                    </View>
                                </Surface>

                                <Surface style={{margin: 5, elevation: 0, width: 135, height: 160, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="share-2" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Shares
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                            10
                                        </Text>
                                    </View>
                                </Surface>

                                <Surface style={{margin: 5, elevation: 0, width: 135, height: 160, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="eye" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Views
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                            10
                                        </Text>
                                    </View>
                                </Surface>

                            </ScrollView>
                        </View>
                        </View>
    
                        <View style={{flex: 1.5}}>
                        <Text style={{padding: 10, fontFamily: 'ARSMaquettePro-Medium', fontSize: 20}}>
                           Purchases
                        </Text>
                        <DataTable>
        <DataTable.Header>
          <DataTable.Title>User</DataTable.Title>
          <DataTable.Title >Purchase Date</DataTable.Title>
          <DataTable.Title >Program</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell> Elijah Hampton</DataTable.Cell>
          <DataTable.Cell >02/03/2020</DataTable.Cell>
          <DataTable.Cell>Rock Hard Glutes</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell> Elijah Hampton</DataTable.Cell>
          <DataTable.Cell >02/03/2020</DataTable.Cell>
          <DataTable.Cell>Rock Hard Glutes</DataTable.Cell>
        </DataTable.Row>



        <DataTable.Pagination
          page={1}
          numberOfPages={3}
          onPageChange={(page) => { console.log(page); }}
          label="1-1 of 1"
          
        />
      </DataTable>
                        </View>
                        </ScrollView>        
        </SafeAreaView>
        </Modal>
    )
}

export default TrainerInsights;