"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LetterAvatar from "@/components/shared/LetterAvatar";
import { getDisplayName, getSession } from "@/lib/auth-session";
import { roleLabel } from "@/types/enums";
import type { AuthSession } from "@/types/auth";

const ProfileBox = () => {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const displayName = session ? getDisplayName(session.user) : "Admin";
  const displayEmail = session?.user.email ?? "";
  const displayRole = roleLabel(session?.user.role?.name) || "Admin";

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src="/images/cover/cover-01.png"
          alt="profile cover"
          className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
          width={970}
          height={260}
          style={{
            width: "auto",
            height: "auto",
          }}
        />
      </div>
      <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white p-1 shadow-1 dark:bg-gray-dark sm:h-44 sm:max-w-[176px] sm:p-3">
          <LetterAvatar name={displayName} size="lg" />
        </div>
        <div className="mt-4">
          <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
            {displayName}
          </h3>
          <p className="font-medium">{displayRole}</p>
          <div className="mx-auto mt-4 max-w-[720px]">
            <h4 className="font-medium text-dark dark:text-white">
              {displayEmail || "—"}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
