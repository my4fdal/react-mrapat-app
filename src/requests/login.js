import Axios from 'axios';
import Info from 'react-native-device-info';
import {Authenticate} from '../storage/authenticate';
import {Profile} from '../storage/profile';
import {URL_API_LOGIN} from './keys';

export class Login {
  constructor({nip, password}) {
    this.nip = nip;
    this.password = password;
    this.response = {};
    this.data = {};
  }

  static make = async ({nip, password}) => {
    let phoneKey = Info.getUniqueId();

    this.response = await Axios.post(URL_API_LOGIN, {
      nip,
      password,
      phone_key: phoneKey,
    });

    let {
      data: {data},
    } = this.response;

    let {pegawai} = data;

    // sync with local storage
    await new Authenticate({data, nip, password, phoneKey}).store();
    await new Profile(pegawai).store();

    this.data = data;

    return this;
  };
}
