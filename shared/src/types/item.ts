// shared/types/item.ts

export interface Item {
    // required
    itemSKU?: string;
    itemName: string;
    itemDescription?: string;
    itemCategory?: string | { id: string; name: string };
    costPrice: number;
    unitPrice?: number;
    quantity?: number;
    itemType:string;

    // optional
    style?: string;
    storeCode?: string;
    size?: string;
    vendor?: string;
    eglId?: string;
    location?: string;
    customText1?: string;
    customText2?: string;
    customText3?: string;
    customFloat?: number;

    metal?: string;
    department?: string;
    itemCode?: string;
    vendorStyle?: string;
    agsId?: string;
    giaId?: string;

    barcode?: string;
    imageUrl?: string;
    isArchived?: boolean;
    isSold?: boolean;

    // API conveniences
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
