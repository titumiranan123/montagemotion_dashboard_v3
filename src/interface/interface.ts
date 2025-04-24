export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface IHeader {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  video_link: string;
  isActive?: string;
  type:
    | "main"
    | "shorts"
    | "talking"
    | "podcast"
    | "graphic"
    | "advertising"
    | "website";
}
