import Subject from "../Model/Subject.ts";
import firebase from "../firebase.ts";

export default class SubjectDataStore {

    private static subjects = firebase.firestore().collection("subjects")


    static addSubject(subject: Subject) {
        return this.subjects.doc(subject.id).set(subject)
    }

    static deleteSubject(subjectId: string) {
        return this.subjects.doc(subjectId).delete()
    }
}