import { motion } from "framer-motion";
import { FiUser, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import SimpleButton from "@/components/common/SimpleButton";

export default function IncompleteProfile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex flex-col gap-4 border border-default rounded-xl p-6 bg-secondary"
    >
      {/* Header with icon */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-full">
          <FiUser className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">
            Complete Your Profile
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            One step to unlock your timeline
          </p>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10"
      >
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
          <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Missing information:</span> Your birth date is required to generate and view your personalized timeline schedule.
          </div>
        </div>
      </motion.div>

      {/* Action button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10"
      >
        <SimpleButton
          href="/app/profile"
          className="w-full justify-center gap-2 group"
          variant="primary"
        >
          <span>Update Profile</span>
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </SimpleButton>
      </motion.div>
    </motion.div>
  );
}
