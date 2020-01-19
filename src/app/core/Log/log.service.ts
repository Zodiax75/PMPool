import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  // LOGGING - hlavní služba
  // * Loguje do příslušného úložiště
  // TODO Udělat rozbočku v případě, že chci mít různé verze kam logovat
  log(module: string, input: string) {
    console.log('LOG from '+module.toUpperCase()+': '+input);
  }

}
