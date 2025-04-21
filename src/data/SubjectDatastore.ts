import Subject from "../Model/Subject.ts";
import firebase from "../firebase.ts";
import {getUsersByIds } from "../redux/userSlice.ts";
import _  from "lodash";

export default class SubjectDataStore {

    private static subjects = firebase.firestore().collection("subjects")


    static addSubject(subject: Subject) {
        return this.subjects.doc(subject.id).set(subject)
    }

    static deleteSubject(subjectId: string) {
        return this.subjects.doc(subjectId).delete()
    }

    static getUser(id : string[]){

        const operations = _.chunk(id, 25).map(ids => getUsersByIds(ids))
        return Promise.all(operations).then(res=> {
            return _.flatten ( res )
        })

    }
}