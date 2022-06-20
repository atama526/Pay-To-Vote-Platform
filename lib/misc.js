import getDb from "./db.js"

export async function getTextOld() {
  return await getDb()
    .then(db =>
      db.collection('test').findOne({})
    )
    .then(row =>
      row?.text || "no data yet"
    )
    .catch(err =>
      console.log(err)
    )
}

//Requests all the Documents from MongoDB and returns them on an array
export const getText = async () => {
  const db = await getDb()
  const row = await db.collection('test').find().toArray()
  console.log(row)
  const name = row?.name || "no data yet"
  const address = row?.address || "no data yet"
  return row
}

//When called, returns the name linked with the address provided
export const getName = async (address) => {
  const db = await getDb()
  const row = await db.collection('test').findOne({trueAddress: address})
  console.log(row)
  const name = row?.name || "no data yet"
  return name
}
