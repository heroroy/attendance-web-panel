import { AiOutlineClose } from "react-icons/ai";
import { Button } from "../Component/Button";
import { ClearDatabaseScreen } from "../Component/ClearDatabaseScreen";
import { Modal } from "../Component/Modal";
import { ModifyBar } from "../Component/ModifyBar";

import { PopUp } from "../Component/PopUp";

import "react-toastify/dist/ReactToastify.css";
import useSettingsPageLogic from "../hooks/useSettingPage";

export function SettingsPage() {
  const {
    teachers,
    showModal,
    setShowModal,
    newTeacher,
    setNewTeacher,
    activeTab,
    setActiveTab,
    loading,
    error,
    showPopUp,
    selectedTeacherIndex,
    addTeacherError,

    handleCloseClick,
    handlePopUpClose,
    handlePopUpConfirmRemove,
    handleAddTeacher,
  } = useSettingsPageLogic();

  return (
    <div className="flex w-full h-screen relative">
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

            {loading && <p>Loading teachers...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <section className="grid grid-cols-3 gap-4">
                {teachers.map((email, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleCloseClick(index)}
                    >
                      <AiOutlineClose size={18} />
                    </button>
                  </div>
                ))}
                {teachers.length === 0 && <p>No other teachers added yet.</p>}
              </section>
            )}
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
          className="w-full border px-3 py-2 rounded mb-2 text-sm"
          value={newTeacher}
          onChange={(e) => setNewTeacher(e.target.value)}
        />
        {addTeacherError && (
          <p className="text-red-500 text-xs mb-2">{addTeacherError}</p>
        )}

        <Button fullWidth onClick={handleAddTeacher} disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            "Add"
          )}
        </Button>
      </Modal>

      {showPopUp && selectedTeacherIndex !== null && (
        <PopUp
          message={`Are you sure you want to remove ${teachers[selectedTeacherIndex]}?`}
          onClose={handlePopUpClose}
          onConfirm={handlePopUpConfirmRemove}
        />
      )}
    </div>
  );
}
