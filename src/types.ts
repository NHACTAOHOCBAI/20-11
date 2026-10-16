export type SpinStatus = 'pending' | 'in_progress' | 'completed'
export type GameId = 'wheel' | 'cards' | 'piggy'

export type Prize = {
  id: string
  label: string
  value: number
  color: string
  weight: number
}

export type SpinEntry = {
  id: string
  participant_name: string
  bank_name: string
  account_number: string
  status: SpinStatus
  prize_id: string | null
  prize_label: string | null
  prize_value: number | null
  client_session_id: string
}

export type PlayerDetails = Pick<SpinEntry, 'participant_name' | 'bank_name' | 'account_number'>

export type MemoryCard = {
  id: string
  pairId: string
  icon: string
}

export type MemoryReward = {
  pairNumber: number
  cardsRemaining: number
  value: number
}

export type MemoryGameState = {
  deck: MemoryCard[]
  flippedCardIds: string[]
  matchedPairIds: string[]
  wrongAttempts: number
  rewards: MemoryReward[]
  finished: boolean
}

export type MemoryGameResult = {
  pairsMatched: number
  wrongAttempts: number
  rewards: MemoryReward[]
  consolationValue: number
}

export type GameResult = {
  gameId: GameId
  gameName: string
  prize: Prize
  memory?: MemoryGameResult
}
export type GameProgress = { currentGame: GameId; results: GameResult[] }
