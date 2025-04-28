import _ from "lodash";
import {database} from "../firebase.ts";
import User from "../Model/User.ts";

export default class UserDataStore {

    private static collection = database.collection("users")

    static getUsersById(id: string[]) {
        const getUsers = (ids: string[]) => this.collection
            .where('id', 'in', ids)
            .get()
            .then(result => result.docs)
            .then(docs => docs.map(doc => doc.data() as User))

        const operations = _.chunk(id, 25).map(getUsers)
        return Promise.all(operations).then(res => _.flatten(res))
    }
}