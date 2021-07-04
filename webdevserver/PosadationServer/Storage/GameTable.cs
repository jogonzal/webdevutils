using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using WebDevServer.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebDevServer.Storage
{
	public class User
	{
		public string Id { get; set; }
		public string Name { get; set; }
		public string Color { get; set; }
		public int InitialX { get; set; }
		public int InitialY { get; set; }
	}

	public class GameTableEntity : TableEntity
	{
		public GameTableEntity(string gameId)
		{
			this.PartitionKey = gameId;
			this.RowKey = gameId;
		}

		public GameTableEntity() {
			// For serialization
		}

		public string LeaderUserId { get; set; }
		public string UsersArray { get; set; }
		public bool GameEnded { get; set; }
		public bool GameStarted { get; set; }
	}

	public static class GameTable
	{
		public static Dictionary<string, string> Colors = new Dictionary<string, string>() {
			{"red", "red" },
			{"blue", "blue" },
			{"green", "green" },
			{"purple", "purple" },
			{"black", "black" },
			{"cyan", "cyan" },
			{"brown", "brown" },
		};

		public static string ConnectionString { get; set; }

		public static Lazy<CloudTable> getTableClient = new Lazy<CloudTable>(() =>
		{
			// Parse the connection string and return a reference to the storage account.
			CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);
			// Create the table client.
			CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
			CloudTable table = tableClient.GetTableReference("GameTable");
			// Create the table if it doesn't exist.
			table.CreateIfNotExists();
			return table;
		});

		private static CloudTable GetTableClient()
		{
			return getTableClient.Value;
		}


		public static GameTableEntity GetGameObject(string gameId)
		{
			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return null;
			}

			// Retrieve a reference to the table.
			CloudTable table = GetTableClient();

			TableOperation retrieve = TableOperation.Retrieve<GameTableEntity>(gameId, gameId);

			TableResult result = table.Execute(retrieve);

			if (result.HttpStatusCode == 404)
			{
				return null;
			}

			if (result.HttpStatusCode != 200)
			{
				throw new Exception(JsonConvert.SerializeObject(result));
			}

			return result.Result as GameTableEntity;
		}

		internal static async Task RemoveUserFromGame(string userId, GameTableEntity entity)
		{
			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return;
			}

			try
			{
				// edit the entity
				List<User> users = JsonConvert.DeserializeObject<List<User>>(entity.UsersArray);
				if (!users.Any(u => u.Id == userId) && entity.LeaderUserId != userId)
				{
					return;
				}
				var userToRemove = users.SingleOrDefault(u => u.Id == userId);
				users.Remove(userToRemove);
				entity.UsersArray = JsonConvert.SerializeObject(users);
				if (entity.LeaderUserId == userId)
				{
					entity.LeaderUserId = users.Count > 0 ? users[0].Id : "";
				}

				// Retrieve a reference to the table.
				var table = GetTableClient();

				// Create the TableOperation object that updates the entity
				var result = await table.ExecuteAsync(TableOperation.Replace(entity));

				if (result.HttpStatusCode != 204)
				{
					throw new Exception(JsonConvert.SerializeObject(result));
				}
			}
			catch (Exception error)
			{
				Log.Logger.LogInformation($"Ran into an error when updating history table {error.ToString()}");
				throw;
			}
		}

		public static string GetRandomColor(List<User> users = null)
		{
			if (users == null)
			{
				int randomIndex2 = new Random().Next(0, Colors.Count - 1);
				return Colors[Colors.Keys.ToArray()[randomIndex2]];
			}

			var colors = Colors.Keys.ToArray().Where(c => !users.Any(u => u.Color == c)).ToList();
			if (colors.Count == 0)
			{
				colors = Colors.Keys.ToList();
			}
			int randomIndex = new Random().Next(0, colors.Count - 1);
			return Colors[colors[randomIndex]];
		}

		public static int GetRandomNum(int max)
		{
			return new Random().Next(0, max);
		}

		public static int IconSize = 24;
		public static int MaxXPosition = 600 - IconSize;
		public static int MaxYPosition = 500 - IconSize;

		public static async Task<GameTableEntity> CreateGame(string gameId, string leaderId, string leaderName)
		{
			// Create a new entity.
			GameTableEntity entry = new GameTableEntity(gameId)
			{
				LeaderUserId = leaderId,
				UsersArray = JsonConvert.SerializeObject(new List<User>()
				{
					new User()
					{
						Id=leaderId,
						Name=leaderName,
						Color=GetRandomColor(),
						InitialX= GetRandomNum(MaxXPosition),
						InitialY= GetRandomNum(MaxYPosition),
					},
				}),
			};

			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return entry;
			}

			try
			{
				// Retrieve a reference to the table.
				var table = GetTableClient();

				// Create the TableOperation object that inserts the entity
				await table.ExecuteAsync(TableOperation.Insert(entry));
				return entry;
			}
			catch (Exception error)
			{
				Log.Logger.LogInformation($"Ran into an error when updating history table {error.ToString()}");
				throw;
			}
		}

		public static async Task AddUserToGame(string userId, string userName, GameTableEntity entity)
		{
			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return;
			}

			try
			{
				// edit the entity
				List<User> users = JsonConvert.DeserializeObject<List<User>>(entity.UsersArray);
				if (users.Any(u => u.Id == userId) && !string.IsNullOrEmpty(entity.LeaderUserId))
				{
					// No leader update and this user is gone already
					return;
				}

				users.Add(new User()
				{
					Id = userId,
					Name = userName,
					Color = GetRandomColor(users),
					InitialX = GetRandomNum(MaxXPosition),
					InitialY = GetRandomNum(MaxYPosition),
				});

				users = users.Distinct().ToList();
				entity.UsersArray = JsonConvert.SerializeObject(users);
				if (string.IsNullOrEmpty(entity.LeaderUserId))
				{
					entity.LeaderUserId = users[0].Id;
				}

				// Retrieve a reference to the table.
				var table = GetTableClient();

				// Create the TableOperation object that updates the entity
				var result = await table.ExecuteAsync(TableOperation.Replace(entity));

				if (result.HttpStatusCode != 204)
				{
					throw new Exception(JsonConvert.SerializeObject(result));
				}
			}
			catch (Exception error)
			{
				Log.Logger.LogInformation($"Ran into an error when updating history table {error.ToString()}");
				throw;
			}
		}

		public static async Task EndGame(GameTableEntity entity)
		{
			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return;
			}

			try
			{
				// edit the entity
				if (entity.GameEnded)
				{
					return;
				}
				entity.GameEnded = true;

				// Retrieve a reference to the table.
				var table = GetTableClient();

				// Create the TableOperation object that updates the entity
				var result = await table.ExecuteAsync(TableOperation.Replace(entity));

				if (result.HttpStatusCode != 204)
				{
					throw new Exception(JsonConvert.SerializeObject(result));
				}
			}
			catch (Exception error)
			{
				Log.Logger.LogInformation($"Ran into an error when updating history table {error.ToString()}");
				throw;
			}
		}

		public static async Task StartGame(GameTableEntity entity)
		{
			if (String.IsNullOrWhiteSpace(ConnectionString) || ConnectionString == "DONOTINPUTSECRETSHERE")
			{
				// Ignore if no connection string is configured
				return;
			}

			try
			{
				// edit the entity
				if (entity.GameStarted)
				{
					return;
				}
				entity.GameStarted = true;

				// Retrieve a reference to the table.
				var table = GetTableClient();

				// Create the TableOperation object that updates the entity
				var result = await table.ExecuteAsync(TableOperation.Replace(entity));

				if (result.HttpStatusCode != 204)
				{
					throw new Exception(JsonConvert.SerializeObject(result));
				}
			}
			catch (Exception error)
			{
				Log.Logger.LogInformation($"Ran into an error when updating history table {error.ToString()}");
				throw;
			}
		}
	}
}
