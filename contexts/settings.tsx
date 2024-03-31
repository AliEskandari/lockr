import { ReactNode, createContext, useEffect, useReducer } from "react";

const SettingsContext = createContext<{
  settings: SettingsContextReducer.State;
  setSetting: (key: keyof SettingsContextReducer.State, value: any) => void;
}>({
  settings: {
    darkMode: false,
    useSystemDefault: false,
  },
  setSetting: () => {},
});

namespace SettingsContextReducer {
  export type State = {
    darkMode: boolean;
    useSystemDefault: boolean;
  };
  export type Action =
    | {
        type: "set-setting";
        payload: { key: keyof State; value: any };
      }
    | {
        type: "set-settings";
        payload: State;
      };
}

const initialState = (): SettingsContextReducer.State => {
  return {
    darkMode: false,
    useSystemDefault: false,
  };
};

const reducer = (
  state: SettingsContextReducer.State,
  action: SettingsContextReducer.Action
) => {
  switch (action.type) {
    case "set-setting":
      var newState = { ...state, [action.payload.key]: action.payload.value };
      localStorage.setItem("settings", JSON.stringify(newState));
      return newState;
    case "set-settings":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const toggleDarkMode = (state: boolean) => {
    document.documentElement.classList.toggle("dark", state);
    document.documentElement.classList.toggle("bg-gray-900", state);
  };

  /**
   * Loads settings from localStorage on load.
   */
  useEffect(() => {
    const cachedSettings = localStorage.getItem("settings");
    if (cachedSettings) {
      dispatch({
        type: "set-settings",
        payload: JSON.parse(cachedSettings),
      });
    }
  }, []);
  /**
   * Track system dark mode changes and updates settings dark mode
   */
  useEffect(() => {
    const mediaQueryLists = {
      dark: window.matchMedia("(prefers-color-scheme: dark)"),
      light: window.matchMedia("(prefers-color-scheme: light)"),
    };
    const lightToggle = (event: MediaQueryListEvent) => {
      dispatch({
        type: "set-setting",
        payload: { key: "darkMode", value: !event.matches },
      });
    };

    const darkToggle = (event: MediaQueryListEvent) => {
      dispatch({
        type: "set-setting",
        payload: { key: "darkMode", value: event.matches },
      });
    };

    if (state.useSystemDefault) {
      const prefersDark = mediaQueryLists.dark.matches;
      const prefersLight = mediaQueryLists.light.matches;
      const noPreference = window.matchMedia(
        "(prefers-color-scheme: no-preference)"
      ).matches;
      const hasNoSupport = !prefersDark && !prefersLight && !noPreference;

      mediaQueryLists.dark.addEventListener("change", darkToggle);
      mediaQueryLists.light.addEventListener("change", lightToggle);

      if (prefersDark) {
        dispatch({
          type: "set-setting",
          payload: { key: "darkMode", value: true },
        });
      }
      if (prefersLight) {
        dispatch({
          type: "set-setting",
          payload: { key: "darkMode", value: false },
        });
      }
      if (noPreference || hasNoSupport) {
        dispatch({
          type: "set-setting",
          payload: { key: "darkMode", value: true },
        });
      }
    }
    return () => {
      mediaQueryLists.dark.removeEventListener("change", darkToggle);
      mediaQueryLists.light.removeEventListener("change", lightToggle);
    };
  }, [state.useSystemDefault]);

  /**
   * Adds and removes "dark" class from body tag.
   */
  useEffect(() => {
    toggleDarkMode(state.darkMode);
  }, [state.darkMode]);

  return (
    <SettingsContext.Provider
      value={{
        settings: state,
        setSetting: (key, value) =>
          dispatch({ type: "set-setting", payload: { key, value } }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsContext;
