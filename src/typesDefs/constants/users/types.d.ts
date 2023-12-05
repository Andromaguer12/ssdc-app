export interface UserInterface {
    name: string;
    email: string;
    phone: string;
    rank: "A" | "B" | "C";
    uid?: string;
}
