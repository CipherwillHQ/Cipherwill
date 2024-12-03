export default function SimpleExplainer() {
  return (
    <div className=" font-medium">
      <div>
        <h2 className="text-xl font-bold py-4">A Simple Overview</h2>
        <ol className="list-disc list-inside text-base space-y-4">
          <li>
            <strong>Create Your Digital Will</strong>
            <p>
              Start by completing your profile on Cipherwill. This will be the
              foundation for securely managing your important data.
            </p>
          </li>

          <li>
            <strong>Add and Save Your Data</strong>
            <p className="">
              Add your important information to Cipherwill, where it&apos;s
              stored as a &quot;data pod.&quot;
            </p>
          </li>
          <li>
            <strong>Data Encryption</strong>
            <p className="">Your data is encrypted on multiple levels:</p>
            <ul className="list-disc list-inside ml-4">
              <li>
                <strong>Personal Encryption:</strong> It&apos;s encrypted with
                your own security factors, so only you can access and update it.
              </li>
              <li>
                <strong>Time Capsule Encryption:</strong> This ensures that the
                data is only released to your beneficiaries in the future.
              </li>
              <li>
                <strong>Beneficiary Encryption:</strong> Each beneficiary&apos;s
                security factors further protect the data, allowing them access
                only when the time is right.
              </li>
            </ul>
          </li>
          <li>
            <strong>Beneficiary Access</strong>
            <p className="">
              Beneficiaries cannot access the data until they unlock the Time
              Capsule key. This key is only released if you are unable to update
              your Cipherwill for a period set by you.
            </p>
          </li>
          <li>
            <strong>Execution of the Will</strong>
            <p className="">
              If something happens to you and the will is executed, each
              beneficiary receives access to a special dashboard. They can log
              in with their account to securely access the data you’ve entrusted
              to them.
            </p>
          </li>
        </ol>
      </div>
      <br />
      <div>
        <h3 className="text-xl font-semibold my-2">Important Points</h3>
        <ul className="list-inside list-disc text-base space-y-4">
          <li>
            <strong>Device-Level Encryption:</strong> Your data is encrypted on
            your device before it&apos;s saved, ensuring the actual data never
            leaves your device without protection.
          </li>
          <li>
            <strong>Data Redundancy:</strong> Multiple copies of your data pods
            are made in our system to prevent loss from crashes, failures, or
            hacks.
          </li>
          <li>
            <strong>Ultimate Security:</strong> If you and your beneficiaries
            have enabled all security factors, it&apos;s impossible for anyone
            else to see your data. Only you, and your beneficiaries when the
            will is executed, have access.
          </li>
        </ul>
      </div>
    </div>
  );
}
