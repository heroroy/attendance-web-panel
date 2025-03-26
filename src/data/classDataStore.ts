import {database} from "../firebase.ts";
import {Class} from "../Model/Class.ts";
import firebase from "firebase/compat/app";
import FieldValue = firebase.firestore.FieldValue;



export default class ClassDataStore{

    static classInstance = database.collection("classes");
     static deleteClass(classId : string){
        return this.classInstance.doc(classId).delete();
    }

    static attendanceToggle(classInfo: Class, roll: string){
        const exists = classInfo?.attendees?.includes(roll)
        return this.classInstance.doc(classInfo?.id)
            .update({
                attendees: exists ? FieldValue?.arrayRemove(roll) : FieldValue?.arrayUnion(roll)
            })
    }

}


