import express, { Request, Response } from 'express'
import { ConnectDB } from './config/db';
import Mod from './model/Mod';
import Room from './model/Room';
import User from './model/User';

ConnectDB.connect()

const app = express();
app.use(express.json());

app.get('/mod',async(req: Request, res: Response) => {
  await Mod.create(new Mod({
    mod_name: 'vinh',
    state: 'busy'
  }))
  const data = await Mod.find({})
  res.send(data)
})

app.get('/user',async(req: Request, res: Response) => {
  await User.create(new User({
    user_name: 'noob'
  }))
  const data = await User.find({})
  res.send(data)
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});