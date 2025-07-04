import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  titleStyles?:string;
  href?: string;
  textStyles: string;
  imgStyles?: string;
  isAuthor?: boolean;
}
const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  titleStyles,
  href,
  textStyles,
  imgStyles,
  isAuthor,
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`rounded-full object-contain ${imgStyles}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1
         ${isAuthor}:"max-sm:hidden":"" `}
        >
          {title ? <span
          className={cn(`small-regular line-clamp-1`,titleStyles)}
          >{title}</span>:null
          }
        </span>
      </p>
    </>
  );
  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
