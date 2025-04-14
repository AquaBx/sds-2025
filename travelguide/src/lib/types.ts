export type Picture = {
  url: string;
};

export type Place = {
    name: string;
    location: string; 
    address: string;     
    tags: string[];
    score: number;    
    disableAccessibility: boolean;
    estimatedDuration: number; 
    openingTime: string;    
    closingTime: string;    
    price: number;            
    currency: string;        
    theme: string;            
    description: string;
    picture: Picture[];
  };
  