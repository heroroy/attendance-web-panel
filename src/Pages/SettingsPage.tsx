import { useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";

import useClickOutside from "../hooks/useClickOutside";
import { ModifyBar } from "../Component/ModifyBar";
import { ClearDatabaseScreen } from "../Component/ClearDatabaseScreen";
import { Modal } from "../Component/Modal";
import { Button } from "../Component/Button";

export function SettingsPage() {
  const [teachers, setTeachers] = useState([
    "hironmoy.roy@rcciit.org.in",
    "hironmoy.roy@rcciit.org.in",
    "hironmoy.roy@rcciit.org.in",
    "hironmoy.roy@rcciit.org.in",
    "hironmoy.roy@rcciit.org.in",
    "hironmoy.roy@rcciit.org.in",
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState("");
  const [activeTab, setActiveTab] = useState<"modify" | "clear">("modify");

  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setShowModal(false));

  return (
    <div className="flex w-full h-screen">
      <aside className="w-1/6 border-r-2 border-r-primary border-opacity-15 p-4">
        <ModifyBar onSelectTab={setActiveTab} activeTab={activeTab} />
      </aside>

      <main className="flex-1 p-6">
        {activeTab === "modify" ? (
          <>
            <header className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Current Teachers</h1>
              <Button onClick={() => setShowModal(true)}>Add Teacher</Button>
            </header>

            <section className="grid grid-cols-3 gap-4">
              {teachers.map((email, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border p-3 rounded-lg shadow-sm"
                >
                  <span className="text-sm">{email}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {}}
                  >
                    <AiOutlineClose size={18} />
                  </button>
                </div>
              ))}
            </section>
          </>
        ) : (
          <ClearDatabaseScreen />
        )}
      </main>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Teacher"
      >
        <input
          type="email"
          placeholder="Enter teacher email"
          className="w-full border px-3 py-2 rounded mb-4 text-sm"
          value={newTeacher}
          onChange={(e) => setNewTeacher(e.target.value)}
        />
        <Button fullWidth onClick={() => {}}>
          Add
        </Button>
      </Modal>
    </div>
  );
}
