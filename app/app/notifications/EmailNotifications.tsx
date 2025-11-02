"use client";
import SimpleButton from "@/components/common/SimpleButton";
import { useUserContext } from "@/contexts/UserSetupContext";

export default function EmailNotifications() {
  const { user } = useUserContext();
  const userEmails = user?.email ? [user.email] : [];
  return (
    <div>
      <div className="flex justify-between pb-4">
        {/* <h2>Emails</h2> */}
        {/* <SimpleButton>Add email</SimpleButton> */}
      </div>
      {userEmails.length === 0 && (
        <p className="text-gray-500">No emails added yet.</p>
      )}
      <div className="flex flex-col gap-4">
        {userEmails.map((email, index) => (
          <div
            key={index}
            className="border border-default bg-secondary rounded-md p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between gap-2 pb-2">
              <h3 className="font-semibold text-lg">Email: {email}</h3>
              <div
              className="text-sm bg-primary/20 dark:bg-white/20 rounded-full px-4 text-center flex items-center justify-center border border-default font-semibold opacity-50"
              >Primary</div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Mandatory emails</div>
              <div className="">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Promotional emails</div>
              <div className="">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
