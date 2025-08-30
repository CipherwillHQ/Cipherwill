import { TbAlertTriangle, TbRefresh } from "react-icons/tb";
import SwitchThemeButton from "@/components/app/Sidebar/SwitchThemeButton";
import { useMutation } from "@apollo/client/react";
import REQUEST_ACCOUNT_REACTIVATION from "@/graphql/ops/auth/mutations/REQUEST_ACCOUNT_REACTIVATION";
import { useState } from "react";
import toast from "react-hot-toast";
import SimpleButton from "@/components/common/SimpleButton";
import type { RequestAccountReactivationMutation } from "@/types/interfaces/metamodel";

export default function DeactivatedUserWarning({
  inactive_user,
  logout,
}: {
  inactive_user: string;
  logout: () => void;
}) {
  const [isRequesting, setIsRequesting] = useState(false);

  const [requestReactivation] = useMutation<RequestAccountReactivationMutation>(REQUEST_ACCOUNT_REACTIVATION);

  const handleReactivationRequest = async () => {
    setIsRequesting(true);
    try {
      toast.loading("Reactivating account...");
      await requestReactivation();
      setTimeout(() => {
        setIsRequesting(false);
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      setIsRequesting(false);
      toast.error(`Failed to submit reactivation request: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 relative">
      {/* Theme Switch Toggle */}
      <div className="absolute top-4 right-4">
        <SwitchThemeButton />
      </div>

      <div className="w-full max-w-xl text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <TbAlertTriangle size={64} className="text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">
          Account Deactivated
        </h1>

        {/* Status */}
        <div className="mb-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            Account Status:
          </p>
          <span className="inline-block px-3 py-1 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            {inactive_user}
          </span>
        </div>

        {/* Description */}
        <div className="mb-8 space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Your account data has been removed from the system. This happens when
          your Cipherwill has triggered all the events in your will.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <SimpleButton
            onClick={handleReactivationRequest}
            disabled={isRequesting}
          >
            {isRequesting ? (
              <>
                <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white mx-2" />
                Requesting...
              </>
            ) : (
              <>
                <TbRefresh size={16} className="mx-2" />
                Request Reactivation
              </>
            )}
          </SimpleButton>

          <SimpleButton onClick={logout} variant="danger">
            Sign Out
          </SimpleButton>
        </div>
      </div>
    </div>
  );
}
