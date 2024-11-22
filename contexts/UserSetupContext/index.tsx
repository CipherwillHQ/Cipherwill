"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useAuth } from "../AuthContext";
import { useLazyQuery, useMutation } from "@apollo/client";
import ME from "../../graphql/ops/auth/queries/ME";
import logger from "../../common/debug/logger";
import getLocalCountry from "../../common/country/getLocalCountry";
import toast from "react-hot-toast";
import getCountryNameByCode from "../../common/country/getCountryNameByCode";
import UPDATE_USER from "../../graphql/ops/auth/mutations/UPDATE_USER";
import { useMixpanel } from "../MixpanelContext";
import { usePostHog } from "posthog-js/react";
import GET_PREFERENCES from "@/graphql/ops/auth/queries/GET_PREFERENCES";

interface Props {
  children?: ReactNode;
}
const UserSetupContext = createContext<any>({});

type UserResponse = {
  id: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  country: string;
  plan: string;
  created_at: string;
  updated_at: string;
};

export function UserSetupProvider({ children }: Props) {
  const { user } = useAuth();
  const mixpanel = useMixpanel();
  const posthog = usePostHog();
  const signup_conversion = useCallback(async () => {
    if ((window as any).GoogleConverted) {
      await (window as any).GoogleConverted();
    } else {
      console.log((window as any).GoogleConverted);
      logger.error("GoogleConverted is not defined");
    }
    // if ((window as any).uetq) {
    //   (window as any).uetq = (window as any).uetq || [];
    //   (window as any).uetq.push("event", "login", {});
    // }
    if (mixpanel) mixpanel.track("signup");
    posthog.capture("signup");
  }, [mixpanel]);
  const [setupPreferences, { data: preferences_data, loading:loading_preferences }] =
    useLazyQuery(GET_PREFERENCES);
  const [setupUser, { data: user_data, loading:loading_user }] = useLazyQuery(ME, {
    onCompleted(data) {
      const user_data = data.me;
      logger.info("User setup", user_data);
      if (user_data) {
        logger.info("Setting user preferences");
        setupPreferences();
      }
      const user_analytics_data = {
        name: user_data.first_name,
        gender: user_data.gender,
        plan: user_data.plan,
        country: user_data.country,
      };
      mixpanel.identify(user_data.id);
      mixpanel.people.set(user_analytics_data);
      posthog.identify(user_data.id, user_analytics_data);
      if (user_data.country === null) {
        // This is a new user, add their country
        signup_conversion();
        const country = getLocalCountry();
        const countryName = getCountryNameByCode(country);
        toast.success(`Added ${countryName} as your country`);
        setupCountry({
          variables: {
            data: {
              country,
            },
          },
        });
      } else {
        // This is an existing user, logging in
      }
    },
  });

  const [setupCountry] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (user) {
      setupUser();
    }
  }, [user, setupUser]);

  return (
    <UserSetupContext.Provider
      value={{
        loading : loading_user || loading_preferences,
        user: user_data ? (user_data.me as UserResponse) : null,
        preferences: preferences_data?.getPreferences || {},
      }}
    >
      {children}
    </UserSetupContext.Provider>
  );
}

export function useUserContext(): {
  loading: boolean;
  user: UserResponse | null;
  preferences: Record<string, string|boolean>;
} {
  return useContext(UserSetupContext);
}

export function useCurrentUserPlan() {
  const { user } = useUserContext();
  return user?.plan || "free";
}
