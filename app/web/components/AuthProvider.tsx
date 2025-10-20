"use client";

import { ReactNode } from "react";

/**
 * 一時的な AuthProvider の差し替え
 * - 元の MSAL ベースの実装を使わず、子要素をそのまま返します
 * - これにより既存のラッパー構造を壊さずに認証を無効化できます
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
