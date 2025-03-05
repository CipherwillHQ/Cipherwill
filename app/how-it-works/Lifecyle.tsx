import Image from "next/image";
import placeholder_img from "./placeholder.png";
import SimpleButton from "@/components/common/SimpleButton";
import Link from "next/link";

export default function Lifecycle() {
  return (
    <section className="max-w-7xl w-full mx-auto p-4 mt-28 flex flex-col gap-32 font-medium">
      <div className="flex flex-col md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2">
          <Image
            alt="image of onbaording and profile creation"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h2 className="font-semibold text-xl py-2">Onboarding</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>First, sign up using your email address.</li>
            <li>Next, verify your email if not already verified.</li>
            <li>
              Since we mostly communicate through email, make sure it&apos;s
              correct and you keep an eye on it.
            </li>
            <li>
              Head over to your profile section and fill in your details, like
              your name and birthday, so you can view your timeline.
            </li>
            <li>
              Finally, take a look around the settings and dashboard to see
              everything available.
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2 p-2">
          <h2 className="font-semibold text-xl py-2">Data</h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                In Cipherwill, your data is organized into different types
                called segments - think of them like notes, files, passwords,
                and similar stuff.
              </li>
              <li>
                Every piece of data, or "datapod" as we call it, comes with some
                extra details like a title, version, and tags. This extra info
                isn&apos;t encrypted, which helps you easily search for and sort
                your data.
              </li>
              <li>
                The main content of each datapod, known as the data payload, is
                encrypted by you. That means only you can decrypt and access it.
              </li>
              <li>
                Plus, you can add photos, videos, files, and more to the object
                storage for a richer experience.
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            alt="segments snapshot"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2">
          <Image
            alt="image of factors choices"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h2 className="font-semibold text-xl py-2">Security</h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Think of security factors as different ways to lock up your data
                and keep it safe.
              </li>
              <li>
                In Cipherwill, you can choose from a variety of these methods,
                like using a password, FIDO2 keys, YubiKeys, on-device
                biometrics, crypto wallets, and more.
              </li>
              <li>
                They work by scrambling (encrypting) your data and then
                unscrambling (decrypting) it only when the right method is used,
                so only you and the people you authorize can access it.
              </li>
              <li>
                Essentially, these security measures create a pair of keys - a
                public one and a private one - from random data. The private key
                is your secret passcode to unlock your data, while the public
                key helps to lock it securely.
              </li>
            </ul>
            <Link href={"/how-factors-work"}>
              <button className="bg-primary text-white px-4 py-1 rounded-full mt-4">
                Learn more about security factors
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2 p-2">
          <h2 className="font-semibold text-xl py-2">Encryption</h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                We use AES-256 encryption along with Elliptic Curve Cryptography
                for data payloads and keys.
              </li>
              <li>
                Every datapod is encrypted with a unique key, and the key itself
                is encrypted with a public key of security factors you have
                enabled.
              </li>
              <li>
                Cipherwill encrypts the keys for multiple factors which includes
                your factors as well as your beneficiaries factors.
              </li>
              <li>
                Each data payload is encrypted multiple times which we call
                cascade encryption.
              </li>
              <li>
                Cascade encryption means your data gets wrapped in several
                layers of security. Even if one layer is broken, the rest keep
                your data safe.
              </li>
              <li>
                In CipherWill, your data is first encrypted with a "time capsule
                key" and then gets another layer of protection using the
                beneficiary&apos;s public key. This setup means you need both
                keys to decrypt your data.
              </li>
              <li>
                When it&apos;s time to unlock your data, you have to follow a
                specific order. You first use the beneficiary&apos;s private key
                to remove the first layer, then use the time capsule key to
                fully access the data.
              </li>
            </ul>

            <Link href={"/i/cascade-encryption"}>
              <button className="bg-primary text-white px-4 py-1 rounded-full mt-4">
                Learn more about cascade encryption
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            alt="will execuion schedule image"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2">
          <Image
            alt="will execuion schedule image"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h2 className="font-semibold text-xl py-2">Schedule</h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                A &quot;trigger&quot; is an event that kicks off the process of
                checking in to see if you&apos;re still around.
              </li>
              <li>
                Once the trigger goes off, your will execution schedule starts,
                which includes sending you three reminders at set times.
              </li>
              <li>
                Cipherwill will send you these reminders, asking you to log in
                and confirm that you&apos;re still alive.
              </li>
              <li>
                You&apos;ll receive these reminders through email, SMS, push
                notifications, and even phone calls if you&apos;ve enabled them.
              </li>
              <li>
                If you don&apos;t respond to any of these reminders, then
                CipherWill will proceed to execute the will as scheduled.
              </li>
            </ul>

            <Link href={"/i/how-execution-timeline-works"}>
              <button className="bg-primary text-white px-4 py-1 rounded-full mt-4">
                Learn more about will execution schedule
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2 p-2">
          <h2 className="font-semibold text-xl py-2">Activity</h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Communication is key with a dead man&apos;s switch, so it&apos;s super
                important to keep your email address updated.
              </li>
              <li>
                Don&apos;t rely on just one method - add multiple ways to be reached,
                like SMS, push notifications, and phone calls, to make sure you
                never miss a reminder.
              </li>
              <li>
                Cipherwill checks your activity on the platform to see if you&apos;re
                still around.
              </li>
              <li>
                This activity includes logging in, updating your profile, adding
                data, and similar actions.
              </li>
              <li>
                So, stay active on the platform to avoid accidentally triggering
                the will execution.
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            alt="notification image"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2">
          <Image
            alt="onion layer with emphasis on time enc layer"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h2 className="font-semibold text-xl py-2">Timelock</h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Time Capsule Encryption (TCE) mixes time controls with
                encryption so your data stays locked until the right moment.
              </li>
              <li>
                This is key for digital wills because it lets you decide exactly
                when beneficiaries can access sensitive info, keeping your
                privacy safe and avoiding complications.
              </li>

              <li>
                At Cipherwill, we update the time capsule keys every 90-180 days
                to keep everything secure while ensuring your data is available
                when needed.
              </li>

              <li>
                With TCE, your data gets two layers of protection—first,
                it&apos;s locked with a time capsule key, then with the
                beneficiary&apos;s public key—making sure only the right person
                can unlock it at the right time.
              </li>
            </ul>

            <Link href={"/i/time-capsule-encryption"}>
              <button className="bg-primary text-white px-4 py-1 rounded-full mt-4">
                Learn more about time capsule encryption
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12">
        <div className="w-full md:w-1/2 p-2">
          <h2 className="font-semibold text-xl py-2">Beneficiry</h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Beneficiaries are the people you choose to receive your data
                after you&apos;re gone.
              </li>
              <li>
                You can add several beneficiaries and set different access
                levels for each. You can change your beneficiary list anytime.
              </li>
              <li>
                They only get access once your will is executed, keeping your
                data private until then.
              </li>
              <li>
                When your will is executed, beneficiaries receive an email and
                access a special dashboard to view and download your data.
              </li>
              <li>
                They can only see what you&apos;ve allowed, and their access lasts
                for about 100 days before your data is permanently deleted.
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            alt="beneficiary dashboard image"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold py-4">Important facts</h2>
        <ul className="list-disc list-inside text-lg space-y-4">
          <li>
            <b>Public/Private Cryptography:</b> Cipherwill uses public/private
            key cryptography to ensure secure communication and data transfer
            between you and your beneficiaries.
          </li>
          <li>
            <b>AES Encryption:</b> Data pods are encrypted using 256 AES
            encryption, providing robust security against unauthorized access.
          </li>
          <li>
            <b>Secure Key Exchange:</b> A secure key exchange algorithm is used
            to create unique relationship key pairs for encryption, ensuring
            that keys are safely generated and distributed.
          </li>
          <li>
            <b>Elliptic Curve Cryptography:</b> Relationship keys are encrypted
            using Elliptic Curve Cryptography (ECC), offering strong security
            with smaller key sizes.
          </li>
          <li>
            <b>Cascade Encryption:</b> Cascade encryption is a multi-layered
            encryption method where data is encrypted sequentially using
            multiple keys or algorithms. Each layer adds an additional level of
            security, making it harder to decrypt without all required keys.
          </li>
          <li>
            <b>Security Factor Protection:</b> If you and your beneficiaries
            have security factors enabled, it is impossible for anyone,
            including Cipherwill, to access or decrypt your data.
          </li>
        </ul>
      </div>
    </section>
  );
}
