import { useMutation, useQuery } from "@apollo/client";
import ConfirmationButton from "../../../components/common/ConfirmationButton";
import GET_NEXT_WILL_EVENT from "../../../graphql/ops/app/smartwill/queries/GET_NEXT_WILL_EVENT";
import getTimeRemaining from "../../../common/time/getTimeRemaining";
import FORCE_TRIGGER_NEXT_WILL_EVENT from "../../../graphql/ops/app/smartwill/mutations/FORCE_TRIGGER_NEXT_WILL_EVENT";
import RESET_WILL_EVENTS from "../../../graphql/ops/app/smartwill/mutations/RESET_WILL_EVENTS";

export default function WillEvents() {
  const [forceTriggerNextWillEvent] = useMutation(
    FORCE_TRIGGER_NEXT_WILL_EVENT
  );
  const [resetWillEvents] = useMutation(RESET_WILL_EVENTS);
  return (
    <div className="w-full max-w-2xl m-auto flex flex-col justify-center px-2">
      <h2 className="text-2xl font-semibold py-4">Will Events</h2>
      <p className="py-2 text-sm text-gray-500">
        This endpoints are only available in development or staging environment.
        Production environment will not have these endpoints.
      </p>
      <NextWillEvent />
      <div className="flex items-center justify-between py-2">
        <div>
          <div>Trigger upcoming event</div>
          <div className="text-sm text-gray-500">
            This will trigger the next event in your smartwill
          </div>
        </div>
        <ConfirmationButton
          data-cy="trigger-button"
          className="bg-red-500 hover:bg-red-700 text-white px-2 rounded"
          onConfirm={async () => {
            await forceTriggerNextWillEvent();
            window.location.reload();
          }}
        >
          Trigger
        </ConfirmationButton>
      </div>
      <div className="flex items-center justify-between py-2">
        <div>
          <div>Reset will events</div>
          <div className="text-sm text-gray-500">
            This will remove all will events and create a new one for birthdate
            update
          </div>
        </div>
        <ConfirmationButton
          data-cy="reset-events-button"
          className="bg-red-500 hover:bg-red-700 text-white px-2 rounded"
          onConfirm={async () => {
            await resetWillEvents();
            window.location.reload();
          }}
        >
          Reset
        </ConfirmationButton>
      </div>
    </div>
  );
}

function NextWillEvent() {
  const { loading, data, error } = useQuery(GET_NEXT_WILL_EVENT);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data.getNextWillEvent === null) return <div>No upcoming events</div>;
  const event = data.getNextWillEvent;
  return (
    <div className="border p-2 my-2" data-cy="next-will-event">
      <div className="font-semibold mb-2">Upcoming event</div>
      <div className="text-sm text-gray-500" data-cy="type">
        Type: <span>{event.type}</span>
      </div>
      <div className="text-sm text-gray-500" data-cy="execution-time">
        Date: <span>{getTimeRemaining(event.execution_time)}</span>
      </div>
      <div className="text-sm text-gray-500" data-cy="created-at">
        Created:{" "}
        <span>{new Date(parseInt(event.created_at)).toLocaleString()}</span>
      </div>
    </div>
  );
}
