import { useState } from "react";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { database } from "../firebase";

export const useClearDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const clearDatabase = async (confirmText: string) => {
    if (confirmText !== "Confirm") {
      toast.warning("Please type 'Confirm' to delete.");
      return;
    }

    setIsLoading(true);

    try {
      const classesSnapshot = await getDocs(collection(database, "classes"));
      const subjectsSnapshot = await getDocs(collection(database, "subjects"));

      if (classesSnapshot.empty && subjectsSnapshot.empty) {
        toast.info(
          "No classes or subjects in the database. Please create them first."
        );
        setIsLoading(false);
        return;
      }

      if (!classesSnapshot.empty) {
        for (const doc of classesSnapshot.docs) {
          await deleteDoc(doc.ref);
        }
        toast.success("Classes have been deleted successfully.");
      }

      if (!subjectsSnapshot.empty) {
        for (const doc of subjectsSnapshot.docs) {
          await deleteDoc(doc.ref);
        }
        toast.success("Subjects have been deleted successfully.");
      }

      toast.success("Database cleared successfully!");
      setIsLoading(false);
    } catch (error) {
      console.error("Error clearing database: ", error);
      toast.error("An error occurred while clearing the database.");
      setErrorState("An error occurred while clearing the database.");
      setIsLoading(false);
    }
  };

  return { isLoading, errorState, clearDatabase };
};
