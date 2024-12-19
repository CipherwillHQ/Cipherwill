import Link from "next/link";
import { BiQuestionMark } from "react-icons/bi";

const name = "Important";
const questions = [
  {
    icon: <BiQuestionMark />,
    title: "If Cipherwill gets hacked, can a hacker steal my data?",
    slug: "if-cipherwill-gets-hacked-can-a-hacker-steal-my-data",
    description:
      "Even if a hacker gets into Cipherwill's backend, your data stays safe. That's because your info isn't stored there directly. It's kept in separate object storage and databases. So, breaking into the backend doesn't mean they can see your data.",
    content: (
      <div>
        Even if a hacker gets into Cipherwill's backend, your data stays
        safe. That's because your info isn't stored there directly.
        It's kept in separate object storage and databases. So, breaking into
        the backend doesn't mean they can see your data.
        <br />
        <br />
        Now, let's say a hacker somehow breaks into the storage or
        database. Even then, they can't read your data because it's
        encrypted. Your encryption is locked down with your own{" "}
        <Link
          href={"/how-factors-work"}
          className="text-blue-600 hover:underline font-medium"
        >
          security factors
        </Link>
        , making it unreadable without them.
        <br />
        <br />
        The only risk comes if you haven't enabled your security factors.
        If a hacker gets in and also manages to access the time capsule keys,
        your data could be at risk. But with security factors on, you're in
        the clear.
        <br />
        <br />
        So, the key takeaway? Always enable your security features. It's
        like adding an extra lock to keep hackers out. 💪🔐
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
    title:
      "What if the person I added as a beneficiary hacks Cipherwill's servers?",
    slug: "what-if-the-person-i-added-as-a-beneficiary-hacks-cipherwill-servers",
    description:
      "If you add someone as a beneficiary in Cipherwill, they'll only inherit the data you specifically uploaded for them after you pass away. That's how the system is designed as each beneficiary only gets access to their assigned data.",
    content: (
      <div>
        If you add someone as a beneficiary in Cipherwill, they'll only
        inherit the data you specifically uploaded for them after you pass away.
        That's how the system is designed as each beneficiary only gets
        access to their assigned data.
        <br />
        <br />
        Now, let's imagine this beneficiary is a super hacker and somehow
        manages to hack Cipherwill. Even then, they can only access the data
        meant for them. This would happen because they have their own security
        factor and the time capsule key tied to their inheritance.
        <br />
        <br />
        However, they won't see any of the data you've uploaded for
        other beneficiaries or any other user information. So, the only risk is
        them seeing their portion early, nothing more.
      </div>
    ),
  },
  {
    icon: <BiQuestionMark />,
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
];

export { name, questions };
