"use client";

import { ErrorMessages } from "@/types/errors";
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

const SET_SLUG = "SET_SLUG";

interface SlugState {
  slug: string | null;
}

type SlugAction = { type: typeof SET_SLUG; payload: string };

const slugReducer = (state: SlugState, action: SlugAction): SlugState => {
  switch (action.type) {
    case SET_SLUG:
      return { ...state, slug: action.payload };

    default:
      return state;
  }
};

const initialState: SlugState = {
  slug: null,
};

const SlugContext = createContext<
  { state: SlugState; dispatch: Dispatch<SlugAction> } | undefined
>(undefined);

export const SlugProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(slugReducer, initialState);

  return (
    <SlugContext.Provider value={{ state, dispatch }}>
      {children}
    </SlugContext.Provider>
  );
};

export const useSlugContext = () => {
  const context = useContext(SlugContext);
  if (!context) {
    throw new Error(ErrorMessages.CONTEXT_SLUG_PROVER);
  }
  return context;
};

export { SET_SLUG };
