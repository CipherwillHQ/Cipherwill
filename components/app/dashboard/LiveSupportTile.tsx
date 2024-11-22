import LiveChatBox from "../LiveChatBox";

export default function LiveSupportTile() {
  return (
    <div className="flex flex-col gap-2 border border-default rounded-md p-2 bg-secondary">
      <h2 className="font-semibold text-lg">Chat with us</h2>
      <div>
        We would love to hear from you. We are here to help you with any
        questions or concerns you may have.
      </div>

      <LiveChatBox className="w-full bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-300 text-white dark:text-black transition-colors duration-300 rounded-md flex items-center justify-center" />
    </div>
  );
}
