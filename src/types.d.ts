type Rank = "A" | "B" | "C"

interface UserInitialState {
    id: string,
    name: string,
    email: string,
    phone: string,
    rank: Rank
}

interface TournamentInitialState {
    name: string,
    rules: string,
}