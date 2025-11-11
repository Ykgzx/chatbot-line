"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import Image from "next/image"; // ✅ ใช้ next/image แทน <img>

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
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

    if (!liffId) {
      // ✅ ใช้ setTimeout เพื่อหลีกเลี่ยงการเรียก setState ระหว่าง render
      setTimeout(() => {
        setError("LIFF ID not found");
      }, 0);
      return;
    }

    const initLiff = async () => {
      try {
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const userProfile = await liff.getProfile();
        const formattedProfile: LiffProfile = {
          userId: userProfile.userId,
          displayName: userProfile.displayName,
          pictureUrl: userProfile.pictureUrl,
          statusMessage: userProfile.statusMessage,
        };
        setProfile(formattedProfile);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown LIFF error occurred";
        setError(message);
      }
    };

    initLiff();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {/* <h1 className="text-2xl font-bold mb-4">LINE LIFF + Next.js + .env</h1> */}

      {error && <p className="text-red-500">{error}</p>}

      {profile ? (
        <div className="flex flex-col items-center space-y-2">
          {profile.pictureUrl && (
            <Image
              src={profile.pictureUrl}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full border"
              priority
            />
          )}
          <h2 className="text-xl">{profile.displayName}</h2>
          {/* <p className="text-sm text-gray-500">{profile.userId}</p> */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </main>
  );
}
