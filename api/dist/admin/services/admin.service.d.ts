export declare type Admin = any;
export declare class AdminService {
    private readonly users;
    findOne(email: string): Promise<Admin | undefined>;
}
