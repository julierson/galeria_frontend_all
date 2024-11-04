import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class CriptoService {

  Criptografa(token: any, value: any) {
    const key = CryptoJS.enc.Utf8.parse(token);
    const iv = CryptoJS.enc.Utf8.parse(token);
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value), key, {
        keySize: 16,
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  }

  Descriptografa(token: any, value: any) {

    const key = CryptoJS.enc.Utf8.parse(token);
    const iv = CryptoJS.enc.Utf8.parse(token);

    return CryptoJS.AES.decrypt(
      value, key, {
        keySize: 16,
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
  }
}
