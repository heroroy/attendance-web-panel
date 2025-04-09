import { useEffect, useRef, useState, useCallback } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { database } from "../firebase";
import useClickOutside from "../hooks/useClickOutside";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from "react-toastify";

interface EmailDocument {
  email: string;
}

function useSettingsPageLogic() {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [teacherIds, setTeacherIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState("");
  const [activeTab, setActiveTab] = useState<"modify" | "clear">("modify");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState<
    number | null
  >(null);
  const [addTeacherError, setAddTeacherError] = useState<string | null>(null);

  const profileState = useSelector((state: RootState) => state.auth);
  const signedInUser = profileState.profile;

  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setShowModal(false));

  const fetchTeachers = useCallback(() => {
    setLoading(true);
    const emailsCollection = collection(database, "emails");
    const orderedQuery = query(emailsCollection, orderBy("email"));

    const unsubscribe = onSnapshot(
      orderedQuery,
      (snapshot) => {
        const allEmails: string[] = [];
        const allIds: string[] = [];
        snapshot.forEach((doc) => {
          const userData = doc.data() as EmailDocument;
          if (userData?.email) {
            allEmails.push(userData.email);
            allIds.push(doc.id);
          }
        });
        const filteredTeachers = allEmails.filter(
          (email) => email !== signedInUser?.email
        );
        const filteredTeacherIds = allIds.filter(
          (_, index) => allEmails[index] !== signedInUser?.email
        );
        setTeachers(filteredTeachers);
        setTeacherIds(filteredTeacherIds);
        setLoading(false);
        setError(null);
        console.log("Emails updated (snapshot):", allEmails);
      },
      (err) => {
        console.error("Error listening for email updates:", err);
        setError("Failed to fetch emails in real-time.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [signedInUser?.email]);

  useEffect(() => {
    return fetchTeachers();
  }, [fetchTeachers]);

  const removeTeacherFromDatabase = useCallback(async (teacherId: string) => {
    try {
      const teacherDocRef = doc(database, "emails", teacherId);
      await deleteDoc(teacherDocRef);
      toast.success("Teacher removed successfully!");
      console.log(`Teacher with ID ${teacherId} removed.`);
    } catch (err) {
      console.error("Error removing teacher:", err);
      toast.error("Failed to remove teacher.");
      setError("Failed to remove teacher.");
      throw err;
    }
  }, []);

  const handleRemoveTeacher = useCallback(
    async (indexToRemove: number) => {
      if (loading) return;
      setLoading(true);
      try {
        const teacherToRemoveId = teacherIds[indexToRemove];
        if (teacherToRemoveId) {
          await removeTeacherFromDatabase(teacherToRemoveId);
        } else {
          console.error("Error: Teacher ID not found for removal.");
          toast.error("Could not find teacher to remove.");
          setError("Could not find teacher to remove.");
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, teacherIds, removeTeacherFromDatabase]
  );

  const handleCloseClick = useCallback((index: number) => {
    setShowPopUp(true);
    setSelectedTeacherIndex(index);
    console.log(`Close clicked for index: ${index}`);
  }, []);

  const handlePopUpClose = useCallback(() => {
    setShowPopUp(false);
    setSelectedTeacherIndex(null);
  }, []);

  const handlePopUpConfirmRemove = useCallback(() => {
    if (selectedTeacherIndex !== null) {
      handleRemoveTeacher(selectedTeacherIndex);
    }
    setShowPopUp(false);
    setSelectedTeacherIndex(null);
  }, [handleRemoveTeacher, selectedTeacherIndex]);

  const addTeacherToDatabase = useCallback(async (email: string) => {
    const emailsCollection = collection(database, "emails");
    await addDoc(emailsCollection, { email });
    toast.success("Teacher added!");
    console.log(`Teacher with email ${email} added.`);
  }, []);

  const handleAddTeacher = useCallback(async () => {
    if (loading) return;
    setAddTeacherError(null);
    const trimmedNewTeacher = newTeacher.trim();

    if (!trimmedNewTeacher) {
      setAddTeacherError("Please enter an email.");
      return;
    }

    if (!trimmedNewTeacher.endsWith("@rcciit.org.in")) {
      setAddTeacherError("Only @rcciit.org.in emails are allowed.");
      return;
    }

    setLoading(true);
    try {
      const emailsCollection = collection(database, "emails");
      const q = query(
        emailsCollection,
        where("email", "==", trimmedNewTeacher)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setAddTeacherError("Teacher with this email exists.");
      } else {
        await addTeacherToDatabase(trimmedNewTeacher);
        setNewTeacher("");
        setShowModal(false);
      }
    } catch (err) {
      console.error("Error adding teacher:", err);
      toast.error("Failed to add teacher.");
      setAddTeacherError("Failed to add teacher.");
    } finally {
      setLoading(false);
    }
  }, [loading, newTeacher, addTeacherToDatabase]);

  return {
    teachers,
    teacherIds,
    showModal,
    setShowModal,
    newTeacher,
    setNewTeacher,
    activeTab,
    setActiveTab,
    loading,
    error,
    showPopUp,
    setShowPopUp,
    selectedTeacherIndex,
    setSelectedTeacherIndex,
    addTeacherError,
    modalRef,
    handleRemoveTeacher,
    handleCloseClick,
    handlePopUpClose,
    handlePopUpConfirmRemove,
    handleAddTeacher,
  };
}

export default useSettingsPageLogic;
