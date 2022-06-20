import { Router } from "express"
import getDb from "../lib/db.js"
import { ObjectId } from "mongodb"
import getConfig from "../lib/config.js"
import { getText } from '../lib/misc.js'
import Web3 from "web3";

let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/9e01c30991ad48a08b4394355cd459b3"))

export const routes = Router()

routes.route('/').get(async (req, res) => {
  res.json({ Users_registered : await getText() })
})


routes.route('/save').post(async (req, res) => {
  let db = await getDb()
  const address = await web3.eth.accounts.recover(req.body.name,req.body.signature)
  await db.collection('test').updateOne(
    {_id: req.body.id},
    { $set: { name: req.body.name, address: req.body.address, sign: req.body.signature, trueAddress: address } },
    { upsert: true, })
  res.json()
})

routes.route('/is_mongo_express_enabled').get(async (req, res) => {
  const cfg = await getConfig()
  res.json(cfg.mongo_express_enabled)
})



export default routes
