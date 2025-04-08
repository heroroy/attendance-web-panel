import { useState } from "react";
import { Button } from "./Button";
import { ButtonVariant } from "../Util/ButtonTypes";


export function ClearDatabaseScreen() {
  const [confirmText, setConfirmText] = useState("");
  function handleClear() {
    if (confirmText === "Confirm") alert("Database cleared!");
    else alert("Please type 'Confirm'");
  }
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-red-600 mb-2">Clear Database</h2>

      <p className="mb-4 text-sm max-w-md">
        Clearing the database will permanently remove all classes and subjects
        created by teachers. This action cannot be undone.
      </p>
      <input
        type="text"
        placeholder="Type 'Confirm' to delete"
        className="w-64 border py-2 px-3 rounded mb-4 text-center"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
      />
      <Button variant={ButtonVariant.Danger} onClick={handleClear}>
        Clear Database
      </Button>
    </div>
  );
}
