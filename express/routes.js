import { Router } from "express"
import getDb from "../lib/db.js"
import { ObjectId } from "mongodb"
import getConfig from "../lib/config.js"
import { getText } from '../lib/misc.js'

export const routes = Router()

//Requests all the documents stored on the DB
routes.route('/').get(async (req, res) => {
  res.json({ Users_registered : await getText() })
})

//Creates a document on "test" MongoDB with ID, Address, and NAme
routes.route('/save').post(async (req, res) => {
  let db = await getDb()
  await db.collection('test').updateOne(
    {_id: req.body.id},
    { $set: { name: req.body.name, address: req.body.address } },
    { upsert: true, })
  res.json()
})

routes.route('/is_mongo_express_enabled').get(async (req, res) => {
  const cfg = await getConfig()
  res.json(cfg.mongo_express_enabled)
})



export default routes
