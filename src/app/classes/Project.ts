import { RouterStateSnapshot } from '@angular/router';
import { first } from 'rxjs/operators';
export class Project {
    public name: string;
    public pm: string;
    public status: string;
    public from: Date;
    public to: Date;
    public allocation: number;
    public id: string;
    public color: string;
    public percentDone: string;
    public ppp: string;

    constructor(id: string, name: string, pm: string, status: string, from: string, to: string, allocation: number) {
        this.id = id;
        this.name = name;
        this.pm = pm;
        this.status = status;
        this.from = new Date(Date.parse(from));
        this.to = new Date(Date.parse(to));
        this.allocation = allocation;
        this.color = this.GetProjectColor(this.status); // nastav projektovou barvu
        this.percentDone = this.GetPercentDone()+'%';
    }

    // vrací true pokud projekt podle statusu běží
    public IsProjectRunning(): boolean {
        switch(status) {
            case 'Běží': 
            case 'Čeká na schválení':
                return(true);
            case 'Čeká':
            case 'Stojí':
            case 'Zrušen':
            case 'Dodán':
                return(false);
        }
    }

    // vrací kolik % bylo už odpracováno
    public GetPercentDone(): number {
        // celkový počet dní od začátku do konce projektu
        const diff = Math.round(Math.abs((this.from.getTime() - this.to.getTime())/(1000*60*60*24)))    

        // celkový počet dní od začátku do současného dne
        const diff1 = Math.round(Math.abs((this.from.getTime() - new Date().getTime())/(1000*60*60*24)))          

        return(Math.round((diff1*100)/diff));
   }

   // nastavuje barvu podle stavu projektu
   private GetProjectColor(status: string) {
    switch(status) {
        case 'Běží': 
            return('green');
        case 'Čeká na schválení':
            return('blue');
        case 'Stojí':
        case 'Zrušen':
        case 'Dodán':
            return('gray');
        case 'bez informací':
        case 'Čeká':
            return('red');
    }
   }
}
