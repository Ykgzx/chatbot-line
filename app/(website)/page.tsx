"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export default function HomePage() {
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID; // ✅ ดึงจาก .env
    if (!liffId) {
      setError("LIFF ID not found");
      return;
    }

    const initLiff = async () => {
      try {
        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    initLiff();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">LINE LIFF + Next.js + .env</h1>

      {error && <p className="text-red-500">{error}</p>}

      {profile ? (
        <div className="flex flex-col items-center space-y-2">
          {profile.pictureUrl && (
            <img
              src={profile.pictureUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full border"
            />
          )}
          <h2 className="text-xl">{profile.displayName}</h2>
          <p className="text-sm text-gray-500">{profile.userId}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </main>
  );
}
