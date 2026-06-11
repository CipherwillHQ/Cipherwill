/**
 * Important FAQ questions for the public-facing FAQ sections.
 * Owns the content, titles, custom icons, and slugs for the high-priority questions.
 * Does NOT own the display layouts or FAQ page structure.
 */

import Link from "next/link";
import { 
  FiClock, 
  FiUsers, 
  FiShield, 
  FiLock, 
  FiKey, 
  FiTerminal, 
  FiBriefcase, 
  FiUserX, 
  FiCloudOff, 
  FiCpu, 
  FiGlobe 
} from "react-icons/fi";

const name = "Important";
const questions = [
  {
    icon: <FiClock />,
    title:
      "How does Cipherwill verify my death before providing data to beneficiaries?",
    slug: "how-does-cipherwill-verify-my-death-before-providing-data-to-beneficiaries",
    description:
      "Cipherwill releases access to your data based on the will execution timeline and verification of your death or inactivity.",
    content: (
      <div>
        Cipherwill verifies your death or inactivity through a defined process
        tied to the{" "}
        <Link
          href={"/i/how-execution-timeline-works"}
          className="text-blue-600 hover:underline font-medium"
        >
          will execution timeline
        </Link>
        . If you do not check in within the set period, the system will release
        the time capsule keys to your designated beneficiaries.
        <br />
        <br />
        The keys provided allow your beneficiaries to unlock the data you've
        already uploaded. This ensures they can access your digital assets once
        the necessary conditions are met, based on your will's parameters and
        their relationship with you.
        <br />
        <br />
        This process is designed to respect your wishes and provide access only
        when verified, protecting your data and ensuring that it’s shared only
        at the appropriate time.
      </div>
    ),
  },
  {
    icon: <FiUsers />,
    title:
      "What happens if my beneficiaries aren't tech-savvy? Is there support for them to access the data?",
    slug: "what-happens-if-my-beneficiaries-arent-tech-savvy-is-there-support-for-them-to-access-the-data",
    description:
      "Cipherwill ensures that your beneficiaries, regardless of their tech skills, can easily access your data with minimal effort.",
    content: (
      <div>
        Your beneficiaries don't need to be tech-savvy. If your data consists of
        simple texts and messages, and you haven’t added a security factor,
        they’ll be given a dedicated dashboard to access your data easily. They
        just need the email address you’ve added as a beneficiary, and they can
        retrieve everything without any technical hurdles.
        <br />
        <br />
        If your beneficiary also has security factors enabled for their account,
        they will need their own security factor to decrypt the data you've
        encrypted for them.
        <br />
        <br />
        We’ve designed the system to be user-friendly, ensuring that your loved
        ones can access your legacy with ease, no matter their technical
        expertise. Also, for all beneficiaries there's always 24x7 live suppport
        from the dashboard and email.
      </div>
    ),
  },
  {
    icon: <FiShield />,
    title:
      "Can my data be accessed or subpoenaed by governments or law enforcement agencies?",
    slug: "can-my-data-be-accessed-or-subpoenaed-by-governments-or-law-enforcement-agencies",
    description:
      "Cipherwill ensures that your data is fully protected by encryption and can only be accessed by you or your beneficiaries.",
    content: (
      <div>
        If you've enabled a security factor, your data is fully encrypted and
        can only be accessed by you or your designated beneficiaries. Not even
        Cipherwill has access to your data.
        <br />
        <br />
        This means that no government, law enforcement agency, or any other
        entity can access or subpoena your data, as we cannot decrypt it without
        your security factors.
        <br />
        <br />
        Your data is in your control, and we ensure it remains secure under all
        circumstances.
      </div>
    ),
  },
  {
    icon: <FiLock />,
    title: "If Cipherwill gets hacked, can a hacker steal my data?",
    slug: "if-cipherwill-gets-hacked-can-a-hacker-steal-my-data",
    description:
      "Even if a hacker gets into Cipherwill's backend, your data stays safe. That's because your info isn't stored there directly. It's kept in separate object storage and databases. So, breaking into the backend doesn't mean they can see your data.",
    content: (
      <div>
        Even if a hacker gets into Cipherwill's backend, your data stays safe.
        That's because your info isn't stored there directly. It's kept in
        separate object storage and databases. So, breaking into the backend
        doesn't mean they can see your data.
        <br />
        <br />
        To get to your data, a hacker would need access to our storage provider,
        which is heavily protected. Even if they managed that, all they would
        find are encrypted files.
        <br />
        <br />
        Without your personal keys or security factors, those files are
        unreadable. They would just be looking at random scrambled text, making
        it impossible to access your private information.
      </div>
    ),
  },
  {
    icon: <FiKey />,
    title:
      "What happens if I forget my account credentials or lose access to my email?",
    slug: "what-happens-if-i-forget-my-account-credentials-or-lose-access-to-my-email",
    description:
      "Cipherwill provides options to recover your account depending on the situation with your credentials or email access.",
    content: (
      <div>
        If you forget your password, you can easily reset it through the
        password recovery process.
        <br />
        <br />
        If you lose access to your email but still remember your password, you
        can log in and update your email address directly in your account
        settings.
        <br />
        <br />
        If you forget or lose one of your security factors, you can log in with
        another active security factor and remove the first one, ensuring
        continued access to your account.
        <br />
        <br />
        However, if you only have one security factor enabled and lose or forget
        it, there is no way to recover your data as it's encrypted with that
        factor. In this case, you would need to reset your account and start
        fresh.
        <br />
        <br />
        <Link
          href={"/how-factors-work"}
          className="text-blue-600 hover:underline font-medium"
        >
          Learn more about How Security Factors Work?
        </Link>
      </div>
    ),
  },
  {
    icon: <FiTerminal />,
    title:
      "What if the person I added as a beneficiary hacks Cipherwill's servers?",
    slug: "what-if-the-person-i-added-as-a-beneficiary-hacks-cipherwill-servers",
    description:
      "If you add someone as a beneficiary in Cipherwill, they'll only inherit the data you specifically uploaded for them after you pass away. That's how the system is designed as each beneficiary only gets access to their assigned data.",
    content: (
      <div>
        If you add someone as a beneficiary in Cipherwill, they'll only inherit
        the data you specifically uploaded for them after you pass away. That's
        how the system is designed as each beneficiary only gets access to their
        assigned data.
        <br />
        <br />
        Now, let's imagine this beneficiary is a super hacker and somehow
        manages to hack Cipherwill. Even then, they can only access the data
        meant for them. This would happen because they have their own security
        factor and the time capsule key tied to their inheritance.
        <br />
        <br />
        However, they won't see any of the data you've uploaded for other
        beneficiaries or any other user information. So, the only risk is them
        seeing their portion early, nothing more.
      </div>
    ),
  },
  {
    icon: <FiBriefcase />,
    title:
      "What happens if a big company buys Cipherwill or there’s a merger or acquisition?",
    slug: "what-happens-if-a-big-company-buys-cipherwill-or-theres-a-merger-or-acquisition",
    description:
      "If you add someone as a beneficiary in Cipherwill, they'll only inherit the data you specifically uploaded for them after you pass away. That's how the system is designed as each beneficiary only gets access to their assigned data.",
    content: (
      <div>
        If a big company buys Cipherwill or there's a merger, nothing changes
        with how your data is handled. The platform's core function stays the
        same, and your data remains protected.
        <br />
        <br />
        All your information is encrypted using your security factors, which
        only you control. This means even if ownership changes, they still can't
        access your data.
        <br />
        <br />
        So, no matter who runs Cipherwill, your data stays locked down. The new
        owners will have no more access to your information than anyone else.
      </div>
    ),
  },
  {
    icon: <FiUserX />,
    title: "What if the team working on Cipherwill suddenly disappears?",
    slug: "what-if-the-team-working-on-cipherwill-suddenly-disappears",
    description:
      "Cipherwill's systems are designed to function independently, even if the core team is no longer available.",
    content: (
      <div>
        If the Cipherwill team were to suddenly disappear, the platform's{" "}
        <Link
          href={"/i/shard-switch"}
          className="text-blue-600 hover:underline font-medium"
        >
          Shard Switch mechanism
        </Link>{" "}
        ensures continuity. Critical information is securely distributed among
        trusted keyholders, who can activate contingency protocols to maintain
        operations.
        <br />
        <br />
        Your data remains protected as it’s encrypted with advanced security
        protocols, and no single individual or entity can access it. The
        system's decentralized design guarantees that your digital legacy is
        secure, regardless of unforeseen disruptions to the team.
      </div>
    ),
  },
  {
    icon: <FiCloudOff />,
    title:
      "How does Cipherwill ensure that beneficiaries can access the data even if the platform shuts down?",
    slug: "how-does-cipherwill-ensure-that-beneficiaries-can-access-the-data-even-if-the-platform-shuts-down",
    description:
      "Cipherwill’s Shard Switch mechanism and decentralized structure ensure that your data remains accessible even in the unlikely event that the platform shuts down.",
    content: (
      <div>
        Cipherwill’s{" "}
        <Link
          href={"/i/shard-switch"}
          className="text-blue-600 hover:underline font-medium"
        >
          Shard Switch
        </Link>{" "}
        system uses Shamir’s Secret Sharing, which splits key to Cipherwill
        Infrastructure into parts, each held by different keyholders. In the
        event that Cipherwill shuts down or is unavailable, keyholders can still
        collaborate to reconstruct the secret and redeploy infrasture or give
        necessary backup options to access the data.
        <br />
        <br />
        Additionally, the system includes contingency protocols that allow
        keyholders to securely share the necessary information with you about
        the situation and povide you with options to continue using Cipherwill,
        ensuring that your legacy is protected and accessible even if the
        platform itself is no longer operational.
        <br />
        <br />
        This decentralized, failsafe mechanism ensures your data’s continuity
        without reliance on the platform’s operational status.
      </div>
    ),
  },
  {
    icon: <FiCpu />,
    title: "What is the Shard Switch?",
    slug: "what-is-the-shard-switch",
    description:
      "The Shard Switch is Cipherwill's robust failsafe system to ensure uninterrupted operations, even in extreme scenarios.",
    content: (
      <div>
        The Shard Switch is a security mechanism that uses Shamir’s Secret
        Sharing, a cryptographic method that splits a secret into multiple
        parts. These parts are distributed among trusted keyholders, and a
        predefined number of these parts must be combined to reconstruct the
        original secret.
        <br />
        <br />
        Keyholders perform regular check-ins to confirm the system’s operational
        integrity. If they miss several check-ins or another activation trigger
        occurs, the system’s dead man’s switch engages, allowing keyholders to
        collaborate and restore critical operations.
        <br />
        <br />
        This ensures that Cipherwill’s platform remains secure and functional,
        even under unexpected circumstances, safeguarding users’ digital
        legacies.
        <br />
        <br />{" "}
        <Link
          href={"/i/shard-switch"}
          className="text-blue-600 hover:underline font-medium"
        >
          Learn more about Shard Switch
        </Link>{" "}
      </div>
    ),
  },
  {
    icon: <FiGlobe />,
    title:
      "Does Cipherwill comply with country-specific laws for digital asset inheritance?",
    slug: "does-cipherwill-comply-with-country-specific-laws-for-digital-asset-inheritance",
    description:
      "Currently, Cipherwill is focused on complying with laws related to digital data inheritance, with future plans to align with national inheritance laws.",
    content: (
      <div>
        At this stage, Cipherwill is primarily focused on complying with laws
        and regulations regarding the inheritance of digital assets and data. We
        ensure that your digital legacy is securely transferred to your
        designated beneficiaries based on the data you upload, following best
        practices for data protection and privacy.
        <br />
        <br />
        In the future, we plan to expand our compliance to align with the
        inheritance laws of different nations. This will ensure that the
        transfer of digital assets, including financial, legal, and physical
        property, complies with the specific inheritance requirements in each
        jurisdiction.
        <br />
        <br />
        Our goal is to provide a seamless and legally compliant experience for
        users across various countries, ensuring that your wishes for digital
        and physical asset inheritance are respected.
      </div>
    ),
  },
];

export { name, questions };
