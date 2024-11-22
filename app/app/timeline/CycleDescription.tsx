export default function CycleDescription({
  birth_stamp,
}: {
  birth_stamp: string;
}) {
  const birthDate = new Date(parseInt(birth_stamp));

  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  const upcomingBday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (today > upcomingBday) {
    upcomingBday.setFullYear(today.getFullYear() + 1);
  }

  const one_day = 24 * 60 * 60 * 1000;

  const daysLeft = Math.ceil(
    (upcomingBday.getTime() - today.getTime()) / one_day
  );

  const firstReminder = new Date(
    new Date(
      upcomingBday.getFullYear(),
      upcomingBday.getMonth(),
      upcomingBday.getDate()
    ).setDate(upcomingBday.getDate() + 3)
  );
  const SecondReminder = new Date(
    new Date(
      upcomingBday.getFullYear(),
      upcomingBday.getMonth(),
      upcomingBday.getDate()
    ).setDate(upcomingBday.getDate() + 30)
  );
  const LastReminder = new Date(
    new Date(
      upcomingBday.getFullYear(),
      upcomingBday.getMonth(),
      upcomingBday.getDate()
    ).setDate(upcomingBday.getDate() + 90)
  );
  const releaseDate = new Date(
    new Date(
      upcomingBday.getFullYear(),
      upcomingBday.getMonth(),
      upcomingBday.getDate()
    ).setDate(upcomingBday.getDate() + 100)
  );

  return (
    <div className=" bg-secondary p-4 border border-default rounded-md w-full">
      <h2 className="font-semibold">Schedule</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-4 border-b border-default mb-6">
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold py-2">
            {daysLeft}
            <span className="text-base font-semibold ml-1">days</span>
          </div>
          <div className="text-center">Until your next birthday</div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold py-2">
            {age}
            <span className="text-base font-semibold ml-1">years</span>
          </div>
          <div className="text-center">Your current age</div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold py-2">
            {age + 1}
            <span className="text-base font-semibold ml-1">years</span>
          </div>
          <div className="text-center">You will be on next birthday</div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row w-full justify-between items-center">
          <div className="text-sm font-medium text-gray-500">Next update event</div>
          <div className="text-sm" data-cy="next-update-date">
            {upcomingBday.toDateString()} (Next Birthday)
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between items-center">
          <div className="text-sm font-medium text-gray-500">
            First update reminder
          </div>
          <div className="text-sm">{firstReminder.toDateString()} (3 Days)</div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between items-center">
          <div className="text-sm font-medium text-gray-500">
            Second update reminder
          </div>
          <div className="text-sm">
            {SecondReminder.toDateString()} (30 Days)
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between items-center">
          <div className="text-sm font-medium text-gray-500">
            Last update reminder
          </div>
          <div className="text-sm">{LastReminder.toDateString()} (90 Days)</div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between items-center">
          <div className="text-sm font-medium text-gray-500">
            Will release to beneficiary
          </div>
          <div className="text-sm">{releaseDate.toDateString()} (100 Days)</div>
        </div>
      </div>
    </div>
  );
}
