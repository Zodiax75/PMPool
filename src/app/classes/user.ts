import { UserCustomData } from './UserCustomData';
// Main User data definition
export interface User {
   uid: string;
   email: string;
   customData: UserCustomData;
}
