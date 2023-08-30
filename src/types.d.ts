
interface TournamentInitialState {
    name: string,
    rules: string,
}
enum Rank {
    A = "A",
    B = "B",
    C = "C"
}

export interface UserInterface {
    name: string;
    email: string;
    phone: string;
    rank: "A" | "B" | "C";
    uid: string;
}