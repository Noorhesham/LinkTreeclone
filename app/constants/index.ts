export const socialMediaPlatforms = [
  "Facebook",
  "Twitter",
  "Instagram",
  "LinkedIn",
  "Snapchat",
  "TikTok",
  "Youtube",
  "Whatsapp",
  "Pinterest",
  "Telegram",
  "Threads",
  "Reddit",
  "Github",
  "Custom_Link",
];
interface CoverImage {
  secure_url: string;
  public_id: string;
}
interface ButtonStyles {
  color: string | undefined;
  border: number | undefined;
}
export interface UserProps {
  firstName?: string;
  lastName?: string;
  email: string;
  bio?: string;
  photo?: string;
  isImg: boolean;
  coverImage?: CoverImage;
  coverColor?: string;
  clerkUserId: string;
  createdAt: Date;
  font: string;
  links?: any; // Assuming ILink is the interface for Link model
  userName: string;
  theme: string;
  buttons?: ButtonStyles;
  active: boolean;
  cart?: any[]; // Assuming IProduct is the interface for Product model
}
