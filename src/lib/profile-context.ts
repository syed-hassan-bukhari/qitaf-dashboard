"use client";

import { createContext, useContext } from "react";
import type { Profile } from "./types";

export const ProfileContext = createContext<Profile | null>(null);
export const useProfile = () => useContext(ProfileContext)!;
