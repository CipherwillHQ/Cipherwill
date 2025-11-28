import { DateTime } from "luxon";
import CustomCipherwillInterval from "./CustomCipherwillInterval";
import Link from "next/link";
import SimpleButton from "@/components/common/SimpleButton";
import Timeline from "./Timeline";

export default function CycleDescription({
  birth_stamp,
  interval,
  last_accessed,
}: {
  birth_stamp: string;
  interval: number;
  last_accessed: string | null;
}) {
  const birthDate = new Date(parseInt(birth_stamp));

  const today = new Date();
  const age =
    today.getFullYear() -
    birthDate.getFullYear() -
    (today <
    new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
      ? 1
      : 0);

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

  return (
    <>
      <div className=" bg-secondary p-4 border border-default rounded-md w-full">
        <div className="flex justify-between items-center border-b border-default pb-4">
          <h2 className="font-semibold">Schedule (based on Birthdate)</h2>

          <SimpleButton href="/app/profile" className="text-sm">
            Edit profile
          </SimpleButton>
        </div>
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
        <div className=" flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row w-full justify-between items-center">
            <div className="text-sm opacity-70 font-medium">Birth date</div>
            <div className="text-sm" data-cy="next-update-date">
              {birthDate.toDateString()}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full justify-between items-center">
            <div className="text-sm opacity-70 font-medium">Next birthday</div>
            <div className="text-sm" data-cy="next-update-date">
              {upcomingBday.toDateString()}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 border border-default rounded-md bg-secondary">
        <div>
          <h2 className="font-semibold">Check In Interval</h2>
          <div className="text-sm lg:max-w-2xl opacity-80 font-medium pt-2">
            We will regularly check to see if you've logged into your Cipherwill
            account. If we notice that you haven't, we'll start sending you
            reminders based on our schedule, encouraging you to log in. If you
            still don't take any action after the reminders, we'll grant access
            of your data to your beneficiaries.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-secondary p-2 border border-default rounded-md w-full">
        <CustomCipherwillInterval interval={interval} />
        <div className="flex flex-col gap-3 border-b border-default p-2 pb-4 mb-2">
          {last_accessed && (
            <div className="flex flex-col sm:flex-row w-full justify-between items-center">
              <div className="text-sm opacity-70 font-medium">
                Last Check In was on
              </div>
              <div>
                {DateTime.fromMillis(parseInt(last_accessed))
                  .toJSDate()
                  .toDateString()}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row w-full justify-between items-center">
            <div className="text-sm opacity-70 font-medium">
              Next Check In is before
            </div>
            <div>
              {DateTime.now()
                .plus({ days: interval })
                .toJSDate()
                .toDateString()}{" "}
              ({interval} days)
            </div>
          </div>
        </div>
        <Timeline interval={interval} />
      </div>
    </>
  );
}
