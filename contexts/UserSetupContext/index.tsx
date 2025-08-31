"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useAuth } from "../AuthContext";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import ME from "../../graphql/ops/auth/queries/ME";
import logger from "../../common/debug/logger";
import getLocalCountry from "../../common/country/getLocalCountry";
import toast from "react-hot-toast";
import getCountryNameByCode from "../../common/country/getCountryNameByCode";
import UPDATE_USER from "../../graphql/ops/auth/mutations/UPDATE_USER";
import { useMixpanel } from "../MixpanelContext";
import { usePostHog } from "posthog-js/react";
import GET_PREFERENCES from "@/graphql/ops/auth/queries/GET_PREFERENCES";
import type { 
  MeQuery, 
  UpdateUserMutation, 
  UpdateUserVariables,
  GetPreferencesQuery,
  User
} from "@/types/interfaces/metamodel";

interface Props {
  children?: ReactNode;
}
const UserSetupContext = createContext<any>({});

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
  const [
    setupPreferences,
    { data: preferences_data, loading: loading_preferences },
  ] = useLazyQuery<GetPreferencesQuery>(GET_PREFERENCES);
  
  const [setupUser, { data: user_data, loading: loading_user }] = useLazyQuery<MeQuery>(ME);

  const [setupCountry] = useMutation<UpdateUserMutation, UpdateUserVariables>(UPDATE_USER);

  // Handle user data when loaded
  useEffect(() => {
    if (user_data?.me) {
      const user_data_me = user_data.me;
      // logger.info("User setup", user_data_me);
      if (user_data_me) {
        // logger.info("Setting user preferences");
        setupPreferences();
      }
      const user_analytics_data = {
        name: user_data_me.first_name,
        gender: user_data_me.gender,
        plan: user_data_me.plan,
        country: user_data_me.country,
      };
      mixpanel.identify(user_data_me.id);
      mixpanel.people.set(user_analytics_data);
      posthog.identify(user_data_me.id, user_analytics_data);
      if (user_data_me.country === null) {
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
          refetchQueries: [{ query: ME }],
        });
      } else {
        // This is an existing user, logging in
      }
    }
  }, [user_data, setupPreferences, mixpanel, posthog, signup_conversion, setupCountry]);

  useEffect(() => {
    if (user) {
      setupUser();
    }
  }, [user, setupUser]);

  return (
    <UserSetupContext.Provider
      value={{
        loading: loading_user || loading_preferences,
        user: user_data?.me || null,
        preferences: preferences_data?.getPreferences || {},
      }}
    >
      {children}
    </UserSetupContext.Provider>
  );
}

export function useUserContext(): {
  loading: boolean;
  user: User | null;
  preferences: Record<string, string | boolean | number>;
} {
  return useContext(UserSetupContext);
}

export function useCurrentUserPlan() {
  const { user } = useUserContext();
  return user?.plan || "free";
}
