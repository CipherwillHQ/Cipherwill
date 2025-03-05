import Image from "next/image";
import placeholder_img from "./placeholder.png";
import SimpleButton from "@/components/common/SimpleButton";
import Link from "next/link";
import {
  MdEnhancedEncryption,
  MdNoEncryption,
  MdSecurity,
} from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { BiNotepad } from "react-icons/bi";
import { GiTimeTrap } from "react-icons/gi";

function InfoButton({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link href={href}>
      <button className="flex gap-2 hover:gap-3 items-center bg-primary hover:bg-primary-900 transition-all text-white px-8 py-2 rounded-full mt-4 w-full justify-center sm:w-fit">
        {icon}
        <span>{title}</span>
      </button>
    </Link>
  );
}

export default function Lifecycle() {
  return (
    <section className="max-w-7xl w-full mx-auto p-4 mt-28 flex flex-col gap-32 font-medium">
      <div className="flex flex-col md:flex-row justify-evenly gap-12 items-center">
        <div className="w-full md:w-1/2">
          <Image
            alt="image of onbaording and profile creation"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <div className="font-bold text-primary text-lg">Onboarding</div>
          <h2 className="font-bold text-4xl md:text-5xl py-4">
            Your First Steps with Cipherwill
          </h2>
          <ul className="list-disc list-inside space-y-1 text-lg">
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
      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12 items-center">
        <div className="w-full md:w-1/2 p-2">
          <div className="font-bold text-primary text-lg">Data</div>
          <h2 className="font-bold text-4xl md:text-5xl py-4">
            How Your Data is Organized?
          </h2>
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
      <div className="flex flex-col md:flex-row justify-evenly gap-12 items-center">
        <div className="w-full md:w-1/2">
          <Image
            alt="image of factors choices"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <div className="font-bold text-primary text-lg">Security</div>
          <h2 className="font-bold text-4xl md:text-5xl py-4">
            Your Keys, Your Control: Security Factors in Cipherwill
          </h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Think of security factors as different ways to encrypt your data
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
                is your secret passcode to decrypt your data, while the public
                key helps to encrypt it securely.
              </li>
            </ul>
            <InfoButton
              href={"/how-factors-work"}
              icon={<MdSecurity />}
              title="More about Security factors"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12 items-center">
        <div className="w-full md:w-1/2 p-2">
          <div className="font-bold text-primary text-lg">Encryption</div>
          <h2 className="font-bold text-4xl md:text-5xl py-4">
            How Cipherwill Uses Cascade Encryption?
          </h2>
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

            <InfoButton
              href={"/i/cascade-encryption"}
              icon={<GrSecure />}
              title="Learn more about Encryption"
            />
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

      <div className="flex flex-col md:flex-row justify-evenly gap-12 items-center">
        <div className="w-full md:w-1/2">
          <Image
            alt="will execuion schedule image"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <div className="font-bold text-primary text-lg">Schedule</div>
          <h2 className="font-bold text-4xl md:text-5xl py-4">
            How Cipherwill Knows When to Act?
          </h2>
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

            <InfoButton
              href={"/i/how-execution-timeline-works"}
              icon={<BiNotepad />}
              title="See how will execution works"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12 items-center">
        <div className="w-full md:w-1/2 p-2">
          <div className="font-bold text-primary text-lg">Activity</div>
          <h2 className="font-bold text-4xl md:text-5xl py-4">
            Communication is Key: Avoid Missed Check-Ins
          </h2>
          <div>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Communication is key with a dead man&apos;s switch, so it&apos;s
                super important to keep your email address updated.
              </li>
              <li>
                Don&apos;t rely on just one method - add multiple ways to be
                reached, like SMS, push notifications, and phone calls, to make
                sure you never miss a reminder.
              </li>
              <li>
                Cipherwill checks your activity on the platform to see if
                you&apos;re still around.
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
      <div className="flex flex-col md:flex-row justify-evenly gap-12 items-center">
        <div className="w-full md:w-1/2">
          <Image
            alt="onion layer with emphasis on time enc layer"
            width={1000}
            height={1000}
            src={placeholder_img}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <div className="font-bold text-primary text-lg">Timelock</div>
          <h2 className="font-bold text-4xl md:text-5xl py-4">
            Keeping Your Digital Will Secure Until It's Needed
          </h2>
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
            <InfoButton
              href={"/i/time-capsule-encryption"}
              icon={<GiTimeTrap />}
              title="Time Capsule Encryption"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-evenly gap-12 items-center">
        <div className="w-full md:w-1/2 p-2">
          <div className="font-bold text-primary text-lg">Beneficiry</div>
          <h2 className="font-bold text-4xl md:text-5xl py-4">
            Managing Beneficiary Access and Data Lifespan
          </h2>
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
                They can only see what you&apos;ve allowed, and their access
                lasts for about 100 days before your data is permanently
                deleted.
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
    </section>
  );
}
