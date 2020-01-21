// custom data for user that are not stored within Firebase authentication data
export interface UserCustomData {
    displayName: string,
    photoURL: string,
    role: string,
    isAdmin: boolean
}
