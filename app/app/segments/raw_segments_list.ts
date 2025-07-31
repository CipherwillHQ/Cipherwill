import { Divider, Raw_Segment, Segment } from "@/types/Segments";

const segments_list: (Divider | Raw_Segment)[] = [
  {
    divider: "Data",
  },
  {
    title: "Notes",
    description: "Write down important notes, thoughts, personal life messages, and meaningful reflections.",
    path: "/app/data/notes",
    slug: "notes",
    metamodel_type: "NOTE",
    plan_required: "free",
    preference_key: null,
  },
  {
    title: "Email Accounts",
    description:
      "Email accounts serve as gateways to countless services - securely store all access details in one place.",
    path: "/app/data/email-accounts",
    slug: "email-accounts",
    metamodel_type: "EMAIL_ACCOUNT",
    plan_required: "free",
    preference_key: "segment_email_accounts",
  },
  {
    title: "Device locks",
    description:
      "Secure your device by storing lock screen codes, PINs, or passwords. Make sure your loved ones can access your devices.",
    path: "/app/data/device-locks",
    slug: "device-locks",
    metamodel_type: "DEVICE_LOCK",
    plan_required: "free",
    preference_key: "segment_device_locks",
  },
  // {
  //   icon: <TbSocial />,
  //   title: "Social Accounts",
  //   description:
  //     "Store your social accounts which will be useful for your loved ones to get access to.",
  //   path: "/app/coming-soon#feature=social-accounts",
  //   plan_required: "free",
  //   preference_key: "segment_social_accounts",
  // },

  // {
  //   icon: <BiMoneyWithdraw />,
  //   title: "Subscriptions",
  //   description:
  //     "Store your subscriptions which will be useful for your loved ones to get access to.",
  //   path: "/app/coming-soon#feature=subscriptions",
  //   plan_required: "free",
  //   preference_key: "segment_subscriptions",
  // },
  {
    title: "Passwords",
    description:
      "Securely store all your passwords in one location for easy transfer. Manage, update, and keep them protected as needed.",
    path: "/app/data/passwords",
    slug: "passwords",
    metamodel_type: "PASSWORD",
    plan_required: "free",
    preference_key: "segment_passwords",
  },
  // {
  //   divider: "Intellectual Property",
  // },
  // {
  //   icon: <GrDomain />,
  //   title: "Domain names",
  //   description:
  //     "Store your domain names which will be useful for your loved ones to get access to.",
  //   path: "/app/coming-soon#feature=domain-names",
  //   plan_required: "free",
  //   preference_key: "segment_domain_names",
  // },
  // {
  //   icon: <RiTrademarkLine />,
  //   title: "Trademarks",
  //   description:
  //     "Store your trademarks which will be useful for your loved ones to get access to.",
  //   path: "/app/coming-soon#feature=trademarks",
  //   plan_required: "free",
  //   preference_key: "segment_trademarks",
  // },
  // {
  //   icon: <HiOutlineDocumentChartBar />,
  //   title: "Patents",
  //   description:
  //     "Store your patents which will be useful for your loved ones to get access to.",
  //   path: "/app/coming-soon#feature=patents",
  //   plan_required: "free",
  //   preference_key: "segment_patents",
  // },
  // {
  //   divider: "Investments",
  // },
  // {
  //   icon: <GrGrow />,
  //   title: "Stocks",
  //   description:
  //     "Store all your major stock market investments, you can skip minor investments.",
  //   path: "/app/coming-soon#feature=stocks",
  //   plan_required: "free",
  //   preference_key: "segment_stocks",
  // },
  // {
  //   icon: <TbPigMoney />,
  //   title: "Savings",
  //   description: "Store your savings for seamless transfer",
  //   path: "/app/coming-soon#feature=savings",
  //   plan_required: "free",
  //   preference_key: "segment_savings",
  // },
  // {
  //   icon: <TbCoinBitcoin />,
  //   title: "Cryptocurrency",
  //   description: "Store your cryptocurrency for seamless transfer",
  //   path: "/app/coming-soon#feature=cryptocurrency",
  //   plan_required: "free",
  //   preference_key: "segment_cryptocurrency",
  // },
  // {
  //   icon: <AiOutlineFileProtect />,
  //   title: "Insurances",
  //   description: "Store your insurances for seamless transfer",
  //   path: "/app/coming-soon#feature=insurances",
  //   plan_required: "free",
  //   preference_key: "segment_insurances",
  // },
  {
    divider: "Web3 Finance",
    segment_group: ["segment_seed_phrases", "segment_defi_staking"],
  },
  {
    title: "Seed Phrases",
    description:
      "Safely store your cryptocurrency seed phrases in an encrypted vault. So it's easy to recover your wallets.",
    path: "/app/data/seed-phrases",
    slug: "seed-phrases",
    metamodel_type: "SEED_PHRASE",
    plan_required: "premium",
    preference_key: "segment_seed_phrases",
  },
  // {
  //   icon: <GiMoneyStack />,
  //   title: "Tokens",
  //   description: "Store your tokens for seamless transfer",
  //   path: "/app/coming-soon#feature=tokens",
  //   plan_required: "free",
  //   preference_key: "segment_tokens",
  // },
  // {
  //   icon: <GiMoneyStack />,
  //   title: "NFTs",
  //   description: "Store your NFTs for seamless transfer",
  //   path: "/app/coming-soon#feature=nfts",
  //   plan_required: "free",
  //   preference_key: "segment_nfts",
  // },
  {
    title: "DeFi Staking",
    description:
      "Store your DeFi staking investments. When the time comes, your loved ones will receive the details you've kept confidential.",
    path: "/app/data/defi-staking",
    slug: "defi-staking",
    metamodel_type: "DEFI_STAKING",
    plan_required: "premium",
    preference_key: "segment_defi_staking",
  },
  {
    divider: "Finance",
    segment_group: ["segment_bank_account", "segment_payment_cards"],
  },
  {
    title: "Bank Accounts",
    description:
      "Store your bank account access details and nominee information securely. Organize all your accounts in one place for clarity.",
    path: "/app/data/bank-accounts",
    slug: "bank-accounts",
    metamodel_type: "BANK_ACCOUNT",
    plan_required: "free",
    preference_key: "segment_bank_account",
  },
  // {
  //   icon: <HiOutlineWallet />,
  //   title: "Digital Wallets",
  //   description: "Store your digital wallet details for seamless transfer",
  //   path: "/app/coming-soon#feature=digital-wallets",
  //   plan_required: "free",
  //   preference_key: "segment_digital_wallets",
  // },
  {
    title: "Payment Cards",
    description:
      "Securely store your credit and debit card details to prevent unnecessary bills and subscriptions.",
    path: "/app/data/payment-cards",
    slug: "payment-cards",
    metamodel_type: "PAYMENT_CARD",
    plan_required: "free",
    preference_key: "segment_payment_cards",
  },
  {
    divider: "Storage",
    segment_group: ["segment_storage"],
  },
  {
    title: "File Storage",
    description:
      "Upload your essential documents, photos, and videos securely in our encrypted file vault.",
    path: "/app/data/storage",
    slug: "storage",
    metamodel_type: "FILE",
    plan_required: "premium",
    preference_key: "segment_storage",
  },
  // {
  //   divider: "Directives",
  // },
  // {
  //   icon: <TbHealthRecognition />,
  //   title: "Health Records",
  //   description: "Store your health records for seamless transfer",
  //   path: "/app/coming-soon#feature=health-records",
  //   plan_required: "free",
  //   preference_key: "segment_health_records",
  // },
  // {
  //   icon: <TbAlignBoxLeftStretch />,
  //   title: "General Wishes",
  //   description: "Store your general wishes for seamless transfer",
  //   path: "/app/coming-soon#feature=general-wishes",
  //   plan_required: "free",
  //   preference_key: "segment_general_wishes",
  // },
  // {
  //   icon: <TbComponents />,
  //   title: "Health Wishes",
  //   description: "Store your health wishes for seamless transfer",
  //   path: "/app/coming-soon#feature=health-wishes",
  //   plan_required: "free",
  //   preference_key: "segment_health_wishes",
  // },
  // {
  //   icon: <PiPlantLight />,
  //   title: "End of Life Plans",
  //   description: "Store your end of life plans for seamless transfer",
  //   path: "/app/coming-soon#feature=end-of-life",
  //   plan_required: "free",
  //   preference_key: "segment_end_of_life",
  // },
  // {
  //   divider: "Pet Care",
  // },
  // {
  //   icon: <PiDog />,
  //   title: "Registrations & Adoptions",
  //   description: "Store your registrations & adoptions for seamless transfer",
  //   path: "/app/coming-soon#feature=registrations",
  //   plan_required: "free",
  //   preference_key: "segment_registrations",
  // },
  // {
  //   icon: <PiBowlFood />,
  //   title: "Care Directives",
  //   description: "Store your care directives for seamless transfer",
  //   path: "/app/coming-soon#feature=care-directives",
  //   plan_required: "free",
  //   preference_key: "segment_care_directives",
  // },
];

export default segments_list;
