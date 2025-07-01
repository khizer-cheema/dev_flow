import * as Avatar from "@radix-ui/react-avatar";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassname?:string
}

const UserAvatar = ({ 
  id, 
  name, 
  imageUrl,
  className = "h-9 w-9",
  fallbackClassname}: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar.Root>
        {imageUrl? (
          <Avatar.Image>
          src={imageUrl}
            alt={name}
            width={36}
            height={36}
            quality={100}
            className = {cn("object-cover",className)}
          </Avatar.Image>
        ):null}
      
          <Avatar.Fallback className={cn(
            "primary-gradient font-space-grotesk font-bold tracking-wide text-white",fallbackClassname
          )}>
            {initials}
          </Avatar.Fallback>
      
      </Avatar.Root>
    </Link>
  );
};

export default UserAvatar;