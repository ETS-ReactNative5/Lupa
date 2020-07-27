import UserController from './UserController';
import PacksController from './PacksController';
import SessionController from './SessionController';
import ProgramController from './ProgramController';

import LUPA_DB, { LUPA_AUTH} from '../firebase/firebase.js';
import WorkoutController from './WorkoutController';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';
import { getLupaUserStructure } from '../firebase/collection_structures';

const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const packsIndex = algoliaIndex.initIndex("dev_PACKS");
const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");

let USER_CONTROLLER_INSTANCE;
let PACKS_CONTROLLER_INSTANCE;
let SESSION_CONTROLLER_INSTANCE;
let NOTIFICATIONS_CONTROLLER_INSTANCE;
let PROGRAMS_CONTROLLER_INSTANCE;


export default class LupaController {
    private static _instance : LupaController;

    private constructor() {
       USER_CONTROLLER_INSTANCE = UserController.getInstance();
      PACKS_CONTROLLER_INSTANCE = PacksController.getInstance();
       SESSION_CONTROLLER_INSTANCE = SessionController.getInstance();
       PROGRAMS_CONTROLLER_INSTANCE = ProgramController.getInstance();
    }

    public static getInstance() {
      if (!LupaController._instance)
      {
        LupaController._instance = new LupaController();
        return LupaController._instance;
      }

      return LupaController._instance;
      return new LupaController()
    }

    isUserLoggedIn = async () => {
      let result;
      await LUPA_AUTH.currentUser == null ? result = false : result = true
    return result;
    }

    /***************** Firebase Storage *********** */
    saveUserProfileImage = async (imageURI) => {
      let url;

      await USER_CONTROLLER_INSTANCE.saveUserProfileImage(imageURI).then(result => {
        url = result;
      });

      return Promise.resolve(url);
    }

    getUserProfileImageFromUUID = async (uuid) => {
      let imageURI;
      await USER_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(uuid).then(result => {
        imageURI = result;
      });

      return Promise.resolve(imageURI);
    }

    savePackImage = async (string, uuid) => {
      let url;
      await PACKS_CONTROLLER_INSTANCE.savePackImage(string, uuid).then(data => {
        url = data;
      });

      return Promise.resolve(url);
    }

    savePackEventImage = (string, uuid) => {
      PACKS_CONTROLLER_INSTANCE.savePackEventImage(string, uuid);
    }

    getPackImageFromUUID = async (uuid) => {
      let link;
      await PACKS_CONTROLLER_INSTANCE.getPackImageFromUUID(uuid).then(result => {
        link = result;
      });

      return Promise.resolve(link);
    }

    getPackEventImageFromUUID = async (uuid) => {
      let link;
      await PACKS_CONTROLLER_INSTANCE.getPackEventImageFromUUID(uuid).then(result => {
        link = result;
      });

      return Promise.resolve(link);
    }
    /***************************** */

    /***********  App IO *************/

    runAppSetup = () => {
      this.indexApplicationData();
    }

    addLupaTrainerVerificationRequest = (uuid, certification, cert_number) => {
      let certInformation = {uuid, certification, cert_number};
      LUPA_DB.collection('trainer_request').doc(uuid).set(certInformation);
    }

    /********************** */
    getNotifications = async () => {
      let result;
      await NOTIFICATIONS_CONTROLLER_INSTANCE.getNotificationsFromUUID(this.getCurrentUser().uid).then(res => {
        result = res;
      });
      return Promise.resolve(result);
    }

    addNotification = (user, date, time, type, data) => {
      NOTIFICATIONS_CONTROLLER_INSTANCE.createNotification(user, date, time, type, data);
    }

    isUsernameTaken = async (val) => {
      let isTaken;
      USER_CONTROLLER_INSTANCE.isUsernameTaken(val).then(result => {
        isTaken = result;
      })

      return Promise.resolve(isTaken);
    }

    getCurrentUser = () => {
      let currentUser = USER_CONTROLLER_INSTANCE.getCurrentUser();
      return currentUser;
    }

    getCurrentUserData = async (uuid=0) => {
      let userData = {}
      await USER_CONTROLLER_INSTANCE.getCurrentUserData(uuid).then(result => {
        userData = result;
      });

      return Promise.resolve(userData);
    }

    getCurrentUserHealthData = async () => {
      let healthData;
      await USER_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
        healthData = result;
      });

      return Promise.resolve(healthData);
    }

    isTrainer = (userUUID) => {
      let isTrainer = USER_CONTROLLER_INSTANCE.isTrainer(userUUID);
      return isTrainer;
    }

    updatePack = (packID, attribute, value, optionalData=[]) => {
      PACKS_CONTROLLER_INSTANCE.updatePack(packID, attribute, value, optionalData);
    }

    updatePackEvent = (eventUUID, attribute, value, optionalData=[]) => {
      PACKS_CONTROLLER_INSTANCE.updatePackEvent(eventUUID, attribute, value, optionalData);
    }

    updateCurrentUser = (fieldToUpdate, value, optionalData) => {
      //validate data
      
      //pass to usercontroller
      USER_CONTROLLER_INSTANCE.updateCurrentUser(fieldToUpdate, value, optionalData);
    }

    updateProgramData = (programUUID, programData) => {
      PROGRAMS_CONTROLLER_INSTANCE.updateProgramData(programUUID, programData);
    }

    updateProgramWorkoutData = (programUUID, workoutData) => {
      PROGRAMS_CONTROLLER_INSTANCE.updateProgramWorkoutData(programUUID, workoutData);
    }

    getUserDisplayName = () => {
      return USER_CONTROLLER_INSTANCE.getUserDisplayName(true);
    }

    getUserPhotoURL = () => {
      return USER_CONTROLLER_INSTANCE.getUserPhotoURL(true);
    }

    completeSession = async (uuid) => {
      await SESSION_CONTROLLER_INSTANCE.completeSession(uuid);
    }

    addUserSessionReview = async (sessionUUID, userReviewingUUID, userToReviewUUID, reviewText, dateSubmitted) => {
      let retVal;
      await SESSION_CONTROLLER_INSTANCE.addUserSessionReview(sessionUUID, userReviewingUUID, userToReviewUUID, reviewText, dateSubmitted).then(res => {
        retVal = res;
      });

      return Promise.resolve(retVal);
    }

    createNewSession = async (attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp, locationData) => {
      await SESSION_CONTROLLER_INSTANCE.createSession(attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp, locationData);
    }

    getUserSessions = (currUser=true, uid=undefined) => {
      return SESSION_CONTROLLER_INSTANCE.getUserSessions(currUser, uid);
    }

    getUserInformationFromArray = async (arrOfUUIDS) => {
      let result;
      await USER_CONTROLLER_INSTANCE.getArrayOfUserObjectsFromUUIDS(arrOfUUIDS).then(objs => {
        result = objs;
      });

      return result;
    }

    getAttributeFromUUID = async (uuid, attribute) => {
      let result;
      await USER_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, attribute).then(res => {
        result = res;
      });
      return result;
    }

    getUUIDFromDisplayName  = async (displayName) => {
      let result;
      await USER_CONTROLLER_INSTANCE.getUserInformationFromDisplayName(displayName).then(snapshot => {
        result = snapshot.data();
      })

      let userUUID = result.uid;
      return userUUID;
    }
    /********************** */

    /* Algolia */
    indexApplicationData = () => {
     // USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
      //PACKS_CONTROLLER_INSTANCE.indexPacksIntoAlgolia();
     // USER_CONTROLLER_INSTANCE.indexProgramsIntoAlgolia();
    }

    indexUsers = async () => {
     // await  USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
    }

    indexPacks = async () => {
      //await PACKS_CONTROLLER_INSTANCE.indexPacksIntoAlgolia();
    }

    indexPrograms = async () => {
      //await USER_CONTROLLER_INSTANCE.indexProgramsIntoAlgolia();
    }

    /** Pack Functions */
    createNewPack = async (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, packImageSource, packVisibility) => {
      //validate data
      //call packs controller to create pack
      const packData = await PACKS_CONTROLLER_INSTANCE.createPack(packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, packImageSource, packVisibility);
      
      return Promise.resolve(packData);
    }

    createNewPackEvent = async (packUUID, title, description, date, eventImage) => {
      //validate data
      let payload;
      //call pack controller to create new event
      await PACKS_CONTROLLER_INSTANCE.createPackEvent(packUUID, title, description, date, eventImage).then(data => {
        payload = data;
      });

      return Promise.resolve(payload);
    }
    
    inviteUserToPacks = (packs, userUUID) => {
      //If the user didn't select any packs then there is no work to be done and we can just exit the function
      if (packs.length == 0)
      {
        return;
      }

      PACKS_CONTROLLER_INSTANCE.inviteUserToPacks(packs, userUUID);
    }

    getSubscriptionPacksBasedOnLocation = async location => {
      let subscriptionBasedPacks;
      await PACKS_CONTROLLER_INSTANCE.getSubscriptionPacksBasedOnLocation(location).then(result => {
        subscriptionBasedPacks = result;
      });

      return Promise.resolve(subscriptionBasedPacks);
    }

    /* User Functions */
    getTrainersBasedOnLocation = async location => {
      let trainersNearby;
      await USER_CONTROLLER_INSTANCE.getNearbyTrainers(location).then(result => {
        trainersNearby = result;
      });
      return Promise.resolve(trainersNearby);
    }
    getUsersBasedOnLocation = async location => {
      let nearbyUsers = [];
      await USER_CONTROLLER_INSTANCE.getNearbyUsers(location).then(result => {
        nearbyUsers = result;
      });

      return Promise.resolve(nearbyUsers);
    }
    getUserInformationByUUID = async (uuid) => {
      let userResult = getLupaUserStructure()

      if (typeof(uuid) == 'undefined') {
        return Promise.resolve(userResult);
      }

      await USER_CONTROLLER_INSTANCE.getUserInformationByUUID(uuid).then(result => {
        userResult = result;
      });

      return Promise.resolve(userResult)
    }

    getPackInformationByUserUUID = async (uuid) => {
      let userResult;
      await PACKS_CONTROLLER_INSTANCE.getPackInformationByUserUUID(uuid).then(result => {
        userResult = result;
      });

      return Promise.resolve(userResult)
    }

    /**
     * 
     */
    searchPrograms = async searchQuery => {
      const queries = [{
        indexName: 'dev_Programs',
        query: searchQuery,
        params: {
          hitsPerPage: 5,
        }
      }];

      return new Promise((resolve, rejects) => {
                let finalResults = new Array();

      algoliaIndex.search(queries).then(({results}) => {
        const programResults = results[0];

        try {
        for (let i = 0; i < programResults.hits.length; ++i)
        {
            finalResults.push(programResults.hits[i]);
        }
        } catch(err)
        {
          alert(err)
        }

        resolve(finalResults);
      })
      })
    }

    /**
     * 
     * @param searchQuery 
     */
    searchTrainersAndPrograms = (searchQuery) => {
      const queries = [{
        indexName: 'dev_USERS',
        query: searchQuery,
        params: {
          hitsPerPage: 5
        }
      }, {
        indexName: 'dev_Programs',
        query: searchQuery,
        params: {
          hitsPerPage: 5,
        }
      }];

      return new Promise((resolve, rejects) => {
                // perform 3 queries in a single API
                let finalResults = new Array();
      //  - 1st query targets index `categories`
      //  - 2nd and 3rd queries target index `products`

      algoliaIndex.search(queries).then(({results}) => {
        const userResults = results[0];
        const programResults = results[1];

        try {
                  //add the results we want from each into our final results array
        for (let i = 0; i < userResults.hits.length; ++i)
        {
           if (userResults.hits[i].isTrainer == true)
           {
            if (userResults.hits[i]._highlightResult.display_name.matchLevel == "full" 
            || userResults.hits[u]._highlightResult.username.matchLevel == "full")
            {
              userResults.hits[i].resultType = "User"
              finalResults.push(userResults.hits[i]);
            }
           }
        }

        for (let i = 0; i < programResults.hits.length; ++i)
        {
          programResults.hits[i].resultType = "Program"
            finalResults.push(programResults.hits[i]);
        }
        } catch(err)
        {
          alert(err)
        }

        resolve(finalResults);
      })
      })
    }

    /**
     * search
     * Performs search queries on all indices through algolia
     * @param searchQuery The query to search for
     * @return returns a promise with an array of objects that matched the query.
     * 
     * TODO: Save only necessary information into an object before pushing into final results array.
     */
    search = (searchQuery) => {
     /* let finalResults = new Array();

      const queries = [{
        indexName: 'dev_USERS',
        query: searchQuery,
        params: {
          hitsPerPage: 10
        }
      }, {
        indexName: 'dev_PACKS',
        query: searchQuery,
        params: {
          hitsPerPage: 10,
        }
      }];

      return new Promise((resolve, rejects) => {
                // perform 3 queries in a single API
                let finalResults = new Array();
      //  - 1st query targets index `categories`
      //  - 2nd and 3rd queries target index `products`
      algoliaIndex.search(queries, (err, { results = {}}) => {
        if (err) rejects(err);
      
        const userResults = results[0];
        const packResults = results[1];

        try {
                  //add the results we want from each into our final results array
        for (let i = 0; i < userResults.hits.length; ++i)
        {
          userResults.hits[i].isTrainer == true ?  userResults.hits[i].resultType="trainer" :  userResults.hits[i].resultType="user"
          if (userResults.hits[i]._highlightResult.display_name.matchLevel == "full" || userResults.hits[i]._highlightResult.username.matchLevel == "full" 
          || userResults.hits[i]._highlightResult.email.matchLevel == "full")
          {
            finalResults.push(userResults.hits[i]);
          }
        }

        for (let i = 0; i < packResults.hits.length; ++i)
        {
          packResults.hits[i].resultType = "pack"
          if (packResults.hits[i]._highlightResult.pack_title.matchLevel == "full")
          {
            finalResults.push(packResults.hits[i]);
          }
        }
        } catch(err)
        {
          
        }

        resolve(finalResults);
      });
      })*/
    
    }

    followUser = (uuidOfUserToFollow, uuidOfUserFollowing) => {
      USER_CONTROLLER_INSTANCE.followAccountFromUUID(uuidOfUserToFollow, uuidOfUserFollowing);
      USER_CONTROLLER_INSTANCE.addFollowerToUUID(uuidOfUserToFollow, uuidOfUserFollowing);
    }

    unfollowUser = (uuidofUserToUnfollow, uuidOfUserUnfollowing) => {
      USER_CONTROLLER_INSTANCE.unfollowAccountFromUUID(uuidofUserToUnfollow, uuidOfUserUnfollowing);
      USER_CONTROLLER_INSTANCE.removeFollowerFromUUID(uuidofUserToUnfollow, uuidOfUserUnfollowing)
    }

    getAllTrainers = async () => {
      let trainers;
      await USER_CONTROLLER_INSTANCE.getTrainers().then(result => {
        trainers = result;
      });

      return Promise.resolve(trainers);
    }

    /* Session Functions */
    getSessionInformationByUUID = async (uuid) => {
      let retVal;
      await SESSION_CONTROLLER_INSTANCE.getSessionInformationByUUID(uuid).then(result => {
        retVal = result;
      });

      return retVal;
    }

    updateSession = async (uuid, fieldToUpdate, value, optionalData="") => {
      await SESSION_CONTROLLER_INSTANCE.updateSessionFieldByUUID(uuid, fieldToUpdate, value, optionalData);
    }

    /* Pack Functions */
    /***************************Explore Page Pack Function  ****************************/

    getActivePacksBasedOnLocation = async (location) => {
      let explorePagePacks;
      await PACKS_CONTROLLER_INSTANCE.getActivePacksBasedOnLocation(location).then(result => {
        explorePagePacks = result;
      });

      return Promise.resolve(explorePagePacks);
    }

    getCommunityPacksBasedOnLocation = async (location) => {
      let explorePagePacks;
      await PACKS_CONTROLLER_INSTANCE.getCommunityPacksBasedOnLocation(location).then(result => {
        explorePagePacks = result;
      });

      return Promise.resolve(explorePagePacks);
    }

    /***********************************************************************************/
    getCurrentUserPacks = async () => {
      let userPacks;
      
      //Get all packs for the current user
      await PACKS_CONTROLLER_INSTANCE.getCurrentUserPacks().then(currUserPacksData => {
        userPacks = currUserPacksData;
      });

      return userPacks;
    }

    getSubscriptionPacks = async () => {
      let result;
      await PACKS_CONTROLLER_INSTANCE.getSubscriptionBasedPacks().then(packs => {
        result = packs;
      });

      return result;
    }

    getExplorePagePacks = async () => {
      let result;
      await PACKS_CONTROLLER_INSTANCE.getExplorePagePacks().then(packs => {
        result = packs;
      });

      return result;
    }

    getDefaultPacks = async () => {
      let result;

      await PACKS_CONTROLLER_INSTANCE.getDefaultPacks().then(packs => {
        result = packs;
      });

      return result;
    }

    getCurrentUserDefaultPacks = async () => {
      let defaultPacks = [];
      await PACKS_CONTROLLER_INSTANCE.getCurrentUserDefaultPacks().then(result => {
        defaultPacks = result;
      });

      return Promise.resolve(defaultPacks)

    }

    requestToJoinPack = (userUUID, packUUID) => {
      PACKS_CONTROLLER_INSTANCE.requestToJoinPack(userUUID, packUUID);
    }

    acceptPackInviteByPackUUID = (packUUID, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.acceptPackInviteByPackUUID(packUUID, userUUID);
    } 

    declinePackInviteByPackUUID = (packUUID, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.declinePackInviteByPackUUID(packUUID, userUUID);
    }

    getPackInvitesFromUUID = async (uuid) => {
      let packInvites = [];
      await PACKS_CONTROLLER_INSTANCE.getPackInvitesFromUUID(uuid).then(result => {
        packInvites = result;
      });

      return Promise.resolve(packInvites);
    }

    getPackInformationByUUID = async (uuid) => {
      let result = [];
      await PACKS_CONTROLLER_INSTANCE.getPackInformationByUUID(uuid).then(packs => {
        result = packs;
      });

      return Promise.resolve(result);
    }

    getPackEventsByUUID = async (id) => {
      let result = new Array();

      if (id != undefined)
      {
        await PACKS_CONTROLLER_INSTANCE.getPackEventsByUUID(id).then(packs => {
          result = packs;
        });
      }

      return Promise.resolve(result);
    }

    removeUserFromPackByUUID = (packUUID, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.removeUserFromPackByUUID(packUUID, userUUID);
    }

    setUserAsAttendeeForEvent = (packEventUUID, packEventTitle, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.attendPackEvent(packEventUUID, packEventTitle, userUUID);
    }

    removeUserAsAttendeeForEvent = (packEventUUID, packEventTitle, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.unattendPackEvent(packEventUUID, packEventTitle, userUUID);
    }

    userIsAttendingPackEvent = async (packEventUUID, packEventTitle, userUUID) => {
      let result;
      await PACKS_CONTROLLER_INSTANCE.isAttendingPackEvent(packEventUUID, packEventTitle, userUUID).then(bool => {
        result = bool;
      });

      return Promise.resolve(result);
    }

    getPacksEventsFromArrayOfUUIDS = async (arr) => {
      let packEventsData;
      await PACKS_CONTROLLER_INSTANCE.getPacksEventsFromArrayOfUUIDS(arr).then(result => {
        packEventsData = result;
      });

      return Promise.resolve(packEventsData);
    }

    /** Goals **/
    addGoalForCurrentUser = (goalUUID) => {
      USER_CONTROLLER_INSTANCE.updateCurrentUser('goals', goalUUID, 'add');
    }

    removeGoalForCurrentUser = (goalUUID) => {
      USER_CONTROLLER_INSTANCE.updateCurrentUser('goals', goalUUID, 'remove');
    }

    createNewProgram = async (uuid) => {
     USER_CONTROLLER_INSTANCE.createProgram(uuid)
    }

    saveProgram = async (programUUID) => {

      let res;
       await USER_CONTROLLER_INSTANCE.saveProgram(programUUID).then(result => {
        res = result;
       })

       return Promise.resolve(res);
    }

    deleteUserProgram = async (programUUID, userUUID) => {
      await USER_CONTROLLER_INSTANCE.deleteUserProgram(programUUID, userUUID);
    }

    handleSendUserProgram = (currUserData, userList, program) => {
       
      try {
        USER_CONTROLLER_INSTANCE.handleSendUserProgram(currUserData, userList, program);
          } catch(err) {
            alert(err)
        }
    }

    deleteProgram = async (user_uuid, programUUID) => {
      await USER_CONTROLLER_INSTANCE.deleteProgram(user_uuid, programUUID);
    }

    createService = (serviceObject) => {
      USER_CONTROLLER_INSTANCE.createService(serviceObject);
    }
    
    loadCurrentUserPrograms = async () => {
      let programsData = []

      await USER_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
        programsData = result;
      })

      return Promise.resolve(programsData);
    }

    loadCurrentUserServices = async () => {
      let servicesData;

      await USER_CONTROLLER_INSTANCE.loadCurrentUserServices().then(result => {
        servicesData = result;
      });

      return Promise.resolve(servicesData);
    }

    loadWorkouts = () => {
      let workoutData = PROGRAMS_CONTROLLER_INSTANCE.loadWorkouts();
      return workoutData;
    }

    loadAssessments = () => {
      const ASSESSMENTS = require('../../model/data_structures/assessment/json/assessments.json')
      return ASSESSMENTS.lupa_assessments;
    }

    getPrivateChatUUID = async (currUserUUID, userTwo) => {
      let result;
      await USER_CONTROLLER_INSTANCE.getPrivateChatUUID(currUserUUID, userTwo).then(chatUUID => {
        result = chatUUID;
      });

      return Promise.resolve(result);
    }

    getAllCurrentUserChats = async () => {
      let result;
      await USER_CONTROLLER_INSTANCE.getAllCurrentUserChats().then(chats => {
        result = chats;
      });

      return Promise.resolve(result);
    }

    getSuggestedTrainers = async () => {
      let suggestedTrainers;

      await SESSION_CONTROLLER_INSTANCE.getSuggestedTrainers().then(trainers => {
        suggestedTrainers = trainers;
      });

      return Promise.resolve(suggestedTrainers);
    }

    getUpcomingSessions = async (isCurrentUser, user_uuid) => {
      let upcomingSessions;
      await SESSION_CONTROLLER_INSTANCE.getUpcomingSessions(true, user_uuid).then(sessions => {
        upcomingSessions = sessions;
      });

      return Promise.resolve(upcomingSessions);
    }

    submitAssessment = async (assessmentObject) => {
      if (typeof(assessmentObject) != "object")
      {
        return;
      }

      //assign assessment to current user
      let currUser = await USER_CONTROLLER_INSTANCE.getCurrentUserUUID();

      assessmentObject.user_uuid = currUser;
      assessmentObject.complete = 'true'

      const assessment_uuid = assessmentObject.assessment_acronym + "_" + currUser;

      //add assessment to database and get assessment document ID
      await LUPA_DB.collection('assessments').doc(assessment_uuid).set(assessmentObject);

      //pass to user controller to add assessment id for user
      await USER_CONTROLLER_INSTANCE.addAssessment(assessment_uuid);
    }

    getUserAssessment = async (acronym, user_uuid) => {
      let assessment;
      await USER_CONTROLLER_INSTANCE.getUserAssessment(acronym, user_uuid).then(result => {
        assessment = result;
      });

      return Promise.resolve(assessment);
    }

        /* designing programs */
        saveProgramWorkoutGraphic = async (workout, programUUID, graphicType, uri) => {
          let newURI;
          await USER_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(workout, programUUID, graphicType, uri).then(res => {
            newURI = res;
          });

          return Promise.resolve(newURI);
      }

      getUserNotifications = async (uuid) => {
        if (typeof(uuid) == 'undefined' || typeof(uuid) != 'string') {
          return Promise.resolve([])
        }

       let queue = []

       await USER_CONTROLLER_INSTANCE.getUserNotificationsQueue(uuid).then(queueResults => {
        queue = queueResults;
        })

        return Promise.resolve(queue);
      }

      getFeaturedPrograms = async () => {
        let retVal = []

        await USER_CONTROLLER_INSTANCE.getFeaturedPrograms().then(result => {
          retVal = result;
        });

        return Promise.resolve(retVal);
      }

      purchaseProgram = async (currUserData, programData) => {
        let updatedProgram;
        await USER_CONTROLLER_INSTANCE.purchaseProgram(currUserData, programData).then(retVal => {
          updatedProgram = retVal;
        })

        return Promise.resolve(updatedProgram)
      }

      /**
     * Returns an object representing a Lupa Program
     * See LupaProgramStructure
     * 
     * @return Object representing a LupaProgramStructure
     */
    getProgramInformationFromUUID = async (uuid) => {
      let retVal = getLupaProgramInformationStructure()

      if (typeof uuid != 'string' || typeof(uuid) == 'undefined'){
        return Promise.resolve(retVal)
      }

      await PROGRAMS_CONTROLLER_INSTANCE.getProgramInformationFromUUID(uuid).then(result => {
        retVal = result;
      });

      return Promise.resolve(retVal);
    }

    addEntryToWorkoutLog = (entry) => {
      USER_CONTROLLER_INSTANCE.addEntryToWorkoutLog(entry);
    }

    toggleProgramBookmark = (userUUID, programUUID) => {
      USER_CONTROLLER_INSTANCE.toggleProgramBookmark(userUUID, programUUID)
    }

    getBookmarkedPrograms = async () => {
      let data = []

      await USER_CONTROLLER_INSTANCE.getBookmarkedPrograms().then(result => {
        data = result;
      });

      return Promise.resolve(data);
    }

    getPacksWithoutParticipatingUUID = async (userUUID) => {
      let data = []
      await PACKS_CONTROLLER_INSTANCE.getPacksWithoutParticipatingUUID(userUUID).then(result => {
        data = result;
      });

      return Promise.resolve(data);
    }
      
}
