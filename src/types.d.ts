type Rank = "A" | "B" | "C"

interface UserInitialState {
    name: string,
    email: string,
    phone: string,
    rank: Rank
}