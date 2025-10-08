export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    employeeStartDate: Date;
    contactNumber?: string;
    status?: "active" | "inactive";
    isAdmin?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
