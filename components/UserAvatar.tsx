import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";

interface Props {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className = "h-9 w-9",
  fallbackClassName,
}: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(id)}>
<<<<<<< HEAD
      <Avatar className={cn("relative", className)}>
        {imageUrl ? (
          <Image
            src={imageUrl}
=======
      <Avatar.Root className={cn("relative", className)}>
        {imageUrl? (
          <Avatar.Image>
          src={imageUrl}
>>>>>>> 1b3cefc746cb434c2343e5c20eb7a2743130b822
            alt={name}
            className="object-cover"
            fill
            quality={100}
<<<<<<< HEAD
          />
        ) : (
          <AvatarFallback
            className={cn(
              "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
              fallbackClassName
            )}
          >
=======
            className = {"object-cover"}
            fill
            quality={100}
          </Avatar.Image>
        ):null}
      
          <Avatar.Fallback className={cn(
            "primary-gradient font-space-grotesk font-bold tracking-wide text-white",fallbackClassname
          )}>
>>>>>>> 1b3cefc746cb434c2343e5c20eb7a2743130b822
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;