import config from "../conf/conf.js";
import { Client, Account , ID} from "appwrite";

export class AuthService {
    client = new Client();
    account;
    constructor(){
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password,name}){
        try {
            const userAccount = await this.account.create(ID.unique(),email,password,name);
            if (userAccount) {
                //call another method for login
                return this.login({email,password});
            } else {
               return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailSession(email,password);
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite :serve :: getCurrentUser",error);
        }

        // if any error occurs like account is only not there
        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions ();
        } catch (error) {
            console.log("Appwrite :serve :: logout",error);
        }
    }

}

// here the object is created so whenever it is used further there is no need of destructuring in the format of object 
const authService = new AuthService();

export default authService;
