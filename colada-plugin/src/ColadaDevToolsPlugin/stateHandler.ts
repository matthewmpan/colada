import { piniaStores } from "../PiniaColadaPlugin/index"
import * as _ from "lodash"

// create storeHistory array and type it
const storeHistory: any = [];

const handleStoreChange = (snapshot: any) => {
  
  console.log('handling store change')
  const snapshotClone = _.cloneDeep(snapshot)

  // push to storeCache the updated state (which is the state argument)
  storeHistory.push({
    [snapshotClone.timestamp]: {
      [snapshotClone.key]: snapshotClone
    }
  })

  //we want to create a new timeline event
  //emit a custom event with the proxyObj as a payload
  const event: any = new CustomEvent('addTimelineEvent', {detail: snapshotClone})
  window.dispatchEvent(event)

  //post a message with the piniaObjs as the payload
  //send a messsage to the window for the extension to make use of
  const messageObj: any = {
    source: 'colada',
    payload: snapshotClone
  }
  window.postMessage(JSON.stringify(messageObj), "http://localhost:5173")   

  console.log('storeHistory at end of handleStoreChange', storeHistory)
}

// import the subscribe method and implement associated functionality 
const getState = () => {
  console.log('invoking getState!')
  piniaStores.subscribe(handleStoreChange)
}


// NOTE: currently 0(n) ... consider refactoring to use binary search
const getSnapshotbyTimestamp = (timestamp: number) => {
  for (const e of storeHistory){
    console.log(e)
    if (parseInt(Object.keys(e)[0]) === timestamp) return e;
  } 
}

// create getter to access a the MOST RECENT snapshotClone from storeHistory for inspector

export {
  getState,
  getSnapshotbyTimestamp
}
