
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { BADGE_CRITERIA } from "@/constants";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const techDescriptionMap: { [key: string]: string } = {
  javascript:
    "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
  typescript:
    "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
  react:
    "React is a popular library for building fast and modular user interfaces.",
  nextjs:
    "Next.js is a React framework for server-side rendering and building optimized web applications.",
  nodejs:
    "Node.js enables server-side JavaScript, allowing you to create fast, scalable network applications.",
  python:
    "Python is a versatile language known for readability and a vast ecosystem, often used for data science and automation.",
  java: "Java is an object-oriented language commonly used for enterprise applications and Android development.",
  cplusplus:
    "C++ is a high-performance language suitable for system software, game engines, and complex applications.",
  git: "Git is a version control system that tracks changes in source code during software development.",
  docker:
    "Docker is a container platform that simplifies application deployment and environment management.",
  mongodb:
    "MongoDB is a NoSQL database for handling large volumes of flexible, document-based data.",
  mysql:
    "MySQL is a popular relational database, known for reliability and ease of use.",
  postgresql:
    "PostgreSQL is a robust open-source relational database with advanced features and strong SQL compliance.",
  aws: "AWS is a comprehensive cloud platform offering a wide range of services for deployment, storage, and more.",
};

export const getTechDescription = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return techDescriptionMap[normalizedTechName]
    ? techDescriptionMap[normalizedTechName]
    : `${techName} is a technology or tool widely used in web development, providing valuable features and capabilities.`;
};
export function getDeviconClassName(techName: string) {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Dictionary mapping possible technology names to Devicon class names
  const techMap: { [key: string]: string } = {
    // JavaScript variations
    javascript: "devicon-javascript-plain",
    js: "devicon-javascript-plain",

    // TypeScript variations
    typescript: "devicon-typescript-plain",
    ts: "devicon-typescript-plain",

    // React variations
    react: "devicon-react-original",
    reactjs: "devicon-react-original",

    // Next.js variations
    nextjs: "devicon-nextjs-plain",
    next: "devicon-nextjs-plain",

    // Node.js variations
    nodejs: "devicon-nodejs-plain",
    node: "devicon-nodejs-plain",

    // Bun.js variations
    bun: "devicon-bun-plain",
    bunjs: "devicon-bun-plain",

    // Deno.js variations
    deno: "devicon-denojs-original",
    denojs: "devicon-denojs-plain",

    // Python variations
    python: "devicon-python-plain",

    // Java variations
    java: "devicon-java-plain",

    // C++ variations
    "c++": "devicon-cplusplus-plain",
    cpp: "devicon-cplusplus-plain",

    // C# variations
    "c#": "devicon-csharp-plain",
    csharp: "devicon-csharp-plain",

    // PHP variations
    php: "devicon-php-plain",

    // HTML variations
    html: "devicon-html5-plain",
    html5: "devicon-html5-plain",

    // CSS variations
    css: "devicon-css3-plain",
    css3: "devicon-css3-plain",

    // Git variations
    git: "devicon-git-plain",

    // Docker variations
    docker: "devicon-docker-plain",

    // MongoDB variations
    mongodb: "devicon-mongodb-plain",
    mongo: "devicon-mongodb-plain",

    // MySQL variations
    mysql: "devicon-mysql-plain",

    // PostgreSQL variations
    postgresql: "devicon-postgresql-plain",
    postgres: "devicon-postgresql-plain",

    // AWS variations
    aws: "devicon-amazonwebservices-original",
    "amazon web services": "devicon-amazonwebservices-original",

    // Tailwind CSS variations
    tailwind: "devicon-tailwindcss-original",
    tailwindcss: "devicon-tailwindcss-original",
  };

  return `${techMap[normalizedTech] || "devicon-devicon-plain"} colored`;
}

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

export const formatNumber = (number:number) =>{
  if(number >= 1000000){
    return (number/1000000).toFixed(1) + "M"
  }
  if(number >= 1000){
    return (number/1000).toFixed(1) + "K"
  }
  else{
    return number.toString();
  }
}

export function assignBadges(params:{
  criteria:{
    type: keyof typeof BADGE_CRITERIA;
    count:number;
  }[];
}){
  const badgeCounts:Badges = {
    GOLD:0,
    SILVER:0,
    BRONZE:0
  }
  const {criteria}=params;
  
  criteria.forEach((item)=>{
    const{type,count} = item;
    const badgeLevels = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level)=>{
      if(count >=badgeLevels[level as keyof typeof badgeLevels]){
        badgeCounts[level as keyof Badges] += 1;
      }
    });
  });

  return badgeCounts;
}
// optimized version 
// export function assignBadges(params: {
//   criteria: {
//     type: keyof typeof BADGE_CRITERIA;
//     count: number;
//   }[];
// }): Badges {
//   const badgeCounts: Badges = { GOLD: 0, SILVER: 0, BRONZE: 0 };

//   for (const { type, count } of params.criteria) {
//     const badgeLevels = BADGE_CRITERIA[type];

//     for (const level in badgeLevels) {
//       const levelKey = level as keyof Badges;
//       if (count >= badgeLevels[levelKey]) {
//         badgeCounts[levelKey]++;
//       }
//     }
//   }

//   return badgeCounts;
// }
