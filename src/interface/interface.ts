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

export interface IService {
  title: string;
  description: string;
  image: string;
  isPublish: string;
  href: string;
  position: number;
  is_active: boolean;
}


export interface IPackage {
  id?: number;
  is_visible:boolean;
  name: "Basic" | "Standard" | "Premium";
  title:string;
  description:string;
  currency:string;
  price: number;
  unit:string;
  features: IFeature[];
  note:string
  purchase_link:string
  pricing_type:'single'|"combo"
  type: "main" |"shorts" | "talking" | "podcast" | "graphic" | "advertising" | "website" ;

}
export interface IFeature{
  id:string
  feature:string
  is_present:boolean
  is_active:boolean
  position:number
}

export interface faqitem {

    id?:string
    faq_id:string
    question: string;
    answer: string;
    is_visible: boolean;
    position:number
  }
  

export interface IFaq {
  id?: string;
  title:string
  sub_title:string
  is_visible:boolean
  faqs: faqitem[]
  type: "main" |"shorts" | "talking" | "podcast" | "graphic" | "advertising" | "website" ; 
}


export interface MemberProfile {
  id?:string
  name: string;
  role: "Team Member" | "Influencer";
  designation?: string; // for Team Member
  username?: string; // for Influencer
  photourl: string;
  bio?: string;
  location?: string;
  email?: string;
  phone?: string;

  // Influencer specific
  niche?: string;
  followers?: number;
  platforms?: string[]; // ["Instagram", "YouTube"]
  collaborationtype?: string[]; // ["Paid Promotion", "Affiliate Marketing"]
  engagementrate?: number;
  portfoliolinks?: string[];

  // Team Member specific
  skills?: string[];

  // Common social links
  sociallinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
}


