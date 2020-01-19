import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoggingService {

  constructor() { }

  // Hlavní funkce na logování
  // TODO: doplnit přepínač na logovat A/N
  log(source: string, message: string) {
    console.log(source.toUpperCase()+': '+message);
  }
}
