export interface Medicine {

    MedicineId?: number;
    
    MedicineName: string;
    
    Brand: string;
    
    Category: string;
    
    Description: string;
    
    Quantity: number;
    
    Unit: string;
    
    PricePerUnit: number;
    
    Image: string;
    
    UserId: number;

    RequestCount?: number;
    
}