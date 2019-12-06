/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer

import LUPA_DB from '../firebase/firebase.js';

const PACKS_COLLECTION = LUPA_DB.collection('packs');

//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const packsIndex = algoliaIndex.initIndex("dev_PACKS");

import UserController from './UserController';
let USER_CONTROLLER_INSTANCE;

class PacksController {
  private static instance : PacksController;

  private constructor() {
    USER_CONTROLLER_INSTANCE = UserController.getInstance();
  }

  static getInstance() {
      if (!PacksController.instance) {
          PacksController.instance = new PacksController();
          //One time initializaitons here..
      }

      return PacksController.instance;
  }

  indexPacksIntoAlgolia = async () => {
    let records = [];

    console.log('Indexing Packs Into Algolia');

    await PACKS_COLLECTION.get().then(docs => {
      docs.forEach(doc => {
              //Load pack from document
      let pack = doc.data();

      //Set object ID (although this may not be necessary)
      pack.objectID = doc.id;

      //Set necessary data for packs
      let packData = {
        packName: pack.name,
        packMembersByName: pack.membersByName,
        numPackMembers: pack.num_members,
        packRating: pack.rating,
        packSessionsCompleted: pack.sessions_completed,
        packTimeCreated: pack.timecreated,
        packEvents: pack.events,
        packLeaderNotes: pack.packLeaderNotes,
        isGlobal: pack.isGlobal,
        isSubscription: pack.isSubscription,
        isDefault: pack.isDefault
      }

      records.push(packData);

      });

      packsIndex.addObjects(records, (err, content) => {
        if (err) {
          console.log('Error while indexing packs into Algolia: ' + err);
        }

        console.log('Completed Packs Indexing');
      });
    });
  }

  getAllPacks() {
    console.log('Returning all Packs');
    
  }

  getDefaultPacks() {
   
  }

  /**
   * Subscription Based Offers
   */
  getSubscriptionBasedPacks() {

  }

  getGlobalPacks() {

  }

  getPacksByUser = async (userIn) : Promise<Object> => {
    let result;

    await PACKS_COLLECTION.where('membersByName', 'array-contains', userIn.accountInformation.username).get().then(res => {
      result = res;
    })

    //Figure out what is returning here
    console.log(result)

    return Promise.resolve(result);
  }

  getPackInformationByPackName(packName) {

  }

  getPackEventsByPackName(packName) {

  }

  isUserInPack() {

  }
}

export default PacksController;