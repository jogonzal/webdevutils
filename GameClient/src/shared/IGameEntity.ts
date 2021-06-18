interface IGameTableEntity {
  PartitionKey: string
  RowKey: string
  LeaderUserId: string
  UsersArray: string
  GameEnded: boolean
  GameStarted: boolean
}
