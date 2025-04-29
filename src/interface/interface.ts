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
  id: string;
  title: string;
  description: string;
  image: string;
  isPublish: boolean;
  position: number;
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
  question: string;
  answer: string;
  isVisible: boolean;
  position:number
}

export interface IFaq {
  id?: string;
  title:string
  sub_title:string
  faqs: faqitem[]
  type: "main" |"shorts" | "talking" | "podcast" | "graphic" | "advertising" | "website" ;  
}
