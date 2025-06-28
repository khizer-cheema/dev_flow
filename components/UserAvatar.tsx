import * as Avatar from "@radix-ui/react-avatar";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";

interface Props {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
}

const UserAvatar = ({ id, name, imageUrl}: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar.Root>
      <Avatar.Image className="object-cover h-11 w-11 rounded-full">
          
            src={imageUrl}
            alt={name}
            width={36}
            height={36}
            quality={100}
          
          </Avatar.Image>
          <Avatar.Fallback className="primary-gradient font-space-grotesk font-bold tracking-wider text-white h-31 w-31 rounded-full">
            {initials}
          </Avatar.Fallback>
      
      </Avatar.Root>
    </Link>
  );
};

export default UserAvatar;